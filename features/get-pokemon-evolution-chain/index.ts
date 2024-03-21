import { PokemonSpecies } from "@/entities/pokemon";
import {
  GetPokemonSpeciesResponse,
  getPokemonSpecies,
} from "../get-pokemon-species";

type GetPokemonEvolutionChainResponse = [
  GetPokemonEvolutionChainFailureResponse,
  GetPokemonEvolutionChainSuccessResponse
];

export interface GetPokemonEvolutionChainFailureResponse {
  error: Error | null;
  hasError: boolean;
}
export interface GetPokemonEvolutionChainSuccessResponse {
  data: PokemonSpecies[] | null;
}

export const getPokemonEvolutionChain = async (
  name: string
): Promise<GetPokemonEvolutionChainResponse> => {
  const [error, result] = await getPokemonSpecies(name);
  if (error.hasError) {
    return errorResponse(error.error as Error);
  }

  try {
    const response = await fetch(
      `https://pokeapi.co/api/v2/evolution-chain/${
        result.data!.evolutionChainId
      }`
    );
    const data = await response.json();

    const pokemons: string[] = [data.chain.species.name];
    pokemons.push(...extractEvolutionsRecursively(data.chain));

    const pokemonDataPromises = pokemons.map(async (pokemon) => {
      return getPokemonSpecies(pokemon);
    });

    const pokemonDataPromisesResponse = await Promise.all(pokemonDataPromises);

    const [errorMappingResponse, pokemonDataResult] =
      mapPokemonDataPromisesResponse(pokemonDataPromisesResponse);

    if (errorMappingResponse.hasError) {
      return errorResponse(new Error("Error fetching pokemon data"));
    }

    return [
      { error: null, hasError: false },
      {
        data: pokemonDataResult.data,
      },
    ];
  } catch (error) {
    return errorResponse(new Error("Error fetching pokemon data"));
  }
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

const errorResponse = (error: Error): GetPokemonEvolutionChainResponse => {
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

export const extractEvolutionsRecursively = (pokemon: any) => {
  const pokemons: string[] = [];
  if (pokemon.evolves_to.length > 0) {
    pokemon.evolves_to.forEach((pokemon: any) => {
      pokemons.push(pokemon.species.name);
      pokemons.push(...extractEvolutionsRecursively(pokemon));
    });
  }
  return pokemons;
};
