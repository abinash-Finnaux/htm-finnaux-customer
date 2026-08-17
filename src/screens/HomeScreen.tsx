import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';
import logo from '../assets/images/logo.png';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const SLIDE_WIDTH = Dimensions.get('window').width * 0.72;

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
  const { colors, spacing, radius, typography } = theme;

  const greeting = useMemo(() => getGreeting(), []);

  const [profileOpen, setProfileOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SLIDE_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const openProfile = () => {
    setProfileOpen(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeProfile = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SLIDE_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => setProfileOpen(false));
  };

  const handleLogout = async () => {
    closeProfile();
    setTimeout(async () => {
      try {
        await AsyncStorage.clear();
      } catch {}
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    }, 260);
  };

  const heroBg = isDark ? '#1E293B' : colors.primary;
  const heroDecor = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';
  const heroStatBg = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.15)';

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.hero, { backgroundColor: heroBg }]}>
          <View style={[styles.heroDecor1, { backgroundColor: heroDecor }]} />
          <View style={[styles.heroDecor2, { backgroundColor: heroDecor }]} />
          <View style={[styles.heroDecor3, { backgroundColor: heroDecor }]} />

          <View style={styles.topBar}>
            <Pressable
              onPress={openProfile}
              style={({ pressed }) => [styles.profileWrap, { opacity: pressed ? 0.7 : 1 }]}
            >
              <View style={styles.profileAvatar}>
                <Text style={styles.profileInitials}>JD</Text>
              </View>
              <View style={[styles.profileBadge, { borderColor: heroBg }]} />
            </Pressable>

            <Image source={logo} style={styles.topBarLogo} resizeMode="contain" />

            <Pressable
              onPress={toggleTheme}
              style={({ pressed }) => [
                styles.topBarBtn,
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <Text style={styles.topBarBtnIcon}>{isDark ? '🌞' : '🌙'}</Text>
            </Pressable>
          </View>

          <View style={styles.heroBody}>
            <Text style={styles.heroGreeting}>
              {greeting.emoji} {greeting.text}
            </Text>
            <Text style={styles.heroName}>John Doe</Text>
            <Text style={styles.heroSub}>
              Welcome to HMT Finance — your finance, simplified.
            </Text>
          </View>

          <View style={styles.statsRow}>
            <View style={[styles.statCard, { backgroundColor: heroStatBg }]}>
              <Text style={styles.statEmoji}>🏦</Text>
              <Text style={styles.statVal}>Active</Text>
              <Text style={styles.statLbl}>Loan Status</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: heroStatBg }]}>
              <Text style={styles.statEmoji}>📁</Text>
              <Text style={styles.statVal}>2</Text>
              <Text style={styles.statLbl}>Total Loans</Text>
            </View>
            <View style={[styles.statCard, { backgroundColor: heroStatBg }]}>
              <Text style={styles.statEmoji}>💳</Text>
              <Text style={styles.statVal}>₹12K</Text>
              <Text style={styles.statLbl}>Next EMI</Text>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: spacing.lg }}>
          <Text
            style={[
              styles.sectionTitle,
              {
                color: colors.text,
                marginTop: spacing.xl,
                marginBottom: spacing.md,
              },
            ]}
          >
            Our Services
          </Text>

          <View style={styles.servicesGrid}>
            {SERVICES.map((service, index) => (
              <Pressable
                key={index}
                onPress={() => {
                  if (index === 0) {
                    navigation.navigate('ApplyLoan');
                  } else {
                    navigation.navigate('Service', {
                      title: service.title,
                      icon: service.icon,
                      description: service.description,
                    });
                  }
                }}
                style={({ pressed }) => [
                  styles.serviceCard,
                  {
                    backgroundColor: service.bg,
                    borderRadius: radius.lg,
                    opacity: pressed ? 0.85 : 1,
                  },
                ]}
              >
                <View style={styles.serviceIconWrap}>
                  <Text style={styles.serviceIcon}>{service.icon}</Text>
                </View>

                <Text style={styles.serviceLabel} numberOfLines={2}>
                  {service.label}
                </Text>

                <View style={styles.serviceFooter}>
                  <View style={styles.serviceDivider} />
                  <View style={styles.serviceFooterRow}>
                    <Text style={styles.serviceHint}>Open</Text>
                    <View style={styles.serviceArrow}>
                      <Text style={styles.serviceArrowText}>→</Text>
                    </View>
                  </View>
                </View>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={profileOpen}
        onRequestClose={closeProfile}
        animationType="none"
      >
        <Pressable style={styles.drawerRoot} onPress={closeProfile}>
          <Animated.View
            style={[styles.drawerOverlayVisual, { opacity: overlayAnim }]}
            pointerEvents="none"
          />

          <Animated.View
            onStartShouldSetResponder={() => true}
            style={[
              styles.drawerPanel,
              {
                backgroundColor: colors.surface,
                transform: [{ translateX: slideAnim }],
              },
            ]}
          >
              <View style={[styles.drawerHeader, { backgroundColor: heroBg }]}>
                <View style={styles.drawerAvatar}>
                  <Text style={styles.drawerAvatarText}>JD</Text>
                </View>
                <Text style={styles.drawerName}>John Doe</Text>
                <Text style={styles.drawerEmail}>john.doe@email.com</Text>
                <Text style={styles.drawerPhone}>+91 98765 43210</Text>
              </View>

              <View style={styles.drawerBody}>
                <TouchableOpacity
                  style={styles.drawerItem}
                  activeOpacity={0.6}
                  onPress={() => {
                    closeProfile();
                    setTimeout(() => navigation.navigate('Profile'), 260);
                  }}
                >
                  <Text style={styles.drawerItemIcon}>👤</Text>
                  <Text style={[styles.drawerItemLabel, { color: colors.text }]}>
                    My Profile
                  </Text>
                  <Text style={[styles.drawerItemArrow, { color: colors.textSecondary }]}>
                    ›
                  </Text>
                </TouchableOpacity>

                {[
                  { icon: '🏦', label: 'My Loans', route: 'MyLoans' as const },
                  { icon: '💳', label: 'Payment History', route: 'PaymentHistory' as const },
                  { icon: '⚙️', label: 'Settings', route: 'Settings' as const },
                  { icon: '❓', label: 'Help & Support', route: 'HelpSupport' as const },
                ].map((item, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.drawerItem}
                    activeOpacity={0.6}
                    onPress={() => {
                      closeProfile();
                      setTimeout(() => navigation.navigate(item.route), 260);
                    }}
                  >
                    <Text style={styles.drawerItemIcon}>{item.icon}</Text>
                    <Text style={[styles.drawerItemLabel, { color: colors.text }]}>
                      {item.label}
                    </Text>
                    <Text style={[styles.drawerItemArrow, { color: colors.textSecondary }]}>
                      ›
                    </Text>
                  </TouchableOpacity>
                ))}

                <View style={[styles.drawerDivider, { backgroundColor: colors.border }]} />

                <TouchableOpacity
                  style={styles.drawerItem}
                  activeOpacity={0.6}
                  onPress={handleLogout}
                >
                  <Text style={styles.drawerItemIcon}>🚪</Text>
                  <Text style={[styles.drawerItemLabel, { color: '#EF4444' }]}>
                    Logout
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.drawerFooter}>
                <Text style={[styles.drawerFooterText, { color: colors.textSecondary }]}>
                  v1.0.0
                </Text>
              </View>
            </Animated.View>
          </Pressable>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    paddingTop: 56,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  heroDecor1: {
    position: 'absolute',
    top: -60,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  heroDecor2: {
    position: 'absolute',
    bottom: 20,
    left: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  heroDecor3: {
    position: 'absolute',
    top: 40,
    right: 60,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileWrap: {
    position: 'relative',
  },
  profileAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  profileInitials: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  profileBadge: {
    position: 'absolute',
    bottom: 0,
    right: -1,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
  },
  topBarLogo: {
    width: 120,
    height: 32,
    tintColor: '#FFFFFF',
  },
  topBarBtn: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBarBtnIcon: {
    fontSize: 18,
  },
  heroBody: {
    marginTop: 28,
  },
  heroGreeting: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
  },
  heroName: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 4,
  },
  heroSub: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
    marginTop: 6,
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  statLbl: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  servicesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  serviceCard: {
    width: '30.6%', padding: 12, alignItems: 'center',
  },
  serviceIconWrap: {
    width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  serviceIcon: { fontSize: 24 },
  serviceLabel: { fontSize: 12, fontWeight: '800', lineHeight: 17, color: '#FFFFFF', textAlign: 'center' },
  serviceFooter: { marginTop: 'auto', paddingTop: 12, alignSelf: 'stretch' },
  serviceDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginBottom: 8 },
  serviceFooterRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  serviceHint: { fontSize: 10, fontWeight: '600', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5 },
  serviceArrow: { width: 26, height: 26, borderRadius: 13, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  serviceArrowText: { fontSize: 14, fontWeight: '800', color: '#FFFFFF' },
  drawerRoot: {
    flex: 1,
  },
  drawerOverlayVisual: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  drawerPanel: {
    width: SLIDE_WIDTH,
    height: '100%',
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  drawerHeader: {
    paddingTop: 56,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  drawerAvatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.4)',
    marginBottom: 14,
  },
  drawerAvatarText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
  },
  drawerName: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  drawerEmail: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
  },
  drawerPhone: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 2,
  },
  drawerBody: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 8,
  },
  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  drawerItemIcon: {
    fontSize: 20,
    width: 32,
  },
  drawerItemLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  drawerItemArrow: {
    fontSize: 20,
    fontWeight: '300',
  },
  drawerDivider: {
    height: 1,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  drawerFooter: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  drawerFooterText: {
    fontSize: 12,
  },
});
