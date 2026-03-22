import { Colors } from "@/src/constants/colors";
import { Badge } from "@/src/mock/badges";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
const { SAFFRON, WHITE, NAVY } = Colors;

type Props = {
  visible: boolean;
  closeModal: () => void;
  badgeDetails: Badge | null;
};

const BadgeDetailsModal = ({ visible, closeModal, badgeDetails }: Props) => {
  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      onRequestClose={closeModal}
    >
      <TouchableWithoutFeedback onPress={closeModal}>
        <View style={styles.ModalCanvas}>
          <TouchableWithoutFeedback onPress={() => {}}>
            {badgeDetails ? (
              <View style={styles.ModalBody}>
                <View style={styles.badgeIcon}>
                  <Text style={styles.badgeIconText}>{badgeDetails.icon}</Text>
                </View>

                <Text style={styles.badgeTitle}>{badgeDetails.name}</Text>

                <Text style={styles.descriptionText}>
                  {badgeDetails.description}
                </Text>

                <Text style={styles.badgeMeta}>
                  Category: {badgeDetails.section}
                </Text>

                {badgeDetails.rarity && (
                  <Text style={styles.badgeMeta}>
                    Rarity: {badgeDetails.rarity}
                  </Text>
                )}

                {badgeDetails.maxProgress && (
                  <Text style={styles.badgeMeta}>
                    MaxProgress: {badgeDetails.maxProgress}
                  </Text>
                )}
              </View>
            ) : (
              <Text>No Details</Text>
            )}
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default BadgeDetailsModal;

const styles = StyleSheet.create({
  ModalCanvas: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  ModalBody: {
    width: "85%",
    height: "50%",
    backgroundColor: WHITE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    padding: 24,
    shadowColor: NAVY,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 5,
    gap: 8,
  },
  badgeTitle: {
    fontSize: 24,
    fontWeight: 700,
    textAlign: "center",
    color: NAVY,
  },
  badgeIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: SAFFRON,
  },
  badgeIconText: {
    fontSize: 28,
  },
  descriptionText: {
    flexWrap: "wrap",
    color: NAVY,
    borderColor: NAVY,
    borderBottomWidth: 1,
    paddingBottom: 8,
    textAlign: "center",
  },
  badgeMeta: {
    textAlign: "center",
    textTransform: "capitalize",
    marginTop: 12,
    fontWeight: 500,
    fontSize: 16,
  },
});
