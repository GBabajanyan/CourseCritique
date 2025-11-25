import { Redirect, Stack } from "expo-router";
import React from "react";

const isLoggedIn = true;

const ProtectedLayout = () => {
  if (!isLoggedIn) {
    return <Redirect href="/Login" />;
  }
  return (
    <Stack>
      <Stack.Screen name="(tabs)"
       options={{ headerShown: false }} 
       />
    </Stack>
  );
};

export default ProtectedLayout;
