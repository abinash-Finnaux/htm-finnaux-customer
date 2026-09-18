import React, { useEffect } from 'react';
import { Text, View, Pressable, ScrollView } from 'react-native';
import { useForm } from 'react-hook-form';
import { RootStackParamList } from '../../../../App';
import { useTheme } from '../../../context/ThemeContext';
import {
  useUser,
  getInitials,
  type CustomerProfile,
} from '../../../context/UserContext';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { createStyles } from './styles';
import type { ProfileForm } from './_components/EditProfileModal';
import {
  formatDateToDDMMYYYY,
  maskPan,
  maskAadhaar,
} from '../../../utils/formatters';
import {
  ArrowLeft,
  Briefcase,
  Cake,
  CalendarDays,
  FileText,
  Heart,
  Home,
  IdCard,
  Landmark,
  Mail,
  MapPin,
  Smartphone,
  Tag,
  User,
  UserRound,
  Users,
  type LucideIcon,
} from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

function toFormValues(user: CustomerProfile | null): ProfileForm {
  return {
    fullName: user?.Customer_Name || '',
    email: user?.Customer_Email || '',
    phone: user?.Customer_PhoneNo || '',
    dob: user?.Customer_DOB || '',
    address1: user?.PresentAddress || '',
    address2: user?.PermanentAddress || '',
  };
}

type InfoRow = { label: string; value?: string; icon: LucideIcon };

function toPersonalRows(
  user: CustomerProfile | null,
  values: { fullName?: string; email?: string; phone?: string; dob?: string },
): InfoRow[] {
  return [
    { label: 'Full Name', value: values.fullName, icon: User },
    { label: 'Gender', value: user?.Customer_Gender, icon: UserRound },
    { label: 'Age', value: user?.Customer_Age, icon: Cake },
    {
      label: 'Date of Birth',
      value: formatDateToDDMMYYYY(values.dob),
      icon: CalendarDays,
    },
    { label: 'Relationship', value: user?.RelationName, icon: Users },
    {
      label: "Father's Name",
      value: user?.FatherName || undefined,
      icon: User,
    },
    { label: 'Religion', value: user?.Religion, icon: Landmark },
    { label: 'Caste', value: user?.Cast, icon: Tag },
    { label: 'Marital Status', value: user?.MaritalStatus, icon: Heart },
    {
      label: 'Occupation',
      value: user?.Occupation || user?.Nature_of_work,
      icon: Briefcase,
    },
    { label: 'Profile', value: user?.Profile, icon: IdCard },
    { label: 'Email', value: values.email, icon: Mail },
    { label: 'Phone', value: values.phone, icon: Smartphone },
  ];
}

function toDocumentRows(user: CustomerProfile | null): InfoRow[] {
  const seen = /pan|aadhaar|aadhar|uidai|customer id|cif/i;
  const rows: InfoRow[] = [
    { label: 'PAN Number', value: maskPan(user?.PAN), icon: IdCard },
    { label: 'Aadhaar', value: maskAadhaar(user?.Aadhaar), icon: IdCard },
    { label: 'Customer ID', value: user?.CIF, icon: Tag },
  ];

  (user?.documents ?? []).forEach((doc, index) => {
    const label =
      (doc.DocumentName as string) ||
      (doc.DocumentType as string) ||
      (doc.Doc_Name as string) ||
      (doc.Type as string) ||
      (doc.Name as string) ||
      `Document ${index + 1}`;
    const value =
      (doc.DocumentNo as string) ||
      (doc.DocumentNumber as string) ||
      (doc.Doc_No as string) ||
      (doc.Number as string) ||
      (doc.Value as string) ||
      '';

    if (seen.test(String(label))) {
      return;
    }
    rows.push({ label: String(label), value: String(value), icon: FileText });
  });

  return rows;
}

export default function ProfileScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;
  const { user } = useUser();

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const { watch, reset } = useForm<ProfileForm>({
    defaultValues: toFormValues(user),
  });

  useEffect(() => {
    reset(toFormValues(user));
  }, [user, reset]);

  const formFullName = watch('fullName');
  const formEmail = watch('email');

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
            <ArrowLeft size={20} color="#FFFFFF" />
          </Pressable>
          <Text style={themed.topTitle}>My Profile</Text>
          <View style={{ width: 40, height: 40 }} />
        </View>

        <View style={themed.headerBody}>
          <View style={themed.avatarRing}>
            <View style={themed.avatar}>
              <Text style={themed.avatarText}>
                {getInitials(formFullName || user?.Customer_Name)}
              </Text>
            </View>
          </View>
          <Text style={themed.headerName}>
            {formFullName || user?.Customer_Name || 'Customer'}
          </Text>
          <Text style={themed.headerEmail}>{formEmail}</Text>
          <Text style={themed.headerSub}>Customer ID: {user?.CIF || '—'}</Text>
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
            {toPersonalRows(user, {
              fullName: formFullName,
              email: formEmail,
              phone: watch('phone'),
              dob: watch('dob'),
            }).map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={themed.cardDivider} />}
                <View style={themed.cardRow}>
                  <item.icon
                    size={20}
                    color={colors.textSecondary}
                    style={{ width: 36, marginRight: 8 }}
                  />
                  <View style={themed.cardInfo}>
                    <Text style={themed.cardLabel}>{item.label}</Text>
                    <Text style={themed.cardValue}>{item.value || '—'}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>

          <Text style={themed.sectionTitle}>Documents</Text>
          <View style={themed.card}>
            {toDocumentRows(user).map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={themed.cardDivider} />}
                <View style={themed.cardRow}>
                  <item.icon
                    size={20}
                    color={colors.textSecondary}
                    style={{ width: 36, marginRight: 8 }}
                  />
                  <View style={themed.cardInfo}>
                    <Text style={themed.cardLabel}>{item.label}</Text>
                    <Text style={themed.cardValue}>{item.value || '—'}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>

          <Text style={themed.sectionTitle}>Address</Text>
          <View style={[themed.card, themed.cardAddress]}>
            <View style={themed.addressRow}>
              <MapPin
                size={20}
                color={colors.textSecondary}
                style={{ width: 36, marginRight: 8 }}
              />
              <View style={themed.cardInfo}>
                <Text style={themed.cardLabel}>Present Address</Text>
                <Text style={themed.cardValue}>{watch('address1') || '—'}</Text>
              </View>
            </View>
            <View style={themed.addressDivider} />
            <View style={themed.addressRow}>
              <Home
                size={20}
                color={colors.textSecondary}
                style={{ width: 36, marginRight: 8 }}
              />
              <View style={themed.cardInfo}>
                <Text style={themed.cardLabel}>Permanent Address</Text>
                <Text style={themed.cardValue}>{watch('address2') || '—'}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={themed.bottomSpacer} />
      </ScrollView>

      {/* <EditProfileModal
        visible={editVisible}
        onClose={() => setEditVisible(false)}
        onSave={handleSave}
        control={control}
      /> */}
    </View>
  );
}
