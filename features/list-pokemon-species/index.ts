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
import { GetPokemonSpeciesResponse } from "../get-pokemon-species";

export type ListPokemonSpeciesResponse = [
  ErrorResponse,
  ListPokemonSpeciesSuccessResponse
];

export interface ListPokemonSpeciesSuccessResponse {
  data: PokemonSpecies[] | null;
}

export const listPokemonSpecies = async (
  pokemons: Pokemon[]
): Promise<ListPokemonSpeciesResponse> => {
  const speciesResponsePromises = createGetPokemonSpeciesPromises(pokemons);

  const promisesResponse = await Promise.all(speciesResponsePromises);

  const [errorMapping, response] =
    mapPokemonDataPromisesResponse(promisesResponse);

  if (errorMapping.hasError) {
    return errorResponse(
      (errorMapping.error as Error) || new Error("Failed to fetch data")
    );
  }

  return successResponse<PokemonSpecies[]>(response.data);
};

const createGetPokemonSpeciesPromises = (pokemons: Pokemon[]) => {
  return pokemons.map(async (pokemon) => {
    const [error, pokemonDataResult] = await fetchJson<PokemonDataDTO>(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
    );
    if (error.hasError) {
      return errorResponse(error.error!, error.code);
    }

    const pokemonData = pokemonDataResult.data!;

    const [errorSpecies, pokemonSpeciesResult] =
      await fetchJson<PokemonSpeciesDataDTO>(
        `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
      );
    if (errorSpecies.hasError) {
      return errorResponse(errorSpecies.error!, errorSpecies.code);
    }

    const speciesData = pokemonSpeciesResult.data!;

    return successResponse<PokemonSpecies>(
      newPokemonSpecies(pokemonData, speciesData)
    );
  });
};

type MapPokemonDataPromisesResponse = [
  { error: Error | null; hasError: boolean },
  {
    data: PokemonSpecies[];
  }
];

const mapPokemonDataPromisesResponse = (
  items: GetPokemonSpeciesResponse[]
): MapPokemonDataPromisesResponse => {
  const errors: Error[] = [];

  const pokemonData = items.map((response) => {
    if (response[0].hasError) {
      errors.push(
        response[0].error || new Error("fetching pokemon data failed")
      );
      return null;
    }

    if (!response[1].data) {
      errors.push(new Error("No data found for pokemon"));
      return null;
    }

    return response[1].data;
  });

  if (errors.length > 0) {
    return [{ error: errors[0], hasError: true }, { data: [] }];
  }

  return [
    { error: null, hasError: false },
    {
      data: pokemonData.filter(
        (pokemon) => pokemon !== null
      ) as PokemonSpecies[],
    },
  ];
};
