import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

export type DrawerRoute =
  | 'Profile'
  | 'AppliedLoans'
  | 'MyLoans'
  | 'PaymentHistory'
  | 'Settings'
  | 'HelpSupport';

type DrawerItem = {
  icon: string;
  label: string;
  route: DrawerRoute;
};

const MENU_ITEMS: DrawerItem[] = [
  { icon: '📋', label: 'Applied Loans', route: 'AppliedLoans' },
  { icon: '🏦', label: 'My Loans', route: 'MyLoans' },
  { icon: '💳', label: 'Payment History', route: 'PaymentHistory' },
  { icon: '⚙️', label: 'Settings', route: 'Settings' },
  { icon: '❓', label: 'Help & Support', route: 'HelpSupport' },
];

type Props = {
  onItemPress: (route: DrawerRoute) => void;
};

export default function DrawerMenuList({ onItemPress }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <>
      {MENU_ITEMS.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={themed.item}
          activeOpacity={0.6}
          onPress={() => onItemPress(item.route)}
        >
          <Text style={themed.itemIcon}>{item.icon}</Text>
          <Text style={themed.itemLabel}>{item.label}</Text>
          <Text style={themed.itemArrow}>›</Text>
        </TouchableOpacity>
      ))}
    </>
  );
}

function createStyles(theme: ReturnType<typeof useTheme>['theme']) {
  const { colors } = theme;

  return StyleSheet.create({
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 12,
    },
    itemIcon: {
      fontSize: 20,
      width: 32,
    },
    itemLabel: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    itemArrow: {
      fontSize: 20,
      fontWeight: '300',
      color: colors.textSecondary,
    },
  });
}
