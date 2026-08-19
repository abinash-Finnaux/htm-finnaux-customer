import React from 'react';
import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form';
import GlobalDateOfBirthInput from '../datePickers/GlobalDateOfBirthInput';

type Props<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  rules?: RegisterOptions<T>;
  maximumDate?: Date;
  minimumDate?: Date;
};

export default function FormDateOfBirthInput<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  maximumDate,
  minimumDate,
}: Props<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <GlobalDateOfBirthInput
          label={label}
          value={value}
          onChange={onChange}
          error={error?.message}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
        />
      )}
    />
  );
}
