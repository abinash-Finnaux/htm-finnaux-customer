import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CustomerProfile = {
  CustomerId?: number | string;
  CIF?: string;
  Customer_Name?: string;
  Customer_Gender?: string;
  Customer_PhoneNo?: string;
  Customer_Email?: string;
  Customer_DOB?: string;
  PermanentAddress?: string;
  PresentAddress?: string;
  PAN?: string;
  Aadhaar?: string;
};

interface UserContextValue {
  user: CustomerProfile | null;
  setUser: (user: CustomerProfile | null) => Promise<void>;
  isLoading: boolean;
}

const USER_STORAGE_KEY = '@finnaux_user';

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<CustomerProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(USER_STORAGE_KEY);
        if (raw) {
          setUserState(JSON.parse(raw));
        }
      } catch {
        // Corrupt/absent cache - ignore
      }
      setIsLoading(false);
    })();
  }, []);

  const setUser = async (nextUser: CustomerProfile | null) => {
    setUserState(nextUser);
    if (nextUser) {
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
    }
  };

  const value = useMemo<UserContextValue>(
    () => ({ user, setUser, isLoading }),
    [user, isLoading],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export function getInitials(name?: string): string {
  const trimmed = (name || '').trim();
  if (!trimmed) {
    return 'CU';
  }
  const parts = trimmed.split(/\s+/).filter(Boolean);
  return (
    parts
      .slice(0, 2)
      .map(part => part.charAt(0).toUpperCase())
      .join('') || 'CU'
  );
}