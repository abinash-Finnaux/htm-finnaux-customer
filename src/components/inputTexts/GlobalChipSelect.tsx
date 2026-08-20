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
                backgroundColor: selected ? selectedBg : colors.surfaceElevated,
                borderColor: selected ? selectedBg : colors.border,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            {selected && (
              <View style={styles.tick}>
                <Text style={styles.tickText}>✓</Text>
              </View>
            )}
            <Text
              style={[
                styles.chipValue,
                { color: selected ? '#FFFFFF' : colors.text },
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
                      ? 'rgba(255,255,255,0.7)'
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
  tick: {
    position: 'absolute',
    top: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  tickText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#1E293B',
  },
});
