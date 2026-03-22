import BadgeDetailsModal from "@/src/components/BadgeDetailsModal/BadgeDetailsModal";
import BadgeItem from "@/src/components/BadgeItem/BadgeItem";
import InfoRow from "@/src/components/InfoRow/InfoRow";
import { Colors } from "@/src/constants/colors";
import { userData } from "@/src/mock";
import { Badge, BADGES } from "@/src/mock/badges";
import { useStore } from "@/src/store/StoreProvider";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { NAVY, SAFFRON } = Colors;

const ProfileScreen: React.FC = () => {
  const { authStore } = useStore();
  const router = useRouter();
  const { logout, disableBiometrics } = authStore;
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
  const earnedBadges = BADGES.filter((badge, i) => i < 3);
  const lockedBadges = BADGES.filter((badge, i) => i >= 3 && i < 6);

  const handleBadgesPress = () => {
    router.navigate("/(protected)/(tabs)/profile/allBadges");
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
      style={styles.scrollView}
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
      <View style={styles.profileCard}>
        {/* Avatar and Basic Info */}
        <View style={styles.avatarSection}>
          <Image src={userData.avatar} style={styles.avatarContainer} />
          <View style={styles.basicInfo}>
            <Text style={styles.name}>{userData.name}</Text>
            <Text style={styles.role}>{userData.role}</Text>
            <View
              style={[
                styles.yearBadge,
                { backgroundColor: getYearColor(userData.year) },
              ]}
            >
              <Text style={styles.yearText}>{userData.year}</Text>
            </View>
          </View>
        </View>

        {/* Detailed Info */}
        <View style={styles.detailsSection}>
          <InfoRow icon="🎓" label="Degree" value={userData.degree} />
          <InfoRow icon="📧" label="Email" value={userData.email} />
          <InfoRow icon="🆔" label="Student ID" value={userData.studentId} />
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.feedbacksGiven}</Text>
            <Text style={styles.statLabel}>Feedbacks Given</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{earnedBadges.length}</Text>
            <Text style={styles.statLabel}>Badges Earned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{userData.feedbacksToFill}</Text>
            <Text style={styles.statLabel}> Pending Feedbacks</Text>
          </View>
        </View>
      </View>

      {/* Badges Section */}
      <View style={styles.bagesCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Achievement Badges</Text>
          <TouchableOpacity onPress={handleBadgesPress}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionSubtitle}>
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

        {/* Locked Badges Preview */}
        {lockedBadges.length > 0 && (
          <View style={styles.lockedSection}>
            <Text style={styles.lockedTitle}>Locked Badges</Text>
            <View style={styles.lockedBadges}>
              {lockedBadges.slice(0, 3).map((badge) => (
                <View key={badge.id} style={styles.lockedBadge}>
                  <Text style={styles.lockedIcon}>🔒</Text>
                  <Text style={styles.lockedName}>{badge.name}</Text>
                </View>
              ))}
              {lockedBadges.length > 3 && (
                <Text style={styles.moreBadgesText}>
                  +{lockedBadges.length - 3} more
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Badges CTA Button */}
        <TouchableOpacity
          style={styles.badgesButton}
          onPress={handleBadgesPress}
        >
          <Text style={styles.badgesButtonText}>View All Badges</Text>
        </TouchableOpacity>
      </View>

      {/* Actions Section */}
      <View style={styles.actionsCard}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={disableBiometrics}
        >
          <Text style={styles.actionButtonText}>Disable Biometric Auth</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.logoutButton]}
          onPress={logout}
        >
          <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
            Log Out
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  profileCard: {
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
  avatarSection: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: SAFFRON,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatar: {
    fontSize: 4,
  },
  basicInfo: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  role: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
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
    backgroundColor: "#f8f9fa",
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
    color: NAVY,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    wordWrap: "wrap",
  },
  fillFeedbacksButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: NAVY,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  fillFeedbacksIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  fillFeedbacksTextContainer: {
    flex: 1,
  },
  fillFeedbacksTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  fillFeedbacksSubtitle: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
  },
  chevron: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
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
    color: "#1a1a1a",
  },
  seeAllText: {
    color: NAVY,
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
  badgeItem: {
    alignItems: "center",
    width: "33.33%",
    marginBottom: 16,
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  badgeIconText: {
    fontSize: 24,
  },
  badgeName: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
    fontWeight: "500",
  },
  lockedSection: {
    marginBottom: 20,
  },
  lockedTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 12,
  },
  lockedBadges: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  lockedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
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
    color: "#999",
  },
  moreBadgesText: {
    fontSize: 12,
    color: NAVY,
    fontWeight: "500",
  },
  badgesButton: {
    backgroundColor: NAVY,
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
  logoutButton: {
    backgroundColor: "#ffebee",
    borderWidth: 1,
    borderColor: "#f44336",
  },
  logoutButtonText: {
    color: "#f44336",
  },
});

export default ProfileScreen;
