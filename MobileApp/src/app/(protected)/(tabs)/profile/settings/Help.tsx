import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

const HelpScreen = ({ navigation }: any) => {
  const faqs = [
    {
      q: "How do I submit feedback?",
      a: 'Go to Courses tab, find your course, and tap "Give Feedback".',
    },
    {
      q: "Can I edit submitted feedback?",
      a: "No, feedback cannot be edited after submission.",
    },
    {
      q: "How do I enable biometrics?",
      a: "Go to Settings → Security → Enable biometric login.",
    },
    {
      q: "What are badges?",
      a: "Badges are achievements earned for completing feedback.",
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={styles.question}>Q: {item.q}</Text>
              <Text style={styles.answer}>A: {item.a}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Support</Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() =>
              Linking.openURL("mailto:gevorg_babajanyan@edu.aua.am")
            }
          >
            <Ionicons name="mail-outline" size={20} color="#007AFF" />
            <Text style={styles.contactText}>gevorg_babajanyan@edu.aua.am</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  section: {
    backgroundColor: "#fff",
    marginTop: 12,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#e5e5e5",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  faqItem: { marginBottom: 16 },
  question: { fontSize: 14, fontWeight: "600", color: "#333", marginBottom: 4 },
  answer: { fontSize: 14, color: "#666", lineHeight: 20 },
  contactButton: { flexDirection: "row", alignItems: "center", gap: 8 },
  contactText: { fontSize: 14, color: "#007AFF" },
});

export default HelpScreen;
