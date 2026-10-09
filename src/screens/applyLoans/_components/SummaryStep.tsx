import React, { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import {
  MapPin,
  Wallet,
  UserRound,
  FileCheck2,
  Landmark,
  PiggyBank,
  CarFront,
  Check,
  Eye,
  Calendar,
  TrendingUp,
  Sparkles,
  ShieldCheck,
  CircleAlert,
} from 'lucide-react-native';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import ImagePreviewModal from './ImagePreviewModal';
import { useTheme } from '../../../context/ThemeContext';
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

const has = (value?: string | null) => !!value && value.trim() !== '';

function ReadinessRing({
  themed,
  percent,
}: {
  themed: ReturnType<typeof createStyles>;
  percent: number;
}) {
  const size = 92;
  const stroke = 8;
  const r = (size - stroke) / 2;
  const circumference = 2 * Math.PI * r;
  const clamped = Math.min(Math.max(percent, 0), 100);

  return (
    <View style={themed.rvRingWrap}>
      <Svg width={size} height={size}>
        <Defs>
          <LinearGradient id="rvRingGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
            <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0.7" />
          </LinearGradient>
        </Defs>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="rgba(255,255,255,0.25)"
          strokeWidth={stroke}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#rvRingGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={circumference - (clamped / 100) * circumference}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={themed.rvRingCenter}>
        <Text style={themed.rvRingPercent}>{clamped}%</Text>
        <Text style={themed.rvRingCaption}>ready</Text>
      </View>
    </View>
  );
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
  const filled = rows.filter(row => has(row.value) && row.value !== '-').length;
  const complete = filled === rows.length;

  return (
    <View style={themed.rvSection}>
      <View style={themed.rvSectionHead}>
        <View style={[themed.rvSectionIcon, { backgroundColor: tint + '16' }]}>
          <Icon size={18} color={tint} />
        </View>
        <View style={themed.rvSectionHeadBody}>
          <Text style={themed.rvSectionTitle}>{title}</Text>
          <Text style={themed.rvSectionMeta}>
            {filled} of {rows.length} details
          </Text>
        </View>
        <View
          style={[
            themed.rvStatusPill,
            complete ? themed.rvStatusPillOk : themed.rvStatusPillWarn,
          ]}
        >
          {complete ? (
            <Check size={11} color="#059669" strokeWidth={3.2} />
          ) : (
            <CircleAlert size={11} color="#D97706" />
          )}
          <Text
            style={[
              themed.rvStatusText,
              complete ? themed.rvStatusTextOk : themed.rvStatusTextWarn,
            ]}
          >
            {complete ? 'Complete' : 'Review'}
          </Text>
        </View>
      </View>

      <View style={themed.rvRows}>
        {rows.map((row, i) => {
          const muted = !has(row.value) || row.value === '-';
          return (
            <View
              key={i}
              style={[themed.rvRow, i > 0 && themed.rvRowDivider]}
            >
              <Text style={themed.rvRowLabel}>{row.label}</Text>
              <Text
                style={[themed.rvRowValue, muted && themed.rvRowValueMuted]}
                numberOfLines={2}
              >
                {muted ? '—' : row.value}
              </Text>
            </View>
          );
        })}
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
  const { theme, isDark } = useTheme();
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

  const readiness = useMemo(() => {
    const customer = form.customerInfo;
    const account = form.accountInfo;
    const checkpoints: boolean[] = [
      has(form.amount) && has(form.tenure),
      has(form.branchId),
    ];
    if (stepKeys.includes('customerInfo')) {
      checkpoints.push(has(customer?.fullName) && has(customer?.mobile));
    }
    if (stepKeys.includes('incomeExpense')) {
      checkpoints.push(has(form.monthlyIncome) && has(form.employment));
    }
    if (stepKeys.includes('accountInfo')) {
      checkpoints.push(has(account?.accountNumber) && has(account?.ifsc));
    }
    if (stepKeys.includes('reference')) {
      checkpoints.push((form.references?.length ?? 0) > 0);
    }
    if (stepKeys.includes('assets')) {
      checkpoints.push(has(form.assets?.propertyOwnerName));
    }
    if (stepKeys.includes('vehicle')) {
      checkpoints.push(has(form.vehicle?.modelName));
    }
    if (stepKeys.includes('documents')) {
      checkpoints.push(
        requiredCount > 0 && satisfiedRequired === requiredCount,
      );
    }
    if (checkpoints.length === 0) return 100;
    const done = checkpoints.filter(Boolean).length;
    return Math.round((done / checkpoints.length) * 100);
  }, [form, stepKeys, requiredCount, satisfiedRequired]);

  const heroFrom = isDark ? '#1E40AF' : '#2563EB';
  const heroTo = isDark ? '#6D28D9' : '#7C3AED';

  return (
    <>
      <SectionHeaderText
        title="Review & Submit"
        subtitle="Confirm everything looks correct before submitting."
      />

      <View style={themed.rvHero}>
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <LinearGradient id="rvHeroGrad" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={heroFrom} />
              <Stop offset="1" stopColor={heroTo} />
            </LinearGradient>
          </Defs>
          <Rect
            width="100%"
            height="100%"
            rx={theme.radius.lg}
            fill="url(#rvHeroGrad)"
          />
        </Svg>
        <View style={themed.rvHeroGlow1} />
        <View style={themed.rvHeroGlow2} />

        <View style={themed.rvHeroTop}>
          <View style={themed.rvHeroPill}>
            <Sparkles size={12} color="#FFFFFF" />
            <Text style={themed.rvHeroPillText}>Final step</Text>
          </View>
          <View style={themed.rvHeroPillGhost}>
            <ShieldCheck size={12} color="rgba(255,255,255,0.94)" />
            <Text style={themed.rvHeroPillGhostText}>Secure</Text>
          </View>
        </View>

        <View style={themed.rvHeroMain}>
          <View style={themed.rvHeroLeft}>
            <Text style={themed.rvHeroLabel}>Loan Requested</Text>
            <Text style={themed.rvHeroAmount}>{inr(form.amount) || '—'}</Text>
            <View style={themed.rvHeroChips}>
              <View style={themed.rvHeroChip}>
                <Calendar size={12} color="#FFFFFF" />
                <Text style={themed.rvHeroChipText}>
                  {form.tenure ? `${form.tenure} months` : '—'}
                </Text>
              </View>
              <View style={themed.rvHeroChip}>
                <TrendingUp size={12} color="#FFFFFF" />
                <Text style={themed.rvHeroChipText}>
                  {emi ? `${emi}/mo` : '—'}
                </Text>
              </View>
            </View>
          </View>
          <ReadinessRing themed={themed} percent={readiness} />
        </View>

        <View style={themed.rvHeroPurpose}>
          <Text style={themed.rvHeroPurposeK}>Purpose</Text>
          <Text style={themed.rvHeroPurposeV} numberOfLines={1}>
            {form.purpose || '—'}
          </Text>
        </View>
      </View>

      <View style={themed.rvConsent}>
        <ShieldCheck size={18} color={theme.colors.primary} />
        <Text style={themed.rvConsentText}>
          Your information is encrypted and shared only with the selected
          branch. By submitting, you confirm the details above are{' '}
          <Text style={themed.rvConsentStrong}>accurate and complete</Text>.
        </Text>
      </View>

      <Section
        themed={themed}
        tint="#2563EB"
        icon={MapPin}
        title="Branch & Product"
        rows={[
          {
            label: 'Branch',
            value: branch?.branch.Branch_Name.trim() || form.branchName || '',
          },
          {
            label: 'Location',
            value:
              [branch?.branch.District_Name, branch?.branch.Tehsil_Name]
                .filter(Boolean)
                .join(', ') || '',
          },
          { label: 'Product', value: loanType?.label || form.loanType || '' },
        ]}
      />

      {stepKeys.includes('incomeExpense') ? (
        <Section
          themed={themed}
          tint="#10B981"
          icon={Wallet}
          title="Income Summary"
          rows={[
            { label: 'Monthly Income', value: inr(form.monthlyIncome) || '' },
            { label: 'Employment', value: form.employment || '' },
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
            { label: 'Full Name', value: form.customerInfo?.fullName || '' },
            { label: 'Mobile', value: form.customerInfo?.mobile || '' },
            { label: 'Email', value: form.customerInfo?.email || '' },
            {
              label: 'Date of Birth',
              value: form.customerInfo?.dob
                ? formatDate(form.customerInfo.dob)
                : '',
            },
            { label: 'Gender', value: form.customerInfo?.gender || '' },
            { label: 'PAN', value: form.customerInfo?.pan || '' },
            { label: 'Aadhaar', value: form.customerInfo?.aadhaar || '' },
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
              value: form.accountInfo?.accountHolderName || '',
            },
            { label: 'Bank Name', value: form.accountInfo?.bankName || '' },
            {
              label: 'Account No.',
              value: form.accountInfo?.accountNumber || '',
            },
            { label: 'IFSC', value: form.accountInfo?.ifsc || '' },
            {
              label: 'Account Type',
              value: form.accountInfo?.accountType || '',
            },
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
            { label: 'Condition', value: form.vehicle?.condition || '' },
            { label: 'Usage', value: form.vehicle?.usage || '' },
            { label: 'Dealer', value: form.vehicle?.dealer || '' },
            {
              label: 'Make & Model',
              value:
                [form.vehicle?.manufacturer, form.vehicle?.modelName]
                  .filter(Boolean)
                  .join(' ') || '',
            },
            {
              label: 'Category',
              value: form.vehicle?.vehicleCategory || '',
            },
            { label: 'Variant', value: form.vehicle?.variant || '' },
            {
              label: 'Registration No.',
              value: form.vehicle?.regNumber || '',
            },
            { label: 'Fuel Type', value: form.vehicle?.fuelType || '' },
            { label: 'Colour', value: form.vehicle?.colour || '' },
            {
              label: 'Vehicle Cost',
              value: inr(form.vehicle?.vehicleCost ?? '') || '',
            },
            {
              label: 'Engine No.',
              value: form.vehicle?.engineNumber || '',
            },
            {
              label: 'Chassis No.',
              value: form.vehicle?.chassisNumber || '',
            },
            { label: 'Key No.', value: form.vehicle?.keyNo || '' },
            { label: 'Route', value: form.vehicle?.route || '' },
            {
              label: 'On Road Price',
              value: inr(form.vehicle?.onRoad ?? '') || '',
            },
            {
              label: 'Quotation',
              value: form.vehicle?.quotationNo || '',
            },
            { label: 'Invoice', value: form.vehicle?.invoiceNo || '' },
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
              value: form.assets?.propertyOwnerName || '',
            },
            {
              label: 'Address',
              value: form.assets?.propertyAddress || '',
            },
            {
              label: 'Registration',
              value:
                [form.assets?.regState, form.assets?.regDistrict]
                  .filter(Boolean)
                  .join(', ') || '',
            },
            { label: 'Pincode', value: form.assets?.pincode || '' },
            {
              label: 'Property Type',
              value:
                [form.assets?.propertyType, form.assets?.natureOfProperty]
                  .filter(Boolean)
                  .join(' · ') || '',
            },
            {
              label: 'Ownership',
              value:
                [
                  form.assets?.ownershipDocument,
                  form.assets?.ownershipType,
                ]
                  .filter(Boolean)
                  .join(' · ') || '',
            },
            {
              label: 'Total Area',
              value:
                form.assets?.totalArea && form.assets.unitOfMeasurement
                  ? `${form.assets.totalArea} ${form.assets.unitOfMeasurement}`
                  : '',
            },
            {
              label: 'Constructed Area',
              value:
                form.assets?.constructedArea &&
                form.assets.unitOfMeasurement
                  ? `${form.assets.constructedArea} ${form.assets.unitOfMeasurement}`
                  : '',
            },
            {
              label: 'Mortgage',
              value:
                [form.assets?.mortgageType, form.assets?.mortgageSignedBy]
                  .filter(Boolean)
                  .join(' · ') || '',
            },
            { label: 'CERSAI No.', value: form.assets?.cersaiNo || '' },
            {
              label: 'Estimated Value',
              value: inr(form.assets?.estimatedValue ?? '') || '',
            },
            {
              label: 'Coordinates',
              value:
                [form.assets?.latitude, form.assets?.longitude]
                  .filter(Boolean)
                  .join(', ') || '',
            },
          ]}
        />
      ) : null}

      {stepKeys.includes('reference') ? (
        <View style={themed.rvSection}>
          <View style={themed.rvSectionHead}>
            <View
              style={[themed.rvSectionIcon, themed.rvIconRed]}
            >
              <UserRound size={18} color="#EF4444" />
            </View>
            <View style={themed.rvSectionHeadBody}>
              <Text style={themed.rvSectionTitle}>Customer Reference</Text>
              <Text style={themed.rvSectionMeta}>
                {form.references.length} added
              </Text>
            </View>
            {form.references.length > 0 ? (
              <View style={[themed.rvStatusPill, themed.rvStatusPillOk]}>
                <Check size={11} color="#059669" strokeWidth={3.2} />
                <Text style={[themed.rvStatusText, themed.rvStatusTextOk]}>
                  Complete
                </Text>
              </View>
            ) : null}
          </View>
          <View style={themed.rvRows}>
            {form.references.length > 0 ? (
              form.references.map((ref, i) => (
                <View
                  key={ref.id}
                  style={[themed.rvRow, i > 0 && themed.rvRowDivider]}
                >
                  <Text style={themed.rvRowLabel}>
                    {ref.type || `Reference ${i + 1}`}
                  </Text>
                  <Text style={themed.rvRowValue} numberOfLines={2}>
                    {[ref.name, ref.phone].filter(Boolean).join(' · ') || '—'}
                  </Text>
                </View>
              ))
            ) : (
              <View style={themed.rvRow}>
                <Text style={themed.rvRowLabel}>References</Text>
                <Text
                  style={[themed.rvRowValue, themed.rvRowValueMuted]}
                >
                  —
                </Text>
              </View>
            )}
          </View>
        </View>
      ) : null}

      {stepKeys.includes('documents') ? (
        <View style={themed.rvSection}>
          <View style={themed.rvSectionHead}>
            <View
              style={[themed.rvSectionIcon, themed.rvIconViolet]}
            >
              <FileCheck2 size={18} color="#8B5CF6" />
            </View>
            <View style={themed.rvSectionHeadBody}>
              <Text style={themed.rvSectionTitle}>Documents</Text>
              <Text style={themed.rvSectionMeta}>
                {satisfiedRequired} of {requiredCount} required uploaded
              </Text>
            </View>
            {satisfiedRequired === requiredCount && requiredCount > 0 ? (
              <View style={[themed.rvStatusPill, themed.rvStatusPillOk]}>
                <Check size={11} color="#059669" strokeWidth={3.2} />
                <Text style={[themed.rvStatusText, themed.rvStatusTextOk]}>
                  Complete
                </Text>
              </View>
            ) : (
              <View style={[themed.rvStatusPill, themed.rvStatusPillWarn]}>
                <CircleAlert size={11} color="#D97706" />
                <Text style={[themed.rvStatusText, themed.rvStatusTextWarn]}>
                  Pending
                </Text>
              </View>
            )}
          </View>

          {form.documents.length > 0 ? (
            form.documents.map(doc => {
              const config = documentConfigs.find(d => d.key === doc.key);
              return (
                <View key={doc.key} style={themed.rvDocRow}>
                  <View style={themed.rvDocIcon}>
                    <FileCheck2 size={17} color="#059669" />
                  </View>
                  <View style={themed.rvDocInfo}>
                    <Text style={themed.rvDocLabel}>
                      {config?.label || doc.key}
                    </Text>
                    <Text style={themed.rvDocFile} numberOfLines={1}>
                      {doc.fileName}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setPreviewUri(doc.uri)}
                    style={({ pressed }) => [
                      themed.rvDocEye,
                      { opacity: pressed ? 0.6 : 1 },
                    ]}
                  >
                    <Eye size={16} color={theme.colors.primary} />
                  </Pressable>
                </View>
              );
            })
          ) : (
            <Text style={themed.rvEmpty}>No documents uploaded.</Text>
          )}
        </View>
      ) : null}

      <ImagePreviewModal
        uri={previewUri}
        onClose={() => setPreviewUri(null)}
      />
    </>
  );
}
