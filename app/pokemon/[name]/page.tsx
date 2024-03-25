import { PokemonDetailsCard } from "./components/pokemon-details-card";
import { HabitatCard } from "./components/habitat-card";
import { FunFactCard } from "./components/fun-fact-card";
import NavigateBack from "./components/navigate-back";
import { ErrorPage } from "@/shared/components/error-page";
import { getPokemonEvolutionChain } from "@/features/get-pokemon-evolution-chain";

const PokemonPage = async ({ params }: { params: { name: string } }) => {
  const { name } = params;
  const [error, result] = await getPokemonEvolutionChain(name);

  if (error.hasError) {
    return <ErrorPage />;
  }

  const { data } = result;
  const pagePokemon = data!.find((pokemon) => pokemon.name === name);

  return (
    <div className="bg-slate-100 min-h-screen">
      <div className=" mx-auto px-10 w-fit">
        <h1 className="pt-6 pb-2 mb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">
          {`${name.charAt(0).toUpperCase()}${name.slice(1)}`} Evolution Chain
        </h1>
        <NavigateBack />
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 max-w-screen-lg ">
          {data &&
            data.map((evolution) => (
              <PokemonDetailsCard
                key={evolution.name}
                isSelected={evolution.name === name}
                evolution={evolution}
              />
            ))}
        </div>
        <h1 className="mb-4 pt-6 pb-6 text-4xl font-extrabold leading-none tracking-tight text-gray-900  dark:text-white">
          {`Other info about ${name.charAt(0).toUpperCase()}${name.slice(1)}`}
        </h1>
        {pagePokemon && (
          <div className="flex flex-col gap-4 pb-10 md:flex-row md:gap-4">
            <HabitatCard pokemon={pagePokemon} />
            <FunFactCard
              funFact={
                getRandomItem(
                  pagePokemon.funFacts.filter(
                    (fact) => fact.language.name === "en"
                  )
                ).flavor_text
              }
            />
          </div>
        )}
      </div>
    </div>
  );
};

function getRandomItem<T>(items: T[]): T {
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex];
}

export default PokemonPage;
