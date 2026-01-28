// components/LeftMenu.tsx
import React from "react";
import {View, TouchableOpacity, StyleSheet, Text} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LeftMenuProps } from "../../pages/types/types";
import { useTheme } from "../../theme/ThemeContext";

const LeftMenu: React.FC<LeftMenuProps> = ({ buttons }) => {
  const { theme } = useTheme();

  return (
      <View style={styles.buttonBox}>
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: theme.primary,
              opacity: 0.05,
              borderRadius: 12,
            },
          ]}
        />
        {buttons.map((btn, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.sideButton,
              { backgroundColor: theme.primary, borderColor: btn.color, borderWidth: 1 },
              btn.marginLeft ? { marginLeft: btn.marginLeft } : null,
            ]}
            onPress={btn.onPress}
          >
              <Text style={{color: "#fff"}}>{btn?.text}</Text>
            <Ionicons
              name={btn.icon as any}
              size={btn.size || 16}
              color={"#fff"}
            />
          </TouchableOpacity>
        ))}
      </View>
  );
};

export default LeftMenu;
const styles = StyleSheet.create({
  buttonBox: {
    elevation: 12,
    shadowColor: "#000",
    shadowOpacity: 0.8,
    flexDirection: "row",
    gap: 5,
    padding: 6,
  },
  sideButton: {
      flexDirection: "row",
      alignContent: "center",
      paddingVertical: 10,
      paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
