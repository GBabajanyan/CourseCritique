import { useColors } from "@/src/hooks/useColors";
import { Badge } from "@/src/types/Badge";
import React from "react";
import {
  Modal,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Bar } from "react-native-progress";

type Props = {
  visible: boolean;
  closeModal: () => void;
  badgeDetails: Badge;
};

const BadgeDetailsModal = ({ visible, closeModal, badgeDetails }: Props) => {
  const { SAFFRON, TEXT, TEXT_SECONDARY, CARD, NAVY } = useColors();
  const { progress, max_progress } = badgeDetails;
  const progressBar = (progress ?? 0) / max_progress;

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
              <View
                style={[
                  styles.ModalBody,
                  {
                    backgroundColor: CARD,
                    shadowColor: NAVY,
                  },
                ]}
              >
                <View
                  style={[
                    styles.badgeIcon,
                    {
                      backgroundColor: badgeDetails.earned
                        ? SAFFRON
                        : TEXT_SECONDARY,
                      opacity: badgeDetails.earned ? 1 : 0.5,
                    },
                  ]}
                >
                  <Text style={styles.badgeIconText}>{badgeDetails.icon}</Text>
                </View>

                <Text style={[styles.badgeTitle, { color: NAVY }]}>
                  {badgeDetails.name}
                </Text>

                <Text
                  style={[
                    styles.descriptionText,
                    { color: NAVY, borderColor: NAVY },
                  ]}
                >
                  {badgeDetails.description}
                </Text>

                <Text style={[styles.badgeMeta, { color: TEXT }]}>
                  Category: {badgeDetails.section}
                </Text>

                {badgeDetails.rarity && (
                  <Text style={[styles.badgeMeta, { color: TEXT }]}>
                    Rarity: {badgeDetails.rarity}
                  </Text>
                )}

                {badgeDetails.max_progress && (
                  <View style={styles.badgeMeta}>
                    <Bar
                      progress={progressBar}
                      width={200}
                      height={10}
                      color="#007AFF"
                      unfilledColor="#E5E7EB"
                    />
                    <Text style={[styles.badgeMeta, { color: NAVY }]}>
                      {progress} out of {max_progress}
                    </Text>
                  </View>
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
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 32,
    padding: 24,
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
  },
  badgeIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeIconText: {
    fontSize: 28,
  },
  descriptionText: {
    flexWrap: "wrap",
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
