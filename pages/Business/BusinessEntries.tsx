import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { RouteProp, useFocusEffect, useRoute } from "@react-navigation/native";
import Header from "../../components/global/Header";
import { useTheme } from "../../theme/ThemeContext";
import { getActiveUser } from "../../service/storage";
import { BusinessEntry } from "../types/userTypes";
import { RootStackParamList } from "../types/types";
import { formatSum } from "../../utills/utill";
import { useLanguage } from "../../i18n/LanguageContext";

type BusinessEntriesRoute = RouteProp<RootStackParamList, "BusinessEntries">;

type DatedBusinessEntry = BusinessEntry & {
  businessDate: string;
};

const formatDate = (dateString: string) => {
  const [year, month, day] = dateString.split("-").map(Number);
  if (!year || !month || !day) return dateString;

  return new Date(year, month - 1, day).toLocaleDateString("uz-UZ", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export default function BusinessEntries() {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const route = useRoute<BusinessEntriesRoute>();
  const isIncome = route.params.type === "income";
  const [entries, setEntries] = useState<DatedBusinessEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadEntries = async () => {
        const user = await getActiveUser();
        if (!user || !isActive) return;

        const history = (user.business || [])
          .flatMap((business) =>
            business.calendar.map((entry) => ({
              ...entry,
              businessDate: business.id,
            }))
          )
          .filter((entry) => entry.status === !isIncome)
          .sort((first, second) =>
            `${second.businessDate} ${second.time}`.localeCompare(
              `${first.businessDate} ${first.time}`
            )
          );

        setEntries(history);
      };

      loadEntries();
      return () => {
        isActive = false;
      };
    }, [isIncome])
  );

  const total = entries.reduce((sum, entry) => sum + entry.total, 0);
  const title = isIncome ? t("allIncome") : t("allExpenses");
  const accent = isIncome ? theme.success : theme.danger;

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Header title={title} isBack={true} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.summary, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View>
            <Text style={[styles.eyebrow, { color: theme.subText }]}>{t("total")}</Text>
            <Text style={[styles.total, { color: accent }]}> {isIncome ? "+" : "-"} {formatSum(total)}</Text>
          </View>
          <View style={styles.countBlock}>
            <Text style={[styles.count, { color: theme.text }]}>{entries.length}</Text>
            <Text style={[styles.countLabel, { color: theme.subText }]}>{t("entries")}</Text>
          </View>
        </View>

        {entries.length === 0 ? (
          <View style={[styles.empty, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>{t("noData")}</Text>
            <Text style={[styles.emptyText, { color: theme.subText }]}>{t("dataWillAppear")}</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {entries.map((entry) => (
              <View
                key={`${entry.businessDate}-${entry.id}`}
                style={[styles.entry, { backgroundColor: theme.card, borderColor: theme.border }]}
              >
                <View style={styles.entryInfo}>
                  <Text style={[styles.entryTitle, { color: theme.text }]} numberOfLines={1}>
                    {entry.title || (isIncome ? "Kirim" : "Chiqim")}
                  </Text>
                  <Text style={[styles.entryDate, { color: theme.subText }]}>
                    {formatDate(entry.businessDate)}  •  {entry.time}
                  </Text>
                </View>
                <Text style={[styles.entryAmount, { color: accent }]}>
                  {isIncome ? "+" : "-"} {formatSum(entry.total)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16, paddingBottom: 28 },
  summary: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  eyebrow: { fontSize: 12, fontWeight: "600" },
  total: { fontSize: 24, fontWeight: "800", marginTop: 4 },
  countBlock: { alignItems: "flex-end" },
  count: { fontSize: 24, fontWeight: "800" },
  countLabel: { fontSize: 12, marginTop: 2 },
  list: { gap: 10 },
  entry: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  entryInfo: { flex: 1, paddingRight: 12 },
  entryTitle: { fontSize: 15, fontWeight: "700" },
  entryDate: { fontSize: 12, marginTop: 4 },
  entryAmount: { fontSize: 15, fontWeight: "800" },
  empty: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
  },
  emptyTitle: { fontSize: 16, fontWeight: "700" },
  emptyText: { fontSize: 13, marginTop: 6 },
});