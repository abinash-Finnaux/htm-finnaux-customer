import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  type: string;
  id: string;
  outstanding: number;
  selected: boolean;
  onPress: () => void;
};

const formatINR = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export default function LoanCard({
  type,
  id,
  outstanding,
  selected,
  onPress,
}: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        themed.card,
        selected && themed.cardSelected,
        pressed && themed.cardPressed,
      ]}
    >
      <Text style={[themed.type, selected && themed.typeSelected]}>{type}</Text>
      <Text style={[themed.id, selected && themed.idSelected]}>{id}</Text>
      <Text style={[themed.outLabel, selected && themed.outLabelSelected]}>
        Outstanding
      </Text>
      <Text style={[themed.outValue, selected && themed.outValueSelected]}>
        {formatINR(outstanding)}
      </Text>
    </Pressable>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors, spacing, radius } = theme;

  return StyleSheet.create({
    card: {
      width: 200,
      borderWidth: 1.5,
      borderRadius: radius.lg,
      padding: spacing.md,
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
    },
    cardSelected: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    cardPressed: {
      opacity: 0.85,
    },
    type: {
      fontSize: 13,
      fontWeight: '700',
      color: colors.text,
    },
    typeSelected: {
      color: '#FFFFFF',
    },
    id: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 2,
      color: colors.textSecondary,
    },
    idSelected: {
      color: 'rgba(255,255,255,0.75)',
    },
    outLabel: {
      fontSize: 9,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginTop: 12,
      color: colors.textSecondary,
    },
    outLabelSelected: {
      color: 'rgba(255,255,255,0.7)',
    },
    outValue: {
      fontSize: 15,
      fontWeight: '800',
      marginTop: 2,
      color: colors.text,
    },
    outValueSelected: {
      color: '#FFFFFF',
    },
  });
}
