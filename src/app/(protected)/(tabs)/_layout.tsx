import { Entypo } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Text } from "react-native";

const BottomTabsNavigator = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#007AFF",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Course Critique",
          tabBarIcon: () => <Entypo name="home" size={24} color="black" />,
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          title: "Course Feedback",
          tabBarIcon: ({ focused, color, size }) => (
            <Text>{focused ? "📝" : "📋"}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "My Profile",
          tabBarIcon: ({ focused, color, size }) => <Text> 👤</Text>,
        }}
      />
    </Tabs>
  );
};

export default BottomTabsNavigator;
