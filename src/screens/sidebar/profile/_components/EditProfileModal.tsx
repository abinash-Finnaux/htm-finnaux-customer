import React from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { Control } from 'react-hook-form';
import FormTextInput from '../../../../components/forms/FormTextInput';
import { useTheme } from '../../../../context/ThemeContext';

export type ProfileForm = {
  fullName: string;
  email: string;
  phone: string;
  dob: string;
  address1: string;
  address2: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onSave: () => void;
  control: Control<ProfileForm>;
};

export default function EditProfileModal({
  visible,
  onClose,
  onSave,
  control,
}: Props) {
  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const headerBg = isDark ? '#1E293B' : colors.primary;

  const themed = createStyles(colors, headerBg);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        style={themed.modalOverlay}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={themed.modalOverlayBg}>
          <Pressable style={themed.modalOverlayTap} onPress={onClose} />
          <View style={themed.modalSheet}>
            <View style={themed.modalHandle} />

            <View style={themed.modalHeader}>
              <Text style={themed.modalTitle}>Edit Profile</Text>
              <Pressable onPress={onClose} style={themed.modalCloseBtn}>
                <Text style={themed.modalCloseText}>✕</Text>
              </Pressable>
            </View>

            <ScrollView
              style={themed.modalBody}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              <FormTextInput
                control={control}
                name="fullName"
                label="Full Name"
              />

              <FormTextInput
                control={control}
                name="email"
                label="Email"
                keyboardType="email-address"
              />

              <FormTextInput
                control={control}
                name="phone"
                label="Phone"
                keyboardType="phone-pad"
              />

              <FormTextInput control={control} name="dob" label="Date of Birth" />

              <FormTextInput
                control={control}
                name="address1"
                label="Address Line 1"
              />

              <FormTextInput
                control={control}
                name="address2"
                label="Address Line 2"
              />

              <View style={themed.modalBottomSpacer} />
            </ScrollView>

            <View style={themed.modalFooter}>
              <Pressable
                onPress={onClose}
                style={({ pressed }) => [
                  themed.cancelBtn,
                  { opacity: pressed ? 0.6 : 1 },
                ]}
              >
                <Text style={themed.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={onSave}
                style={({ pressed }) => [
                  themed.saveBtn,
                  { opacity: pressed ? 0.8 : 1 },
                ]}
              >
                <Text style={themed.saveBtnText}>Save Changes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

function createStyles(
  colors: ReturnType<typeof useTheme>['theme']['colors'],
  headerBg: string,
) {
  return StyleSheet.create({
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalOverlayBg: {
      flex: 1,
      justifyContent: 'flex-end',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalOverlayTap: {
      flex: 1,
    },
    modalSheet: {
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      maxHeight: '85%',
      backgroundColor: colors.background,
    },
    modalHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      alignSelf: 'center',
      marginTop: 12,
      backgroundColor: colors.border,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 12,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: colors.text,
    },
    modalCloseBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: 'rgba(0,0,0,0.06)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalCloseText: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.textSecondary,
    },
    modalBody: {
      paddingHorizontal: 24,
    },
    modalBottomSpacer: {
      height: 20,
    },
    modalFooter: {
      flexDirection: 'row',
      padding: 24,
      gap: 12,
    },
    cancelBtn: {
      flex: 1,
      borderWidth: 1.5,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
      borderColor: colors.border,
    },
    cancelBtnText: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
    },
    saveBtn: {
      flex: 1.5,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
      backgroundColor: headerBg,
    },
    saveBtnText: {
      color: '#FFFFFF',
      fontSize: 15,
      fontWeight: '700',
    },
  });
}
