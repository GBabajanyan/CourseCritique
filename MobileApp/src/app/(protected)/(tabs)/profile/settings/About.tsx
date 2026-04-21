import { useColors } from "@/src/hooks/useColors";
import { useStore } from "@/src/store/StoreProvider";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AboutScreen = ({ navigation }: any) => {
  const { bottom } = useSafeAreaInsets();
  const { NAVY, TEXT, TEXT_SECONDARY, BACKGROUND } = useColors();
  const { settingsStore } = useStore();
  const { theme } = settingsStore;
  const bulletStyle = [styles.bullet, { color: TEXT_SECONDARY }];
  const logoLight = require("../../../../../../assets/images/teddy.png");
  const logoDark = require("../../../../../../assets/images/teddy_dark.png");
  const logo = theme === "dark" ? logoDark : logoLight;

  return (
    <ScrollView
      style={{ backgroundColor: BACKGROUND }}
      contentContainerStyle={[styles.content, { paddingBottom: bottom }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.logoContainer}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={[styles.appName, { color: TEXT }]}>Course Feedback</Text>
        <Text style={[styles.version, { color: TEXT_SECONDARY }]}>
          Version 1.0.0
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.description, { color: TEXT }]}>
          Student course evaluations are carefully considered by AUA
          administration and faculty to assess and improve learning and enhance
          teaching. We seek your objective evaluation and constructive comments
          for this purpose. The contents of evaluation forms are released to the
          instructor, in an anonymous form, after course grades have been
          submitted.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.description, { color: TEXT }]}>
          Course Critique allows students to submit anonymous evaluations of
          courses they attend and track their feedback history.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: TEXT }]}>Features</Text>
        <Text style={bulletStyle}>• Submit course feedback anonymously</Text>
        <Text style={bulletStyle}>• Track pending feedback deadlines</Text>
        <Text style={bulletStyle}>• Earn achievement badges</Text>
        <Text style={bulletStyle}>• Biometric login support</Text>
      </View>

      <TouchableOpacity
        style={styles.link}
        onPress={() => Linking.openURL("https://example.com/terms")}
      >
        <Text style={[styles.linkText, { color: NAVY }]}>Terms of Service</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.link}
        onPress={() => Linking.openURL("https://example.com/privacy")}
      >
        <Text style={[styles.linkText, { color: NAVY }]}>Privacy Policy</Text>
      </TouchableOpacity>
      <View>
        <Text style={styles.copyright}>
          © 2024 Course Feedback. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  logoContainer: { alignItems: "center", marginBottom: 20 },
  logo: {
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  appName: { fontSize: 24, fontWeight: "bold", marginBottom: 4 },
  version: { fontSize: 14, color: "#999" },
  section: { width: "100%", marginBottom: 20 },
  description: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  bullet: { fontSize: 14, marginBottom: 6 },
  link: { marginBottom: 12 },
  linkText: { fontSize: 14 },
  copyright: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
  },
});

export default AboutScreen;
