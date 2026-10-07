import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { ClipboardList } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';

type Props = {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
};

export default function PlaceholderStep({
  title,
  subtitle,
  icon: Icon = ClipboardList,
}: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  return (
    <>
      <SectionHeaderText title={title} subtitle={subtitle} />
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surfaceElevated,
            borderColor: colors.border,
            borderRadius: radius.lg,
          },
        ]}
      >
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: colors.primary + '18' },
          ]}
        >
          <Icon size={26} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.hint, { color: colors.textSecondary }]}>
          This section is coming soon. You can continue to the next step.
        </Text>
      </View>
      <View style={{ height: spacing.lg }} />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 6,
  },
  hint: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 19,
  },
});
