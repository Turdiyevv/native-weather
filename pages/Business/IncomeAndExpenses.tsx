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
    setShowForm(false);
    setAmount("");
    setComment("");
    Keyboard.dismiss();
  };

  const COUNT = 45;

  return (
    // 1. KeyboardAvoidingView eng tashqarida bo'lishi kerak
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={[styles.mainTitle, { color: theme.text }]}>
            {date.toLocaleDateString()}
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          keyboardShouldPersistTaps="handled"
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

        <View>
          <View style={styles.exchangeBar}>
            <TouchableOpacity
              onPress={() => {
                setExpenses(false);
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
                setExpenses(true);
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

          {/* Form - KeyboardAvoidingView buni avtomatik ko'taradi */}
          {showForm && (
            <View style={[styles.formContainer, { backgroundColor: theme.card }]}>
              <View style={styles.formHeader}>
                 <Text style={[styles.formTitle, { color: theme.text }]}>
                    {expenses ? "Chiqim" : "Kirim"}
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
                  { backgroundColor: expenses ? "#EB4C42" : "#50C878" },
                ]}
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
    paddingHorizontal: 10,
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
    marginBottom: 20,
  },
  exchangeBtn: {
    flex: 1,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2, // Android uchun soya
    shadowColor: '#000', // iOS uchun soya
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  exchangeContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  scale: {
    transform: [{ scaleX: -1 }],
  },
  formContainer: {
    padding: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 20, // iOS pastki qismi uchun
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
