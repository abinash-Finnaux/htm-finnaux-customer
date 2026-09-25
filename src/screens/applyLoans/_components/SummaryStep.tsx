import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import {
  MapPin,
  IndianRupee,
  Wallet,
  UserRound,
  FileCheck2,
  Check,
  Eye,
} from 'lucide-react-native';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import ImagePreviewModal from './ImagePreviewModal';
import type { createStyles } from '../styles';
import type { ApplyLoanForm } from '../types';
import type { LoanType } from '../loanTypes';
import type { RankedBranch } from '../../../hooks/useBranches';
import { DOCUMENTS } from './DocumentsStep';

type Props = {
  branchId: string;
  branches: RankedBranch[];
  loanTypes: LoanType[];
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
  form,
  themed,
}: Props) {
  const [previewUri, setPreviewUri] = useState<string | null>(null);
  const branch = branches.find(b => String(b.branch.BranchId) === branchId);
  const loanType = loanTypes.find(l => l.id === form.loanType);
  const uploadedKeys = form.documents.map(d => d.key);
  const requiredCount = DOCUMENTS.filter(d => d.required).length;
  const satisfiedRequired = DOCUMENTS.filter(
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
              const config = DOCUMENTS.find(d => d.key === doc.key);
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

      <ImagePreviewModal
        uri={previewUri}
        onClose={() => setPreviewUri(null)}
      />
    </>
  );
}