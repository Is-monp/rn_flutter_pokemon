import { PokemonCollection } from "../../domain/entities/pokemon_collection";
import { PokemonEntry } from "../../domain/entities/pokemon_entry";
import { PokemonRepository } from "../../domain/repositories/pokemon_repository";

import { PokemonMemoryDataSource } from "../datasources/pokemon_memory_data_source";
import { PokemonRemoteDataSource } from "../datasources/pokemon_remote_data_source";
import { PokemonApiResult } from "../models/pokemon_api_page";

export class PokemonRepositoryImpl implements PokemonRepository {
  private nextPageUrl: string | null = null;
  private isInitialLoaded = false;

  constructor(
    private readonly remoteDataSource: PokemonRemoteDataSource,
    private readonly memoryDataSource: PokemonMemoryDataSource,
  ) {}

  async loadInitial(): Promise<PokemonCollection> {
    if (
      this.isInitialLoaded &&
      this.memoryDataSource.items.length > 0
    ) {
      return this.memoryDataSource.snapshot({
        hasMore: this.nextPageUrl !== null,
      });
    }

    const page = await this.remoteDataSource.fetchPage();

    const entries = page.results.map((result) =>
      this.toEntry(result),
    );

    this.nextPageUrl = page.next;
    this.isInitialLoaded = true;

    this.memoryDataSource.replaceAll(entries);

    return this.memoryDataSource.snapshot({
      hasMore: this.nextPageUrl !== null,
    });
  }

  async loadMore(): Promise<PokemonCollection> {
    if (this.nextPageUrl === null) {
      return this.memoryDataSource.snapshot({
        hasMore: false,
      });
    }

    const page = await this.remoteDataSource.fetchPage(
      this.nextPageUrl,
    );

    const entries = page.results.map((result) =>
      this.toEntry(result),
    );

    this.nextPageUrl = page.next;

    this.memoryDataSource.appendAll(entries);

    return this.memoryDataSource.snapshot({
      hasMore: this.nextPageUrl !== null,
    });
  }

  async createPokemon(params: {
    name: string;
    url: string;
  }): Promise<PokemonCollection> {
    const now = new Date();

    const entry = new PokemonEntry({
      id: `local-${Date.now()}`,
      name: params.name.trim(),
      url:
        params.url.trim().length === 0
          ? this.buildLocalUrl(params.name)
          : params.url.trim(),
      isLocal: true,
      createdAt: now,
      updatedAt: now,
    });

    this.memoryDataSource.upsert(entry);

    return this.memoryDataSource.snapshot({
      hasMore: this.nextPageUrl !== null,
    });
  }

  async updatePokemon(
    pokemon: PokemonEntry,
  ): Promise<PokemonCollection> {
    this.memoryDataSource.upsert(
      pokemon.copyWith({
        name: pokemon.name.trim(),
        url:
          pokemon.url.trim().length === 0
            ? this.buildLocalUrl(pokemon.name)
            : pokemon.url.trim(),
        updatedAt: new Date(),
      }),
    );

    return this.memoryDataSource.snapshot({
      hasMore: this.nextPageUrl !== null,
    });
  }

  async deletePokemon(id: string): Promise<PokemonCollection> {
    this.memoryDataSource.removeById(id);

    return this.memoryDataSource.snapshot({
      hasMore: this.nextPageUrl !== null,
    });
  }

  async findById(id: string): Promise<PokemonEntry | null> {
    return this.memoryDataSource.findById(id);
  }

  private toEntry(result: PokemonApiResult): PokemonEntry {
    const match = result.url.match(/\/(\d+)\/?$/);

    const id = match?.[1] ?? result.name;

    const now = new Date();

    return new PokemonEntry({
      id,
      name: result.name,
      url: result.url,
      isLocal: false,
      createdAt: now,
      updatedAt: now,
    });
  }

  private buildLocalUrl(name: string): string {
    const normalized = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-");

    const slug = normalized.replace(/^-|-$/g, "");

    return `local://pokemon/${
      slug.length === 0 ? "untitled" : slug
    }`;
  }
}