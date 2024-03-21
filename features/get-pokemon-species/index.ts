import { PokemonSpecies } from "@/entities/pokemon";
import { errorResponse, successResponse } from "@/shared/responses";

export type GetPokemonSpeciesResponse = [
  GetPokemonSpeciesFailureResponse,
  GetPokemonSpeciesSuccessResponse
];
export interface GetPokemonSpeciesFailureResponse {
  error?: Error;
  code?: number;
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

    if (response.status === 404) {
      return errorResponse(new Error("Pokemon not found"), 404);
    }

    const data = await response.json();

    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
    );

    if (speciesResponse.status === 404) {
      return errorResponse(new Error("Pokemon species not found"), 404);
    }

    const speciesData = await speciesResponse.json();

    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;
    return successResponse<PokemonSpecies>({
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
    });
  } catch (error) {
    console.log("Error fetching pokemon data", error);
    return errorResponse(new Error("Error fetching pokemon data"));
  }
};
