import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../../../context/ThemeContext';

type Props = {
  icon: LucideIcon;
  label: string;
  children?: React.ReactNode;
};

export default function SettingsRow({ icon: Icon, label, children }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const themed = createStyles(theme);

  return (
    <View style={themed.row}>
      <View style={themed.rowIcon}>
        <Icon size={20} color={colors.text} />
      </View>
      <Text style={themed.rowLabel}>{label}</Text>
      {children}
    </View>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors } = theme;

  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 16,
    },
    rowIcon: {
      width: 32,
      marginRight: 8,
      justifyContent: 'center',
    },
    rowLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
  });
}
