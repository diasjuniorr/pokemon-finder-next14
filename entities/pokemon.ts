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
  normal: "bg-[#EAE8E1]",
  bug: "bg-[#BAC226]",
  dark: "bg-[#756D63]",
  dragon: "bg-[#A99FE9]",
  electric: "bg-[#F4BE6E]",
  fairy: "bg-[#F4CFF0]",
  fighting: "bg-[#B27650]",
  fire: "bg-[#FF7F70]",
  flying: "bg-[#AFC7FF]",
  ghost: "bg-[#A5A5C9]",
  grass: "bg-[#9FD360]",
  ground: "bg-[#D4B881]",
  ice: "bg-[#C9F3FF]",
  poison: "bg-[#B58DBF]",
  psychic: "bg-[#F1A9C4]",
  rock: "bg-[#93836C]",
  steel: "bg-[#ABB4B8]",
  water: "bg-[#72BBFF]",
} as const;

export type TColorsKeys = keyof typeof TYPE_COLORS;
