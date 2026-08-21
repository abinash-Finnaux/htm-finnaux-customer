import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  icon: string;
  label: string;
  bg: string;
  onPress: () => void;
};

export default function ServiceCard({ icon, label, bg, onPress }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme, bg);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [themed.card, pressed && themed.pressed]}
    >
      <View style={themed.iconWrap}>
        <Text style={themed.icon}>{icon}</Text>
      </View>

      <Text style={themed.label} numberOfLines={2}>
        {label}
      </Text>

      <View style={themed.footer}>
        <View style={themed.divider} />
        <View style={themed.footerRow}>
          <Text style={themed.hint}>Open</Text>
          <View style={themed.arrow}>
            <Text style={themed.arrowText}>→</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function createStyles(
  theme: ReturnType<typeof useTheme>['theme'],
  bg: string,
) {
  const { radius } = theme;

  return StyleSheet.create({
    card: {
      width: '30.6%',
      padding: 12,
      alignItems: 'center',
      borderRadius: radius.lg,
      backgroundColor: bg,
    },
    pressed: {
      opacity: 0.85,
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 14,
      backgroundColor: 'rgba(255,255,255,0.18)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 12,
    },
    icon: {
      fontSize: 24,
    },
    label: {
      fontSize: 12,
      fontWeight: '800',
      lineHeight: 17,
      color: '#FFFFFF',
      textAlign: 'center',
    },
    footer: {
      marginTop: 'auto',
      paddingTop: 12,
      alignSelf: 'stretch',
    },
    divider: {
      height: 1,
      backgroundColor: 'rgba(255,255,255,0.15)',
      marginBottom: 8,
    },
    footerRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    hint: {
      fontSize: 10,
      fontWeight: '600',
      color: 'rgba(255,255,255,0.45)',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    arrow: {
      width: 26,
      height: 26,
      borderRadius: 13,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    arrowText: {
      fontSize: 14,
      fontWeight: '800',
      color: '#FFFFFF',
    },
  });
}
