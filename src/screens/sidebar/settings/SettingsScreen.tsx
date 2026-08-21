import React from 'react';
import { Text, View, Switch, Pressable, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { createStyles } from './styles';
import { RootStackParamList } from '../../../../App';
import { useTheme } from '../../../context/ThemeContext';

import SettingsSection from './_components/SettingsSection';
import SettingsRow from './_components/SettingsRow';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const themed = createStyles(colors, spacing, radius, headerBg, decorBg);

  return (
    <View style={themed.root}>
      <View style={themed.header}>
        <View style={themed.decor1} />
        <View style={themed.decor2} />
        <View style={themed.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [
              themed.backBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={themed.backBtnText}>←</Text>
          </Pressable>
          <Text style={themed.topTitle}>Settings</Text>
          <View style={themed.topSpacer} />
        </View>
        <View style={themed.headerBody}>
          <Text style={themed.headerIcon}>⚙️</Text>
        </View>
      </View>

      <ScrollView
        style={themed.flex}
        contentContainerStyle={themed.content}
        showsVerticalScrollIndicator={false}
      >
        <SettingsSection title="Appearance">
          <SettingsRow icon="🌙" label="Dark Mode">
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={isDark ? colors.primary : '#f4f3f4'}
            />
          </SettingsRow>
        </SettingsSection>

        {/* <SettingsSection title="Notifications" spaced>
          <SettingsRow icon="🔔" label="Push Notifications">
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: colors.border, true: colors.primary + '60' }}
              thumbColor={notifications ? colors.primary : '#f4f3f4'}
            />
          </SettingsRow>
        </SettingsSection> */}

        <SettingsSection title="Security" spaced>
          <View style={themed.divider} />
          <SettingsRow icon="🔑" label="Change Password">
            <Text style={themed.rowArrow}>›</Text>
          </SettingsRow>
        </SettingsSection>

        <SettingsSection title="About" spaced>
          <SettingsRow icon="📱" label="App Version">
            <Text style={themed.rowValue}>v1.0.0</Text>
          </SettingsRow>
        </SettingsSection>
      </ScrollView>
    </View>
  );
}
