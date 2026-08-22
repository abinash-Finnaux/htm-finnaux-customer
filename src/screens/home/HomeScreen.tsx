import React, { useMemo, useState } from 'react';
import { Text, View, Image, Pressable, ScrollView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../App';

import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from './../../assets/images/logo.png';
import { createStyles } from './styles';
import StatCard from './_components/StatCard';
import ServiceCard from './_components/ServiceCard';
import ProfileDrawerModal from './_components/ProfileDrawerModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function getGreeting(): { text: string; emoji: string } {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good Morning', emoji: '☀️' };
  if (hour < 17) return { text: 'Good Afternoon', emoji: '🌤️' };
  if (hour < 21) return { text: 'Good Evening', emoji: '🌅' };
  return { text: 'Good Night', emoji: '🌙' };
}

const SERVICES = [
  {
    icon: '📝',
    label: 'Apply Loan',
    color: '#2563EB',
    bg: '#1E3A5F',
    title: 'Apply Loan',
    description: 'Apply for a new loan directly from the app.',
  },
  {
    icon: '📅',
    label: 'Repayment Schedule',
    color: '#7C3AED',
    bg: '#3B1F6E',
    title: 'Repayment Schedule',
    description: 'View your complete repayment schedule.',
  },
  {
    icon: '📊',
    label: 'EMI Details',
    color: '#0891B2',
    bg: '#134E5E',
    title: 'EMI Details',
    description: 'Check your EMI breakup and details.',
  },
  {
    icon: '💳',
    label: 'EMI Deposit',
    color: '#059669',
    bg: '#1A3C34',
    title: 'EMI Deposit',
    description: 'Make your EMI payment directly.',
  },
  {
    icon: '📑',
    label: 'Closer Statement',
    color: '#DC2626',
    bg: '#5C1A1A',
    title: 'Closer Statement',
    description: 'Download your loan closure statement.',
  },
  {
    icon: '📋',
    label: 'SOA',
    color: '#D97706',
    bg: '#5C3A0A',
    title: 'Statement of Account',
    description: 'Access your detailed statement of account.',
  },
];

export default function HomeScreen({ navigation }: Props) {
  const { theme, isDark, toggleTheme } = useTheme();
  const { colors, spacing } = theme;

  const greeting = useMemo(() => getGreeting(), []);

  const [profileOpen, setProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
    } catch {}
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  };

  const heroBg = isDark ? '#1E293B' : colors.primary;
  const heroDecor = isDark
    ? 'rgba(255,255,255,0.04)'
    : 'rgba(255,255,255,0.08)';

  const themed = createStyles(colors, spacing, heroBg, heroDecor);

  return (
    <View style={themed.root}>
      <ScrollView
        style={themed.flex}
        contentContainerStyle={themed.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={themed.hero}>
          <View style={themed.heroDecor1} />
          <View style={themed.heroDecor2} />
          <View style={themed.heroDecor3} />

          <View style={themed.topBar}>
            <Pressable
              onPress={() => setProfileOpen(true)}
              style={({ pressed }) => [
                themed.profileWrap,
                pressed && themed.profilePressed,
              ]}
            >
              <View style={themed.profileAvatar}>
                <Text style={themed.profileInitials}>JD</Text>
              </View>
              <View style={themed.profileBadge} />
            </Pressable>

            <Image
              source={logo}
              style={themed.topBarLogo}
              resizeMode="contain"
            />

            <Pressable
              onPress={toggleTheme}
              style={({ pressed }) => [
                themed.topBarBtn,
                pressed && themed.iconBtnPressed,
              ]}
            >
              <Text style={themed.topBarBtnIcon}>{isDark ? '🌞' : '🌙'}</Text>
            </Pressable>
          </View>

          <View style={themed.heroBody}>
            <Text style={themed.heroGreeting}>
              {greeting.emoji} {greeting.text}
            </Text>
            <Text style={themed.heroName}>John Doe</Text>
            <Text style={themed.heroSub}>
              Welcome to HMT Finance — your finance, simplified.
            </Text>
          </View>

          <View style={themed.statsRow}>
            <StatCard emoji="🏦" value="Active" label="Loan Status" />
            <StatCard emoji="📁" value="2" label="Total Loans" />
            <StatCard emoji="💳" value="₹12K" label="Next EMI" />
          </View>
        </View>

        <View style={themed.servicesSection}>
          <Text style={themed.sectionTitle}>Our Services</Text>
          <View style={themed.servicesGrid}>
            {SERVICES.map((service, index) => (
              <ServiceCard
                key={index}
                icon={service.icon}
                label={service.label}
                bg={service.bg}
                onPress={() => {
                  if (index === 0) {
                    navigation.navigate('ApplyLoan');
                  } else if (index === 1) {
                    navigation.navigate('RepaymentSchedule');
                  } else if (index === 2) {
                    navigation.navigate('EmiDetails');
                  } else if (index === 3) {
                    navigation.navigate('EmiDeposit');
                  } else {
                    navigation.navigate('Service', {
                      title: service.title,
                      icon: service.icon,
                      description: service.description,
                    });
                  }
                }}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <ProfileDrawerModal
        visible={profileOpen}
        onClose={() => setProfileOpen(false)}
        onNavigate={route => navigation.navigate(route)}
        onLogout={handleLogout}
      />
    </View>
  );
}
