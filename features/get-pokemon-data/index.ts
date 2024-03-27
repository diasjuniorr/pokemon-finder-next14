import { Pokemon, PokemonSpecies } from "@/entities/pokemon";
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

export type GetPokemonDataResponse = [
  ErrorResponse,
  GetPokemonDataSuccessResponse
];

export interface GetPokemonDataSuccessResponse {
  data: PokemonSpecies | null;
}

export const getPokemonData = async (
  pokemon: Pokemon
): Promise<GetPokemonDataResponse> => {
  const [error, result] = await fetchJson<PokemonDataDTO>(
    `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
  );
  if (error.hasError) {
    return errorResponse(error.error!, error.code);
  }

  const data = result.data!;

  const [pokemonSpeciesError, pokemonSpeciesResult] =
    await fetchJson<PokemonSpeciesDataDTO>(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
    );
  if (pokemonSpeciesError.hasError) {
    return errorResponse(pokemonSpeciesError.error!, pokemonSpeciesError.code);
  }

  const speciesData = pokemonSpeciesResult.data!;

  return successResponse<PokemonSpecies>(newPokemonSpecies(data, speciesData));
};
