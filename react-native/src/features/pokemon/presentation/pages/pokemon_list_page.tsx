import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { PokemonEntry } from "../../domain/entities/pokemon_entry";
import { PokemonController } from "../controllers/pokemon_controller";

type PokemonListPageProps = {
  controller: PokemonController;
  navigation: any;
};

export function PokemonListPage({
  controller,
  navigation,
}: PokemonListPageProps) {
  const flatListRef =
    useRef<FlatList<PokemonEntry>>(null);

  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      forceUpdate((value) => value + 1);
    }, 250);

    return () => clearInterval(interval);
  }, []);

  const handleScroll = ({
    nativeEvent,
  }: any) => {
    const threshold =
      nativeEvent.contentSize.height * 0.8;

    if (
      nativeEvent.contentOffset.y +
        nativeEvent.layoutMeasurement.height >=
      threshold
    ) {
      controller.loadMore();
    }
  };

  const renderFooter = () => {
    if (!controller.isLoadingMore) {
      return null;
    }

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator color="#ffffff" />
      </View>
    );
  };

  if (
    controller.isLoading &&
    controller.items.length === 0
  ) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e53935" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TopBanner
        totalItems={controller.items.length}
        hasMore={controller.hasMore}
      />

      {controller.items.length === 0 ? (
        <FlatList
          data={[]}
          renderItem={null as any}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No Pokémon cargados.
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={controller.isLoading}
              onRefresh={() =>
                controller.refreshVisibleList()
              }
            />
          }
        />
      ) : (
        <FlatList
          ref={flatListRef}
          data={controller.items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          refreshControl={
            <RefreshControl
              refreshing={controller.isLoading}
              onRefresh={() =>
                controller.refreshVisibleList()
              }
            />
          }
          ListFooterComponent={renderFooter}
          renderItem={({ item }) => (
            <PokemonCard
              pokemon={item}
              onTap={() => {
                navigation.navigate(
                  "PokemonDetail",
                  { pokemon: item },
                );
              }}
              onEdit={() => {
                navigation.navigate(
                  "PokemonForm",
                  { pokemon: item },
                );
              }}
            />
          )}
        />
      )}

      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => {
          navigation.navigate("PokemonForm");
        }}
      >
        <Ionicons name="add" size={20} color="#ffffff" />
        <Text style={styles.fabText}>Crear</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

type TopBannerProps = {
  totalItems: number;
  hasMore: boolean;
};

function TopBanner({ totalItems }: TopBannerProps) {
  return (
    <LinearGradient
      colors={["#e53935", "#f57c00"]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={styles.banner}
    >
      <View style={styles.bannerIcon}>
        <MaterialCommunityIcons
          name="pokeball"
          size={36}
          color="#ffffff"
        />
      </View>

      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>
          Pokémon Dex
        </Text>

        <Text style={styles.bannerSubtitle}>
          REST consumption + local crud in memory
        </Text>
      </View>

      <View style={styles.bannerCounter}>
        <Text style={styles.bannerCount}>
          {totalItems}
        </Text>

        <Text style={styles.bannerCountLabel}>
          records
        </Text>
      </View>
    </LinearGradient>
  );
}

type PokemonCardProps = {
  pokemon: PokemonEntry;
  onTap: () => void;
  onEdit: () => void;
};

function PokemonCard({
  pokemon,
  onTap,
  onEdit,
}: PokemonCardProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onTap}
      style={styles.card}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {pokemon.numericId?.toString() ??
            pokemon.name
              .charAt(0)
              .toUpperCase()}
        </Text>
      </View>

      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>
          {pokemon.name}
        </Text>

        <Text
          style={styles.cardUrl}
          numberOfLines={1}
        >
          {pokemon.url}
        </Text>

        <View style={styles.chips}>
          <View style={styles.chip}>
            <Text style={styles.chipText}>
              {pokemon.originLabel}
            </Text>
          </View>

          {pokemon.isLocal && (
            <View style={styles.chip}>
              <Text style={styles.chipText}>
                Local
              </Text>
            </View>
          )}
        </View>
      </View>

      <TouchableOpacity
        onPress={onEdit}
        style={styles.editButton}
        hitSlop={8}
      >
        <Ionicons
          name="pencil"
          size={18}
          color="#888888"
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e8",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f0e8",
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
    paddingTop: 8,
    gap: 12,
  },

  emptyContainer: {
    marginTop: 120,
    alignItems: "center",
  },

  emptyText: {
    fontSize: 16,
    color: "#71717a",
  },

  banner: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 20,
    borderRadius: 28,
  },

  bannerIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.18)",
  },

  bannerContent: {
    flex: 1,
    marginLeft: 16,
  },

  bannerTitle: {
    fontSize: 28,
    fontWeight: "800",
    color: "#ffffff",
  },

  bannerSubtitle: {
    marginTop: 4,
    fontSize: 14,
    color: "rgba(255,255,255,0.92)",
  },

  bannerCounter: {
    alignItems: "flex-end",
  },

  bannerCount: {
    fontSize: 28,
    fontWeight: "900",
    color: "#ffffff",
  },

  bannerCountLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
  },

  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 22,
    backgroundColor: "#1a1a1a",
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5e098",
  },

  avatarText: {
    fontWeight: "800",
    fontSize: 16,
    color: "#78350f",
  },

  cardContent: {
    flex: 1,
    marginLeft: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#ffffff",
    textTransform: "capitalize",
  },

  cardUrl: {
    marginTop: 4,
    fontSize: 13,
    color: "#9ca3af",
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 8,
  },

  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#2d2d2d",
  },

  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#d1d5db",
  },

  editButton: {
    padding: 8,
    marginLeft: 8,
  },

  footerLoader: {
    paddingVertical: 24,
  },

  fab: {
    position: "absolute",
    right: 20,
    bottom: 24,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: "#3d3520",
    gap: 8,
  },

  fabText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#ffffff",
  },
});
