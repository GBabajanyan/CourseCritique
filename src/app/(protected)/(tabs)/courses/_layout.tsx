import { Stack } from "expo-router";
import React from "react";

const _layout = () => {
  return (
    <Stack
    >
      <Stack.Screen
        options={{ headerShown: false }}
        name="/courses/FeedbackForm/[course]"
      />
      <Stack.Screen options={{ headerShown: false }} name="/courses/" />
    </Stack>
  );
};

export default _layout;
