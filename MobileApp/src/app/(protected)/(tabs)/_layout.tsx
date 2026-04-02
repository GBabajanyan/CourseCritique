import { usePathname } from "expo-router";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";
const BottomTabsNavigator = () => {
  const activeTab = usePathname();
  const isFeedbackPage = activeTab.includes("Feedback");

  return (
    <NativeTabs hidden={isFeedbackPage}>
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
  );
};

export default BottomTabsNavigator;
