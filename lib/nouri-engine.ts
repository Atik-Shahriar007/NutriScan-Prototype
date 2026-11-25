import type { Language } from "./nutriscan-data";

export type HealthProfileSnap = {
  nutritionGoals: string[];
  foodAllergies: string[];
  healthConditions: string[];
  dietaryRestrictions: string[];
};

export type NouriResponseCard = {
  type: "product" | "tip" | "action";
  productId?: string;
  tipId?: string;
  actionLabel?: string;
  actionRoute?: string;
};

export type NouriResponse = {
  text: string;
  cards?: NouriResponseCard[];
};

const GOAL_LABELS: Record<string, { en: string; bn: string }> = {
  "balanced-nutrition": { en: "balanced nutrition", bn: "সুষম পুষ্টি" },
  "increase-protein": { en: "increasing protein", bn: "প্রোটিন বৃদ্ধি" },
  "reduce-sugar": { en: "reducing sugar", bn: "চিনি কমানো" },
  "reduce-sodium": { en: "reducing sodium", bn: "সোডিয়াম কমানো" },
  "improve-fiber": { en: "increasing fiber", bn: "আঁশ বৃদ্ধি" },
  "better-awareness": { en: "label awareness", bn: "লেবেল সচেতনতা" },
  "limit-saturated-fat": { en: "limiting unhealthy fats", bn: "অস্বাস্থ্যকর চর্বি কমানো" },
  "less-processed": { en: "less processed foods", bn: "কম প্রক্রিয়াজাত খাবার" },
  "portion-calories": { en: "mindful portions", bn: "পরিমিত অংশ" },
  "smart-hydration": { en: "smarter drink choices", bn: "স্বাস্থ্যকর পানীয়" },
};

function hasAny(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

/**
 * Generates a contextual, bilingual (EN/BN) Nouri response based on keyword matching,
 * the user's health profile snapshot, and optionally the most recently viewed product.
 */
export function generateNouriResponse(
  message: string,
  language: Language,
  profile: HealthProfileSnap,
  lastProductId?: string,
): NouriResponse {
  const lower = message.trim().toLowerCase();

  // 1. Check for user's noted food allergies first for safety context
  const matchedAllergy = profile.foodAllergies.find((allergy) => {
    const clean = allergy.trim().toLowerCase();
    return clean.length > 0 && lower.includes(clean);
  });

  if (matchedAllergy) {
    return {
      text:
        language === "en"
          ? `Based on your profile, you've noted a ${matchedAllergy} allergy. Always check the allergen statement on packaged food — manufacturers are required to list major allergens in bold. When in doubt, contact the manufacturer directly.`
          : `আপনার প্রোফাইল অনুযায়ী আপনার ${matchedAllergy} অ্যালার্জির তথ্য রয়েছে। প্যাকেটজাত খাবারের অ্যালার্জেন বিবরণী সবসময় দেখে নিন — প্রস্তুতকারকদের প্রধান অ্যালার্জেনগুলো স্পষ্টভাবে উল্লেখ করতে হয়। সন্দেহ থাকলে সরাসরি প্রস্তুতকারকের সাথে যোগাযোগ করুন।`,
    };
  }

  // 2. Protein
  if (hasAny(lower, ["protein", "প্রোটিন"])) {
    const hasGoal = profile.nutritionGoals.includes("increase-protein");
    const base =
      language === "en"
        ? "Great sources of protein in Bangladesh include lentils (dal), eggs, chicken, fish like hilsa and rui, and milk. For packaged foods, check the nutrition label — look for 5g or more of protein per serving."
        : "বাংলাদেশে প্রোটিনের ভালো উৎসের মধ্যে রয়েছে ডাল, ডিম, মুরগি, ইলিশ ও রুই মাছ এবং দুধ। প্যাকেটজাত খাবারের ক্ষেত্রে পুষ্টি-লেবেল দেখে নিন — প্রতি পরিবেশনে ৫ গ্রাম বা তার বেশি প্রোটিন আছে কিনা লক্ষ্য করুন।";
    const goalNote = hasGoal
      ? language === "en"
        ? " Since increasing protein is one of your goals, focus on these foods at each meal."
        : " যেহেতু প্রোটিন বাড়ানো আপনার একটি লক্ষ্য, তাই প্রতি বেলার খাবারে এগুলো রাখার চেষ্টা করুন।"
      : "";
    return { text: `${base}${goalNote}` };
  }

  // 3. Sugar / Sweet
  if (hasAny(lower, ["sugar", "sweet", "চিনি", "মিষ্টি"])) {
    const hasDiabetes = profile.healthConditions.some((c) =>
      c.toLowerCase().includes("diabetes"),
    );
    const base =
      language === "en"
        ? "WHO recommends limiting free sugars to less than 10% of total daily energy. For a 2000 kcal diet, that's about 50g. When reading a label, 'added sugar' and 'sucrose' are key terms to watch."
        : "WHO দৈনিক মোট শক্তির ১০%-এর কম মুক্ত চিনি গ্রহণের পরামর্শ দেয়। ২০০০ কিলোক্যালরি ডায়েটে এটি প্রায় ৫০ গ্রাম। লেবেল পড়ার সময় 'added sugar' এবং 'sucrose' শব্দগুলো লক্ষ্য করুন।";
    const condNote = hasDiabetes
      ? language === "en"
        ? " As someone managing diabetes, keeping sugar intake in check is especially important — always consult your doctor for specific targets."
        : " ডায়াবেটিস নিয়ন্ত্রণের ক্ষেত্রে চিনির পরিমাণ সীমিত রাখা বিশেষভাবে জরুরি — নির্দিষ্ট মাত্রার জন্য অবশ্যই আপনার চিকিৎসকের পরামর্শ নিন।"
      : "";
    return { text: `${base}${condNote}` };
  }

  // 4. Sodium / Salt
  if (hasAny(lower, ["sodium", "salt", "লবণ", "সোডিয়াম"])) {
    const hasHypertension = profile.healthConditions.some((c) =>
      c.toLowerCase().includes("hypertension"),
    );
    const base =
      language === "en"
        ? "WHO advises less than 5g of salt per day. Instant noodles and packaged snacks can be significant sources. Compare the sodium line across brands."
        : "WHO প্রতিদিন ৫ গ্রামের কম লবণ গ্রহণের পরামর্শ দেয়। ইনস্ট্যান্ট নুডলস ও প্যাকেটজাত স্ন্যাকসে সোডিয়ামের পরিমাণ বেশি থাকতে পারে। বিভিন্ন ব্র্যান্ডের লেবেলে সোডিয়ামের মাত্রা তুলনা করুন।";
    const condNote = hasHypertension
      ? language === "en"
        ? " Managing sodium is especially relevant for hypertension — your doctor can give you a personalized target."
        : " উচ্চ রক্তচাপের ক্ষেত্রে সোডিয়াম নিয়ন্ত্রণ বিশেষভাবে গুরুত্বপূর্ণ — আপনার চিকিৎসক আপনার জন্য ব্যক্তিগত লক্ষ্য নির্ধারণ করে দিতে পারবেন।"
      : "";
    return { text: `${base}${condNote}` };
  }

  // 5. Alternative / Better / Swap
  if (hasAny(lower, ["alternative", "better", "swap", "বিকল্প"])) {
    const base =
      language === "en"
        ? "I can suggest better-scoring alternatives from the same product family! Try scanning a product and I'll show you options with better nutritional profiles."
        : "একই পণ্য-পরিবার থেকে আমি আরও ভালো স্কোরের বিকল্প দেখাতে পারি! একটি পণ্য স্ক্যান করে দেখুন, আমি তুলনামূলক ভালো পুষ্টিমানের বিকল্পগুলো দেখাব।";
    const productNote = lastProductId
      ? language === "en"
        ? " For the product you recently viewed, check the Better Alternatives section on its detail page."
        : " আপনি সম্প্রতি যে পণ্যটি দেখেছেন, তার বিস্তারিত পাতায় 'আরও ভালো বিকল্প' অংশটি দেখতে পারেন।"
      : "";
    return {
      text: `${base}${productNote}`,
      cards: [
        {
          type: "action",
          actionLabel: language === "en" ? "Find Alternatives" : "বিকল্প খুঁজুন",
          actionRoute: "/discover",
        },
      ],
    };
  }

  // 6. Ingredient
  if (hasAny(lower, ["ingredient", "উপাদান"])) {
    return {
      text:
        language === "en"
          ? "Understanding food ingredients helps you make informed choices. Common additives like E-numbers serve specific purposes — some are natural (like E300 = Vitamin C), while others are synthetic. The key is knowing what a long ingredient list signals about processing level."
          : "খাবারের উপাদান সম্পর্কে জানলে সঠিক সিদ্ধান্ত নেওয়া সহজ হয়। E-number-এর মতো অ্যাডিটিভগুলো নির্দিষ্ট কাজে ব্যবহৃত হয় — কিছু প্রাকৃতিক (যেমন E300 = ভিটামিন সি), আবার কিছু কৃত্রিম। দীর্ঘ উপাদান-তালিকা সাধারণত বেশি প্রক্রিয়াজাতকরণের ইঙ্গিত দেয়।",
      cards: [
        {
          type: "action",
          actionLabel:
            language === "en" ? "Ingredient Explainer" : "উপাদান ব্যাখ্যা",
          actionRoute: "/ingredient/sodium",
        },
      ],
    };
  }

  // 7. Score / Grade
  if (hasAny(lower, ["score", "grade", "স্কোর", "গ্রেড"])) {
    const base =
      language === "en"
        ? "NutriScan's NQSS (NutriScan Quality Score System) considers nutrition profile (60%), ingredients & additives (30%), and label completeness (10%). A score above 75 is excellent; 60-74 is good; below 60 suggests checking for better alternatives."
        : "NutriScan-এর NQSS স্কোরিং পদ্ধতিতে পুষ্টির প্রোফাইল (৬০%), উপাদান ও অ্যাডিটিভ (৩০%) এবং লেবেলের পূর্ণতা (১০%) বিবেচনা করা হয়। ৭৫-এর বেশি স্কোর চমৎকার; ৬০-৭৪ ভালো; আর ৬০-এর নিচে হলে ভালো বিকল্প দেখা উচিত।";
    const productNote = lastProductId
      ? language === "en"
        ? " The product you viewed scored based on its declared nutrition values."
        : " আপনি যে পণ্যটি দেখেছেন, তার স্কোর ঘোষিত পুষ্টিমানের ওপর ভিত্তি করে হিসাব করা হয়েছে।"
      : "";
    return { text: `${base}${productNote}` };
  }

  // 8. Snack / Biscuit / Chips
  if (hasAny(lower, ["snack", "biscuit", "chips", "নাস্তা", "বিস্কুট", "চিপস"])) {
    return {
      text:
        language === "en"
          ? "When buying packaged snacks, check: 1) Serving size (smaller = less nutrition shown), 2) Added sugar per serving, 3) Sodium content, 4) Ingredient list length. Shorter lists with recognizable ingredients are generally a positive sign."
          : "প্যাকেটজাত নাস্তা কেনার সময় দেখুন: ১) পরিবেশনের পরিমাণ (ছোট পরিমাণ মানে কম পুষ্টিমান দেখানো হয়), ২) প্রতি পরিবেশনে যোগ করা চিনি, ৩) সোডিয়ামের পরিমাণ, ৪) উপাদান তালিকার দৈর্ঘ্য। চেনা উপাদানসহ ছোট তালিকা সাধারণত ভালো লক্ষণ।",
      cards: [{ type: "product", productId: "olympic-energy" }],
    };
  }

  // 9. Halal
  if (hasAny(lower, ["halal", "হালাল"])) {
    return {
      text:
        language === "en"
          ? "NutriScan's Halal Mode filters the catalog to show only products with linked halal evidence (package mark or certificate). We don't infer halal status from brand name or ingredients alone. For definitive halal verification, consult your trusted certification body."
          : "NutriScan-এর হালাল মোড শুধু সেই পণ্যগুলোই দেখায় যেগুলোর সাথে প্যাকেট মার্ক বা সনদের তথ্য যুক্ত আছে। শুধু ব্র্যান্ডের নাম বা উপাদান দেখে আমরা হালাল অবস্থা অনুমান করি না। চূড়ান্ত যাচাইয়ের জন্য বিশ্বস্ত সনদ প্রদানকারী সংস্থার পরামর্শ নিন।",
    };
  }

  // 10. Fiber
  if (hasAny(lower, ["fiber", "fibre", "আঁশ"])) {
    return {
      text:
        language === "en"
          ? "Dietary fiber supports digestive health. WHO recommends at least 25g per day for adults. Good sources include whole grains, vegetables, lentils and fruits. When comparing cereals or biscuits, look for products with 3g or more fiber per serving."
          : "খাদ্যআঁশ হজমশক্তি ভালো রাখতে সাহায্য করে। WHO প্রাপ্তবয়স্কদের জন্য প্রতিদিন অন্তত ২৫ গ্রাম আঁশ গ্রহণের পরামর্শ দেয়। পূর্ণ শস্য, শাকসবজি, ডাল ও ফল এর ভালো উৎস। সিরিয়াল বা বিস্কুট তুলনা করলে প্রতি পরিবেশনে ৩ গ্রাম বা বেশি আঁশ খুঁজুন।",
    };
  }

  // 11. Greeting
  if (hasAny(lower, ["hello", "hi", "hey", "সালাম", "নমস্কার", "হ্যালো"])) {
    const goalText = profile.nutritionGoals
      .map((g) => GOAL_LABELS[g]?.[language] ?? g)
      .filter(Boolean)
      .slice(0, 2)
      .join(language === "en" ? " and " : " এবং ");

    if (language === "en") {
      return {
        text: goalText
          ? `Hello! I'm Nouri, your NutriScan nutrition assistant. I see you're focusing on ${goalText}. Ask me about food labels, ingredients, scores, or healthier swaps anytime!`
          : "Hello! I'm Nouri, your NutriScan nutrition assistant. Ask me about food labels, ingredients, scores, or healthier swaps anytime!",
      };
    }
    return {
      text: goalText
        ? `হ্যালো! আমি নৌরি, আপনার NutriScan পুষ্টি সহকারী। দেখছি আপনি ${goalText}-এর ওপর গুরুত্ব দিচ্ছেন। খাবারের লেবেল, উপাদান, স্কোর বা স্বাস্থ্যকর বিকল্প নিয়ে যেকোনো প্রশ্ন করতে পারেন!`
        : "হ্যালো! আমি নৌরি, আপনার NutriScan পুষ্টি সহকারী। খাবারের লেবেল, উপাদান, স্কোর বা স্বাস্থ্যকর বিকল্প নিয়ে যেকোনো প্রশ্ন করতে পারেন!",
    };
  }

  // 12. Default / fallback
  return {
    text:
      language === "en"
        ? "I'm Nouri, your NutriScan nutrition guide! I can help you understand ingredients, explain food scores, suggest healthier alternatives, and answer general nutrition questions. What would you like to know? [Note: I provide general nutrition information, not medical advice — always consult a healthcare professional for health decisions.]"
        : "আমি নৌরি, আপনার NutriScan পুষ্টি গাইড! আমি উপাদান বুঝতে, খাবারের স্কোর ব্যাখ্যা করতে, স্বাস্থ্যকর বিকল্প খুঁজতে এবং সাধারণ পুষ্টি প্রশ্নের উত্তর দিতে পারি। আপনি কী জানতে চান? [দ্রষ্টব্য: আমি সাধারণ পুষ্টি-তথ্য দিই, চিকিৎসা পরামর্শ নয় — স্বাস্থ্যবিষয়ক সিদ্ধান্তের জন্য সর্বদা চিকিৎসকের পরামর্শ নিন।]",
  };
}

/**
 * Returns 6 contextual suggested questions for the Nouri welcome state based on profile goals.
 */
export function getSuggestedQuestions(
  language: Language,
  profile: HealthProfileSnap,
): string[] {
  const suggestions: string[] = [];

  if (profile.nutritionGoals.includes("increase-protein")) {
    suggestions.push(
      language === "en"
        ? "What are good protein sources in Bangladesh?"
        : "বাংলাদেশে প্রোটিনের ভালো উৎস কী কী?",
    );
  }

  if (
    profile.healthConditions.some((c) => c.toLowerCase().includes("diabetes")) ||
    profile.nutritionGoals.includes("reduce-sugar")
  ) {
    suggestions.push(
      language === "en"
        ? "How much added sugar is too much per day?"
        : "প্রতিদিন কতটুকু যোগ করা চিনি খাওয়া নিরাপদ?",
    );
  }

  if (
    profile.healthConditions.some((c) => c.toLowerCase().includes("hypertension")) ||
    profile.nutritionGoals.includes("reduce-sodium")
  ) {
    suggestions.push(
      language === "en"
        ? "How do I watch sodium in packaged foods?"
        : "প্যাকেটজাত খাবারে সোডিয়াম কীভাবে বুঝব?",
    );
  }

  const defaults =
    language === "en"
      ? [
          "How does NutriScan calculate food scores?",
          "What should I check when buying snacks?",
          "How does Halal Mode verify products?",
          "Can you suggest better food alternatives?",
          "How do I read E-numbers on ingredients?",
          "How much fiber do I need daily?",
        ]
      : [
          "NutriScan কীভাবে খাবারের স্কোর হিসাব করে?",
          "নাস্তা বা বিস্কুট কেনার সময় কী দেখব?",
          "হালাল মোড কীভাবে পণ্য যাচাই করে?",
          "আরও ভালো খাবারের বিকল্প কীভাবে পাব?",
          "উপাদানে E-number মানে কী?",
          "প্রতিদিন কতটুকু আঁশ বা ফাইবার প্রয়োজন?",
        ];

  for (const item of defaults) {
    if (suggestions.length >= 6) break;
    if (!suggestions.includes(item)) {
      suggestions.push(item);
    }
  }

  return suggestions.slice(0, 6);
}
