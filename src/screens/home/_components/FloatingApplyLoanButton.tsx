import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  onPress: () => void;
};

export default function FloatingApplyLoanButton({ onPress }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [themed.button, pressed && themed.pressed]}
    >
      <Plus size={20} color="#FFFFFF" />
      <Text style={themed.label}>Apply Loan</Text>
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, radius } = theme;

  return StyleSheet.create({
    button: {
      position: 'absolute',
      right: 24,
      bottom: 24,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 20,
      height: 54,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
      elevation: 8,
    },
    pressed: {
      opacity: 0.85,
      transform: [{ scale: 0.97 }],
    },
    label: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '800',
    },
  });
}
