"use client";
import _debounce from "lodash/debounce";
import { ChangeEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Pokemon, PokemonSpecies } from "@/entities/pokemon";
import { fetchPokemonsData } from "@/features/get-pokemons-species";
import { getPokemonEvolutionChain } from "@/features/get-pokemon-evolution-chain";
import { SkeletonCard } from "./skeleton-card";
import { usePokemonList } from "@/hooks/use-pokemon-list";

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
    newPokemonList,
    filteredPokemonList,
    filterByGeneration,
    filterByType,
    filterByPokemonName,
    typeFilter,
    typeList,
    generationFilter,
    generationList,
    resetFilteredList,
    resetFilterOptions,
    setTypeFilter,
    setGenerationFilter,
    resetDisplayPokemonList,
    displayPokemonList,
  } = usePokemonList();
  const [textInputValue, setTextInputValue] = useState("");

  const handleTextInputChange = (value: string) => {
    setTextInputValue(value);
  };

  const handleTypeFilterChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTypeFilter(event.target.value);
  };

  const handleGenerationFilterChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setGenerationFilter(event.target.value);
  };

  useEffect(() => {
    newPokemonList(list, 30);
  }, [list]);

  useEffect(() => {
    if (textInputValue.length === 0) {
      resetFilteredList();
      return;
    }

    const debounced = _debounce(() => {
      filterByPokemonName(textInputValue);
    }, 500);
    debounced();
    return debounced.cancel;
  }, [textInputValue]);

  useEffect(() => {
    resetFilterOptions();
  }, [displayPokemonList]);

  useEffect(() => {
    filterByGeneration(generationFilter);
  }, [generationFilter]);

  useEffect(() => {
    filterByType(typeFilter);
  }, [typeFilter]);

  return (
    <div className="bg-gradient-to-br from-green-500 to-cyan-500 min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Your Page Title</h1>
        <div>
          <label htmlFor="textInput" className="block mb-2">
            Enter your text:
          </label>
          <TextInput
            placeholder="Type something..."
            value={textInputValue}
            onChange={handleTextInputChange}
          />
        </div>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-screen-lg mx-auto">
          {displayPokemonList.length === 0
            ? Array.from({ length: 10 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))
            : displayPokemonList.map((pokemon) => (
                <Link href={`/pokemon/${pokemon.name}`} key={pokemon.name}>
                  <div
                    key={pokemon.name}
                    className="bg-white p-4 rounded-lg shadow-md"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold">{pokemon.name}</h2>
                      <span className="text-gray-500">
                        {pokemon.generation}
                      </span>
                    </div>
                    <div className="flex justify-center">
                      <Image
                        src={pokemon.imageUrl}
                        alt={pokemon.name}
                        width={200}
                        height={200}
                        className="mx-auto"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Stats:</h3>
                      <ul>
                        <li>HP: {pokemon.stats.hp}</li>
                        <li>Attack: {pokemon.stats.attack}</li>
                        <li>Defense: {pokemon.stats.defense}</li>
                        <li>Special Attack: {pokemon.stats.specialAttack}</li>
                        <li>Special Defense: {pokemon.stats.specialDefense}</li>
                        <li>Speed: {pokemon.stats.speed}</li>
                      </ul>
                    </div>
                    <div className="px-1 pt-4 pb-2">
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
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonDisplayList;
