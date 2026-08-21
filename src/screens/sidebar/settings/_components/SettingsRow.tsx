import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../../context/ThemeContext';

type Props = {
  icon: string;
  label: string;
  children?: React.ReactNode;
};

export default function SettingsRow({ icon, label, children }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View style={themed.row}>
      <Text style={themed.rowIcon}>{icon}</Text>
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
      fontSize: 20,
    },
    rowLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
  });
}
