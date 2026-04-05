import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const AboutScreen = ({ navigation }: any) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require("@/assets/images/teddy.png")}
              style={styles.logo}
            />
          </View>
          <Text style={styles.appName}>Course Feedback</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.description}>
            Course Feedback App allows students to submit anonymous evaluations
            of courses they attend and track their feedback history.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Features</Text>
          <Text style={styles.bullet}>
            • Submit course feedback anonymously
          </Text>
          <Text style={styles.bullet}>• Track pending feedback deadlines</Text>
          <Text style={styles.bullet}>• Earn achievement badges</Text>
          <Text style={styles.bullet}>• Biometric login support</Text>
        </View>

        <TouchableOpacity
          style={styles.link}
          onPress={() => Linking.openURL("https://example.com/terms")}
        >
          <Text style={styles.linkText}>Terms of Service</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() => Linking.openURL("https://example.com/privacy")}
        >
          <Text style={styles.linkText}>Privacy Policy</Text>
        </TouchableOpacity>

        <Text style={styles.copyright}>
          © 2024 Course Feedback. All rights reserved.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  logoContainer: { alignItems: "center", marginBottom: 32 },
  logo: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: { fontSize: 24, fontWeight: "bold", color: "#333", marginBottom: 4 },
  version: { fontSize: 14, color: "#999" },
  section: { width: "100%", marginBottom: 24 },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  bullet: { fontSize: 14, color: "#666", marginBottom: 6 },
  link: { marginBottom: 12 },
  linkText: { fontSize: 14, color: "#007AFF" },
  copyright: {
    fontSize: 12,
    color: "#999",
    marginTop: 32,
    textAlign: "center",
  },
});

export default AboutScreen;
