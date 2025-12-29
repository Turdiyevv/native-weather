import React, {useEffect, useRef, useState} from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
} from "react-native";
import {useFocusEffect, useNavigation} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "../../theme/ThemeContext";
import { RootStackParamList } from "../types/types";
import AdminIcon from "../../assets/admin_icon.png";
import { Habit } from "../types/userTypes";
import {
  getHabits,
  updateHabitDayStatus,
} from "../../service/habits";
import Header from "../../components/global/Header";
import { getActiveUser } from "../../service/storage";
import { Animated, Pressable } from "react-native";
import {Ionicons} from "@expo/vector-icons";

type HabitsNav = NativeStackNavigationProp<RootStackParamList, "Habits">;

const HabitsPage: React.FC = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<HabitsNav>();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  const [openedHabitId, setOpenedHabitId] = useState<string | null>(null);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  const toggleHabitView = (habitId: string) => {
      if (openedHabitId === habitId) {
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 0, duration: 150, useNativeDriver: true }),
        ]).start(() => setOpenedHabitId(null));
      } else {
        setOpenedHabitId(habitId);
        Animated.parallel([
          Animated.timing(scaleAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
          Animated.timing(opacityAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
        ]).start();
      }
  };

  useFocusEffect(
      React.useCallback(() => {
        loadHabits();
      }, [])
  );
  /* 🔙 Back handler */
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

  /* 📦 Load habits */
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

  /* 📅 Bugungi kun */
  const today = new Date().toISOString().split("T")[0];

  /* 🔄 Status change (BUGUNGI KUN UCHUN) */
  const changeStatus = async (
    habitId: string,
    habitDayId: string,
    status: 1 | 2
  ) => {
    const user = await getActiveUser();
    if (!user) return;
    await updateHabitDayStatus(
      user.username,
      habitId,
      habitDayId,
      status
    );
    loadHabits();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <Header title="Odatlar" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {habits.length === 0 || loading ? (
          <View style={styles.empty}>
            <Image source={AdminIcon} style={styles.icon} />
            <Text style={[styles.description, { color: theme.text }]}>
              Hozircha odatlar yo‘q
            </Text>
          </View>
        ) : (
          habits.map(habit => {
            const todayDay = habit?.habitDays?.find(
              d => d.date === today
            );

            return (
              <View
                key={habit.id}
                style={[styles.card, { backgroundColor: theme.card }]}
              >
                <Text style={[styles.name, { color: theme.text }]}>
                  {habit.name}
                </Text>
                <Text style={styles.meta}>
                  {habit.durationDays} kun
                  {todayDay && ` • ⏰ ${todayDay.notificationTime}`}
                </Text>

                {todayDay ? (
                  <>
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={[styles.btn, styles.done]}
                        onPress={() => changeStatus(habit.id, todayDay.id, 1)}
                      >
                        <Text style={styles.btnText}>Bajarildi</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.btn, styles.skip]}
                        onPress={() => changeStatus(habit.id, todayDay.id, 2)}
                      >
                        <Text style={styles.btnText}>Qoldirildi</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                        <View style={{ flexDirection: "row", alignItems: "center"}}>
                          <Text style={[styles.status, { color: theme.text }]}>
                            Bugun: {todayDay.status === 0 ? "Kutilmoqda" : todayDay.status === 1 ? "Bajarildi" : "Qoldirildi"}
                          </Text>
                          {todayDay.status === 0 && (
                              <Ionicons
                                name="alert-circle-outline"
                                size={15}
                                color="grey"
                                style={{marginLeft:1}}
                              />
                          )}
                          {todayDay.status === 1 && (
                              <Ionicons
                                name="checkmark-circle-outline"
                                size={15}
                                color="#4CAF50"
                                style={{marginLeft:1}}
                              />
                          )}
                          {todayDay.status === 2 && (
                              <Ionicons
                                name="close-circle-outline"
                                size={15}
                                color="red"
                                style={{marginLeft:1}}
                              />
                          )}
                        </View>

                      <TouchableOpacity onPress={() => toggleHabitView(habit.id)}>
                        <Text style={[styles.status, { color: theme.primary }]}>Ko‘rish</Text>
                      </TouchableOpacity>
                    </View>

                    {openedHabitId === habit.id && (
                      <Animated.View
                        style={[
                          styles.animatedBox,
                          {
                            opacity: opacityAnim,
                            transform: [{ scaleY: scaleAnim }],
                              borderRadius: 6,
                              backgroundColor: theme.card,
                          },
                        ]}
                      >
                        <ScrollView style={{
                            borderWidth: 1,
                            borderColor: theme.placeholder,
                            borderRadius: 6,
                            padding:5,
                            width: "100%",
                        }}>
                          {habit.habitDays.map((day, index) => (
                            <View key={day.id} style={{
                                marginBottom: 6,
                                flexDirection: "row",
                                justifyContent: "space-between"
                            }}>
                                <View style={{flexDirection: "row"}}>
                                    <Text style={{ color: theme.placeholder, fontSize: 12, marginRight: 4 }}>{index +1}</Text>
                                    <Text style={{ color: theme.text, fontSize: 12 }}>{day.date}</Text>
                                </View>
                                <View style={{flexDirection: "row", alignItems: "center"}}>
                                  <Text style={{ color: day.status===1 ? "green": day.status===2 ? "red" : theme.text, fontSize: 12 }}>
                                    {day.status === 0 ? "Kutilmoqda" : day.status === 1 ? "Bajarildi" : "Qoldirildi"}
                                  </Text>
                                    {day.status === 0 && (
                                          <Ionicons
                                            name="alert-circle-outline"
                                            size={15}
                                            color="grey"
                                            style={{marginLeft:1}}
                                          />
                                    )}
                                    {day.status === 1 && (
                                          <Ionicons
                                            name="checkmark-circle-outline"
                                            size={15}
                                            color="#4CAF50"
                                            style={{marginLeft:1}}
                                          />
                                    )}
                                    {day.status === 2 && (
                                          <Ionicons
                                            name="close-circle-outline"
                                            size={15}
                                            color="red"
                                            style={{marginLeft:1}}
                                          />
                                    )}
                                </View>
                            </View>
                          ))}
                        </ScrollView>
                      </Animated.View>
                    )}
                  </>
                ) : (
                  <Text style={[styles.status, { color: theme.text }]}>
                    Muddati tugagan.
                  </Text>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ➕ Add Habit */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => navigation.navigate("AddHabit")}
      >
        <Text style={styles.addText}>Yangi qo'shish</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default HabitsPage;

const styles = StyleSheet.create({
  animatedBox: {
      marginTop: 10,
      borderRadius: 10,
      overflow: "hidden",
      elevation: 4,
      transformOrigin: "bottom", // pastdan ochilishi uchun
  },
  container: { flex: 1 },
  scroll: { padding: 10 },
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

  status: {fontSize: 13 },

  addBtn: {
    backgroundColor: "#2196F3",
    padding: 15,
    marginBottom: 10,
    borderRadius: 12,
    marginHorizontal: 10,
    alignItems: "center",
  },
  addText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
