import { useColors } from "@/src/hooks/useColors";
import { useStore } from "@/src/store/StoreProvider";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react-lite";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfileScreen = observer(({ navigation }: any) => {
  const { profileStore } = useStore();
  const { section } = useLocalSearchParams();
  const {
    NAVY,
    WHITE,
    CARD,
    TEXT,
    TEXT_SECONDARY,
    BACKGROUND,
    SURFACE,
    BORDER,
  } = useColors();
  const { userProfile } = profileStore;
  const scrollRef = useRef<ScrollView>(null);
  const [targetY, setTargetY] = useState(0);
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    email: userProfile?.email || "",
    phone: userProfile?.phone || "",
    degree: "",
    year: "",
    reason: "",
  });
  const [loading, setLoading] = useState(false);
  const isReasonFilled =
    formData.reason.trim().length &&
    Object.entries(formData).some(
      ([key, val]) => key !== "reason" && val.trim(),
    );
  const isSubmitDisabled = loading || !isReasonFilled;
  const {
    sectionStyle,
    highlightSectionStyle,
    labelStyle,
    inputStyle,
    disabledInput,
  } = {
    sectionStyle: [
      styles.section,
      { backgroundColor: SURFACE, borderColor: BORDER },
    ],
    highlightSectionStyle: [
      { borderColor: NAVY, shadowColor: NAVY },
      styles.sectionHighlight,
    ],
    labelStyle: [styles.label, { color: TEXT }],
    inputStyle: [
      styles.input,
      { backgroundColor: WHITE, borderColor: BORDER, color: TEXT },
    ],
    disabledInput: {
      backgroundColor: TEXT_SECONDARY,
      color: WHITE,
    },
  };
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
    <SafeAreaView style={[styles.container, { backgroundColor: BACKGROUND }]}>
      <ScrollView showsVerticalScrollIndicator={false} ref={scrollRef}>
        <View style={[styles.infoCard, { backgroundColor: CARD }]}>
          <Ionicons name="information-circle-outline" size={24} color={NAVY} />
          <Text style={[styles.infoText, { color: NAVY }]}>
            Profile changes require admin approval. Submit a request and we'll
            review it.
          </Text>
        </View>

        {/* Personal Info */}
        <View
          style={[
            sectionStyle,
            section === "personal" && highlightSectionStyle,
          ]}
        >
          <Text style={[styles.sectionTitle, { color: TEXT_SECONDARY }]}>
            Personal Information
          </Text>

          <View style={styles.field}>
            <Text style={labelStyle}>Full Name</Text>
            <TextInput
              placeholderTextColor={TEXT_SECONDARY}
              style={inputStyle}
              value={formData.name}
              onChangeText={(text) => updateFormData("name", text)}
              placeholder="Your full name"
            />
          </View>

          <View style={styles.field}>
            <Text style={labelStyle}>Email</Text>
            <TextInput
              placeholderTextColor={TEXT_SECONDARY}
              style={inputStyle}
              value={formData.email}
              onChangeText={(text) => updateFormData("email", text)}
              placeholder="Your email"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={labelStyle}>Phone (optional)</Text>
            <TextInput
              placeholderTextColor={TEXT_SECONDARY}
              style={inputStyle}
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
            sectionStyle,
            section === "academic" && highlightSectionStyle,
          ]}
          onLayout={(event) => setTargetY(event.nativeEvent.layout.y)}
        >
          <Text style={[styles.sectionTitle, { color: TEXT_SECONDARY }]}>
            Academic Information
          </Text>

          <View style={styles.field}>
            <Text style={labelStyle}>Student ID</Text>
            <TextInput
              placeholderTextColor={TEXT_SECONDARY}
              style={[inputStyle, disabledInput]}
              value={userProfile?.studentId}
              editable={false}
            />
            <Text style={[styles.hint, { color: TEXT_SECONDARY }]}>
              Student ID cannot be changed
            </Text>
          </View>

          <View style={styles.field}>
            <Text style={labelStyle}>Degree Program</Text>
            <TextInput
              placeholderTextColor={TEXT_SECONDARY}
              style={inputStyle}
              value={formData.degree}
              onChangeText={(text) => updateFormData("degree", text)}
              placeholder="e.g., BSCS, BS Mathematics"
            />
          </View>

          <View style={styles.field}>
            <Text style={labelStyle}>Year</Text>
            <TextInput
              placeholderTextColor={TEXT_SECONDARY}
              style={inputStyle}
              value={formData.year}
              onChangeText={(text) => updateFormData("year", text)}
              placeholder="Freshman / Sophomore / Junior / Senior"
            />
          </View>
        </View>

        <View style={sectionStyle}>
          <View style={styles.field}>
            <Text style={labelStyle}>
              Reason for Change <Text style={styles.required}>*</Text>
            </Text>
            <TextInput
              placeholderTextColor={TEXT_SECONDARY}
              style={[inputStyle, { height: 100 }]}
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
            { backgroundColor: NAVY },
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
    paddingHorizontal: 16,
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    marginTop: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderRadius: 16,
  },
  sectionHighlight: {
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 5,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
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
    marginBottom: 6,
  },
  required: {
    color: "#dc2626",
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  hint: {
    fontSize: 11,
    marginTop: 4,
  },
  submitButton: {
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
