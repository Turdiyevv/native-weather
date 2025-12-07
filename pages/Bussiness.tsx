import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';

export default function BackdropFilterExample() {
  return (
    <ImageBackground
      source={{ uri: 'picsum.photos' }}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.blurContainer}>
          <Text style={styles.text}>Bizness</Text>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    // Bu View xiralashtirish konteynerining fon ustida joylashishini ta'minlaydi
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden', // Xiralashish effekti chegara radiusiga moslashishi uchun zarur
  },
  blurContainer: {
    flex: 1,
    // "Glassmorphism" ko'rinishi uchun yarim shaffof fon rangi qo'shing
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10
  },
});
