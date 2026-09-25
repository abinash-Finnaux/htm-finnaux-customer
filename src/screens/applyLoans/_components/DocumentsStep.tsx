import React, { useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Controller, type Control } from 'react-hook-form';
import {
  FileText,
  IdCard,
  Image as ImageIcon,
  PenLine,
  Banknote,
  CloudUpload,
  Plus,
  X,
  Eye,
} from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import ImagePreviewModal from './ImagePreviewModal';
import type { createStyles } from '../styles';
import type {
  ApplyLoanForm,
  DocumentConfig,
  UploadedDocument,
} from '../types';

export const DOCUMENTS: DocumentConfig[] = [
  {
    key: 'aadhaar',
    label: 'Aadhaar Card',
    hint: 'Front & back',
    required: true,
  },
  {
    key: 'pan',
    label: 'PAN Card',
    hint: 'Clear photograph',
    required: true,
  },
  {
    key: 'photo',
    label: 'Passport Size Photo',
    hint: 'Recent photograph',
    required: true,
  },
  {
    key: 'signature',
    label: 'Signature',
    hint: 'On white paper',
    required: false,
  },
  {
    key: 'bankStatement',
    label: 'Bank Statement',
    hint: 'Last 6 months (optional)',
    required: false,
  },
];

const DOC_ICONS: Record<string, typeof FileText> = {
  aadhaar: IdCard,
  pan: FileText,
  photo: ImageIcon,
  signature: PenLine,
  bankStatement: Banknote,
};

const DOC_TINTS: Record<string, string> = {
  aadhaar: '#2563EB',
  pan: '#F59E0B',
  photo: '#8B5CF6',
  signature: '#10B981',
  bankStatement: '#EF4444',
};

type Props = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
};

export default function DocumentsStep({ control, themed }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [previewUri, setPreviewUri] = useState<string | null>(null);

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

  return (
    <>
      <SectionHeaderText title="Upload Documents" />

      <Controller
        control={control}
        name="documents"
        defaultValue={[]}
        rules={{
          validate: docs => {
            const requiredKeys = DOCUMENTS.filter(d => d.required).map(
              d => d.key,
            );
            const uploadedKeys = (docs ?? []).map(d => d.key);
            return requiredKeys.every(k => uploadedKeys.includes(k));
          },
        }}
        render={({ field: { value, onChange }, fieldState: { error } }) => {
          const docs = value ?? [];
          const uploadedCount = docs.length;
          const requiredCount = DOCUMENTS.filter(d => d.required).length;
          const satisfiedRequired = DOCUMENTS.filter(
            d => d.required && docs.some(x => x.key === d.key),
          ).length;
          const progress = Math.round(
            (satisfiedRequired / requiredCount) * 100,
          );
          const complete = satisfiedRequired === requiredCount;

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
                    {uploadedCount} of {DOCUMENTS.length} documents attached
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

              {DOCUMENTS.map(item => {
                const Icon = DOC_ICONS[item.key] ?? FileText;
                const tint = DOC_TINTS[item.key] ?? colors.primary;
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
                      onPress={() => (uploaded ? null : pickDocument(item, docs, onChange))}
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
                          <Text
                            style={themed.docName}
                            numberOfLines={1}
                          >
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
                              <Text style={[themed.docAction, { color: tint }]}>
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

              {error ? (
                <Text style={themed.docError}>
                  Please upload all required documents to continue.
                </Text>
              ) : null}
            </View>
          );
        }}
      />
      <ImagePreviewModal
        uri={previewUri}
        onClose={() => setPreviewUri(null)}
      />
    </>
  );
}