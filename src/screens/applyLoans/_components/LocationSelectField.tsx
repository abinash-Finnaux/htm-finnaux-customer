import React, { useState } from 'react';
import { Controller, type Control, type RegisterOptions } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { ChevronDown, MapPin } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import ModalPicker from './ModalPicker';
import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';

type LocationName = 'assets.regState' | 'assets.regDistrict' | 'assets.regTehsil';

type Props<TName extends LocationName> = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
  name: TName;
  label: string;
  placeholder: string;
  options: string[];
  pickerTitle: string;
  disabledHint?: string;
  rules?: RegisterOptions<ApplyLoanForm, TName>;
  onSelect?: (value: string) => void;
  onDisabledPress?: () => void;
};

export default function LocationSelectField<TName extends LocationName>({
  control,
  themed,
  name,
  label,
  placeholder,
  options,
  pickerTitle,
  disabledHint,
  rules,
  onSelect,
  onDisabledPress,
}: Props<TName>) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [visible, setVisible] = useState(false);

  const disabled = options.length === 0;

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { value, onChange }, fieldState: { error } }) => {
        const selected = value ?? '';
        const handlePress = () => {
          if (disabled) {
            onDisabledPress?.();
            return;
          }
          setVisible(true);
        };
        return (
          <View style={themed.locWrap}>
            <Text style={themed.locLabel}>{label}</Text>
            <Pressable
              onPress={handlePress}
              disabled={disabled}
              style={({ pressed }) => [
                themed.locBox,
                error && themed.locBoxError,
                disabled && themed.locBoxDisabled,
                pressed && themed.locBoxPressed,
              ]}
            >
              <MapPin
                size={16}
                color={disabled ? colors.textSecondary : colors.primary}
              />
              <Text
                style={
                  selected
                    ? themed.locValue
                    : themed.locPlaceholder
                }
                numberOfLines={1}
              >
                {selected || (disabled ? disabledHint ?? placeholder : placeholder)}
              </Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </Pressable>
            {error ? (
              <Text style={themed.locError}>{error.message}</Text>
            ) : null}

            <ModalPicker
              visible={visible}
              title={pickerTitle}
              options={options}
              value={selected}
              onSelect={option => {
                onChange(option);
                onSelect?.(option);
              }}
              onClose={() => setVisible(false)}
              themed={themed}
            />
          </View>
        );
      }}
    />
  );
}