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
  const { theme, isDark } = useTheme();
  const { colors } = theme;
  const selectedBg = isDark ? '#1E293B' : colors.primary;

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
                backgroundColor: selected ? selectedBg : colors.surface,
                borderColor: selected ? selectedBg : colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            {selected && (
              <View style={styles.tick}>
                <Text style={[styles.tickText, { color: selectedBg }]}>✓</Text>
              </View>
            )}
            <Text
              style={[
                styles.chipText,
                { color: selected ? '#FFFFFF' : colors.text },
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
  tick: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 12,
    height: 12,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  tickText: {
    fontSize: 9,
    fontWeight: '800',
  },
});
