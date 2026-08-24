import React, { useMemo } from 'react';
import { Text, View, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  activeTab: 'pay' | 'prepay';
  onTabChange: (tab: 'pay' | 'prepay') => void;
  upcomingCount: number;
  outstandingBalance: number;
};

export default function ActionTabs({
  activeTab,
  onTabChange,
  upcomingCount,
  outstandingBalance,
}: Props) {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;

  const themed = useMemo(
    () => createStyles(colors, spacing, radius),
    [colors, spacing, radius],
  );

  return (
    <View style={themed.container}>
      <Pressable
        onPress={() => onTabChange('pay')}
        style={({ pressed }) => [
          themed.tab,
          activeTab === 'pay' && themed.tabSelected,
          { opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={themed.tabIcon}>💳</Text>
        <Text
          style={[
            themed.tabLabel,
            activeTab === 'pay' && themed.tabLabelSelected,
          ]}
        >
          Pay EMI
        </Text>
        {activeTab === 'pay' && (
          <Text style={themed.tabCount}>{upcomingCount} due</Text>
        )}
      </Pressable>
      <Pressable
        onPress={() => onTabChange('prepay')}
        style={({ pressed }) => [
          themed.tab,
          activeTab === 'prepay' && themed.tabSelected,
          { opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <Text style={themed.tabIcon}>⚡</Text>
        <Text
          style={[
            themed.tabLabel,
            activeTab === 'prepay' && themed.tabLabelSelected,
          ]}
        >
          Prepay
        </Text>
        {activeTab === 'prepay' && (
          <Text style={themed.tabCount}>
            ₹{outstandingBalance.toLocaleString('en-IN')}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>['theme']['colors'],
  spacing: ReturnType<typeof useTheme>['theme']['spacing'],
  radius: ReturnType<typeof useTheme>['theme']['radius'],
) {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      gap: 12,
      marginTop: spacing.xl,
    },
    tab: {
      flex: 1,
      borderWidth: 1.5,
      padding: 16,
      alignItems: 'center',
      borderRadius: radius.lg,
      backgroundColor: colors.surfaceElevated,
      borderColor: colors.border,
    },
    tabSelected: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    tabIcon: {
      fontSize: 24,
      marginBottom: 6,
    },
    tabLabel: {
      fontSize: 15,
      fontWeight: '700',
      color: colors.text,
    },
    tabLabelSelected: {
      color: '#FFFFFF',
    },
    tabCount: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 3,
      color: 'rgba(255,255,255,0.7)',
    },
  });
}
