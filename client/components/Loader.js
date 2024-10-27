import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function Loader({navigation}) {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startAnimation();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Navigate to the desired screen
      // Replace 'Home' with the name of your screen
      navigation.navigate('Home');
    }, 100); // Timeout set to 5 seconds

    return () => clearTimeout(timer); // Clear the timer on component unmount
  }, []);


  const startAnimation = () => {
    Animated.loop(
      Animated.timing(
        spinValue,
        {
          toValue: 1,
          duration: 22,
          easing: Easing.linear,
          useNativeDriver: true,
        }
      )
    ).start();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '260deg']
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.animationContainer, { transform: [{ rotate: spin }] }]}>
        <ActivityIndicator  size={"large"} color="#000" />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animationContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
