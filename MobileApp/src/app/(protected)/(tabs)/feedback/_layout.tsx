import { Stack } from "expo-router";
import React from "react";
const _layout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="Pending" />
      <Stack.Screen name="Completed" />
      <Stack.Screen name="Search" />
    </Stack>
  );
};

export default _layout;
