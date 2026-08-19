import React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import GlobalInputText from '../inputTexts/GlobalInputText';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  rules?: RegisterOptions<T>;
};

export default function FormInput<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rules,
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
          onChangeText={onChange}
          value={value}
          error={error?.message}
        />
      )}
    />
  );
}
