import { Colors } from "@/src/constants/colors";
import { Link, usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
const { NAVY, WHITE } = Colors;

const FeedbackTabBar = () => {
  const activeTab = usePathname();
  const router = useRouter();

  return (
    <View style={styles.tabContainer}>
      <Link
        href="/(protected)/(tabs)/feedback/Pending"
        style={[styles.tab, activeTab.includes("Pending") && styles.activeTab]}
        onPress={() => router.push("/(protected)/(tabs)/feedback/Pending")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab.includes("Pending") && styles.activeTabText,
          ]}
        >
          To Complete
        </Text>
      </Link>
      <TouchableOpacity
        style={[
          styles.tab,
          activeTab.includes("Completed") && styles.activeTab,
        ]}
        onPress={() => router.push("/(protected)/(tabs)/feedback/Completed")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab.includes("Completed") && styles.activeTabText,
          ]}
        >
          Completed
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.tab, activeTab.includes("Search") && styles.activeTab]}
        onPress={() => router.push("/(protected)/(tabs)/feedback/Search")}
      >
        <Text
          style={[
            styles.tabText,
            activeTab.includes("Search") && styles.activeTabText,
          ]}
        >
          Search
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  tabContainer: {
    width: "95%",
    alignSelf: "center",
    marginTop: 10,
    flexDirection: "row",
    backgroundColor: "rgba(33, 16, 215,0.1)",
    borderRadius: 20,
    // backgroundColor:'transparent',
    // borderBottomWidth: 1,
    // borderBottomColor: "#e0e0e0",
  },
  tab: {
    // paddingVertical: 0,
    flex: 1,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    // borderBottomWidth: 3,
    // borderBottomColor: "transparent",
  },
  activeTab: {
    // backgroundColor: "red",
    backgroundColor: WHITE,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeTabText: {
    color: NAVY,
  },
});
export default FeedbackTabBar;
