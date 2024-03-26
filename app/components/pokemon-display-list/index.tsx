"use client";
import _debounce from "lodash/debounce";
import { Pokemon } from "@/entities/pokemon";
import { SkeletonCard } from "../skeleton-card";
import { usePokemonList } from "@/hooks/use-pokemon-list";
import { PokemonCard } from "../pokemon-card";
import { PokemonSearchBar } from "../pokemon-search-bar";
import { ErrorPage } from "@/shared/components/error-page";
import { PokemonNotFound } from "@/app/pokemon/[name]/components/pokemon-not-found";

const PokemonDisplayList = ({ list }: { list: Pokemon[] }) => {
  const {
    typeFilter,
    typeList,
    generationFilter,
    generationList,
    displayPokemonList,
    searchTerm,
    handleSearchTermChange,
    handleGenerationFilterChange,
    handleTypeFilterChange,
    error,
    restartList,
  } = usePokemonList({ list, initialListSize: 30 });

  if (error.hasError && error.code !== 404) {
    return <ErrorPage callback={() => restartList} />;
  }

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className=" mx-auto px-10 w-[836px]">
        <h1 className="text-2xl font-bold mb-4 pt-6">Pokemon Finder</h1>
        <PokemonSearchBar
          searchTerm={searchTerm}
          handleSearchTermChange={handleSearchTermChange}
          generationFilter={generationFilter}
          generationList={generationList}
          handleGenerationFilterChange={handleGenerationFilterChange}
          handleTypeFilterChange={handleTypeFilterChange}
          typeFilter={typeFilter}
          typeList={typeList}
        />
        {error.hasError && error.code === 404 && <PokemonNotFound />}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-screen-lg mx-auto">
          {!error.hasError && displayPokemonList.length === 0
            ? Array.from({ length: 10 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : displayPokemonList.map((pokemon) => (
                <PokemonCard key={pokemon.name} pokemon={pokemon} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDisplayList;
