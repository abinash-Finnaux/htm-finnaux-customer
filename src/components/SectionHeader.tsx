import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { useTheme } from '../context/ThemeContext';

type Props = {
  title: string;
};

export default function SectionHeader({ title }: Props) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <Text
      style={[
        styles.title,
        {
          color: colors.textSecondary,
          marginTop: spacing.xl,
        },
      ]}
    >
      {title}
    </Text>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 10,
  },
});
