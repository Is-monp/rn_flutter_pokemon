export class PokemonEntry {
  readonly id: string;
  readonly name: string;
  readonly url: string;
  readonly isLocal: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(params: {
    id: string;
    name: string;
    url: string;
    isLocal: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }) {
    this.id = params.id;
    this.name = params.name;
    this.url = params.url;
    this.isLocal = params.isLocal;

    this.createdAt = params.createdAt ?? new Date();
    this.updatedAt = params.updatedAt ?? params.createdAt ?? new Date();
  }

  copyWith(params: {
    id?: string;
    name?: string;
    url?: string;
    isLocal?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
  }): PokemonEntry {
    return new PokemonEntry({
      id: params.id ?? this.id,
      name: params.name ?? this.name,
      url: params.url ?? this.url,
      isLocal: params.isLocal ?? this.isLocal,
      createdAt: params.createdAt ?? this.createdAt,
      updatedAt: params.updatedAt ?? new Date(),
    });
  }

  get originLabel(): string {
    return this.isLocal ? "Local" : "PokeAPI";
  }

  get numericId(): number | null {
    const parsed = Number(this.id);
    return Number.isNaN(parsed) ? null : parsed;
  }

  toString(): string {
    return `PokemonEntry(id: ${this.id}, name: ${this.name}, url: ${this.url}, isLocal: ${this.isLocal})`;
  }
}