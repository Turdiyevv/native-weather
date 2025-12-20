             import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {useTheme} from "../../theme/ThemeContext";
             import InfoRow from "../../components/Task/InfoRow";

const ViewPage: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.bar} />
      <View style={[styles.header, {backgroundColor: theme.background, borderBottomColor: theme.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, {color: theme.text}]}>View Details</Text>

        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card */}
        <View style={[styles.card, {backgroundColor: theme.card, shadowColor: theme.card}]}>
          <Text style={[styles.title, {color: theme.text}]}>Business Name</Text>

          <View style={[styles.divider, {backgroundColor: theme.border}]} />

          <InfoRow label="Category" value="Technology"/>
          <InfoRow label="Phone" value="+998 90 123 45 67"/>
          <InfoRow label="Email" value="info@company.com"/>
          <InfoRow label="Location" value="Tashkent, Uzbekistan"/>

          <View style={styles.descriptionBox}>
            <Text style={[styles.label, {color: theme.placeholder}]}>Description</Text>
            <Text style={[styles.description, {color: theme.text}]}>
              This is a modern business view page design. Clean UI, readable
              typography and comfortable spacing are used to improve user
              experience.
            </Text>
          </View>
        </View>

        {/* Action button */}
        <TouchableOpacity style={[styles.button, {backgroundColor: theme.card}]}>
          <Text style={[styles.buttonText, {color: theme.text}]}>Edit Information</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default ViewPage;

const styles = StyleSheet.create({
    bar: { height: 35, width: "100%" },
  safe: {
    flex: 1,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },

  descriptionBox: {
    marginTop: 16,
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },

  content: {
    padding: 16,
  },

  card: {
    borderRadius: 16,
    padding: 16,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },

  title: {
    fontSize: 20,
    fontWeight: "700",
  },

  divider: {
    height: 1,
    marginVertical: 12,
  },

  row: {
    marginBottom: 12,
  },

  description: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 20,
  },

  button: {
    marginTop: 20,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
