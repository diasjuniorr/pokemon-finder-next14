import Link from "next/link";
import Image from "next/image";
import { PokemonSpecies } from "@/entities/pokemon";

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

export const PokemonCard = ({ pokemon }: { pokemon: PokemonSpecies }) => {
  return (
    <Link href={`/pokemon/${pokemon.name}`} key={pokemon.name}>
      <div
        key={pokemon.name}
        className={`${
          TYPE_COLORS[pokemon.types[0] as TColorsKeys]
        } p-4 rounded-lg shadow-md`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{pokemon.name}</h2>
          <span className="text-gray-800">{pokemon.generation}</span>
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
  );
};
