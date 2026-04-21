import ToDoItem from "@/src/components/ToDoItem/ToDoItem";
import { useColors } from "@/src/hooks/useColors";
import { useStore } from "@/src/store/StoreProvider";
import { isTheDateBetween } from "@/src/util/general";
import { observer } from "mobx-react";
import React, { useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

import { DateData } from "react-native-calendars/src/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const HomeScreen: React.FC = observer(() => {
  const { NAVY, WHITE, SAFFRON, TEXT, TEXT_SECONDARY, BACKGROUND } =
    useColors();
  const { bottom } = useSafeAreaInsets();
  const { feedbackStore, settingsStore } = useStore();
  const {
    isPageLoading,
    pendingCalendar,
    pendingFeedbacks,
    switchSelectedDateOnCalendar,
    // loadPendingCoursesForHome,
  } = feedbackStore;
  const { currentDate, theme } = settingsStore;
  const [dateSelected, setDateSelected] = useState(currentDate);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     loadPendingCoursesForHome();
  //   }, []),
  // );

  const eventsForSelectedDate = useMemo(() => {
    return pendingFeedbacks.filter(({ startDate, deadline }) =>
      startDate ? isTheDateBetween(dateSelected, startDate, deadline) : false,
    );
  }, [dateSelected, pendingFeedbacks]);

  const handleCalendarDayPress = (day: DateData) => {
    const newDateString = day.dateString;
    switchSelectedDateOnCalendar(dateSelected, newDateString);
    setDateSelected(newDateString);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: BACKGROUND }}
      contentContainerStyle={[
        styles.container,
        styles.eventsScrollViewContainer,
        { paddingBottom: bottom + 20 },
      ]}
    >
      <View style={styles.CalendarContainer}>
        <Calendar
          key={theme}
          onDayPress={handleCalendarDayPress}
          style={[
            styles.eventCalendar,
            {
              borderColor: NAVY,
              shadowColor: NAVY,
            },
          ]}
          enableSwipeMonths
          markingType="multi-period"
          markedDates={pendingCalendar}
          theme={{
            todayBackgroundColor: SAFFRON,
            todayTextColor: WHITE,
            calendarBackground: WHITE,
            dayTextColor: TEXT,
            monthTextColor: TEXT_SECONDARY,
            textDisabledColor: TEXT_SECONDARY,
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#2d4150",
            selectedDayTextColor: "#fff",
          }}
          hideArrows
          displayLoadingIndicator={isPageLoading}
        />
      </View>
      {isPageLoading ? (
        <ActivityIndicator size="large" color={NAVY} />
      ) : (
        <View style={styles.eventsContainer}>
          <Text style={styles.eventsTitle}>TO-DOs for {dateSelected}</Text>
          {eventsForSelectedDate.length > 0 ? (
            eventsForSelectedDate.map((evt) => (
              <ToDoItem key={evt.id} item={evt} />
            ))
          ) : (
            <Text style={styles.noEvents}>No events for this date</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 32,
  },
  CalendarContainer: {
    display: "contents",
    flex: 1,
  },
  eventCalendar: {
    borderWidth: 1,
    borderRadius: 50,
    paddingBottom: "7%",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 10,
    shadowRadius: 5,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#938b8b",
  },
  eventsContainer: {
    flex: 1,
    gap: 16,
  },
  eventsScrollViewContainer: {
    // gap: 16,
    // paddingHorizontal: 4,
    // overflowY: "hidden",
  },
  noEvents: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
  },
});

export default HomeScreen;
