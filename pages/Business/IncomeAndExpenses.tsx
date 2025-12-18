import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  KeyboardAvoidingView,
  ScrollView, // Oddiy ScrollView yetarli
  Platform,
  TouchableOpacity,
  Keyboard,
} from "react-native";
// Kerakli importlaringizni qo'shing (RootStackParamList, useNavigation, useTheme, etc.)
import { RootStackParamList } from "../types/types";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import TodoItem from "../../components/Business/TodoItem";
import TextField from "../../components/TextField";


type SupportNav = NativeStackNavigationProp<RootStackParamList, "Business">;

export default function IncomeAndExpenses({ route }) {
  const { selectedDate } = route.params;
  const date = new Date(selectedDate);
  const { theme } = useTheme();
  const navigation = useNavigation<SupportNav>();

  const [expenses, setExpenses] = useState<boolean>(false);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [amount, setAmount] = useState("");
  const [comment, setComment] = useState("");

  useEffect(() => {
    const backAction = () => {
      navigation.navigate("Business");
      return true;
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  const dismissForm = () => {
    // Formani yopishda klaviaturani ham yopish muhim
    Keyboard.dismiss();
    // Animation tugashini kutish shart emas, darhol yopamiz
    setShowForm(false);
    setAmount("");
    setComment("");
  };

  const COUNT = 45;

  return (
    // 1. Eng tashqi qobiq KeyboardAvoidingView
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        {/* Date Header (scroll bo'lmaydigan qism) */}
        <View style={styles.content}>
          <Text style={{color: theme.text}}>
            {date.toLocaleDateString()}
          </Text>
        </View>

        {/* Scrollable Content (asosiy ro'yxat) */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }} // ScrollView qolgan bo'sh joyni egallaydi
          contentContainerStyle={{ paddingBottom: 0 }}
          keyboardShouldPersistTaps="handled" // Klaviatura ochiq turgan holatda boshqa tugmalarni bosish imkonini beradi
        >
          {Array.from({ length: COUNT }).map((_, index) => (
            <TodoItem
              key={index}
              title={`Summa ${index + 1}`}
              index={index}
              total={COUNT}
              status={expenses}
            />
          ))}
        </ScrollView>

        {/* Bottom Section (Tugmalar va Forma joylashgan View) */}
        {/* Bu View klaviatura ochilganda butunligi yuqoriga suriladi */}
        <View>
          {/* Kirim / Chiqim bar */}
          <View style={styles.exchangeBar}>
            <TouchableOpacity
              onPress={() => {
                setExpenses(false);
                setShowForm(true);
              }}
              style={[styles.exchangeBtn, { backgroundColor: theme.card }]}
            >
                <Text style={{ color: theme.text }}>Kirim</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setExpenses(true);
                setShowForm(true);
              }}
              style={[styles.exchangeBtn, { backgroundColor: theme.card }]}
            >
                <Text style={{ color: theme.text }}>Chiqim</Text>
            </TouchableOpacity>
          </View>

          {/* Form qismi */}
          {showForm && (
            <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
               <View style={styles.formHeader}>
                 <Text style={{ color: theme.text }}>
                    {expenses ? "Chiqim" : "Kirim"}
                  </Text>
                  <TouchableOpacity onPress={dismissForm}>
                      <Ionicons name="close-circle" size={24} color={theme.text} />
                  </TouchableOpacity>
              </View>
              <TextField label="Summa" value={amount} onChangeText={setAmount} keyboardType="numeric" required />
              <TextField label="Izoh" value={comment} onChangeText={setComment} />
              <TouchableOpacity
                style={[styles.saveBtn, { backgroundColor: expenses ? "#EB4C42" : "#50C878" }]}
                onPress={dismissForm}
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  content: {
    paddingTop: 40,
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 16,
    textAlign: "center",
    fontWeight: 'bold'
  },
  exchangeBar: {
    flexDirection: "row",
    height: 50,
    marginTop: 10,
    marginBottom: 24,
  },
  exchangeBtn: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
  },
  formContainer: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  saveBtn: {
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16
  },
});

