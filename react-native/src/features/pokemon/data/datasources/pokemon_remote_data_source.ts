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

    const response = await this.httpClient.get(url);

    if (response.status !== 200) {
      throw new Error(
        `No se pudo consultar PokeAPI (${response.status})`,
      );
    }

    return PokemonApiPage.fromJson(response.data);
  }
}