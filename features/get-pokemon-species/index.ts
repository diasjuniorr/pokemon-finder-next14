import { PokemonSpecies } from "@/entities/pokemon";

export type GetPokemonSpeciesResponse = [
  GetPokemonSpeciesFailureResponse,
  GetPokemonSpeciesSuccessResponse
];
export interface GetPokemonSpeciesFailureResponse {
  error: Error | null;
  hasError: boolean;
}
export interface GetPokemonSpeciesSuccessResponse {
  data: PokemonSpecies | null;
}

export const getPokemonSpecies = async (
  pokemonName: string
): Promise<GetPokemonSpeciesResponse> => {
  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
    );
    const data = await response.json();
    if (!data) {
      return errorResponse(new Error("No data found for pokemon"));
    }

    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
    );

    const speciesData = await speciesResponse.json();
    if (!speciesData) {
      return errorResponse(new Error("No data found for pokemon species"));
    }

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
          evolutionChainId: speciesData.evolution_chain.url.split("/")[6],
          habitat: speciesData.habitat ? speciesData.habitat.name : "unknown",
          funFacts: speciesData.flavor_text_entries,
          stats: data.stats.reduce((acc: any, curr: any) => {
            return { ...acc, [curr.stat.name]: curr.base_stat };
          }),
        },
      },
    ];
  } catch (error) {
    return errorResponse(new Error("Error fetching pokemon data"));
  }
};

const errorResponse = (error: Error): GetPokemonSpeciesResponse => {
  return [
    {
      error,
      hasError: true,
    },
    {
      data: null,
    },
  ];
};
