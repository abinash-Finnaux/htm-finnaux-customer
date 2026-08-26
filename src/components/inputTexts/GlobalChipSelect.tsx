import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext';

type Props = {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
};

export default function GlobalChipSelect({
  options,
  value,
  onChange,
  suffix,
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
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.chipValue,
                { color: selected ? colors.primary : colors.text },
              ]}
            >
              {opt}
            </Text>
            {suffix ? (
              <Text
                style={[
                  styles.chipSuffix,
                  {
                    color: selected
                      ? colors.primary
                      : colors.textSecondary,
                  },
                ]}
              >
                {suffix}
              </Text>
            ) : null}
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
    flex: 1,
    minWidth: 60,
    borderWidth: 1.5,
    paddingVertical: 14,
    alignItems: 'center',
    overflow: 'hidden',
    borderRadius: 12,
  },
  chipValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  chipSuffix: {
    fontSize: 10,
    fontWeight: '500',
    marginTop: 2,
  },
});
