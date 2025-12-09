// components/LeftMenu.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface LeftMenuProps {
  buttons: {
      icon: string;
      size?: number;
      color?: string;
      marginLeft?:string | any;
      onPress: () => void;
  }[];
      containerStyle?: object;
}

const LeftMenu: React.FC<LeftMenuProps> = ({ buttons, containerStyle }) => {
  return (
    <View style={[styles.leftButtons, containerStyle]}>
      <View style={[styles.buttonBox, containerStyle]}>
        {buttons.map((btn, idx) => (
          <TouchableOpacity key={idx} style={[styles.sideButton, {marginLeft: btn.marginLeft}]} onPress={btn.onPress}>
            <Ionicons name={btn.icon as any} size={btn.size || 32} color={btn.color || "#121"} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default LeftMenu;

const styles = StyleSheet.create({
  leftButtons: {
    height: 100,
    borderTopLeftRadius: 35,
    borderTopEndRadius: 35,
    // width: "100%",
    marginHorizontal: 10,
    backgroundColor: "rgba(18, 18, 18, 0.01)",
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  buttonBox: {
    borderRadius: 40,
    padding: 10,
    // width: "100%",
    backgroundColor: "rgba(195,194,194,0.3)",
    flexDirection: "row",
    gap: 15,
  },
  sideButton: {
    backgroundColor: "#fff",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
