import { ChangeEvent } from "react";
import { Select } from "../select";

export const PokemonSearchBar = ({
  searchTerm,
  handleSearchTermChange,
  generationFilter,
  handleGenerationFilterChange,
  generationList,
  typeList,
  typeFilter,
  handleTypeFilterChange,
}: {
  searchTerm: string;
  handleSearchTermChange: (term: string) => void;
  generationList: string[];
  generationFilter: string;
  handleGenerationFilterChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleTypeFilterChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  typeList: string[];
  typeFilter: string;
}) => {
  return (
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
        <Select
          options={generationList}
          value={generationFilter}
          onChange={handleGenerationFilterChange}
        />
        <Select
          options={typeList}
          value={typeFilter}
          onChange={handleTypeFilterChange}
        />
      </div>
    </div>
  );
};
