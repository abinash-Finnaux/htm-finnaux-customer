import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  Image,
  PermissionsAndroid,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../context/ThemeContext';
import logo from '../assets/images/logo.png';

const STORAGE_KEY = '@finnaux_permissions';

type PermissionKey = 'location' | 'phone' | 'camera' | 'file';

type PermissionItem = {
  key: PermissionKey;
  icon: string;
  title: string;
  description: string;
};

const PERMISSIONS: PermissionItem[] = [
  {
    key: 'location',
    icon: '📍',
    title: 'Location Access',
    description:
      'We use your location to find nearby services and provide personalized offers in your area.',
  },
  {
    key: 'phone',
    icon: '📱',
    title: 'Phone State',
    description:
      'We need phone state access to verify your device and secure your account.',
  },
  {
    key: 'camera',
    icon: '📸',
    title: 'Camera Access',
    description:
      'Scan QR codes, capture documents, and upload profile photos with camera access.',
  },
  {
    key: 'file',
    icon: '📁',
    title: 'Storage Access',
    description:
      'Access your files to upload documents, statements, and receipts securely.',
  },
];

type GrantedPermissions = Record<PermissionKey, boolean>;

const EMPTY_GRANTED: GrantedPermissions = {
  location: false,
  phone: false,
  camera: false,
  file: false,
};

/**
 * Load our locally saved permission state.
 *
 * IMPORTANT:
 * The Android OS permission state is checked separately.
 * AsyncStorage should not be treated as the actual Android permission state.
 */
async function loadGranted(): Promise<GrantedPermissions> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return EMPTY_GRANTED;
    }

    const parsed = JSON.parse(raw);

    return {
      ...EMPTY_GRANTED,
      ...parsed,
    };
  } catch (error) {
    console.log('loadGranted error:', error);
    return EMPTY_GRANTED;
  }
}

async function saveGranted(granted: GrantedPermissions) {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(granted));
  } catch (error) {
    console.log('saveGranted error:', error);
  }
}

/**
 * Get the Android permission required for each item.
 */
const getAndroidPermission = (key: PermissionKey): string | null => {
  if (Platform.OS !== 'android') {
    return null;
  }

  switch (key) {
    case 'location':
      return PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION;

    case 'phone':
      return PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE;

    case 'camera':
      return PermissionsAndroid.PERMISSIONS.CAMERA;

    case 'file':
      /**
       * Android 13+ uses READ_MEDIA_IMAGES instead of
       * READ_EXTERNAL_STORAGE for images.
       *
       * For PDF/documents, Android's document picker normally
       * does NOT require storage permission.
       */
      if (Platform.Version >= 33) {
        return PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES;
      }

      return PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    default:
      return null;
  }
};

/**
 * Check the actual Android permission state.
 */
const checkAndroidPermission = async (key: PermissionKey): Promise<boolean> => {
  if (Platform.OS !== 'android') {
    return true;
  }

  /**
   * File/document access:
   * On newer Android versions, document pickers can access files
   * without a broad storage permission.
   */
  if (key === 'file' && Platform.Version >= 33) {
    return true;
  }

  const permission = getAndroidPermission(key);

  if (!permission) {
    return true;
  }

  try {
    return await PermissionsAndroid.check(permission as any);
  } catch (error) {
    console.log(`Permission check failed for ${key}:`, error);
    return false;
  }
};

/**
 * Request actual Android permission.
 */
const requestAndroidPermission = async (
  key: PermissionKey,
): Promise<boolean> => {
  /**
   * iOS / other platforms.
   */
  if (Platform.OS !== 'android') {
    return true;
  }

  /**
   * Android 13+:
   *
   * If you use a document picker for PDFs/files, no storage
   * permission is required.
   */
  if (key === 'file' && Platform.Version >= 33) {
    return true;
  }

  const permission = getAndroidPermission(key);

  if (!permission) {
    return true;
  }

  try {
    const alreadyGranted = await PermissionsAndroid.check(permission as any);

    if (alreadyGranted) {
      return true;
    }

    const result = await PermissionsAndroid.request(permission as any);

    console.log(`Permission result for ${key}:`, result);

    return result === PermissionsAndroid.RESULTS.GRANTED;
  } catch (error) {
    console.log(`Permission request failed for ${key}:`, error);
    return false;
  }
};

export default function PermissionScreen({ navigation }: any) {
  const { theme } = useTheme();

  const { colors, spacing, radius, typography } = theme;

  const [loading, setLoading] = useState(true);

  const [granted, setGranted] = useState<GrantedPermissions>(EMPTY_GRANTED);

  const [phase, setPhase] = useState<'intro' | 'permissions' | 'done'>('intro');

  const [currentIndex, setCurrentIndex] = useState(0);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const slideAnim = useRef(new Animated.Value(60)).current;

  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  const progressAnim = useRef(new Animated.Value(0)).current;

  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * ---------------------------------------------------------
   * Animation
   * ---------------------------------------------------------
   */

  const animateIn = useCallback(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(60);
    scaleAnim.setValue(0.85);

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),

      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  /**
   * ---------------------------------------------------------
   * Load actual Android permission states
   * ---------------------------------------------------------
   */

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const saved = await loadGranted();

        const actualPermissions: GrantedPermissions = {
          location: await checkAndroidPermission('location'),
          phone: await checkAndroidPermission('phone'),
          camera: await checkAndroidPermission('camera'),
          file: await checkAndroidPermission('file'),
        };

        /**
         * Combine saved state and actual Android state.
         *
         * Actual Android permission is the source of truth.
         */
        const finalGranted: GrantedPermissions = {
          location: actualPermissions.location || saved.location,

          phone: actualPermissions.phone || saved.phone,

          camera: actualPermissions.camera || saved.camera,

          file: actualPermissions.file || saved.file,
        };

        if (!mounted) {
          return;
        }

        setGranted(finalGranted);

        await saveGranted(finalGranted);

        /**
         * If everything is already available,
         * directly go to Login.
         */
        const allDone = PERMISSIONS.every(
          permission => finalGranted[permission.key],
        );

        if (allDone) {
          navigation.replace('Login');
          return;
        }

        setLoading(false);
      } catch (error) {
        console.log('Permission initialization error:', error);

        if (mounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;

      if (navigationTimer.current) {
        clearTimeout(navigationTimer.current);
      }
    };
  }, [navigation]);

  /**
   * ---------------------------------------------------------
   * Animation when screen/permission changes
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!loading) {
      animateIn();
    }
  }, [phase, currentIndex, loading, animateIn]);

  /**
   * ---------------------------------------------------------
   * Pending permissions
   * ---------------------------------------------------------
   */

  const pendingPermissions = PERMISSIONS.filter(
    permission => !granted[permission.key],
  );

  const totalCount = pendingPermissions.length;

  /**
   * IMPORTANT:
   *
   * We always protect the index.
   */
  const safeIndex = totalCount > 0 ? Math.min(currentIndex, totalCount - 1) : 0;

  /**
   * IMPORTANT:
   *
   * perm can be undefined when the last permission
   * was granted.
   */
  const perm = pendingPermissions[safeIndex];

  /**
   * ---------------------------------------------------------
   * Progress
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (phase === 'permissions' && totalCount > 0) {
      Animated.timing(progressAnim, {
        toValue: (safeIndex + 1) / totalCount,
        duration: 400,
        useNativeDriver: false,
      }).start();
    }
  }, [phase, safeIndex, progressAnim, totalCount]);

  /**
   * ---------------------------------------------------------
   * Agree
   * ---------------------------------------------------------
   */

  const handleAgree = () => {
    if (pendingPermissions.length === 0) {
      navigation.replace('Login');
      return;
    }

    setCurrentIndex(0);
    setPhase('permissions');
  };

  /**
   * ---------------------------------------------------------
   * Disagree
   * ---------------------------------------------------------
   */

  const handleDisagree = async () => {
    await saveGranted(granted);

    navigation.replace('Login');
  };

  /**
   * ---------------------------------------------------------
   * Finish
   * ---------------------------------------------------------
   */

  const finishPermissions = async (updated: GrantedPermissions) => {
    setGranted(updated);

    await saveGranted(updated);

    setPhase('done');

    navigationTimer.current = setTimeout(() => {
      navigation.replace('Login');
    }, 1200);
  };

  /**
   * ---------------------------------------------------------
   * Allow permission
   * ---------------------------------------------------------
   */

  const handleAllow = async () => {
    if (!perm) {
      /**
       * Safety check.
       *
       * This prevents:
       *
       * Cannot read property 'icon' of undefined
       */
      setPhase('done');

      navigationTimer.current = setTimeout(() => {
        navigation.replace('Login');
      }, 500);

      return;
    }

    /**
     * Ask Android for the real permission.
     */
    const isGranted = await requestAndroidPermission(perm.key);

    if (isGranted) {
      const updated: GrantedPermissions = {
        ...granted,
        [perm.key]: true,
      };

      setGranted(updated);

      await saveGranted(updated);

      /**
       * Check whether all permissions are done.
       */
      const allDone = PERMISSIONS.every(permission => updated[permission.key]);

      if (allDone) {
        await finishPermissions(updated);
        return;
      }

      /**
       * Move to next pending permission.
       *
       * Since pendingPermissions will be recalculated
       * after setGranted, index 0 is the safest approach.
       */
      setCurrentIndex(0);
    } else {
      /**
       * Permission denied.
       *
       * We don't mark it as granted.
       *
       * User can use Skip for now.
       */
      console.log(`Permission denied: ${perm.key}`);
    }
  };

  /**
   * ---------------------------------------------------------
   * Skip
   * ---------------------------------------------------------
   */

  const handleSkip = async () => {
    /**
     * If there is another permission,
     * go to next permission.
     */
    if (currentIndex < totalCount - 1) {
      setCurrentIndex(previous => previous + 1);
      return;
    }

    /**
     * No more permissions.
     */
    await saveGranted(granted);

    setPhase('done');

    navigationTimer.current = setTimeout(() => {
      navigation.replace('Login');
    }, 1200);
  };

  /**
   * ---------------------------------------------------------
   * If permissions become empty
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (phase === 'permissions' && pendingPermissions.length === 0) {
      setPhase('done');

      navigationTimer.current = setTimeout(() => {
        navigation.replace('Login');
      }, 1200);
    }
  }, [phase, pendingPermissions.length, navigation]);

  /**
   * ---------------------------------------------------------
   * Loading
   * ---------------------------------------------------------
   */

  if (loading) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  /**
   * ---------------------------------------------------------
   * INTRO SCREEN
   * ---------------------------------------------------------
   */

  if (phase === 'intro') {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.introWrapper}>
          <Animated.View
            style={[
              styles.introContent,
              {
                opacity: fadeAnim,
                transform: [
                  {
                    translateX: slideAnim,
                  },
                  {
                    scale: scaleAnim,
                  },
                ],
              },
            ]}
          >
            {/* Logo */}
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: colors.primary + '15',
                  marginBottom: spacing.xl,
                },
              ]}
            >
              <Image source={logo} style={styles.logo} resizeMode="contain" />
            </View>

            {/* Title */}
            <Text
              style={[
                styles.introTitle,
                {
                  color: colors.text,
                  marginBottom: spacing.sm,
                },
              ]}
            >
              Enable Permissions
            </Text>

            {/* Description */}
            <Text
              style={[
                styles.introDescription,
                {
                  color: colors.textSecondary,
                  marginBottom: spacing.xxl,
                },
              ]}
            >
              To provide you with the best experience, we need access to a few
              device features. You can change these anytime in Settings.
            </Text>

            {/* Permission chips */}
            <View style={styles.featureGrid}>
              {PERMISSIONS.map(permission => {
                const isGranted = granted[permission.key];

                return (
                  <View
                    key={permission.key}
                    style={[
                      styles.featureChip,
                      {
                        backgroundColor: isGranted
                          ? colors.success + '12'
                          : colors.surface,

                        borderColor: isGranted ? colors.success : colors.border,

                        borderRadius: radius.md,
                      },
                    ]}
                  >
                    <Text style={styles.featureChipIcon}>
                      {isGranted ? '✅' : permission.icon}
                    </Text>

                    <Text
                      style={[
                        styles.featureChipLabel,
                        {
                          color: isGranted ? colors.success : colors.text,

                          fontSize: typography.small,
                        },
                      ]}
                    >
                      {permission.title}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Agree */}
            <Pressable
              onPress={handleAgree}
              style={({ pressed }) => [
                styles.agreeButton,
                {
                  backgroundColor: colors.primary,

                  borderRadius: radius.pill,

                  marginTop: spacing.xxl,

                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text
                style={[
                  styles.agreeButtonText,
                  {
                    color: colors.onPrimary,
                    fontSize: typography.body,
                  },
                ]}
              >
                {totalCount === PERMISSIONS.length
                  ? 'I Agree'
                  : `Allow Remaining (${totalCount})`}
              </Text>
            </Pressable>

            {/* Later */}
            <Pressable
              onPress={handleDisagree}
              style={({ pressed }) => [
                styles.disagreeButton,
                {
                  borderRadius: radius.pill,
                  marginTop: spacing.md,
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: typography.caption,
                }}
              >
                I'll do it later
              </Text>
            </Pressable>
          </Animated.View>
        </View>
      </View>
    );
  }

  /**
   * ---------------------------------------------------------
   * DONE SCREEN
   * ---------------------------------------------------------
   */

  if (phase === 'done') {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.introWrapper}>
          <Animated.View
            style={[
              styles.introContent,
              {
                opacity: fadeAnim,

                transform: [
                  {
                    scale: scaleAnim,
                  },
                ],
              },
            ]}
          >
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: colors.success + '15',
                },
              ]}
            >
              <Text style={styles.doneCheck}>✓</Text>
            </View>

            <Text
              style={[
                styles.introTitle,
                {
                  color: colors.text,
                  marginTop: spacing.lg,
                },
              ]}
            >
              All Set!
            </Text>

            <Text
              style={[
                styles.introDescription,
                {
                  color: colors.textSecondary,
                  marginTop: spacing.sm,
                },
              ]}
            >
              Permissions configured successfully. Let's get started.
            </Text>
          </Animated.View>
        </View>
      </View>
    );
  }

  /**
   * ---------------------------------------------------------
   * SAFETY CHECK
   *
   * This is the important fix for your crash.
   *
   * If pendingPermissions becomes empty, don't try:
   *
   * perm.icon
   *
   * ---------------------------------------------------------
   */

  if (!perm) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
          },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  /**
   * ---------------------------------------------------------
   * PERMISSION SCREEN
   * ---------------------------------------------------------
   */

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
    >
      <View style={styles.permWrapper}>
        <Animated.View
          style={[
            styles.permContent,
            {
              opacity: fadeAnim,

              transform: [
                {
                  translateX: slideAnim,
                },
                {
                  scale: scaleAnim,
                },
              ],
            },
          ]}
        >
          {/* Counter */}
          <View style={styles.permHeader}>
            <Text
              style={[
                styles.permCounter,
                {
                  color: colors.textSecondary,
                  fontSize: typography.small,
                },
              ]}
            >
              {safeIndex + 1} of {totalCount}
            </Text>
          </View>

          {/* Progress bar */}
          <View
            style={[
              styles.progressBarTrack,
              {
                backgroundColor: colors.border,

                borderRadius: radius.pill,

                marginTop: spacing.sm,
              },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBarFill,
                {
                  backgroundColor: colors.primary,

                  borderRadius: radius.pill,

                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          </View>

          {/* Dots */}
          <View style={styles.dotsRow}>
            {pendingPermissions.map((permission, index) => (
              <View
                key={permission.key}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index <= safeIndex ? colors.primary : colors.border,

                    borderRadius: radius.pill,
                  },
                ]}
              />
            ))}
          </View>

          {/* Permission icon */}
          <View
            style={[
              styles.permIconCircle,
              {
                backgroundColor: colors.primary + '12',

                marginTop: spacing.xxl,

                marginBottom: spacing.xl,
              },
            ]}
          >
            <Text style={styles.permIcon}>{perm.icon}</Text>
          </View>

          {/* Permission title */}
          <Text
            style={[
              styles.permTitle,
              {
                color: colors.text,
                marginBottom: spacing.sm,
              },
            ]}
          >
            {perm.title}
          </Text>

          {/* Description */}
          <Text
            style={[
              styles.permDescription,
              {
                color: colors.textSecondary,
                marginBottom: spacing.xxl,
              },
            ]}
          >
            {perm.description}
          </Text>

          {/* Allow */}
          <Pressable
            onPress={handleAllow}
            style={({ pressed }) => [
              styles.approveButton,
              {
                backgroundColor: colors.primary,

                borderRadius: radius.pill,

                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.approveButtonText,
                {
                  color: colors.onPrimary,

                  fontSize: typography.body,
                },
              ]}
            >
              Allow
            </Text>
          </Pressable>

          {/* Skip */}
          <Pressable
            onPress={handleSkip}
            style={({ pressed }) => [
              styles.skipButton,
              {
                borderRadius: radius.pill,

                marginTop: spacing.md,

                opacity: pressed ? 0.6 : 1,
              },
            ]}
          >
            <Text
              style={{
                color: colors.textSecondary,

                fontSize: typography.caption,
              }}
            >
              Skip for now
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  introWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },

  introContent: {
    alignItems: 'center',
  },

  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    width: 70,
    height: 70,
  },

  introTitle: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },

  introDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },

  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    gap: 8,
  },

  featureChipIcon: {
    fontSize: 18,
  },

  featureChipLabel: {
    fontWeight: '500',
  },

  agreeButton: {
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
  },

  agreeButtonText: {
    fontWeight: '700',
  },

  disagreeButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },

  permWrapper: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 28,
    justifyContent: 'center',
  },

  permContent: {
    alignItems: 'center',
  },

  permHeader: {
    alignSelf: 'flex-end',
  },

  permCounter: {
    fontWeight: '600',
  },

  progressBarTrack: {
    height: 4,
    width: '100%',
  },

  progressBarFill: {
    height: 4,
  },

  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },

  dot: {
    width: 8,
    height: 8,
  },

  permIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  permIcon: {
    fontSize: 44,
  },

  permTitle: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },

  permDescription: {
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 8,
  },

  approveButton: {
    alignItems: 'center',
    paddingVertical: 16,
    width: '100%',
  },

  approveButtonText: {
    fontWeight: '700',
  },

  skipButton: {
    alignItems: 'center',
    paddingVertical: 10,
  },

  doneCheck: {
    fontSize: 44,
    color: '#22C55E',
    fontWeight: '700',
  },
});
