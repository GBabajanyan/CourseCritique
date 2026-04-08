import { BlurView } from "expo-blur";
import { Tabs, usePathname } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
const _layout = () => {
  const activeTab = usePathname();
  const isFeedbackPage = activeTab.includes("Feedback");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: "top",
        popToTopOnBlur: true,
        tabBarIconStyle: { display: "none" },
        tabBarButton: (props) => {
          return (
            <TouchableOpacity
              style={[
                props.style,
                {
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 10,
                  borderRadius: 20,
                },
              ]}
              onPress={props.onPress}
            >
              {props.children}
            </TouchableOpacity>
          );
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
        },
        tabBarStyle: {
          width: "90%",
          height: 44,
          borderRadius: 20,
          backgroundColor: "white",
          padding: 4,
          top: 4,
          left: 0,
          transform: [{ translateX: "5%" }],
          zIndex: 1,
          elevation: 1,
          display: isFeedbackPage ? "none" : "flex",
        },
        tabBarBackground: () => (
          <BlurView intensity={80} tint="systemChromeMaterial" />
        ),
        tabBarActiveBackgroundColor: "rgba(70, 55, 189, 0.1)",
        tabBarAllowFontScaling: true,
        animation: "shift",
      }}
      initialRouteName="Pending"
    >
      <Tabs.Screen name="Pending" />
      <Tabs.Screen name="Completed" />
      <Tabs.Screen name="Search" />
    </Tabs>
  );
};

export default _layout;
