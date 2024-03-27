import { PokemonSpecies } from "@/entities/pokemon";
import {
  PokemonDataDTO,
  PokemonSpeciesDataDTO,
} from "@/shared/clients/http-fetcher/dto";

export const newPokemonSpecies = (
  pokemonData: PokemonDataDTO,
  speciesData: PokemonSpeciesDataDTO
): PokemonSpecies => {
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonData.id}.png`;

  return {
    id: pokemonData.id,
    name: pokemonData.name,
    imageUrl,
    generation: speciesData.generation.name,
    types: pokemonData.types.map((type: any) => type.type.name),
    evolutionChainId: speciesData.evolution_chain.url.split("/")[6],
    habitat: speciesData.habitat ? speciesData.habitat.name : "unknown",
    funFacts: speciesData.flavor_text_entries,
    stats: pokemonData.stats.reduce((acc: any, curr: any) => {
      return { ...acc, [curr.stat.name]: curr.base_stat };
    }, {}),
  };
};
