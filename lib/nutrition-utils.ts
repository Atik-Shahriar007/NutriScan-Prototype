import type { Language, NutritionItem } from "./nutriscan-data";

export const ALLERGEN_KEYWORDS = [
  "wheat",
  "gluten",
  "milk",
  "dairy",
  "egg",
  "soy",
  "peanut",
  "nut",
  "fish",
  "shellfish",
  "seasoning",
  "গম",
  "দুধ",
  "ডিম",
  "সয়া",
  "বাদাম",
  "মাছ",
];

export const POSITIVE_INGREDIENT_KEYWORDS = [
  "mango",
  "pulp",
  "puree",
  "juice",
  "tea",
  "potato",
  "chilli",
  "water",
  "oat",
  "milk",
  "আম",
  "পাল্প",
  "পিউরি",
  "জুস",
  "চা",
  "আলু",
  "মরিচ",
  "পানি",
];

export const ADDITIVE_KEYWORDS = [
  "regulator",
  "preservative",
  "color",
  "colour",
  "flavour",
  "flavor",
  "raising agent",
  "starch",
  "seasoning",
  "masala",
  "palm oil",
  "sugar",
  "নিয়ন্ত্রক",
  "সংরক্ষণ",
  "রং",
  "সিজনিং",
  "স্টার্চ",
  "ফুলানোর",
  "পাম তেল",
  "চিনি",
];

const BENGALI_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function formatLocalizedNumber(value: number, language: Language, maxDecimals = 2): string {
  const raw = Number(value.toFixed(maxDecimals)).toString();
  if (language === "en") return raw;
  return raw.replace(/\d/g, (d) => BENGALI_DIGITS[Number(d)] ?? d);
}

export function gramsToTeaspoons(grams: number): number {
  return grams / 4;
}

export function formatTeaspoonCount(tsp: number, language: Language): string {
  return formatLocalizedNumber(tsp, language, 2);
}

export function parseNutritionNumber(amountEn: string): number | null {
  const match = amountEn.match(/(\d+(?:\.\d+)?)/);
  if (!match) return null;
  const parsed = Number(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}

export function parseAddedSugarGrams(item: NutritionItem): number | null {
  const labelEn = item.label.en.toLowerCase();
  if (!labelEn.includes("added sugar")) return null;
  const match = item.amount.en.match(/(\d+(?:\.\d+)?)\s*g\b/i);
  if (!match) return null;
  const grams = Number(match[1]);
  return Number.isFinite(grams) ? grams : null;
}

export function parseAddedSugarTeaspoons(item: NutritionItem): number | null {
  const grams = parseAddedSugarGrams(item);
  return grams === null ? null : gramsToTeaspoons(grams);
}

export function isAllergenIngredient(nameEn: string, nameBn: string): boolean {
  const combined = `${nameEn} ${nameBn}`.toLowerCase();
  return ALLERGEN_KEYWORDS.some((kw) => combined.includes(kw));
}

export function isPositiveIngredient(nameEn: string, nameBn: string): boolean {
  const combined = `${nameEn} ${nameBn}`.toLowerCase();
  return POSITIVE_INGREDIENT_KEYWORDS.some((kw) => combined.includes(kw));
}

export function isAdditiveOrConcernIngredient(nameEn: string, nameBn: string): boolean {
  const combined = `${nameEn} ${nameBn}`.toLowerCase();
  return ADDITIVE_KEYWORDS.some((kw) => combined.includes(kw));
}

export function scoreCategoryLabel(score: number, language: Language): string {
  if (score >= 75) return language === "en" ? "Excellent" : "চমৎকার";
  if (score >= 60) return language === "en" ? "Good" : "ভালো";
  if (score >= 50) return language === "en" ? "Fair" : "মোটামুটি";
  if (score >= 35) return language === "en" ? "Check Label" : "লেবেল দেখুন";
  return language === "en" ? "Poor" : "দুর্বল";
}
