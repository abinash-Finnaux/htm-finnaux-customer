import React from 'react';
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

  const themed = createStyles(colors, spacing, radius);

  return (
    <View style={themed.container}>
      <Pressable
        onPress={() => onTabChange('pay')}
        style={[
          themed.tab,
          {
            backgroundColor:
              activeTab === 'pay' ? colors.primary : colors.surfaceElevated,
            borderColor: activeTab === 'pay' ? colors.primary : colors.border,
          },
        ]}
      >
        <Text style={themed.tabIcon}>💳</Text>
        <Text
          style={[
            themed.tabLabel,
            { color: activeTab === 'pay' ? '#FFFFFF' : colors.text },
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
        style={[
          themed.tab,
          {
            backgroundColor:
              activeTab === 'prepay' ? '#8B5CF6' : colors.surfaceElevated,
            borderColor: activeTab === 'prepay' ? '#8B5CF6' : colors.border,
          },
        ]}
      >
        <Text style={themed.tabIcon}>⚡</Text>
        <Text
          style={[
            themed.tabLabel,
            { color: activeTab === 'prepay' ? '#FFFFFF' : colors.text },
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
      borderWidth: 1,
      padding: 16,
      alignItems: 'center',
      borderRadius: radius.lg,
    },
    tabIcon: {
      fontSize: 24,
      marginBottom: 6,
    },
    tabLabel: {
      fontSize: 15,
      fontWeight: '700',
    },
    tabCount: {
      fontSize: 11,
      fontWeight: '500',
      marginTop: 3,
      color: 'rgba(255,255,255,0.7)',
    },
  });
}
