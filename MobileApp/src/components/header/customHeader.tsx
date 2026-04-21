import { useActiveTabParams } from "@/src/hooks/useActiveTabParams";
import { useColors } from "@/src/hooks/useColors";
import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomHeader = () => {
  const router = useRouter();
  const { WHITE, TEXT, BORDER, NAVY } = useColors();
  const { title, subtitle, parentRouteName } = useActiveTabParams();
  const goBack = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <SafeAreaView
      style={[
        styles.header,
        { backgroundColor: WHITE, borderBottomColor: BORDER },
      ]}
      edges={["top"]}
    >
      {parentRouteName && (
        <Pressable style={styles.goBackButton} onPress={goBack}>
          <Text
            style={[styles.goBackText, { color: NAVY }]}
          >{`< ${parentRouteName || "Back"}`}</Text>
        </Pressable>
      )}
      <View style={styles.titleContainer}>
        <Text style={[styles.title, { color: TEXT }]}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
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
