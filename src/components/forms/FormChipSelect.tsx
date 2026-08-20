import React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import GlobalChipSelect from '../inputTexts/GlobalChipSelect';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  options: string[];
  suffix?: string;
  rules?: RegisterOptions<T>;
};

export default function FormChipSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  suffix,
  rules,
}: Props<T>) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, value } }) => (
          <GlobalChipSelect
            options={options}
            value={value}
            onChange={onChange}
            suffix={suffix}
          />
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
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
});
