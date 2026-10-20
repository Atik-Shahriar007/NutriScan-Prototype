import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Category, Language } from "@/lib/nutriscan-data";

export type HistoryEntry = { productId: string; scannedAt: string };
export type PrototypeSubmission = {
  id: string;
  contributorKey?: string;
  name: string;
  brand: string;
  barcode: string;
  category: Category;
  frontPhotoUri?: string;
  backPhotoUri?: string;
  frontImageUrl?: string;
  backImageUrl?: string;
  createdAt: string;
  status: "pending" | "accepted" | "rejected" | "needs-clearer-photo" | "pending-review-demo";
  reviewNote?: string | null;
  pointsAwarded?: number;
};

type StoredState = {
  language: Language;
  history: HistoryEntry[];
  submissions: PrototypeSubmission[];
  contributorKey: string;
};

type AppState = StoredState & {
  ready: boolean;
  contributorKey: string;
  setLanguage: (language: Language) => void;
  recordScan: (productId: string) => void;
  clearHistory: () => void;
  addSubmission: (submission: Omit<PrototypeSubmission, "id" | "createdAt" | "status">) => void;
};

const STORAGE_KEY = "nutriscan-prototype-state-v1";
const AppStateContext = createContext<AppState | null>(null);

function createContributorKey() {
  return `contributor-${Date.now()}-${Math.random().toString(36).slice(2, 14)}`;
}

export function NutriScanProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [submissions, setSubmissions] = useState<PrototypeSubmission[]>([]);
  const [contributorKey, setContributorKey] = useState(createContributorKey);
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
          if (typeof parsed.contributorKey === "string" && parsed.contributorKey.length >= 16) setContributorKey(parsed.contributorKey);
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
    const payload: StoredState = { language, history, submissions, contributorKey };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload)).catch(() => undefined);
  }, [language, history, submissions, contributorKey, ready]);

  const value = useMemo<AppState>(
    () => ({
      language,
      history,
      submissions,
      contributorKey,
      ready,
      setLanguage,
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
    }),
    [language, history, submissions, contributorKey, ready],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useNutriScan() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useNutriScan must be used inside NutriScanProvider");
  return value;
}
