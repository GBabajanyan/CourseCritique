import { Stack } from "expo-router";
import React from "react";

const RootLayout = () => {
  return (
    <React.Fragment>
      <Stack>
        <Stack.Screen
          name="(protected)"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
    </React.Fragment>
  );
};

export default RootLayout;
