import React, { useEffect, useRef, useState } from 'react';
import {
  Controller,
  useWatch,
  type Control,
  type FieldPath,
  type RegisterOptions,
  type UseFormSetValue,
} from 'react-hook-form';
import { Image, Pressable, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import {
  Check,
  Plus,
  Eye,
  X,
  Info,
  CloudUpload,
  CarFront,
  IndianRupee,
  Sparkles,
  Settings2,
  ChevronDown,
  RotateCcw,
  Briefcase,
  UserRound,
  type LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { palette } from '../../../constants/colors';
import { useCommonMasterOptions } from '../../../hooks/useCommonMasterOptions';
import {
  useDealerOptions,
  useManufactureOptions,
  useVehicleCategories,
  useVehicleModels,
  useVehicleVariants,
  useCustomerByLoan,
  type VehicleMasterItem,
} from '../../../hooks/useVehicleMasters';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import FormTextInput from '../../../components/forms/FormTextInput';
import FormDateOfBirthInput from '../../../components/forms/FormDateOfBirthInput';
import ImagePreviewModal from './ImagePreviewModal';
import ModalPicker from './ModalPicker';
import { CardHead } from './FormSectionCard';
import type { createStyles } from '../styles';
import type { ApplyLoanForm, UploadedDocument } from '../types';

export const VEHICLE_CONDITIONS: {
  value: string;
  label: string;
  icon: LucideIcon;
  sub: string;
}[] = [
  { value: 'NEW', label: 'New Vehicle', icon: CarFront, sub: 'Zero-km showroom buy' },
  { value: 'USED', label: 'Used Vehicle', icon: RotateCcw, sub: 'Pre-owned, RC registered' },
];

export const VEHICLE_USAGES: {
  value: string;
  label: string;
  icon: LucideIcon;
  sub: string;
}[] = [
  { value: 'COMMERCIAL', label: 'Commercial', icon: Briefcase, sub: 'For business use' },
  { value: 'NON_COMMERCIAL', label: 'Non-Commercial', icon: UserRound, sub: 'Personal use' },
];

const FUEL_TYPES = ['Petrol', 'Diesel', 'CNG', 'Electric', 'Hybrid'];

const DEALER_OPTIONS = ['Dealer 1', 'Dealer 2', 'Dealer 3', 'Other'];

const MANUFACTURER_OPTIONS = [
  'Maruti Suzuki',
  'Hyundai',
  'Tata Motors',
  'Mahindra',
  'Ashok Leyland',
  'BharatBenz',
  'Eicher',
  'TVS',
  'Bajaj',
  'Honda',
  'Other',
];

const VEHICLE_CATEGORY_OPTIONS = [
  'Car',
  'SUV',
  'MPV',
  'Pickup',
  'Truck',
  'Bus',
  'Van',
  'Three Wheeler',
  'Two Wheeler',
  'Other',
];

const MODEL_OPTIONS = ['Model 1', 'Model 2', 'Model 3', 'Other'];

const VARIANT_OPTIONS = [
  'Base',
  'LX',
  'VX',
  'ZX',
  'ZXI',
  'VXI',
  'Sport',
  'Other',
];

const PAST_MIN = new Date(1985, 0, 1);
const FUTURE_MAX = new Date(2099, 11, 31);

const formatAlphanumeric = (text: string) =>
  text
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 20);

const formatReg = (text: string) =>
  text
    .replace(/[^A-Za-z0-9 -]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toUpperCase()
    .slice(0, 12);

const formatWhole = (text: string) => text.replace(/[^0-9]/g, '').slice(0, 12);

const formatDecimal = (text: string) =>
  text
    .replace(/[^0-9]/g, '')
    .replace(/^0+(?=\d)/, '')
    .slice(0, 12);

const formatFreeText = (text: string) => text.slice(0, 40);

const resolveOptionId = (items: VehicleMasterItem[], value: string): string =>
  items.find(item => item.name === value)?.id ?? '';

const itemNames = (items: VehicleMasterItem[]) => items.map(item => item.name);

const moneyRules = (label: string): RegisterOptions<ApplyLoanForm> => ({
  pattern: {
    value: /^[0-9]+$/,
    message: `Enter a valid ${label.toLowerCase()}`,
  },
  validate: value => {
    if (typeof value !== 'string' || value === '') return true;
    return Number(value) > 0 || 'Enter a value greater than 0';
  },
});

function SegOption({
  themed,
  selected,
  label,
  sub,
  icon: Icon,
  onPress,
}: {
  themed: ReturnType<typeof createStyles>;
  selected: boolean;
  label: string;
  sub: string;
  icon: LucideIcon;
  onPress: () => void;
}) {
  const { theme } = useTheme();
  const { colors } = theme;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        themed.vehicleOptCard,
        selected
          ? themed.vehicleOptCardSelected
          : pressed
          ? themed.vehicleOptCardPressed
          : themed.vehicleOptCardUnselected,
      ]}
    >
      <View
        style={[
          themed.vehicleOptIcon,
          selected
            ? themed.vehicleOptIconSelected
            : themed.vehicleOptIconUnselected,
        ]}
      >
        <Icon size={16} color={selected ? '#FFFFFF' : colors.primary} />
      </View>
      <View style={themed.vehicleOptBody}>
        <Text
          style={[
            themed.vehicleOptTitle,
            selected
              ? themed.vehicleOptTitleSelected
              : themed.vehicleOptTitleUnselected,
          ]}
        >
          {label}
        </Text>
        <Text
          numberOfLines={1}
          style={[
            themed.vehicleOptSub,
            selected
              ? themed.vehicleOptSubSelected
              : themed.vehicleOptSubUnselected,
          ]}
        >
          {sub}
        </Text>
      </View>
      {selected ? (
        <Check
          size={14}
          color="#FFFFFF"
          strokeWidth={3}
          style={themed.vehicleOptTick}
        />
      ) : null}
    </Pressable>
  );
}

function DropdownSelectField({
  control,
  name,
  label,
  options,
  placeholder = 'Select',
  themed,
  rules,
}: {
  control: Control<ApplyLoanForm>;
  name: FieldPath<ApplyLoanForm>;
  label: string;
  options: string[];
  placeholder?: string;
  themed: ReturnType<typeof createStyles>;
  rules?: RegisterOptions<ApplyLoanForm>;
}) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [open, setOpen] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const text = typeof value === 'string' ? value : '';
        return (
          <>
            <Text style={themed.locLabel}>{label}</Text>
            <Pressable
              onPress={() => setOpen(true)}
              style={({ pressed }) => [
                themed.locBox,
                error ? themed.locBoxError : undefined,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Text
                style={text ? themed.locValue : themed.locPlaceholder}
                numberOfLines={1}
              >
                {text || placeholder}
              </Text>
              <ChevronDown size={16} color={colors.textSecondary} />
            </Pressable>
            {error?.message ? (
              <Text style={themed.locError}>{error.message}</Text>
            ) : null}
            <ModalPicker
              visible={open}
              title={label}
              options={options}
              value={text}
              onSelect={onChange}
              onClose={() => setOpen(false)}
              themed={themed}
            />
          </>
        );
      }}
    />
  );
}

function SectionCard({
  themed,
  icon: Icon,
  accent,
  title,
  subtitle,
  num,
  children,
}: {
  themed: ReturnType<typeof createStyles>;
  icon: LucideIcon;
  accent: 'blue' | 'amber' | 'violet' | 'emerald' | 'sky';
  title: string;
  subtitle: string;
  num: string;
  children: React.ReactNode;
}) {
  return (
    <View style={themed.accCard}>
      <CardHead
        step={num}
        title={title}
        subtitle={subtitle}
        themed={themed}
        icon={Icon}
        accent={accent}
      />
      {children}
    </View>
  );
}

type MoneySectionProps = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
};

function PriceDescriptionSection({ control, themed }: MoneySectionProps) {
  const moneyGrid = (
    first: { name: string; label: string },
    second?: { name: string; label: string },
  ) => (
    <View style={themed.areaGrid}>
      <View style={themed.areaCol}>
        <FormTextInput
          control={control}
          name={`vehicle.${first.name}` as never}
          label={first.label}
          placeholder="e.g. 0"
          keyboardType="numeric"
          formatText={formatDecimal}
          rules={moneyRules(first.label)}
        />
      </View>
      {second ? (
        <View style={themed.areaCol}>
          <FormTextInput
            control={control}
            name={`vehicle.${second.name}` as never}
            label={second.label}
            placeholder="e.g. 0"
            keyboardType="numeric"
            formatText={formatDecimal}
            rules={moneyRules(second.label)}
          />
        </View>
      ) : null}
    </View>
  );

  return (
    <>
      {moneyGrid(
        { name: 'exShowroom', label: 'Ex-Showroom' },
        { name: 'gst', label: 'GST' },
      )}
      {moneyGrid(
        { name: 'insurancePremium', label: 'Insurance' },
        { name: 'tdsTcs', label: 'TDS/TCS' },
      )}
      {moneyGrid(
        { name: 'accessories', label: 'Accessories' },
        { name: 'essentialKit', label: 'Essential Kit' },
      )}
      {moneyGrid(
        { name: 'transportation', label: 'Transportation' },
        { name: 'rto', label: 'RTO' },
      )}
      {moneyGrid(
        { name: 'earthing', label: 'Earthing' },
        { name: 'others', label: 'Others' },
      )}

      <FormTextInput
        control={control}
        name="vehicle.onRoad"
        label="On Road *"
        placeholder="e.g. 850000"
        keyboardType="numeric"
        maxLength={12}
        formatText={formatWhole}
        rules={{
          required: 'On-road price is required',
          ...moneyRules('On-road price'),
        }}
      />
    </>
  );
}

type Props = {
  control: Control<ApplyLoanForm>;
  setValue: UseFormSetValue<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
  loanId?: string;
};

export default function VehicleDetailStep({
  control,
  setValue,
  themed,
  loanId = '',
}: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const condition = useWatch({ control, name: 'vehicle.condition' });
  const usage = useWatch({ control, name: 'vehicle.usage' });
  const dealer = useWatch({ control, name: 'vehicle.dealer' });
  const manufacturer = useWatch({ control, name: 'vehicle.manufacturer' });
  const vehicleCategory = useWatch({
    control,
    name: 'vehicle.vehicleCategory',
  });
  const modelName = useWatch({ control, name: 'vehicle.modelName' });

  const isUsed = condition === 'USED';
  const isNew = condition === 'NEW';
  const isCommercial = usage === 'COMMERCIAL';
  const showInvoiceHpn = !(isUsed && isCommercial);

  const dealers = useDealerOptions();
  const fuel = useCommonMasterOptions('FUEL TYPE', FUEL_TYPES);

  const dealerId = resolveOptionId(dealers.items, dealer);
  const manufactures = useManufactureOptions(dealerId);
  const mfgId = resolveOptionId(manufactures.items, manufacturer);
  const categories = useVehicleCategories(mfgId);
  const catId = resolveOptionId(categories.items, vehicleCategory);
  const models = useVehicleModels(mfgId, catId);
  const modelId = resolveOptionId(models.items, modelName);
  const variants = useVehicleVariants(modelId);
  const quotationCustomers = useCustomerByLoan(loanId);

  const chainHint = !isNew
    ? ''
    : !dealer
    ? 'Select dealer to load vehicle options'
    : manufactures.loading ||
      categories.loading ||
      models.loading ||
      variants.loading
    ? 'Loading vehicle options…'
    : !manufacturer
    ? 'Select manufacture to load vehicle options'
    : !vehicleCategory
    ? 'Select category to load vehicle options'
    : !modelName
    ? 'Select model to load variant'
    : '';

  const chainError = isNew
    ? dealers.error ??
      manufactures.error ??
      categories.error ??
      models.error ??
      variants.error
    : '';

  const retryChain = () => {
    if (dealers.error) dealers.refetch();
    if (manufactures.error) manufactures.refetch();
    if (categories.error) categories.refetch();
    if (models.error) models.refetch();
    if (variants.error) variants.refetch();
  };

  const prevDealerIdRef = useRef(dealerId);
  useEffect(() => {
    if (prevDealerIdRef.current !== dealerId) {
      if (dealerId !== '') {
        setValue('vehicle.manufacturer', '');
        setValue('vehicle.vehicleCategory', '');
        setValue('vehicle.modelName', '');
        setValue('vehicle.variant', '');
      }
      prevDealerIdRef.current = dealerId;
    }
  }, [dealerId, setValue]);

  const prevMfgIdRef = useRef(mfgId);
  useEffect(() => {
    if (prevMfgIdRef.current !== mfgId) {
      if (mfgId !== '') {
        setValue('vehicle.vehicleCategory', '');
        setValue('vehicle.modelName', '');
        setValue('vehicle.variant', '');
      }
      prevMfgIdRef.current = mfgId;
    }
  }, [mfgId, setValue]);

  const prevCatIdRef = useRef(catId);
  useEffect(() => {
    if (prevCatIdRef.current !== catId) {
      if (catId !== '') {
        setValue('vehicle.modelName', '');
        setValue('vehicle.variant', '');
      }
      prevCatIdRef.current = catId;
    }
  }, [catId, setValue]);

  const prevModelIdRef = useRef(modelId);
  useEffect(() => {
    if (prevModelIdRef.current !== modelId) {
      if (modelId !== '') {
        setValue('vehicle.variant', '');
      }
      prevModelIdRef.current = modelId;
    }
  }, [modelId, setValue]);

  const dealerOptions =
    isNew && itemNames(dealers.items).length
      ? itemNames(dealers.items)
      : isNew
      ? []
      : DEALER_OPTIONS;

  const manufactureOptions = isNew
    ? itemNames(manufactures.items)
    : MANUFACTURER_OPTIONS;

  const categoryOptions = isNew
    ? itemNames(categories.items)
    : VEHICLE_CATEGORY_OPTIONS;
  const modelOptions = isNew ? itemNames(models.items) : MODEL_OPTIONS;
  const variantOptions = isNew ? itemNames(variants.items) : VARIANT_OPTIONS;
  const fuelOptions = fuel.options.length ? fuel.options : FUEL_TYPES;
  const quotationOptions = itemNames(quotationCustomers.items);

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
          key: 'vehicle',
          uri: asset.uri,
          fileName: asset.fileName || 'vehicle.jpg',
          size: asset.fileSize ?? 0,
          mime: asset.type,
        });
      },
    );
  };

  const renderCheckbox = (
    name: 'vehicle.rcHpn' | 'vehicle.invoiceHpn',
    label: string,
  ) => (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <Pressable
          onPress={() => onChange(!value)}
          style={({ pressed }) => [
            themed.vehicleHpnRow,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <View
            style={[
              themed.vehicleHpnBox,
              {
                borderColor: value ? palette.primary : colors.border,
                backgroundColor: value ? palette.primary : 'transparent',
              },
            ]}
          >
            {value ? <Check size={15} color="#FFFFFF" /> : null}
          </View>
          <Text style={themed.vehicleHpnLabel}>{label}</Text>
        </Pressable>
      )}
    />
  );

  const renderVehicleImage = () => (
    <Controller
      control={control}
      name="vehicle.vehicleImage"
      rules={{
        validate: value => value != null || 'Upload a vehicle image',
      }}
      render={({ field: { value, onChange }, fieldState: { error } }) => (
        <View style={themed.imageWrap}>
          <Text style={themed.imageLabel}>Upload Vehicle Image *</Text>
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
                  <Image source={{ uri: value.uri }} style={themed.docThumb} />
                ) : (
                  <CloudUpload size={22} color={colors.primary} />
                )}
              </View>
              <View style={themed.docInfo}>
                <Text style={themed.docName} numberOfLines={1}>
                  {value ? value.fileName : 'Vehicle Photograph'}
                </Text>
                {value ? (
                  <Text style={themed.docMeta}>
                    {(value.size / 1024).toFixed(1)} KB
                  </Text>
                ) : (
                  <View style={themed.docActionRow}>
                    <Plus size={12} color={colors.primary} />
                    <Text style={[themed.docAction, { color: colors.primary }]}>
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
          {error ? <Text style={themed.docError}>{error.message}</Text> : null}
        </View>
      )}
    />
  );

  return (
    <>
      <SectionHeaderText
        title="Vehicle Details"
        subtitle="Select the vehicle condition and usage, then share the vehicle information."
      />

      <SectionCard
        themed={themed}
        icon={Settings2}
        accent="sky"
        title="Vehicle Type"
        subtitle="Condition & usage of the vehicle"
        num="01"
      >
        <Text style={themed.locLabel}>Vehicle Condition *</Text>
        <View style={themed.assetGrid}>
          {VEHICLE_CONDITIONS.map(option => (
            <Pressable
              key={option.value}
              onPress={() => {
                setValue('vehicle.condition', option.value, {
                  shouldValidate: true,
                });
                if (option.value === 'USED') {
                  setValue('vehicle.dealer', '');
                  setValue('vehicle.dealerContactPerson', '');
                  setValue('vehicle.dealerContactNo', '');
                  setValue('vehicle.quotationNo', '');
                  setValue('vehicle.quotationDate', null);
                  setValue('vehicle.estimationAmount', '');
                  setValue('vehicle.invoiceNo', '');
                  setValue('vehicle.invoiceDate', null);
                  setValue('vehicle.invoiceValue', '');
                  setValue('vehicle.quotationInFavorOf', '');
                  setValue('vehicle.remark', '');
                }
              }}
              style={({ pressed }) => [
                themed.assetChip,
                condition === option.value
                  ? themed.assetChipSelected
                  : pressed
                  ? themed.assetChipPressed
                  : themed.assetChipUnselected,
              ]}
            >
              <option.icon size={16} color={condition === option.value ? '#FFFFFF' : colors.primary} />
              <Text
                style={[
                  themed.assetChipText,
                  condition === option.value
                    ? themed.assetChipTextSelected
                    : themed.assetChipTextUnselected,
                ]}
              >
                {option.label}
              </Text>
              {condition === option.value && (
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              )}
            </Pressable>
          ))}
        </View>

        <Text style={[themed.locLabel, { marginTop: 22 }]}>Vehicle Usage *</Text>
        <View style={themed.assetGrid}>
          {VEHICLE_USAGES.map(option => (
            <Pressable
              key={option.value}
              onPress={() => {
                setValue('vehicle.usage', option.value, {
                  shouldValidate: true,
                });
                if (option.value === 'NON_COMMERCIAL') {
                  setValue('vehicle.roadTaxUpto', null);
                  setValue('vehicle.fitnessUpto', null);
                  setValue('vehicle.permitUpto', null);
                  setValue('vehicle.route', '');
                }
              }}
              style={({ pressed }) => [
                themed.assetChip,
                usage === option.value
                  ? themed.assetChipSelected
                  : pressed
                  ? themed.assetChipPressed
                  : themed.assetChipUnselected,
              ]}
            >
              <option.icon size={16} color={usage === option.value ? '#FFFFFF' : colors.primary} />
              <Text
                style={[
                  themed.assetChipText,
                  usage === option.value
                    ? themed.assetChipTextSelected
                    : themed.assetChipTextUnselected,
                ]}
              >
                {option.label}
              </Text>
              {usage === option.value && (
                <Check size={14} color="#FFFFFF" strokeWidth={3} />
              )}
            </Pressable>
          ))}
        </View>
      </SectionCard>

      {condition && usage ? (
        <>
          <SectionCard
            themed={themed}
            icon={CarFront}
            accent="blue"
            title="Vehicle Information"
            subtitle="Identification, registration & vehicle details"
            num="02"
          >
            {isNew ? (
              <DropdownSelectField
                control={control}
                name="vehicle.dealer"
                label="Dealer *"
                options={dealerOptions}
                rules={{ required: 'Select dealer' }}
                themed={themed}
              />
            ) : null}
            <DropdownSelectField
              control={control}
              name="vehicle.manufacturer"
              label="Vehicle Manufacturer *"
              options={manufactureOptions}
              rules={{ required: 'Select vehicle manufacture' }}
              themed={themed}
            />
            <DropdownSelectField
              control={control}
              name="vehicle.vehicleCategory"
              label="Vehicle Category *"
              options={categoryOptions}
              rules={{ required: 'Select vehicle category' }}
              themed={themed}
            />
            <DropdownSelectField
              control={control}
              name="vehicle.modelName"
              label="Vehicle Model *"
              options={modelOptions}
              rules={{ required: 'Select vehicle model name' }}
              themed={themed}
            />
            <DropdownSelectField
              control={control}
              name="vehicle.variant"
              label="Vehicle Variant *"
              options={variantOptions}
              rules={{ required: 'Select variant' }}
              themed={themed}
            />

            {chainHint ? (
              <Text style={themed.vehicleChainHint}>{chainHint}</Text>
            ) : null}

            {chainError ? (
              <View style={themed.vehicleErrorRow}>
                <Text style={themed.vehicleChainHintError}>{chainError}</Text>
                <Pressable
                  onPress={retryChain}
                  style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                >
                  <Text style={themed.vehicleRetryText}>Retry</Text>
                </Pressable>
              </View>
            ) : null}

            <FormDateOfBirthInput
              control={control}
              name="vehicle.manufactureDate"
              label="Manufacture Year *"
              minimumDate={PAST_MIN}
              maximumDate={new Date()}
              rules={{ required: 'Manufacture year is required' }}
            />

            <FormTextInput
              control={control}
              name="vehicle.regNumber"
              label={isUsed ? 'Registration Number *' : 'Registration Number'}
              placeholder="e.g. MH12 AB1234"
              autoCapitalize="characters"
              maxLength={12}
              formatText={formatReg}
              rules={{
                required: isUsed ? 'Registration number is required' : false,
                pattern: {
                  value: /^[A-Z0-9 -]{4,14}$/,
                  message: 'Enter a valid registration number',
                },
              }}
            />

            <View style={themed.areaGrid}>
              <View style={themed.areaCol}>
                <FormDateOfBirthInput
                  control={control}
                  name="vehicle.registrationDate"
                  label="Registration Date"
                  minimumDate={PAST_MIN}
                  maximumDate={new Date()}
                />
              </View>
              <View style={themed.areaCol}>
                <FormDateOfBirthInput
                  control={control}
                  name="vehicle.registrationExpiryDate"
                  label="Registration Expiry Date"
                  minimumDate={PAST_MIN}
                  maximumDate={FUTURE_MAX}
                />
              </View>
            </View>

            <DropdownSelectField
              control={control}
              name="vehicle.fuelType"
              label="Fuel Type *"
              options={fuelOptions}
              rules={{ required: 'Select fuel type' }}
              themed={themed}
            />

            {isCommercial ? (
              <View style={themed.areaGrid}>
                <View style={themed.areaCol}>
                  <FormDateOfBirthInput
                    control={control}
                    name="vehicle.roadTaxUpto"
                    label="Road Tax Upto"
                    minimumDate={PAST_MIN}
                    maximumDate={FUTURE_MAX}
                  />
                </View>
                <View style={themed.areaCol}>
                  <FormDateOfBirthInput
                    control={control}
                    name="vehicle.fitnessUpto"
                    label="Fitness Upto"
                    minimumDate={PAST_MIN}
                    maximumDate={FUTURE_MAX}
                  />
                </View>
              </View>
            ) : null}

            {isCommercial ? (
              <View style={themed.areaGrid}>
                <View style={themed.areaCol}>
                  <FormDateOfBirthInput
                    control={control}
                    name="vehicle.permitUpto"
                    label="Permit Upto"
                    minimumDate={PAST_MIN}
                    maximumDate={FUTURE_MAX}
                  />
                </View>
                <View style={themed.areaCol}>
                  <FormTextInput
                    control={control}
                    name="vehicle.colour"
                    label="Vehicle Color"
                    placeholder="e.g. Polar White"
                    maxLength={24}
                    formatText={formatFreeText}
                  />
                </View>
              </View>
            ) : (
              <FormTextInput
                control={control}
                name="vehicle.colour"
                label="Vehicle Color"
                placeholder="e.g. Polar White"
                maxLength={24}
                formatText={formatFreeText}
              />
            )}

            <FormTextInput
              control={control}
              name="vehicle.vehicleCost"
              label="Vehicle Cost *"
              placeholder="e.g. 750000"
              keyboardType="numeric"
              maxLength={12}
              formatText={formatWhole}
              rules={{
                required: 'Vehicle cost is required',
                ...moneyRules('Vehicle cost'),
              }}
            />

            {isCommercial ? (
              <FormTextInput
                control={control}
                name="vehicle.route"
                label="Route"
                placeholder="e.g. Pune - Mumbai"
                maxLength={40}
                formatText={formatFreeText}
              />
            ) : null}

            <View style={themed.areaGrid}>
              <View style={themed.areaCol}>
            <FormTextInput
              control={control}
              name="vehicle.engineNumber"
              label="Engine Number *"
              placeholder="e.g. K12MN12345"
              autoCapitalize="characters"
              maxLength={20}
              formatText={formatAlphanumeric}
              rules={{
                required: 'Engine number is required',
                pattern: {
                  value: /^[A-Z0-9]{6,20}$/,
                  message: 'Enter a valid engine number',
                },
              }}
            />
              </View>
              <View style={themed.areaCol}>
            <FormTextInput
              control={control}
              name="vehicle.chassisNumber"
              label="Chassis Number *"
              placeholder="e.g. MA3EYD31S00555498"
              autoCapitalize="characters"
              maxLength={20}
              formatText={formatAlphanumeric}
              rules={{
                required: 'Chassis number is required',
                pattern: {
                  value: /^[A-Z0-9]{6,20}$/,
                  message: 'Enter a valid chassis number',
                },
              }}
            />
              </View>
            </View>

            <FormTextInput
              control={control}
              name="vehicle.keyNo"
              label="Key Number"
              placeholder="e.g. K-1023"
              maxLength={20}
              formatText={formatFreeText}
            />

            {renderCheckbox('vehicle.rcHpn', 'RC HPN Endorsement')}
            {showInvoiceHpn
              ? renderCheckbox('vehicle.invoiceHpn', 'Invoice HPN Endorsement')
              : null}
          </SectionCard>

          <SectionCard
            themed={themed}
            icon={IndianRupee}
            accent="emerald"
            title="Price Description"
            subtitle="Complete breakup of the vehicle price"
            num="03"
          >
            <PriceDescriptionSection control={control} themed={themed} />
          </SectionCard>

          {isNew ? (
            <SectionCard
              themed={themed}
              icon={Sparkles}
              accent="amber"
              title="New Vehicle Details"
              subtitle="Dealer, quotation & invoice details"
              num="04"
            >
              <FormTextInput
                control={control}
                name="vehicle.dealerContactPerson"
                label="Dealer Contact Person *"
                placeholder="e.g. Rahul Sharma"
                maxLength={40}
                formatText={formatFreeText}
                rules={{ required: 'Contact person is required' }}
              />

              <FormTextInput
                control={control}
                name="vehicle.dealerContactNo"
                label="Dealer Contact Number *"
                placeholder="e.g. 9876543210"
                keyboardType="phone-pad"
                maxLength={10}
                formatText={formatWhole}
                rules={{
                  required: 'Contact number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Enter a valid 10-digit number',
                  },
                }}
              />

              <View style={themed.areaGrid}>
                <View style={themed.areaCol}>
                  <FormTextInput
                    control={control}
                    name="vehicle.quotationNo"
                    label="Quotation Number *"
                    placeholder="e.g. QT-1042"
                    maxLength={20}
                    formatText={formatFreeText}
                    rules={{ required: 'Quotation number is required' }}
                  />
                </View>
                <View style={themed.areaCol}>
                  <FormDateOfBirthInput
                    control={control}
                    name="vehicle.quotationDate"
                    label="Quotation Date *"
                    minimumDate={PAST_MIN}
                    maximumDate={new Date()}
                    rules={{ required: 'Quotation date is required' }}
                  />
                </View>
              </View>

              <View style={themed.areaGrid}>
                <View style={themed.areaCol}>
                  <FormTextInput
                    control={control}
                    name="vehicle.estimationAmount"
                    label="Estimation Amount *"
                    placeholder="e.g. 820000"
                    keyboardType="numeric"
                    maxLength={12}
                    formatText={formatWhole}
                    rules={{
                      required: 'Estimation amount is required',
                      ...moneyRules('Estimation amount'),
                    }}
                  />
                </View>
                <View style={themed.areaCol}>
                  <FormTextInput
                    control={control}
                    name="vehicle.invoiceNo"
                    label="Invoice Number *"
                    placeholder="e.g. INV-8821"
                    maxLength={20}
                    formatText={formatFreeText}
                    rules={{ required: 'Invoice number is required' }}
                  />
                </View>
              </View>

              <View style={themed.areaGrid}>
                <View style={themed.areaCol}>
                  <FormDateOfBirthInput
                    control={control}
                    name="vehicle.invoiceDate"
                    label="Invoice Date *"
                    minimumDate={PAST_MIN}
                    maximumDate={new Date()}
                    rules={{ required: 'Invoice date is required' }}
                  />
                </View>
                <View style={themed.areaCol}>
                  <FormTextInput
                    control={control}
                    name="vehicle.invoiceValue"
                    label="Invoice Value *"
                    placeholder="e.g. 815000"
                    keyboardType="numeric"
                    maxLength={12}
                    formatText={formatWhole}
                    rules={{
                      required: 'Invoice value is required',
                      ...moneyRules('Invoice value'),
                    }}
                  />
                </View>
              </View>

              <DropdownSelectField
                control={control}
                name="vehicle.quotationInFavorOf"
                label="Quotation In Favor Of"
                options={quotationOptions}
                themed={themed}
              />

              {quotationCustomers.loading && quotationOptions.length === 0 ? (
                <Text style={themed.vehicleChainHint}>Loading options…</Text>
              ) : null}
              {quotationCustomers.error ? (
                <View style={themed.vehicleErrorRow}>
                  <Text style={themed.vehicleChainHintError}>
                    {quotationCustomers.error}
                  </Text>
                  <Pressable
                    onPress={() => quotationCustomers.refetch()}
                    style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
                  >
                    <Text style={themed.vehicleRetryText}>Retry</Text>
                  </Pressable>
                </View>
              ) : null}
              {!loanId && quotationOptions.length === 0 ? (
                <Text style={themed.vehicleChainHint}>
                  No loan application linked yet — options load with the loan
                  application
                </Text>
              ) : null}

              <FormTextInput
                control={control}
                name="vehicle.remark"
                label="Remarks"
                placeholder="Any additional remarks"
                maxLength={500}
                formatText={text => text.slice(0, 500)}
                multiline
                textAlignVertical="top"
                numberOfLines={4}
              />

              {renderVehicleImage()}
            </SectionCard>
          ) : (
            <View style={themed.accCard}>{renderVehicleImage()}</View>
          )}
        </>
      ) : null}

      <View style={themed.refEntryNote}>
        <Info size={12} color={colors.textSecondary} />
        <Text style={themed.refEntryNoteText}>
          Ensure vehicle details match RC book and insurance papers to avoid delays.
        </Text>
      </View>

      <ImagePreviewModal uri={previewUri} onClose={() => setPreviewUri(null)} />
    </>
  );
}
