import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../theme/ThemeContext";
import Calendar from "../../components/global/Calendar";
import { getActiveUser } from "../../service/storage";
import { formatSum } from "../../utills/utill";

export default function Business() {
  const { theme } = useTheme();
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;

      const loadSummary = async () => {
        const user = await getActiveUser();
        if (!user || !isActive) return;

        const totals = (user.business || []).flatMap((business) => business.calendar)
          .reduce(
            (summary, entry) => {
              if (entry.status) {
                summary.expenses += entry.total;
              } else {
                summary.income += entry.total;
              }
              return summary;
            },
            { income: 0, expenses: 0 }
          );

        setIncome(totals.income);
        setExpenses(totals.expenses);
      };

      loadSummary();
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.summaryLabel, { color: theme.subText }]}>Kirim</Text>
            <Text style={[styles.summaryValue, { color: theme.success }]}>+ {formatSum(income)}</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.summaryLabel, { color: theme.subText }]}>Chiqim</Text>
            <Text style={[styles.summaryValue, { color: theme.danger }]}>- {formatSum(expenses)}</Text>
          </View>
        </View>

        <View style={styles.calendarWrapper}>
          <Calendar />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { flexGrow: 1, paddingVertical: 12, paddingHorizontal: 16 },
  summaryRow: { flexDirection: "row", gap: 10 },
  summaryCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  summaryLabel: { fontSize: 12, fontWeight: "600" },
  summaryValue: { fontSize: 18, fontWeight: "800", marginTop: 3 },
  calendarWrapper: { marginTop: 14 },
});