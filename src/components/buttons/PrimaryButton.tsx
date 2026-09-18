import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
import { ArrowRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  suffix?: string;
  arrow?: boolean;
  style?: ViewStyle;
};

export default function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  suffix,
  arrow = false,
  style,
}: Props) {
  const { theme } = useTheme();
  const { colors, radius } = theme;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: disabled ? colors.border : colors.primary,
          borderRadius: radius.pill,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} size="small" />
      ) : (
        <View style={styles.row}>
          <Text style={[styles.text, { color: colors.onPrimary }]}>
            {title}
            {suffix ? ` ${suffix}` : ''}
          </Text>
          {arrow && <ArrowRight size={16} color={colors.onPrimary} />}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: 16,
    fontWeight: '700',
  },
});
