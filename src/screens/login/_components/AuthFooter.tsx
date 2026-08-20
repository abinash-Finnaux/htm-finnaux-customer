import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  message?: string;
  linkLabel?: string;
  onLinkPress?: () => void;
  skipLabel?: string;
  onSkipPress?: () => void;
};

export default function AuthFooter({
  message,
  linkLabel,
  onLinkPress,
  skipLabel,
  onSkipPress,
}: Props) {
  const { theme } = useTheme();
  const themed = createStyles(theme);

  return (
    <>
      {(message || linkLabel) && (
        <View style={themed.linkRow}>
          {message ? (
            <Text style={themed.messageText}>{message + ' '}</Text>
          ) : null}
          {linkLabel && onLinkPress ? (
            <Pressable onPress={onLinkPress}>
              <Text style={themed.linkText}>{linkLabel}</Text>
            </Pressable>
          ) : null}
        </View>
      )}
      {skipLabel && onSkipPress ? (
        <Pressable onPress={onSkipPress} style={themed.skipRow}>
          <Text style={themed.skipText}>{skipLabel}</Text>
        </Pressable>
      ) : null}
    </>
  );
}

function createStyles({
  colors,
  typography,
}: ReturnType<typeof useTheme>['theme']) {
  return StyleSheet.create({
    linkRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 32,
    },
    messageText: {
      color: colors.textSecondary,
      fontSize: typography.body,
    },
    linkText: {
      color: colors.primary,
      fontSize: typography.body,
    },
    skipRow: {
      alignItems: 'center',
      marginTop: 16,
      paddingVertical: 8,
    },
    skipText: {
      color: colors.textSecondary,
      fontSize: typography.caption,
    },
  });
}
