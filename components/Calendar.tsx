import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";
import { useNavigation, useRoute, useFocusEffect } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../pages/types/types";
import {getActiveUser} from "../service/storage";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type NavProp = NativeStackNavigationProp<RootStackParamList, "IncomeAndExpenses">;
interface Props {
  businessId: string;
}
export default function Calendar() {
  const navigation = useNavigation<NavProp>();
  const route = useRoute<any>();
  const { theme } = useTheme();

  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [markedDates, setMarkedDates] = useState<Set<string>>(new Set());

  const formatLocalDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  /* =========================
     QAYTIB KELGANDA SAQLASH
  ========================== */
  useFocusEffect(
      React.useCallback(() => {
        if (route.params?.selectedDate && route.params?.businessId) {
          const date = new Date(route.params.selectedDate);
          setCurrentDate(new Date(date.getFullYear(), date.getMonth(), 1));
          setSelectedDay(date.getDate());
        }
      }, [route.params])
  );

  /* =========================
      KALENDAR LOGIKASI
  ========================== */
  const getDaysInMonth = (month: number, year: number) =>
    Array.from(
      { length: new Date(year, month + 1, 0).getDate() },
      (_, i) => i + 1
    );

  const prevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
    setSelectedDay(0);
  };

  const nextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
    setSelectedDay(0);
  };

  const goToday = () => {
      setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
      setSelectedDay(today.getDate());
      // const businessId = route.params?.businessId || "defaultBusiness";
      // navigation.navigate("IncomeAndExpenses", {
      //   selectedDate: today.toISOString(),
      //   businessId
      // });
  };

  const onDayPress = (day: number) => {
    setSelectedDay(day);

    const fullDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const businessId = route.params?.businessId || "defaultBusiness";
    navigation.navigate("IncomeAndExpenses", {
        selectedDate: formatLocalDate(fullDate),
        businessId
    });
  };

  const days = getDaysInMonth(
    currentDate.getMonth(),
    currentDate.getFullYear()
  );

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay(); // 0 = Sunday

  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const calendarDays = [...Array(offset).fill(null), ...days];

  const rows = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    rows.push(calendarDays.slice(i, i + 7));
  }

  useEffect(() => {
  const loadMarkedDays = async () => {
    const user = await getActiveUser();
    if (!user) return;
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // 1–12
    const marks = new Set<string>();
    user.business?.forEach((b) => {
      // b.id = YYYY-MM-DD
      const [y, m] = b.id.split("-").map(Number);

      if (y === year && m === month && b.calendar.length > 0) {
        marks.add(b.id);
      }
    });

    setMarkedDates(marks);
  };
  loadMarkedDays();
}, [currentDate]);


  return (
    <View>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity onPress={prevMonth}>
            <Text style={[styles.arrow, { color: theme.text }]}>◀</Text>
          </TouchableOpacity>

          <Text style={[styles.month, { color: theme.text }]}>
            {currentDate.toLocaleString("default", { month: "long" })}{" "}
            {currentDate.getFullYear()}
          </Text>

          <TouchableOpacity onPress={nextMonth}>
            <Text style={[styles.arrow, { color: theme.text }]}>▶</Text>
          </TouchableOpacity>
        </View>

        {/* WEEK DAYS */}
        <View style={styles.weekDays}>
          {WEEK_DAYS.map((day) => (
            <Text key={day} style={[styles.weekDay, { color: theme.success }]}>
              {day}
            </Text>
          ))}
        </View>

        {/* DAYS */}
        {rows.map((week, rowIndex) => (
          <View key={rowIndex} style={styles.weekRow}>
            {week.map((day, index) => {
              if (!day) {
                return <View key={index} style={styles.dayBox}/>
              }
              const isToday =
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

              const isSelected = day === selectedDay;
              const isSunday = index === 6;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayBox,
                    {
                      borderColor: isToday ? theme.primary : theme.card,
                      backgroundColor: isSelected
                        ? theme.placeholder
                        : "transparent",
                    },
                  ]}
                  onPress={() => onDayPress(day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: isSunday ? theme.danger : theme.text },
                    ]}
                  >
                    {day}
                  </Text>
                  {(() => {
                    const fullDateStr = `${currentDate.getFullYear()}-${String(
                      currentDate.getMonth() + 1
                    ).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                    return markedDates.has(fullDateStr) ? (
                      <View style={styles.notify} />
                    ) : null;
                  })()}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>

      {/* TODAY BUTTON */}
      <TouchableOpacity
        style={[styles.todayBtn, { backgroundColor: theme.card }]}
        onPress={goToday}
      >
        <Text style={{ color: theme.text, fontSize: 16 }}>Bugun</Text>
      </TouchableOpacity>
    </View>
  );
}

/* =========================
          STYLES
========================= */
const styles = StyleSheet.create({
  container: { padding: 10, borderRadius: 12 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  arrow: { fontSize: 20, padding: 8 },
  month: { fontSize: 18, fontWeight: "bold" },
  weekDays: { flexDirection: "row", marginBottom: 6 },
  weekDay: { flex: 1, textAlign: "center", fontWeight: "bold" },
  weekRow: { flexDirection: "row" },
  dayBox: {
    flex: 1,
    margin: 2,
    paddingVertical: 10,
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
  dayText: { fontSize: 16 },
  todayBtn: {
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  notify:{
    height: 5,
    width: 5,
    borderRadius: 5,
    backgroundColor: "#599b9b",
  }
});
