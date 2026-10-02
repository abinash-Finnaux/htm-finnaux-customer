import React from 'react';
import {
  ActivityIndicator,
  Linking,
  Pressable,
  Text,
  View,
} from 'react-native';
import {
  Check,
  MapPin,
  Navigation2,
  Phone,
  RefreshCw,
} from 'lucide-react-native';

import { useTheme } from '../../../context/ThemeContext';
import { palette } from '../../../constants/colors';
import { formatDistance, type LatLong } from '../../../utils/geo';
import type { createStyles } from '../styles';
import type { RankedBranch } from '../../../hooks/useBranches';

import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import { openInMaps } from '../../../services/maps';

type Props = {
  themed: ReturnType<typeof createStyles>;
  branches: RankedBranch[];
  loading: boolean;
  coords: LatLong | null;
  fallbackCoords: boolean;
  gpsStatus?: string;
  onRetry?: () => void;
};

function formatCoord(value: number | undefined): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(6)
    : '—';
}

export default function SelectBranchStep({
  themed,
  branches,
  loading,
  coords,
  fallbackCoords,
  gpsStatus,
  onRetry,
}: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const nearest = branches[0] ?? null;
  console.log('nearestnearest', nearest);

  const callBranch = () => {
    const phone = nearest?.branch.Branch_PhoneNo?.trim();
    if (phone) {
      try {
        Linking.openURL(`tel:${phone}`);
      } catch (error) {
        console.log('[SelectBranchStep] call failed:', error);
      }
    }
  };

  return (
    <>
      <SectionHeaderText
        title="Nearest Branch"
        subtitle="We have picked the branch closest to you."
      />

      {/* {coords !== null ? (
        <View style={themed.branchDebugBox}>
          <View style={themed.branchDebugHeader}>
            <Text style={themed.branchDebugTitle}>
              Debug — Current Coordinates
            </Text>
            <Pressable
              onPress={() => openInMaps(coords)}
              style={({ pressed }) => [
                themed.branchDebugMapBtn,
                { opacity: pressed ? 0.6 : 1 },
              ]}
              hitSlop={6}
            >
              <Navigation2 size={14} color={colors.primary} />
            </Pressable>
          </View>
          <Text style={themed.branchDebugRow}>
            Latitude:{' '}
            <Text style={themed.branchDebugValue}>
              {formatCoord(coords.latitude)}
            </Text>
          </Text>
          <Text style={themed.branchDebugRow}>
            Longitude:{' '}
            <Text style={themed.branchDebugValue}>
              {formatCoord(coords.longitude)}
            </Text>
          </Text>
          <Text style={themed.branchDebugRow}>
            Source:{' '}
            <Text
              style={[
                themed.branchDebugValue,
                fallbackCoords
                  ? themed.branchDebugValueWarn
                  : themed.branchDebugValueOk,
              ]}
            >
              {fallbackCoords ? 'Fallback (test location)' : 'Real GPS'}
            </Text>
          </Text>
          {gpsStatus ? (
            <Text style={themed.branchDebugRow}>
              Reason:{' '}
              <Text
                style={[
                  themed.branchDebugValue,
                  fallbackCoords
                    ? themed.branchDebugValueWarn
                    : themed.branchDebugValueOk,
                ]}
              >
                {gpsStatus}
              </Text>
            </Text>
          ) : null}
          {nearest?.distanceKm != null ? (
            <Text style={themed.branchDebugRow}>
              Distance:{' '}
              <Text style={themed.branchDebugValue}>
                {nearest.roadDistanceKm != null
                  ? `${nearest.distanceText} by road · ${
                      nearest.straightDistanceKm != null
                        ? formatDistance(nearest.straightDistanceKm)
                        : '—'
                    } straight-line`
                  : `${nearest.distanceText} straight-line`}
              </Text>
            </Text>
          ) : null}
          {fallbackCoords && onRetry ? (
            <Pressable
              onPress={onRetry}
              style={({ pressed }) => [
                themed.branchRetryBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <RefreshCw size={13} color={colors.primary} />
              <Text style={themed.branchRetryBtnText}>
                {loading ? 'Locating…' : 'Retry with my location'}
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null} */}

      {loading && !nearest ? (
        <View style={themed.branchLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : nearest ? (
        <View style={themed.branchList}>
          <View style={themed.branchSingleNote}>
            <MapPin size={14} color={colors.success} />
            <Text style={themed.branchSingleNoteText}>
              Showing your nearest branch — it has been selected for you.
            </Text>
          </View>

          <View style={themed.branchCard}>
            <View style={themed.branchHero}>
              <View style={themed.branchHeroTopRow}>
                <Text style={themed.branchHeroLabel}>Nearest Branch</Text>
                <View style={themed.branchChipLight}>
                  <Check size={12} color="#FFFFFF" />
                  <Text style={themed.branchChipLightText}>Selected</Text>
                </View>
              </View>
              <Text style={themed.branchHeroTitle}>
                {nearest.branch.Branch_Name.trim()}
              </Text>
              {/* {nearest.distanceKm !== null ? (
                <View style={themed.branchHeroDistanceRow}>
                  <Navigation2 size={14} color="#FFFFFF" />
                  <Text style={themed.branchHeroDistance}>
                    {nearest.distanceText}
                  </Text>
                  <Text style={themed.branchHeroDistanceSub}>
                    {nearest.roadDistanceKm != null
                      ? 'by road · from your location'
                      : 'straight-line · from your location'}
                  </Text>
                </View>
              ) : null} */}
            </View>

            <View style={themed.branchBody}>
              <View style={themed.branchBodyRow}>
                <View style={themed.branchBodyRowIcon}>
                  <MapPin size={15} color={colors.primary} />
                </View>
                <Text style={themed.branchBodyRowText}>
                  {[nearest.branch.District_Name, nearest.branch.Tehsil_Name]
                    .filter(Boolean)
                    .join(' · ')}
                </Text>
              </View>
              {nearest.branch.Branch_PhoneNo ? (
                <View style={themed.branchBodyRow}>
                  <View style={themed.branchBodyRowIcon}>
                    <Phone size={15} color={colors.primary} />
                  </View>
                  <Text style={themed.branchBodyRowText}>
                    {nearest.branch.Branch_PhoneNo}
                  </Text>
                </View>
              ) : null}

              <View style={themed.branchDivider} />

              <View style={themed.branchActionRow}>
                <Pressable
                  onPress={() => {
                    const target = nearest.coords ?? coords;
                    if (target) {
                      openInMaps(target);
                    }
                  }}
                  style={({ pressed }) => [
                    themed.branchActionBtn,
                    themed.branchActionBtnPrimary,
                    { opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <Navigation2 size={15} color="#FFFFFF" />
                  <Text style={themed.branchActionBtnPrimaryText}>
                    Directions
                  </Text>
                </Pressable>
                {nearest.branch.Branch_PhoneNo ? (
                  <Pressable
                    onPress={callBranch}
                    style={({ pressed }) => [
                      themed.branchActionBtn,
                      themed.branchActionBtnGhost,
                      { opacity: pressed ? 0.7 : 1 },
                    ]}
                  >
                    <Phone size={15} color={palette.primary} />
                    <Text style={themed.branchActionBtnGhostText}>Call</Text>
                  </Pressable>
                ) : null}
              </View>
            </View>
          </View>
        </View>
      ) : (
        <Text style={[themed.branchListEmpty, { color: colors.textSecondary }]}>
          No branches found.
        </Text>
      )}
    </>
  );
}
