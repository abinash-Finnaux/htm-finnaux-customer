import React, { useState } from 'react';
import {
  Text,
  View,
  Alert,
  Pressable,
  ScrollView,
} from 'react-native';
import { useForm } from 'react-hook-form';
import { RootStackParamList } from '../../../../App';
import { useTheme } from '../../../context/ThemeContext';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { createStyles } from './styles';
import EditProfileModal, {
  type ProfileForm,
} from './_components/EditProfileModal';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const [editVisible, setEditVisible] = useState(false);

  const { control, watch } = useForm<ProfileForm>({
    defaultValues: {
      fullName: 'John Doe',
      email: 'john.doe@email.com',
      phone: '+91 98765 43210',
      dob: '15 Jan 1990',
      address1: '123, MG Road, Andheri West',
      address2: 'Mumbai, Maharashtra - 400053',
    },
  });

  const formFullName = watch('fullName');
  const formEmail = watch('email');

  const handleSave = () => {
    setEditVisible(false);
    Alert.alert('Saved', 'Profile updated successfully.');
  };

  const themed = createStyles(colors, spacing, radius, headerBg, decorBg);

  return (
    <View style={themed.root}>
      <View style={themed.header}>
        <View style={themed.decor1} />
        <View style={themed.decor2} />
        <View style={themed.decor3} />

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
          <Text style={themed.topTitle}>My Profile</Text>
          <Pressable
            onPress={() => setEditVisible(!editVisible)}
            style={({ pressed }) => [
              themed.backBtn,
              { opacity: pressed ? 0.6 : 1 },
            ]}
          >
            <Text style={editVisible ? themed.editIconActive : themed.editIcon}>
              ✎
            </Text>
          </Pressable>
        </View>

        <View style={themed.headerBody}>
          <View style={themed.avatarRing}>
            <View style={themed.avatar}>
              <Text style={themed.avatarText}>JD</Text>
            </View>
          </View>
          <Text style={themed.headerName}>{formFullName}</Text>
          <Text style={themed.headerEmail}>{formEmail}</Text>
          <Text style={themed.headerSub}>Customer ID: HMT-2024-001</Text>
        </View>
      </View>

      <ScrollView
        style={themed.flex}
        contentContainerStyle={themed.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={themed.contentPad}>
          <Text style={themed.sectionTitle}>Personal Information</Text>
          <View style={themed.card}>
            {[
              { label: 'Email', value: watch('email'), icon: '✉️' },
              { label: 'Phone', value: watch('phone'), icon: '📱' },
              { label: 'Date of Birth', value: watch('dob'), icon: '🎂' },
            ].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={themed.cardDivider} />}
                <View style={themed.cardRow}>
                  <Text style={themed.cardIcon}>{item.icon}</Text>
                  <View style={themed.cardInfo}>
                    <Text style={themed.cardLabel}>{item.label}</Text>
                    <Text style={themed.cardValue}>{item.value}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>

          <Text style={themed.sectionTitle}>Documents</Text>
          <View style={themed.card}>
            {[
              { label: 'PAN Number', value: 'ABCDE1234F', icon: '🪪' },
              { label: 'Aadhaar', value: 'XXXX XXXX 6789', icon: '🪪' },
              { label: 'Customer ID', value: 'HMT-2024-001', icon: '🔖' },
            ].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={themed.cardDivider} />}
                <View style={themed.cardRow}>
                  <Text style={themed.cardIcon}>{item.icon}</Text>
                  <View style={themed.cardInfo}>
                    <Text style={themed.cardLabel}>{item.label}</Text>
                    <Text style={themed.cardValue}>{item.value}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>

          <Text style={themed.sectionTitle}>Address</Text>
          <View style={[themed.card, themed.cardAddress]}>
            <View style={themed.cardRow}>
              <Text style={themed.cardIcon}>📍</Text>
              <View style={themed.cardInfo}>
                <Text style={themed.cardValue}>{watch('address1')}</Text>
                <Text style={themed.cardValue}>{watch('address2')}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={themed.bottomSpacer} />
      </ScrollView>

      <EditProfileModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onSave={handleSave}
        control={control}
      />
    </View>
  );
}
