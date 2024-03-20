import { PokemonSpecies } from "@/entities/pokemon";

export const getPokemonSpecies = async (
  pokemonName: string
): Promise<PokemonSpecies> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );
  const data = await response.json();
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

  const speciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
  );
  const speciesData = await speciesResponse.json();

  return {
    name: data.name,
    imageUrl: imageUrl,
    generation: speciesData.generation.name,
    types: data.types.map((type: any) => type.type.name),
    evolutionChainId: speciesData.evolution_chain.url.split("/")[6],
    stats: data.stats.reduce((acc: any, curr: any) => {
      return { ...acc, [curr.stat.name]: curr.base_stat };
    }),
  };
};
