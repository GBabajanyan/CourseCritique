import BadgeDetailsModal from "@/src/components/BadgeDetailsModal/BadgeDetailsModal";
import BadgeItem from "@/src/components/BadgeItem/BadgeItem";
import { allBadgesTraversalOrderBySection } from "@/src/constants/badges";
import { useColors } from "@/src/hooks/useColors";
import { useStore } from "@/src/store/StoreProvider";
import { Badge } from "@/src/types/Badge";
import { getBadgesBySection } from "@/src/util/badgeUtils";
import React, { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const AllBadges = () => {
  const { profileStore } = useStore();
  const { userBadges } = profileStore;
  const grouping = getBadgesBySection(userBadges);
  const { SURFACE, NAVY, BACKGROUND } = useColors();
  const [badgeSelected, setBadgeSelected] = useState<Badge | null>(null);
  const [isBadgeDetailsModalOpen, setIsBadgeDetailsModalOpen] = useState(false);

  const openBadgeDetailsModal = (badge: Badge) => {
    setBadgeSelected(badge);
    setIsBadgeDetailsModalOpen(true);
  };

  const closeBadgeDetailsModal = () => {
    setIsBadgeDetailsModalOpen(false);
    setBadgeSelected(null);
  };

  return (
    <ScrollView
      style={{ backgroundColor: BACKGROUND }}
      contentContainerStyle={[styles.badgesGrid]}
    >
      {badgeSelected && (
        <BadgeDetailsModal
          badgeDetails={badgeSelected}
          visible={isBadgeDetailsModalOpen}
          closeModal={closeBadgeDetailsModal}
        />
      )}
      {allBadgesTraversalOrderBySection.map((section, i) => (
        <View
          key={i}
          style={[styles.badgeSection, { backgroundColor: SURFACE }]}
        >
          <Text style={[styles.badgeSectionTitle, { color: NAVY }]}>
            {section}
          </Text>
          <View style={styles.badgeContainer}>
            {grouping[section].map((badge: Badge) => (
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
    minHeight: "100%",
    gap: 24,
    paddingVertical: 24,
  },
  badgeSection: {
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
    fontSize: 20,
    textAlign: "center",
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "capitalize",
  },
  badgeContainer: {
    rowGap: 16,
    display: "flex",
    justifyContent: "space-around",
    flexDirection: "row",
    flexWrap: "wrap",
  },
});
export default AllBadges;
