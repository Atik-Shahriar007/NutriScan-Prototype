import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Category, Language } from "@/lib/nutriscan-data";

export type HistoryEntry = { productId: string; scannedAt: string };
export type PrototypeSubmission = {
  id: string;
  name: string;
  brand: string;
  barcode: string;
  category: Category;
  frontPhotoUri?: string;
  backPhotoUri?: string;
  createdAt: string;
  status: "pending-review-demo";
};
export type Appearance = "light" | "dark";
export type ProductReaction = "like" | "dislike";
export type ProfileInfo = { displayName: string; district: string };
export type DemoAccount = { name: string; email: string };
export type HealthProfile = {
  age: string;
  gender: string;
  country: string;
  healthConditions: string[];
  dietaryRestrictions: string[];
  foodAllergies: string[];
  foodIntolerances: string[];
  nutritionGoals: string[];
  avoidFoods: string[];
};
export type ExpiryReminder = {
  id: string;
  productName: string;
  expiryDate: string;
  addedAt: string;
};
export type NouriMessage = {
  id: string;
  role: "user" | "nouri";
  text: string;
  timestamp: string;
};

type StoredState = {
  language: Language;
  history: HistoryEntry[];
  submissions: PrototypeSubmission[];
  favorites: string[];
  appearance: Appearance;
  halalMode: boolean;
  profile: ProfileInfo;
  productReactions: Record<string, ProductReaction>;
  isAuthenticated: boolean;
  hasCompletedOnboarding: boolean;
  demoAccount: DemoAccount;
  healthProfile: HealthProfile;
  isPremium: boolean;
  childSafeMode: boolean;
  expiryReminders: ExpiryReminder[];
  savedTips: string[];
  nouriHistory: NouriMessage[];
  compareIds: string[];
};

type AppState = StoredState & {
  ready: boolean;
  setLanguage: (language: Language) => void;
  setAppearance: (appearance: Appearance) => void;
  halalMode: boolean;
  setHalalMode: (enabled: boolean) => void;
  recordScan: (productId: string) => void;
  clearHistory: () => void;
  addSubmission: (submission: Omit<PrototypeSubmission, "id" | "createdAt" | "status">) => void;
  toggleFavorite: (productId: string) => void;
  updateProfile: (profile: Partial<ProfileInfo>) => void;
  setProductReaction: (productId: string, reaction: ProductReaction) => void;
  setIsAuthenticated: (v: boolean) => void;
  setHasCompletedOnboarding: (v: boolean) => void;
  setDemoAccount: (v: Partial<DemoAccount>) => void;
  setHealthProfile: (v: Partial<HealthProfile>) => void;
  setIsPremium: (v: boolean) => void;
  setChildSafeMode: (v: boolean) => void;
  addExpiryReminder: (reminder: Omit<ExpiryReminder, "id" | "addedAt">) => void;
  removeExpiryReminder: (id: string) => void;
  toggleSavedTip: (tipId: string) => void;
  addNouriMessage: (msg: Omit<NouriMessage, "id" | "timestamp">) => void;
  clearNouriHistory: () => void;
  addToCompare: (productId: string) => void;
  setCompareSlot: (slot: 0 | 1, productId: string | null) => void;
  swapCompareSlots: () => void;
  clearCompare: () => void;
};

const STORAGE_KEY = "nutriscan-prototype-state-v1";
const EMPTY_PROFILE: ProfileInfo = { displayName: "", district: "" };
const DEFAULT_DEMO_ACCOUNT: DemoAccount = { name: "Atik Rahman", email: "demo@nutriscan.app" };
const DEFAULT_HEALTH_PROFILE: HealthProfile = {
  age: "24",
  gender: "prefer-not-to-say",
  country: "Bangladesh",
  healthConditions: [],
  dietaryRestrictions: [],
  foodAllergies: [],
  foodIntolerances: [],
  nutritionGoals: ["balanced-nutrition"],
  avoidFoods: [],
};
const AppStateContext = createContext<AppState | null>(null);

export function NutriScanProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [submissions, setSubmissions] = useState<PrototypeSubmission[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [appearance, setAppearance] = useState<Appearance>("light");
  const [halalMode, setHalalMode] = useState(false);
  const [profile, setProfile] = useState<ProfileInfo>(EMPTY_PROFILE);
  const [productReactions, setProductReactions] = useState<Record<string, ProductReaction>>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [demoAccount, setDemoAccountState] = useState<DemoAccount>(DEFAULT_DEMO_ACCOUNT);
  const [healthProfile, setHealthProfileState] = useState<HealthProfile>(DEFAULT_HEALTH_PROFILE);
  const [isPremium, setIsPremium] = useState(false);
  const [childSafeMode, setChildSafeMode] = useState(false);
  const [expiryReminders, setExpiryReminders] = useState<ExpiryReminder[]>([]);
  const [savedTips, setSavedTips] = useState<string[]>([]);
  const [nouriHistory, setNouriHistory] = useState<NouriMessage[]>([]);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((value) => {
        if (!active || !value) return;
        try {
          const parsed = JSON.parse(value) as Partial<StoredState>;
          if (parsed.language === "en" || parsed.language === "bn") setLanguage(parsed.language);
          if (Array.isArray(parsed.history)) setHistory(parsed.history);
          if (Array.isArray(parsed.submissions)) setSubmissions(parsed.submissions);
          if (Array.isArray(parsed.favorites) && parsed.favorites.every((id) => typeof id === "string")) setFavorites(parsed.favorites);
          if (parsed.appearance === "light" || parsed.appearance === "dark") setAppearance(parsed.appearance);
          if (typeof parsed.halalMode === "boolean") setHalalMode(parsed.halalMode);
          if (parsed.profile && typeof parsed.profile.displayName === "string" && typeof parsed.profile.district === "string") {
            setProfile({ displayName: parsed.profile.displayName, district: parsed.profile.district });
          }
          if (parsed.productReactions && typeof parsed.productReactions === "object" && !Array.isArray(parsed.productReactions)) {
            const validReactions = Object.fromEntries(
              Object.entries(parsed.productReactions).filter((entry): entry is [string, ProductReaction] => entry[1] === "like" || entry[1] === "dislike"),
            );
            setProductReactions(validReactions);
          }
          if (typeof parsed.isAuthenticated === "boolean") setIsAuthenticated(parsed.isAuthenticated);
          if (typeof parsed.hasCompletedOnboarding === "boolean") setHasCompletedOnboarding(parsed.hasCompletedOnboarding);
          if (parsed.demoAccount && typeof parsed.demoAccount.name === "string" && typeof parsed.demoAccount.email === "string") {
            setDemoAccountState({ name: parsed.demoAccount.name, email: parsed.demoAccount.email });
          }
          if (parsed.healthProfile && typeof parsed.healthProfile === "object") {
            setHealthProfileState((current) => ({
              ...current,
              ...parsed.healthProfile,
            }));
          }
          if (typeof parsed.isPremium === "boolean") setIsPremium(parsed.isPremium);
          if (typeof parsed.childSafeMode === "boolean") setChildSafeMode(parsed.childSafeMode);
          if (Array.isArray(parsed.expiryReminders)) setExpiryReminders(parsed.expiryReminders);
          if (Array.isArray(parsed.savedTips) && parsed.savedTips.every((id) => typeof id === "string")) setSavedTips(parsed.savedTips);
          if (Array.isArray(parsed.nouriHistory)) setNouriHistory(parsed.nouriHistory);
          if (Array.isArray(parsed.compareIds) && parsed.compareIds.every((id) => typeof id === "string")) setCompareIds(parsed.compareIds.slice(0, 2));
        } catch {
          // Ignore malformed prototype data; the user can continue with a clean local state.
        }
      })
      .finally(() => {
        if (active) setReady(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    const payload: StoredState = {
      language,
      history,
      submissions,
      favorites,
      appearance,
      halalMode,
      profile,
      productReactions,
      isAuthenticated,
      hasCompletedOnboarding,
      demoAccount,
      healthProfile,
      isPremium,
      childSafeMode,
      expiryReminders,
      savedTips,
      nouriHistory,
      compareIds,
    };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => undefined);
  }, [
    language,
    history,
    submissions,
    favorites,
    appearance,
    halalMode,
    profile,
    productReactions,
    isAuthenticated,
    hasCompletedOnboarding,
    demoAccount,
    healthProfile,
    isPremium,
    childSafeMode,
    expiryReminders,
    savedTips,
    nouriHistory,
    compareIds,
    ready,
  ]);

  const recordScan = useCallback((productId: string) => {
    setHistory((current) => [
      { productId, scannedAt: new Date().toISOString() },
      ...current.filter((entry) => entry.productId !== productId),
    ].slice(0, 50));
  }, []);

  const setDemoAccount = useCallback((v: Partial<DemoAccount>) => {
    setDemoAccountState((current) => ({ ...current, ...v }));
  }, []);

  const setHealthProfile = useCallback((v: Partial<HealthProfile>) => {
    setHealthProfileState((current) => ({ ...current, ...v }));
  }, []);

  const addExpiryReminder = useCallback((reminder: Omit<ExpiryReminder, "id" | "addedAt">) => {
    setExpiryReminders((current) => [
      {
        ...reminder,
        id: `exp-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        addedAt: new Date().toISOString(),
      },
      ...current,
    ]);
  }, []);

  const removeExpiryReminder = useCallback((id: string) => {
    setExpiryReminders((current) => current.filter((item) => item.id !== id));
  }, []);

  const toggleSavedTip = useCallback((tipId: string) => {
    setSavedTips((current) =>
      current.includes(tipId) ? current.filter((id) => id !== tipId) : [tipId, ...current],
    );
  }, []);

  const addNouriMessage = useCallback((msg: Omit<NouriMessage, "id" | "timestamp">) => {
    setNouriHistory((current) => [
      ...current,
      {
        ...msg,
        id: `nouri-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, []);

  const clearNouriHistory = useCallback(() => {
    setNouriHistory([]);
  }, []);

  const addToCompare = useCallback((productId: string) => {
    setCompareIds((current) => {
      if (current.includes(productId)) return current;
      if (current.length < 2) return [...current, productId];
      return [current[1], productId];
    });
  }, []);

  const setCompareSlot = useCallback((slot: 0 | 1, productId: string | null) => {
    setCompareIds((current) => {
      const first = current[0] ?? null;
      const second = current[1] ?? null;
      const slots: [string | null, string | null] = [first, second];

      if (productId === null) {
        slots[slot] = null;
      } else {
        const otherSlot = slot === 0 ? 1 : 0;
        if (slots[otherSlot] === productId) {
          slots[otherSlot] = slots[slot];
        }
        slots[slot] = productId;
      }
      return slots.filter((id): id is string => Boolean(id));
    });
  }, []);

  const swapCompareSlots = useCallback(() => {
    setCompareIds((current) => (current.length === 2 ? [current[1], current[0]] : current));
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
  }, []);

  const value = useMemo<AppState>(
    () => ({
      language,
      history,
      submissions,
      favorites,
      appearance,
      profile,
      productReactions,
      isAuthenticated,
      hasCompletedOnboarding,
      demoAccount,
      healthProfile,
      isPremium,
      childSafeMode,
      expiryReminders,
      savedTips,
      nouriHistory,
      compareIds,
      ready,
      setLanguage,
      setAppearance,
      halalMode,
      setHalalMode,
      recordScan,
      clearHistory: () => setHistory([]),
      addSubmission: (submission) => {
        setSubmissions((current) => [
          {
            ...submission,
            id: `local-${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: "pending-review-demo",
          },
          ...current,
        ]);
      },
      toggleFavorite: (productId) => {
        setFavorites((current) => current.includes(productId)
          ? current.filter((id) => id !== productId)
          : [productId, ...current]);
      },
      updateProfile: (nextProfile) => setProfile((current) => ({ ...current, ...nextProfile })),
      setProductReaction: (productId, reaction) => {
        setProductReactions((current) => {
          const next = { ...current };
          if (next[productId] === reaction) delete next[productId];
          else next[productId] = reaction;
          return next;
        });
      },
      setIsAuthenticated,
      setHasCompletedOnboarding,
      setDemoAccount,
      setHealthProfile,
      setIsPremium,
      setChildSafeMode,
      addExpiryReminder,
      removeExpiryReminder,
      toggleSavedTip,
      addNouriMessage,
      clearNouriHistory,
      addToCompare,
      setCompareSlot,
      swapCompareSlots,
      clearCompare,
    }),
    [
      language,
      history,
      submissions,
      favorites,
      appearance,
      halalMode,
      profile,
      productReactions,
      isAuthenticated,
      hasCompletedOnboarding,
      demoAccount,
      healthProfile,
      isPremium,
      childSafeMode,
      expiryReminders,
      savedTips,
      nouriHistory,
      compareIds,
      ready,
      recordScan,
      setDemoAccount,
      setHealthProfile,
      addExpiryReminder,
      removeExpiryReminder,
      toggleSavedTip,
      addNouriMessage,
      clearNouriHistory,
      addToCompare,
      setCompareSlot,
      swapCompareSlots,
      clearCompare,
    ],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useNutriScan() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useNutriScan must be used inside NutriScanProvider");
  return value;
}
