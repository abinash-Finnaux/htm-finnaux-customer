import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useTheme } from '../../context/ThemeContext';
import type { RootStackParamList } from '../../../App';

import logo from '../../assets/images/logo.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const FADE_DURATION = 800;
const NAVIGATE_DELAY = 2000;

export default function SplashScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const animation = Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: FADE_DURATION,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]);
    animation.start();

    const timer = setTimeout(
      () => navigation.replace('Permission'),
      NAVIGATE_DELAY,
    );

    return () => {
      clearTimeout(timer);
      animation.stop();
    };
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={themed.root}>
      <Animated.View
        style={[
          themed.logoContainer,
          { opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
        ]}
      >
        <Image source={logo} style={themed.logo} resizeMode="contain" />
      </Animated.View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors } = theme;

  return StyleSheet.create({
    root: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: colors.background,
    },
    logoContainer: {
      alignItems: 'center',
    },
    logo: {
      width: 180,
      height: 180,
    },
  });
}
