// hooks/useScroll.tsx
import { useRef, useState } from "react";
import { Animated } from "react-native";

export function useScroll() {
  const footerTranslateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const [isFooterVisible, setIsFooterVisible] = useState(true);

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const diff = currentScrollY - lastScrollY.current;

    if (diff > 5 && currentScrollY > 50) {
      if (isFooterVisible) {
        Animated.timing(footerTranslateY, {
          toValue: 100,
          duration: 250,
          useNativeDriver: true,
        }).start();
        setIsFooterVisible(false);
      }
    } else if (diff < -5) {
      if (!isFooterVisible) {
        Animated.timing(footerTranslateY, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start();
        setIsFooterVisible(true);
      }
    }

    lastScrollY.current = currentScrollY;
  };

  return {
    handleScroll,
    footerTranslateY,
  };
}
