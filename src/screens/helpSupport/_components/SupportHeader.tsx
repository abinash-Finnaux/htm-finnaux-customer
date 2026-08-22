import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  title: string;
  icon: string;
  label: string;
  onBack: () => void;
};

export default function SupportHeader({ title, icon, label, onBack }: Props) {
  const { theme, isDark } = useTheme();
  const themed = createStyles(theme, isDark);

  return (
    <View style={themed.header}>
      <View style={themed.decor1} />
      <View style={themed.decor2} />
      <View style={themed.topBar}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            themed.backBtn,
            { opacity: pressed ? 0.6 : 1 },
          ]}
        >
          <Text style={themed.backBtnText}>←</Text>
        </Pressable>
        <Text style={themed.topTitle}>{title}</Text>
        <View style={themed.topSpacer} />
      </View>
      <View style={themed.headerBody}>
        <Text style={themed.headerIcon}>{icon}</Text>
        <Text style={themed.headerLabel}>{label}</Text>
      </View>
    </View>
  );
}

function createStyles(
  theme: ReturnType<typeof useTheme>['theme'],
  isDark: boolean,
) {
  const { colors } = theme;

  return StyleSheet.create({
    header: {
      paddingTop: 56,
      paddingBottom: 28,
      paddingHorizontal: 24,
      borderBottomLeftRadius: 32,
      borderBottomRightRadius: 32,
      backgroundColor: isDark ? '#1E293B' : colors.primary,
      overflow: 'hidden',
    },
    decor1: {
      position: 'absolute',
      top: -40,
      right: -30,
      width: 140,
      height: 140,
      borderRadius: 70,
      backgroundColor: isDark
        ? 'rgba(255,255,255,0.04)'
        : 'rgba(255,255,255,0.08)',
    },
    decor2: {
      position: 'absolute',
      bottom: 10,
      left: -40,
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: isDark
        ? 'rgba(255,255,255,0.04)'
        : 'rgba(255,255,255,0.08)',
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    backBtn: {
      width: 40,
      height: 40,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    backBtnText: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '600',
    },
    topTitle: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
    },
    topSpacer: {
      width: 40,
    },
    headerBody: {
      alignItems: 'center',
      marginTop: 20,
    },
    headerIcon: {
      fontSize: 36,
    },
    headerLabel: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
      marginTop: 10,
    },
  });
}
