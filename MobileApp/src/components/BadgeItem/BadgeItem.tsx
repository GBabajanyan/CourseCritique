import { Colors } from "@/src/constants/colors";
import { Badge } from "@/src/mock/badges";
import { Pressable, StyleSheet, Text, View } from "react-native";
const { SAFFRON, NAVY } = Colors;

const BadgeItem = ({
  badge,
  openDetailsModal = () => {},
}: {
  badge: Badge;
  openDetailsModal?: () => void;
}) => {
  return (
    <Pressable style={styles.badgeItem} onPress={openDetailsModal}>
      <View style={[styles.badgeIcon]}>
        <Text style={styles.badgeIconText}>{badge.icon}</Text>
      </View>
      <Text style={styles.badgeName}>{badge.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  badgeItem: {
    alignItems: "center",
    width: "30%",
  },
  badgeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    backgroundColor: SAFFRON,
  },
  badgeIconText: {
    fontSize: 28,
  },
  badgeName: {
    color: NAVY,
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default BadgeItem;
