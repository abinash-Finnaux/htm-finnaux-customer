import React, { useState } from 'react';
import {
  Controller,
  useWatch,
  type Control,
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
  type LucideIcon,
} from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import { palette } from '../../../constants/colors';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import FormTextInput from '../../../components/forms/FormTextInput';
import FormSelectOption from '../../../components/forms/FormSelectOption';
import FormDateOfBirthInput from '../../../components/forms/FormDateOfBirthInput';
import ImagePreviewModal from './ImagePreviewModal';
import type { createStyles } from '../styles';
import type { ApplyLoanForm, UploadedDocument } from '../types';

export const VEHICLE_CONDITIONS = [
  { value: 'NEW', label: 'New Vehicle' },
  { value: 'USED', label: 'Used Vehicle' },
];

export const VEHICLE_USAGES = [
  { value: 'COMMERCIAL', label: 'Commercial' },
  { value: 'NON_COMMERCIAL', label: 'Non-Commercial' },
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

const VARIANT_OPTIONS = ['Base', 'LX', 'VX', 'ZX', 'ZXI', 'VXI', 'Sport', 'Other'];

const PAST_MIN = new Date(1985, 0, 1);
const FUTURE_MAX = new Date(2099, 11, 31);

const formatAlphanumeric = (text: string) =>
  text.replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 20);

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

const moneyRules = (
  label: string,
): RegisterOptions<ApplyLoanForm> => ({
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
  onPress,
}: {
  themed: ReturnType<typeof createStyles>;
  selected: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        themed.segOption,
        selected ? themed.segOptionActive : themed.segOptionInactive,
        { opacity: pressed ? 0.7 : 1 },
      ]}
    >
      <Text
        style={[
          themed.segOptionText,
          selected
            ? themed.segOptionTextActive
            : themed.segOptionTextInactive,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function SectionCard({
  themed,
  icon: Icon,
  tint,
  title,
  subtitle,
  num,
  children,
}: {
  themed: ReturnType<typeof createStyles>;
  icon: LucideIcon;
  tint: string;
  title: string;
  subtitle: string;
  num: string;
  children: React.ReactNode;
}) {
  return (
    <View style={themed.vehicleStepCard}>
      <View style={themed.vehicleStepCardRow}>
        <View style={themed.vehicleStepHeadLeft}>
          <View
            style={[
              themed.vehicleStepIconBadge,
              { backgroundColor: tint + '1A' },
            ]}
          >
            <Icon size={20} color={tint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={themed.vehicleStepHeadTitle}>{title}</Text>
            <Text style={themed.vehicleStepHeadSub}>{subtitle}</Text>
          </View>
        </View>
        <View
          style={[
            themed.vehicleStepNumPill,
            { backgroundColor: tint + '14' },
          ]}
        >
          <Text style={[themed.vehicleStepNumText, { color: tint }]}>{num}</Text>
        </View>
      </View>
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
      {moneyGrid({ name: 'exShowroom', label: 'Ex-Showroom' }, { name: 'gst', label: 'GST' })}
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
      {moneyGrid({ name: 'earthing', label: 'Earthing' }, { name: 'others', label: 'Others' })}

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
};

export default function VehicleDetailStep({ control, setValue, themed }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const condition = useWatch({ control, name: 'vehicle.condition' });
  const usage = useWatch({ control, name: 'vehicle.usage' });

  const isUsed = condition === 'USED';
  const isNew = condition === 'NEW';
  const isCommercial = usage === 'COMMERCIAL';
  const showInvoiceHpn = !(isUsed && isCommercial);

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
        subtitle="Select the vehicle condition and usage, then share the vehicle details."
      />

      <SectionCard
        themed={themed}
        icon={Settings2}
        tint={palette.info}
        title="Vehicle Type"
        subtitle="Condition & usage of the vehicle"
        num="01"
      >
        <Text style={themed.locLabel}>Vehicle Condition *</Text>
        <View style={[themed.segRow, { marginTop: themed.locBox.marginTop }]}>
          {VEHICLE_CONDITIONS.map(option => (
            <SegOption
              key={option.value}
              themed={themed}
              selected={condition === option.value}
              label={option.label}
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
            />
          ))}
        </View>

        <Text style={[themed.locLabel, { marginTop: 22 }]}>Usage *</Text>
        <View style={[themed.segRow, { marginTop: themed.locBox.marginTop }]}>
          {VEHICLE_USAGES.map(option => (
            <SegOption
              key={option.value}
              themed={themed}
              selected={usage === option.value}
              label={option.label}
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
            />
          ))}
        </View>
      </SectionCard>

      <SectionCard
        themed={themed}
        icon={CarFront}
        tint={palette.primary}
        title="Assets Info"
        subtitle="Identification & registration details"
        num="02"
      >
        {isNew ? (
          <FormSelectOption
            control={control}
            name="vehicle.dealer"
            label="Dealer *"
            options={DEALER_OPTIONS}
            rules={{ required: 'Select dealer' }}
          />
        ) : null}

        <View style={themed.areaGrid}>
          <View style={themed.areaCol}>
            <FormSelectOption
              control={control}
              name="vehicle.manufacturer"
              label="Vehicle Manufacture *"
              options={MANUFACTURER_OPTIONS}
              rules={{ required: 'Select vehicle manufacture' }}
            />
          </View>
          <View style={themed.areaCol}>
            <FormSelectOption
              control={control}
              name="vehicle.vehicleCategory"
              label="Vehicle Category *"
              options={VEHICLE_CATEGORY_OPTIONS}
              rules={{ required: 'Select vehicle category' }}
            />
          </View>
        </View>

        <View style={themed.areaGrid}>
          <View style={themed.areaCol}>
            <FormSelectOption
              control={control}
              name="vehicle.modelName"
              label="Vehicle Model Name *"
              options={MODEL_OPTIONS}
              rules={{ required: 'Select vehicle model name' }}
            />
          </View>
          <View style={themed.areaCol}>
            <FormSelectOption
              control={control}
              name="vehicle.variant"
              label="Variant *"
              options={VARIANT_OPTIONS}
              rules={{ required: 'Select variant' }}
            />
          </View>
        </View>

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
          label={isUsed ? 'Vehicle Reg No. *' : 'Vehicle Reg No.'}
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

        <FormSelectOption
          control={control}
          name="vehicle.fuelType"
          label="Fuel Type *"
          options={FUEL_TYPES}
          rules={{ required: 'Select fuel type' }}
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
                label="Color"
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
            label="Color"
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
              label="Engine No. *"
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
              label="Chassis No. *"
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
          label="Key No."
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
        tint={palette.success}
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
          tint={palette.warning}
          title="New Vehicle"
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
            label="Dealer Contact No. *"
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
                label="Quotation No. *"
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
                label="Invoice No. *"
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

          <FormTextInput
            control={control}
            name="vehicle.quotationInFavorOf"
            label="Quotation In Favor Of"
            placeholder="e.g. ABC Pvt. Ltd."
            maxLength={40}
            formatText={formatFreeText}
          />

          <FormTextInput
            control={control}
            name="vehicle.remark"
            label="Remark"
            placeholder="Any additional remarks"
            maxLength={120}
            formatText={text => text.slice(0, 120)}
          />

          {renderVehicleImage()}
        </SectionCard>
      ) : (
        <View style={themed.vehicleStepCard}>
          {renderVehicleImage()}
        </View>
      )}

      <View style={themed.refEntryNote}>
        <Info size={12} color={colors.textSecondary} />
        <Text style={themed.refEntryNoteText}>
          Make sure the vehicle details match your RC book and insurance papers
          to avoid delays in processing.
        </Text>
      </View>

      <ImagePreviewModal uri={previewUri} onClose={() => setPreviewUri(null)} />
    </>
  );
}