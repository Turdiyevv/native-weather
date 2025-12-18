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
import {
  getOrCreateBusinessDay,
  addEntryToBusinessDay,
  getEntriesForBusinessDay,
} from "../../service/business";

type SupportNav = NativeStackNavigationProp<
  RootStackParamList,
  "IncomeAndExpenses"
>;

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

  /* 🗂 Load business entries */
  useEffect(() => {
    const loadEntries = async () => {
      await getOrCreateBusinessDay(businessId, dateStr);
      const data = await getEntriesForBusinessDay(businessId, dateStr);
      setEntries(data);
        console.log('data: ', data);
    };
    loadEntries();
  }, [businessId, dateStr]);

  const dismissForm = () => {
    Keyboard.dismiss();
    setShowForm(false);
    setAmount("");
    setComment("");
  };

  const onSave = async () => {
    if (!amount) return;

    const entryData = {
      title: comment || (isExpense ? "Chiqim" : "Kirim"),
      status: !isExpense, // true -> income, false -> expense
      total: Number(amount),
    };
      console.log("onSave: ", businessId, dateStr, entryData);
    const newEntry = await addEntryToBusinessDay(businessId, dateStr, entryData)
    setEntries(prev => [...prev, newEntry]);
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
          <Text style={[styles.mainTitle, { color: theme.text }]}>
            {new Date(selectedDate).toLocaleDateString()}
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
  mainTitle: { fontSize: 16, textAlign: "center", fontWeight: "bold" },
  exchangeBar: { flexDirection: "row", height: 50, marginTop: 10, marginBottom: 24 },
  exchangeBtn: { flex: 1, borderRadius: 10, marginHorizontal: 4, alignItems: "center", justifyContent: "center" },
  formContainer: { padding: 16, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: Platform.OS === "ios" ? 30 : 20 },
  formHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  saveBtn: { padding: 15, borderRadius: 12, alignItems: "center", marginTop: 10 },
  saveText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
