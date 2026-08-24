import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  icon: string;
  label: string;
  value: string;
  isLast?: boolean;
};

export default function DetailItem({
  icon,
  label,
  value,
  isLast = false,
}: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View>
      <View style={themed.row}>
        <View style={themed.iconWrap}>
          <Text style={themed.icon}>{icon}</Text>
        </View>
        <Text style={themed.label}>{label}</Text>
        <Text style={themed.value}>{value}</Text>
      </View>
      {!isLast && <View style={themed.divider} />}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors } = theme;

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 10,
    },
    iconWrap: {
      width: 34,
      height: 34,
      borderRadius: 10,
      backgroundColor: colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
    },
    icon: {
      fontSize: 15,
    },
    label: {
      flex: 1,
      fontSize: 13,
      fontWeight: '500',
      color: colors.textSecondary,
    },
    value: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      textAlign: 'right',
    },
    divider: {
      height: StyleSheet.hairlineWidth,
      backgroundColor: colors.border,
    },
  });
}
