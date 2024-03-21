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

export const PokemonDetailsCard = ({
  isSelected,
  pokemon,
  evolution,
}: {
  isSelected: boolean;
  pokemon: PokemonSpecies;
  evolution: PokemonSpecies;
}) => {
  return (
    <Link href={`/pokemon/${evolution.name}`} key={evolution.name}>
      <div
        key={evolution.name}
        className={`${
          TYPE_COLORS[pokemon.types[0] as TColorsKeys]
        } rounded-lg  shadow-md `}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{evolution.name}</h2>
            <span className="text-gray-800">{evolution.generation}</span>
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
              src={evolution.imageUrl}
              alt={evolution.name}
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
        </div>
        <div className="mt-4 bg-white rounded-t-3xl p-4 relative">
          {isSelected && (
            <div className="absolute right-0 bottom-0">
              <Image
                className="opacity-50"
                src="/pokeball.png"
                width={50}
                height={50}
                alt="pokeball"
              />
            </div>
          )}
          <h3 className="text-lg font-semibold mb-2">Stats:</h3>
          <ul>
            <li>HP: {evolution.stats.hp}</li>
            <li>Attack: {evolution.stats.attack}</li>
            <li>Defense: {evolution.stats.defense}</li>
            <li>Special Attack: {evolution.stats["special-attack"]}</li>
            <li>Special Defense: {evolution.stats["special-defense"]}</li>
            <li>Speed: {evolution.stats.speed}</li>
          </ul>
        </div>
      </div>
    </Link>
  );
};
