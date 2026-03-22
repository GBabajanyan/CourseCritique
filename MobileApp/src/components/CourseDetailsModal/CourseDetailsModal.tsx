import { Course } from "@/src/types/Course";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";

type Props = {
  visible: boolean;
  closeModal: () => void;
  courseDetails: Course | null;
};

const CourseDetailsModal = ({ visible, closeModal, courseDetails }: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.ModalCanvas}>
          {/* White modal body */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.ModalBody}>
              {!!courseDetails &&
                Object.keys(courseDetails)
                  .slice(1)
                  .map((k, i) => (
                    <Text key={i} style={{ fontSize: 18, color: "#000" }}>
                      {k}: {courseDetails[k]}
                    </Text>
                  ))}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default CourseDetailsModal;

const styles = StyleSheet.create({
  ModalCanvas: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  ModalBody: {
    width: "90%",
    height: "70%",
    backgroundColor: "#fff",
    borderRadius: 32,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});
