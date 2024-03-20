import { Pokemon, PokemonSpecies } from "@/entities/pokemon";
import { getPokemonEvolutionChain } from "@/features/get-pokemon-evolution-chain";
import { fetchPokemonsData } from "@/features/get-pokemons-species";
import { usePokemonListStore } from "@/store/pokemon-list-store";

export function usePokemonList() {
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
  } = usePokemonListStore();

  const newPokemonList = (list: Pokemon[], initialSize: number) => {
    setPokemonNames(list);
    fetchPokemonsData(list.slice(0, initialSize)).then(
      (data: PokemonSpecies[]) => {
        setInitialPokemonList(data);
        setFilteredPokemonList(data);
        setDisplayPokemonList(data);
        setGenerationList(
          newFilterOptions(data.map((pokemon) => pokemon.generation))
        );
        setTypeList(
          newFilterOptions(data.map((pokemon) => pokemon.types).flat())
        );
      }
    );
  };

  const filterByPokemonName = (name: string) => {
    if (!name) {
      setFilteredPokemonList(initialPokemonList);
      setDisplayPokemonList(initialPokemonList);
      return;
    }

    const pokemonFound = pokemonNames.find((pokemon) =>
      pokemon.name.includes(name)
    );

    if (!pokemonFound) {
      setFilteredPokemonList([] as PokemonSpecies[]);
      setDisplayPokemonList([] as PokemonSpecies[]);
      return;
    }

    getPokemonEvolutionChain(pokemonFound.name).then((data) => {
      setFilteredPokemonList(data);
      setDisplayPokemonList(data);
    });
  };

  const filterByGeneration = (generation: string) => {
    if (!generation || generation === "-") {
      setDisplayPokemonList(filteredPokemonList);
      return;
    }

    setDisplayPokemonList(
      filteredPokemonList.filter((pokemon) => pokemon.generation === generation)
    );
  };

  const filterByType = (type: string) => {
    if (!type || type === "-") {
      setDisplayPokemonList(filteredPokemonList);
      return;
    }

    setDisplayPokemonList(
      filteredPokemonList.filter((pokemon) => pokemon.types.includes(type))
    );
  };

  const resetFilteredList = () => {
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
  };

  const resetDisplayPokemonList = () => {
    setDisplayPokemonList(filteredPokemonList);
  };

  const resetFilterOptions = () => {
    setGenerationList(
      newFilterOptions(filteredPokemonList.map((pokemon) => pokemon.generation))
    );

    setTypeList(
      newFilterOptions(
        filteredPokemonList.map((pokemon) => pokemon.types).flat()
      )
    );
  };

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
  };
}

const newFilterOptions = (options: string[]) => {
  return ["-"].concat(Array.from(new Set(options)));
};
