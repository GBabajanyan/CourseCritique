import StepRenderer from "@/src/components/feedbackForm/StepRenderer";
import { FORM_CONFIG } from "@/src/constants/feedbackForm";
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
                router.replace("/(protected)/(tabs)/feedback/Completed");
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
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.progressContainer}>
        <Progress.Bar
          progress={currentStep / totalSteps}
          width={null}
          height={8}
          style={{ marginBottom: 8 }}
        />

        <Text style={styles.progressText}>
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
        <TouchableOpacity style={styles.btn} onPress={handleBack}>
          <Text style={styles.secondaryButtonText}>
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
    backgroundColor: "#f8f9fa",
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
  courseCode: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  courseName: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  stepDescription: {
    fontSize: 16,
    color: "#666",
    marginBottom: 30,
    lineHeight: 22,
  },
  ratingSection: {
    alignItems: "center",
    marginBottom: 30,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  starButton: {
    padding: 5,
  },
  star: {
    fontSize: 32,
  },
  ratingText: {
    fontSize: 16,
    color: "#666",
    fontStyle: "italic",
  },
  quickRatings: {
    marginTop: 20,
  },
  quickRatingsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
  },
  quickRatingItem: {
    marginBottom: 20,
  },
  quickRatingLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  textInputSection: {
    marginTop: 10,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
    marginTop: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f8f9fa",
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  recommendationSection: {
    marginVertical: 20,
  },
  recommendButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    marginBottom: 12,
  },
  recommendButtonSelected: {
    borderColor: "#007AFF",
    backgroundColor: "#f0f8ff",
  },
  recommendIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  recommendText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  summarySection: {
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  reviewCard: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
  },
  reviewCourse: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  reviewSection: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  reviewInstructor: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  reviewPhase: {
    fontSize: 12,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 12,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 12,
  },
  reviewItem: {
    marginBottom: 12,
  },
  reviewLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  reviewValue: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  submitNote: {
    backgroundColor: "#e8f5e8",
    padding: 16,
    borderRadius: 8,
    marginTop: 20,
  },
  submitNoteText: {
    fontSize: 14,
    color: "#2e7d32",
    textAlign: "center",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 10,
    position: "absolute",
    left: 0,
    bottom: 24,
    // backgroundColor: "red",
    width: "100%",
    gap: 24,
  },
  btn: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    // borderWidth: 1,
    // borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  secondaryButton: {
    // flex: 1,
    // padding: 16,
    // borderRadius: 8,
    // borderWidth: 1,
    // borderColor: "#e0e0e0",
    // backgroundColor: "#fff",
    // marginRight: 10,
    // alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4d4c4c",
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
