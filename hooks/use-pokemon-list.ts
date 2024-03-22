import _debounce from "lodash/debounce";
import { Pokemon, PokemonSpecies } from "@/entities/pokemon";
import { getPokemonEvolutionChain } from "@/features/get-pokemon-evolution-chain";
import { usePokemonListStore } from "@/store/pokemon-list-store";
import { ChangeEvent, useCallback, useEffect } from "react";
import { listPokemonData } from "@/features/get-pokemons-species";
import { set } from "lodash";

export function usePokemonList({
  list,
  initialListSize,
}: {
  list: Pokemon[];
  initialListSize: number;
}) {
  const {
    pokemonNames,
    initialPokemonList,
    setInitialPokemonList,
    displayPokemonList,
    setDisplayPokemonList,
    filteredPokemonList,
    setFilteredPokemonList,
    setGenerationFilter,
    setGenerationList,
    setPokemonNames,
    setTypeFilter,
    setTypeList,
    generationFilter,
    generationList,
    typeFilter,
    typeList,
    searchTerm,
    setSearchTerm,
    setError,
    error,
  } = usePokemonListStore();

  const newPokemonList = useCallback(
    async (list: Pokemon[]) => {
      setPokemonNames(list);

      const [error, result] = await listPokemonData(
        list.slice(0, initialListSize)
      );
      if (error.hasError) {
        setError(error);
        return;
      }

      const { data } = result;

      setInitialPokemonList(data!);
      setFilteredPokemonList(data!);
      setDisplayPokemonList(data!);
      setGenerationList(
        newFilterOptions(data!.map((pokemon) => pokemon.generation))
      );
      setTypeList(
        newFilterOptions(data!.map((pokemon) => pokemon.types).flat())
      );
    },
    [
      setPokemonNames,
      setInitialPokemonList,
      setFilteredPokemonList,
      setDisplayPokemonList,
      setGenerationList,
      setTypeList,
      initialListSize,
      setError,
    ]
  );

  const restartList = useCallback(async () => {
    setError({ hasError: false });
    setSearchTerm("");
  }, []);

  const filterByPokemonName = useCallback(
    async (name: string) => {
      if (!name) {
        setFilteredPokemonList(initialPokemonList);
        setDisplayPokemonList(initialPokemonList);
        return;
      }

      const pokemonFound = pokemonNames.find((pokemon) =>
        pokemon.name.includes(name)
      );

      if (!pokemonFound) {
        setError({ hasError: true, code: 404 });
        setFilteredPokemonList([] as PokemonSpecies[]);
        setDisplayPokemonList([] as PokemonSpecies[]);
        return;
      }

      const [error, result] = await getPokemonEvolutionChain(pokemonFound.name);
      if (error.hasError) {
        setError(error);
        return;
      }

      setFilteredPokemonList(result.data!);
      setDisplayPokemonList(result.data!);
    },
    [
      initialPokemonList,
      pokemonNames,
      setDisplayPokemonList,
      setFilteredPokemonList,
      setError,
    ]
  );

  const filterByGeneration = useCallback(
    (generation: string) => {
      if (!generation || generation === "-") {
        setDisplayPokemonList(filteredPokemonList);
        return;
      }

      setDisplayPokemonList(
        filteredPokemonList.filter(
          (pokemon) => pokemon.generation === generation
        )
      );
    },
    [filteredPokemonList, setDisplayPokemonList]
  );

  const filterByType = useCallback(
    (type: string) => {
      if (!type || type === "-") {
        setDisplayPokemonList(filteredPokemonList);
        return;
      }

      setDisplayPokemonList(
        filteredPokemonList.filter((pokemon) => pokemon.types.includes(type))
      );
    },
    [filteredPokemonList, setDisplayPokemonList]
  );

  const resetFilteredList = useCallback(() => {
    setFilteredPokemonList(initialPokemonList);
    setDisplayPokemonList(initialPokemonList);

    setGenerationList(
      newFilterOptions(initialPokemonList.map((pokemon) => pokemon.generation))
    );

    setTypeList(
      newFilterOptions(
        initialPokemonList.map((pokemon) => pokemon.types).flat()
      )
    );
  }, [
    initialPokemonList,
    setDisplayPokemonList,
    setFilteredPokemonList,
    setGenerationList,
    setTypeList,
  ]);

  const handleSearchTermChange = (term: string) => {
    setError({ hasError: false });
    setSearchTerm(term.toLocaleLowerCase());
  };

  const handleGenerationFilterChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setGenerationFilter(event.target.value);
  };

  const handleTypeFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(event.target.value);
  };

  const resetFilterOptions = useCallback(() => {
    setGenerationList(
      newFilterOptions(filteredPokemonList.map((pokemon) => pokemon.generation))
    );

    setTypeList(
      newFilterOptions(
        filteredPokemonList.map((pokemon) => pokemon.types).flat()
      )
    );
  }, [filteredPokemonList, setGenerationList, setTypeList]);

  useEffect(() => {
    newPokemonList(list);
  }, [list, newPokemonList, initialListSize]);

  useEffect(() => {
    if (searchTerm.length === 0) {
      resetFilteredList();
      return;
    }

    const debounced = _debounce(() => {
      filterByPokemonName(searchTerm);
    }, 500);
    debounced();
    return debounced.cancel;
  }, [searchTerm, filterByPokemonName, resetFilteredList]);

  useEffect(() => {
    resetFilterOptions();
  }, [displayPokemonList, resetFilterOptions]);

  useEffect(() => {
    filterByGeneration(generationFilter);
  }, [generationFilter, filterByGeneration]);

  useEffect(() => {
    filterByType(typeFilter);
  }, [typeFilter, filterByType]);

  return {
    newPokemonList,
    filteredPokemonList,
    filterByPokemonName,
    filterByGeneration,
    filterByType,
    resetFilteredList,
    resetFilterOptions,
    generationFilter,
    setGenerationFilter,
    generationList,
    typeFilter,
    setTypeFilter,
    typeList,
    displayPokemonList,
    searchTerm,
    handleSearchTermChange,
    handleGenerationFilterChange,
    handleTypeFilterChange,
    error,
    restartList,
  };
}

const newFilterOptions = (options: string[]) => {
  return ["-"].concat(Array.from(new Set(options)));
};
