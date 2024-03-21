import Link from "next/link";
import Image from "next/image";
import { PokemonSpecies, TColorsKeys, TYPE_COLORS } from "@/entities/pokemon";

export const PokemonCard = ({ pokemon }: { pokemon: PokemonSpecies }) => {
  console.log("debug", pokemon);
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
