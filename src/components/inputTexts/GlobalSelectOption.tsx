import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  options: string[];
  value: string;
  onChange: (v: string) => void;
};

export default function GlobalSelectOption({
  options,
  value,
  onChange,
}: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <View style={styles.row}>
      {options.map(opt => {
        const selected = value === opt;
        return (
          <Pressable
            key={opt}
            onPress={() => onChange(opt)}
            style={({ pressed }) => [
              styles.chip,
              {
                backgroundColor: selected ? colors.primary + '12' : colors.surfaceElevated,
                borderColor: selected ? colors.primary : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: selected ? colors.primary : colors.text },
              ]}
            >
              {opt}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderWidth: 1.5,
    borderRadius: 12,
    overflow: 'hidden',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
