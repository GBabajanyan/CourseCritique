import { useColors } from "@/src/hooks/useColors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const HelpScreen = ({ navigation }: any) => {
  const { TEXT, TEXT_SECONDARY, BACKGROUND, SURFACE, BORDER } = useColors();
  const { sectionStyle, sectionTitleStyle, questionStyle, answerStyle } = {
    sectionStyle: [
      styles.section,
      { backgroundColor: SURFACE, borderColor: BORDER },
    ],
    sectionTitleStyle: [styles.sectionTitle, { color: TEXT }],
    questionStyle: [styles.question, { color: TEXT }],
    answerStyle: [styles.answer, { color: TEXT_SECONDARY }],
  };
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
    <SafeAreaView style={[styles.container, { backgroundColor: BACKGROUND }]}>
      <ScrollView>
        <View style={sectionStyle}>
          <Text style={sectionTitleStyle}>Frequently Asked Questions</Text>
          {faqs.map((item, index) => (
            <View key={index} style={styles.faqItem}>
              <Text style={questionStyle}>Q: {item.q}</Text>
              <Text style={answerStyle}>A: {item.a}</Text>
            </View>
          ))}
        </View>

        <View style={sectionStyle}>
          <Text style={sectionTitleStyle}>Contact Support</Text>
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
  container: { flex: 1, paddingHorizontal: 16 },
  section: {
    marginTop: 12,
    padding: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderRadius: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  faqItem: { marginBottom: 16 },
  question: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  answer: { fontSize: 14, lineHeight: 20 },
  contactButton: { flexDirection: "row", alignItems: "center", gap: 8 },
  contactText: { fontSize: 14, color: "#007AFF" },
});

export default HelpScreen;
