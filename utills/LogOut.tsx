import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";

export const logout = async (navigation: any) => {
  try {
    await AsyncStorage.clear();   // ❗ hamma maʼlumotni o‘chiradi
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginPage" }],
      })
    );

  } catch (error) {
    console.log("Logout xatosi:", error);
  }
};
