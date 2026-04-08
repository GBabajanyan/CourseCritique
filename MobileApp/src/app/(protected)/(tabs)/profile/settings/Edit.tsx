import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/store/StoreProvider";
import { useLocalSearchParams } from "expo-router";

const EditProfileScreen = observer(({ navigation }: any) => {
  const { profileStore } = useStore();
  const { section } = useLocalSearchParams();
  const { userProfile } = profileStore;
  const scrollRef = useRef<ScrollView>(null);
  const [targetY, setTargetY] = useState(0);
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const isReasonFilled = formData.reason.trim().length;
  const isSubmitDisabled = loading || !isReasonFilled;

  useEffect(() => {
    if (section === "academic") {
      scrollRef.current?.scrollTo({ y: targetY, animated: true });
    }
  }, [targetY, section]);

  const updateFormData = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Send change request to admin
      // await api.post("/profile/change-requests", {
      //   requestedChanges: formData,
      //   reason: "Profile update request",
      // });
      Alert.alert(
        "Request Sent",
        "Your request has been submitted to the admin for review.",
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to send request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color="#007AFF"
          />
          <Text style={styles.infoText}>
            Profile changes require admin approval. Submit a request and we'll
            review it.
          </Text>
        </View>

        {/* Personal Info */}
        <View
          style={[
            styles.section,
            section === "personal" && styles.sectionHighlight,
          ]}
        >
          <Text style={styles.sectionTitle}>Personal Information</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={(text) => updateFormData("name", text)}
              placeholder="Your full name"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={(text) => updateFormData("email", text)}
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Phone (optional)</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={(text) => updateFormData("phone", text)}
              placeholder="Your phone number"
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Academic Info */}
        <View
          style={[
            styles.section,
            section === "academic" && styles.sectionHighlight,
          ]}
          onLayout={(event) => setTargetY(event.nativeEvent.layout.y)}
        >
          <Text style={styles.sectionTitle}>Academic Information</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Student ID</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={userProfile?.studentId}
              editable={false}
            />
            <Text style={styles.hint}>Student ID cannot be changed</Text>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Degree Program</Text>
            <TextInput
              style={styles.input}
              value={formData.degree}
              onChangeText={(text) => updateFormData("degree", text)}
              placeholder="e.g., BSCS, BS Mathematics"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Year</Text>
            <TextInput
              style={styles.input}
              value={formData.year}
              onChangeText={(text) => updateFormData("year", text)}
              placeholder="Freshman / Sophomore / Junior / Senior"
            />
          </View>
        </View>
        <View style={styles.section}>
          <View style={styles.field}>
            <Text style={styles.label}>
              Reason for Change <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              multiline
              placeholder="REQUIRED: Explain why you want these changes..."
              value={formData.reason}
              onChangeText={(v) => updateFormData("reason", v)}
            />
          </View>
        </View>
        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitDisabled && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={isSubmitDisabled}
        >
          <Text style={styles.submitText}>
            {loading ? "Sending..." : "Submit Change Request"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e3f2fd",
    margin: 16,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#007AFF",
    lineHeight: 18,
  },
  section: {
    backgroundColor: "#fff",
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRadius: 16,
    borderColor: "#e5e5e5",
  },
  sectionHighlight: {
    borderColor: "#007AFF",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    paddingVertical: 12,
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 6,
  },
  required: {
    color: "#dc2626",
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  disabledInput: {
    backgroundColor: "#f5f5f5",
    color: "#999",
  },
  hint: {
    fontSize: 11,
    color: "#999",
    marginTop: 4,
  },
  submitButton: {
    backgroundColor: "#007AFF",
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  footer: {
    height: 40,
  },
});

export default EditProfileScreen;
