import Link from "next/link";
import Image from "next/image";
import { PokemonSpecies, TColorsKeys, TYPE_COLORS } from "@/entities/pokemon";

export const PokemonDetailsCard = ({
  isSelected,
  evolution,
}: {
  isSelected: boolean;
  evolution: PokemonSpecies;
}) => {
  return (
    <Link href={`/pokemon/${evolution.name}`} key={evolution.name}>
      <div
        key={evolution.name}
        className={`${
          TYPE_COLORS[evolution.types[0] as TColorsKeys]
        } rounded-lg  shadow-md `}
      >
        <div className="p-4">
          <div className="flex justify-between flex-col mb-4">
            <h2 className="text-xl font-bold">{evolution.name}</h2>
            <span className="text-gray-800 text-sm">
              {evolution.generation}
            </span>
          </div>
          <div className="px-1 pb-2">
            {evolution.types.map((type) => {
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
