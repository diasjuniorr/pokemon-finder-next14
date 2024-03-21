import { Pokemon, PokemonSpecies } from "@/entities/pokemon";

export type GetPokemonDataResponse = [
  GetPokemonDataFailureResponse,
  GetPokemonDataSuccessResponse
];

export interface GetPokemonDataFailureResponse {
  error: Error | null;
  hasError: boolean;
}

export interface GetPokemonDataSuccessResponse {
  data: PokemonSpecies | null;
}

export const getPokemonData = async (
  pokemon: Pokemon
): Promise<GetPokemonDataResponse> => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
    );
    const data = await response.json();

    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
    );
    const speciesData = await speciesResponse.json();

    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
    return [
      {
        error: null,
        hasError: false,
      },
      {
        data: {
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
        },
      },
    ];
  } catch (err) {
    console.log("Error fetching pokemon data", err);
    return [
      {
        error: new Error("Error fetching pokemon data"),
        hasError: true,
      },
      {
        data: null,
      },
    ];
  }
};
