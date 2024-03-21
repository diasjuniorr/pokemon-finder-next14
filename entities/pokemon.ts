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

export const TYPE_COLORS = {
  normal: "bg-normal",
  bug: "bg-bug",
  dark: "bg-dark",
  dragon: "bg-dragon",
  electric: "bg-electric",
  fairy: "bg-fairy",
  fighting: "bg-fighting",
  fire: "bg-fire",
  flying: "bg-flying",
  ghost: "bg-ghost",
  grass: "bg-grass",
  ground: "bg-ground",
  ice: "bg-ice",
  poison: "bg-poison",
  psychic: "bg-psychic",
  rock: "bg-rock",
  steel: "bg-steel",
  water: "bg-water",
} as const;

export type TColorsKeys = keyof typeof TYPE_COLORS;
