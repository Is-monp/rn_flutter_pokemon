import { PokemonCollection } from "../../domain/entities/pokemon_collection";
import { PokemonEntry } from "../../domain/entities/pokemon_entry";

export class PokemonMemoryDataSource {
  private readonly _items: PokemonEntry[] = [];

  get items(): ReadonlyArray<PokemonEntry> {
    return [...this._items];
  }

  replaceAll(items: Iterable<PokemonEntry>): void {
    this._items.length = 0;
    this._items.push(...items);
  }

  appendAll(items: Iterable<PokemonEntry>): void {
    for (const item of items) {
      const index = this._items.findIndex(
        (current) => current.id === item.id,
      );

      if (index === -1) {
        this._items.push(item);
      } else {
        this._items[index] = item;
      }
    }
  }

  upsert(pokemon: PokemonEntry): void {
    const index = this._items.findIndex(
      (current) => current.id === pokemon.id,
    );

    if (index === -1) {
      this._items.push(pokemon);
    } else {
      this._items[index] = pokemon;
    }
  }

  removeById(id: string): boolean {
    const index = this._items.findIndex(
      (current) => current.id === id,
    );

    if (index === -1) {
      return false;
    }

    this._items.splice(index, 1);
    return true;
  }

  findById(id: string): PokemonEntry | null {
    for (const item of this._items) {
      if (item.id === id) {
        return item;
      }
    }

    return null;
  }

  snapshot(params: { hasMore: boolean }): PokemonCollection {
    return new PokemonCollection({
      items: [...this._items],
      hasMore: params.hasMore,
    });
  }
}