import React, {useState} from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView, Vibration, Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {useTheme} from "../../theme/ThemeContext";
import InfoRow from "../../components/Task/InfoRow";
import {useRoute, RouteProp, useNavigation, CommonActions} from "@react-navigation/native";
import {RootStackParamList} from "../types/types";
import SingleCheckBox from "../../components/global/CheckBox";
import {formatDateTime} from "../../utills/date";
import Header from "../../components/global/Header";
import {showMessage} from "react-native-flash-message";
import ConfirmModal from "../../components/global/ConfirmModal";
import {deleteTask, getActiveUser} from "../../service/storage";
import {UserTask} from "../types/userTypes";
import ImageViewing from "react-native-image-viewing";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ViewTaskRouteProp = RouteProp<RootStackParamList, "ViewTask">;
const ViewPage: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { theme } = useTheme();
  const route = useRoute<ViewTaskRouteProp>();
  const taskToEdit = route.params?.task;
  const options = [
    {id: 1, text: "Yengil", color: 'green'},
    {id: 2, text: "O'rtacha", color: 'orange'},
    {id: 3, text: "Og'ir", color: '#fb5151'},
  ];
  const [selected, setSelected] = useState<number | null>(taskToEdit ? taskToEdit.status : 1);
  const [modalVisible, setModalVisible] = useState(false);
  const onDelete = async (task: UserTask) => {
      const activeUser = await getActiveUser();
      if (!activeUser) {
        showMessage({
          message: "Foydalanuvchi topilmadi!",
          type: "danger",
        });
        return;
      }
      await deleteTask(activeUser.username, task.id);
      showMessage({
        message: "Vazifa butunlay o‘chirildi",
        type: "success",
      });
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
  taskToEdit?.files
    ?.filter(file => file.type?.includes("image"))
    .map(file => ({
      uri: file.uri,
    })) || [];
  const [previewIndex, setPreviewIndex] = useState<number>(0);
  const [viewerVisible, setViewerVisible] = useState(false);
  const openPreview = (uri: string) => {
      const index = images.findIndex(img => img.uri === uri);
      if (index >= 0) {
        setPreviewIndex(index);
        setViewerVisible(true);
      }
  };
    return (
    <View style={{flex: 1}}>
      <Header title={"ELement"}/>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.card, {backgroundColor: theme.card, shadowColor: "black"}]}>
          <View style={{flexDirection: "row",justifyContent: "space-between", alignItems:"center"}}>
              <View>
                  <Text style={[styles.title, {color: theme.text}]}>{taskToEdit.title}</Text>
                  <View style={{flexDirection: "row"}}>
                      <Text style={{color: theme.placeholder, fontSize: 12}}>{formatDateTime(taskToEdit.time)}</Text>
                      { taskToEdit.isDeleted && (
                          <Text
                              style={{paddingHorizontal: 3, marginLeft: 3, color: theme.danger, borderColor: theme.danger, borderWidth: 1, borderRadius: 5, fontSize: 10}}
                          >Bekor qilingan</Text>
                      )}
                  </View>
              </View>
              {taskToEdit.isReturning && (
                  <View style={styles.returnCount}>
                      <Ionicons
                        name="refresh-outline"
                        size={32}
                        color={theme.subText}
                        style={styles.scale}
                      />
                      <Text style={[styles.returnCountText, {color: theme.text}]}>{taskToEdit.isReturning}</Text>
                  </View>
              )}
          </View>
          <View style={[styles.divider, {backgroundColor: theme.border}]} />
          <View style={{marginBottom: 10}}>
            <Text style={[styles.label, {color: theme.placeholder}]}>Batafsil</Text>
            <TouchableOpacity
                activeOpacity={0.8}
                delayLongPress={1800}
                onLongPress={() => {
                    Vibration.vibrate(30);
                    navigation.navigate("DescStyle", {description: taskToEdit.description})
                }}>
                <Text style={[styles.description, {color: theme.text}]}>{taskToEdit.description}</Text>
            </TouchableOpacity>
          </View>
          <InfoRow label="Kategoriya" value={taskToEdit?.done ? "Bajarilgan" : "Bajarilmagan"}/>
          <InfoRow label="Deadline" value={taskToEdit.deadline ? formatDateTime(taskToEdit.deadline) : "-"}/>
          <InfoRow label="Qo'ng'iroq" value={taskToEdit.alarmDate ? formatDateTime(taskToEdit.alarmDate) : "-"}/>
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
          <View>
              <ScrollView horizontal style={{ marginTop: 15 }}>
                  {taskToEdit.files?.map((file, i) => (
                    <View key={i} style={styles.fileBox}>
                      {file.type?.includes("image") ? (
                        <TouchableOpacity onPress={() => openPreview(file.uri)}>
                          <Image source={{ uri: file.uri }}
                                 style={{width: 90, height: 90, borderRadius: 8}}
                          />
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

        {/* Action buttons */}
        <View style={{ flexDirection: "row", justifyContent: "flex-end", marginTop: 10}}>
            <TouchableOpacity
                onPress={() => setModalVisible(true)}
                style={[styles.button, {backgroundColor: theme.card}]}>
              <Text style={[styles.buttonText, {color: theme.danger}]}>O'chirish</Text>
              <Ionicons name={"trash"} size={16} color={theme.danger} />
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => {
                  if (!taskToEdit.done && !taskToEdit.isDeleted) {
                    navigation.navigate("AddPage", {task: taskToEdit});
                  }else {
                    showMessage({
                      message: "Tahrirlashni imkoni yo'q!",
                      type: "danger",
                    });
                  }
                }}
                style={[styles.button, {backgroundColor: theme.card}]}>
              <Text style={[styles.buttonText, {color: theme.text}]}>Tahrirlash</Text>
              <Ionicons name={"pencil"} size={16} color={theme.text} />
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
  fileBox: {
    position: "relative",
    marginRight: 12,
    marginVertical: 5,
  },
  fileName: {
    width: 90,
    height: 90,
    backgroundColor: "#ddd",
    padding: 5,
    borderRadius: 8,
  },
  returnCount: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  returnCountText: {
      fontWeight: "bold",
     marginLeft: 4,
      marginTop: 2,
     position: "absolute",
     fontSize: 11,
  },
    scale: {
        top: -1,
        transform: [{ scaleX: -1,  }, {rotate: "40deg"}],
    },
  selectsBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 2
  },
  label: {
    fontSize: 12,
    marginBottom: 4,
  },
  content: {
    padding: 16,
  },
  card: {
    marginTop: 12,
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
    lineHeight: 20,
  },
  button: {
    marginLeft: 10,
    flexDirection: "row",
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    width: 120,
  },
  buttonText: {
    marginRight: 5,
    fontSize: 16,
    fontWeight: "600",
  },
});
