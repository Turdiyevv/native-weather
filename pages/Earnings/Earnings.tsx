import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "../../theme/ThemeContext";
import Header from "../../components/global/Header";
import AdminIcon from "../../assets/admin_icon.png";

const Earnings: React.FC = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header title="Daromad" />
      <View style={styles.empty}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Image source={AdminIcon} style={styles.icon} />
          <Text style={[styles.title, { color: theme.text }]}>Daromad moduli</Text>
          <Text style={[styles.description, { color: theme.subText }]}>
            Ishga tushirilish uchun qayta ishlanmoqda
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Earnings;

const styles = StyleSheet.create({
  container: { flex: 1 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  card: {
    width: "100%",
    borderRadius: 28,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 4,
  },
  icon: { width: 160, height: 160, resizeMode: "contain", marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "800", marginBottom: 8 },
  description: { fontSize: 16, textAlign: "center", lineHeight: 22 },
});
