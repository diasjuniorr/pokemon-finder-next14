import { Pokemon, PokemonSpecies } from "@/entities/pokemon";
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

  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

  return successResponse<PokemonSpecies>({
    id: data!.id,
    name: data!.name,
    imageUrl: imageUrl,
    generation: speciesData.generation.name,
    types: result.data!.types.map((type: any) => type.type.name),
    habitat: speciesData.habitat ? speciesData.habitat.name : "unknown",
    evolutionChainId: speciesData.evolution_chain.url.split("/")[6],
    funFacts: speciesData.flavor_text_entries,
    stats: data!.stats.reduce((acc: any, curr: any) => {
      return { ...acc, [curr.stat.name]: curr.base_stat };
    }, {}),
  });
};
