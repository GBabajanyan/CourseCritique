import { NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";
const BottomTabsNavigator = () => {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(home)">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="feedback">
        <NativeTabs.Trigger.Label>Feedback</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="pencil.and.list.clipboard" md="feedback" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <NativeTabs.Trigger.Label>Profile</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="person" md="person" />
      </NativeTabs.Trigger>
    </NativeTabs>
    // <Tabs
    //   screenOptions={{
    //     // headerShown: false,
    //     tabBarActiveTintColor: "#007AFF",
    //     tabBarInactiveTintColor: "grey",
    //     tabBarStyle: {
    //       backgroundColor: "white",
    //       borderTopWidth: 1,
    //       borderTopColor: "#e0e0e0",
    //     },
    //     popToTopOnBlur: true,
    //   }}
    // >
    //   <Tabs.Screen
    //     name="(home)"
    //     options={{
    //       header: () => <CustomHeader title="Calendar" />,
    //       title: "Calendar",
    //       tabBarIcon: () => <Entypo name="home" size={24} color="black" />,
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="feedback"
    //     options={{
    //       header: () => (
    //         <CustomHeader
    //           title="Course Feedback"
    //           subtitle={`${currentSemester} Semester ${currentYear}`}
    //         />
    //       ),
    //       title: "Feedback",
    //       tabBarIcon: () => (
    //         <FontAwesome name="pencil-square-o" size={24} color="black" />
    //       ),
    //     }}
    //   />
    //   <Tabs.Screen
    //     name="profile"
    //     options={{
    //       header: () => <CustomHeader title="My Profile" />,
    //       title: "My Profile",
    //       tabBarIcon: () => (
    //         <MaterialIcons name="person" size={24} color="black" />
    //       ),
    //     }}
    //   />
    // </Tabs>
  );
};

export default BottomTabsNavigator;
