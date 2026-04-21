import StepRenderer from "@/src/components/feedbackForm/StepRenderer";
import { FORM_CONFIG } from "@/src/constants/feedbackForm";
import { useColors } from "@/src/hooks/useColors";
import { useStore } from "@/src/store/StoreProvider";
import { FeedbackRatings } from "@/src/types/Feedback";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import * as Progress from "react-native-progress";

const FeedbackForm: React.FC = () => {
  const router = useRouter();
  const { CARD, BACKGROUND, TEXT_SECONDARY } = useColors();
  const { feedbackStore } = useStore();
  const {
    currentFeedbackCourse: course,
    setCurrentFeedbackCourse,
    submitFeedback,
  } = feedbackStore;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FeedbackRatings>(
    {} as FeedbackRatings,
  );

  const totalSteps = FORM_CONFIG.length;

  const currentStepConfig = FORM_CONFIG[currentStep - 1];

  const updateFormData = (key: keyof FeedbackRatings, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    // Validate all required fields are filled
    // for (const key of Object.keys(formData)) {
    //   if (
    //     formData[key as keyof FeedbackRatings] === undefined &&
    //     key !== "open_feedback"
    //   ) {
    //     Alert.alert("Incomplete Form", "Please fill all the ratings.");
    //     setIsSubmitting(false);
    //     return;
    //   }
    // }

    await submitFeedback(formData)
      .then(() => {
        Alert.alert(
          "Feedback Submitted!",
          `Thank you for your feedback on ${course?.courseCode}.`,
          [
            {
              text: "OK",
              onPress: () => {
                setCurrentFeedbackCourse(null);
                router.dismiss();
                router.replace("/(protected)/(tabs)/feedback?tabIndex=1");
              },
            },
          ],
        );
      })
      .catch((err) => {
        Alert.alert("Error", "Failed to submit feedback. Please try again.");
      })
      .finally(() => setIsSubmitting(false));
  };

  const getStepTitle = () => currentStepConfig.title;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: BACKGROUND }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={[styles.progressContainer, { backgroundColor: CARD }]}>
        <Progress.Bar
          progress={currentStep / totalSteps}
          width={null}
          height={8}
          style={{ marginBottom: 8 }}
        />

        <Text style={[styles.progressText, { color: TEXT_SECONDARY }]}>
          Step {currentStep} of {totalSteps} • {getStepTitle()}
        </Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <StepRenderer
          step={currentStepConfig}
          data={formData}
          update={updateFormData}
        />
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.btn, { backgroundColor: CARD, opacity: 0.9 }]}
          onPress={handleBack}
        >
          <Text style={[styles.backButtonText, { color: TEXT_SECONDARY }]}>
            {currentStep === 1 ? "Cancel" : "Back"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.btn,
            isSubmitting ? styles.primaryButtonDisabled : styles.primaryButton,
          ]}
          onPress={handleNext}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <Text style={styles.primaryButtonText}>Submitting...</Text>
          ) : (
            <Text style={styles.primaryButtonText}>
              {currentStep === totalSteps ? "Submit Feedback" : "Continue"}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  progressContainer: {
    padding: 20,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 10,
    position: "absolute",
    left: 0,
    bottom: 24,
    width: "100%",
    gap: 24,
  },
  btn: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 2,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#007AFF",
    alignItems: "center",
  },
  primaryButtonDisabled: {
    backgroundColor: "#ccc",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default FeedbackForm;
