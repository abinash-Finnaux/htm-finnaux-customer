import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { useTheme } from '../../../context/ThemeContext';
import type { createStyles } from '../styles';
import type { LoanType } from '../loanTypes';

type Props = {
  value: string;
  onChange: (val: string) => void;
  themed: ReturnType<typeof createStyles>;
  loanTypes: LoanType[];
};

export default function LoanTypeSelector({
  value,
  onChange,
  themed,
  loanTypes,
}: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={themed.loanGrid}>
      {loanTypes.length === 0 && (
        <Text style={themed.loanGridEmpty}>
          No loan products available right now.
        </Text>
      )}
      {loanTypes.map(item => {
        const selected = value === item.id;
        return (
          <Pressable
            key={item.id}
            onPress={() => onChange(item.id)}
            style={({ pressed }) => [
              themed.loanCard,
              selected
                ? themed.loanCardSelected
                : pressed
                ? themed.loanCardPressed
                : themed.loanCardUnselected,
            ]}
          >
            <View
              style={[
                themed.loanIconWrap,
                {
                  backgroundColor: selected
                    ? 'rgba(255,255,255,0.2)'
                    : colors.border,
                },
              ]}
            >
              <item.icon size={26} color={selected ? '#FFFFFF' : colors.text} />
            </View>
            <Text
              style={[
                themed.loanLabel,
                { color: selected ? '#FFFFFF' : colors.text },
              ]}
            >
              {item.label}
            </Text>
            <Text
              style={[
                themed.loanRange,
                {
                  color: selected
                    ? 'rgba(255,255,255,0.8)'
                    : colors.textSecondary,
                },
              ]}
            >
              {item.range}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
