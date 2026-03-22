import CustomHeader from "@/src/components/header/customHeader";
import { Stack } from "expo-router";
import React from "react";

const ProtectedLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          // headerShown: false,
          header: (props) => <CustomHeader />,
        }}
      />
    </Stack>
  );
};

export default ProtectedLayout;
