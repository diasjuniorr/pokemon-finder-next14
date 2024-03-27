import { Pokemon, PokemonSpecies } from "@/entities/pokemon";
import { newPokemonSpecies } from "@/shared/factories/pokemon-species";
import {
  ErrorResponse,
  SuccessResponse,
  errorResponse,
  successResponse,
} from "@/shared/responses";

export type ListPokemonSpeciesResponse = [
  ListPokemonSpeciesFailureResponse,
  ListPokemonSpeciesSuccessResponse
];

export interface ListPokemonSpeciesFailureResponse {
  error?: Error;
  code?: number;
  hasError: boolean;
}
export interface ListPokemonSpeciesSuccessResponse {
  data: PokemonSpecies[] | null;
}

export const listPokemonSpecies = async (
  pokemons: Pokemon[]
): Promise<ListPokemonSpeciesResponse> => {
  const speciesResponsePromises = pokemons.map(async (pokemon) => {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
    );

    if (pokemonResponse.status === 404) {
      return errorResponse(new Error("Pokemon not found"), 404);
    }

    const pokemonData = await pokemonResponse.json();

    const result = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
    );

    if (result.status === 404) {
      return errorResponse(new Error("Pokemon species not found"), 404);
    }

    const speciesData = await result.json();

    return successResponse<PokemonSpecies>(
      newPokemonSpecies(pokemonData, speciesData)
    );
  });

  const promisesResponse = await Promise.allSettled(speciesResponsePromises);

  const [errorMapping, response] = mapPromiseResponses(
    promisesResponse as PromiseSettledResult<
      [ErrorResponse, SuccessResponse<PokemonSpecies>]
    >[]
  );

  if (errorMapping.hasError) {
    return errorResponse(
      (errorMapping.error as Error) || new Error("Failed to fetch data"),
      errorMapping.code
    );
  }

  return successResponse(response.data);
};

const mapPromiseResponses = (
  promisesResponse: PromiseSettledResult<
    [ErrorResponse, SuccessResponse<PokemonSpecies>]
  >[]
): [
  { error?: Error; code?: number; hasError: boolean },
  { data: PokemonSpecies[] | null }
] => {
  const hasError = promisesResponse.some(
    (response) => response.status === "rejected"
  );

  if (hasError) {
    return errorResponse(new Error("Failed to fetch data"));
  }

  const response = promisesResponse.map(
    (response) =>
      (
        response as unknown as PromiseFulfilledResult<
          [ErrorResponse, SuccessResponse<PokemonSpecies>]
        >
      ).value
  );

  return [
    {
      hasError: false,
    },
    {
      data: response.map((r) => r[1].data!),
    },
  ];
};
