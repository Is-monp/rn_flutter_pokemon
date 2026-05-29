import { PokemonCollection } from '../entities/pokemon_collection';
import { PokemonEntry } from '../entities/pokemon_entry';

export interface PokemonRepository {
  loadInitial(): Promise<PokemonCollection>;

  loadMore(): Promise<PokemonCollection>;

  createPokemon(params: {
    name: string;
    url: string;
  }): Promise<PokemonCollection>;

  updatePokemon(pokemon: PokemonEntry): Promise<PokemonCollection>;

  deletePokemon(id: string): Promise<PokemonCollection>;

  findById(id: string): Promise<PokemonEntry | null>;
}