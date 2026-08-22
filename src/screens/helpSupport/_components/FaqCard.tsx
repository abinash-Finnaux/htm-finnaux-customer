import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  question: string;
  answer: string;
};

export default function FaqCard({ question, answer }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View style={themed.card}>
      <Text style={themed.question}>{question}</Text>
      <Text style={themed.answer}>{answer}</Text>
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    card: {
      borderWidth: 1,
      marginBottom: 10,
      padding: spacing.lg,
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
      borderRadius: radius.md,
    },
    question: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
    },
    answer: {
      fontSize: 13,
      lineHeight: 20,
      marginTop: spacing.xs,
      color: colors.textSecondary,
    },
  });
}
