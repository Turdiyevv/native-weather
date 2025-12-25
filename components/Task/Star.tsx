import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet } from "react-native";

const { width, height } = Dimensions.get("window");

const Star = () => {
  const translateY = useRef(new Animated.Value(Math.random() * height)).current;
  const opacity = Math.random() * 0.5 + 0.3;
  const size = Math.random() * 2 + 1;
  const left = Math.random() * width;

  useEffect(() => {
    Animated.loop(
      Animated.timing(translateY, {
        toValue: 20,
        duration: 18000 + Math.random() * 8000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.star,
        {
          left,
          width: size,
          height: size,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

export default Star;
const styles = StyleSheet.create({
  star: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 10,
  },
});
