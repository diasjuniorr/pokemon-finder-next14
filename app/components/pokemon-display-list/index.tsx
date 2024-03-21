"use client";
import _debounce from "lodash/debounce";
import { ChangeEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Pokemon } from "@/entities/pokemon";
import { SkeletonCard } from "../skeleton-card";
import { usePokemonList } from "@/hooks/use-pokemon-list";
import { PokemonCard } from "../pokemon-card";
import { PokemonSearchBar } from "../pokemon-search-bar";

interface TextInputProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({
  placeholder,
  value,
  onChange,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
    />
  );
};

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
  } = usePokemonList({ list, initialListSize: 30 });

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className=" mx-auto px-10 w-fit">
        <h1 className="text-2xl font-bold mb-4 pt-6">Pokemon Finder</h1>
        <PokemonSearchBar
          searchTerm={searchTerm}
          generationFilter={generationFilter}
          generationList={generationList}
          handleGenerationFilterChange={handleGenerationFilterChange}
          handleSearchTermChange={handleSearchTermChange}
          handleTypeFilterChange={handleTypeFilterChange}
          typeFilter={typeFilter}
          typeList={typeList}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-screen-lg mx-auto">
          {displayPokemonList.length === 0
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
