import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { MapPin } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { useAddress } from '../../../hooks/useAddress';
import type { LatLong } from '../../../utils/geo';
import type { createStyles } from '../styles';

type Props = {
  themed: ReturnType<typeof createStyles>;
  coords: LatLong | null;
};

export default function CurrentAddress({ themed, coords }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const { address, loading } = useAddress(coords);

  return (
    <View style={themed.currentAddressRow}>
      <MapPin size={13} color={colors.primary} />
      {loading ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <Text style={themed.currentAddressText}>
          {address ? address : 'Unable to fetch current address.'}
        </Text>
      )}
    </View>
  );
}