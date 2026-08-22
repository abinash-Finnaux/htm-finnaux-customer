import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  icon: string;
  label: string;
  sub: string;
  bg: string;
  onPress: () => void;
};

export default function ContactCard({ icon, label, sub, bg, onPress }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme, bg);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [themed.card, pressed && themed.pressed]}
    >
      <Text style={themed.icon}>{icon}</Text>
      <Text style={themed.label}>{label}</Text>
      <Text style={themed.sub}>{sub}</Text>
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme'], bg: string) {
  const { radius } = theme;

  return StyleSheet.create({
    card: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 20,
      paddingHorizontal: 12,
      borderRadius: radius.lg,
      backgroundColor: bg,
    },
    pressed: {
      opacity: 0.85,
    },
    icon: {
      fontSize: 28,
      marginBottom: 8,
    },
    label: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '700',
    },
    sub: {
      color: 'rgba(255,255,255,0.75)',
      fontSize: 11,
      marginTop: 3,
    },
  });
}
