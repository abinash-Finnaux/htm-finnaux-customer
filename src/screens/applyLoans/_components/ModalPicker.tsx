import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Check, Search, X } from 'lucide-react-native';
import { useTheme } from '../../../context/ThemeContext';
import type { createStyles } from '../styles';

type Props = {
  visible: boolean;
  title: string;
  options: string[];
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
  themed: ReturnType<typeof createStyles>;
};

export default function ModalPicker({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
  themed,
}: Props) {
  const { theme } = useTheme();
  const { colors } = theme;
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q
      ? options.filter(option => option.toLowerCase().includes(q))
      : options;
  }, [options, query]);

  const handleSelect = (option: string) => {
    onSelect(option);
    setQuery('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={themed.pickerOverlay}>
        <Pressable style={themed.pickerOverlay} onPress={() => { setQuery(''); onClose(); }} />
        <View style={[themed.pickerSheet, { backgroundColor: colors.surface }]}>
          <View style={themed.pickerHandle} />
          <View style={themed.pickerHeader}>
            <Text style={themed.pickerTitle}>{title}</Text>
            <Pressable
              onPress={onClose}
              style={({ pressed }) => [
                themed.pickerClose,
                { backgroundColor: colors.surfaceElevated },
                { opacity: pressed ? 0.6 : 1 },
              ]}
            >
              <X size={16} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View style={themed.pickerSearch}>
            <Search size={16} color={colors.textSecondary} />
            <TextInput
              style={themed.pickerSearchInput}
              placeholder="Search…"
              placeholderTextColor={colors.textSecondary}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>

          {options.length === 0 ? (
            <Text style={themed.pickerEmpty}>No options available</Text>
          ) : filtered.length === 0 ? (
            <Text style={themed.pickerEmpty}>No matches found</Text>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={item => item}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={themed.pickerList}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => {
                const selected = value === item;
                return (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    style={({ pressed }) => [
                      themed.pickerItem,
                      pressed && themed.pickerItemPressed,
                    ]}
                  >
                    <Text
                      style={[
                        themed.pickerItemText,
                        selected && themed.pickerItemTextSelected,
                      ]}
                    >
                      {item}
                    </Text>
                    {selected ? (
                      <Check size={16} color={colors.primary} />
                    ) : null}
                  </Pressable>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}