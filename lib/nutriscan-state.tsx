import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
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

type StoredState = {
  language: Language;
  history: HistoryEntry[];
  submissions: PrototypeSubmission[];
  favorites: string[];
  appearance: Appearance;
  halalMode: boolean;
  profile: ProfileInfo;
  productReactions: Record<string, ProductReaction>;
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
};

const STORAGE_KEY = "nutriscan-prototype-state-v1";
const EMPTY_PROFILE: ProfileInfo = { displayName: "", district: "" };
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
    const payload: StoredState = { language, history, submissions, favorites, appearance, halalMode, profile, productReactions };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => undefined);
  }, [language, history, submissions, favorites, appearance, halalMode, profile, productReactions, ready]);

  const value = useMemo<AppState>(
    () => ({
      language,
      history,
      submissions,
      favorites,
      appearance,
      profile,
      productReactions,
      ready,
      setLanguage,
      setAppearance,
      halalMode,
      setHalalMode,
      recordScan: (productId) => {
        setHistory((current) => [
          { productId, scannedAt: new Date().toISOString() },
          ...current.filter((entry) => entry.productId !== productId),
        ].slice(0, 50));
      },
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
    }),
    [language, history, submissions, favorites, appearance, halalMode, profile, productReactions, ready],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useNutriScan() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useNutriScan must be used inside NutriScanProvider");
  return value;
}
