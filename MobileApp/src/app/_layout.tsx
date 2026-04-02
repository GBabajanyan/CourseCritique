import { Stack } from "expo-router";
import { observer } from "mobx-react";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { StoreProvider, useStore } from "../store/StoreProvider";

const RootLayout = observer(() => {
  const { authStore } = useStore();
  const { isAuthenticated } = authStore;

  return (
    <StoreProvider>
      <SafeAreaProvider>
        <Stack screenOptions={{ animation: "none" }}>
          <Stack.Protected guard={!!isAuthenticated}>
            <Stack.Screen name="(protected)" options={{ headerShown: false }} />
          </Stack.Protected>

          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="Login" options={{ headerShown: false }} />
          </Stack.Protected>
        </Stack>
      </SafeAreaProvider>
    </StoreProvider>
  );
});

export default RootLayout;
