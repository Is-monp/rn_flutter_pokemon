import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { PokemonEntry } from "../../domain/entities/pokemon_entry";
import { PokemonController } from "../controllers/pokemon_controller";

type PokemonDetailPageProps = {
  pokemon: PokemonEntry;
  controller: PokemonController;
  navigation: any;
};

export function PokemonDetailPage({
  pokemon,
  controller,
  navigation,
}: PokemonDetailPageProps) {
  const handleDelete = async () => {
    await controller.deletePokemon(pokemon.id);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{pokemon.name}</Text>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              navigation.navigate("PokemonForm", {
                pokemon,
              })
            }
          >
            <Text style={styles.actionText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.deleteButton,
            ]}
            onPress={handleDelete}
          >
            <Text style={styles.actionText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <HeroCard pokemon={pokemon} />

        <DetailTile label="ID" value={pokemon.id} />

        <DetailTile
          label="Origin"
          value={pokemon.originLabel}
        />

        <DetailTile label="URL" value={pokemon.url} />

        <DetailTile
          label="Created"
          value={pokemon.createdAt.toLocaleString()}
        />

        <DetailTile
          label="Updated"
          value={pokemon.updatedAt.toLocaleString()}
        />

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("PokemonForm", {
              pokemon,
            })
          }
        >
          <Text style={styles.primaryButtonText}>
            Edit record
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

type HeroCardProps = {
  pokemon: PokemonEntry;
};

function HeroCard({ pokemon }: HeroCardProps) {
  return (
    <View
      style={[
        styles.heroCard,
        pokemon.isLocal
          ? styles.localGradient
          : styles.remoteGradient,
      ]}
    >
      <Text style={styles.heroTitle}>
        {pokemon.name}
      </Text>

      <Text style={styles.heroSubtitle}>
        {pokemon.originLabel} memory record
      </Text>
    </View>
  );
}

type DetailTileProps = {
  label: string;
  value: string;
};

function DetailTile({
  label,
  value,
}: DetailTileProps) {
  return (
    <View style={styles.detailTile}>
      <Text style={styles.detailLabel}>{label}</Text>

      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#27272a",
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff",
    textTransform: "capitalize",
  },

  actions: {
    flexDirection: "row",
    gap: 8,
  },

  actionButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3f3f46",
    backgroundColor: "#18181b",
  },

  deleteButton: {
    borderColor: "#7f1d1d",
  },

  actionText: {
    color: "#ffffff",
    fontWeight: "600",
  },

  content: {
    padding: 20,
    gap: 14,
  },

  heroCard: {
    padding: 28,
    borderRadius: 28,
    marginBottom: 8,
  },

  localGradient: {
    backgroundColor: "#c2410c",
  },

  remoteGradient: {
    backgroundColor: "#b45309",
  },

  heroTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#ffffff",
    textTransform: "capitalize",
  },

  heroSubtitle: {
    marginTop: 8,
    fontSize: 17,
    color: "rgba(255,255,255,0.9)",
  },

  detailTile: {
    padding: 18,
    borderRadius: 18,
    backgroundColor: "#18181b",
  },

  detailLabel: {
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#a1a1aa",
  },

  detailValue: {
    fontSize: 16,
    color: "#f4f4f5",
  },

  primaryButton: {
    marginTop: 24,
    paddingVertical: 16,
    borderRadius: 18,
    backgroundColor: "#f4f4f5",
    alignItems: "center",
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#09090b",
  },
});