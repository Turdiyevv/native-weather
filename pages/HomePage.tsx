import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  Ionicons,
  MaterialIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {useTheme} from "../theme/ThemeContext";

export default function DashboardPage() {
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.background}]} showsVerticalScrollIndicator={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, {color: theme.text}]}>Dashboard</Text>
        <Text style={[styles.subtitle, {color: theme.subText}]}>
          Umumiy holat va qisqa maʼlumotlar
        </Text>
      </View>

      {/* TASKS */}
      <View style={[styles.card, {backgroundColor: theme.card}]}>
        <View style={styles.cardHeader}>
          <FontAwesome5 name="tasks" size={20} color="#27AE60" />
          <Text style={[styles.cardTitle, {color: theme.text}]}>Tasks</Text>
        </View>
        <Text style={[styles.bigText, {color: theme.text}]}>12 ta vazifa</Text>
        <Text style={[styles.smallText, {color: theme.subText}]}>3 tasi bugun bajarilishi kerak</Text>

        <TouchableOpacity
          style={styles.action}
          onPress={() => navigation.navigate("MainPage")}
        >
          <Text style={[styles.actionText, {color: "#27AE60"}]}>Vazifalarga o‘tish</Text>
          <Ionicons name="arrow-forward" size={16} color="#27AE60" />
        </TouchableOpacity>
      </View>

      {/* CHAT */}
      <View style={[styles.card, {backgroundColor: theme.card}]}>
        <View style={styles.cardHeader}>
          <Ionicons name="chatbubbles" size={22} color="#2F80ED" />
          <Text style={[styles.cardTitle, {color: theme.text}]}>Chat</Text>
        </View>
        <Text style={[styles.bigText, {color: theme.text}]}>5 ta yangi xabar</Text>
        <Text style={[styles.smallText, {color: theme.subText}]}>
          Oxirgi xabar: 10 daqiqa oldin
        </Text>

        <TouchableOpacity
          style={styles.action}
          onPress={() => navigation.navigate("Chat")}
        >
          <Text style={[styles.actionText, { color: "#2F80ED" }]}>
            Chatga o‘tish
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#2F80ED" />
        </TouchableOpacity>
      </View>

      {/* HABITS */}
      <View style={[styles.card, {backgroundColor: theme.card}]}>
        <View style={styles.cardHeader}>
          <Ionicons name="heart" size={22} color="#9B51E0" />
          <Text style={[styles.cardTitle, {color: theme.text}]}>Habits</Text>
        </View>
        <Text style={[styles.bigText, {color: theme.text}]}>7 ta odat</Text>
        <Text style={[styles.smallText, {color: theme.subText}]}>
          Bugun 4 tasi bajarildi
        </Text>

        <TouchableOpacity
          style={styles.action}
          onPress={() => navigation.navigate("Habits")}
        >
          <Text style={[styles.actionText, { color: "#9B51E0" }]}>
            Odatlarni ko‘rish
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#9B51E0" />
        </TouchableOpacity>
      </View>

      {/* BUSINESS */}
      <View style={[styles.card, {backgroundColor: theme.card}]}>
        <View style={styles.cardHeader}>
          <MaterialIcons
            name="business-center"
            size={22}
            color="#F2994A"
          />
          <Text style={[styles.cardTitle, {color: theme.text}]}>Biznes</Text>
        </View>
        <Text style={[styles.bigText, {color: theme.text}]}>2 ta loyiha</Text>
        <Text style={[styles.smallText, {color: theme.subText}]}>
          Faol daromad: mavjud
        </Text>

        <TouchableOpacity
          style={styles.action}
          onPress={() => navigation.navigate("Business")}
        >
          <Text style={[styles.actionText, { color: "#F2994A" }]}>
            Biznes bo‘limi
          </Text>
          <Ionicons name="arrow-forward" size={16} color="#F2994A" />
        </TouchableOpacity>
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    marginTop: 24,
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
  },
  card: {
    borderRadius: 18,
    padding: 16,
    marginTop: 16,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  bigText: {
    fontSize: 22,
    fontWeight: "700",
  },
  smallText: {
    marginTop: 4,
    fontSize: 13,
  },
  action: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
