import { PokemonEntry } from './pokemon_entry';

export class PokemonCollection {
  readonly items: PokemonEntry[];
  readonly hasMore: boolean;

  constructor(params: {
    items: PokemonEntry[];
    hasMore: boolean;
  }) {
    this.items = params.items;
    this.hasMore = params.hasMore;
  }
}