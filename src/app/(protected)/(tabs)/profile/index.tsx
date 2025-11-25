import { badges, userData } from "@/src/mock";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();

  const earnedBadges = badges.filter((badge) => badge.earned);
  const lockedBadges = badges.filter((badge) => !badge.earned);

  const handleBadgesPress = () => {
    // For now, just log - will navigate to badges page in future
    console.log("Navigate to badges page");
    // navigation.navigate('Badges');
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Avatar and Basic Info */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatar}>{userData.avatar}</Text>
            </View>
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
        <View style={styles.badgesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Achievement Badges</Text>
            <TouchableOpacity onPress={handleBadgesPress}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.sectionSubtitle}>
            {earnedBadges.length} of {badges.length} badges unlocked
          </Text>

          {/* Earned Badges */}
          <View style={styles.badgesGrid}>
            {earnedBadges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <View
                  style={[styles.badgeIcon, { backgroundColor: badge.color }]}
                >
                  <Text style={styles.badgeIconText}>{badge.icon}</Text>
                </View>
                <Text style={styles.badgeName}>{badge.name}</Text>
              </View>
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
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.logoutButton]}>
            <Text style={[styles.actionButtonText, styles.logoutButtonText]}>
              Log Out
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

// Helper component for info rows
const InfoRow: React.FC<{ icon: string; label: string; value: string }> = ({
  icon,
  label,
  value,
}) => (
  <View style={infoRowStyles.container}>
    <View style={infoRowStyles.iconContainer}>
      <Text style={infoRowStyles.icon}>{icon}</Text>
    </View>
    <View style={infoRowStyles.textContainer}>
      <Text style={infoRowStyles.label}>{label}</Text>
      <Text style={infoRowStyles.value}>{value}</Text>
    </View>
  </View>
);

const infoRowStyles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    width: 40,
    alignItems: "center",
  },
  icon: {
    fontSize: 20,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
  },
  profileCard: {
    backgroundColor: "#fff",
    margin: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
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
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  avatar: {
    fontSize: 40,
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
    color: "#007AFF",
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
    backgroundColor: "#007AFF",
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
  badgesSection: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
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
    color: "#007AFF",
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
    color: "#007AFF",
    fontWeight: "500",
  },
  badgesButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  badgesButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  actionsSection: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 0,
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
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
