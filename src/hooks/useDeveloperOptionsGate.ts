import { useEffect, useState } from 'react';
import { AppState, Platform } from 'react-native';
import { isDeveloperModeEnabled } from 'react-native-developer-options';

export type DeveloperOptionsGate = {
  blocked: boolean;
  ready: boolean;
};

export function useDeveloperOptionsGate(): DeveloperOptionsGate {
  const [blocked, setBlocked] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android' || __DEV__) {
      setReady(true);
      return;
    }

    let mounted = true;

    const check = async () => {
      try {
        const enabled = await isDeveloperModeEnabled();
        if (mounted) {
          setBlocked(enabled);
        }
      } catch {
        setBlocked(false);
      } finally {
        if (mounted) {
          setReady(true);
        }
      }
    };

    check();

    const subscription = AppState.addEventListener('change', nextState => {
      if (nextState === 'active') {
        check();
      }
    });

    return () => {
      mounted = false;
      subscription.remove();
    };
  }, []);

  return { blocked, ready };
}