import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../context/ThemeContext';
import type { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'Profile'>;

export default function ProfileScreen({ navigation }: Props) {
  const { theme, isDark } = useTheme();
  const { colors, spacing, radius } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;
  const decorBg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.08)';

  const [editVisible, setEditVisible] = useState(false);
  const [form, setForm] = useState({
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+91 98765 43210',
    dob: '15 Jan 1990',
    address1: '123, MG Road, Andheri West',
    address2: 'Mumbai, Maharashtra - 400053',
  });

  const updateField = (key: string, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setEditVisible(false);
    Alert.alert('Saved', 'Profile updated successfully.');
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: headerBg }]}>
        <View style={[styles.decor1, { backgroundColor: decorBg }]} />
        <View style={[styles.decor2, { backgroundColor: decorBg }]} />
        <View style={[styles.decor3, { backgroundColor: decorBg }]} />

        <View style={styles.topBar}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={styles.backBtnText}>←</Text>
          </Pressable>
          <Text style={styles.topTitle}>My Profile</Text>
          <Pressable
            onPress={() => setEditVisible(!editVisible)}
            style={({ pressed }) => [styles.backBtn, { opacity: pressed ? 0.6 : 1 }]}
          >
            <Text style={[styles.backBtnText, { transform: [{ rotate: editVisible ? '45deg' : '0deg' }] }]}>
              ✎
            </Text>
          </Pressable>
        </View>

        <View style={styles.headerBody}>
          <View style={styles.avatarRing}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
          </View>
          <Text style={styles.headerName}>{form.fullName}</Text>
          <Text style={styles.headerEmail}>{form.email}</Text>
          <Text style={styles.headerSub}>Customer ID: HMT-2024-001</Text>
        </View>
      </View>

      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: spacing.lg }}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Personal Information
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.lg }]}>
            {[
              { label: 'Email', value: form.email, icon: '✉️' },
              { label: 'Phone', value: form.phone, icon: '📱' },
              { label: 'Date of Birth', value: form.dob, icon: '🎂' },
            ].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />}
                <View style={styles.cardRow}>
                  <Text style={styles.cardIcon}>{item.icon}</Text>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                    <Text style={[styles.cardValue, { color: colors.text }]}>{item.value}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Documents
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.lg }]}>
            {[
              { label: 'PAN Number', value: 'ABCDE1234F', icon: '🪪' },
              { label: 'Aadhaar', value: 'XXXX XXXX 6789', icon: '🪪' },
              { label: 'Customer ID', value: 'HMT-2024-001', icon: '🔖' },
            ].map((item, i) => (
              <React.Fragment key={i}>
                {i > 0 && <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />}
                <View style={styles.cardRow}>
                  <Text style={styles.cardIcon}>{item.icon}</Text>
                  <View style={styles.cardInfo}>
                    <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{item.label}</Text>
                    <Text style={[styles.cardValue, { color: colors.text }]}>{item.value}</Text>
                  </View>
                </View>
              </React.Fragment>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { color: colors.textSecondary, marginTop: spacing.xl, marginBottom: spacing.sm }]}>
            Address
          </Text>
          <View style={[styles.card, { backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.lg, padding: spacing.lg }]}>
            <View style={styles.cardRow}>
              <Text style={styles.cardIcon}>📍</Text>
              <View style={styles.cardInfo}>
                <Text style={[styles.cardValue, { color: colors.text }]}>{form.address1}</Text>
                <Text style={[styles.cardValue, { color: colors.text, marginTop: 2 }]}>{form.address2}</Text>
              </View>
            </View>
          </View> 
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={styles.modalOverlayBg}>
            <Pressable style={styles.modalOverlayTap} onPress={() => setEditVisible(false)} />
            <View style={[styles.modalSheet, { backgroundColor: colors.background }]}>
            <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />

            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
              <Pressable onPress={() => setEditVisible(false)} style={styles.modalCloseBtn}>
                <Text style={[styles.modalCloseText, { color: colors.textSecondary }]}>✕</Text>
              </Pressable>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Full Name</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.md }]}
                value={form.fullName}
                onChangeText={v => updateField('fullName', v)}
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Email</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.md }]}
                value={form.email}
                onChangeText={v => updateField('email', v)}
                keyboardType="email-address"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Phone</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.md }]}
                value={form.phone}
                onChangeText={v => updateField('phone', v)}
                keyboardType="phone-pad"
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Date of Birth</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.md }]}
                value={form.dob}
                onChangeText={v => updateField('dob', v)}
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Address Line 1</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.md }]}
                value={form.address1}
                onChangeText={v => updateField('address1', v)}
                placeholderTextColor={colors.textSecondary}
              />

              <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Address Line 2</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.surfaceElevated, borderColor: colors.border, borderRadius: radius.md }]}
                value={form.address2}
                onChangeText={v => updateField('address2', v)}
                placeholderTextColor={colors.textSecondary}
              />

              <View style={{ height: 20 }} />
            </ScrollView>

            <View style={styles.modalFooter}>
              <Pressable
                onPress={() => setEditVisible(false)}
                style={({ pressed }) => [styles.cancelBtn, { borderColor: colors.border, opacity: pressed ? 0.6 : 1 }]}
              >
                <Text style={[styles.cancelBtnText, { color: colors.text }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [styles.saveBtn, { backgroundColor: headerBg, opacity: pressed ? 0.8 : 1 }]}
              >
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: 56, paddingBottom: 28, paddingHorizontal: 24,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden',
  },
  decor1: { position: 'absolute', top: -40, right: -30, width: 160, height: 160, borderRadius: 80 },
  decor2: { position: 'absolute', bottom: 10, left: -50, width: 120, height: 120, borderRadius: 60 },
  decor3: { position: 'absolute', top: 30, right: 80, width: 60, height: 60, borderRadius: 30 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: { width: 40, height: 40, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  backBtnText: { color: '#FFFFFF', fontSize: 18, fontWeight: '600' },
  topTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: '700' },
  headerBody: { alignItems: 'center', marginTop: 20 },
  avatarRing: { width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)', padding: 3 },
  avatar: { flex: 1, borderRadius: 38, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFFFFF', fontSize: 28, fontWeight: '800' },
  headerName: { color: '#FFFFFF', fontSize: 22, fontWeight: '700', marginTop: 12 },
  headerEmail: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 3 },
  headerSub: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 },
  flex: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  sectionTitle: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  card: { borderWidth: 1, overflow: 'hidden' },
  cardRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  cardIcon: { fontSize: 20, width: 36 },
  cardInfo: { flex: 1 },
  cardLabel: { fontSize: 11, fontWeight: '500' },
  cardValue: { fontSize: 15, fontWeight: '600', marginTop: 2 },
  cardDivider: { height: 1, marginHorizontal: 16 },
  infoBanner: { flexDirection: 'row', alignItems: 'flex-start', borderWidth: 1, padding: 16 },
  infoIcon: { fontSize: 18 },
  infoText: { flex: 1, fontSize: 13, lineHeight: 20, marginLeft: 8 },

  modalOverlay: { flex: 1, justifyContent: 'flex-end' },
  modalOverlayBg: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalOverlayTap: { flex: 1 },
  modalSheet: { borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '85%' },
  modalHandle: { width: 40, height: 4, borderRadius: 2, alignSelf: 'center', marginTop: 12 },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, paddingTop: 20, paddingBottom: 12 },
  modalTitle: { fontSize: 20, fontWeight: '700' },
  modalCloseBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.06)', justifyContent: 'center', alignItems: 'center' },
  modalCloseText: { fontSize: 16, fontWeight: '600' },
  modalBody: { paddingHorizontal: 24 },
  fieldLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, marginTop: 16, marginBottom: 6 },
  input: { borderWidth: 1, paddingHorizontal: 16, paddingVertical: 14, fontSize: 15, fontWeight: '500' },
  modalFooter: { flexDirection: 'row', padding: 24, gap: 12 },
  cancelBtn: { flex: 1, borderWidth: 1.5, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { fontSize: 15, fontWeight: '600' },
  saveBtn: { flex: 1.5, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  saveBtnText: { color: '#FFFFFF', fontSize: 15, fontWeight: '700' },
});
