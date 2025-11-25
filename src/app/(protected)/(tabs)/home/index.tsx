import { Colors } from "@/src/constants/colors";
import React, { useState } from "react";
import { ScrollView, StatusBar, StyleSheet, Text } from "react-native";

import { Calendar } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const HomeScreen: React.FC = () => {
  const today = new Date().toLocaleDateString().replaceAll("/", "-");
  const [dateSelected, setDateSelected] = useState(today);
  const insets = useSafeAreaInsets();
  const markedDates: MarkedDates = {
    [today]: {
      selected: true,
    },
    "2025-11-11": {
      // periods: [
      //   {
      startingDay: true,
      endingDay: false,
      color: "#ff6b6b",
      //   },
      // ],
    },
    "2025-11-13": {
      // periods: [
      //   {
      startingDay: false,
      endingDay: true,
      color: "#ff6b6b",
      //   },
      // ],
    },
    "2025-11-12": {
      // type: "multi-period",
      // periods: [
      // {
      startingDay: true,
      endingDay: true,
      color: "yellow",

      // },
      // { startingDay: false, endingDay: false, color: "#4ecdc4" },
      // ],
    },
  };

  // useEffect(() => {
  //   const todayDate = new Date();
  //   const todayDateData: DateData = {
  //     year: todayDate.getFullYear(),
  //     month: todayDate.getMonth(),
  //     day: todayDate.getDay(),
  //     timestamp: Date.now(),
  //     dateString: todayDate.toLocaleDateString().replaceAll("/", "-"),
  //   };
  //   setDateSelected(todayDateData);
  // }, []);

  // Check if two dates are the same day
  // const isSameDay = (date1: DateData | undefined, date2: Date): boolean => {
  //   return (
  //     date1?.day === date2.getDate() &&
  //     date1?.month === date2.getMonth() &&
  //     date1?.year === date2.getFullYear()
  //   );
  // };

  // // Filter events for selected date
  // const getEventsForSelectedDate = (): Event[] => {
  //   return events.filter((event) => isSameDay(dateSelected, event.date));
  // };

  return (
    <ScrollView style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <Calendar
        onDayPress={(day) => {
          setDateSelected(day.dateString);
          console.log("selected day", dateSelected);
        }}
        enableSwipeMonths
        markingType="period"
        markedDates={markedDates}
        theme={{
          todayBackgroundColor: Colors.NAVY,
          todayTextColor: "#fff",
          // calendarBackground: "#ffffff",
          // textSectionTitleColor: "#b6c1cd",
          // selectedDayBackgroundColor: "#2d4150",
          // selectedDayTextColor: "#ffffff",
          // todayTextColor: "#00adf5",
          // dayTextColor: "#2d4150",
          // textDisabledColor: "#dd99ee",
        }}
      />

      {/* Events List */}
      <ScrollView style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>Events for {dateSelected}</Text>

        {/* {getEventsForSelectedDate().length > 0 ? (
          getEventsForSelectedDate().map((event) => (
            <View key={event.id} style={styles.eventItem}>
              <View style={styles.eventTime}>
                <Text style={styles.eventTimeText}>{event.time}</Text>
              </View>
              <View style={styles.eventDetails}>
                <Text style={styles.eventTitle}>{event.title}</Text>
              </View>
            </View>
          ))
        ) : ( */}
        <Text style={styles.noEvents}>No events for this date</Text>
        {/* )} */}
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  calendarNavButton: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003A5D",
    paddingHorizontal: 15,
  },
  navigationHeader: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    alignItems: "center",
  },
  navButton: {
    backgroundColor: "#003A5D",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  navButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  monthYear: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
  },
  daysHeader: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  dayName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    width: 40,
    textAlign: "center",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  dayCell: {
    width: "14.28%", // 7 days in a week
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  dayText: {
    fontSize: 16,
    color: "#333",
  },
  selectedDay: {
    backgroundColor: "#003A5D",
    borderRadius: 20,
  },
  selectedDayText: {
    color: "#fff",
    fontWeight: "600",
  },
  today: {
    borderWidth: 2,
    borderColor: "#EEBC03",
    borderRadius: 20,
  },
  todayText: {
    color: "#003A5D",
    fontWeight: "600",
  },
  selectedDateContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  eventsContainer: {
    flex: 1,
    padding: 20,
  },
  eventsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    marginBottom: 15,
  },
  eventItem: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  eventTime: {
    marginRight: 15,
    justifyContent: "center",
  },
  eventTimeText: {
    fontSize: 14,
    color: "#003A5D",
    fontWeight: "500",
  },
  eventDetails: {
    flex: 1,
    justifyContent: "center",
  },
  eventTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  noEvents: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 20,
  },
});

export default HomeScreen;
