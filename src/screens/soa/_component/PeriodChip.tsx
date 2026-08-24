import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  label: string;
  selected: boolean;
  onPress: () => void;
};

export default function PeriodChip({ label, selected, onPress }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        themed.chip,
        selected && themed.chipActive,
        pressed && themed.chipPressed,
      ]}
    >
      <Text style={[themed.label, selected && themed.labelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, radius } = theme;

  return StyleSheet.create({
    chip: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 11,
      borderWidth: 1.5,
      borderColor: colors.border,
      borderRadius: radius.md,
      backgroundColor: colors.surfaceElevated,
    },
    chipActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary + '12',
    },
    chipPressed: {
      opacity: 0.8,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    labelActive: {
      color: colors.primary,
      fontWeight: '800',
    },
  });
}
