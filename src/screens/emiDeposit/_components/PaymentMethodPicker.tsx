import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export type PaymentMode = {
  id: string;
  label: string;
  icon: string;
};

type Props = {
  modes: PaymentMode[];
  value: string;
  onChange: (id: string) => void;
};

export default function PaymentMethodPicker({
  modes,
  value,
  onChange,
}: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View style={themed.grid}>
      {modes.map(mode => {
        const selected = value === mode.id;
        return (
          <Pressable
            key={mode.id}
            onPress={() => onChange(mode.id)}
            style={({ pressed }) => [
              themed.card,
              selected && themed.cardSelected,
              { opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={themed.icon}>{mode.icon}</Text>
            <Text style={[themed.label, selected && themed.labelSelected]}>
              {mode.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, radius } = theme;

  return StyleSheet.create({
    grid: {
      flexDirection: 'row',
      gap: 10,
    },
    card: {
      flex: 1,
      borderWidth: 1,
      paddingVertical: 14,
      alignItems: 'center',
      gap: 6,
      borderRadius: radius.md,
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    cardSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    icon: {
      fontSize: 22,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
    },
    labelSelected: {
      color: '#FFFFFF',
    },
  });
}
