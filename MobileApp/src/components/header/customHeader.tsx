import { useActiveTabParams } from "@/src/hooks/useActiveTabParams";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomHeader = () => {
  const router = useRouter();
  const { title, subtitle, parentRouteName } = useActiveTabParams();
  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <SafeAreaView style={styles.header} edges={["top"]}>
      {parentRouteName && (
        <Pressable style={styles.goBackButton} onPress={goBack}>
          <Text
            style={styles.goBackText}
          >{`< ${parentRouteName || "Back"}`}</Text>
        </Pressable>
      )}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    justifyContent: "center",
  },
  goBackButton: {
    flex: 0,
    position: "absolute",
    left: 10,
    bottom: "50%",
  },
  goBackText: {
    fontSize: 18,
    color: "#007AFF",
    textTransform: "capitalize",
  },
  titleContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    position: "relative",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
});

export default CustomHeader;
