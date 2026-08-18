import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { useTheme } from '../context/ThemeContext';

type Props = {
  label?: string;
  value: Date | null;
  onChange: (date: Date) => void;
  error?: string;
  maximumDate?: Date;
  minimumDate?: Date;
};

function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export default function DateOfBirthInput({
  label = 'Date of Birth',
  value,
  onChange,
  error,
  maximumDate = new Date(),
  minimumDate,
}: Props) {
  const { theme } = useTheme();
  const { colors, radius } = theme;
  const [show, setShow] = useState(false);

  const handleChange = (_event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  const displayValue = value ? formatDate(value) : '';

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>
      <Pressable
        onPress={() => setShow(true)}
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.border,
            borderRadius: radius.md,
          },
        ]}
      >
        <Text
          style={[
            styles.inputText,
            { color: displayValue ? colors.text : colors.textSecondary },
          ]}
        >
          {displayValue || 'DD/MM/YYYY'}
        </Text>
        <Text style={[styles.calendarIcon, { color: colors.textSecondary }]}>
          📅
        </Text>
      </Pressable>
      {error ? (
        <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
      ) : null}
      {show && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleChange}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          themeVariant={theme.dark ? 'dark' : 'light'}
          {...(Platform.OS === 'ios' && {
            onDismiss: () => setShow(false),
          })}
        />
      )}
      {Platform.OS === 'ios' && show && (
        <Pressable
          onPress={() => setShow(false)}
          style={[
            styles.doneBtn,
            { backgroundColor: colors.primary, borderRadius: radius.sm },
          ]}
        >
          <Text style={[styles.doneBtnText, { color: colors.onPrimary }]}>
            Done
          </Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600' },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 16,
    marginTop: 8,
  },
  inputText: { fontSize: 15 },
  calendarIcon: { fontSize: 18 },
  errorText: { fontSize: 11, fontWeight: '500', marginTop: 6 },
  doneBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 8,
  },
  doneBtnText: { fontSize: 14, fontWeight: '600' },
});
