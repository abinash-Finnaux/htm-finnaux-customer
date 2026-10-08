import React from 'react';
import { Text, View, Pressable } from 'react-native';
import type { createStyles } from '../styles';
import type { LoanType } from '../loanTypes';

type Props = {
  value: string;
  onChange: (val: string) => void;
  themed: ReturnType<typeof createStyles>;
  loanTypes: LoanType[];
};

type LoanAccentKey =
  | 'loanTileBlue'
  | 'loanTileEmerald'
  | 'loanTileAmber'
  | 'loanTileViolet'
  | 'loanTileSky';
type LoanTextKey =
  | 'loanTextBlue'
  | 'loanTextEmerald'
  | 'loanTextAmber'
  | 'loanTextViolet'
  | 'loanTextSky';

type Accent = { tile: LoanAccentKey; text: LoanTextKey; color: string };

function accentFor(category: string): Accent {
  const c = category.toLowerCase();
  if (/gold/.test(c)) {
    return { tile: 'loanTileAmber', text: 'loanTextAmber', color: '#D97706' };
  }
  if (/vehicle|car|bike/.test(c)) {
    return {
      tile: 'loanTileEmerald',
      text: 'loanTextEmerald',
      color: '#0D9488',
    };
  }
  if (/property|home/.test(c)) {
    return { tile: 'loanTileBlue', text: 'loanTextBlue', color: '#2563EB' };
  }
  if (/single|installment/.test(c)) {
    return { tile: 'loanTileSky', text: 'loanTextSky', color: '#0284C7' };
  }
  return { tile: 'loanTileViolet', text: 'loanTextViolet', color: '#7C3AED' };
}

export default function LoanTypeSelector({
  value,
  onChange,
  themed,
  loanTypes,
}: Props) {
  return (
    <View style={themed.loanGrid}>
      {loanTypes.length === 0 && (
        <Text style={themed.loanListEmpty}>
          No loan products available right now.
        </Text>
      )}
      {loanTypes.map(item => {
        const selected = value === item.id;
        const accent = accentFor(item.category);
        return (
          <Pressable
            key={item.id}
            onPress={() => onChange(item.id)}
            style={({ pressed }) => [
              themed.loanGridCard,
              selected
                ? themed.loanCardSelected
                : pressed
                ? themed.loanCardPressed
                : themed.loanCardUnselected,
            ]}
          >
            <View
              style={[
                themed.loanIdChip,
                selected && themed.loanIdChipSelected,
              ]}
            >
              <Text
                style={[
                  themed.loanIdChipText,
                  selected && themed.loanIdChipTextSelected,
                ]}
              >
                {`#${item.productId}`}
              </Text>
            </View>

            <View
              style={[
                themed.loanIconWrap,
                selected
                  ? themed.loanIconWrapSelected
                  : themed[accent.tile],
              ]}
            >
              <item.icon
                size={26}
                color={selected ? '#FFFFFF' : accent.color}
              />
            </View>

            <Text
              numberOfLines={1}
              style={[themed.loanGridLabel, selected && themed.loanGridLabelSelected]}
            >
              {item.label}
            </Text>
            <Text
              numberOfLines={1}
              style={[themed.loanGridMeta, selected && themed.loanGridMetaSelected]}
            >
              {item.category}
            </Text>

            <View
              style={[
                themed.loanRangePill,
                themed.loanRangePillGrid,
                selected ? themed.loanRangePillSelected : themed[accent.tile],
              ]}
            >
              <Text
                style={[
                  themed.loanRangeText,
                  selected
                    ? themed.loanRangeTextSelected
                    : themed[accent.text],
                ]}
              >
                {item.range}
              </Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}