import React from 'react';
import { Text, View, Pressable } from 'react-native';
import { Briefcase, CarFront, Home, User } from 'lucide-react-native';
import type { LucideIcon } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import type { createStyles } from '../styles';

const LOAN_TYPES: {
  id: string;
  label: string;
  icon: LucideIcon;
  range: string;
}[] = [
  { id: 'personal', label: 'Personal Loan', icon: User, range: '₹50K - ₹5L' },
  {
    id: 'business',
    label: 'Business Loan',
    icon: Briefcase,
    range: '₹1L - ₹25L',
  },
  { id: 'home', label: 'Home Loan', icon: Home, range: '₹10L - ₹1Cr' },
  { id: 'vehicle', label: 'Vehicle Loan', icon: CarFront, range: '₹2L - ₹15L' },
];

type Props = {
  value: string;
  onChange: (val: string) => void;
  themed: ReturnType<typeof createStyles>;
};

export default function LoanTypeSelector({ value, onChange, themed }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={themed.loanGrid}>
      {LOAN_TYPES.map(item => {
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
            {/* {selected && (
              <View style={themed.cardTick}>
                <Text style={themed.cardTickText}>✓</Text>
              </View>
            )} */}
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
              <item.icon
                size={26}
                color={selected ? '#FFFFFF' : colors.text}
              />
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
