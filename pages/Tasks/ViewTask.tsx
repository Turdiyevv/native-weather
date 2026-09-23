import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Vibration,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTheme } from "../../theme/ThemeContext";
import InfoRow from "../../components/Task/InfoRow";
import { useRoute, RouteProp, useNavigation, CommonActions } from "@react-navigation/native";
import { RootStackParamList } from "../types/types";
import SingleCheckBox from "../../components/global/CheckBox";
import { formatDateTime } from "../../utills/date";
import Header from "../../components/global/Header";
import { showMessage } from "react-native-flash-message";
import ConfirmModal from "../../components/global/ConfirmModal";
import { deleteTask, getActiveUser } from "../../service/storage";
import { UserTask } from "../types/userTypes";
import ImageViewing from "react-native-image-viewing";
import { useLanguage } from "../../i18n/LanguageContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ViewTaskRouteProp = RouteProp<RootStackParamList, "ViewTask">;

const ViewPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const { t } = useLanguage();
  const route = useRoute<ViewTaskRouteProp>();
  const taskToEdit = route.params?.task;
  const options = [
    { id: 1, text: "Yengil", color: "green" },
    { id: 2, text: "O'rtacha", color: "orange" },
    { id: 3, text: "Og'ir", color: "#fb5151" },
  ];
  const [selected, setSelected] = useState<number | null>(taskToEdit ? taskToEdit.status : 1);
  const [modalVisible, setModalVisible] = useState(false);

  const onDelete = async (task: UserTask) => {
    const activeUser = await getActiveUser();
    if (!activeUser) {
      showMessage({ message: "Foydalanuvchi topilmadi!", type: "danger" });
      return;
    }
    await deleteTask(activeUser.username, task.id);
    showMessage({ message: "Vazifa butunlay o‘chirildi", type: "success" });
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: "MainTabs" }],
        })
      );
    }
  };

  const images =
    taskToEdit?.files?.filter((file) => file.type?.includes("image")).map((file) => ({ uri: file.uri })) || [];

  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [viewerVisible, setViewerVisible] = useState(false);

  const openPreview = (uri: string) => {
    const index = images.findIndex((img) => img.uri === uri);
    if (index >= 0) {
      setPreviewIndex(index);
      setViewerVisible(true);
    }
  };

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}>
      <Header title={t("detail")} isBack={true} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.headerRow}>
            <View style={styles.titleWrap}>
              <Text style={[styles.title, { color: theme.text }]}>{taskToEdit.title}</Text>
              <View style={styles.metaRow}>
                <Text style={{ color: theme.subText, fontSize: 12 }}>{formatDateTime(taskToEdit.time)}</Text>
                {taskToEdit.isDeleted && (
                  <Text style={[styles.deletedBadge, { color: theme.danger, borderColor: theme.danger }]}>
                    Bekor qilingan
                  </Text>
                )}
              </View>
            </View>

            {taskToEdit.isReturning && (
              <View style={styles.returnCount}>
                <Ionicons name="refresh-outline" size={30} color={theme.subText} style={styles.scale} />
                <Text style={[styles.returnCountText, { color: theme.text }]}>{taskToEdit.isReturning}</Text>
              </View>
            )}
          </View>

          <View style={[styles.divider, { backgroundColor: theme.border }]} />

          <View style={styles.sectionBlock}>
            <Text style={[styles.label, { color: theme.subText }]}>{t("details")}</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              delayLongPress={1800}
              onLongPress={() => {
                Vibration.vibrate(30);
                navigation.navigate("DescStyle", { description: taskToEdit.description });
              }}
            >
              <Text style={[styles.description, { color: theme.text }]}>{taskToEdit.description}</Text>
            </TouchableOpacity>
          </View>

          <InfoRow label={t("category")} value={taskToEdit?.done ? t("finished") : t("unfinished")} />
          <InfoRow label={t("deadline")} value={taskToEdit.deadline ? formatDateTime(taskToEdit.deadline) : "-"} />
          <InfoRow label={t("alarm")} value={taskToEdit.alarmDate ? formatDateTime(taskToEdit.alarmDate) : "-"} />

          <Text style={[styles.statusLabel, { color: theme.subText }]}>Status</Text>
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

          <View>
            <ScrollView horizontal style={{ marginTop: 15 }} showsHorizontalScrollIndicator={false}>
              {taskToEdit.files?.map((file, i) => (
                <View key={i} style={styles.fileBox}>
                  {file.type?.includes("image") ? (
                    <TouchableOpacity onPress={() => openPreview(file.uri)}>
                      <Image source={{ uri: file.uri }} style={{ width: 90, height: 90, borderRadius: 12 }} />
                    </TouchableOpacity>
                  ) : (
                    <View style={styles.fileName}>
                      <Text numberOfLines={2}>{file.name}</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
            <ImageViewing
              images={images}
              imageIndex={previewIndex}
              visible={viewerVisible}
              onRequestClose={() => setViewerVisible(false)}
              swipeToCloseEnabled
              doubleTapToZoomEnabled
            />
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.button, { backgroundColor: theme.card, borderColor: theme.border }]}>
            <Text style={[styles.buttonText, { color: theme.danger }]}>O'chirish</Text>
            <Ionicons name={"trash"} size={16} color={theme.danger} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (!taskToEdit.done && !taskToEdit.isDeleted) {
                navigation.navigate("AddPage", { task: taskToEdit });
              } else {
                showMessage({ message: "Tahrirlashni imkoni yo'q!", type: "danger" });
              }
            }}
            style={[styles.button, { backgroundColor: theme.primary, borderColor: theme.primary }]}
          >
            <Text style={[styles.buttonText, { color: "#fff" }]}>Tahrirlash</Text>
            <Ionicons name={"pencil"} size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <ConfirmModal
        visible={modalVisible}
        message="Siz bu vazifani butunlay o'chirmoqchimisiz ?"
        onConfirm={async () => {
          await onDelete(taskToEdit);
          setModalVisible(false);
        }}
        onCancel={() => setModalVisible(false)}
      />
    </View>
  );
};

export default ViewPage;

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 16 },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 18,
    elevation: 5,
  },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  titleWrap: { flex: 1, paddingRight: 8 },
  title: { fontSize: 22, fontWeight: "800" },
  metaRow: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  deletedBadge: { fontSize: 10, borderWidth: 1, borderRadius: 5, paddingHorizontal: 5, paddingVertical: 2, marginLeft: 6 },
  returnCount: { justifyContent: "center", alignItems: "center", width: 42, height: 42 },
  returnCountText: { position: "absolute", fontSize: 11, fontWeight: "700" },
  scale: { transform: [{ scaleX: -1 }, { rotate: "40deg" }] },
  divider: { height: 1, marginVertical: 16 },
  sectionBlock: { marginBottom: 10 },
  label: { fontSize: 12, marginBottom: 4, fontWeight: "700" },
  description: { fontSize: 16, lineHeight: 24 },
  selectsBox: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 2, marginTop: 8 },
  statusLabel: { fontSize: 12, marginTop: 12, fontWeight: "700" },
  fileBox: { position: "relative", marginRight: 12, marginVertical: 5 },
  fileName: { width: 90, height: 90, backgroundColor: "#e2e8f0", padding: 6, borderRadius: 12, justifyContent: "center" },
  actionRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 16, gap: 10 },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 120,
  },
  buttonText: { fontSize: 15, fontWeight: "700", marginRight: 8 },
});
