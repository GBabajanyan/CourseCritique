import { StyleSheet, Text, View } from "react-native";

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
export default InfoRow;