"use client";
import _debounce from "lodash/debounce";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pokemon } from "@/entities/pokemon";
import { SkeletonCard } from "./skeleton-card";
import { usePokemonList } from "@/hooks/use-pokemon-list";

const TYPE_COLORS = {
  normal: "bg-[#EAE8E1]",
  bug: "bg-[#BAC226]",
  dark: "bg-[#756D63]",
  dragon: "bg-[#A99FE9]",
  electric: "bg-[#F4BE6E]",
  fairy: "bg-[#F4CFF0]",
  fighting: "bg-[#B27650]",
  fire: "bg-[#FF7F70]",
  flying: "bg-[#AFC7FF]",
  ghost: "bg-[#A5A5C9]",
  grass: "bg-[#9FD360]",
  ground: "bg-[#D4B881]",
  ice: "bg-[#C9F3FF]",
  poison: "bg-[#B58DBF]",
  psychic: "bg-[#F1A9C4]",
  rock: "bg-[#93836C]",
  steel: "bg-[#ABB4B8]",
  water: "bg-[#72BBFF]",
} as const;

type TColorsKeys = keyof typeof TYPE_COLORS;

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

const SelectComponent = ({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}) => {
  return (
    <select
      className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      value={value}
      onChange={onChange}
    >
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
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
        {/* search bar component */}
        <div className=" mx-auto flex gap-4 pb-6">
          <div className="flex flex-1">
            <div className="relative w-full">
              <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                <svg
                  className="w-4 h-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
              </div>
              <input
                type="search"
                id="default-search"
                className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Search pokemons..."
                value={searchTerm}
                onChange={(e) => handleSearchTermChange(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex flex-1 gap-4">
            <SelectComponent
              options={generationList}
              value={generationFilter}
              onChange={handleGenerationFilterChange}
            />
            <SelectComponent
              options={typeList}
              value={typeFilter}
              onChange={handleTypeFilterChange}
            />
          </div>
        </div>
        {/* ends here */}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-screen-lg mx-auto">
          {displayPokemonList.length === 0
            ? Array.from({ length: 10 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : displayPokemonList.map((pokemon) => (
                <Link href={`/pokemon/${pokemon.name}`} key={pokemon.name}>
                  <div
                    key={pokemon.name}
                    className={`${
                      TYPE_COLORS[pokemon.types[0] as TColorsKeys]
                    } p-4 rounded-lg shadow-md`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">{pokemon.name}</h2>
                      <span className="text-gray-800">
                        {pokemon.generation}
                      </span>
                    </div>
                    <div className="px-1 pb-2">
                      {pokemon.types.map((type) => {
                        return (
                          <span
                            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
                            key={type}
                          >
                            {type}
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex justify-center">
                      <Image
                        src={pokemon.imageUrl}
                        alt={pokemon.name}
                        width={150}
                        height={150}
                        className="mx-auto"
                      />
                    </div>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDisplayList;
