import { Pokemon, PokemonSpecies } from "@/entities/pokemon";
import { errorResponse, successResponse } from "@/shared/responses";

export type GetPokemonDataResponse = [
  GetPokemonDataFailureResponse,
  GetPokemonDataSuccessResponse
];

export interface GetPokemonDataFailureResponse {
  hasError: boolean;
  error?: Error;
  code?: number;
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

    if (response.status === 404) {
      return errorResponse(new Error("Pokemon not found"), 404);
    }

    const data = await response.json();

    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
    );

    if (speciesResponse.status === 404) {
      return errorResponse(new Error("Pokemon species not found"), 404);
    }

    const speciesData = await speciesResponse.json();

    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

    return successResponse<PokemonSpecies>({
      id: data.id,
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
    });
  } catch (err) {
    console.log("Error fetching pokemon data", err);
    return errorResponse(new Error("Error fetching pokemon data"));
  }
};
