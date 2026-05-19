import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { observer } from "mobx-react-lite";
import { useStore } from "@/src/store/StoreProvider";
import { useColors } from "@/src/hooks/useColors";
import { Notification } from "@/src/types/User";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

const NotificationDropdown = observer(() => {
  const router = useRouter();
  const { notificationsStore, feedbackStore } = useStore();
  const { getNotifications, removeNotification, clearAllNotifications } =
    notificationsStore;
  const { pendingFeedbacks, setCurrentFeedbackCourse } = feedbackStore;

  const { TEXT, TEXT_SECONDARY, CARD, BORDER } = useColors();
  const [visible, setVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const notifs = getNotifications();
    setNotifications(notifs);
  }, [notificationsStore.notifications]);

  const handleNotificationPress = async (notification: Notification) => {
    await removeNotification(notification.displayId);
    setNotifications((prev) =>
      prev.filter((n) => n.displayId !== notification.displayId),
    );

    if (notification.data) {
      const { data } = notification;
      switch (data.type) {
        case "deadline":
        case "last_chance":
        case "early_bird":
          if (data?.feedbackId) {
            const pendingCourse = pendingFeedbacks.find(
              (value) => value.id === data.feedbackId,
            );
            if (pendingCourse) {
              setCurrentFeedbackCourse(pendingCourse);
              router.push("/feedback/Pending/FeedbackForm");
            } else {
              router.replace("/feedback/Pending");
            }
          }
          break;
        case "weekly_reminder":
          router.replace("/(protected)/(tabs)/feedback/Pending");
          break;
        case "thank_you":
          router.replace("/(protected)/(tabs)/feedback/Completed");
          break;
        case "achievement":
          router.push("/(protected)/(tabs)/profile/allBadges");
          break;
        default:
          break;
      }
    }
    setVisible(false);
  };

  const handleClearAll = async () => {
    await clearAllNotifications();
    setNotifications([]);
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      style={[styles.notificationItem, { borderBottomColor: BORDER }]}
      onPress={() => handleNotificationPress(item)}
    >
      <View style={styles.notificationIcon}>
        {item.type === "deadline" && (
          <Ionicons name="alert-circle" size={24} color="#FF6B35" />
        )}
        {item.type === "weekly" && (
          <Ionicons name="calendar" size={24} color="#007AFF" />
        )}
        {item.type === "achievement" && (
          <Ionicons name="trophy" size={24} color="#FFD700" />
        )}
      </View>
      <View style={styles.notificationContent}>
        <Text style={[styles.notificationTitle, { color: TEXT }]}>
          {item.title}
        </Text>
        <Text style={[styles.notificationBody, { color: TEXT_SECONDARY }]}>
          {item.body}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={TEXT_SECONDARY} />
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.bellButton}
        onPress={() => setVisible(true)}
      >
        <Ionicons name="notifications-outline" size={24} color={TEXT} />
        {notifications.length > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notifications.length > 99 ? "99+" : notifications.length}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdownContainer, { backgroundColor: CARD }]}>
            <View
              style={[styles.dropdownHeader, { borderBottomColor: BORDER }]}
            >
              <Text style={[styles.dropdownTitle, { color: TEXT }]}>
                Notifications
              </Text>
              {notifications.length > 0 && (
                <TouchableOpacity onPress={handleClearAll}>
                  <Text style={styles.clearText}>Clear all</Text>
                </TouchableOpacity>
              )}
            </View>

            {notifications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="notifications-off-outline"
                  size={48}
                  color={TEXT_SECONDARY}
                />
                <Text style={[styles.emptyText, { color: TEXT_SECONDARY }]}>
                  No notifications
                </Text>
              </View>
            ) : (
              <FlatList
                data={notifications}
                keyExtractor={(item) => item.displayId}
                renderItem={renderNotification}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  bellButton: {
    position: "absolute",
    padding: 8,
    right: 10,
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dropdownContainer: {
    position: "absolute",
    top: 60,
    right: 16,
    width: width - 32,
    maxHeight: "70%",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  dropdownTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  clearText: {
    fontSize: 14,
    color: "#007AFF",
  },
  notificationItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  notificationIcon: {
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  notificationBody: {
    fontSize: 12,
  },
  emptyContainer: {
    alignItems: "center",
    padding: 40,
  },
  emptyText: {
    marginTop: 12,
    fontSize: 14,
  },
});

export default NotificationDropdown;
