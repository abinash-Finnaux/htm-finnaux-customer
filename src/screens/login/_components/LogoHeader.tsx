import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from './../../../context/ThemeContext';
import type { ImageSourcePropType } from 'react-native';

type Props = {
  image: ImageSourcePropType;
  appName: string;
  tagline?: string;
};

export default function LogoHeader({ image, appName, tagline }: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <View style={themed.container}>
      <Image source={image} style={themed.logo} resizeMode="contain" />
      <Text style={themed.appName}>{appName}</Text>
      {tagline ? (
        <Text style={themed.tagline}>{tagline}</Text>
      ) : null}
    </View>
  );
}

function createStyles({ colors, spacing }: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    container: {
      alignItems: 'center',
      marginBottom: 40,
    },
    logo: {
      width: 100,
      height: 100,
    },
    appName: {
      fontSize: 28,
      fontWeight: '700',
      letterSpacing: 2,
      color: colors.text,
      marginTop: spacing.sm,
    },
    tagline: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
  });
}
