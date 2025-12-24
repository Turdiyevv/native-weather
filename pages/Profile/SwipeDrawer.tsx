import React, { useEffect } from "react";
import { View, Text, StyleSheet, Dimensions, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const SCREEN_WIDTH = Dimensions.get("window").width;
const DRAWER_WIDTH = SCREEN_WIDTH * 0.8;

type SwipeDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

export default function SwipeDrawer({ visible, onClose }: SwipeDrawerProps) {
  const translateX = useSharedValue(DRAWER_WIDTH);

  // Effekt bilan visible boshqaruvi
  useEffect(() => {
    translateX.value = visible ? withTiming(0) : withTiming(DRAWER_WIDTH);
  }, [visible]);

  // swipe gesture
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationX < 0) {
        // o‘ngdan chapga surilganda
        translateX.value = Math.max(e.translationX, -DRAWER_WIDTH) + DRAWER_WIDTH;
      }
    })
    .onEnd(() => {
      if (translateX.value < DRAWER_WIDTH / 2) {
        translateX.value = withTiming(0); // ochiladi
      } else {
        translateX.value = withTiming(DRAWER_WIDTH); // yopiladi
        onClose();
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Overlay */}
      {visible && (
        <Pressable style={styles.overlay} onPress={onClose} />
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.drawer, animatedStyle]}>
          <Text style={styles.text}>PROFILE DRAWER</Text>
          <Text>Bu oddiy text</Text>
          <Text>Swipe bilan chiqadi</Text>
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: 0,
    width: DRAWER_WIDTH,
    backgroundColor: "#fff",
    elevation: 20,
    zIndex: 100,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: -2, height: 0 },
    shadowRadius: 5,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
});
