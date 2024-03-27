export interface PokemonSpeciesDataDTO {
  id: number;
  name: string;
  generation: { name: string };
  types: { type: { name: string } }[];
  habitat: { name: string } | null;
  evolution_chain: { url: string };
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

export interface PokemonDataDTO {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
}

export interface PokemonEvolutionChainDTO {
  chain: Chain;
}

interface Chain {
  species: {
    name: string;
  };
  evolves_to: Chain[];
}
