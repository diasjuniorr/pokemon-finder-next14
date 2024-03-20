import { Pokemon, PokemonSpecies } from "@/entities/pokemon";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export type TPokemonListState = {
  pokemonNames: Pokemon[];
  initialPokemonList: PokemonSpecies[];
  filteredPokemonList: PokemonSpecies[];
  displayPokemonList: PokemonSpecies[];
  searchTerm: string;
  typeList: string[];
  generationList: string[];
  typeFilter: string;
  generationFilter: string;
};

export type TPokemonListActions = {
  setPokemonNames: (list: Pokemon[]) => void;
  setInitialPokemonList: (list: PokemonSpecies[]) => void;
  setFilteredPokemonList: (list: PokemonSpecies[]) => void;
  setDisplayPokemonList: (list: PokemonSpecies[]) => void;
  setTypeList: (list: string[]) => void;
  setGenerationList: (list: string[]) => void;
  setTypeFilter: (type: string) => void;
  setGenerationFilter: (generation: string) => void;
  setSearchTerm: (term: string) => void;
};

export const usePokemonListStore = create<
  TPokemonListState & TPokemonListActions
>()(
  devtools(
    persist(
      (set) => ({
        pokemonNames: [] as Pokemon[],
        initialPokemonList: [] as PokemonSpecies[],
        displayPokemonList: [] as PokemonSpecies[],
        searchTerm: "",
        setSearchTerm(term) {
          set({ searchTerm: term });
        },
        setDisplayPokemonList(list) {
          set({ displayPokemonList: list });
        },
        setInitialPokemonList(list) {
          set({ initialPokemonList: list });
        },
        initialFilteredPokemonList: [] as PokemonSpecies[],
        filteredPokemonList: [] as PokemonSpecies[],
        typeList: [] as string[],
        generationList: [] as string[],
        typeFilter: "",
        generationFilter: "",
        setPokemonNames: (list) => set({ pokemonNames: list }),
        setFilteredPokemonList: (list) => set({ filteredPokemonList: list }),
        setTypeList: (list) => set({ typeList: list }),
        setGenerationList: (list) => set({ generationList: list }),
        setTypeFilter: (type) => set({ typeFilter: type }),
        setGenerationFilter: (generation) =>
          set({ generationFilter: generation }),
      }),
      {
        name: "pokemon-list-store",
      }
    )
  )
);
