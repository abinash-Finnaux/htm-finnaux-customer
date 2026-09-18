import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import {
  ChevronRight,
  CircleHelp,
  ClipboardList,
  CreditCard,
  Landmark,
  Settings,
  type LucideIcon,
} from 'lucide-react-native';

export type DrawerRoute =
  | 'Profile'
  | 'AppliedLoans'
  | 'MyLoans'
  | 'PaymentHistory'
  | 'Settings'
  | 'HelpSupport';

type DrawerItem = {
  icon: LucideIcon;
  label: string;
  route: DrawerRoute;
};

const MENU_ITEMS: DrawerItem[] = [
  { icon: ClipboardList, label: 'Applied Loans', route: 'AppliedLoans' },
  { icon: Landmark, label: 'My Loans', route: 'MyLoans' },
  { icon: CreditCard, label: 'Payment History', route: 'PaymentHistory' },
  { icon: Settings, label: 'Settings', route: 'Settings' },
  { icon: CircleHelp, label: 'Help & Support', route: 'HelpSupport' },
];

type Props = {
  onItemPress: (route: DrawerRoute) => void;
};

export default function DrawerMenuList({ onItemPress }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
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
          <item.icon
            size={20}
            color={colors.text}
            style={{ width: 32, marginRight: 8 }}
          />
          <Text style={themed.itemLabel}>{item.label}</Text>
          <ChevronRight size={20} color={colors.textSecondary} />
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
