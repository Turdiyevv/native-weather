import { BackHandler } from "react-native";

export const logout = async () => {
  try {
    BackHandler.exitApp();
  } catch (error) {
    console.log("Exit xatosi:", error);
  }
};
