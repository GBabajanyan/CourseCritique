import { Colors } from "@/src/constants/colors";
import { useStore } from "@/src/store/StoreProvider";
import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

import { MarkedDates } from "react-native-calendars/src/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const { NAVY, WHITE, SAFFRON } = Colors;

const HomeScreen: React.FC = observer(() => {
  const today = new Date().toISOString().split("T")[0];
  const [dateSelected, setDateSelected] = useState(today);
  const { bottom } = useSafeAreaInsets();
  const { ProfileStore } = useStore();
  // const { getUserData } = ProfileStore;

  const markedDates: MarkedDates = {
    [dateSelected]: {
      selected: true,
    },
    "2026-03-17": {
      periods: [
        {
          startingDay: true,
          endingDay: true,
          color: "#ff6b6b",
        },
      ],
    },
  };
  const ev = [
    { id: 1, time: "12:30", title: "eh" },
    { id: 2, time: "12:30", title: "eh" },
    { id: 3, time: "12:30", title: "eh" },
    { id: 4, time: "12:30", title: "eh" },
    { id: 5, time: "12:30", title: "eh" },
    { id: 6, time: "12:30", title: "eh" },
    { id: 7, time: "12:30", title: "eh" },
  ];

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
  const getEventsForSelectedDate = () => {
    return ev;
    // return events.filter((event) => isSameDay(dateSelected, event.date));
  };
  const a = () => {
    return (
      <View style={{ height: 100, backgroundColor: "red" }}>
        <Text>Sticky Header</Text>
      </View>
    );
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.CalendarContainer}>
        <Calendar
          onDayPress={(day) => {
            setDateSelected(day.dateString);
            console.log("selected day", dateSelected);
          }}
          style={styles.eventCalendar}
          enableSwipeMonths
          markingType="multi-period"
          markedDates={markedDates}
          theme={{
            todayBackgroundColor: NAVY,
            todayTextColor: WHITE,
            calendarBackground: WHITE,
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#2d4150",
            selectedDayTextColor: WHITE,
            dayTextColor: "#2d4150",
            textDisabledColor: "#dd99ee",
          }}
        />
      </View>
      <View style={styles.eventsContainer}>
        <Text style={styles.eventsTitle}>Events for {dateSelected}</Text>
        {getEventsForSelectedDate().length > 0 ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.eventsScrollViewContainer,
              { paddingBottom: bottom },
            ]}
          >
            {ev.map((evt) => (
              <View key={evt.id} style={styles.eventItem}>
                <View style={styles.eventTime}>
                  <Text style={styles.eventTimeText}>{evt.time}</Text>
                </View>
                <View style={styles.eventDetails}>
                  <Text style={styles.eventTitle}>{evt.title}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.noEvents}>No events for this date</Text>
        )}
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 20,
    paddingHorizontal: 24,
    gap: 32,
  },
  CalendarContainer: {
    display: "contents",
    flex: 1,
  },
  eventCalendar: {
    borderColor: NAVY,
    borderWidth: 1,
    borderRadius: 50,
    padding: "5%",
    paddingBottom: "10%",
    shadowColor: NAVY,
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
    color: "#666",
  },
  eventsContainer: {
    flex: 1,
    gap: 16,
  },
  eventsScrollViewContainer: {
    gap: 16,
    paddingHorizontal: 4,
    overflowY: "hidden",
  },
  eventItem: {
    flexDirection: "row",
    backgroundColor: "#f8f8f8",
    padding: 15,
    // marginBottom: 100,
    borderRadius: 10,
    shadowColor: NAVY,
    shadowOffset: {
      width: 3,
      height: 3,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
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
