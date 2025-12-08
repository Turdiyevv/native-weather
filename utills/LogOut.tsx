import AsyncStorage from "@react-native-async-storage/async-storage";
import { CommonActions, useNavigation } from "@react-navigation/native";

export const logout = async (navigation: any) => {
  try {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "LoginCodePage" }],
      })
    );
  } catch (error) {
    console.log("Logout xatosi:", error);
  }
};
