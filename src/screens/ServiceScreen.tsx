import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Service'>;

export default function ServiceScreen({ navigation, route }: Props) {
  const { title, icon, description } = route.params;
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius, typography } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View
        style={[
          styles.header,
          { backgroundColor: headerBg },
        ]}
      >
        <View style={[styles.decor1, { backgroundColor: decorBg }]} />
        <View style={[styles.decor2, { backgroundColor: decorBg }]} />

        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              styles.backBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.topTitle}>Service Details</Text>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.headerBody}>
          <View style={styles.iconWrap}>
            <Text style={styles.headerIcon}>{icon}</Text>
          </View>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              borderRadius: radius.lg,
              padding: spacing.xl,
            },
          ]}
        >
          <Text
            style={[
              styles.cardTitle,
              { color: colors.text, marginBottom: spacing.sm },
            ]}
          >
            About this service
          </Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <Text
            style={[
              styles.cardDesc,
              { color: colors.textSecondary, marginTop: spacing.md },
            ]}
          >
            {description}
          </Text>
        </View>

        <View
          style={[
            styles.infoCard,
            {
              backgroundColor: colors.primary + '08',
              borderColor: colors.primary + '20',
              borderRadius: radius.md,
              padding: spacing.lg,
              marginTop: spacing.md,
            },
          ]}
        >
          <Text style={styles.infoIcon}>💡</Text>
          <Text
            style={[
              styles.infoText,
              { color: colors.text, marginTop: spacing.xs },
            ]}
          >
            Need help? Contact our support team for assistance with this service.
          </Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            {
              backgroundColor: colors.primary,
              borderRadius: radius.pill,
              marginTop: spacing.xl,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Text style={[styles.actionBtnText, { color: colors.onPrimary }]}>
            Request Now
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  header: {
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  decor1: {
    position: 'absolute',
    top: -40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  decor2: {
    position: 'absolute',
    bottom: 10,
    left: -40,
    width: 100,
    height: 100,
    borderRadius: 50,
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
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    fontWeight: '600',
  },
  headerBody: {
    alignItems: 'center',
    marginTop: 28,
  },
  iconWrap: {
    width: 68,
    height: 68,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    fontSize: 34,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 14,
    textAlign: 'center',
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: 40,
  },
  card: {
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1,
  },
  cardDesc: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
  },
  infoIcon: {
    fontSize: 18,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
  },
  actionBtn: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  actionBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
