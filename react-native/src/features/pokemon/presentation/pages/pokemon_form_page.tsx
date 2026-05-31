import React, { useMemo, useState } from "react";
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import { PokemonEntry } from "../../domain/entities/pokemon_entry";
import { usePokemon } from "../context/pokemonContext";

type PokemonFormPageProps = {
  pokemon?: PokemonEntry | null;
  navigation: any;
};

export function PokemonFormPage({
  pokemon,
  navigation,
}: PokemonFormPageProps) {
  const { createPokemon, updatePokemon } = usePokemon();
  const isEditing = useMemo(
    () => pokemon != null,
    [pokemon],
  );

  const [name, setName] = useState(
    pokemon?.name ?? "",
  );

  const [url, setUrl] = useState(
    pokemon?.url ?? "",
  );

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (trimmedName.length === 0) {
      Alert.alert(
        "Validation",
        "Enter a name to continue.",
      );

      return;
    }

    try {
      if (isEditing && pokemon) {
        await updatePokemon(
          pokemon.copyWith({
            name: trimmedName,
            url:
              trimmedUrl.length === 0
                ? pokemon.url
                : trimmedUrl,
            updatedAt: new Date(),
          }),
        );
      } else {
        await createPokemon({
          name: trimmedName,
          url: trimmedUrl,
        });
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert(
        "Error",
        `Could not save Pokémon: ${error}`,
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>
            {isEditing
              ? "Edit memory record"
              : "Create new record"}
          </Text>

          <Text style={styles.headerSubtitle}>
            Changes are only stored while the app is
            running.
          </Text>
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Name</Text>

          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Pikachu"
            placeholderTextColor="#71717a"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>URL</Text>

          <TextInput
            value={url}
            onChangeText={setUrl}
            placeholder="https://pokeapi.co/api/v2/pokemon/25/"
            placeholderTextColor="#71717a"
            style={styles.input}
            autoCapitalize="none"
          />
        </View>

        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>
            {isEditing ? "Update" : "Create"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#09090b",
  },

  content: {
    padding: 20,
    gap: 20,
  },

  header: {
    padding: 24,
    borderRadius: 24,
    backgroundColor: "#312e81",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ffffff",
  },

  headerSubtitle: {
    marginTop: 8,
    fontSize: 15,
    color: "rgba(255,255,255,0.9)",
  },

  formGroup: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f4f4f5",
  },

  input: {
    borderWidth: 1,
    borderColor: "#27272a",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#ffffff",
    backgroundColor: "#18181b",
  },

  submitButton: {
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    backgroundColor: "#f4f4f5",
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#09090b",
  },
});