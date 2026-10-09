import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Controller,
  useWatch,
  type Control,
  UseFormSetValue,
} from 'react-hook-form';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  Building,
  Camera,
  CloudUpload,
  Eye,
  FileText,
  Info,
  LocateFixed,
  PiggyBank,
  Plus,
  Ruler,
  ShieldCheck,
  Tags,
  X,
} from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import FormTextInput from '../../../components/forms/FormTextInput';
import FormSelectOption from '../../../components/forms/FormSelectOption';
import ImagePreviewModal from './ImagePreviewModal';
import LocationSelectField from './LocationSelectField';
import { CardHead } from './FormSectionCard';
import { useLocations } from '../../../hooks/useLocations';
import { useCommonMasterOptions } from '../../../hooks/useCommonMasterOptions';
import { useCollectionExecutives } from '../../../hooks/useCollectionExecutives';
import { getCurrentPosition } from '../../../services/location';
import type { createStyles } from '../styles';
import type { ApplyLoanForm, AssetInfo, UploadedDocument } from '../types';

const FALLBACK_PROPERTY_TYPES = [
  'Residential',
  'Commercial',
  'Agricultural',
  'Industrial',
  'Mixed Use',
];

const FALLBACK_NATURE_OF_PROPERTY = [
  'Freehold',
  'Leasehold',
  'With Encumbrance',
  'Under Litigation',
  'Joint Ownership',
];

const FALLBACK_OWNERSHIP_DOCUMENTS = [
  'Sale Deed',
  'Gift Deed',
  'Registered Lease Deed',
  'Partition Deed',
  'Will / Succession',
  'Government Allotment',
];

const FALLBACK_OWNERSHIP_TYPES = [
  'Single',
  'Joint',
  'HUF',
  'Partnership Firm',
  'Pvt. Ltd. Company',
  'Trust',
];

const FALLBACK_MORTGAGE_SIGNED_BY = [
  'Self / Property Owner',
  'Co-Owner',
  'Spouse',
  'Relative',
  'Guarantor',
  'Other',
];

const AREA_RE = /^[0-9]+(\.[0-9]{1,2})?$/;

const formatDecimal = (text: string) =>
  text
    .replace(/[^0-9.]/g, '')
    .replace(/(\..*)\./g, '$1')
    .slice(0, 12);

const formatWhole = (text: string) => text.replace(/[^0-9]/g, '').slice(0, 12);

const formatCersai = (text: string) =>
  text
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 20);

const formatCoord = (text: string) =>
  text
    .replace(/[^0-9.-]/g, '')
    .replace(/(\..*)\./g, '$1')
    .slice(0, 12);

type Props = {
  control: Control<ApplyLoanForm>;
  setValue: UseFormSetValue<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
  assets: AssetInfo;
  branchId: string;
  productId: number | null;
};

export default function AssetsStep({
  control,
  setValue,
  themed,
  assets,
  branchId,
  productId,
}: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const assetsWatch = useWatch({ control, name: 'assets' });

  const progressChip = (names: (keyof AssetInfo)[], total: number) => {
    const filled = names.filter(name =>
      Boolean((assetsWatch as AssetInfo | undefined)?.[name]),
    ).length;
    const done = filled >= total;
    return (
      <View style={[themed.accChip, done && themed.accChipOk]}>
        <Text style={[themed.accChipText, done && themed.accChipTextOk]}>
          {done ? 'Done' : `${filled}/${total}`}
        </Text>
      </View>
    );
  };

  const assetsValues = assetsWatch as AssetInfo | undefined;
  const totalArea = assetsValues?.totalArea
    ? `${assetsValues.totalArea}${
        assetsValues.unitOfMeasurement
          ? ` ${assetsValues.unitOfMeasurement}`
          : ''
      }`
    : '—';
  const valuationValue = assetsValues?.estimatedValue
    ? Number(assetsValues.estimatedValue)
    : 0;
  const valuation =
    valuationValue > 0 ? `₹${valuationValue.toLocaleString('en-IN')}` : '—';

  const [locLoading, setLocLoading] = useState(false);
  const [locNote, setLocNote] = useState<string | null>(null);
  const autoLocRef = useRef(false);
  const assetsRef = useRef(assets);
  assetsRef.current = assets;

  const fetchCurrentLocation = useCallback(
    async (onlyIfEmpty: boolean = false) => {
      setLocLoading(true);
      setLocNote('Fetching your current location…');
      const result = await getCurrentPosition();
      if (result.status === 'ok') {
        const alreadyFilled =
          assetsRef.current.latitude !== '' ||
          assetsRef.current.longitude !== '';
        if (onlyIfEmpty && alreadyFilled) {
          setLocNote('Coordinates already present — kept existing values.');
          setLocLoading(false);
          return;
        }
        setValue('assets.latitude', result.coords.latitude.toFixed(6), {
          shouldValidate: true,
          shouldDirty: true,
        });
        setValue('assets.longitude', result.coords.longitude.toFixed(6), {
          shouldValidate: true,
          shouldDirty: true,
        });
        setLocNote(
          result.accuracy != null
            ? `Location captured (accuracy \u00b1${Math.round(
                result.accuracy,
              )} m).`
            : 'Location captured successfully.',
        );
      } else if (result.status === 'denied') {
        setLocNote(
          'Location permission denied. Allow permission or enter the coordinates manually.',
        );
      } else {
        setLocNote('Could not fetch location. Enter the coordinates manually.');
      }
      setLocLoading(false);
    },
    [setValue],
  );

  useEffect(() => {
    if (autoLocRef.current) {
      return;
    }
    autoLocRef.current = true;
    if (assets.latitude === '' && assets.longitude === '') {
      fetchCurrentLocation(true);
    }
  }, [assets.latitude, assets.longitude, fetchCurrentLocation]);

  const {
    states,
    statesLoading,
    statesError,
    loadStates,
    districts,
    districtsLoading,
    districtsError,
    loadDistricts,
    tehsils,
    tehsilsLoading,
    tehsilsError,
    loadTehsils,
  } = useLocations();

  const { options: propertyTypes } = useCommonMasterOptions(
    'TYPE OF PROPERTY',
    FALLBACK_PROPERTY_TYPES,
  );
  const { options: natureOfProperties } = useCommonMasterOptions(
    'NATURE OF PROPERTY',
    FALLBACK_NATURE_OF_PROPERTY,
  );
  const { options: ownershipDocuments } = useCommonMasterOptions(
    'OWNERSHIP DOCUMENT',
    FALLBACK_OWNERSHIP_DOCUMENTS,
  );
  const { options: ownershipTypes } = useCommonMasterOptions(
    'OWNERSHIP TYPE',
    FALLBACK_OWNERSHIP_TYPES,
  );
  const { options: mortgageSignedByOptions } = useCollectionExecutives(
    branchId,
    productId,
    FALLBACK_MORTGAGE_SIGNED_BY,
  );

  const tehsilOptions = tehsils.map(t => t.name);
  const districtOptions = districts.map(d => d.name);

  const handleStateSelect = (stateName: string) => {
    const state = states.find(s => s.name === stateName);
    const newStateId = state?.id ?? '';
    setValue('assets.regState', stateName);
    setValue('assets.regStateID', newStateId);
    setValue('assets.regDistrict', '');
    setValue('assets.regDistrictID', '');
    setValue('assets.regTehsil', '');
    setValue('assets.regTehsilID', '');
    if (newStateId) {
      loadDistricts(newStateId);
    }
  };

  const handleDistrictSelect = (districtName: string) => {
    const district = districts.find(d => d.name === districtName);
    const newDistrictId = district?.id ?? '';
    setValue('assets.regDistrict', districtName);
    setValue('assets.regDistrictID', newDistrictId);
    setValue('assets.regTehsil', '');
    setValue('assets.regTehsilID', '');
    if (newDistrictId) {
      loadTehsils(newDistrictId);
    }
  };

  const handleTehsilSelect = (tehsilName: string) => {
    const tehsil = tehsils.find(t => t.name === tehsilName);
    setValue('assets.regTehsil', tehsilName);
    setValue('assets.regTehsilID', tehsil?.id ?? '');
  };

  const pickImage = (onChange: (doc: UploadedDocument | null) => void) => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        selectionLimit: 1,
        includeBase64: false,
      },
      response => {
        if (response.didCancel || response.errorCode) {
          return;
        }
        const asset = response.assets?.[0];
        if (!asset?.uri) {
          return;
        }
        onChange({
          key: 'property',
          uri: asset.uri,
          fileName: asset.fileName || 'property.jpg',
          size: asset.fileSize ?? 0,
          mime: asset.type,
        });
      },
    );
  };

  return (
    <>
      <View style={themed.accHero}>
        <View style={themed.accHeroDecor1} />
        <View style={themed.accHeroDecor2} />
        <View style={themed.accHeroTop}>
          <View style={themed.accHeroIcon}>
            <PiggyBank size={22} color="#FFFFFF" />
          </View>
          <View style={themed.accHeroBody}>
            <Text style={themed.accHeroTitle}>Property Collateral</Text>
            <Text style={themed.accHeroText}>
              The property you provide strengthens your application and supports
              your loan amount.
            </Text>
          </View>
        </View>
        <View style={themed.accHeroChips}>
          <View style={themed.accHeroChip}>
            <LocateFixed size={12} color="#FFFFFF" />
            <Text style={themed.accHeroChipText}>Live GPS</Text>
          </View>
          <View style={themed.accHeroChip}>
            <Camera size={12} color="#FFFFFF" />
            <Text style={themed.accHeroChipText}>Photo evidence</Text>
          </View>
        </View>
      </View>

      <View style={themed.accStatRow}>
        <View style={themed.accStatTile}>
          <Text style={themed.accStatLabel}>Total Area</Text>
          <Text style={themed.accStatValue}>{totalArea}</Text>
        </View>
        <View style={themed.accStatTile}>
          <Text style={themed.accStatLabel}>Est. Valuation</Text>
          <Text style={[themed.accStatValue, themed.accStatValueEm]}>
            {valuation}
          </Text>
        </View>
      </View>

      <View style={themed.accCard}>
        <CardHead
          step="01"
          title="Property Details"
          subtitle="As per registered records"
          themed={themed}
          icon={Building}
          accent="blue"
          right={progressChip(
            [
              'propertyOwnerName',
              'propertyAddress',
              'regState',
              'regDistrict',
              'regTehsil',
              'pincode',
            ],
            6,
          )}
        />

        <FormTextInput
          control={control}
          name="assets.propertyOwnerName"
          label="Property Owner Name *"
          placeholder="Enter owner name as per records"
          rules={{ required: 'Owner name is required' }}
          autoCapitalize="words"
          autoCorrect={false}
        />

        <FormTextInput
          control={control}
          name="assets.propertyAddress"
          label="Property Address *"
          placeholder="Full address of the property"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          rules={{ required: 'Property address is required' }}
        />

        <LocationSelectField
          control={control}
          themed={themed}
          name="assets.regState"
          label="State *"
          placeholder="Select state"
          options={states.map(s => s.name)}
          pickerTitle="Select State"
          disabledHint={statesLoading ? 'Loading…' : 'Select state'}
          onSelect={handleStateSelect}
          onDisabledPress={statesError ? loadStates : undefined}
          rules={{ required: 'State is required' }}
        />
        <LocationSelectField
          control={control}
          themed={themed}
          name="assets.regDistrict"
          label="District *"
          placeholder="Select district"
          options={districtOptions}
          pickerTitle="Select District"
          disabledHint={
            districtsLoading
              ? 'Loading districts…'
              : districtsError
              ? 'Tap to retry'
              : assets?.regState
              ? 'No districts available'
              : 'Select state first'
          }
          onSelect={handleDistrictSelect}
          onDisabledPress={
            districtsError && assets?.regStateID
              ? () => loadDistricts(assets.regStateID)
              : undefined
          }
          rules={{ required: 'District is required' }}
        />

        <LocationSelectField
          control={control}
          themed={themed}
          name="assets.regTehsil"
          label="Reg Tehsil *"
          placeholder="Select tehsil"
          options={tehsilOptions}
          pickerTitle="Select Tehsil"
          disabledHint={
            tehsilsLoading
              ? 'Loading…'
              : tehsilsError
              ? 'Tap to retry'
              : assets?.regDistrict
              ? 'No tehsils available'
              : 'Select district first'
          }
          onSelect={handleTehsilSelect}
          onDisabledPress={
            tehsilsError && assets?.regDistrictID
              ? () => loadTehsils(assets.regDistrictID)
              : undefined
          }
          rules={{ required: 'Tehsil is required' }}
        />

        <FormTextInput
          control={control}
          name="assets.pincode"
          label="Pincode *"
          placeholder="6-digit pincode"
          keyboardType="numeric"
          maxLength={6}
          formatText={formatWhole}
          rules={{
            required: 'Pincode is required',
            pattern: {
              value: /^[0-9]{6}$/,
              message: 'Enter a valid 6-digit pincode',
            },
          }}
        />
      </View>

      <View style={themed.accCard}>
        <CardHead
          step="02"
          title="Property Classification"
          subtitle="How the property is used and held"
          themed={themed}
          icon={Tags}
          accent="amber"
          right={progressChip(
            [
              'propertyType',
              'natureOfProperty',
              'ownershipDocument',
              'ownershipType',
            ],
            4,
          )}
        />

        <FormSelectOption
          control={control}
          name="assets.propertyType"
          label="Property Type *"
          options={propertyTypes}
          rules={{ required: 'Select property type' }}
        />

        <FormSelectOption
          control={control}
          name="assets.natureOfProperty"
          label="Nature of Property *"
          options={natureOfProperties}
          rules={{ required: 'Select nature of property' }}
        />

        <FormSelectOption
          control={control}
          name="assets.ownershipDocument"
          label="Ownership Document *"
          options={ownershipDocuments}
          rules={{ required: 'Select ownership document' }}
        />

        <FormSelectOption
          control={control}
          name="assets.ownershipType"
          label="Ownership Type *"
          options={ownershipTypes}
          rules={{ required: 'Select ownership type' }}
        />
      </View>

      <View style={themed.accCard}>
        <CardHead
          step="03"
          title="Property Measurement"
          subtitle="Land and built-up areas"
          themed={themed}
          icon={Ruler}
          accent="emerald"
          right={progressChip(['unitOfMeasurement', 'totalArea'], 2)}
        />

        <FormSelectOption
          control={control}
          name="assets.unitOfMeasurement"
          label="Unit of Measurement *"
          options={['Sq. Ft.', 'Sq. Yards', 'Sq. Meter', 'Hectare']}
          rules={{ required: 'Select unit of measurement' }}
        />

        <FormTextInput
          control={control}
          name="assets.totalArea"
          label="Total Area *"
          placeholder="e.g. 1200"
          keyboardType="decimal-pad"
          formatText={formatDecimal}
          rules={{
            required: 'Total area is required',
            pattern: {
              value: AREA_RE,
              message: 'Enter a valid area',
            },
            validate: value =>
              Number(value) > 0 || 'Enter a value greater than 0',
          }}
        />

        <FormTextInput
          control={control}
          name="assets.constructedArea"
          label="Constructed Area"
          placeholder="Built-up / covered area"
          keyboardType="decimal-pad"
          formatText={formatDecimal}
          rules={{
            pattern: { value: AREA_RE, message: 'Enter a valid area' },
            validate: value =>
              value === '' ||
              Number(value) > 0 ||
              'Enter a value greater than 0',
          }}
        />

        <View style={themed.areaGrid}>
          {(
            [
              ['assets.frontArea', 'Front Area'],
              ['assets.backArea', 'Back Area'],
              ['assets.leftArea', 'Left Area'],
              ['assets.rightArea', 'Right Area'],
            ] as const
          ).map(([name, label]) => (
            <View key={name} style={themed.areaCol}>
              <FormTextInput
                control={control}
                name={name}
                label={label}
                placeholder="0"
                keyboardType="decimal-pad"
                formatText={formatDecimal}
                rules={{
                  pattern: { value: AREA_RE, message: 'Invalid' },
                  validate: value =>
                    value === '' ||
                    Number(value) > 0 ||
                    'Enter a value greater than 0',
                }}
              />
            </View>
          ))}
        </View>
      </View>

      <View style={themed.accCard}>
        <CardHead
          step="04"
          title="Mortgage Details"
          subtitle="Security, signing authority and valuation"
          themed={themed}
          icon={FileText}
          accent="violet"
          right={progressChip(
            ['mortgageType', 'mortgageSignedBy', 'estimatedValue'],
            3,
          )}
        />

        <FormSelectOption
          control={control}
          name="assets.mortgageType"
          label="Type Of Mortgage *"
          options={['Registered', 'Equitable', 'Other']}
          rules={{ required: 'Select type of mortgage' }}
        />

        <FormSelectOption
          control={control}
          name="assets.mortgageSignedBy"
          label="Mortgage Signed By *"
          options={mortgageSignedByOptions}
          rules={{ required: 'Select who signed the mortgage' }}
        />

        <FormTextInput
          control={control}
          name="assets.cersaiNo"
          label="CERSAI No"
          placeholder="e.g. C202312345678"
          autoCapitalize="characters"
          autoCorrect={false}
          formatText={formatCersai}
          rules={{
            pattern: {
              value: /^[A-Z0-9]{1,20}$/,
              message: 'Enter a valid CERSAI number',
            },
          }}
        />

        <FormTextInput
          control={control}
          name="assets.estimatedValue"
          label="Estimated Valuation Amount (₹) *"
          placeholder="e.g. 2500000"
          keyboardType="numeric"
          maxLength={12}
          formatText={formatWhole}
          rules={{
            required: 'Estimated valuation is required',
            pattern: { value: /^[0-9]+$/, message: 'Enter a valid amount' },
            validate: value =>
              Number(value) > 0 || 'Enter a value greater than 0',
          }}
        />
      </View>

      <View style={themed.accCard}>
        <CardHead
          step="05"
          title="Location & Evidence"
          subtitle="Geo coordinates and property photo"
          themed={themed}
          icon={LocateFixed}
          accent="sky"
          right={progressChip(['latitude', 'longitude', 'propertyImage'], 3)}
        />

        <Pressable
          onPress={() => fetchCurrentLocation()}
          disabled={locLoading}
          style={({ pressed }) => [
            themed.refAddBtn,
            pressed && themed.refAddBtnPressed,
            locLoading && themed.refAddBtnDisabled,
          ]}
        >
          {locLoading ? (
            <ActivityIndicator size="small" color={colors.primary} />
          ) : (
            <LocateFixed size={16} color={colors.primary} />
          )}
          <Text style={themed.refAddBtnText}>
            {locLoading ? 'Fetching location…' : 'Fetch current location'}
          </Text>
        </Pressable>

        {locNote ? (
          <View style={themed.refEntryNote}>
            <Info size={12} color={colors.textSecondary} />
            <Text style={themed.refEntryNoteText}>{locNote}</Text>
          </View>
        ) : null}

        <View style={themed.areaGrid}>
          <View style={themed.areaCol}>
            <FormTextInput
              control={control}
              name="assets.latitude"
              label="Latitude"
              placeholder="e.g. 18.5204"
              keyboardType="decimal-pad"
              formatText={formatCoord}
              rules={{
                pattern: {
                  value: /^-?[0-9]+(\.[0-9]{1,6})?$/,
                  message: 'Invalid',
                },
                validate: value => {
                  const n = Number(value);
                  return (
                    value === '' ||
                    (n >= -90 && n <= 90) ||
                    'Latitude must be -90 to 90'
                  );
                },
              }}
            />
          </View>
          <View style={themed.areaCol}>
            <FormTextInput
              control={control}
              name="assets.longitude"
              label="Longitude"
              placeholder="e.g. 73.8567"
              keyboardType="decimal-pad"
              formatText={formatCoord}
              rules={{
                pattern: {
                  value: /^-?[0-9]+(\.[0-9]{1,6})?$/,
                  message: 'Invalid',
                },
                validate: value => {
                  const n = Number(value);
                  return (
                    value === '' ||
                    (n >= -180 && n <= 180) ||
                    'Longitude must be -180 to 180'
                  );
                },
              }}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="assets.propertyImage"
          rules={{
            validate: value => value != null || 'Upload a property image',
          }}
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <View style={themed.imageWrap}>
              <Text style={themed.imageLabel}>Property Image *</Text>
              <View
                style={[
                  themed.docCard,
                  value ? themed.docCardUploaded : themed.docCardEmpty,
                ]}
              >
                <Pressable
                  onPress={() => (value ? null : pickImage(onChange))}
                  style={({ pressed }) => [
                    themed.docCardBody,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <View style={themed.docIconWrap}>
                    {value ? (
                      <Image
                        source={{ uri: value.uri }}
                        style={themed.docThumb}
                      />
                    ) : (
                      <CloudUpload size={22} color={colors.primary} />
                    )}
                  </View>
                  <View style={themed.docInfo}>
                    <Text style={themed.docName} numberOfLines={1}>
                      {value ? value.fileName : 'Property Photograph'}
                    </Text>
                    {value ? (
                      <Text style={themed.docMeta}>
                        {(value.size / 1024).toFixed(1)} KB
                      </Text>
                    ) : (
                      <View style={themed.docActionRow}>
                        <Plus size={12} color={colors.primary} />
                        <Text
                          style={[themed.docAction, { color: colors.primary }]}
                        >
                          Tap to upload
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
                {value ? (
                  <View style={themed.docActions}>
                    <Pressable
                      onPress={() => setPreviewUri(value.uri)}
                      style={({ pressed }) => [
                        themed.docEyeBtn,
                        { opacity: pressed ? 0.6 : 1 },
                      ]}
                    >
                      <Eye size={16} color={colors.primary} />
                    </Pressable>
                    <Pressable
                      onPress={() => onChange(null)}
                      style={({ pressed }) => [
                        themed.docRemoveBtn,
                        { opacity: pressed ? 0.6 : 1 },
                      ]}
                    >
                      <X size={16} color={colors.error} />
                    </Pressable>
                  </View>
                ) : null}
              </View>
              {error ? (
                <Text style={themed.docError}>{error.message}</Text>
              ) : null}
            </View>
          )}
        />
      </View>

      <View style={themed.accNote}>
        <ShieldCheck size={16} color="#2563EB" />
        <Text style={themed.accNoteText}>
          Make sure the property details match your registered documents to
          avoid delays in processing.
        </Text>
      </View>

      <ImagePreviewModal uri={previewUri} onClose={() => setPreviewUri(null)} />
    </>
  );
}
