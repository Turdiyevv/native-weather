import React, {useState} from "react";
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
import { useRoute, RouteProp } from "@react-navigation/native";
import {RootStackParamList} from "../types/types";
import SingleCheckBox from "../../components/CheckBox";

type ViewTaskRouteProp = RouteProp<RootStackParamList, "ViewTask">;
const ViewPage: React.FC = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const route = useRoute<ViewTaskRouteProp>();
  const taskToEdit = route.params?.task;
  const options = [
    {id: 1, text: "Yengil", color: 'green'},
    {id: 2, text: "O'rtacha", color: 'orange'},
    {id: 3, text: "Og'ir", color: '#fb5151'},
  ];
  const [selected, setSelected] = useState<number | null>(taskToEdit ? taskToEdit.status : 1);

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.bar} />
      <View style={[styles.header, {backgroundColor: theme.background, borderBottomColor: theme.border}]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.text}]}>Ko'rish</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card */}
        {/*<Text>{JSON.stringify(taskToEdit)}</Text>*/}
        <View style={[styles.card, {backgroundColor: theme.card, shadowColor: theme.card}]}>
          <Text style={[styles.title, {color: theme.text}]}>{taskToEdit.title}</Text>
          <Text style={{color: theme.placeholder, fontSize: 12}}>{taskToEdit.time}</Text>

          <View style={[styles.divider, {backgroundColor: theme.border}]} />

          <InfoRow label="Category" value={taskToEdit?.done ? "success" : "warning"}/>
          <Text style={{color: theme.placeholder}}>Status</Text>
          <View style={styles.selectsBox}>
            {options.map((option) => (
              <SingleCheckBox
                key={option.id}
                label={option.text}
                value={selected === option.id}
                onChange={() => {}}
                color={option.color}
              />
            ))}
          </View>

          <InfoRow label="Deadline" value={taskToEdit?.deadline ? taskToEdit.deadline : "0000-00-00"}/>

          <View style={styles.descriptionBox}>
            <Text style={[styles.label, {color: theme.placeholder}]}>Description</Text>
            <Text style={[styles.description, {color: theme.text}]}>{taskToEdit.description}</Text>
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
  selectsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
    paddingHorizontal: 2
  },
  bar: { height: 35, width: "100%" },
  safe: {flex: 1},
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
