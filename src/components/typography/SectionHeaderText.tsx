import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  title: string;
  subtitle?: string;
};

export default function SectionHeaderText({ title, subtitle }: Props) {
  const { theme } = useTheme();
  const { colors, spacing } = theme;

  return (
    <View style={styles.wrap}>
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
      {subtitle ? (
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 10,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '400',
    marginTop: 2,
  },
});