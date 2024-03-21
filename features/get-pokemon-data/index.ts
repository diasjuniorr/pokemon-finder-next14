import { Pokemon, PokemonSpecies } from "@/entities/pokemon";

export const getPokemonData = async (
  pokemon: Pokemon
): Promise<PokemonSpecies> => {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
  );
  const data = await response.json();

  const speciesResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
  );
  const speciesData = await speciesResponse.json();

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
  return {
    name: data.name,
    imageUrl: imageUrl,
    generation: speciesData.generation.name,
    types: data.types.map((type: any) => type.type.name),
    habitat: speciesData.habitat ? speciesData.habitat.name : "unknown",
    evolutionChainId: speciesData.evolution_chain.url.split("/")[6],
    funFacts: speciesData.flavor_text_entries,
    stats: data.stats.reduce((acc: any, curr: any) => {
      return { ...acc, [curr.stat.name]: curr.base_stat };
    }, {}),
  };
};
