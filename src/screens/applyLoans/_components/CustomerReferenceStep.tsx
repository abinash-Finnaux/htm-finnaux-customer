import React, { useCallback } from 'react';
import { Controller, type Control } from 'react-hook-form';
import { Pressable, Text, View } from 'react-native';
import { HeartHandshake, Info, Plus, Trash2, Users } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import GlobalInputText from '../../../components/inputTexts/GlobalInputText';
import SectionHeaderText from '../../../components/typography/SectionHeaderText';
import type { createStyles } from '../styles';
import type { ApplyLoanForm, CustomerReference } from '../types';

const REFERENCE_TYPES = ['Family', 'Friend', 'Colleague', 'Other'];
const MAX_REFERENCES = 5;

let refCounter = 0;
const newReferenceId = () => `ref_${Date.now()}_${++refCounter}`;

const newEmptyReference = (): CustomerReference => ({
  id: newReferenceId(),
  type: '',
  name: '',
  phone: '',
});

type Props = {
  control: Control<ApplyLoanForm>;
  themed: ReturnType<typeof createStyles>;
};

export default function CustomerReferenceStep({ control, themed }: Props) {
  const { theme } = useTheme();
  const { colors } = theme;

  const formatPhone = (text: string) => text.replace(/[^0-9]/g, '').slice(0, 10);

  const updateReference = (
    refs: CustomerReference[],
    onChange: (refs: CustomerReference[]) => void,
    id: string,
    patch: Partial<CustomerReference>,
  ) => {
    onChange(refs.map(r => (r.id === id ? { ...r, ...patch } : r)));
  };

  const isReferenceValid = (ref: CustomerReference) =>
    ref.type !== '' && (ref.name.trim() !== '' || ref.phone !== '');

  const hasInvalidPhone = (ref: CustomerReference) =>
    ref.phone !== '' && !/^[0-9]{10}$/.test(ref.phone);

  const renderReferences = useCallback(
    (
      refs: CustomerReference[],
      onChange: (refs: CustomerReference[]) => void,
    ) => (
      <>
        {refs.map((ref, index) => {
          const typeSelected = ref.type !== '';
          const incomplete = !isReferenceValid(ref);
          const invalidPhone = hasInvalidPhone(ref);

          return (
            <View key={ref.id} style={themed.refEntryCard}>
              <View style={themed.refEntryHeader}>
                <View style={themed.refEntryBadge}>
                  <Text style={themed.refEntryBadgeText}>{index + 1}</Text>
                </View>
                <Text style={themed.refEntryTitle}>
                  Reference {index + 1}
                </Text>
                <Pressable
                  onPress={() => onChange(refs.filter(r => r.id !== ref.id))}
                  style={({ pressed }) => [
                    themed.refEntryRemove,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}
                >
                  <Trash2 size={16} color={colors.error} />
                </Pressable>
              </View>

              <Text style={themed.refTypeLabel}>Reference Type *</Text>
              <View style={themed.refTypeRow}>
                {REFERENCE_TYPES.map(type => {
                  const selected = ref.type === type;
                  return (
                    <Pressable
                      key={type}
                      onPress={() =>
                        updateReference(refs, onChange, ref.id, { type })
                      }
                      style={({ pressed }) => [
                        themed.refTypeChip,
                        selected
                          ? themed.refTypeChipSelected
                          : pressed
                          ? themed.refTypeChipPressed
                          : themed.refTypeChipUnselected,
                      ]}
                    >
                      <Text
                        style={[
                          themed.refTypeChipText,
                          selected
                            ? themed.refTypeChipTextSelected
                            : themed.refTypeChipTextUnselected,
                        ]}
                      >
                        {type}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {!typeSelected && refs.length > 0 ? (
                <Text style={themed.refEntryError}>
                  Select a reference type.
                </Text>
              ) : null}

              <GlobalInputText
                label="Name"
                placeholder="Enter the person's name"
                value={ref.name}
                onChangeText={text =>
                  updateReference(refs, onChange, ref.id, { name: text })
                }
              />
              <GlobalInputText
                label="Mobile Number"
                placeholder="Enter 10-digit mobile number"
                keyboardType="phone-pad"
                maxLength={10}
                value={ref.phone}
                onChangeText={text =>
                  updateReference(refs, onChange, ref.id, {
                    phone: formatPhone(text),
                  })
                }
                error={invalidPhone ? 'Enter a valid 10-digit mobile number' : undefined}
              />

              {incomplete && refs.length > 0 ? (
                <View style={themed.refEntryNote}>
                  <Info size={12} color={colors.textSecondary} />
                  <Text style={themed.refEntryNoteText}>
                    Add at least a name or a mobile number.
                  </Text>
                </View>
              ) : null}
            </View>
          );
        })}

        {refs.length < MAX_REFERENCES ? (
          <Pressable
            onPress={() => onChange([...refs, newEmptyReference()])}
            style={({ pressed }) => [
              themed.refAddBtn,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Plus size={16} color={colors.primary} />
            <Text style={themed.refAddBtnText}>Add Another Reference</Text>
          </Pressable>
        ) : null}
      </>
    ),
    [themed, colors],
  );

  return (
    <>
      <SectionHeaderText
        title="Customer Reference"
        subtitle="Add one or more references — each needs a type and a name or mobile."
      />

      <View style={themed.referenceCard}>
        <View style={themed.referenceCardIcon}>
          <HeartHandshake size={24} color={colors.primary} />
        </View>
        <View style={themed.referenceCardBody}>
          <Text style={themed.referenceCardTitle}>
            Add customer references
          </Text>
          <Text style={themed.referenceCardText}>
            At least one reference is mandatory. You can add up to{' '}
            {MAX_REFERENCES} references.
          </Text>
        </View>
      </View>

      <Controller
        control={control}
        name="references"
        defaultValue={[]}
        rules={{
          validate: refs => {
            const list = refs ?? [];
            if (list.length === 0) {
              return 'Add at least one reference to continue.';
            }
            const allValid = list.every(
              ref =>
                ref.type !== '' &&
                (ref.name.trim() !== '' || ref.phone !== '') &&
                (ref.phone === '' || /^[0-9]{10}$/.test(ref.phone)),
            );
            return allValid || 'Complete all references to continue.';
          },
        }}
        render={({
          field: { value, onChange },
          fieldState: { error },
        }) => {
          const refs = value ?? [];
          const anyIncomplete =
            refs.length === 0 ||
            refs.some(ref => !isReferenceValid(ref) || hasInvalidPhone(ref));
          return (
            <View style={themed.refWrap}>
              {renderReferences(refs, onChange)}
              <View style={themed.refSummaryRow}>
                <Users size={16} color={colors.primary} />
                <Text style={themed.refSummaryText}>
                  {refs.length > 0
                    ? `${refs.length} reference${refs.length > 1 ? 's' : ''} added`
                    : 'No references added yet.'}
                </Text>
              </View>
              {anyIncomplete ? (
                <Text style={themed.docError}>
                  {refs.length === 0
                    ? 'Add at least one reference to continue.'
                    : 'Complete all reference details to continue.'}
                </Text>
              ) : null}
              {error && refs.length > 0 ? (
                <Text style={themed.docError}>{error.message}</Text>
              ) : null}
            </View>
          );
        }}
      />
    </>
  );
}