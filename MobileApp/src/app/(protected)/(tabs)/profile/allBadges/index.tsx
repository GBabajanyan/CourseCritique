import BadgeDetailsModal from "@/src/components/BadgeDetailsModal/BadgeDetailsModal";
import BadgeItem from "@/src/components/BadgeItem/BadgeItem";
import { Colors } from "@/src/constants/colors";
import { Badge } from "@/src/mock/badges";
import { groupBadgesBySection } from "@/src/util/badgeUtils";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { WHITE, NAVY } = Colors;

const AllBadges = () => {
  const grouping = groupBadgesBySection();
  const [badgeSelected, setBadgeSelected] = useState<Badge | null>(null);
  const [isBadgeDetailsModalOpen, setIsBadgeDetailsModalOpen] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const bottomPadding = bottom + 20;
  
  const openBadgeDetailsModal = (badge: Badge) => {
    setBadgeSelected(badge);
    setIsBadgeDetailsModalOpen(true);
  };

  const closeBadgeDetailsModal = () => {
    setIsBadgeDetailsModalOpen(false);
    setBadgeSelected(null);
  };

  return (
    <ScrollView contentContainerStyle={[styles.badgesGrid, { paddingBottom: bottomPadding }]}>
      <BadgeDetailsModal
        badgeDetails={badgeSelected}
        visible={isBadgeDetailsModalOpen}
        closeModal={closeBadgeDetailsModal}
      />
      {Object.keys(grouping).map((group, i) => (
        <View key={i} style={styles.badgeSection}>
          <Text style={styles.badgeSectionTitle}>{group}</Text>
          <View style={styles.badgeContainer}>
            {grouping[group].map((badge: Badge) => (
              <BadgeItem
                key={badge.id}
                badge={badge}
                openDetailsModal={() => openBadgeDetailsModal(badge)}
              />
            ))}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  badgesGrid: {
    marginVertical: 24,
    minHeight: "100%",
    gap: 24,
  },
  badgeSection: {
    backgroundColor: WHITE,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  badgeSectionTitle: {
    wordWrap: "wrap",
    width: "100%",
    color: NAVY,
    fontSize: 20,
    textAlign: "center",
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "capitalize",
  },
  badgeContainer: {
    rowGap: 16,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
export default AllBadges;
