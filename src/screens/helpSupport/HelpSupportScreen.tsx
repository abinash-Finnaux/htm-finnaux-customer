import React from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import type { RootStackParamList } from '../../../App';

import { createStyles } from './styles';
import ContactCard from './_components/ContactCard';
import FaqCard from './_components/FaqCard';

type Props = NativeStackScreenProps<RootStackParamList, 'HelpSupport'>;

const FAQS = [
  {
    q: 'How do I check my EMI schedule?',
    a: 'Go to Our Services → EMI Details to view your complete EMI breakup.',
  },
  {
    q: 'How can I make an early payment?',
    a: 'Navigate to EMI Deposit and choose the prepayment option.',
  },
  {
    q: 'How do I download my loan statement?',
    a: 'Go to SOA or Loan Account Statement from the services section.',
  },
];

export default function HelpSupportScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
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
          <Text style={themed.topTitle}>Help & Support</Text>
          <View style={themed.topSpacer} />
        </View>
        <View style={themed.headerBody}>
          <Text style={themed.headerIcon}>❓</Text>
          <Text style={themed.headerLabel}>How can we help?</Text>
        </View>
      </View>

      <ScrollView
        style={themed.flex}
        contentContainerStyle={themed.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={themed.contactRow}>
          <ContactCard
            icon="📞"
            label="Call Us"
            sub="1800-123-456"
            bg={colors.primary}
            onPress={() => Linking.openURL('tel:+911800123456')}
          />

          <ContactCard
            icon="💬"
            label="WhatsApp"
            sub="Chat with us"
            bg="#22C55E"
            onPress={() => Linking.openURL('https://wa.me/919876543210')}
          />
        </View>

        <Text style={themed.sectionLabel}>Frequently Asked Questions</Text>

        {FAQS.map((faq, index) => (
          <FaqCard key={index} question={faq.q} answer={faq.a} />
        ))}

        <View style={themed.infoCard}>
          <Text style={themed.infoIcon}>💡</Text>
          <Text style={themed.infoText}>
            Our support team is available Monday to Saturday, 9:00 AM to 6:00
            PM.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
