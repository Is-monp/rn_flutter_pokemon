import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useDI } from "@/src/core/di/DIProvider";
import { TOKENS } from "@/src/core/di/tokens";
import { PokemonEntry } from "../../domain/entities/pokemon_entry";
import { PokemonRepository } from "../../domain/repositories/pokemon_repository";

type PokemonContextType = {
  items: PokemonEntry[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  errorMessage: string;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  createPokemon: (params: { name: string; url: string }) => Promise<void>;
  updatePokemon: (pokemon: PokemonEntry) => Promise<void>;
  deletePokemon: (id: string) => Promise<void>;
  findById: (id: string) => Promise<PokemonEntry | null>;
};

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

export function PokemonProvider({ children }: { children: React.ReactNode }) {
  const di = useDI();
  const repo = useMemo(() => di.resolve<PokemonRepository>(TOKENS.PokemonRepo), [di]);

  const [items, setItems] = useState<PokemonEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const applySnapshot = (snapshot: { items: PokemonEntry[]; hasMore: boolean }) => {
    setItems(snapshot.items);
    setHasMore(snapshot.hasMore);
  };

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const snapshot = await repo.loadInitial();
      applySnapshot(snapshot);
    } catch {
      setErrorMessage("No se pudo cargar la lista de Pokémon.");
    } finally {
      setIsLoading(false);
    }
  }, [repo]);

  useEffect(() => {
    refresh();
  }, []);

  const loadMore = useCallback(async () => {
    if (isLoading || isLoadingMore || !hasMore) return;
    setIsLoadingMore(true);
    try {
      const snapshot = await repo.loadMore();
      applySnapshot(snapshot);
    } catch {
      setErrorMessage("No se pudieron cargar más Pokémon.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoading, isLoadingMore, hasMore, repo]);

  const createPokemon = async (params: { name: string; url: string }) => {
    const snapshot = await repo.createPokemon(params);
    applySnapshot(snapshot);
  };

  const updatePokemon = async (pokemon: PokemonEntry) => {
    const snapshot = await repo.updatePokemon(pokemon);
    applySnapshot(snapshot);
  };

  const deletePokemon = async (id: string) => {
    const snapshot = await repo.deletePokemon(id);
    applySnapshot(snapshot);
  };

  const findById = (id: string) => repo.findById(id);

  const value = useMemo<PokemonContextType>(
    () => ({
      items,
      isLoading,
      isLoadingMore,
      hasMore,
      errorMessage,
      loadMore,
      refresh,
      createPokemon,
      updatePokemon,
      deletePokemon,
      findById,
    }),
    [items, isLoading, isLoadingMore, hasMore, errorMessage, loadMore, refresh],
  );

  return (
    <PokemonContext.Provider value={value}>
      {children}
    </PokemonContext.Provider>
  );
}

export function usePokemon() {
  const ctx = useContext(PokemonContext);
  if (!ctx) throw new Error("usePokemon must be used inside PokemonProvider");
  return ctx;
}
