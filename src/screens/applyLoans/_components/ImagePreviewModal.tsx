import React from 'react';
import { Image, Modal, Pressable, StyleSheet, View } from 'react-native';
import { X } from 'lucide-react-native';

type Props = {
  uri: string | null;
  onClose: () => void;
};

export default function ImagePreviewModal({ uri, onClose }: Props) {
  return (
    <Modal
      visible={!!uri}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.fill}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          {uri ? (
            <Image
              source={{ uri }}
              style={styles.image}
              resizeMode="contain"
            />
          ) : null}
        </Pressable>
        <Pressable style={styles.closeBtn} onPress={onClose}>
          <X size={22} color="#FFFFFF" />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.94)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '85%',
  },
  closeBtn: {
    position: 'absolute',
    top: 52,
    right: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});