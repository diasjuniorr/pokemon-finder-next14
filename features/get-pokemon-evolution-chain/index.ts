import { getPokemonSpecies } from "../get-pokemon-species";

export const getPokemonEvolutionChain = async (name: string) => {
  if (!name) return [];

  const pagePokemonData = await getPokemonSpecies(name);

  const response = await fetch(
    `https://pokeapi.co/api/v2/evolution-chain/${pagePokemonData.evolutionChainId}`
  );
  const data = await response.json();

  const pokemons: string[] = [data.chain.species.name];
  pokemons.push(...extractEvolutionsRecursively(data.chain));

  const pokemonDataPromises = pokemons.map(async (pokemon) => {
    return getPokemonSpecies(pokemon);
  });

  const pokemonData = await Promise.all(pokemonDataPromises);

  return [...pokemonData];
};

export const extractEvolutionsRecursively = (pokemon: any) => {
  const pokemons: string[] = [];
  if (pokemon.evolves_to.length > 0) {
    pokemon.evolves_to.forEach((pokemon: any) => {
      pokemons.push(pokemon.species.name);
      pokemons.push(...extractEvolutionsRecursively(pokemon));
    });
  }
  return pokemons;
};
