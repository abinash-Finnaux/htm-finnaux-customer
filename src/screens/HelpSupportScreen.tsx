import React from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpSupport'>;

const FAQS = [
  { q: 'How do I check my EMI schedule?', a: 'Go to Our Services → EMI Details to view your complete EMI breakup.' },
  { q: 'How can I make an early payment?', a: 'Navigate to EMI Deposit and choose the prepayment option.' },
  { q: 'How do I download my loan statement?', a: 'Go to SOA or Loan Account Statement from the services section.' },
];

export default function HelpSupportScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

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
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.topTitle}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.headerBody}>
          <Text style={styles.headerIcon}>❓</Text>
          <Text style={styles.headerLabel}>How can we help?</Text>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={[styles.content, { padding: spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.contactRow}>
          <Pressable
            style={({ pressed }) => [
              styles.contactCard,
              {
                backgroundColor: colors.primary,
                borderRadius: radius.lg,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={() => Linking.openURL('tel:+911800123456')}
          >
            <Text style={styles.contactIcon}>📞</Text>
            <Text style={styles.contactLabel}>Call Us</Text>
            <Text style={styles.contactSub}>1800-123-456</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.contactCard,
              {
                backgroundColor: '#22C55E',
                borderRadius: radius.lg,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
            onPress={() => Linking.openURL('https://wa.me/919876543210')}
          >
            <Text style={styles.contactIcon}>💬</Text>
            <Text style={styles.contactLabel}>WhatsApp</Text>
            <Text style={styles.contactSub}>Chat with us</Text>
          </Pressable>
        </View>

        <Text style={[styles.sectionLabel, { color: colors.textSecondary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
          Frequently Asked Questions
        </Text>

        {FAQS.map((faq, index) => (
          <View
            key={index}
            style={[
              styles.faqCard,
              {
                backgroundColor: colors.surfaceElevated,
                borderColor: colors.border,
                borderRadius: radius.md,
                padding: spacing.lg,
              },
            ]}
          >
            <Text style={[styles.faqQ, { color: colors.text }]}>{faq.q}</Text>
            <Text style={[styles.faqA, { color: colors.textSecondary, marginTop: spacing.xs }]}>{faq.a}</Text>
          </View>
        ))}

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
          <Text style={[styles.infoText, { color: colors.text, marginTop: spacing.xs }]}>
            Our support team is available Monday to Saturday, 9:00 AM to 6:00 PM.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: 56, paddingBottom: 28, paddingHorizontal: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden',
  },
  decor1: { position: 'absolute', top: -40, right: -30, width: 140, height: 140, borderRadius: 70 },
  decor2: { position: 'absolute', bottom: 10, left: -40, width: 100, height: 100, borderRadius: 50 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { color: '#FFFFFF', fontSize: 20, fontWeight: '600' },
  topTitle: { color: 'rgba(255,255,255,0.8)', fontSize: 16, fontWeight: '600' },
  headerBody: { alignItems: 'center', marginTop: 20 },
  headerIcon: { fontSize: 36 },
  headerLabel: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 10 },
  flex: { flex: 1 },
  content: { paddingBottom: 40 },
  contactRow: { flexDirection: 'row', gap: 12 },
  contactCard: { flex: 1, alignItems: 'center', paddingVertical: 20, paddingHorizontal: 12 },
  contactIcon: { fontSize: 28, marginBottom: 8 },
  contactLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  contactSub: { color: 'rgba(255,255,255,0.75)', fontSize: 11, marginTop: 3 },
  sectionLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  faqCard: { borderWidth: 1, marginBottom: 10 },
  faqQ: { fontSize: 14, fontWeight: '700' },
  faqA: { fontSize: 13, lineHeight: 20 },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1 },
  infoIcon: { fontSize: 18 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20 },
});
