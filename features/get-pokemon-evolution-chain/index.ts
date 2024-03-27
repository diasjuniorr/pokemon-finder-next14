import { PokemonSpecies } from "@/entities/pokemon";
import { GetPokemonSpeciesResponse } from "../get-pokemon-species";
import { errorResponse, successResponse } from "@/shared/responses";
import { fetchJson } from "@/shared/clients/http-fetcher";
import {
  PokemonDataDTO,
  PokemonEvolutionChainDTO,
  PokemonSpeciesDataDTO,
} from "@/shared/clients/http-fetcher/dto";

type GetPokemonEvolutionChainResponse = [
  GetPokemonEvolutionChainFailureResponse,
  GetPokemonEvolutionChainSuccessResponse
];

export interface GetPokemonEvolutionChainFailureResponse {
  error?: Error;
  code?: number;
  hasError: boolean;
}
export interface GetPokemonEvolutionChainSuccessResponse {
  data: PokemonSpecies[] | null;
}

export const getPokemonEvolutionChain = async (
  name: string
): Promise<GetPokemonEvolutionChainResponse> => {
  const [error, pokemonSpeciesDataResult] =
    await fetchJson<PokemonSpeciesDataDTO>(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`
    );
  if (error.hasError) {
    return errorResponse(error.error!, error.code);
  }

  const speciesData = pokemonSpeciesDataResult.data!;

  const [errorChain, pokemonEvolutionChainResult] =
    await fetchJson<PokemonEvolutionChainDTO>(speciesData.evolution_chain.url);
  if (errorChain.hasError) {
    return errorResponse(errorChain.error!, errorChain.code);
  }

  const data = pokemonEvolutionChainResult.data!;

  const pokemons: string[] = [data.chain.species.name];
  pokemons.push(...extractEvolutionsRecursively(data.chain));

  const pokemonDataPromises = pokemons.map(async (pokemon) => {
    return getPokemonData(pokemon);
  });

  const pokemonDataPromisesResponse = await Promise.all(pokemonDataPromises);

  const [errorMappingResponse, pokemonDataResult] =
    mapPokemonDataPromisesResponse(pokemonDataPromisesResponse);

  if (errorMappingResponse.hasError) {
    return errorResponse(new Error("error fetching pokemon data"));
  }

  const evolutionChain = [...pokemonDataResult.data];

  return successResponse<PokemonSpecies[]>(evolutionChain);
};

type MapPokemonDataPromisesResponse = [
  { error: Error | null; hasError: boolean },
  {
    data: PokemonSpecies[];
  }
];

const getPokemonData = async (name: string) => {
  const [error, pokemonDataResult] = await fetchJson<PokemonDataDTO>(
    `https://pokeapi.co/api/v2/pokemon/${name}`
  );
  if (error.hasError) {
    return errorResponse(error.error!, error.code);
  }

  const data = pokemonDataResult.data!;

  const [errorPokemonSpecies, pokemonSpeciesDataResult] =
    await fetchJson<PokemonSpeciesDataDTO>(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`
    );
  if (errorPokemonSpecies.hasError) {
    return errorResponse(errorPokemonSpecies.error!, errorPokemonSpecies.code);
  }

  const speciesData = pokemonSpeciesDataResult.data!;

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

  const pokemonData = {
    id: data.id,
    name: data.name,
    imageUrl,
    generation: speciesData.generation.name,
    types: data.types.map((type: any) => type.type.name),
    evolutionChainId: speciesData.evolution_chain.url.split("/")[6],
    habitat: speciesData.habitat ? speciesData.habitat.name : "unknown",
    funFacts: speciesData.flavor_text_entries,
    stats: data.stats.reduce((acc: any, curr: any) => {
      return { ...acc, [curr.stat.name]: curr.base_stat };
    }, {}),
  };

  return successResponse<PokemonSpecies>(pokemonData);
};

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
