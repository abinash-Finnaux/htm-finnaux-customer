import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  Animated,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

export type ToastType = 'success' | 'error' | 'info';

type ToastItem = {
  id: number;
  message: string;
  type: ToastType;
};

type ShowToastFn = (message: string, type?: ToastType) => void;

export type ToastContextValue = {
  show: ShowToastFn;
};

const DURATION = 2600;

const TYPE_CONFIG: Record<ToastType, { icon: string; color: string }> = {
  success: { icon: '✓', color: '#059669' },
  error: { icon: '✕', color: '#DC2626' },
  info: { icon: 'ℹ', color: '#2563EB' },
};

let showToastFn: ShowToastFn | null = null;

export const toast: { show: ShowToastFn } = {
  show: (message, type = 'info') => {
    showToastFn?.(message, type);
  },
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const show = useMemo<ShowToastFn>(
    () => (message, type = 'info') => {
      const id = ++idRef.current;
      setItems(prev => [...prev, { id, message, type }]);
      setTimeout(() => {
        setItems(prev => prev.filter(item => item.id !== id));
      }, DURATION);
    },
    [],
  );

  useEffect(() => {
    showToastFn = show;
    return () => {
      showToastFn = null;
    };
  }, [show]);

  const contextValue = useMemo<ToastContextValue>(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      {items.length > 0 && <ToastHost items={items} />}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

function ToastHost({ items }: { items: ToastItem[] }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      pointerEvents="none"
      style={[styles.host, { top: insets.top + 8 }]}
    >
      {items.map(item => (
        <ToastPill key={item.id} item={item} />
      ))}
    </View>
  );
}

function ToastPill({ item }: { item: ToastItem }) {
  const { theme } = useTheme();
  const { colors } = theme;
  const config = TYPE_CONFIG[item.type];

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        damping: 16,
        stiffness: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY]);

  return (
    <Animated.View
      style={[
        styles.pill,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: config.color,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <View style={[styles.icon, { backgroundColor: config.color }]}>
        <Text style={styles.iconText}>{config.icon}</Text>
      </View>
      <Text style={[styles.message, { color: colors.text }]} numberOfLines={4}>
        {item.message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  host: {
    position: 'absolute',
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    maxWidth: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 6,
  },
  icon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  iconText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  message: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});