import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  onPress: () => void;
  label?: string;
};

export default function DownloadButton({ onPress, label = 'Download' }: Props) {
  const { theme } = useTheme();
  const { colors, radius } = theme;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colors.primary,
          borderRadius: radius.lg,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <Text style={[styles.label, { color: colors.onPrimary }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
  },
  icon: {
    fontSize: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
});
