import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../theme/ThemeContext";
import { RootStackParamList } from "../types/types";
import AdminIcon from "../../assets/admin_icon.png";
import {Habit} from "../types/userTypes";
import {getHabits, updateHabitStatus} from "../../service/habits";
import Header from "../../components/global/Header";
import {SafeAreaView} from "react-native-safe-area-context";
import {getActiveUser} from "../../service/storage";

type HabitsNav = NativeStackNavigationProp<RootStackParamList, "Habits">;
const HabitsPage: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<HabitsNav>();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔙 Back handler
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

  // 📦 Load habits
  const loadHabits = async () => {
    setLoading(true);
    const user = await getActiveUser();
    if (!user) return;
    const data = await getHabits(user.username);
    setHabits(data);
    setLoading(false);
  };
  useEffect(() => {
    loadHabits();
  }, []);

  // 🔄 Status change
  const changeStatus = async (
    habitId: string,
    status: 1 | 2
  ) => {
    const user = await getActiveUser();
    if (!user) return;
    await updateHabitStatus(user.username, habitId, status);
    loadHabits();
  };

  // if (loading) {
  //   return (
  //     <View style={[styles.center, { backgroundColor: theme.background }]}>
  //       <ActivityIndicator size="large" />
  //     </View>
  //   );
  // }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title={"Odatlar"}/>
      <ScrollView contentContainerStyle={styles.scroll}>
        {habits.length === 0 || loading ? (
          <View style={styles.empty}>
            <Image source={AdminIcon} style={styles.icon} />
            <Text style={[styles.description, { color: theme.text }]}>
              Hozircha odatlar yo‘q
            </Text>
          </View>
        ) : (
          habits.map(habit => (
            <View key={habit.id} style={[styles.card, {backgroundColor: theme.card}]}>
              <Text style={[styles.name, {color: theme.text}]}>{habit.name}</Text>
              <Text style={styles.meta}>
                {habit.durationDays} kun • ⏰ {habit.notificationTime}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[styles.btn, styles.done]}
                  onPress={() => changeStatus(habit.id, 1)}
                >
                  <Text style={styles.btnText}>Bajarildi</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.btn, styles.skip]}
                  onPress={() => changeStatus(habit.id, 2)}
                >
                  <Text style={styles.btnText}>Qoldirildi</Text>
                </TouchableOpacity>
              </View>

              <Text style={[styles.status, {color: theme.text}]}>
                Status: {habit.status}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* ➕ Add Habit */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddHabit")}
      >
        <Text style={styles.addText}>+ Yangi odat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HabitsPage;
const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  empty: { alignItems: "center", marginTop: 100 },
  icon: { width: 160, height: 160, resizeMode: "contain" },
  description: { marginTop: 12, fontSize: 16 },

  card: {
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "600" },
  meta: { fontSize: 13, color: "#777", marginTop: 4 },

  actions: { flexDirection: "row", marginTop: 10 },
  btn: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    marginRight: 6,
  },
  done: { backgroundColor: "#4CAF50" },
  skip: { backgroundColor: "#FF9800" },
  btnText: { color: "#fff", fontWeight: "600" },

  status: { marginTop: 8, fontSize: 13 },

  addBtn: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 12,
    marginHorizontal: 10,
    alignItems: "center",
  },
  addText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
