import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  MapPin,
  IndianRupee,
  Wallet,
  UserRound,
  FileCheck2,
  Landmark,
  PiggyBank,
  CarFront,
  Check,
  Eye,
} from 'lucide-react-native';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import ImagePreviewModal from './ImagePreviewModal';
import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';
import type { LoanType } from '../loanTypes';
import type { RankedBranch } from '../../../hooks/useBranches';
import { useProductRequiredDocs } from '../../../hooks/useProductRequiredDocs';

type Props = {
  branchId: string;
  branches: RankedBranch[];
  loanTypes: LoanType[];
  stepKeys: string[];
  form: ApplyLoanForm;
  themed: ReturnType<typeof createStyles>;
};

const inr = (value: string) =>
  value && Number.isFinite(Number(value))
    ? `₹${Number(value).toLocaleString('en-IN')}`
    : '';

function estimateEmi(principal: number, annualRatePct: number, months: number) {
  if (!principal || !months) {
    return '';
  }
  const r = annualRatePct / 12 / 100;
  const power = Math.pow(1 + r, months);
  return `₹${Math.round((principal * r * power) / (power - 1)).toLocaleString(
    'en-IN',
  )}`;
}

const formatDate = (date: Date) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}/${date.getFullYear()}`;
};

function Section({
  themed,
  icon,
  tint,
  title,
  rows,
}: {
  themed: ReturnType<typeof createStyles>;
  tint: string;
  icon: React.ElementType;
  title: string;
  rows: { label: string; value: string }[];
}) {
  const Icon = icon;
  return (
    <View style={themed.summarySection}>
      <View style={themed.summarySectionHeader}>
        <View style={[themed.summarySectionIcon, { backgroundColor: tint + '14' }]}>
          <Icon size={18} color={tint} />
        </View>
        <Text style={themed.summarySectionTitle}>{title}</Text>
      </View>
      <View style={themed.summarySectionRows}>
        {rows.map((row, i) => (
          <View key={i} style={themed.summarySectionRow}>
            <View style={themed.summarySectionRowLeft}>
              <Check
                size={13}
                color={row.value && row.value !== '-' ? '#22C55E' : '#94A3B8'}
              />
              <Text style={themed.summarySectionLabel}>{row.label}</Text>
            </View>
            <Text
              style={[
                themed.summarySectionValue,
                row.value === '-'
                  ? themed.summarySectionValueMuted
                  : themed.summarySectionValueStrong,
              ]}
              numberOfLines={2}
            >
              {row.value}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export default function SummaryStep({
  branchId,
  branches,
  loanTypes,
  stepKeys,
  form,
  themed,
}: Props) {
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const branch = branches.find(b => String(b.branch.BranchId) === branchId);
  const loanType = loanTypes.find(l => l.id === form.loanType);
  const uploadedKeys = form.documents.map(d => d.key);
  const productId =
    form.loanType !== '' && Number.isFinite(Number(form.loanType))
      ? Number(form.loanType)
      : null;
  const { documents: documentConfigs } = useProductRequiredDocs(productId);
  const requiredCount = documentConfigs.filter(d => d.required).length;
  const satisfiedRequired = documentConfigs.filter(
    d => d.required && uploadedKeys.includes(d.key),
  ).length;

  const emi = useMemo(
    () => estimateEmi(Number(form.amount), 12, Number(form.tenure)),
    [form.amount, form.tenure],
  );

  return (
    <>
      <SectionHeaderText
        title="Review Application"
        subtitle="Confirm everything looks correct before submitting."
      />

      <View style={themed.reviewHero}>
        <View style={themed.reviewHeroHeader}>
          <Text style={themed.reviewHeroLabel}>Loan Requested</Text>
          <View style={themed.reviewHeroBadge}>
            <IndianRupee size={13} color="#2563EB" />
            <Text style={themed.reviewHeroBadgeText}>Application</Text>
          </View>
        </View>
        <Text style={themed.reviewHeroAmount}>{inr(form.amount) || '—'}</Text>
        <View style={themed.reviewHeroDivider} />
        <View style={themed.reviewHeroStats}>
          <View style={themed.reviewHeroStat}>
            <Text style={themed.reviewHeroStatLabel}>Tenure</Text>
            <Text style={themed.reviewHeroStatValue}>
              {form.tenure ? `${form.tenure} mo` : '—'}
            </Text>
          </View>
          <View style={[themed.reviewHeroStat, themed.reviewHeroStatMid]}>
            <Text style={themed.reviewHeroStatLabel}>Est. EMI</Text>
            <Text style={themed.reviewHeroStatValue}>{emi || '—'}</Text>
          </View>
        </View>
        <View style={themed.reviewHeroPurpose}>
          <Text style={themed.reviewHeroPurposeLabel}>Purpose</Text>
          <Text style={themed.reviewHeroPurposeValue}>
            {form.purpose || '—'}
          </Text>
        </View>
      </View>

      <Section
        themed={themed}
        tint="#2563EB"
        icon={MapPin}
        title="Branch & Product"
        rows={[
          {
            label: 'Branch',
            value: branch?.branch.Branch_Name.trim() || form.branchName || '-',
          },
          {
            label: 'Location',
            value: [branch?.branch.District_Name, branch?.branch.Tehsil_Name]
              .filter(Boolean)
              .join(', ') || '-',
          },
          { label: 'Product', value: loanType?.label || form.loanType || '-' },
        ]}
      />

      {stepKeys.includes('incomeExpense') ? (
        <Section
          themed={themed}
          tint="#10B981"
          icon={Wallet}
          title="Income Summary"
          rows={[
            { label: 'Monthly Income', value: inr(form.monthlyIncome) || '-' },
            { label: 'Employment', value: form.employment || '-' },
          ]}
        />
      ) : null}

      {stepKeys.includes('customerInfo') ? (
        <Section
          themed={themed}
          tint="#3B82F6"
          icon={UserRound}
          title="Customer Info"
          rows={[
            { label: 'Full Name', value: form.customerInfo?.fullName || '-' },
            { label: 'Mobile', value: form.customerInfo?.mobile || '-' },
            { label: 'Email', value: form.customerInfo?.email || '-' },
            {
              label: 'Date of Birth',
              value: form.customerInfo?.dob
                ? formatDate(form.customerInfo.dob)
                : '-',
            },
            { label: 'Gender', value: form.customerInfo?.gender || '-' },
            { label: 'PAN', value: form.customerInfo?.pan || '-' },
            { label: 'Aadhaar', value: form.customerInfo?.aadhaar || '-' },
          ]}
        />
      ) : null}

      {stepKeys.includes('accountInfo') ? (
        <Section
          themed={themed}
          tint="#F59E0B"
          icon={Landmark}
          title="Account Info"
          rows={[
            {
              label: 'Account Holder',
              value: form.accountInfo?.accountHolderName || '-',
            },
            { label: 'Bank Name', value: form.accountInfo?.bankName || '-' },
            { label: 'Account No.', value: form.accountInfo?.accountNumber || '-' },
            { label: 'IFSC', value: form.accountInfo?.ifsc || '-' },
            { label: 'Account Type', value: form.accountInfo?.accountType || '-' },
          ]}
        />
      ) : null}

      {stepKeys.includes('vehicle') ? (
        <Section
          themed={themed}
          tint="#0EA5E9"
          icon={CarFront}
          title="Vehicle Details"
        rows={[
          {
            label: 'Condition',
            value: form.vehicle?.condition || '-',
          },
          {
            label: 'Usage',
            value: form.vehicle?.usage || '-',
          },
          {
            label: 'Dealer',
            value: form.vehicle?.dealer || '-',
          },
          {
            label: 'Make & Model',
            value:
              [form.vehicle?.manufacturer, form.vehicle?.modelName]
                .filter(Boolean)
                .join(' ') || '-',
          },
          {
            label: 'Category',
            value: form.vehicle?.vehicleCategory || '-',
          },
          {
            label: 'Variant',
            value: form.vehicle?.variant || '-',
          },
          {
            label: 'Registration No.',
            value: form.vehicle?.regNumber || '-',
          },
          {
            label: 'Fuel Type',
            value: form.vehicle?.fuelType || '-',
          },
          { label: 'Colour', value: form.vehicle?.colour || '-' },
          {
            label: 'Vehicle Cost',
            value: inr(form.vehicle?.vehicleCost ?? '') || '-',
          },
          {
            label: 'Engine No.',
            value: form.vehicle?.engineNumber || '-',
          },
          {
            label: 'Chassis No.',
            value: form.vehicle?.chassisNumber || '-',
          },
          { label: 'Key No.', value: form.vehicle?.keyNo || '-' },
          { label: 'Route', value: form.vehicle?.route || '-' },
          {
            label: 'On Road Price',
            value: inr(form.vehicle?.onRoad ?? '') || '-',
          },
          {
            label: 'Quotation',
            value: form.vehicle?.quotationNo || '-',
          },
          {
            label: 'Invoice',
            value: form.vehicle?.invoiceNo || '-',
          },
        ]}
        />
      ) : null}

      {stepKeys.includes('assets') ? (
      <Section
        themed={themed}
        tint="#F59E0B"
        icon={PiggyBank}
        title="Assets & Holdings"
        rows={[
          {
            label: 'Owner',
            value: form.assets?.propertyOwnerName || '-',
          },
          {
            label: 'Address',
            value: form.assets?.propertyAddress || '-',
          },
          {
            label: 'Registration',
            value: [form.assets?.regState, form.assets?.regDistrict]
              .filter(Boolean)
              .join(', ') || '-',
          },
          { label: 'Pincode', value: form.assets?.pincode || '-' },
          {
            label: 'Property Type',
            value: [form.assets?.propertyType, form.assets?.natureOfProperty]
              .filter(Boolean)
              .join(' · ') || '-',
          },
          {
            label: 'Ownership',
            value: [
              form.assets?.ownershipDocument,
              form.assets?.ownershipType,
            ]
              .filter(Boolean)
              .join(' · ') || '-',
          },
          {
            label: 'Total Area',
            value:
              form.assets?.totalArea && form.assets.unitOfMeasurement
                ? `${form.assets.totalArea} ${form.assets.unitOfMeasurement}`
                : '-',
          },
          {
            label: 'Constructed Area',
            value:
              form.assets?.constructedArea && form.assets.unitOfMeasurement
                ? `${form.assets.constructedArea} ${form.assets.unitOfMeasurement}`
                : '-',
          },
          {
            label: 'Mortgage',
            value: [form.assets?.mortgageType, form.assets?.mortgageSignedBy]
              .filter(Boolean)
              .join(' · ') || '-',
          },
          { label: 'CERSAI No.', value: form.assets?.cersaiNo || '-' },
          {
            label: 'Estimated Value',
            value: inr(form.assets?.estimatedValue ?? '') || '-',
          },
          {
            label: 'Coordinates',
            value: [form.assets?.latitude, form.assets?.longitude]
              .filter(Boolean)
              .join(', ') || '-',
          },
        ]}
        />
      ) : null}

      {stepKeys.includes('reference') ? (
      <View style={themed.summarySection}>
        <View style={themed.summarySectionHeader}>
          <View style={themed.summarySectionIconRed}>
            <UserRound size={18} color="#EF4444" />
          </View>
          <Text style={themed.summarySectionTitle}>Customer Reference</Text>
        </View>
        <View style={themed.summarySectionRows}>
          {form.references.length > 0 ? (
            form.references.map((ref, i) => (
              <View key={ref.id} style={themed.summarySectionRow}>
                <View style={themed.summarySectionRowLeft}>
                  <Check size={13} color="#22C55E" />
                  <Text style={themed.summarySectionLabel}>
                    {ref.type || `Reference ${i + 1}`}
                  </Text>
                </View>
                <Text style={themed.summarySectionValue}>
                  {[ref.name, ref.phone].filter(Boolean).join(' · ') || '-'}
                </Text>
              </View>
            ))
          ) : (
            <View style={themed.summarySectionRow}>
              <View style={themed.summarySectionRowLeft}>
                <Check size={13} color="#94A3B8" />
                <Text style={themed.summarySectionLabel}>References</Text>
              </View>
              <Text style={themed.summarySectionValue}>-</Text>
            </View>
          )}
        </View>
      </View>
      ) : null}

      {stepKeys.includes('documents') ? (
      <View style={themed.summarySection}>
        <View style={themed.summarySectionHeader}>
          <View
            style={[
              themed.summarySectionIcon,
              { backgroundColor: '#8B5CF6' + '14' },
            ]}
          >
            <FileCheck2 size={18} color="#8B5CF6" />
          </View>
          <Text style={themed.summarySectionTitle}>Documents</Text>
        </View>
        <View style={themed.summarySectionRows}>
          <View style={themed.summarySectionRow}>
            <View style={themed.summarySectionRowLeft}>
              <Check
                size={13}
                color={
                  satisfiedRequired === requiredCount ? '#22C55E' : '#94A3B8'
                }
              />
              <Text style={themed.summarySectionLabel}>Required Completed</Text>
            </View>
            <Text style={themed.summarySectionValue}>
              {satisfiedRequired} of {requiredCount}
            </Text>
          </View>
        </View>
        <View style={themed.docList}>
          {form.documents.length > 0 ? (
            form.documents.map(doc => {
              const config = documentConfigs.find(d => d.key === doc.key);
              return (
                <View key={doc.key} style={themed.docRow}>
                  <FileCheck2
                    size={15}
                    color="#22C55E"
                    style={themed.docRowIcon}
                  />
                  <View style={themed.docRowInfo}>
                    <Text style={themed.docRowLabel}>
                      {config?.label || doc.key}
                    </Text>
                    <Text style={themed.docRowFile} numberOfLines={1}>
                      {doc.fileName}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setPreviewUri(doc.uri)}
                    style={({ pressed }) => [
                      themed.docEyeBtn,
                      { opacity: pressed ? 0.6 : 1 },
                    ]}
                  >
                    <Eye size={16} color="#2563EB" />
                  </Pressable>
                </View>
              );
            })
          ) : (
            <Text style={themed.docChipEmpty}>No documents uploaded.</Text>
          )}
        </View>
      </View>
      ) : null}

      <ImagePreviewModal
        uri={previewUri}
        onClose={() => setPreviewUri(null)}
      />
    </>
  );
}