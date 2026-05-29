import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { PokemonMemoryDataSource } from "./features/pokemon/data/datasources/pokemon_memory_data_source";
import { PokemonRemoteDataSource } from "./features/pokemon/data/datasources/pokemon_remote_data_source";
import { PokemonRepositoryImpl } from "./features/pokemon/data/repositories/pokemon_repository_impl";

import { PokemonController } from "./features/pokemon/presentation/controllers/pokemon_controller";

import { PokemonDetailPage } from "./features/pokemon/presentation/pages/pokemon_detail_page";
import { PokemonFormPage } from "./features/pokemon/presentation/pages/pokemon_form_page";
import { PokemonListPage } from "./features/pokemon/presentation/pages/pokemon_list_page";

const Stack = createNativeStackNavigator();

const remoteDataSource = new PokemonRemoteDataSource();
const memoryDataSource = new PokemonMemoryDataSource();
const repository = new PokemonRepositoryImpl(remoteDataSource, memoryDataSource);
const pokemonController = new PokemonController(repository);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="PokemonList">
          {(props) => (
            <PokemonListPage
              {...props}
              controller={pokemonController}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="PokemonDetail">
          {(props: any) => (
            <PokemonDetailPage
              {...props}
              pokemon={props.route.params?.pokemon}
              controller={pokemonController}
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="PokemonForm">
          {(props: any) => (
            <PokemonFormPage
              {...props}
              pokemon={
                props.route.params?.pokemon
              }
              controller={pokemonController}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}