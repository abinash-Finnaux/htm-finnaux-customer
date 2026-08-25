import React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Option = {
  id: string;
  label: string;
  icon: string;
};

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: Option[];
  rules?: RegisterOptions<T>;
};

export default function FormPaymentModeSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  rules,
}: Props<T>) {
  const { theme } = useTheme();
  const { colors, radius } = theme;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <View style={styles.grid}>
            {options.map(mode => {
              const selected = value === mode.id;
              return (
                <Pressable
                  key={mode.id}
                  onPress={() => onChange(mode.id)}
                  style={({ pressed }) => [
                    styles.card,
                    {
                      backgroundColor: selected
                        ? colors.primary
                        : colors.surface,
                      borderColor: selected ? colors.primary : colors.border,
                      borderRadius: radius.md,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Text style={styles.cardIcon}>{mode.icon}</Text>
                  <Text
                    style={[
                      styles.cardLabel,
                      { color: selected ? '#FFFFFF' : colors.text },
                    ]}
                  >
                    {mode.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 10,
  },
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
  },
  cardIcon: {
    fontSize: 22,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
});
