import axios, { AxiosInstance } from "axios";
import { PokemonApiPage } from "../models/pokemon_api_page";

export class PokemonRemoteDataSource {
  private static readonly BASE_URL = "https://pokeapi.co/api/v2/pokemon";

  constructor(
    private readonly httpClient: AxiosInstance = axios,
  ) {}

  async fetchPage(nextUrl?: string): Promise<PokemonApiPage> {
    const url =
      nextUrl ??
      `${PokemonRemoteDataSource.BASE_URL}?limit=20&offset=0`;

    const start = performance.now();
    const response = await this.httpClient.get(url);
    const end = performance.now();

    console.log(`[API] fetchPage → ${(end - start).toFixed(2)}ms | URL: ${url}`);


    if (response.status !== 200) {
      throw new Error(
        `No se pudo consultar PokeAPI (${response.status})`,
      );
    }

    return PokemonApiPage.fromJson(response.data);
  }
}