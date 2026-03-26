import { useStore } from "@/src/store/StoreProvider";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type FeedbackFormScreenProps = {
  course: string;
  id: string;
  courseCode: string;
  courseName: string;
  section: string;
  instructor: string;
  feedbackPhase: string;
};

interface FormData {
  rating: number;
  understanding: number;
  engagement: number;
  organization: number;
  comments: string;
  strengths: string;
  improvements: string;
  wouldRecommend: boolean | null;
}

const FeedbackForm: React.FC = () => {
  const router = useRouter();
  // const course = useLocalSearchParams<FeedbackFormScreenProps>();
  const insets = useSafeAreaInsets();
  const { feedbackStore } = useStore();
  const { selectedCourse: course } = feedbackStore;
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(1);
  const totalSteps = 4;

  const [formData, setFormData] = useState<FormData>({
    rating: 0,
    understanding: 0,
    engagement: 0,
    organization: 0,
    comments: "",
    strengths: "",
    improvements: "",
    wouldRecommend: null,
  });

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleStarRating = (
    field: "rating" | "understanding" | "engagement" | "organization",
    value: number,
  ) => {
    updateFormData(field, value);
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

    // Validate required fields
    if (formData.rating === 0 || formData.wouldRecommend === null) {
      Alert.alert(
        "Incomplete Form",
        "Please provide an overall rating and recommendation.",
      );
      setIsSubmitting(false);
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      Alert.alert(
        "Feedback Submitted!",
        `Thank you for your feedback on ${course.courseCode}.`,
        [
          {
            text: "OK",
            onPress: () =>
              router.navigate("/(protected)/(tabs)/feedback/Completed"),
          },
        ],
      );
    } catch (error) {
      Alert.alert("Error", "Failed to submit feedback. Please try again.");
      console.log(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (
    field: "rating" | "understanding" | "engagement" | "organization",
    value: number,
  ) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => handleStarRating(field, star)}
            style={styles.starButton}
          >
            <Text style={styles.star}>{star <= value ? "⭐" : "☆"}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderStep1 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Overall Experience</Text>
      <Text style={styles.stepDescription}>
        How would you rate your overall experience with this course?
      </Text>

      <View style={styles.ratingSection}>
        {renderStars("rating", formData.rating)}
        <Text style={styles.ratingText}>
          {formData.rating === 0
            ? "Select rating"
            : `${formData.rating}/5 stars`}
        </Text>
      </View>

      <View style={styles.quickRatings}>
        <Text style={styles.quickRatingsTitle}>Rate Specific Areas:</Text>

        <View style={styles.quickRatingItem}>
          <Text style={styles.quickRatingLabel}>Content Understanding</Text>
          {renderStars("understanding", formData.understanding)}
        </View>

        <View style={styles.quickRatingItem}>
          <Text style={styles.quickRatingLabel}>Class Engagement</Text>
          {renderStars("engagement", formData.engagement)}
        </View>

        <View style={styles.quickRatingItem}>
          <Text style={styles.quickRatingLabel}>Course Organization</Text>
          {renderStars("organization", formData.organization)}
        </View>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Detailed Feedback</Text>
      <Text style={styles.stepDescription}>
        Please share your thoughts in more detail
      </Text>

      <View style={styles.textInputSection}>
        <Text style={styles.inputLabel}>
          What did you enjoy most about this course?
        </Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Share what worked well..."
          placeholderTextColor="#999"
          value={formData.strengths}
          onChangeText={(text) => updateFormData("strengths", text)}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.inputLabel}>Any suggestions for improvement?</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="What could be better..."
          placeholderTextColor="#999"
          value={formData.improvements}
          onChangeText={(text) => updateFormData("improvements", text)}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.inputLabel}>Additional comments</Text>
        <TextInput
          style={[styles.textInput, styles.textArea]}
          placeholder="Any other feedback..."
          placeholderTextColor="#999"
          value={formData.comments}
          onChangeText={(text) => updateFormData("comments", text)}
          multiline
          numberOfLines={3}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Final Thoughts</Text>
      <Text style={styles.stepDescription}>
        Would you recommend this course to other students?
      </Text>

      <View style={styles.recommendationSection}>
        <TouchableOpacity
          style={[
            styles.recommendButton,
            formData.wouldRecommend === true && styles.recommendButtonSelected,
          ]}
          onPress={() => updateFormData("wouldRecommend", true)}
        >
          <Text style={styles.recommendIcon}>👍</Text>
          <Text style={styles.recommendText}>Yes, I would recommend</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.recommendButton,
            formData.wouldRecommend === false && styles.recommendButtonSelected,
          ]}
          onPress={() => updateFormData("wouldRecommend", false)}
        >
          <Text style={styles.recommendIcon}>👎</Text>
          <Text style={styles.recommendText}>
            No, I wouldn&apos;t recommend
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.summarySection}>
        <Text style={styles.summaryTitle}>Feedback Summary</Text>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Overall Rating:</Text>
          <Text style={styles.summaryValue}>
            {formData.rating > 0 ? `${formData.rating}/5` : "Not rated"}
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryLabel}>Recommendation:</Text>
          <Text style={styles.summaryValue}>
            {formData.wouldRecommend === true
              ? "Yes"
              : formData.wouldRecommend === false
                ? "No"
                : "Not answered"}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderStep4 = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Review & Submit</Text>
      <Text style={styles.stepDescription}>
        Please review your feedback before submitting
      </Text>

      <View style={styles.reviewCard}>
        <Text style={styles.reviewCourse}>
          {course.courseCode}: {course.courseName}
        </Text>
        <Text style={styles.reviewSection}>Section {course.section}</Text>
        <Text style={styles.reviewInstructor}>
          Instructor: {course.instructor}
        </Text>
        <Text style={styles.reviewPhase}>{course.feedbackPhase} Feedback</Text>

        <View style={styles.reviewDivider} />

        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Overall Rating:</Text>
          <Text style={styles.reviewValue}>{formData.rating}/5</Text>
        </View>

        {formData.strengths ? (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Strengths:</Text>
            <Text style={styles.reviewValue}>{formData.strengths}</Text>
          </View>
        ) : null}

        {formData.improvements ? (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewLabel}>Improvements:</Text>
            <Text style={styles.reviewValue}>{formData.improvements}</Text>
          </View>
        ) : null}

        <View style={styles.reviewItem}>
          <Text style={styles.reviewLabel}>Recommend:</Text>
          <Text style={styles.reviewValue}>
            {formData.wouldRecommend === true ? "Yes" : "No"}
          </Text>
        </View>
      </View>

      <View style={styles.submitNote}>
        <Text style={styles.submitNoteText}>
          Your feedback will be anonymized and used to improve the course for
          future students.
        </Text>
      </View>
    </View>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  const getStepTitle = () => {
    const titles = {
      1: "Rate Your Experience",
      2: "Share Your Thoughts",
      3: "Final Thoughts",
      4: "Review & Submit",
    };
    return titles[currentStep as keyof typeof titles];
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${(currentStep / totalSteps) * 100}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep} of {totalSteps} • {getStepTitle()}
        </Text>
      </View>

      {/* Form Content */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {renderCurrentStep()}
      </ScrollView>

      {/* Navigation Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.secondaryButton} onPress={handleBack}>
          <Text style={styles.secondaryButtonText}>
            {currentStep === 1 ? "Cancel" : "Back"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (isSubmitting || (currentStep === 1 && formData.rating === 0)) &&
              styles.primaryButtonDisabled,
          ]}
          onPress={handleNext}
          disabled={
            isSubmitting || (currentStep === 1 && formData.rating === 0)
          }
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: "#007AFF",
    fontWeight: "bold",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
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
  headerRight: {
    width: 30,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  scrollView: {
    flex: 1,
  },
  stepContainer: {
    padding: 20,
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
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  secondaryButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginRight: 10,
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
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
