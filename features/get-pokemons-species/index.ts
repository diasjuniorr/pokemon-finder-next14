import { Pokemon, PokemonSpecies } from "@/entities/pokemon";

export const fetchPokemonsData = async (
  pokemons: Pokemon[]
): Promise<PokemonSpecies[]> => {
  const speciesResponsePromises = pokemons.map(async (pokemon) => {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
    );
    const pokemonData = await pokemonResponse.json();

    const result = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
    );
    const speciesData = await result.json();

    const id = pokemonData.id;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return {
      name: pokemon.name,
      imageUrl,
      types: pokemonData.types.map((type: any) => type.type.name),
      habitat: speciesData.habitat.name,
      funFacts: [],
      stats: pokemonData.stats.reduce((acc: any, curr: any) => {
        return { ...acc, [curr.stat.name]: curr.base_stat };
      }),
      generation: speciesData.generation.name,
      evolutionChainId: speciesData.evolution_chain.url.split("/")[6],
    };
  });

  return await Promise.all(speciesResponsePromises);
};
