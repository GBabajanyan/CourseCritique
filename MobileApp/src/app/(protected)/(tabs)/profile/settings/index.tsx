import SettingItem from "@/src/components/SettingItem/SettingItem";
import { useColors } from "@/src/hooks/useColors";
import { useStore } from "@/src/store/StoreProvider";
import { useRouter } from "expo-router";
import { observer } from "mobx-react-lite";
import React from "react";
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const SettingsScreen = observer(() => {
  const router = useRouter();
  const { BACKGROUND, TEXT_SECONDARY, CARD, BORDER } = useColors();
  const { settingsStore, authStore } = useStore();
  const { isBiometricAvailable, biometricType } = authStore;
  const {
    biometricsEnabled: isBiometricsEnabled,
    inAppNotifications,
    theme,
    emailReminders,
    toggleBiometrics,
    setSettingsTheme,
    setinAppNotifications,
    setEmailReminders,
  } = settingsStore;

  const sectionStyle = [
    styles.section,
    { backgroundColor: CARD, borderColor: BORDER },
  ];
  const sectionTitleStyle = [styles.sectionTitle, { color: TEXT_SECONDARY }];

  const handleEditProfilePress = (section: "personal" | "academic") => {
    router.navigate({
      pathname: "/(protected)/(tabs)/profile/settings/Edit",
      params: { section },
    });
  };

  const toggleBiometricsSwitch = async (value: boolean) => {
    try {
      await toggleBiometrics();
    } catch (error) {
      Alert.alert("Error", "Failed to enable biometrics");
    }
  };

  return (
    <ScrollView
      style={{ backgroundColor: BACKGROUND }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      {/* Profile Section */}
      <View style={sectionStyle}>
        <Text style={sectionTitleStyle}>Profile</Text>
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
      <View style={sectionStyle}>
        <Text style={sectionTitleStyle}>Preferences</Text>
        <SettingItem
          icon="notifications-outline"
          title="In-App Notifications"
          type="toggle"
          value={inAppNotifications}
          onValueChange={setinAppNotifications}
        />
        <SettingItem
          icon="moon-outline"
          title="Dark Mode"
          type="toggle"
          value={theme === "dark"}
          onValueChange={(v) => setSettingsTheme(v ? "dark" : "light")}
        />
        <SettingItem
          icon="mail-outline"
          title="Email Reminders"
          disabled
          subtitle="Feedback deadlines and updates"
          type="toggle"
          value={emailReminders}
          onValueChange={setEmailReminders}
        />
      </View>

      {/* Security Section */}
      <View style={sectionStyle}>
        <Text style={sectionTitleStyle}>Security</Text>
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
      <View style={sectionStyle}>
        <Text style={sectionTitleStyle}>Support</Text>
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
          // onPress={() => Linking.openURL("https://example.com/terms")}
        />
        <SettingItem
          icon="shield-checkmark-outline"
          title="Privacy Policy"
          // onPress={() => Linking.openURL("https://example.com/privacy")}
        />
        <SettingItem
          icon="information-circle-outline"
          title="About"
          onPress={() =>
            router.navigate("/(protected)/(tabs)/profile/settings/About")
          }
        />
        <SettingItem icon="code-slash-outline" title="Version" type="version" />
      </View>

      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: TEXT_SECONDARY }]}>
          Course Feedback App © 2026
        </Text>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  section: {
    marginTop: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
  },
});

export default SettingsScreen;
