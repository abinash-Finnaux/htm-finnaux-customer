import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Props = Omit<TextInputProps, 'secureTextEntry'> & {
  label: string;
  error?: string;
};

export default function GlobalInputPassword({
  label,
  error,
  style,
  ...rest
}: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={{ marginTop: spacing.md }}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            borderRadius: radius.md,
            paddingHorizontal: spacing.md,
            marginTop: spacing.sm,
          },
          style,
        ]}
      >
        <TextInput
          style={[styles.input, { color: colors.text }]}
          placeholderTextColor={colors.textSecondary}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          {...rest}
        />
        <Pressable onPress={() => setShowPassword(prev => !prev)}>
          <Text style={[styles.toggle, { color: colors.primary }]}>
            {showPassword ? 'Hide' : 'Show'}
          </Text>
        </Pressable>
      </View>
      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  toggle: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 6,
  },
});
