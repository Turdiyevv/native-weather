// pages/Business.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import { RootStackParamList } from "../types/types";
import { useTheme } from "../../theme/ThemeContext";
import TodoItem from "../../components/Business/TodoItem";
import TextField from "../../components/TextField";
import { BusinessEntry } from "../types/userTypes";
import {getActiveUser} from "../../service/storage";
import {addBusinessEntry, getBusinessEntriesByDate, getOrCreateBusinessByDate} from "../../service/business";
import {formatSum} from "../../utills/utill";


type SupportNav = NativeStackNavigationProp<RootStackParamList, "IncomeAndExpenses">;

interface Props {
  route: {
    params: {
      selectedDate: string;
      businessId: string| any;
    };
  };
}

export default function Business({ route }: Props) {
  const { selectedDate, businessId } = route.params;
  const dateStr = new Date(selectedDate).toISOString().slice(0, 10); // YYYY-MM-DD
  const { theme } = useTheme();
  const navigation = useNavigation<SupportNav>();

  const [entries, setEntries] = useState<BusinessEntry[]>([]);
  const [isExpense, setIsExpense] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");

  const [allIncome, setAllIncome] = useState(0);
  const [allExpenses, setAllExpenses] = useState(0);
  const [summa, setSumma] = useState(0);
  const calculateTotals = (list: BusinessEntry[]) => {
    let income = 0;
    let expense = 0;
    list.forEach(item => {
      if (item.status) {
        expense += item.total;
      } else {
        income += item.total;
      }
    });
    setAllIncome(income);
    setAllExpenses(expense);
    setSumma(income - expense);
  };

  /* 🔙 Android back */
  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  const dismissForm = () => {
    Keyboard.dismiss();
    setShowForm(false);
    setAmount("");
    setComment("");
  };

  useEffect(() => {
    const loadData = async () => {
      const user = await getActiveUser();
      if (!user) return;
      // BusinessItem yo‘q bo‘lsa yaratadi
      await getOrCreateBusinessByDate(user.username, dateStr);
      // Shu kun entrylarini olib keladi
      const list = await getBusinessEntriesByDate(
        user.username,
        dateStr
      );
      setEntries(list);
      calculateTotals(list);
    };

    loadData();
  }, [dateStr]);

  const onSave = async () => {
    if (!amount) return;
    const user = await getActiveUser();
    if (!user) return;
    await addBusinessEntry(user.username, dateStr, {
      title: comment || (isExpense ? "Chiqim" : "Kirim"),
      status: isExpense,
      total: Number(amount),
      time: new Date().toLocaleTimeString().slice(0, 5),
    });
    // qayta yuklash
    const list = await getBusinessEntriesByDate(
      user.username,
      dateStr
    );

    setEntries(list);
    calculateTotals(list);
    dismissForm();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        {/* 📅 Sana */}
        <View style={styles.content}>
          <Text style={{ color: theme.text, textAlign: "center", fontWeight: "bold", fontSize: 16 }}>
            {dateStr}
          </Text>
        </View>
        <View style={styles.content2}>
          <Text style={[styles.mainTitle, { color: theme.success }]}>
            {formatSum(allIncome)}
          </Text>
          <Text style={[styles.mainTitle2, { color: theme.text }]}>
            {formatSum(summa)}
          </Text>
          <Text style={[styles.mainTitle, { color: theme.danger }]}>
            {formatSum(allExpenses)}
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {entries.map((item, index) => (
            <TodoItem
              key={item.id}
              {...item}
              index={index}
              listLength={entries.length}
            />
          ))}
        </ScrollView>

        <View>
          <View style={styles.exchangeBar}>
            <TouchableOpacity
              onPress={() => {
                setIsExpense(false);
                setShowForm(true);
              }}
              style={[styles.exchangeBtn, { backgroundColor: theme.card }]}
            >
              <View style={styles.exchangeContent}>
                <Text style={{ color: theme.text }}>Kirim</Text>
                <Ionicons name="trending-down-outline" size={24} color="#50C878" style={styles.scale} />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setIsExpense(true);
                setShowForm(true);
              }}
              style={[styles.exchangeBtn, { backgroundColor: theme.card }]}
            >
              <View style={styles.exchangeContent}>
                <Text style={{ color: theme.text }}>Chiqim</Text>
                <Ionicons name="trending-up-outline" size={24} color="#EB4C42" />
              </View>
            </TouchableOpacity>
          </View>

          {showForm && (
            <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
              <View style={styles.formHeader}>
                <Text style={{ color: theme.text }}>
                  {isExpense ? "Chiqim" : "Kirim"}
                </Text>
                <TouchableOpacity onPress={dismissForm}>
                  <Ionicons name="close-circle" size={24} color={theme.text} />
                </TouchableOpacity>
              </View>

              <TextField
                label="Summa"
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                required
              />

              <TextField
                label="Izoh"
                value={comment}
                onChangeText={setComment}
              />

              <TouchableOpacity
                style={[
                  styles.saveBtn,
                  { backgroundColor: isExpense ? "#EB4C42" : "#50C878" },
                ]}
                onPress={onSave}
              >
                <Text style={styles.saveText}>Saqlash</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  exchangeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scale: {
    transform: [{ scaleX: -1 }],
  },
  container: { flex: 1, paddingHorizontal: 20 },
  content: { paddingTop: 40, paddingBottom: 10 },
  content2: { flexDirection: "row", paddingBottom: 10, justifyContent: "space-between" },
  mainTitle: { fontSize: 12, textAlign: "center", fontWeight: "bold" },
  mainTitle2: { fontSize: 12, textAlign: "center", fontWeight: "bold", backgroundColor: "#1b2f42", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 7 },
  exchangeBar: { flexDirection: "row", height: 50, marginTop: 10, marginBottom: 24 },
  exchangeBtn: { flex: 1, borderRadius: 10, marginHorizontal: 4, alignItems: "center", justifyContent: "center" },
  formContainer: { padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: Platform.OS === "ios" ? 30 : 20 },
  formHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  saveBtn: { padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
