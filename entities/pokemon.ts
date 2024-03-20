export interface Pokemon {
  name: string;
  url: string;
}

export interface PokemonData {
  name: string;
  url: string;
  imageUrl: string;
  types: string[];
  stats: PokemonStats;
}

export interface PokemonSpecies {
  name: string;
  imageUrl: string;
  generation: string;
  types: string[];
  evolutionChainId: number;
  stats: PokemonStats;
}

interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  specialAttack: number;
  specialDefense: number;
  speed: number;
}
