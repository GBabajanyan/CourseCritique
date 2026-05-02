import { useColors } from "@/src/hooks/useColors";
import { Badge } from "@/src/types/Badge";
import { Pressable, StyleSheet, Text, View } from "react-native";

const BadgeItem = ({
  badge,
  openDetailsModal = () => {},
}: {
  badge: Badge;
  openDetailsModal?: () => void;
}) => {
  const { SAFFRON, TEXT_SECONDARY, NAVY } = useColors();

  return (
    <Pressable style={styles.badgeItem} onPress={openDetailsModal}>
      <View
        style={[
          styles.badgeIcon,
          {
            backgroundColor: badge.earned ? SAFFRON : TEXT_SECONDARY,
            opacity: badge.earned ? 1 : 0.5,
          },
        ]}
      >
        <Text style={styles.badgeIconText}>{badge.icon}</Text>
      </View>
      <Text style={[styles.badgeName, { color: NAVY }]}>{badge.name}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  badgeItem: {
    alignItems: "center",
    width: "33%",
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
    fontSize: 28,
  },
  badgeName: {
    fontSize: 12,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default BadgeItem;
