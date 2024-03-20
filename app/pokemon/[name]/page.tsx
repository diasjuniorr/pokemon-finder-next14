import { getPokemonEvolutions } from "@/features/get-pokemon-evolutions";
import Image from "next/image";
import Link from "next/link";

const PokemonPage = async ({ params }: { params: { name: string } }) => {
  const { name } = params;
  const { pokemon, evolutionChain } = await getPokemonEvolutions(name);

  return (
    <div className="bg-gradient-to-br from-green-500 to-cyan-500 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 max-w-screen-lg mx-auto">
          {evolutionChain.map((evolution) => (
            <Link href={`/pokemon/${evolution.name}`} key={evolution.name}>
              <div
                key={evolution.name}
                className={`${
                  evolution.name === pokemon.name ? " bg-gray-100" : "bg-white"
                } p-4 rounded-lg shadow-md `}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">{evolution.name}</h2>
                  <span className="text-gray-500">{evolution.generation}</span>
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
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">Stats:</h3>
                  <ul>
                    <li>HP: {evolution.stats.hp}</li>
                    <li>Attack: {evolution.stats.attack}</li>
                    <li>Defense: {evolution.stats.defense}</li>
                    <li>Special Attack: {evolution.stats.specialAttack}</li>
                    <li>Special Defense: {evolution.stats.specialDefense}</li>
                    <li>Speed: {evolution.stats.speed}</li>
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

export default PokemonPage;
