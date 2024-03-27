import { PokemonSpecies } from "@/entities/pokemon";
import { fetchJson } from "@/shared/clients/http-fetcher";
import {
  PokemonDataDTO,
  PokemonSpeciesDataDTO,
} from "@/shared/clients/http-fetcher/dto";
import {
  ErrorResponse,
  errorResponse,
  successResponse,
} from "@/shared/responses";

export type GetPokemonSpeciesResponse = [
  ErrorResponse,
  GetPokemonSpeciesSuccessResponse
];

export interface GetPokemonSpeciesSuccessResponse {
  data: PokemonSpecies | null;
}

export const getPokemonSpecies = async (
  pokemonName: string
): Promise<GetPokemonSpeciesResponse> => {
  const [error, pokemonDataResult] = await fetchJson<PokemonDataDTO>(
    `https://pokeapi.co/api/v2/pokemon/${pokemonName}`
  );
  if (error.hasError) {
    return errorResponse(error.error!, error.code);
  }

  const data = pokemonDataResult.data!;

  const [errorFetchingSpeciesData, pokemonSpeciesDataResult] =
    await fetchJson<PokemonSpeciesDataDTO>(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`
    );
  if (errorFetchingSpeciesData.hasError) {
    return errorResponse(
      errorFetchingSpeciesData.error!,
      errorFetchingSpeciesData.code
    );
  }

  const speciesData = pokemonSpeciesDataResult.data!;

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

  return successResponse<PokemonSpecies>({
    id: data.id,
    name: data.name,
    imageUrl: imageUrl,
    generation: speciesData.generation.name,
    types: data.types.map((type: any) => type.type.name),
    evolutionChainId: speciesData.evolution_chain.url.split("/")[6],
    habitat: speciesData.habitat ? speciesData.habitat.name : "unknown",
    funFacts: speciesData.flavor_text_entries,
    stats: data.stats.reduce((acc: any, curr: any) => {
      return { ...acc, [curr.stat.name]: curr.base_stat };
    }, {}),
  });
};
