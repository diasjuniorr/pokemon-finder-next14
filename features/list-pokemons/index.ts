import { Pokemon } from "@/entities/pokemon";

export const listPokemons = async (): Promise<Pokemon[]> => {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000");
  const data = await response.json();

  return data.results.map((pokemon: any) => {
    return {
      name: pokemon.name,
      url: pokemon.url,
    };
  });
};
