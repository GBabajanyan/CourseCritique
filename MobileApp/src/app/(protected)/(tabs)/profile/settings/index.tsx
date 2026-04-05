import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, Alert, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/store/StoreProvider";
import { useRouter } from "expo-router";
import SettingItem from "@/src/components/SettingItem/SettingItem";

const SettingsScreen = observer(() => {
  const router = useRouter();
  const { SettingStore, authStore } = useStore();
  const { isBiometricAvailable, biometricType } = authStore;
  const {
    biometricsEnabled: isBiometricsEnabled,
    pushNotifications,
    darkMode,
    emailReminders,
    toggleBiometrics,
    setDarkMode,
    setPushNotifications,
    setEmailReminders,
  } = SettingStore;

  const handleEditProfilePress = (section: "personal" | "academic") => {
    router.navigate({
      pathname: "/(protected)/(tabs)/profile/settings/Edit",
      params: { section },
    });
  };

  const toggleBiometricsSwitch = async (value: boolean) => {
    try {
      const success = await toggleBiometrics();
      setBiometricsEnabled(success);
    } catch (error) {
      Alert.alert("Error", "Failed to enable biometrics");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile</Text>
          <SettingItem
            icon="person-outline"
            title="Personal Information"
            subtitle="Name, email, student ID"
            onPress={() => handleEditProfilePress("personal")}
          />
          <SettingItem
            icon="school-outline"
            title="Academic Info"
            subtitle="Degree, year, department"
            onPress={() => handleEditProfilePress("academic")}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem
            icon="notifications-outline"
            title="Push Notifications"
            type="toggle"
            value={pushNotifications}
            onValueChange={setPushNotifications}
          />
          <SettingItem
            icon="moon-outline"
            title="Dark Mode"
            type="toggle"
            value={darkMode}
            onValueChange={setDarkMode}
          />
          <SettingItem
            icon="mail-outline"
            title="Email Reminders"
            subtitle="Feedback deadlines and updates"
            type="toggle"
            value={emailReminders}
            onValueChange={setEmailReminders}
          />
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          {isBiometricAvailable && (
            <SettingItem
              icon={
                biometricType === "Face ID"
                  ? "scan-outline"
                  : "finger-print-outline"
              }
              title={`Login with ${biometricType || "Biometrics"}`}
              subtitle="Use fingerprint or face recognition"
              type="toggle"
              value={isBiometricsEnabled}
              onValueChange={toggleBiometricsSwitch}
            />
          )}
          <SettingItem
            icon="lock-closed-outline"
            title="Change Password"
            // onPress={() => router.navigate("/profile/change-password")}
          />
        </View>

        {/* Support Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <SettingItem
            icon="help-circle-outline"
            title="Help Center"
            onPress={() =>
              router.navigate("/(protected)/(tabs)/profile/settings/Help")
            }
          />
          <SettingItem
            icon="document-text-outline"
            title="Terms & Conditions"
            onPress={() => Linking.openURL("https://example.com/terms")}
          />
          <SettingItem
            icon="shield-checkmark-outline"
            title="Privacy Policy"
            onPress={() => Linking.openURL("https://example.com/privacy")}
          />
          <SettingItem
            icon="information-circle-outline"
            title="About"
            onPress={() =>
              router.navigate("/(protected)/(tabs)/profile/settings/About")
            }
          />
          <SettingItem
            icon="code-slash-outline"
            title="Version"
            type="version"
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Course Feedback App © 2026</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e5e5",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dangerTitle: {
    color: "#dc2626",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
    color: "#999",
  },
});

export default SettingsScreen;
