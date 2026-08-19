import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

export default function GlobalInputText({
  label,
  error,
  style,
  ...rest
}: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  return (
    <View style={[styles.container, { marginTop: spacing.md }]}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            color: colors.text,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            marginTop: spacing.sm,
          },
          style,
        ]}
        placeholderTextColor={colors.textSecondary}
        autoCapitalize="none"
        autoCorrect={false}
        {...rest}
      />
      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    fontSize: 15,
  },
  errorText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
  },
});
