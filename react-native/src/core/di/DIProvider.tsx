import React, { createContext, useContext, useMemo } from "react";

import { TOKENS } from "./tokens";

import { PokemonMemoryDataSource } from "@/src/features/pokemon/data/datasources/pokemon_memory_data_source";
import { PokemonRemoteDataSource } from "@/src/features/pokemon/data/datasources/pokemon_remote_data_source";
import { PokemonRepositoryImpl } from "@/src/features/pokemon/data/repositories/pokemon_repository_impl";
import { Container } from "./container";
const DIContext = createContext<Container | null>(null);

export function DIProvider({ children }: { children: React.ReactNode }) {
    //useMemo is a React Hook that lets you cache the result of a calculation between re-renders.
    const container = useMemo(() => {
        const c = new Container();

        const pokemonRemoteDS = new PokemonRemoteDataSource();
        const pokemonMemoryDS = new PokemonMemoryDataSource();
        const pokemonRepo = new PokemonRepositoryImpl(pokemonRemoteDS, pokemonMemoryDS);

        c.register(TOKENS.PokemonRemoteDS, pokemonRemoteDS)
            .register(TOKENS.PokemonMemoryDS, pokemonMemoryDS)
            .register(TOKENS.PokemonRepo, pokemonRepo);

        return c;
    }, []);

    return <DIContext.Provider value={container}>{children}</DIContext.Provider>;
}

export function useDI() {
    const c = useContext(DIContext);
    if (!c) throw new Error("DIProvider missing");
    return c;
}
