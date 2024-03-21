import { Pokemon, PokemonSpecies } from "@/entities/pokemon";

export type ListPokemonDataResponse = [
  ListPokemonDataFailureResponse,
  ListPokemonDataSuccessResponse
];

export interface ListPokemonDataFailureResponse {
  error: Error | null;
  hasError: boolean;
}
export interface ListPokemonDataSuccessResponse {
  data: PokemonSpecies[] | null;
}

export const listPokemonData = async (
  pokemons: Pokemon[]
): Promise<ListPokemonDataResponse> => {
  const speciesResponsePromises = pokemons.map(async (pokemon) => {
    const pokemonResponse = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemon.name}`
    );
    const pokemonData = await pokemonResponse.json();

    const result = await fetch(
      `https://pokeapi.co/api/v2/pokemon-species/${pokemon.name}`
    );
    const speciesData = await result.json();

    const id = pokemonData.id;
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return {
      name: pokemon.name,
      imageUrl,
      types: pokemonData.types.map((type: any) => type.type.name),
      habitat: speciesData.habitat.name,
      funFacts: [],
      stats: pokemonData.stats.reduce((acc: any, curr: any) => {
        return { ...acc, [curr.stat.name]: curr.base_stat };
      }),
      generation: speciesData.generation.name,
      evolutionChainId: speciesData.evolution_chain.url.split("/")[6],
    };
  });

  const promisesResponse = await Promise.allSettled(speciesResponsePromises);

  const [errorMapping, data] = mapPromiseResponses(promisesResponse);
  if (errorMapping.hasError) {
    return [errorMapping, data];
  }

  return [
    {
      error: null,
      hasError: false,
    },
    data,
  ];
};

const mapPromiseResponses = (
  promisesResponse: PromiseSettledResult<PokemonSpecies>[]
): [
  { error: Error | null; hasError: boolean },
  { data: PokemonSpecies[] | null }
] => {
  const hasError = promisesResponse.some(
    (response) => response.status === "rejected"
  );

  if (hasError) {
    return [
      {
        error: new Error("Failed to fetch data"),
        hasError: true,
      },
      { data: null },
    ];
  }

  const successResponse = promisesResponse.map(
    (response) => (response as PromiseFulfilledResult<PokemonSpecies>).value
  );

  return [
    {
      error: null,
      hasError: false,
    },
    {
      data: successResponse,
    },
  ];
};
