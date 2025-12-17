import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeContext";

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(null); // Bosilgan kun
  const { theme } = useTheme();

  const getDaysInMonth = (month, year) => {
    return new Array(new Date(year, month + 1, 0).getDate())
      .fill(null)
      .map((_, i) => i + 1);
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    setSelectedDay(null); // Oy o‘zgarganda tanlovni tozalash
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    setSelectedDay(null);
  };

  const getToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDay(today.getDate());
  };

  const todayItem = (day) => {
    console.log("Taday! Bosilgan kun:", day);
    setSelectedDay(day);
  };

  const today = new Date();
  const days = getDaysInMonth(currentDate.getMonth(), currentDate.getFullYear());

  // Haftaning boshlanishi Dushanba uchun offset
  const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay(); // 0=Sun
  const offset = firstDay === 0 ? 6 : firstDay - 1;
  const calendarDays = [...Array(offset).fill(null), ...days];

  // 7 kunlik rowlarga ajratish
  const rows = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    rows.push(calendarDays.slice(i, i + 7));
  }

  return (
    <View>
      <View style={[styles.container, { backgroundColor: theme.card }]}>
        <View style={styles.header}>
          <TouchableOpacity style={{ padding: 10 }} onPress={prevMonth}>
            <Text style={[styles.arrow, { color: theme.text }]}>◀</Text>
          </TouchableOpacity>
          <Text style={[styles.month, { color: theme.text }]}>
            {currentDate.toLocaleString("default", { month: "long" })} {currentDate.getFullYear()}
          </Text>
          <TouchableOpacity style={{ padding: 10 }} onPress={nextMonth}>
            <Text style={[styles.arrow, { color: theme.text }]}>▶</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.weekDays}>
          {WEEK_DAYS.map((day) => (
            <Text key={day} style={[styles.weekDay, { color: theme.success }]}>
              {day}
            </Text>
          ))}
        </View>

        {rows.map((week, rowIndex) => (
          <View key={rowIndex} style={styles.weekRow}>
            {week.map((day, index) => {
              if (!day) return <View key={index} style={styles.dayContainer} />;

              const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const isToday =
                dayDate.getDate() === today.getDate() &&
                dayDate.getMonth() === today.getMonth() &&
                dayDate.getFullYear() === today.getFullYear();

              const isSunday = (index === 6);
              const isSelected = day === selectedDay;

              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.dayContainer,
                    {
                      borderColor: isSelected
                        ? theme.placeholder
                        : isToday
                        ? theme.primary
                        : theme.card,
                    },
                  ]}
                  onPress={() => todayItem(day)}
                >
                  <Text style={[styles.day, { color: isSunday ? theme.danger : theme.text }]}>
                    {day}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity style={[styles.barBtns, { backgroundColor: theme.card }]} onPress={getToday}>
          <Text style={[styles.barText, { color: theme.text }]}>Bugun</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barBtns: { paddingHorizontal: 14, paddingVertical: 6, marginVertical: 10, borderRadius: 10 },
  barText: { fontSize: 16 },
  container: { padding: 10, borderRadius: 10 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  arrow: { fontSize: 20 },
  month: { fontSize: 18, fontWeight: "bold" },
  weekDays: { flexDirection: "row", marginBottom: 5 },
  weekDay: { flex: 1, textAlign: "center", fontWeight: "bold" },
  weekRow: { flexDirection: "row" },
  dayContainer: { flex: 1, padding: 8, margin: 2, borderWidth: 1, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  day: { textAlign: "center", fontSize: 16 },
});

export default Calendar;
