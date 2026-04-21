import BadgeDetailsModal from "@/src/components/BadgeDetailsModal/BadgeDetailsModal";
import BadgeItem from "@/src/components/BadgeItem/BadgeItem";
import InfoRow from "@/src/components/InfoRow/InfoRow";
import { useColors } from "@/src/hooks/useColors";
import { userData } from "@/src/mock";
import { Badge, BADGES } from "@/src/mock/badges";
import { useStore } from "@/src/store/StoreProvider";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const {
    BACKGROUND,
    NAVY,
    SAFFRON,
    TEXT,
    TEXT_SECONDARY,
    SURFACE,
    CARD,
  } = useColors();
  const { authStore, profileStore, feedbackStore } = useStore();
  const { logout } = authStore;
  const { userProfile, getProfileData } = profileStore;
  const { name, email, avatar, role, year, degree, studentId } = userProfile;
  const { completedFeedbacksCount, pendingCount } = feedbackStore;
  const [badgeSelected, setBadgeSelected] = useState<Badge | null>(null);
  const [isBadgeDetailsModalOpen, setIsBadgeDetailsModalOpen] = useState(false);
  const { bottom } = useSafeAreaInsets();
  const bottomPadding = bottom + 20;
  const statLabelStyle = [styles.statLabel, { color: TEXT }];
  const statNumberStyle = [styles.statNumber, { color: NAVY }];
  const actionButtonStyle = [styles.actionButton, { backgroundColor: CARD }];
  const actionButtonTextStyle = [styles.actionButtonText, { color: TEXT }];
  useFocusEffect(
    React.useCallback(() => {
      getProfileData();
    }, []),
  );

  const openBadgeDetailsModal = (badge: Badge) => {
    setBadgeSelected(badge);
    setIsBadgeDetailsModalOpen(true);
  };

  const closeBadgeDetailsModal = () => {
    setIsBadgeDetailsModalOpen(false);
    setBadgeSelected(null);
  };

  const earnedBadges = BADGES.filter((badge, i) => i < 3);
  const lockedBadges = BADGES.filter((badge, i) => i >= 3 && i < 6);

  const handleBadgesPress = () => {
    router.navigate("/(protected)/(tabs)/profile/allBadges");
  };

  const handleSettingsPress = () => {
    router.navigate("/(protected)/(tabs)/profile/settings");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await logout();
        },
      },
    ]);
  };

  const getYearColor = (year: string) => {
    const colors: { [key: string]: string } = {
      Freshman: "#4CAF50",
      Sophomore: "#2196F3",
      Junior: "#FF9800",
      Senior: "#F44336",
    };
    return colors[year] || "#666";
  };

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: BACKGROUND }]}
      contentContainerStyle={{
        gap: 32,
        paddingBottom: bottomPadding,
      }}
      showsVerticalScrollIndicator={false}
    >
      <BadgeDetailsModal
        badgeDetails={badgeSelected}
        visible={isBadgeDetailsModalOpen}
        closeModal={closeBadgeDetailsModal}
      />
      {/* Profile Card */}
      <View
        style={[
          styles.profileCard,
          {
            backgroundColor: SURFACE,
            shadowColor: NAVY,
          },
        ]}
      >
        {/* Avatar and Basic Info */}
        <View style={styles.avatarSection}>
          {avatar ? (
            <Image
              src={avatar}
              style={[styles.avatarContainer, { backgroundColor: SAFFRON }]}
            />
          ) : (
            <View
              style={[styles.avatarContainer, { backgroundColor: SAFFRON }]}
            >
              <Text style={styles.avatarInitials}>
                {name
                  .split(" ")
                  .map((w: string) => w[0])
                  .join("")}
              </Text>
            </View>
          )}
          <View style={styles.basicInfo}>
            <Text style={[styles.name, { color: TEXT }]}>{name}</Text>
            <Text style={[styles.role, { color: TEXT_SECONDARY }]}>{role}</Text>
            <View
              style={[
                styles.yearBadge,
                { backgroundColor: getYearColor(userData.year) },
              ]}
            >
              <Text style={styles.yearText}>{year}</Text>
            </View>
          </View>
        </View>

        {/* Detailed Info */}
        <View style={styles.detailsSection}>
          <InfoRow icon="🎓" label="Degree" value={degree} />
          <InfoRow icon="📧" label="Email" value={email} />
          <InfoRow icon="🆔" label="Student ID" value={studentId} />
        </View>

        {/* Stats Section */}
        <View style={[styles.statsSection, { backgroundColor: CARD }]}>
          <View style={styles.statItem}>
            <Text style={statNumberStyle}>{completedFeedbacksCount}</Text>
            <Text style={statLabelStyle}>Feedbacks Given</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={statNumberStyle}>{earnedBadges.length}</Text>
            <Text style={statLabelStyle}>Badges Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={statNumberStyle}>{pendingCount}</Text>
            <Text style={statLabelStyle}> Pending Feedbacks</Text>
          </View>
        </View>
      </View>

      {/* Badges Section */}
      <View style={[styles.bagesCard, { backgroundColor: SURFACE }]}>
        {/* <View style={{ backgroundColor: CARD }}> */}
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: TEXT }]}>
            Achievement Badges
          </Text>
          <TouchableOpacity onPress={handleBadgesPress}>
            <Text style={[styles.seeAllText, { color: NAVY }]}>See All</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.sectionSubtitle, { color: TEXT }]}>
          {earnedBadges.length} of {BADGES.length} badges unlocked
        </Text>

        {/* Earned Badges */}
        <View style={styles.badgesGrid}>
          {earnedBadges.map((badge) => (
            <BadgeItem
              key={badge.id}
              badge={badge}
              openDetailsModal={() => openBadgeDetailsModal(badge)}
            />
          ))}
        </View>
        {/* </View> */}
        {/* Locked Badges Preview */}
        {lockedBadges.length > 0 && (
          <View style={styles.lockedSection}>
            <Text style={[styles.lockedTitle, { color: TEXT_SECONDARY }]}>
              Locked Badges
            </Text>
            <View style={styles.lockedBadges}>
              {lockedBadges.slice(0, 3).map((badge) => (
                <View
                  key={badge.id}
                  style={[styles.lockedBadge, { backgroundColor: CARD }]}
                >
                  <Text style={styles.lockedIcon}>🔒</Text>
                  <Text style={[styles.lockedName, { color: TEXT }]}>
                    {badge.name}
                  </Text>
                </View>
              ))}
              {lockedBadges.length > 3 && (
                <Text style={[styles.moreBadgesText, { color: NAVY }]}>
                  +{lockedBadges.length - 3} more
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Badges CTA Button */}
        <TouchableOpacity
          style={[styles.badgesButton, { backgroundColor: NAVY }]}
          onPress={handleBadgesPress}
        >
          <Text style={styles.badgesButtonText}>View All Badges</Text>
        </TouchableOpacity>
      </View>

      {/* Actions Section */}
      <View
        style={[
          styles.actionsCard,
          {
            backgroundColor: SURFACE,
            shadowColor: NAVY,
          },
        ]}
      >
        <TouchableOpacity style={actionButtonStyle}>
          <Text style={actionButtonTextStyle}>Edit Avatar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSettingsPress}
          style={actionButtonStyle}
        >
          <Text style={actionButtonTextStyle}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            ...actionButtonStyle,
            { borderWidth: 1, borderColor: "#f44336" },
          ]}
          onPress={handleLogout}
        >
          <Text style={[...actionButtonTextStyle, { color: "#f44336" }]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  profileCard: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: 600,
    textTransform: "uppercase",
  },
  basicInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    textTransform: "capitalize",
  },
  role: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  yearBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yearText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  detailsSection: {
    marginBottom: 20,
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 16,
    borderRadius: 12,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    wordWrap: "wrap",
  },
  // fillFeedbacksButton: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   backgroundColor: NAVY,
  //   padding: 16,
  //   borderRadius: 12,
  //   marginTop: 8,
  // },
  // fillFeedbacksIcon: {
  //   fontSize: 24,
  //   marginRight: 12,
  // },
  // fillFeedbacksTextContainer: {
  //   flex: 1,
  // },
  // fillFeedbacksTitle: {
  //   color: "#fff",
  //   fontSize: 16,
  //   fontWeight: "600",
  //   marginBottom: 2,
  // },
  // fillFeedbacksSubtitle: {
  //   color: "rgba(255, 255, 255, 0.8)",
  //   fontSize: 12,
  // },
  // chevron: {
  //   color: "#fff",
  //   fontSize: 20,
  //   fontWeight: "bold",
  // },
  bagesCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: "600",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
  },
  badgesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 20,
    justifyContent: "space-around",
  },
  lockedSection: {
    marginBottom: 20,
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  lockedBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  lockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  lockedIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  lockedName: {
    fontSize: 12,
  },
  moreBadgesText: {
    fontSize: 12,
    fontWeight: "500",
  },
  badgesButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  badgesButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  actionsCard: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  },
  actionButton: {
    backgroundColor: "#f8f9fa",
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  actionButtonText: {
    color: "#333",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default ProfileScreen;
