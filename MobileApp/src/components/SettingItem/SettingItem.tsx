import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";

const SettingItem = ({
  icon,
  title,
  subtitle,
  type = "link",
  value,
  onPress,
  onValueChange,
}: any) => (
  <TouchableOpacity
    style={styles.settingItem}
    onPress={onPress}
    disabled={type === "toggle"}
    activeOpacity={0.7}
  >
    <View style={styles.settingIcon}>
      <Ionicons name={icon} size={22} color="#666" />
    </View>
    <View style={styles.settingContent}>
      <Text style={styles.settingTitle}>{title}</Text>
      {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
    </View>
    {type === "toggle" && (
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#ddd", true: "#007AFF" }}
        thumbColor="#fff"
      />
    )}
    {type === "link" && (
      <Ionicons name="chevron-forward" size={20} color="#ccc" />
    )}
    {type === "version" && <Text style={styles.versionText}>1.0.0</Text>}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  settingIcon: {
    width: 32,
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: "#333",
  },
  settingSubtitle: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
  },
  versionText: {
    fontSize: 14,
    color: "#999",
  },
});
export default SettingItem;
