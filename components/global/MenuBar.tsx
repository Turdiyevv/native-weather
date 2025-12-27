// components/LeftMenu.tsx
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LeftMenuProps } from "../../pages/types/types";
import { useTheme } from "../../theme/ThemeContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LeftMenu: React.FC<LeftMenuProps> = ({ buttons }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.wrapper,
        {
          bottom: 10,
        },
      ]}
    >
      <View style={styles.buttonBox}>
        <View
          style={[
            StyleSheet.absoluteFillObject,
            {
              backgroundColor: theme.card,
              // opacity: 0.3,
              borderRadius: 40,
            },
          ]}
        />
        {buttons.map((btn, idx) => (
          <TouchableOpacity
            key={idx}
            style={[
              styles.sideButton,
              { backgroundColor: theme.bgsound, borderColor: btn.color, borderWidth: 1 },
              btn.marginLeft ? { marginLeft: btn.marginLeft } : null,
            ]}
            onPress={btn.onPress}
          >
            <Ionicons
              name={btn.icon as any}
              size={btn.size || 24}
              color={theme.text}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default LeftMenu;
const styles = StyleSheet.create({
  wrapper: {
    position: "absolute", // 🔥 ENG MUHIM
    left: 10,
    right: 10,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    backgroundColor: "rgba(18,18,18,0.001)",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonBox: {
    width: "100%",
    flexDirection: "row",
    gap: 15,
    padding: 6,
    borderRadius: 40,
  },
  sideButton: {
    width: 45,
    height: 45,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.5,
    shadowRadius: 4,
  },
});
