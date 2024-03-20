import { listPokemons } from "@/features/list-pokemons";
import PokemonDisplayList from "./components/pokemon-display-list";

const PokemonList = async () => {
  const list = await listPokemons();

  return <PokemonDisplayList list={list} />;
};

export default PokemonList;
