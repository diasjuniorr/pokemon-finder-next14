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
  habitat: string;
  funFacts: PokemonFunFact[];
  stats: PokemonStats;
}

export interface PokemonFunFact {
  flavor_text: string;
  language: {
    name: string;
  };
}

interface PokemonStats {
  hp: number;
  attack: number;
  defense: number;
  "special-attack": number;
  "special-defense": number;
  speed: number;
}
