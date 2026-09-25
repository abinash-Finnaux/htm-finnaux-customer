import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { ChevronRight, MapPin, Phone, Search, Navigation2 } from 'lucide-react-native';
import { Controller, type Control } from 'react-hook-form';

import { useTheme } from '../../../context/ThemeContext';
import type { LatLong } from '../../../utils/geo';
import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';
import type { RankedBranch } from '../../../hooks/useBranches';

import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import { openInMaps } from '../../../services/maps';

type Props = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
  branches: RankedBranch[];
  loading: boolean;
  coords: LatLong | null;
  fallbackCoords: boolean;
};

function formatCoord(value: number | undefined): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? value.toFixed(6)
    : '—';
}

export default function SelectBranchStep({
  control,
  themed,
  branches,
  loading,
  coords,
  fallbackCoords,
}: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      return branches;
    }
    return branches.filter(item =>
      `${item.branch.Branch_Name} ${item.branch.District_Name} ${item.branch.Tehsil_Name}`
        .toLowerCase()
        .includes(q),
    );
  }, [branches, query]);

  return (
    <>
      <SectionHeaderText title="Select Branch" />

      <View style={themed.branchSearch}>
        <Search size={18} color={colors.textSecondary} />
        <TextInput
          style={themed.branchSearchInput}
          placeholder="Search branch by name or city..."
          placeholderTextColor={colors.textSecondary}
          value={query}
          onChangeText={setQuery}
        />
      </View>

      {coords !== null ? (
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
            Latitude:  <Text style={themed.branchDebugValue}>{formatCoord(coords.latitude)}</Text>
          </Text>
          <Text style={themed.branchDebugRow}>
            Longitude: <Text style={themed.branchDebugValue}>{formatCoord(coords.longitude)}</Text>
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
        </View>
      ) : null}

      {loading && branches.length === 0 ? (
        <View style={themed.branchLoading}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <Controller
          control={control}
          name="branchId"
          rules={{ required: 'Branch is required' }}
          render={({ field: { value, onChange } }) => (
            <View style={themed.branchList}>
              {filtered.length === 0 ? (
                <Text
                  style={[
                    themed.branchListEmpty,
                    { color: colors.textSecondary },
                  ]}
                >
                  No branches found.
                </Text>
              ) : (
                filtered.map((item, index) => {
                  const selected = value === String(item.branch.BranchId);
                  return (
                    <Pressable
                      key={item.branch.BranchId}
                      onPress={() => onChange(String(item.branch.BranchId))}
                      style={({ pressed }) => [
                        themed.branchCard,
                        selected
                          ? themed.branchCardSelected
                          : pressed
                          ? themed.branchCardPressed
                          : themed.branchCardUnselected,
                      ]}
                    >
                      <View
                        style={[
                          themed.branchIconWrap,
                          selected && themed.branchIconWrapSelected,
                        ]}
                      >
                        <MapPin
                          size={22}
                          color={selected ? '#FFFFFF' : colors.primary}
                        />
                      </View>

                      <View style={themed.branchInfo}>
                        <View style={themed.branchNameRow}>
                          <Text
                            style={[
                              themed.branchName,
                              { color: selected ? '#FFFFFF' : colors.text },
                            ]}
                          >
                            {item.branch.Branch_Name.trim()}
                          </Text>
                          {index === 0 && item.distanceKm !== null ? (
                            <View style={themed.branchNearestChip}>
                              <Text style={themed.branchNearestChipText}>
                                Nearest
                              </Text>
                            </View>
                          ) : null}
                        </View>
                        <Text
                          style={[
                            themed.branchMeta,
                            {
                              color: selected
                                ? 'rgba(255,255,255,0.85)'
                                : colors.textSecondary,
                            },
                          ]}
                        >
                          {[item.branch.District_Name, item.branch.Tehsil_Name]
                            .filter(Boolean)
                            .join(' · ')}
                        </Text>
                        {item.branch.Branch_PhoneNo ? (
                          <View style={themed.branchPhoneRow}>
                            <Phone
                              size={12}
                              color={
                                selected
                                  ? 'rgba(255,255,255,0.85)'
                                  : colors.textSecondary
                              }
                            />
                            <Text
                              style={[
                                themed.branchMeta,
                                {
                                  color: selected
                                    ? 'rgba(255,255,255,0.85)'
                                    : colors.textSecondary,
                                },
                              ]}
                            >
                              {item.branch.Branch_PhoneNo}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      <View style={themed.branchRight}>
                        {item.distanceKm !== null ? (
                          <Text
                            style={[
                              themed.branchDistance,
                              {
                                color: selected ? '#FFFFFF' : colors.primary,
                              },
                            ]}
                          >
                            {item.distanceText}
                          </Text>
                        ) : null}
                        {item.coords !== null ? (
                          <Pressable
                            onPress={e => {
                              e.stopPropagation();
                              openInMaps(item.coords!);
                            }}
                            style={({ pressed }) => [
                              themed.branchMapBtn,
                              selected
                                ? themed.branchMapBtnSelected
                                : themed.branchMapBtnUnselected,
                              { opacity: pressed ? 0.6 : 1 },
                            ]}
                            hitSlop={6}
                          >
                            <Navigation2
                              size={13}
                              color={
                                selected ? '#FFFFFF' : colors.primary
                              }
                            />
                          </Pressable>
                        ) : null}
                        <ChevronRight
                          size={16}
                          color={
                            selected
                              ? 'rgba(255,255,255,0.7)'
                              : colors.textSecondary
                          }
                        />
                      </View>
                    </Pressable>
                  );
                })
              )}
            </View>
          )}
        />
      )}
    </>
  );
}
