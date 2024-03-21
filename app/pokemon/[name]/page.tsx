import { getPokemonEvolutions } from "@/features/get-pokemon-evolutions";
import { PokemonDetailsCard } from "./components/pokemon-details-card";
import { HabitatCard } from "./components/habitat-card";
import { FunFactCard } from "./components/fun-fact-card";
import { PokemonDetailsErrorPage } from "./error-page";

const PokemonPage = async ({ params }: { params: { name: string } }) => {
  const { name } = params;
  const [error, result] = await getPokemonEvolutions(name);

  if (error.hasError) {
    return <PokemonDetailsErrorPage />;
  }

  const { pokemon, evolutionChain } = result.data!;

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className=" mx-auto px-10 w-fit">
        <h1 className="pt-6 pb-2 mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">
          {`${pokemon.name.charAt(0).toUpperCase()}${pokemon.name.slice(1)}`}{" "}
          Evolution Chain
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-screen-lg ">
          {evolutionChain.map((evolution) => (
            <PokemonDetailsCard
              key={evolution.name}
              isSelected={evolution.name === pokemon.name}
              pokemon={pokemon}
              evolution={evolution}
            />
          ))}
        </div>
        <h1 className="mb-4 pt-6 pb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">
          {`Other info about ${pokemon.name
            .charAt(0)
            .toUpperCase()}${pokemon.name.slice(1)}`}
        </h1>
        <div className="flex flex-col gap-4 pb-10 md:flex-row md:gap-4">
          <HabitatCard pokemon={pokemon} />
          <FunFactCard
            funFact={
              getRandomItem(
                pokemon.funFacts.filter((fact) => fact.language.name === "en")
              ).flavor_text
            }
          />
        </div>
      </div>
    </div>
  );
};

function getRandomItem<T>(items: T[]): T {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

export default PokemonPage;
