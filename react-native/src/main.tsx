import React from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DIProvider } from "./core/di/DIProvider";
import { PokemonProvider } from "./features/pokemon/presentation/context/pokemonContext";
import { PokemonDetailPage } from "./features/pokemon/presentation/pages/pokemon_detail_page";
import { PokemonFormPage } from "./features/pokemon/presentation/pages/pokemon_form_page";
import { PokemonListPage } from "./features/pokemon/presentation/pages/pokemon_list_page";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <DIProvider>
      <PokemonProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="PokemonList">
              {(props) => <PokemonListPage {...props} />}
            </Stack.Screen>

            <Stack.Screen name="PokemonDetail">
              {(props: any) => (
                <PokemonDetailPage
                  {...props}
                  pokemon={props.route.params?.pokemon}
                />
              )}
            </Stack.Screen>

            <Stack.Screen name="PokemonForm">
              {(props: any) => (
                <PokemonFormPage
                  {...props}
                  pokemon={props.route.params?.pokemon}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </PokemonProvider>
    </DIProvider>
  );
}
