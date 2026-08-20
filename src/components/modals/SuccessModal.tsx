import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import type { AppTheme } from '../../constants/themes';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  buttonText?: string;
  onPress: () => void;
};

export default function SuccessModal({
  visible,
  title,
  message,
  buttonText = 'OK',
  onPress,
}: Props) {
  const { theme } = useTheme();
  const { colors, radius, spacing } = theme;
  const themed = createStyles(colors, radius, spacing);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={themed.overlay} onPress={onPress}>
        <Pressable
          style={themed.card}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={[
              themed.iconCircle,
              { backgroundColor: colors.primary + '15' },
            ]}
          >
            <Text style={[themed.icon, { color: colors.primary }]}>✓</Text>
          </View>

          <Text style={[themed.title, { color: colors.text }]}>{title}</Text>
          <Text style={[themed.message, { color: colors.textSecondary }]}>
            {message}
          </Text>

          <Pressable
            onPress={onPress}
            style={({ pressed }) => [
              themed.btn,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.pill,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[themed.btnText, { color: colors.onPrimary }]}>
              {buttonText}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(
  colors: AppTheme['colors'],
  radius: AppTheme['radius'],
  spacing: AppTheme['spacing'],
) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      padding: spacing.xl,
    },
    card: {
      width: '100%',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: radius.lg,
      padding: spacing.xl,
    },
    iconCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 16,
    },
    icon: {
      fontSize: 28,
      fontWeight: '800',
    },
    title: {
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 8,
      textAlign: 'center',
    },
    message: {
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
      marginBottom: 24,
    },
    btn: {
      width: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 14,
    },
    btnText: {
      fontSize: 16,
      fontWeight: '700',
    },
  });
}
