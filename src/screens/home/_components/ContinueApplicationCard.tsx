import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ArrowRight, ClipboardList, Save } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  onPress: () => void;
  completedSteps: number;
  totalSteps: number;
  savedAt?: string;
};

const formatSaved = (iso?: string): string => {
  if (!iso) return 'Progress saved automatically';
  const savedAt = new Date(iso).getTime();
  if (Number.isNaN(savedAt)) return 'Progress saved automatically';
  const diffMs = Date.now() - savedAt;
  if (diffMs < 60000) return 'Saved just now';
  const mins = Math.round(diffMs / 60000);
  if (mins < 60) return `Saved ${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `Saved ${hours} hr ago`;
  const days = Math.round(hours / 24);
  return `Saved ${days} day${days > 1 ? 's' : ''} ago`;
};

export default function ContinueApplicationCard({
  onPress,
  completedSteps,
  totalSteps,
  savedAt,
}: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  const total =
    Number.isFinite(totalSteps) && totalSteps > 0 ? Math.floor(totalSteps) : 1;
  const safeCompleted = Number.isFinite(completedSteps) ? completedSteps : 0;
  const completed = Math.min(Math.max(safeCompleted, 0), total);
  const percent = Math.min(
    Math.max(Math.round((completed / total) * 100), 0),
    100,
  );

  return (
    <View style={themed.section}>
      <View style={themed.card}>
        <View style={themed.accentBar} />

        <View style={themed.headerRow}>
          <View style={themed.iconWrap}>
            <ClipboardList size={22} color="#FFFFFF" />
          </View>
          <View style={themed.headerText}>
            <Text style={themed.eyebrow}>Incomplete application</Text>
            <Text style={themed.title}>Continue Your Loan Application</Text>
          </View>
          <View style={themed.percentBadge}>
            <Text style={themed.percentText}>{percent}%</Text>
          </View>
        </View>

        <Text style={themed.subtitle}>
          Your progress is saved automatically — pick up right where you left
          off without re-entering anything.
        </Text>

        <View style={themed.progressHeader}>
          <Text style={themed.progressLabel}>
            {completed} of {total} steps completed
          </Text>
          <View style={themed.savedRow}>
            <Save size={11} color={theme.colors.primary} />
            <Text style={themed.savedText}>{formatSaved(savedAt)}</Text>
          </View>
        </View>
        <View style={themed.track}>
          <View style={[themed.fill, { width: `${percent}%` }]} />
        </View>

        <Pressable
          onPress={onPress}
          style={({ pressed }) => [themed.cta, pressed && themed.ctaPressed]}
        >
          <Text style={themed.ctaText}>Resume Application</Text>
          <ArrowRight size={18} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    section: {
      paddingHorizontal: spacing.lg,
      marginTop: spacing.xl,
    },
    card: {
      borderRadius: radius.lg,
      backgroundColor: colors.primary + '0D',
      borderWidth: 1.5,
      borderColor: colors.primary + '33',
      padding: spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 4,
      overflow: 'hidden',
    },
    accentBar: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      backgroundColor: colors.primary,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    iconWrap: {
      width: 46,
      height: 46,
      borderRadius: 14,
      backgroundColor: colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerText: {
      flex: 1,
      flexShrink: 1,
    },
    eyebrow: {
      fontSize: 10,
      fontWeight: '800',
      color: colors.primary,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    title: {
      fontSize: 17,
      fontWeight: '800',
      color: colors.text,
      marginTop: 2,
    },
    percentBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
    },
    percentText: {
      fontSize: 12,
      fontWeight: '800',
      color: '#FFFFFF',
    },
    subtitle: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.textSecondary,
      marginTop: spacing.md,
    },
    progressHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.md,
      gap: 8,
    },
    progressLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: colors.text,
    },
    savedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    savedText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    track: {
      height: 8,
      borderRadius: 4,
      backgroundColor: colors.border,
      marginTop: 8,
      overflow: 'hidden',
    },
    fill: {
      height: '100%',
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 15,
      borderRadius: radius.pill,
      backgroundColor: colors.primary,
      marginTop: spacing.md,
    },
    ctaPressed: {
      opacity: 0.85,
    },
    ctaText: {
      fontSize: 15,
      fontWeight: '800',
      color: '#FFFFFF',
    },
  });
}
