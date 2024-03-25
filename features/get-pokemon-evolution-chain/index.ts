import { PokemonSpecies } from "@/entities/pokemon";
import { GetPokemonSpeciesResponse } from "../get-pokemon-species";
import { errorResponse, successResponse } from "@/shared/responses";

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
  try {
    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`
    );

    if (speciesResponse.status === 404) {
      return errorResponse(new Error("Pokemon species not found"), 404);
    }

    const speciesData = await speciesResponse.json();

    const response = await fetch(speciesData.evolution_chain.url);

    if (response.status == 404) {
      return errorResponse(new Error("evolution chain not found"), 404);
    }

    const data = await response.json();

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
  } catch (error) {
    console.log("error fetching pokemon data");
    return errorResponse(new Error("error fetching pokemon data"));
  }
};

type MapPokemonDataPromisesResponse = [
  { error: Error | null; hasError: boolean },
  {
    data: PokemonSpecies[];
  }
];

const getPokemonData = async (name: string) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);

    if (response.status === 404) {
      return errorResponse(new Error("Pokemon not found"), 404);
    }

    const data = await response.json();

    const speciesResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${name}`
    );

    if (speciesResponse.status === 404) {
      return errorResponse(new Error("Pokemon species not found"), 404);
    }

    const speciesData = await speciesResponse.json();

    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${data.id}.png`;

    const pokemonData = {
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
      }),
    };

    return successResponse<PokemonSpecies>(pokemonData);
  } catch (error) {
    console.log("Error fetching pokemon data", error);
    return errorResponse(new Error("Error fetching pokemon data"));
  }
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
