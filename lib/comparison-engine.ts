import type { Language, Localized, NutritionItem, Product } from "./nutriscan-data";
import type { HealthProfile } from "./nutriscan-state";
import {
  formatLocalizedNumber,
  formatTeaspoonCount,
  gramsToTeaspoons,
  isAdditiveOrConcernIngredient,
  isAllergenIngredient,
  parseNutritionNumber,
} from "./nutrition-utils";

export type CompareWinner = "A" | "B" | "tie" | "na";

export type NutrientComparisonRow = {
  key: string;
  icon: NutritionItem["icon"];
  label: Localized;
  valueA: string;
  valueB: string;
  numA: number | null;
  numB: number | null;
  subValueA?: string;
  subValueB?: string;
  hasSugarSpoon?: boolean;
  winner: CompareWinner;
  higherIsBetter: boolean;
};

export type FactorComparisonRow = {
  key: string;
  label: Localized;
  weight?: string;
  scoreA: number | null;
  scoreB: number | null;
  winner: CompareWinner;
};

export type IngredientComparisonSummary = {
  countA: number;
  countB: number;
  additiveCountA: number;
  additiveCountB: number;
  allergensA: string[];
  allergensB: string[];
  personalAllergensA: string[];
  personalAllergensB: string[];
  sharedIngredients: string[];
  fewerIngredientsWinner: CompareWinner;
};

export type ComparisonAISummary = {
  betterChoice: "A" | "B" | "tie";
  headline: string;
  overview: string;
  bullets: string[];
  personalizedNote: string | null;
};

function findNutritionItem(product: Product, matchLabels: string[]): NutritionItem | undefined {
  const items = product.nutrition?.items ?? [];
  return items.find((item) => {
    const en = item.label.en.toLowerCase();
    return matchLabels.some((label) => en.includes(label));
  });
}

function decideWinner(
  valA: number | null,
  valB: number | null,
  higherIsBetter: boolean,
): CompareWinner {
  if (valA === null || valB === null) return "na";
  if (Math.abs(valA - valB) < 0.001) return "tie";
  if (higherIsBetter) return valA > valB ? "A" : "B";
  return valA < valB ? "A" : "B";
}

function formatNotDeclared(language: Language): string {
  return language === "en" ? "Not on label" : "লেবেলে নেই";
}

function formatTeaspoonSub(grams: number | null, language: Language): string | undefined {
  if (grams === null) return undefined;
  const tsp = gramsToTeaspoons(grams);
  const tspText = formatTeaspoonCount(tsp, language);
  return language === "en"
    ? `${tspText} ${tsp === 1 ? "teaspoon" : "teaspoons"} sugar`
    : `${tspText} চা-চামচ চিনি`;
}

export function buildNutrientComparisonRows(
  productA: Product,
  productB: Product,
  language: Language,
): NutrientComparisonRow[] {
  const specs: {
    key: string;
    icon: NutritionItem["icon"];
    label: Localized;
    matches: string[];
    higherIsBetter: boolean;
    isSugar?: boolean;
    alwaysShow?: boolean;
  }[] = [
    {
      key: "energy",
      icon: "fire",
      label: { en: "Energy", bn: "শক্তি" },
      matches: ["energy"],
      higherIsBetter: false,
      alwaysShow: true,
    },
    {
      key: "sugar",
      icon: "cube-outline",
      label: { en: "Added sugar", bn: "যোগ করা চিনি" },
      matches: ["added sugar", "total sugar", "sugar"],
      higherIsBetter: false,
      isSugar: true,
      alwaysShow: true,
    },
    {
      key: "sodium",
      icon: "shaker-outline",
      label: { en: "Sodium", bn: "সোডিয়াম" },
      matches: ["sodium"],
      higherIsBetter: false,
      alwaysShow: true,
    },
    {
      key: "protein",
      icon: "fish",
      label: { en: "Protein", bn: "প্রোটিন" },
      matches: ["protein"],
      higherIsBetter: true,
      alwaysShow: true,
    },
    {
      key: "fiber",
      icon: "leaf",
      label: { en: "Dietary fiber", bn: "খাদ্য-আঁশ" },
      matches: ["fiber"],
      higherIsBetter: true,
      alwaysShow: true,
    },
    {
      key: "fat",
      icon: "water-outline",
      label: { en: "Total fat", bn: "মোট চর্বি" },
      matches: ["total fat", "saturated fat", "fat"],
      higherIsBetter: false,
      alwaysShow: false,
    },
  ];

  const rows: NutrientComparisonRow[] = [];

  for (const spec of specs) {
    const itemA = findNutritionItem(productA, spec.matches);
    const itemB = findNutritionItem(productB, spec.matches);

    if (!spec.alwaysShow && !itemA && !itemB) {
      continue;
    }

    const numA = itemA ? parseNutritionNumber(itemA.amount.en) : null;
    const numB = itemB ? parseNutritionNumber(itemB.amount.en) : null;

    rows.push({
      key: spec.key,
      icon: spec.icon,
      label: spec.label,
      valueA: itemA ? itemA.amount[language] : formatNotDeclared(language),
      valueB: itemB ? itemB.amount[language] : formatNotDeclared(language),
      numA,
      numB,
      subValueA: spec.isSugar ? formatTeaspoonSub(numA, language) : undefined,
      subValueB: spec.isSugar ? formatTeaspoonSub(numB, language) : undefined,
      hasSugarSpoon: Boolean(spec.isSugar && (numA !== null || numB !== null)),
      winner: decideWinner(numA, numB, spec.higherIsBetter),
      higherIsBetter: spec.higherIsBetter,
    });
  }

  return rows;
}

export function buildFactorComparisonRows(
  productA: Product,
  productB: Product,
): FactorComparisonRow[] {
  const maxLen = Math.max(productA.factors.length, productB.factors.length);
  const rows: FactorComparisonRow[] = [];
  for (let i = 0; i < maxLen; i += 1) {
    const fA = productA.factors[i];
    const fB = productB.factors[i];
    const base = fA ?? fB;
    if (!base) continue;
    const scoreA = fA?.value ?? null;
    const scoreB = fB?.value ?? null;
    rows.push({
      key: `${base.label.en}-${i}`,
      label: base.label,
      weight: base.weight,
      scoreA,
      scoreB,
      winner: decideWinner(scoreA, scoreB, true),
    });
  }
  return rows;
}

function findPersonalAllergyMatches(
  ingredients: { en: string; bn: string }[],
  userAllergies: string[],
): string[] {
  const active = userAllergies
    .map((a) => a.trim().toLowerCase())
    .filter((a) => a.length > 0 && a !== "none");
  if (!active.length) return [];

  const matches: string[] = [];
  for (const ing of ingredients) {
    const combined = `${ing.en} ${ing.bn}`.toLowerCase();
    for (const allergy of active) {
      const tokens = allergy.split(/[-/\s]+/).filter((tok) => tok.length >= 3);
      if (tokens.some((tok) => combined.includes(tok))) {
        matches.push(ing.en);
      }
    }
  }
  return Array.from(new Set(matches));
}

export function buildIngredientComparison(
  productA: Product,
  productB: Product,
  language: Language,
  healthProfile: HealthProfile,
): IngredientComparisonSummary {
  const countA = productA.ingredients.length;
  const countB = productB.ingredients.length;
  const additiveCountA = productA.ingredients.filter((ing) =>
    isAdditiveOrConcernIngredient(ing.en, ing.bn),
  ).length;
  const additiveCountB = productB.ingredients.filter((ing) =>
    isAdditiveOrConcernIngredient(ing.en, ing.bn),
  ).length;

  const allergensA = productA.ingredients
    .filter((ing) => isAllergenIngredient(ing.en, ing.bn))
    .map((ing) => ing[language]);
  const allergensB = productB.ingredients
    .filter((ing) => isAllergenIngredient(ing.en, ing.bn))
    .map((ing) => ing[language]);

  const setB = new Set(productB.ingredients.map((ing) => ing.en.trim().toLowerCase()));
  const sharedIngredients = productA.ingredients
    .filter((ing) => setB.has(ing.en.trim().toLowerCase()))
    .map((ing) => ing[language]);

  return {
    countA,
    countB,
    additiveCountA,
    additiveCountB,
    allergensA,
    allergensB,
    personalAllergensA: findPersonalAllergyMatches(productA.ingredients, healthProfile.foodAllergies),
    personalAllergensB: findPersonalAllergyMatches(productB.ingredients, healthProfile.foodAllergies),
    sharedIngredients,
    fewerIngredientsWinner: decideWinner(countA, countB, false),
  };
}

export function generateComparisonAISummary(
  productA: Product,
  productB: Product,
  language: Language,
  healthProfile: HealthProfile,
): ComparisonAISummary {
  const nameA = productA.name[language];
  const nameB = productB.name[language];
  const scoreA = productA.score ?? null;
  const scoreB = productB.score ?? null;
  const scoreWinner = decideWinner(scoreA, scoreB, true);
  const nutrientRows = buildNutrientComparisonRows(productA, productB, language);
  const ingSummary = buildIngredientComparison(productA, productB, language, healthProfile);

  const sugarRow = nutrientRows.find((r) => r.key === "sugar");
  const sodiumRow = nutrientRows.find((r) => r.key === "sodium");
  const energyRow = nutrientRows.find((r) => r.key === "energy");
  const proteinRow = nutrientRows.find((r) => r.key === "protein");

  const betterChoice: "A" | "B" | "tie" =
    scoreWinner === "A" || scoreWinner === "B" ? scoreWinner : "tie";

  const bullets: string[] = [];

  if (scoreA !== null && scoreB !== null) {
    const diff = Math.abs(scoreA - scoreB);
    if (diff === 0) {
      bullets.push(
        language === "en"
          ? `Both products share an NQSS score of ${scoreA}/100.`
          : `দুটি পণ্যেরই NQSS স্কোর সমান (${formatLocalizedNumber(scoreA, "bn", 0)}/১০০)।`,
      );
    } else {
      const leaderName = scoreA > scoreB ? nameA : nameB;
      bullets.push(
        language === "en"
          ? `${leaderName} scores ${diff} points higher on NQSS (${Math.max(scoreA, scoreB)} vs ${Math.min(scoreA, scoreB)}).`
          : `${leaderName}-এর NQSS স্কোর ${formatLocalizedNumber(diff, "bn", 0)} পয়েন্ট বেশি (${formatLocalizedNumber(Math.max(scoreA, scoreB), "bn", 0)} বনাম ${formatLocalizedNumber(Math.min(scoreA, scoreB), "bn", 0)})।`,
      );
    }
  }

  if (sugarRow && sugarRow.numA !== null && sugarRow.numB !== null) {
    const diffG = Math.abs(sugarRow.numA - sugarRow.numB);
    if (diffG > 0) {
      const lowerName = sugarRow.numA < sugarRow.numB ? nameA : nameB;
      const diffTsp = formatTeaspoonCount(gramsToTeaspoons(diffG), language);
      bullets.push(
        language === "en"
          ? `${lowerName} has ${formatLocalizedNumber(diffG, "en", 1)} g less added sugar per serving (about ${diffTsp} tsp less).`
          : `${lowerName}-এ প্রতি পরিবেশনে ${formatLocalizedNumber(diffG, "bn", 1)} গ্রাম কম যোগ করা চিনি আছে (প্রায় ${diffTsp} চা-চামচ কম)।`,
      );
    } else if (sugarRow.numA === 0 && sugarRow.numB === 0) {
      bullets.push(
        language === "en"
          ? "Neither product lists added sugar per serving."
          : "কোনো পণ্যই প্রতি পরিবেশনে যোগ করা চিনি দেখায়নি।",
      );
    }
  }

  if (sodiumRow && sodiumRow.numA !== null && sodiumRow.numB !== null && sodiumRow.numA !== sodiumRow.numB) {
    const lowerName = sodiumRow.numA < sodiumRow.numB ? nameA : nameB;
    const diffMg = Math.abs(sodiumRow.numA - sodiumRow.numB);
    bullets.push(
      language === "en"
        ? `${lowerName} is lower in sodium by ${formatLocalizedNumber(diffMg, "en", 0)} mg per serving.`
        : `${lowerName}-এ প্রতি পরিবেশনে সোডিয়াম ${formatLocalizedNumber(diffMg, "bn", 0)} মি.গ্রা. কম।`,
    );
  }

  if (proteinRow && proteinRow.numA !== null && proteinRow.numB !== null && proteinRow.numA !== proteinRow.numB) {
    const higherName = proteinRow.numA > proteinRow.numB ? nameA : nameB;
    const diffG = Math.abs(proteinRow.numA - proteinRow.numB);
    bullets.push(
      language === "en"
        ? `${higherName} provides ${formatLocalizedNumber(diffG, "en", 1)} g more protein per serving.`
        : `${higherName} প্রতি পরিবেশনে ${formatLocalizedNumber(diffG, "bn", 1)} গ্রাম বেশি প্রোটিন দেয়।`,
    );
  } else if (energyRow && energyRow.numA !== null && energyRow.numB !== null && energyRow.numA !== energyRow.numB) {
    const lowerName = energyRow.numA < energyRow.numB ? nameA : nameB;
    const diffKcal = Math.abs(energyRow.numA - energyRow.numB);
    bullets.push(
      language === "en"
        ? `${lowerName} has ${formatLocalizedNumber(diffKcal, "en", 0)} fewer kcal per listed serving.`
        : `${lowerName}-এ উল্লেখিত পরিবেশনে ${formatLocalizedNumber(diffKcal, "bn", 0)} কিলোক্যালরি কম।`,
    );
  }

  if (ingSummary.countA !== ingSummary.countB) {
    const simplerName = ingSummary.countA < ingSummary.countB ? nameA : nameB;
    bullets.push(
      language === "en"
        ? `${simplerName} has a shorter ingredient list (${Math.min(ingSummary.countA, ingSummary.countB)} vs ${Math.max(ingSummary.countA, ingSummary.countB)} ingredients).`
        : `${simplerName}-এর উপাদান তালিকা তুলনামূলক ছোট (${formatLocalizedNumber(Math.min(ingSummary.countA, ingSummary.countB), "bn", 0)} বনাম ${formatLocalizedNumber(Math.max(ingSummary.countA, ingSummary.countB), "bn", 0)}টি উপাদান)।`,
    );
  }

  // Build personalized context note
  let personalizedNote: string | null = null;
  if (ingSummary.personalAllergensA.length || ingSummary.personalAllergensB.length) {
    const parts: string[] = [];
    if (ingSummary.personalAllergensA.length) {
      parts.push(`${nameA} (${ingSummary.personalAllergensA.join(", ")})`);
    }
    if (ingSummary.personalAllergensB.length) {
      parts.push(`${nameB} (${ingSummary.personalAllergensB.join(", ")})`);
    }
    personalizedNote =
      language === "en"
        ? `Allergy check from your profile: verify ingredient labels for ${parts.join(" and ")}.`
        : `আপনার প্রোফাইলের অ্যালার্জি সতর্কতা: ${parts.join(" এবং ")}-এর উপাদান লেবেল যাচাই করুন।`;
  } else if (
    healthProfile.nutritionGoals.includes("reduce-sugar") ||
    healthProfile.healthConditions.some((c) => c.toLowerCase().includes("diabetes"))
  ) {
    if (sugarRow && (sugarRow.winner === "A" || sugarRow.winner === "B")) {
      const winnerName = sugarRow.winner === "A" ? nameA : nameB;
      personalizedNote =
        language === "en"
          ? `For your sugar-conscious preference, ${winnerName} has less added sugar per serving.`
          : `আপনার চিনি কমানোর লক্ষ্য অনুযায়ী ${winnerName}-এ প্রতি পরিবেশনে যোগ করা চিনি কম।`;
    }
  } else if (
    healthProfile.nutritionGoals.includes("reduce-sodium") ||
    healthProfile.healthConditions.some((c) => c.toLowerCase().includes("blood-pressure"))
  ) {
    if (sodiumRow && (sodiumRow.winner === "A" || sodiumRow.winner === "B")) {
      const winnerName = sodiumRow.winner === "A" ? nameA : nameB;
      personalizedNote =
        language === "en"
          ? `For your sodium preference, ${winnerName} contains less sodium per listed serving.`
          : `আপনার সোডিয়াম কমানোর লক্ষ্য অনুযায়ী ${winnerName}-এ সোডিয়ামের পরিমাণ কম।`;
    }
  } else if (healthProfile.nutritionGoals.includes("increase-protein")) {
    if (proteinRow && (proteinRow.winner === "A" || proteinRow.winner === "B")) {
      const winnerName = proteinRow.winner === "A" ? nameA : nameB;
      personalizedNote =
        language === "en"
          ? `For your protein goal, ${winnerName} offers more protein per serving.`
          : `আপনার প্রোটিন বাড়ানোর লক্ষ্য অনুযায়ী ${winnerName}-এ বেশি প্রোটিন রয়েছে।`;
    }
  }

  const headline =
    betterChoice === "A"
      ? language === "en"
        ? `${nameA} appears stronger overall`
        : `সামগ্রিকভাবে ${nameA} এগিয়ে`
      : betterChoice === "B"
        ? language === "en"
          ? `${nameB} appears stronger overall`
          : `সামগ্রিকভাবে ${nameB} এগিয়ে`
        : language === "en"
          ? "Both products score similarly"
          : "দুটি পণ্যের স্কোর কাছাকাছি";

  const overview =
    betterChoice === "tie"
      ? language === "en"
        ? "Look closely at the serving sizes, added sugar teaspoons, and sodium levels below to decide which fits your current needs."
        : "আপনার প্রয়োজন অনুযায়ী কোনটি ভালো তা বুঝতে নিচের পরিবেশনের পরিমাণ, চিনির চা-চামচ ও সোডিয়ামের মাত্রা তুলনা করুন।"
      : language === "en"
        ? `${betterChoice === "A" ? nameA : nameB} leads on NutriScan's weighted NQSS breakdown based on declared preview values. Always compare serving sizes on the physical pack.`
        : `প্রদর্শিত তথ্যের ওপর ভিত্তি করে NutriScan-এর NQSS বিভাজনে ${betterChoice === "A" ? nameA : nameB} এগিয়ে রয়েছে। কেনার আগে প্যাকেটের পরিবেশনের পরিমাণ মিলিয়ে নিন।`;

  return {
    betterChoice,
    headline,
    overview,
    bullets,
    personalizedNote,
  };
}
