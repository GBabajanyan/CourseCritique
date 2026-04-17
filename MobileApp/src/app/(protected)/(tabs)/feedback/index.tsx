import { Colors } from "@/src/constants/colors";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import CompletedFeedbacks from "./Completed";
import PendingFeedbacks from "./Pending";
import SearchFeedbacks from "./Search";
const { NAVY, WHITE } = Colors;

const renderScene = SceneMap({
  pending: () => <PendingFeedbacks />,
  completed: () => <CompletedFeedbacks />,
  search: () => <SearchFeedbacks />,
});

const Feedback = () => {
  const router = useRouter();
  const layout = useWindowDimensions();
  const { tabIndex } = useLocalSearchParams<{ tabIndex: string }>();
  const initialTab = tabIndex ? parseInt(tabIndex) : 0;

  // After reading, immediately clean the URL
  useEffect(() => {
    if (tabIndex) {
      router.setParams({ tabIndex: undefined });
    }
  }, []);

  const [index, setIndex] = useState(initialTab);

  const [routes] = useState([
    { key: "pending", title: "Pending" },
    { key: "completed", title: "Completed" },
    { key: "search", title: "Search" },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      renderTabBar={(props: any) => {
        return (
          <TabBar
            {...props}
            style={styles.tabBar}
            indicatorStyle={styles.indicator}
            activeColor={WHITE}
            inactiveColor={NAVY}
            pressOpacity={0.9}
            // onTabPress={({ route }) => console.log(JSON.stringify(route))} //on tab press scroll to top
          />
        );
      }}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      swipeEnabled={true}
      animationEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderRadius: 40,
    backgroundColor: "white",
    transform: [{ scale: 0.9 }],
    zIndex: 1,
    elevation: 1,
    borderColor: WHITE,
    borderWidth: 2,
  },
  indicator: {
    position: "absolute",
    height: "100%",
    borderRadius: 40,
    opacity: 0.9,
    backgroundColor: NAVY,
  },
});

export default Feedback;
