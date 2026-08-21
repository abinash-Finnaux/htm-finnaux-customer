import React, { useEffect, useRef } from 'react';
import {
  Text,
  View,
  Modal,
  Animated,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../../context/ThemeContext';

import { SLIDE_WIDTH, createDrawerStyles } from './../styles';
import DrawerMenuList, { type DrawerRoute } from './DrawerMenuList';

type Props = {
  visible: boolean;
  onClose: () => void;
  onNavigate: (route: DrawerRoute) => void;
  onLogout: () => void;
};

export default function ProfileDrawerModal({
  visible,
  onClose,
  onNavigate,
  onLogout,
}: Props) {
  const { theme, isDark } = useTheme();
  const { colors } = theme;

  const slideAnim = useRef(new Animated.Value(-SLIDE_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const heroBg = isDark ? '#1E293B' : colors.primary;

  const themed = createDrawerStyles(colors, heroBg);

  useEffect(() => {
    if (!visible) {
      return;
    }
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0,
        damping: 20,
        stiffness: 200,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, slideAnim, overlayAnim]);

  const close = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -SLIDE_WIDTH,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start(() => onClose());
  };

  const handleItemPress = (route: DrawerRoute) => {
    close();
    setTimeout(() => onNavigate(route), 260);
  };

  const handleLogoutPress = () => {
    close();
    setTimeout(onLogout, 260);
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={close}
      animationType="none"
    >
      <Pressable style={themed.root} onPress={close}>
        <Animated.View
          style={[themed.overlay, { opacity: overlayAnim }]}
          pointerEvents="none"
        />

        <Animated.View
          onStartShouldSetResponder={() => true}
          style={[themed.panel, { transform: [{ translateX: slideAnim }] }]}
        >
          <View style={themed.header}>
            <View style={themed.avatar}>
              <Text style={themed.avatarText}>JD</Text>
            </View>
            <Text style={themed.name}>John Doe</Text>
            <Text style={themed.email}>john.doe@email.com</Text>
            <Text style={themed.phone}>+91 98765 43210</Text>
          </View>

          <View style={themed.body}>
            <TouchableOpacity
              style={themed.item}
              activeOpacity={0.6}
              onPress={() => handleItemPress('Profile')}
            >
              <Text style={themed.itemIcon}>👤</Text>
              <Text style={themed.itemLabel}>My Profile</Text>
              <Text style={themed.itemArrow}>›</Text>
            </TouchableOpacity>

            <DrawerMenuList onItemPress={handleItemPress} />

            <View style={themed.divider} />

            <TouchableOpacity
              style={themed.item}
              activeOpacity={0.6}
              onPress={handleLogoutPress}
            >
              <Text style={themed.itemIcon}>🚪</Text>
              <Text style={themed.itemLabelDanger}>Logout</Text>
            </TouchableOpacity>
          </View>

          <View style={themed.footer}>
            <Text style={themed.footerText}>v1.0.0</Text>
          </View>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}
