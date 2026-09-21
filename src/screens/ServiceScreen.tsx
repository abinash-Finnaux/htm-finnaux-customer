import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowLeft, Lightbulb } from 'lucide-react-native';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';
import ServiceCard from './home/_components/ServiceCard';
// import { SERVICES } from './home/HomeScreen';

type Props = NativeStackScreenProps<RootStackParamList, 'Service'>;
export const SERVICES = [
  {
    icon: '📝',
    label: 'Amortization',
    color: '#2563EB',
    bg: '#1E3A5F',
    title: 'Amortization',
    description:
      'View EMI-wise principal, interest, payment dates, and outstanding loan balance.',
  },
  // {
  //   icon: '📅',
  //   label: 'Repayment Schedule',
  //   color: '#7C3AED',
  //   bg: '#3B1F6E',
  //   title: 'Repayment Schedule',
  //   description: 'View your complete repayment schedule.',
  // },
  // {
  //   icon: '📊',
  //   label: 'EMI Details',
  //   color: '#0891B2',
  //   bg: '#134E5E',
  //   title: 'EMI Details',
  //   description: 'Check your EMI breakup and details.',
  // },
  // {
  //   icon: '💳',
  //   label: 'EMI Deposit',
  //   color: '#059669',
  //   bg: '#1A3C34',
  //   title: 'EMI Deposit',
  //   description: 'Make your EMI payment directly.',
  // },
  // {
  //   icon: '📑',
  //   label: 'Closer Statement',
  //   color: '#DC2626',
  //   bg: '#5C1A1A',
  //   title: 'Closer Statement',
  //   description: 'Download your loan closure statement.',
  // },
  // {
  //   icon: '📋',
  //   label: 'SOA',
  //   color: '#D97706',
  //   bg: '#5C3A0A',
  //   title: 'Statement of Account',
  //   description: 'Access your detailed statement of account.',
  // },
];

export default function ServiceScreen({ navigation, route }: Props) {
  const { title, icon, description } = route.params;
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius, typography } = theme;

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
            <ArrowLeft size={20} color="#FFFFFF" />
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
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Our Services
        </Text>
        <View style={styles.servicesGrid}>
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              label={service.label}
              bg={service.bg}
              onPress={() => {
                if (index === 0) {
                  navigation.navigate('Amortization');
                }
                // else if (index === 1) {
                //   navigation.navigate('RepaymentSchedule');
                // } else if (index === 2) {
                //   navigation.navigate('EmiDetails');
                // } else if (index === 3) {
                //   navigation.navigate('EmiDeposit');
                // } else if (index === 4) {
                //   navigation.navigate('CloserStatement');
                // } else if (index === 5) {
                //   navigation.navigate('SOA');
                // } else {
                //   navigation.navigate('Service', {
                //     title: service.title,
                //     icon: service.icon,
                //     description: service.description,
                //   });
                // }
              }}
            />
          ))}
        </View>
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
  heroWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 32,
    marginBottom: 16,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
