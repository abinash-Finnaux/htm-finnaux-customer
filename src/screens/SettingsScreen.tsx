import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { colors, spacing, radius } = theme;
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(false);

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
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
          <Text style={styles.topTitle}>Settings</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.headerBody}>
          <Text style={styles.headerIcon}>⚙️</Text>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <Text
          style={[
            styles.sectionLabel,
            { color: colors.textSecondary, marginBottom: spacing.sm },
          ]}
        >
          Appearance
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              borderRadius: radius.lg,
            },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.rowIcon, { fontSize: 20 }]}>🌙</Text>
            <Text style={[styles.rowLabel, { color: colors.text }]}>
              Dark Mode
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={isDark ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View>

        {/* <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
          Notifications
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.lg },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.rowIcon, { fontSize: 20 }]}>🔔</Text>
            <Text style={[styles.rowLabel, { color: colors.text }]}>Push Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={notifications ? colors.primary : '#f4f3f4'}
            />
          </View>
        </View> */}

        <Text
          style={[
            styles.sectionLabel,
            {
              color: colors.textSecondary,
              marginTop: spacing.xl,
              marginBottom: spacing.sm,
            },
          ]}
        >
          Security
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              borderRadius: radius.lg,
            },
          ]}
        >
          {/* <View style={styles.row}>
            <Text style={[styles.rowIcon, { fontSize: 20 }]}>🔐</Text>
            <Text style={[styles.rowLabel, { color: colors.text }]}>
              Biometric Login
            </Text>
            <Switch
              value={biometric}
              onValueChange={setBiometric}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={biometric ? colors.primary : '#f4f3f4'}
            />
          </View> */}
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.row}>
            <Text style={[styles.rowIcon, { fontSize: 20 }]}>🔑</Text>
            <Text style={[styles.rowLabel, { color: colors.text }]}>
              Change Password
            </Text>
            <Text style={[styles.rowArrow, { color: colors.textSecondary }]}>
              ›
            </Text>
          </View>
        </View>

        <Text
          style={[
            styles.sectionLabel,
            {
              color: colors.textSecondary,
              marginTop: spacing.xl,
              marginBottom: spacing.sm,
            },
          ]}
        >
          About
        </Text>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surfaceElevated,
              borderColor: colors.border,
              borderRadius: radius.lg,
            },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.rowIcon, { fontSize: 20 }]}>📱</Text>
            <Text style={[styles.rowLabel, { color: colors.text }]}>
              App Version
            </Text>
            <Text style={[styles.rowValue, { color: colors.textSecondary }]}>
              v1.0.0
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: 56,
    paddingBottom: 28,
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
  backBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '600' },
  topTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '600' },
  headerBody: { alignItems: 'center', marginTop: 20 },
  headerIcon: { fontSize: 36 },
  flex: { flex: 1 },
  content: { paddingBottom: 40 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: { borderWidth: 1, overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  rowIcon: { width: 32 },
  rowLabel: { flex: 1, fontSize: 15, fontWeight: '600' },
  rowArrow: { fontSize: 22, fontWeight: '300' },
  rowValue: { fontSize: 14 },
  divider: { height: 1, marginHorizontal: 16 },
});
