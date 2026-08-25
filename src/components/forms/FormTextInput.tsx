import React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import type { TextInputProps } from 'react-native';
import GlobalInputText from '../inputTexts/GlobalInputText';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
  formatText?: (text: string) => string;
  backgroundColor?: string;
} & Pick<
  TextInputProps,
  | 'keyboardType'
  | 'maxLength'
  | 'autoComplete'
  | 'autoCapitalize'
  | 'secureTextEntry'
  | 'multiline'
  | 'textAlignVertical'
  | 'numberOfLines'
>;

export default function FormTextInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rules,
  formatText,
  backgroundColor,
  keyboardType,
  maxLength,
  autoComplete,
  autoCapitalize,
  secureTextEntry,
  multiline,
  textAlignVertical,
  numberOfLines,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <GlobalInputText
          label={label}
          placeholder={placeholder}
          onBlur={onBlur}
          onChangeText={(text) => onChange(formatText ? formatText(text) : text)}
          value={value}
          error={error?.message}
          backgroundColor={backgroundColor}
          keyboardType={keyboardType}
          maxLength={maxLength}
          autoComplete={autoComplete}
          autoCapitalize={autoCapitalize}
          secureTextEntry={secureTextEntry}
          multiline={multiline}
          textAlignVertical={textAlignVertical}
          numberOfLines={numberOfLines}
        />
      )}
    />
  );
}
