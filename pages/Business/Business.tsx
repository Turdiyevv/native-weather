import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import AdminIcon from "../../assets/admin_icon.png";
import { useTheme } from "../../theme/ThemeContext";
import Calendar from "../../components/global/Calendar";
import Header from "../../components/global/Header";

export default function Business() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={"Biznes"} />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <View style={[styles.hero, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Image source={AdminIcon} style={styles.icon} />
          <Text style={[styles.title, { color: theme.text }]}>Biznes monitoringi</Text>
          <Text style={[styles.description, { color: theme.subText }]}>
            Bu yerda biznesingiz bo‘yicha qulay hisobotlar yig‘ishingiz mumkin.
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.summaryLabel, { color: theme.subText }]}>Kirim</Text>
            <Text style={[styles.summaryValue, { color: theme.success }]}>+ 12.4k</Text>
          </View>
          <View style={[styles.summaryCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.summaryLabel, { color: theme.subText }]}>Chiqim</Text>
            <Text style={[styles.summaryValue, { color: theme.danger }]}>- 7.2k</Text>
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
  scrollContainer: { flexGrow: 1, paddingVertical: 20, paddingHorizontal: 16 },
  hero: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 6,
  },
  icon: { width: 92, height: 92, resizeMode: "contain" },
  title: { fontSize: 24, fontWeight: "800", marginTop: 12 },
  description: { marginTop: 8, textAlign: "center", fontSize: 15, lineHeight: 22 },
  summaryRow: { flexDirection: "row", marginTop: 18, gap: 12 },
  summaryCard: {
    flex: 1,
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  summaryLabel: { fontSize: 12, fontWeight: "600" },
  summaryValue: { fontSize: 22, fontWeight: "800", marginTop: 6 },
  calendarWrapper: { marginTop: 18 },
});