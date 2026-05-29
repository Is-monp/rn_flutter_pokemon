import { PokemonCollection } from "../../domain/entities/pokemon_collection";
import { PokemonEntry } from "../../domain/entities/pokemon_entry";
import { PokemonRepository } from "../../domain/repositories/pokemon_repository";

export class PokemonController {
  constructor(
    private readonly repository: PokemonRepository,
  ) {
    this.loadInitial();
  }

  items: PokemonEntry[] = [];

  isLoading = false;

  isLoadingMore = false;

  hasMore = true;

  errorMessage = "";

  async loadInitial(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = "";

    try {
      const snapshot =
        await this.repository.loadInitial();

      this.applySnapshot(snapshot);
    } catch (error) {
      this.errorMessage =
        "No se pudo cargar la lista de Pokémon.";
    } finally {
      this.isLoading = false;
    }
  }

  async loadMore(): Promise<void> {
    if (
      this.isLoading ||
      this.isLoadingMore ||
      !this.hasMore
    ) {
      return;
    }

    this.isLoadingMore = true;

    try {
      const snapshot =
        await this.repository.loadMore();

      this.applySnapshot(snapshot);
    } catch (error) {
      this.errorMessage =
        "No se pudieron cargar más Pokémon.";
    } finally {
      this.isLoadingMore = false;
    }
  }

  async refreshVisibleList(): Promise<void> {
    await new Promise((resolve) =>
      setTimeout(resolve, 250),
    );

    this.items = [...this.items];
  }

  async createPokemon(params: {
    name: string;
    url: string;
  }): Promise<void> {
    const snapshot =
      await this.repository.createPokemon(params);

    this.applySnapshot(snapshot);
  }

  async updatePokemon(
    pokemon: PokemonEntry,
  ): Promise<void> {
    const snapshot =
      await this.repository.updatePokemon(pokemon);

    this.applySnapshot(snapshot);
  }

  async deletePokemon(id: string): Promise<void> {
    const snapshot =
      await this.repository.deletePokemon(id);

    this.applySnapshot(snapshot);
  }

  findById(
    id: string,
  ): Promise<PokemonEntry | null> {
    return this.repository.findById(id);
  }

  private applySnapshot(
    snapshot: PokemonCollection,
  ): void {
    this.items = snapshot.items;
    this.hasMore = snapshot.hasMore;
  }
}