import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Alert, BackHandler,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { RootStackParamList } from "../types/types";
import { useTheme } from "../../theme/ThemeContext";
import { addHabit } from "../../service/habits";
import { getActiveUser } from "../../service/storage";
import {showMessage} from "react-native-flash-message";
import { scheduleHabitDayNotification} from "../../service/notification";

type AddHabitNav = NativeStackNavigationProp<
  RootStackParamList,
  "AddHabit"
>;

const AddHabitPage: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<AddHabitNav>();

  const [name, setName] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [time, setTime] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [saving, setSaving] = useState(false);

  /* ⏰ HH:MM format */
  const formatTime = (date: Date) => {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  };

const saveHabit = async () => {
  try {
    if (!name.trim()) {
      showMessage({ message: "Odat nomini kiriting !", type: "warning" });
      return;
    }

    const days = Number(durationDays);
    if (!Number.isInteger(days) || days <= 0) {
      showMessage({ message: "Davomiylik noto‘g‘ri !", type: "warning" });
      return;
    }

    const user = await getActiveUser();
    if (!user) return;

    setSaving(true);

    const habit = await addHabit(user.username, {
      name: name.trim(),
      durationDays: days,
      notificationTime: formatTime(time),
    });

    if (habit) {
        await Promise.all(
          habit.habitDays.map(day =>
            scheduleHabitDayNotification(habit.name, day)
          )
        );
    }

    navigation.goBack();
  } catch (e) {
    console.log("SAVE HABIT ERROR:", e);
    showMessage({ message: "Xatolik yuz berdi", type: "danger" });
  } finally {
    setSaving(false);
  }
};

  useEffect(() => {
      const backAction = () => {
          navigation.goBack(); // har doim TopTabs ga qaytadi
          return true; // default behaviorni to‘xtatadi
        };
      const backHandler = BackHandler.addEventListener(
          "hardwareBackPress", backAction);
      return () => backHandler.remove()
  }, [navigation]);
  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.form}>
        {/* NAME */}
        <Text style={[styles.label, { color: theme.text }]}>
          Odat nomi
        </Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Masalan: Har kuni sport"
          placeholderTextColor="#999"
          style={[styles.input, { color: theme.text }]}
        />

        {/* DAYS */}
        <Text style={[styles.label, { color: theme.text }]}>
          Necha kun davom etadi
        </Text>
        <TextInput
          value={durationDays}
          onChangeText={setDurationDays}
          keyboardType="numeric"
          placeholder="Masalan: 21"
          placeholderTextColor="#999"
          style={[styles.input, { color: theme.text }]}
        />

        {/* TIME PICKER */}
        <Text style={[styles.label, { color: theme.text }]}>
          Bildirishnoma vaqti
        </Text>

        <TouchableOpacity
          style={[styles.timeBtn, {borderColor: theme.border}]}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{color: theme.text }}>
            ⏰ {formatTime(time)}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={(_, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) setTime(selectedDate);
            }}
          />
        )}

        {/* SAVE */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            saving && { opacity: 0.6 },
          ]}
          disabled={saving}
          onPress={saveHabit}
        >
          <Text style={styles.saveText}>
            {saving ? "Saqlanmoqda..." : "Saqlash"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelBtn}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Bekor qilish</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddHabitPage;


const styles = StyleSheet.create({
  timeBtn: {
      borderWidth: 1,
      borderRadius: 8,
      padding: 12,
      justifyContent: "center",
  },
  container: { flex: 1 },
  form: { padding: 20 },

  label: {
    fontSize: 14,
    marginTop: 14,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },

  saveBtn: {
    backgroundColor: "#4CAF50",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  cancelBtn: {
    alignItems: "center",
    marginTop: 14,
  },
  cancelText: {
    color: "#F44336",
    fontSize: 15,
  },
});
