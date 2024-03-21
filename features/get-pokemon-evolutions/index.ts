import { PokemonSpecies } from "@/entities/pokemon";
import { GetPokemonDataResponse, getPokemonData } from "../get-pokemon-data";
import { extractEvolutionsRecursively } from "../get-pokemon-evolution-chain";

export type GetPokemonEvolutionsResponse = [
  GetPokemonEvolutionsFailureResponse,
  GetPokemonEvolutionsSuccessResponse
];
export interface GetPokemonEvolutionsFailureResponse {
  error: Error | null;
  hasError: boolean;
}
export interface GetPokemonEvolutionsSuccessResponse {
  data: PokemonEvolutionData | null;
}

interface PokemonEvolutionData {
  pokemon: PokemonSpecies;
  evolutionChain: PokemonSpecies[];
}

export const getPokemonEvolutions = async (
  name: string
): Promise<GetPokemonEvolutionsResponse> => {
  const [error, result] = await getPokemonData({ name: name, url: "" });

  if (error.hasError) {
    console.log("Error fetching pokemon data", error.error);
    return errorResponse(
      error.error || new Error("fetching pokemon data failed")
    );
  }

  if (!result.data) {
    console.log("No data found for pokemon", name);
    return errorResponse(new Error("No data found for pokemon"));
  }

  const pokemon = result.data;

  try {
    const evolutionChainResponse = await fetch(
      `https://pokeapi.co/api/v2/evolution-chain/${pokemon.evolutionChainId}`
    );
    const chainData = await evolutionChainResponse.json();

    const pokemonEvolutionChain: string[] = [chainData.chain.species.name];
    pokemonEvolutionChain.push(
      ...extractEvolutionsRecursively(chainData.chain)
    );

    const pokemonDataPromises = pokemonEvolutionChain.map(async (pokemon) => {
      return getPokemonData({ name: pokemon, url: "" });
    });

    const pokemonDataPromisesResponse = await Promise.all(pokemonDataPromises);

    const [errorMappingResponse, evolutionChain] =
      mapEvolutionChainDataResponse(pokemonDataPromisesResponse);

    if (errorMappingResponse.hasError) {
      return errorResponse(new Error("Error fetching evolution chain"));
    }

    return successResponse(pokemon, evolutionChain.data);
  } catch (error) {
    return errorResponse(new Error("Error fetching evolution chain"));
  }
};

const mapEvolutionChainDataResponse = (
  response: GetPokemonDataResponse[]
): [{ hasError: boolean }, { data: PokemonSpecies[] }] => {
  const errors: Error[] = [];

  const evolutionChain = response.map((response) => {
    if (response[0].hasError) {
      errors.push(
        response[0].error || new Error("fetching pokemon data failed")
      );
      return;
    }

    if (!response[1].data) {
      errors.push(new Error("No data found for pokemon"));
      return;
    }

    return response[1].data;
  });

  if (errors.length > 0) {
    return [{ hasError: true }, { data: [] }];
  }

  return [
    { hasError: false },
    {
      data: evolutionChain.filter(
        (pokemon) => pokemon !== undefined
      ) as PokemonSpecies[],
    },
  ];
};

const successResponse = (
  pokemon: PokemonSpecies,
  evolutionChain: PokemonSpecies[]
): GetPokemonEvolutionsResponse => {
  return [
    {
      error: null,
      hasError: false,
    },
    {
      data: {
        pokemon: pokemon,
        evolutionChain,
      },
    },
  ];
};

const errorResponse = (error: Error): GetPokemonEvolutionsResponse => {
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
