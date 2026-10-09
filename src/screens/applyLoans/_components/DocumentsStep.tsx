import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Controller, type Control } from 'react-hook-form';
import {
  FileText,
  IdCard,
  Image as ImageIcon,
  Banknote,
  Building2,
  Car,
  Scale,
  BarChart3,
  CloudUpload,
  Plus,
  X,
  Eye,
} from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import ImagePreviewModal from './ImagePreviewModal';
import { useProductRequiredDocs } from '../../../hooks/useProductRequiredDocs';
import type { createStyles } from '../styles';
import type { ApplyLoanForm, DocumentConfig, UploadedDocument } from '../types';

const CATEGORY_ICONS: Record<string, typeof FileText> = {
  KYC: IdCard,
  'Income Proof': Banknote,
  Property: Building2,
  Vehicle: Car,
  FI: FileText,
  Legal: Scale,
  Valuation: BarChart3,
  Other: ImageIcon,
};

const CATEGORY_TINTS: Record<string, string> = {
  KYC: '#2563EB',
  'Income Proof': '#F59E0B',
  Property: '#8B5CF6',
  Vehicle: '#10B981',
  FI: '#EF4444',
  Legal: '#0EA5E9',
  Valuation: '#F97316',
  Other: '#64748B',
};

type Props = {
  control: Control<ApplyLoanForm>;
  productId: number | null;
  themed: ReturnType<typeof createStyles>;
};

export default function DocumentsStep({ control, productId, themed }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const {
    documents: documentConfigs,
    loading,
    error,
    refetch,
  } = useProductRequiredDocs(productId);

  const grouped = useMemo(() => {
    const map = new Map<string, DocumentConfig[]>();
    documentConfigs.forEach(cfg => {
      const category = cfg.category || 'Other';
      const bucket = map.get(category);
      if (bucket) {
        bucket.push(cfg);
      } else {
        map.set(category, [cfg]);
      }
    });
    return Array.from(map.entries());
  }, [documentConfigs]);

  const pickDocument = (
    item: DocumentConfig,
    current: UploadedDocument[],
    onChange: (docs: UploadedDocument[]) => void,
  ) => {
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
        if (!asset) {
          return;
        }
        const existing = current.filter(doc => doc.key !== item.key);
        const next: UploadedDocument = {
          key: item.key,
          uri: asset.uri ?? '',
          fileName: asset.fileName || `${item.key}.jpg`,
          size: asset.fileSize ?? 0,
          mime: asset.type,
        };
        if (!next.uri) {
          return;
        }
        onChange([...existing, next]);
      },
    );
  };

  if (loading) {
    return (
      <>
        <SectionHeaderText title="Upload Documents" />
        <View style={themed.loadingWrap}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={themed.docLoadingText}>
            Loading documents for your product…
          </Text>
        </View>
      </>
    );
  }

  return (
    <>
      <SectionHeaderText
        title="Upload Documents"
        subtitle={
          error
            ? 'Showing default documents. Check your connection and retry.'
            : undefined
        }
      />

      {error ? (
        <Pressable
          onPress={refetch}
          style={({ pressed }) => [
            themed.refAddBtn,
            { opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <CloudUpload size={16} color={colors.primary} />
          <Text style={themed.refAddBtnText}>Retry loading documents</Text>
        </Pressable>
      ) : null}

      <Controller
        control={control}
        name="documents"
        defaultValue={[]}
        rules={{
          validate: docs => {
            const requiredKeys = documentConfigs
              .filter(d => d.required)
              .map(d => d.key);
            if (requiredKeys.length === 0) {
              return true;
            }
            const uploadedKeys = (docs ?? []).map(d => d.key);
            return requiredKeys.every(k => uploadedKeys.includes(k));
          },
        }}
        render={({
          field: { value, onChange },
          fieldState: { error: fieldError },
        }) => {
          const docs = value ?? [];
          const uploadedCount = docs.length;
          const requiredCount = documentConfigs.filter(d => d.required).length;
          const satisfiedRequired = documentConfigs.filter(
            d => d.required && docs.some(x => x.key === d.key),
          ).length;
          const progress =
            requiredCount > 0
              ? Math.round((satisfiedRequired / requiredCount) * 100)
              : 100;
          const complete =
            requiredCount === 0 || satisfiedRequired === requiredCount;

          return (
            <View style={themed.docWrap}>
              <View
                style={[
                  themed.docProgressCard,
                  complete && themed.docProgressCardComplete,
                ]}
              >
                <View style={themed.docProgressIcon}>
                  <CloudUpload size={22} color={colors.primary} />
                </View>
                <View style={themed.docProgressInfo}>
                  <Text style={themed.docProgressTitle}>
                    {complete
                      ? 'All required documents uploaded'
                      : `${satisfiedRequired} of ${requiredCount} required documents uploaded`}
                  </Text>
                  <Text style={themed.docProgressMeta}>
                    {uploadedCount} of {documentConfigs.length} documents
                    attached
                  </Text>
                  <View style={themed.docProgressTrack}>
                    <View
                      style={[
                        themed.docProgressFill,
                        { width: `${progress}%` },
                        complete && themed.docProgressFillComplete,
                      ]}
                    />
                  </View>
                </View>
              </View>
              {grouped.map(([category, items]) => (
                <View key={category} style={themed.docCategoryBlock}>
                  <Text style={themed.docCategoryHeader}>{category}</Text>
                  {items.map(item => {
                    const Icon = CATEGORY_ICONS[category] ?? FileText;
                    const tint = CATEGORY_TINTS[category] ?? colors.primary;
                    const uploaded = docs.find(d => d.key === item.key);
                    return (
                      <View
                        key={item.key}
                        style={[
                          themed.docCard,
                          uploaded
                            ? themed.docCardUploaded
                            : themed.docCardEmpty,
                        ]}
                      >
                        <Pressable
                          onPress={() =>
                            uploaded ? null : pickDocument(item, docs, onChange)
                          }
                          disabled={!!uploaded}
                          style={({ pressed }) => [
                            themed.docCardBody,
                            { opacity: pressed ? 0.7 : 1 },
                          ]}
                        >
                          <View
                            style={[
                              themed.docIconWrap,
                              { backgroundColor: tint + '14' },
                            ]}
                          >
                            {uploaded ? (
                              <Image
                                source={{ uri: uploaded.uri }}
                                style={themed.docThumb}
                              />
                            ) : (
                              <Icon size={22} color={tint} />
                            )}
                          </View>
                          <View style={themed.docInfo}>
                            <View style={themed.docNameRow}>
                              <Text style={themed.docName} numberOfLines={1}>
                                {item.label}
                              </Text>
                              {uploaded ? (
                                <View style={themed.docTagUploaded}>
                                  <Text style={themed.docTagUploadedText}>
                                    ✓ Uploaded
                                  </Text>
                                </View>
                              ) : item.required ? (
                                <View style={themed.docTagRequired}>
                                  <Text style={themed.docTagRequiredText}>
                                    Required
                                  </Text>
                                </View>
                              ) : null}
                            </View>
                            {uploaded ? (
                              <>
                                <Text style={themed.docMeta} numberOfLines={1}>
                                  {uploaded.fileName}
                                </Text>
                                {uploaded.size > 0 ? (
                                  <Text style={themed.docMeta}>
                                    {(uploaded.size / 1024).toFixed(1)} KB
                                  </Text>
                                ) : null}
                              </>
                            ) : (
                              <>
                                <Text style={themed.docMeta}>{item.hint}</Text>
                                <View style={themed.docActionRow}>
                                  <Plus size={12} color={tint} />
                                  <Text
                                    style={[themed.docAction, { color: tint }]}
                                  >
                                    Tap to upload
                                  </Text>
                                </View>
                              </>
                            )}
                          </View>
                        </Pressable>

                        {uploaded ? (
                          <View style={themed.docActions}>
                            <Pressable
                              onPress={() => setPreviewUri(uploaded.uri)}
                              style={({ pressed }) => [
                                themed.docEyeBtn,
                                { opacity: pressed ? 0.6 : 1 },
                              ]}
                            >
                              <Eye size={16} color={colors.primary} />
                            </Pressable>
                            <Pressable
                              onPress={() =>
                                onChange(docs.filter(d => d.key !== item.key))
                              }
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
                    );
                  })}
                </View>
              ))}

              {fieldError ? (
                <Text style={themed.docError}>
                  Please upload all required documents to continue.
                </Text>
              ) : null}
            </View>
          );
        }}
      />
      <ImagePreviewModal uri={previewUri} onClose={() => setPreviewUri(null)} />
    </>
  );
}
