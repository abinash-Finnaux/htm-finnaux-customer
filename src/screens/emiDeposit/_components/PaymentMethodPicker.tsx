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
              {
                backgroundColor: selected ? theme.colors.primary : theme.colors.surface,
                borderColor: selected ? theme.colors.primary : theme.colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            {selected && (
              <View style={themed.tick}>
                <Text style={themed.tickText}>✓</Text>
              </View>
            )}
            <Text style={themed.icon}>{mode.icon}</Text>
            <Text
              style={[
                themed.label,
                { color: selected ? '#FFFFFF' : theme.colors.text },
              ]}
            >
              {mode.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { radius } = theme;

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
    },
    tick: {
      position: 'absolute',
      top: 5,
      right: 5,
      width: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1,
    },
    tickText: {
      fontSize: 9,
      fontWeight: '800',
      color: '#1E293B',
    },
    icon: {
      fontSize: 22,
    },
    label: {
      fontSize: 12,
      fontWeight: '700',
    },
  });
}
