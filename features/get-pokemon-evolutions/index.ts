import { getPokemonData } from "../get-pokemon-data";
import { extractEvolutionsRecursively } from "../get-pokemon-evolution-chain";

export const getPokemonEvolutions = async (name: string) => {
  const pokemon = await getPokemonData({ name: name, url: "" });

  const evolutionChainResponse = await fetch(
    `https://pokeapi.co/api/v2/evolution-chain/${pokemon.evolutionChainId}`
  );
  const chainData = await evolutionChainResponse.json();

  const pokemonEvolutionChain: string[] = [chainData.chain.species.name];
  pokemonEvolutionChain.push(...extractEvolutionsRecursively(chainData.chain));

  const pokemonDataPromises = pokemonEvolutionChain.map(async (pokemon) => {
    return getPokemonData({ name: pokemon, url: "" });
  });

  const evolutionChain = await Promise.all(pokemonDataPromises);

  return {
    pokemon,
    evolutionChain,
  };
};
