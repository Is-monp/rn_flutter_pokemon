export class PokemonApiPage {
  readonly count: number;
  readonly next: string | null;
  readonly previous: string | null;
  readonly results: PokemonApiResult[];

  constructor(params: {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonApiResult[];
  }) {
    this.count = params.count;
    this.next = params.next;
    this.previous = params.previous;
    this.results = params.results;
  }

  static fromJson(json: Record<string, any>): PokemonApiPage {
    const rawResults = Array.isArray(json.results)
      ? json.results
      : [];

    return new PokemonApiPage({
      count: json.count ?? 0,
      next: json.next ?? null,
      previous: json.previous ?? null,
      results: rawResults.map(
        (item) => PokemonApiResult.fromJson(item),
      ),
    });
  }
}

export class PokemonApiResult {
  readonly name: string;
  readonly url: string;

  constructor(params: {
    name: string;
    url: string;
  }) {
    this.name = params.name;
    this.url = params.url;
  }

  static fromJson(json: Record<string, any>): PokemonApiResult {
    return new PokemonApiResult({
      name: json.name ?? "unknown",
      url: json.url ?? "",
    });
  }
}