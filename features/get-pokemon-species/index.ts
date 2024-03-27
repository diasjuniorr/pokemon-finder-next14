import { PokemonSpecies } from "@/entities/pokemon";
import { fetchJson } from "@/shared/clients/http-fetcher";
import {
  PokemonDataDTO,
  PokemonSpeciesDataDTO,
} from "@/shared/clients/http-fetcher/dto";
import { newPokemonSpecies } from "@/shared/factories/pokemon-species";
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

  return successResponse<PokemonSpecies>(newPokemonSpecies(data, speciesData));
};
