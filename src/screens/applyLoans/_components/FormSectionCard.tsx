import React from 'react';
import { Text, View } from 'react-native';
import type { TextStyle, ViewStyle } from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import type { createStyles } from '../styles';

type Themed = ReturnType<typeof createStyles>;

type Accent = 'blue' | 'amber' | 'violet' | 'emerald' | 'sky';

type AccentStyle =
  | 'accHeadIconBlue'
  | 'accHeadIconAmber'
  | 'accHeadIconViolet'
  | 'accHeadIconEmerald'
  | 'accHeadIconSky'
  | 'accStepNumBlue'
  | 'accStepNumAmber'
  | 'accStepNumViolet'
  | 'accStepNumEmerald'
  | 'accStepNumSky';

const ACCENTS: Record<
  Accent,
  { iconTile: AccentStyle; num: AccentStyle; icon: string }
> = {
  blue: { iconTile: 'accHeadIconBlue', num: 'accStepNumBlue', icon: '#2563EB' },
  amber: {
    iconTile: 'accHeadIconAmber',
    num: 'accStepNumAmber',
    icon: '#D97706',
  },
  violet: {
    iconTile: 'accHeadIconViolet',
    num: 'accStepNumViolet',
    icon: '#7C3AED',
  },
  emerald: {
    iconTile: 'accHeadIconEmerald',
    num: 'accStepNumEmerald',
    icon: '#059669',
  },
  sky: { iconTile: 'accHeadIconSky', num: 'accStepNumSky', icon: '#0284C7' },
};

export function SectionCard({
  themed,
  children,
}: {
  themed: Themed;
  children: React.ReactNode;
}) {
  return <View style={themed.accCard}>{children}</View>;
}

export function CardHead({
  step,
  title,
  subtitle,
  themed,
  right,
  icon: Icon,
  accent = 'blue',
}: {
  step: string;
  title: string;
  subtitle?: string;
  themed: Themed;
  right?: React.ReactNode;
  icon?: LucideIcon;
  accent?: Accent;
}) {
  const accentStyles = ACCENTS[accent];

  return (
    <View style={themed.accCardHead}>
      {Icon ? (
        <View
          style={[themed.accHeadIcon, themed[accentStyles.iconTile] as ViewStyle]}
        >
          <Icon size={19} color={accentStyles.icon} />
        </View>
      ) : (
        <View style={themed.accStepBadge}>
          <Text style={themed.accStepBadgeText}>{step}</Text>
        </View>
      )}
      <View style={themed.accCardHeadBody}>
        <Text style={themed.accCardTitle}>{title}</Text>
        {(Icon || subtitle) ? (
          <View style={themed.accCardHeadMeta}>
            {Icon ? (
              <Text style={[themed.accStepNum, themed[accentStyles.num] as TextStyle]}>
                STEP {step}
              </Text>
            ) : null}
            {subtitle ? (
              <Text numberOfLines={1} style={themed.accCardSub}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        ) : null}
      </View>
      {right}
    </View>
  );
}