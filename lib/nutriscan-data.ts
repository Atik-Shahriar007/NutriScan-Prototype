import type { ImageSourcePropType } from "react-native";

export type Language = "en" | "bn";
export type Category = "food" | "personalCare" | "household";
export type Localized = { en: string; bn: string };
export type NutritionItem = {
  label: Localized;
  amount: Localized;
  note: Localized;
  detail: Localized;
  tone: "positive" | "caution" | "neutral";
  icon: "cube-outline" | "fire" | "shaker-outline" | "fish" | "leaf" | "flask-outline" | "water-outline" | "food-apple-outline";
};

export type ComparisonFamily = "mango-drink" | "instant-noodles" | "potato-snack";
export type HalalEvidence = {
  kind: "package-mark" | "certificate";
  label: Localized;
  sourceTitle: string;
  sourceUrl: string;
};

export type Product = {
  id: string;
  barcode: string;
  category: Category;
  comparisonFamily?: ComparisonFamily;
  name: Localized;
  brand: Localized;
  size: Localized;
  description: Localized;
  image: ImageSourcePropType;
  ingredients: Localized[];
  ingredientExplanations?: Localized[];
  nutrition?: { serving: Localized; items: NutritionItem[] };
  demo: true;
  score?: number;
  gradeLabel?: Localized;
  factors: { label: Localized; value: number | null; weight?: string; note: Localized }[];
  evidence: { label: Localized; value: Localized; status: "demo" | "unknown" }[];
  halalEvidence?: HalalEvidence;
  reactionCounts: { likes: number; dislikes: number };
};

const sample = (en: string, bn: string): Localized => ({ en, bn });
const factor = (label: Localized, value: number, weight: string, note: Localized) => ({ label, value, weight, note });
const foodFactors = (nutrition: number, ingredients: number, label: number) => [
  factor(sample("Nutrition profile", "পুষ্টির প্রোফাইল"), nutrition, "60%", sample("Compares the displayed nutrition fields per serving.", "প্রতি পরিবেশনের প্রদর্শিত পুষ্টি-তথ্য তুলনা করে।")),
  factor(sample("Ingredients & additives", "উপাদান ও অ্যাডিটিভ"), ingredients, "30%", sample("Considers the ingredient list and additive details.", "উপাদান তালিকা ও অ্যাডিটিভের তথ্য বিবেচনা করে।")),
  factor(sample("Label completeness", "লেবেলের পূর্ণতা"), label, "10%", sample("Reflects how much label information is available in this preview.", "এই প্রিভিউতে কতটা লেবেল তথ্য আছে তা বোঝায়।")),
];
const foodItem = (label: Localized, amount: Localized, icon: NutritionItem["icon"], tone: NutritionItem["tone"], note: Localized): NutritionItem => ({
  label, amount, icon, tone, note,
  detail: sample("Use the current package nutrition panel for exact values and serving size.", "সঠিক মান ও পরিবেশনের পরিমাণের জন্য বর্তমান প্যাকেটের পুষ্টি-লেবেল দেখুন।"),
});
const evidenceFood = () => [
  { label: sample("Package photo", "প্যাকেটের ছবি"), value: sample("Visual product reference; not a substitute for the current label.", "পণ্যের দৃশ্যমান রেফারেন্স; বর্তমান লেবেলের বিকল্প নয়।"), status: "demo" as const },
  { label: sample("Nutrition panel", "পুষ্টি-লেবেল"), value: sample("Displayed values are for this prototype preview.", "দেখানো মানগুলো এই প্রোটোটাইপ প্রিভিউর জন্য।"), status: "unknown" as const },
  { label: sample("Allergen information", "অ্যালার্জেন তথ্য"), value: sample("Check the exact pack before making a food choice.", "খাবার বাছাইয়ের আগে সঠিক প্যাকেট দেখে নিন।"), status: "unknown" as const },
  { label: sample("Halal / additive source", "হালাল / অ্যাডিটিভের উৎস"), value: sample("No certification or ingredient-source assessment is connected. An E-number alone does not establish halal status.", "কোনো সনদ বা উপাদানের উৎস যাচাই যুক্ত নেই। শুধু E-number দেখে হালাল অবস্থা নির্ধারণ করা যায় না।"), status: "unknown" as const },
  { label: sample("BSTI evidence", "BSTI তথ্য"), value: sample("No product-specific official record is linked.", "পণ্যভিত্তিক কোনো সরকারি রেকর্ড যুক্ত নেই।"), status: "unknown" as const },
];
const evidenceCare = () => [
  { label: sample("Package photo", "প্যাকেটের ছবি"), value: sample("Visual product reference for this preview.", "এই প্রিভিউর পণ্যের দৃশ্যমান রেফারেন্স।"), status: "demo" as const },
  { label: sample("Ingredient details", "উপাদানের তথ্য"), value: sample("Check the exact package and variant.", "সঠিক প্যাকেট ও ভ্যারিয়েন্ট দেখে নিন।"), status: "unknown" as const },
  { label: sample("Certification / suitability", "সনদ / উপযোগিতা"), value: sample("No independent certification or personal-suitability assessment is connected.", "স্বাধীন সনদ বা ব্যক্তিগত উপযোগিতা যাচাই যুক্ত নেই।"), status: "unknown" as const },
];
const evidenceHome = () => [
  { label: sample("Package photo", "প্যাকেটের ছবি"), value: sample("Visual product reference for this preview.", "এই প্রিভিউর পণ্যের দৃশ্যমান রেফারেন্স।"), status: "demo" as const },
  { label: sample("Label / use details", "লেবেল / ব্যবহারের তথ্য"), value: sample("Read directions and precautions on the current package.", "বর্তমান প্যাকেটের নির্দেশনা ও সতর্কতা পড়ুন।"), status: "unknown" as const },
  { label: sample("Safety / certification", "নিরাপত্তা / সনদ"), value: sample("No product-specific official record is linked.", "পণ্যভিত্তিক কোনো সরকারি রেকর্ড যুক্ত নেই।"), status: "unknown" as const },
];


const familyLabel = (family: ComparisonFamily): Localized => ({
  "mango-drink": sample("mango drinks", "ম্যাঙ্গো ড্রিঙ্ক"),
  "instant-noodles": sample("instant noodles", "ইনস্ট্যান্ট নুডলস"),
  "potato-snack": sample("potato snacks", "আলুর স্ন্যাকস"),
}[family]);

type AlternativeSpec = {
  id: string;
  barcode: string;
  family: ComparisonFamily;
  name: Localized;
  brand: Localized;
  size: Localized;
  image: ImageSourcePropType;
  score: number;
  ingredients: Localized[];
  reactionCounts: { likes: number; dislikes: number };
};

const alternativeProduct = (spec: AlternativeSpec): Product => {
  const family = familyLabel(spec.family);
  const nutrition = spec.family === "mango-drink"
    ? { serving: sample("Per 250 ml · preview", "প্রতি ২৫০ মি.লি. · প্রিভিউ"), items: [
        foodItem(sample("Added sugar", "যোগ করা চিনি"), sample("18 g", "১৮ গ্রাম"), "cube-outline", "caution", sample("Compare similar fruit drinks per serving.", "একই ধরনের ফলের পানীয় প্রতি পরিবেশনে তুলনা করুন।")),
        foodItem(sample("Energy", "শক্তি"), sample("92 kcal", "৯২ কিলোক্যালরি"), "fire", "neutral", sample("Serving size matters when comparing drinks.", "পানীয় তুলনা করলে পরিবেশনের পরিমাণ গুরুত্বপূর্ণ।")),
        foodItem(sample("Sodium", "সোডিয়াম"), sample("12 mg", "১২ মি.গ্রা."), "shaker-outline", "neutral", sample("Use the current package label for exact sodium.", "সোডিয়ামের সঠিক তথ্যের জন্য বর্তমান প্যাকেট দেখুন।")),
        foodItem(sample("Fruit content", "ফলের উপাদান"), sample("Declared", "উল্লেখিত"), "leaf", "positive", sample("Check the exact label for the declared fruit content.", "উল্লেখিত ফলের উপাদানের জন্য সঠিক লেবেল দেখুন।")),
      ] }
    : spec.family === "instant-noodles"
      ? { serving: sample("Per serving · preview", "প্রতি পরিবেশন · প্রিভিউ"), items: [
          foodItem(sample("Added sugar", "যোগ করা চিনি"), sample("2 g", "২ গ্রাম"), "cube-outline", "neutral", sample("Compare similar noodles per serving.", "একই ধরনের নুডলস প্রতি পরিবেশনে তুলনা করুন।")),
          foodItem(sample("Energy", "শক্তি"), sample("270 kcal", "২৭০ কিলোক্যালরি"), "fire", "caution", sample("Preparation changes the final serving values.", "রান্নার পদ্ধতিতে পরিবেশনের মান বদলাতে পারে।")),
          foodItem(sample("Sodium", "সোডিয়াম"), sample("560 mg", "৫৬০ মি.গ্রা."), "shaker-outline", "caution", sample("Compare sodium on the current label.", "বর্তমান লেবেলে সোডিয়াম তুলনা করুন।")),
          foodItem(sample("Protein", "প্রোটিন"), sample("7 g", "৭ গ্রাম"), "fish", "positive", sample("Use the current pack for the exact amount.", "সঠিক পরিমাণের জন্য বর্তমান প্যাকেট দেখুন।")),
        ] }
      : { serving: sample("Per 25 g pack · preview", "প্রতি ২৫ গ্রাম প্যাক · প্রিভিউ"), items: [
          foodItem(sample("Added sugar", "যোগ করা চিনি"), sample("1 g", "১ গ্রাম"), "cube-outline", "neutral", sample("Compare similar snacks per pack.", "একই ধরনের স্ন্যাকস প্রতি প্যাক তুলনা করুন।")),
          foodItem(sample("Energy", "শক্তি"), sample("128 kcal", "১২৮ কিলোক্যালরি"), "fire", "caution", sample("Compare serving size along with energy.", "শক্তির সঙ্গে পরিবেশনের পরিমাণও তুলনা করুন।")),
          foodItem(sample("Sodium", "সোডিয়াম"), sample("150 mg", "১৫০ মি.গ্রা."), "shaker-outline", "caution", sample("Use the package label for exact sodium.", "সোডিয়ামের সঠিক তথ্যের জন্য প্যাকেটের লেবেল দেখুন।")),
          foodItem(sample("Potato content", "আলুর উপাদান"), sample("Declared", "উল্লেখিত"), "food-apple-outline", "positive", sample("Check the ingredient panel for the exact formulation.", "সঠিক ফর্মুলার জন্য উপাদান-লেবেল দেখুন।")),
        ] };
  return {
    id: spec.id,
    barcode: spec.barcode,
    category: "food",
    comparisonFamily: spec.family,
    name: spec.name,
    brand: spec.brand,
    size: spec.size,
    description: sample(`A ${family.en} comparison record for this prototype catalog.`, `এই প্রোটোটাইপ ক্যাটালগে ${family.bn} তুলনার একটি রেকর্ড।`),
    image: spec.image,
    ingredients: spec.ingredients,
    ingredientExplanations: spec.ingredients.map(() => sample("Read the current package for the exact ingredient declaration.", "সঠিক উপাদান ঘোষণার জন্য বর্তমান প্যাকেট দেখুন।")),
    nutrition,
    demo: true,
    score: spec.score,
    gradeLabel: sample("Preview score", "প্রিভিউ স্কোর"),
    factors: foodFactors(Math.min(spec.score + 4, 96), Math.min(spec.score + 1, 94), 92),
    evidence: evidenceFood(),
    halalEvidence: {
      kind: "package-mark",
      label: sample("Halal mark shown on this exact package record.", "এই নির্দিষ্ট প্যাকেট রেকর্ডে হালাল মার্ক দেখানো হয়েছে।"),
      sourceTitle: "NutriScan prototype package record",
      sourceUrl: `assets/images/products/SOURCES.md#${spec.id}`,
    },
    reactionCounts: spec.reactionCounts,
  };
};

export const products: Product[] = [
  {
    id: "food-sample", barcode: "831730009403", category: "food",
    name: sample("PRAN Frooto Mango Drink", "প্রাণ ফ্রুটো ম্যাঙ্গো ড্রিঙ্ক"), brand: sample("PRAN", "প্রাণ"), size: sample("250 ml", "২৫০ মি.লি."),
    description: sample("A familiar fruit-drink example from the Bangladesh market.", "বাংলাদেশের বাজারের পরিচিত ফলের পানীয়ের উদাহরণ।"), image: require("../assets/images/products/pran-mango.webp") as ImageSourcePropType,
    ingredients: [sample("Water", "পানি"), sample("Mango pulp", "আমের পাল্প"), sample("Sugar", "চিনি"), sample("Acidity regulator", "অম্লতা নিয়ন্ত্রক")],
    ingredientExplanations: [sample("A common beverage base.", "পানীয়ের সাধারণ একটি ভিত্তি উপাদান।"), sample("The fruit ingredient named on this product family.", "এই পণ্য-পরিবারের নামে উল্লেখ করা ফলের উপাদান।"), sample("Read the nutrition panel for the amount per serving.", "প্রতি পরিবেশনের পরিমাণ পুষ্টি-লেবেলে দেখুন।"), sample("Used to regulate acidity in some foods and drinks.", "কিছু খাবার ও পানীয়ে অম্লতা নিয়ন্ত্রণে ব্যবহৃত হয়।")],
    nutrition: { serving: sample("Per 250 ml · preview", "প্রতি ২৫০ মি.লি. · প্রিভিউ"), items: [
      foodItem(sample("Added sugar", "যোগ করা চিনি"), sample("26 g", "২৬ গ্রাম"), "cube-outline", "caution", sample("Compare sugars across similar drinks.", "একই ধরনের পানীয়ের শর্করার পরিমাণ তুলনা করুন।")),
      foodItem(sample("Energy", "শক্তি"), sample("124 kcal", "১২৪ কিলোক্যালরি"), "fire", "caution", sample("Energy values are usually shown per serving or 100 ml.", "শক্তিমান সাধারণত প্রতি পরিবেশন বা ১০০ মি.লিতে দেখানো হয়।")),
      foodItem(sample("Sodium", "সোডিয়াম"), sample("16 mg", "১৬ মি.গ্রা."), "shaker-outline", "neutral", sample("Check the package for product-specific sodium.", "পণ্যটির সোডিয়াম জানতে প্যাকেট দেখুন।")),
      foodItem(sample("Fiber", "আঁশ"), sample("0 g", "০ গ্রাম"), "leaf", "neutral", sample("Compare the fiber line on the current nutrition panel.", "বর্তমান পুষ্টি-লেবেলের আঁশের তথ্য তুলনা করুন।")),
      foodItem(sample("Fruit pulp", "ফলের পাল্প"), sample("Included", "রয়েছে"), "leaf", "positive", sample("The exact amount varies by product and package.", "সঠিক পরিমাণ পণ্য ও প্যাকেট অনুযায়ী বদলায়।")),
    ] },
    comparisonFamily: "mango-drink", demo: true, score: 52, gradeLabel: sample("Check the label", "লেবেল দেখে নিন"), factors: foodFactors(45, 50, 100), evidence: evidenceFood(), reactionCounts: { likes: 556, dislikes: 54 },
  },
  {
    id: "radhuni-chilli", barcode: "9000000000102", category: "food",
    name: sample("Radhuni Chilli Powder", "রাঁধুনি মরিচ গুঁড়া"), brand: sample("Radhuni", "রাঁধুনি"), size: sample("500 g", "৫০০ গ্রাম"),
    description: sample("A spice-shelf example from the Bangladesh market.", "বাংলাদেশের বাজারের মসলার তাকের একটি উদাহরণ।"), image: require("../assets/images/products/radhuni-chilli.webp") as ImageSourcePropType,
    ingredients: [sample("Dried red chilli", "শুকনো লাল মরিচ")], ingredientExplanations: [sample("Check the ingredient panel for any additional blend ingredients.", "মিশ্রণে অন্য উপাদান থাকলে তা জানতে উপাদান-লেবেল দেখুন।")],
    nutrition: { serving: sample("Per 5 g · preview", "প্রতি ৫ গ্রাম · প্রিভিউ"), items: [
      foodItem(sample("Added sugar", "যোগ করা চিনি"), sample("0 g", "০ গ্রাম"), "cube-outline", "positive", sample("Check the current package for the full nutrition panel.", "সম্পূর্ণ পুষ্টি-তথ্যের জন্য বর্তমান প্যাকেট দেখুন।")),
      foodItem(sample("Energy", "শক্তি"), sample("15 kcal", "১৫ কিলোক্যালরি"), "fire", "neutral", sample("Serving sizes differ; compare like for like.", "পরিবেশনের পরিমাণ ভিন্ন হতে পারে; একই ভিত্তিতে তুলনা করুন।")),
      foodItem(sample("Sodium", "সোডিয়াম"), sample("2 mg", "২ মি.গ্রা."), "shaker-outline", "neutral", sample("Use the package label for exact sodium information.", "সোডিয়ামের সঠিক তথ্যের জন্য প্যাকেটের লেবেল দেখুন।")),
      foodItem(sample("Fiber", "আঁশ"), sample("0.6 g", "০.৬ গ্রাম"), "leaf", "positive", sample("Compare the amount per serving on the label.", "লেবেলে প্রতি পরিবেশনের পরিমাণ তুলনা করুন।")),
    ] },
    demo: true, score: 78, gradeLabel: sample("Preview score", "প্রিভিউ স্কোর"), factors: foodFactors(80, 70, 90), evidence: evidenceFood(), reactionCounts: { likes: 323, dislikes: 18 },
  },
  {
    id: "olympic-energy", barcode: "9000000000103", category: "food",
    name: sample("Olympic Energy Plus Biscuits", "অলিম্পিক এনার্জি প্লাস বিস্কুট"), brand: sample("Olympic", "অলিম্পিক"), size: sample("62 g", "৬২ গ্রাম"),
    description: sample("A Bangladesh biscuit-shelf example.", "বাংলাদেশের বিস্কুটের তাকের একটি উদাহরণ।"), image: require("../assets/images/products/olympic-energy-plus.webp") as ImageSourcePropType,
    ingredients: [sample("Wheat flour", "গমের আটা"), sample("Sugar", "চিনি"), sample("Vegetable fat", "উদ্ভিজ্জ চর্বি"), sample("Raising agent", "ফুলানোর উপাদান")],
    ingredientExplanations: [sample("Wheat is a cereal ingredient; check the package for allergen statements.", "গম একটি শস্যজাত উপাদান; অ্যালার্জেনের তথ্য প্যাকেটে দেখুন।"), sample("The nutrition panel gives the product's sugar amounts.", "পুষ্টি-লেবেলে পণ্যটির শর্করার পরিমাণ থাকে।"), sample("The exact fat or oil source is shown on the package label.", "চর্বি বা তেলের সঠিক উৎস প্যাকেটের লেবেলে দেওয়া থাকে।"), sample("Raising agents help create a light biscuit texture.", "ফুলানোর উপাদান বিস্কুটকে হালকা গঠনে সাহায্য করে।")],
    nutrition: { serving: sample("Per 30 g · preview", "প্রতি ৩০ গ্রাম · প্রিভিউ"), items: [
      foodItem(sample("Added sugar", "যোগ করা চিনি"), sample("8 g", "৮ গ্রাম"), "cube-outline", "caution", sample("Compare sugars for the same serving size.", "একই পরিবেশনের পরিমাণ ধরে শর্করা তুলনা করুন।")),
      foodItem(sample("Energy", "শক্তি"), sample("145 kcal", "১৪৫ কিলোক্যালরি"), "fire", "caution", sample("Check the energy value on the current pack.", "বর্তমান প্যাকেটের শক্তিমান দেখে নিন।")),
      foodItem(sample("Sodium", "সোডিয়াম"), sample("105 mg", "১০৫ মি.গ্রা."), "shaker-outline", "neutral", sample("Sodium figures vary by recipe and serving.", "রেসিপি ও পরিবেশন অনুযায়ী সোডিয়ামের মান বদলায়।")),
      foodItem(sample("Protein", "প্রোটিন"), sample("2.4 g", "২.৪ গ্রাম"), "fish", "positive", sample("The nutrition panel shows protein per serving.", "পুষ্টি-লেবেলে প্রতি পরিবেশনের প্রোটিন দেখানো হয়।")),
    ] },
    demo: true, score: 62, gradeLabel: sample("Check the label", "লেবেল দেখে নিন"), factors: foodFactors(56, 60, 100), evidence: evidenceFood(), reactionCounts: { likes: 412, dislikes: 64 },
  },
  {
    id: "ruchi-tea", barcode: "9000000000104", category: "food",
    name: sample("Ispahani Mirzapore Tea", "ইস্পাহানি মির্জাপুর চা"), brand: sample("Ispahani", "ইস্পাহানি"), size: sample("400 g", "৪০০ গ্রাম"),
    description: sample("A packaged tea example from a Bangladesh retail listing.", "বাংলাদেশের খুচরা তালিকার প্যাকেটজাত চায়ের একটি উদাহরণ।"), image: require("../assets/images/products/ispahani-mirzapore.webp") as ImageSourcePropType,
    ingredients: [sample("Black tea leaves", "কালো চা পাতা")], ingredientExplanations: [sample("Check the current package for product-specific processing or blend details.", "পণ্য-নির্দিষ্ট প্রক্রিয়াকরণ বা মিশ্রণের তথ্য বর্তমান প্যাকেটে দেখুন।")],
    nutrition: { serving: sample("Per 2 g · preview", "প্রতি ২ গ্রাম · প্রিভিউ"), items: [
      foodItem(sample("Added sugar", "যোগ করা চিনি"), sample("0 g", "০ গ্রাম"), "cube-outline", "positive", sample("Added sugar depends on how the drink is prepared.", "যোগ করা চিনি পানীয়টি কীভাবে তৈরি হয় তার ওপর নির্ভর করে।")),
      foodItem(sample("Energy", "শক্তি"), sample("2 kcal", "২ কিলোক্যালরি"), "fire", "neutral", sample("Prepared drink values can differ from dry tea values.", "তৈরি পানীয়ের মান শুকনো চায়ের মান থেকে ভিন্ন হতে পারে।")),
      foodItem(sample("Sodium", "সোডিয়াম"), sample("0 mg", "০ মি.গ্রা."), "shaker-outline", "neutral", sample("Check the current nutrition panel where available.", "পুষ্টি-লেবেল থাকলে বর্তমান প্যাকেট দেখে নিন।")),
      foodItem(sample("Protein", "প্রোটিন"), sample("0 g", "০ গ্রাম"), "fish", "neutral", sample("Values depend on the serving and preparation.", "পরিবেশন ও তৈরির পদ্ধতি অনুযায়ী মান বদলায়।")),
    ] },
    demo: true, score: 86, gradeLabel: sample("Preview score", "প্রিভিউ স্কোর"), factors: foodFactors(90, 80, 80), evidence: evidenceFood(), reactionCounts: { likes: 295, dislikes: 20 },
  },
  {
    id: "pran-mr-noodles", barcode: "9000000000109", category: "food",
    name: sample("PRAN Mr. Noodles Spicy Tomato", "প্রাণ মি. নুডলস স্পাইসি টমেটো"), brand: sample("PRAN", "প্রাণ"), size: sample("4-pack · Spicy Tomato", "৪-প্যাক · স্পাইসি টমেটো"),
    description: sample("A Bangladesh-made instant-noodle product. The photo shows the four-pack Spicy Tomato variant.", "বাংলাদেশে তৈরি ইনস্ট্যান্ট নুডলস। ছবিতে চার-প্যাক স্পাইসি টমেটো ভ্যারিয়েন্টটি দেখানো হয়েছে।"), image: require("../assets/images/products/pran-mr-noodles.webp") as ImageSourcePropType,
    ingredients: [sample("Wheat flour", "গমের আটা"), sample("Vegetable oil", "উদ্ভিজ্জ তেল"), sample("Tomato seasoning", "টমেটো সিজনিং"), sample("Salt", "লবণ")],
    ingredientExplanations: [sample("The manufacturer lists Mr. Noodles among its Bangladesh-made products. Check the pack for the exact ingredient panel.", "প্রস্তুতকারক মি. নুডলসকে বাংলাদেশে তৈরি পণ্যের তালিকায় রেখেছে। সঠিক উপাদান-লেবেল প্যাকেটে দেখুন।"), sample("The oil blend is identified on the current ingredient label.", "তেলের মিশ্রণ বর্তমান উপাদান-লেবেলে দেওয়া থাকে।"), sample("The pictured product is the Spicy Tomato variant.", "ছবির পণ্যটি স্পাইসি টমেটো ভ্যারিয়েন্ট।"), sample("Compare sodium information on the nutrition label.", "পুষ্টি-লেবেলে সোডিয়ামের তথ্য তুলনা করুন।")],
    nutrition: { serving: sample("Per serving · preview", "প্রতি পরিবেশন · প্রিভিউ"), items: [
      foodItem(sample("Added sugar", "যোগ করা চিনি"), sample("3 g", "৩ গ্রাম"), "cube-outline", "neutral", sample("Compare similar instant noodles per serving.", "একই ধরনের ইনস্ট্যান্ট নুডলস প্রতি পরিবেশনে তুলনা করুন।")),
      foodItem(sample("Energy", "শক্তি"), sample("285 kcal", "২৮৫ কিলোক্যালরি"), "fire", "caution", sample("Serving size and preparation affect the total.", "পরিবেশন ও রান্নার পদ্ধতিতে মোট মান বদলায়।")),
      foodItem(sample("Sodium", "সোডিয়াম"), sample("720 mg", "৭২০ মি.গ্রা."), "shaker-outline", "caution", sample("Use the label for the exact sodium per serving.", "প্রতি পরিবেশনের সঠিক সোডিয়ামের জন্য লেবেল দেখুন।")),
      foodItem(sample("Protein", "প্রোটিন"), sample("6 g", "৬ গ্রাম"), "fish", "positive", sample("Check the current nutrition panel for the exact amount.", "সঠিক পরিমাণের জন্য বর্তমান পুষ্টি-লেবেল দেখুন।")),
    ] },
    comparisonFamily: "instant-noodles", demo: true, score: 46, gradeLabel: sample("Compare other options", "অন্য বিকল্প তুলনা করুন"), factors: foodFactors(43, 50, 50), evidence: evidenceFood(), reactionCounts: { likes: 186, dislikes: 73 },
  },
  {
    id: "bombay-potato-crackers", barcode: "9000000000110", category: "food",
    name: sample("Bombay Sweets Potato Crackers", "বম্বে সুইটস পটেটো ক্র্যাকার্স"), brand: sample("Bombay Sweets", "বম্বে সুইটস"), size: sample("25 g · Spicy Tomato", "২৫ গ্রাম · স্পাইসি টমেটো"),
    description: sample("The manufacturer lists Potato Crackers as a wheat-and-potato snack; this image shows Spicy Tomato flavour.", "প্রস্তুতকারক পটেটো ক্র্যাকার্সকে গম ও আলুর স্ন্যাকস হিসেবে তালিকাভুক্ত করেছে; ছবিতে স্পাইসি টমেটো ফ্লেভার।"), image: require("../assets/images/products/bombay-potato-crackers.webp") as ImageSourcePropType,
    ingredients: [sample("Potato flakes", "আলুর ফ্লেক্স"), sample("Starch", "স্টার্চ"), sample("Wheat flour", "গমের আটা"), sample("Refined vegetable oil", "পরিশোধিত উদ্ভিজ্জ তেল"), sample("Seasoning", "সিজনিং")],
    ingredientExplanations: [sample("The manufacturer lists potato flakes in this product's ingredients.", "প্রস্তুতকারকের তালিকায় এই পণ্যের উপাদান হিসেবে আলুর ফ্লেক্স রয়েছে।"), sample("A carbohydrate ingredient listed by the manufacturer.", "প্রস্তুতকারকের দেওয়া কার্বোহাইড্রেট উপাদান।"), sample("The manufacturer lists wheat flour; check the pack for allergen statements.", "প্রস্তুতকারক গমের আটা তালিকাভুক্ত করেছে; অ্যালার্জেনের তথ্য প্যাকেটে দেখুন।"), sample("The product page lists refined vegetable oil.", "পণ্যের পাতায় পরিশোধিত উদ্ভিজ্জ তেল তালিকাভুক্ত।"), sample("Check the current pack for full seasoning and additive details.", "সিজনিং ও অ্যাডিটিভের সম্পূর্ণ তথ্য বর্তমান প্যাকেটে দেখুন।")],
    nutrition: { serving: sample("Per 25 g pack · preview", "প্রতি ২৫ গ্রাম প্যাক · প্রিভিউ"), items: [
      foodItem(sample("Added sugar", "যোগ করা চিনি"), sample("2 g", "২ গ্রাম"), "cube-outline", "neutral", sample("Compare similar snack labels per pack.", "একই ধরনের স্ন্যাকসের লেবেল প্রতি প্যাক তুলনা করুন।")),
      foodItem(sample("Energy", "শক্তি"), sample("132 kcal", "১৩২ কিলোক্যালরি"), "fire", "caution", sample("The package panel is the source for the current value.", "বর্তমান মানের উৎস হলো প্যাকেটের পুষ্টি-লেবেল।")),
      foodItem(sample("Sodium", "সোডিয়াম"), sample("220 mg", "২২০ মি.গ্রা."), "shaker-outline", "caution", sample("Check sodium and serving size on the pack.", "প্যাকেটে সোডিয়াম ও পরিবেশনের পরিমাণ দেখুন।")),
      foodItem(sample("Protein", "প্রোটিন"), sample("2 g", "২ গ্রাম"), "fish", "neutral", sample("Use the current nutrition label for exact protein.", "সঠিক প্রোটিনের জন্য বর্তমান পুষ্টি-লেবেল দেখুন।")),
    ] },
    comparisonFamily: "potato-snack", demo: true, score: 52, gradeLabel: sample("Compare other options", "অন্য বিকল্প তুলনা করুন"), factors: foodFactors(50, 50, 70), evidence: evidenceFood(), reactionCounts: { likes: 265, dislikes: 33 },
  },
  {
    id: "olympic-tip", barcode: "9000000000111", category: "food",
    name: sample("Olympic Tip Crispy Salted Biscuits", "অলিম্পিক টিপ ক্রিস্পি সল্টেড বিস্কুট"), brand: sample("Olympic", "অলিম্পিক"), size: sample("60 g / 200 g size options", "৬০ / ২০০ গ্রাম সাইজের বিকল্প"),
    description: sample("Olympic lists Tip as a crispy salted biscuit and shows 60 g and 200 g sizes.", "অলিম্পিক টিপকে ক্রিস্পি সল্টেড বিস্কুট হিসেবে তালিকাভুক্ত করেছে এবং ৬০ ও ২০০ গ্রামের সাইজ দেখিয়েছে।"), image: require("../assets/images/products/olympic-tip.webp") as ImageSourcePropType,
    ingredients: [sample("Wheat flour", "গমের আটা"), sample("Salt", "লবণ"), sample("Vegetable fat", "উদ্ভিজ্জ চর্বি"), sample("Raising agent", "ফুলানোর উপাদান")],
    ingredientExplanations: [sample("Check the current package for the full biscuit ingredient list.", "বিস্কুটের সম্পূর্ণ উপাদান তালিকার জন্য বর্তমান প্যাকেট দেখুন।"), sample("Compare sodium and salt information per serving.", "প্রতি পরিবেশনে সোডিয়াম ও লবণের তথ্য তুলনা করুন।"), sample("The package label identifies the oil or fat source.", "প্যাকেটের লেবেলে তেল বা চর্বির উৎস থাকে।"), sample("The exact formulation is printed on the pack.", "সঠিক ফর্মুলা প্যাকেটে ছাপা থাকে।")],
    nutrition: { serving: sample("Per serving · preview", "প্রতি পরিবেশন · প্রিভিউ"), items: [
      foodItem(sample("Added sugar", "যোগ করা চিনি"), sample("5 g", "৫ গ্রাম"), "cube-outline", "caution", sample("Check the current nutrition panel for sugar per serving.", "প্রতি পরিবেশনের শর্করার জন্য বর্তমান পুষ্টি-লেবেল দেখুন।")),
      foodItem(sample("Energy", "শক্তি"), sample("138 kcal", "১৩৮ কিলোক্যালরি"), "fire", "caution", sample("Compare serving sizes as well as the energy value.", "শক্তিমানসহ পরিবেশনের পরিমাণও তুলনা করুন।")),
      foodItem(sample("Sodium", "সোডিয়াম"), sample("180 mg", "১৮০ মি.গ্রা."), "shaker-outline", "caution", sample("Check the current label for sodium per serving.", "প্রতি পরিবেশনের সোডিয়ামের জন্য বর্তমান লেবেল দেখুন।")),
      foodItem(sample("Protein", "প্রোটিন"), sample("2.2 g", "২.২ গ্রাম"), "fish", "positive", sample("The label gives protein amounts per serving.", "লেবেলে প্রতি পরিবেশনের প্রোটিনের পরিমাণ থাকে।")),
    ] },
    demo: true, score: 58, gradeLabel: sample("Compare other options", "অন্য বিকল্প তুলনা করুন"), factors: foodFactors(55, 55, 80), evidence: evidenceFood(), reactionCounts: { likes: 210, dislikes: 41 },
  },
  {
    id: "care-sample", barcode: "9000000000105", category: "personalCare",
    name: sample("Meril Petroleum Jelly", "মেরিল পেট্রোলিয়াম জেলি"), brand: sample("Meril", "মেরিল"), size: sample("Variant and size vary", "ভ্যারিয়েন্ট ও সাইজ ভিন্ন হতে পারে"),
    description: sample("A Bangladesh personal-care product example. This category uses evidence notes rather than a food-style health grade.", "বাংলাদেশের পার্সোনাল-কেয়ার পণ্যের উদাহরণ। এই ক্যাটাগরিতে খাবারের মতো স্বাস্থ্য-গ্রেড নয়, তথ্য-প্রমাণের নোট দেখানো হয়।"), image: require("../assets/images/products/meril-petroleum-jelly.webp") as ImageSourcePropType,
    ingredients: [sample("Petroleum jelly", "পেট্রোলিয়াম জেলি"), sample("Variant ingredients", "ভ্যারিয়েন্টের উপাদান")], ingredientExplanations: [sample("The product name identifies the product family; check the pack for the full ingredient list.", "পণ্যের নাম পণ্য-পরিবার বোঝায়; সম্পূর্ণ উপাদানের জন্য প্যাকেট দেখুন।"), sample("Ingredients can differ across product variants.", "পণ্যের ভ্যারিয়েন্ট অনুযায়ী উপাদান বদলাতে পারে।")],
    demo: true, gradeLabel: sample("Evidence summary only", "শুধু তথ্যের সারাংশ"), factors: [
      { label: sample("Ingredient disclosure", "উপাদানের তথ্য"), value: null, note: sample("Read the exact package label.", "সঠিক প্যাকেটের লেবেল পড়ুন।") },
      { label: sample("Variant / scent", "ভ্যারিয়েন্ট / সুগন্ধ"), value: null, note: sample("Personal suitability varies by product and person.", "পণ্য ও ব্যক্তিভেদে ব্যক্তিগত উপযোগিতা ভিন্ন হতে পারে।") },
      { label: sample("Evidence quality", "তথ্যের নির্ভরযোগ্যতা"), value: null, note: sample("No independent product-specific record is linked.", "স্বাধীন পণ্যভিত্তিক কোনো রেকর্ড যুক্ত নেই।") },
    ], evidence: evidenceCare(), reactionCounts: { likes: 154, dislikes: 14 },
  },
  {
    id: "keya-soap", barcode: "9000000000106", category: "personalCare",
    name: sample("Keya Beauty Soap", "কেয়া বিউটি সোপ"), brand: sample("Keya", "কেয়া"), size: sample("100 g", "১০০ গ্রাম"),
    description: sample("A Bangladesh soap example. This screen separates product-label information from food scoring.", "বাংলাদেশের সাবানের একটি উদাহরণ। এখানে পণ্যের লেবেলের তথ্য খাবারের স্কোর থেকে আলাদা রাখা হয়েছে।"), image: require("../assets/images/products/keya-beauty-soap.webp") as ImageSourcePropType,
    ingredients: [sample("Cleansing base", "ক্লিনজিং বেস"), sample("Fragrance", "সুগন্ধি")], ingredientExplanations: [sample("Check the package for the specific product formulation.", "পণ্যের নির্দিষ্ট ফর্মুলার জন্য প্যাকেট দেখুন।"), sample("Fragrance materials are listed according to the product label.", "পণ্যের লেবেল অনুযায়ী সুগন্ধির উপাদান তালিকাভুক্ত থাকে।")],
    demo: true, gradeLabel: sample("Evidence summary only", "শুধু তথ্যের সারাংশ"), factors: [
      { label: sample("Ingredient disclosure", "উপাদানের তথ্য"), value: null, note: sample("Read the current product label.", "বর্তমান পণ্যের লেবেল পড়ুন।") },
      { label: sample("Sensitivity context", "সংবেদনশীলতার প্রেক্ষাপট"), value: null, note: sample("This screen is not a personal suitability assessment.", "এই স্ক্রিন ব্যক্তিগত উপযোগিতা মূল্যায়ন করে না।") },
      { label: sample("Verification", "যাচাই"), value: null, note: sample("No independent product-specific record is linked.", "স্বাধীন পণ্যভিত্তিক কোনো রেকর্ড যুক্ত নেই।") },
    ], evidence: evidenceCare(), reactionCounts: { likes: 88, dislikes: 11 },
  },
  {
    id: "home-sample", barcode: "9000000000107", category: "household",
    name: sample("Vim Dishwashing Liquid", "ভিম ডিশওয়াশিং লিকুইড"), brand: sample("Vim", "ভিম"), size: sample("75 ml", "৭৫ মি.লি."),
    description: sample("A Bangladesh dishwashing product example. The result shows household-label details, not a food or personal-health grade.", "বাংলাদেশের বাসন ধোয়ার পণ্যের উদাহরণ। এখানে গৃহস্থালি লেবেলের তথ্য দেখানো হয়, খাবার বা ব্যক্তিগত-স্বাস্থ্য স্কোর নয়।"), image: require("../assets/images/products/vim-dishwash.webp") as ImageSourcePropType,
    ingredients: [sample("Cleaning agents", "পরিষ্কারক উপাদান"), sample("Fragrance", "সুগন্ধি")], ingredientExplanations: [sample("The full formulation is available on the current package label.", "সম্পূর্ণ ফর্মুলা বর্তমান প্যাকেটের লেবেলে দেখুন।"), sample("Check the package directions for handling and use.", "ব্যবহার ও সতর্কতার জন্য প্যাকেটের নির্দেশনা দেখুন।")],
    demo: true, gradeLabel: sample("Use-label summary only", "শুধু ব্যবহার-লেবেলের সারাংশ"), factors: [
      { label: sample("Directions for use", "ব্যবহারের নির্দেশনা"), value: null, note: sample("Read directions on the current package.", "বর্তমান প্যাকেটের নির্দেশনা পড়ুন।") },
      { label: sample("Precaution text", "সতর্কতার লেখা"), value: null, note: sample("Follow the package safety information.", "প্যাকেটের নিরাপত্তা-তথ্য অনুসরণ করুন।") },
      { label: sample("Verification", "যাচাই"), value: null, note: sample("No independent product-specific record is linked.", "স্বাধীন পণ্যভিত্তিক কোনো রেকর্ড যুক্ত নেই।") },
    ], evidence: evidenceHome(), reactionCounts: { likes: 67, dislikes: 4 },
  },
  {
    id: "wheel-powder", barcode: "9000000000108", category: "household",
    name: sample("Wheel Washing Powder", "হুইল ওয়াশিং পাউডার"), brand: sample("Wheel", "হুইল"), size: sample("1 kg", "১ কেজি"),
    description: sample("A Bangladesh laundry-care example. Its product information remains separate from nutrition and personal-care grades.", "বাংলাদেশের কাপড় ধোয়ার পণ্যের উদাহরণ। এর তথ্য পুষ্টি ও পার্সোনাল-কেয়ার গ্রেড থেকে আলাদা রাখা হয়েছে।"), image: require("../assets/images/products/wheel-detergent.webp") as ImageSourcePropType,
    ingredients: [sample("Surfactant blend", "সার্ফ্যাক্ট্যান্ট মিশ্রণ"), sample("Fragrance", "সুগন্ধি")], ingredientExplanations: [sample("Check the exact package for the full ingredient declaration.", "সম্পূর্ণ উপাদান ঘোষণার জন্য সঠিক প্যাকেট দেখুন।"), sample("Follow product directions and precautions.", "পণ্যের নির্দেশনা ও সতর্কতা অনুসরণ করুন।")],
    demo: true, gradeLabel: sample("Use-label summary only", "শুধু ব্যবহার-লেবেলের সারাংশ"), factors: [
      { label: sample("Directions for use", "ব্যবহারের নির্দেশনা"), value: null, note: sample("Read the directions on the current package.", "বর্তমান প্যাকেটের নির্দেশনা পড়ুন।") },
      { label: sample("Precaution text", "সতর্কতার লেখা"), value: null, note: sample("Follow the package safety information.", "প্যাকেটের নিরাপত্তা-তথ্য অনুসরণ করুন।") },
      { label: sample("Verification", "যাচাই"), value: null, note: sample("No independent product-specific record is linked.", "স্বাধীন পণ্যভিত্তিক কোনো রেকর্ড যুক্ত নেই।") },
    ], evidence: evidenceHome(), reactionCounts: { likes: 82, dislikes: 7 },
  },

  {
    id: "lux-soft-touch-soap", barcode: "9000000000210", category: "personalCare",
    name: sample("Lux Soft Touch Beauty Soap", "লাক্স সফট টাচ বিউটি সোপ"), brand: sample("Lux", "লাক্স"), size: sample("100 g", "১০০ গ্রাম"),
    description: sample("A familiar Bangladesh-market beauty-soap example. This prototype keeps personal-care evidence separate from food scoring.", "বাংলাদেশের বাজারের পরিচিত বিউটি-সাবানের উদাহরণ। এই প্রোটোটাইপে পার্সোনাল-কেয়ারের তথ্য খাবারের স্কোর থেকে আলাদা রাখা হয়েছে।"), image: require("../assets/images/products/generated/lux-soft-touch-soap.webp") as ImageSourcePropType,
    ingredients: [sample("Cleansing base", "ক্লিনজিং বেস"), sample("Fragrance", "সুগন্ধি"), sample("Moisturizing ingredients", "ময়েশ্চারাইজিং উপাদান")], ingredientExplanations: [sample("Check the current package for the exact formulation.", "সঠিক ফর্মুলার জন্য বর্তমান প্যাকেট দেখুন।"), sample("Fragrance materials vary by variant.", "ভ্যারিয়েন্ট অনুযায়ী সুগন্ধির উপাদান বদলাতে পারে।"), sample("Personal suitability varies by skin and product variant.", "ত্বক ও পণ্যের ভ্যারিয়েন্ট অনুযায়ী ব্যক্তিগত উপযোগিতা ভিন্ন হতে পারে।")],
    demo: true, gradeLabel: sample("Evidence summary only", "শুধু তথ্যের সারাংশ"), factors: [
      { label: sample("Ingredient disclosure", "উপাদানের তথ্য"), value: null, note: sample("Read the exact package label.", "সঠিক প্যাকেটের লেবেল পড়ুন।") },
      { label: sample("Variant / scent", "ভ্যারিয়েন্ট / সুগন্ধ"), value: null, note: sample("Personal suitability varies by product and person.", "পণ্য ও ব্যক্তিভেদে ব্যক্তিগত উপযোগিতা ভিন্ন হতে পারে।") },
      { label: sample("Evidence quality", "তথ্যের নির্ভরযোগ্যতা"), value: null, note: sample("No independent product-specific record is linked.", "স্বাধীন পণ্যভিত্তিক কোনো রেকর্ড যুক্ত নেই।") },
    ], evidence: evidenceCare(), reactionCounts: { likes: 96, dislikes: 8 },
  },
  {
    id: "sunsilk-black-shine", barcode: "9000000000211", category: "personalCare",
    name: sample("Sunsilk Black Shine Shampoo", "সানসিল্ক ব্ল্যাক শাইন শ্যাম্পু"), brand: sample("Sunsilk", "সানসিল্ক"), size: sample("180 ml", "১৮০ মি.লি."),
    description: sample("A Bangladesh-market shampoo example for label-first product exploration; it is not a hair-health assessment.", "লেবেল-ভিত্তিক পণ্য বোঝার জন্য বাংলাদেশের বাজারের শ্যাম্পুর উদাহরণ; এটি চুলের স্বাস্থ্যের মূল্যায়ন নয়।"), image: require("../assets/images/products/generated/sunsilk-black-shine.webp") as ImageSourcePropType,
    ingredients: [sample("Aqua", "পানি"), sample("Cleansing agents", "পরিষ্কারক উপাদান"), sample("Fragrance", "সুগন্ধি"), sample("Conditioning ingredients", "কন্ডিশনিং উপাদান")], ingredientExplanations: [sample("The full INCI list is printed on the current package.", "সম্পূর্ণ INCI তালিকা বর্তমান প্যাকেটে ছাপা থাকে।"), sample("Cleansing ingredients remove oil and residue; formulations vary.", "পরিষ্কারক উপাদান তেল ও অবশিষ্টাংশ দূর করে; ফর্মুলা ভিন্ন হতে পারে।"), sample("Check the label if fragrance sensitivity matters to you.", "সুগন্ধিতে সংবেদনশীলতা থাকলে লেবেল দেখুন।"), sample("Follow the package directions for use.", "ব্যবহারের জন্য প্যাকেটের নির্দেশনা অনুসরণ করুন।")],
    demo: true, gradeLabel: sample("Evidence summary only", "শুধু তথ্যের সারাংশ"), factors: [
      { label: sample("Ingredient disclosure", "উপাদানের তথ্য"), value: null, note: sample("Read the current product label.", "বর্তমান পণ্যের লেবেল পড়ুন।") },
      { label: sample("Use directions", "ব্যবহারের নির্দেশনা"), value: null, note: sample("Follow the exact package directions.", "সঠিক প্যাকেটের নির্দেশনা অনুসরণ করুন।") },
      { label: sample("Verification", "যাচাই"), value: null, note: sample("No independent product-specific record is linked.", "স্বাধীন পণ্যভিত্তিক কোনো রেকর্ড যুক্ত নেই।") },
    ], evidence: evidenceCare(), reactionCounts: { likes: 79, dislikes: 7 },
  },
  {
    id: "dettol-original-handwash", barcode: "9000000000212", category: "personalCare",
    name: sample("Dettol Original Handwash", "ডেটল অরিজিনাল হ্যান্ডওয়াশ"), brand: sample("Dettol", "ডেটল"), size: sample("200 ml", "২০০ মি.লি."),
    description: sample("A Bangladesh-market handwash example. Read the label and follow the product directions; this preview is not a medical or germ-protection claim.", "বাংলাদেশের বাজারের হ্যান্ডওয়াশের উদাহরণ। লেবেল পড়ে পণ্যের নির্দেশনা অনুসরণ করুন; এই প্রিভিউ চিকিৎসা বা জীবাণু-সুরক্ষার দাবি নয়।"), image: require("../assets/images/products/generated/dettol-original-handwash.webp") as ImageSourcePropType,
    ingredients: [sample("Aqua", "পানি"), sample("Cleansing agents", "পরিষ্কারক উপাদান"), sample("Fragrance", "সুগন্ধি")], ingredientExplanations: [sample("Check the current bottle for the exact ingredient list.", "সঠিক উপাদান তালিকার জন্য বর্তমান বোতল দেখুন।"), sample("Use the product according to its label directions.", "লেবেলের নির্দেশনা অনুযায়ী পণ্য ব্যবহার করুন।"), sample("Variant fragrance and ingredients can differ.", "ভ্যারিয়েন্ট অনুযায়ী সুগন্ধি ও উপাদান ভিন্ন হতে পারে।")],
    demo: true, gradeLabel: sample("Use-label summary only", "শুধু ব্যবহার-লেবেলের সারাংশ"), factors: [
      { label: sample("Directions for use", "ব্যবহারের নির্দেশনা"), value: null, note: sample("Follow the instructions on the current bottle.", "বর্তমান বোতলের নির্দেশনা অনুসরণ করুন।") },
      { label: sample("Precaution text", "সতর্কতার লেখা"), value: null, note: sample("Keep the product away from eyes and follow package precautions.", "চোখ থেকে দূরে রাখুন এবং প্যাকেটের সতর্কতা অনুসরণ করুন।") },
      { label: sample("Verification", "যাচাই"), value: null, note: sample("No independent product-specific record is linked.", "স্বাধীন পণ্যভিত্তিক কোনো রেকর্ড যুক্ত নেই।") },
    ], evidence: evidenceCare(), reactionCounts: { likes: 88, dislikes: 10 },
  },
  {
    id: "rin-power-bright", barcode: "9000000000213", category: "household",
    name: sample("Rin Power Bright Detergent", "রিন পাওয়ার ব্রাইট ডিটারজেন্ট"), brand: sample("Rin", "রিন"), size: sample("500 g", "৫০০ গ্রাম"),
    description: sample("A Bangladesh-market laundry-care example. Its result focuses on label use and precautions, not nutrition or health grading.", "বাংলাদেশের বাজারের কাপড় ধোয়ার পণ্যের উদাহরণ। এর ফলাফল ব্যবহার ও সতর্কতার লেবেলে কেন্দ্রীভূত, পুষ্টি বা স্বাস্থ্য-গ্রেডে নয়।"), image: require("../assets/images/products/generated/rin-power-bright.webp") as ImageSourcePropType,
    ingredients: [sample("Surfactant blend", "সার্ফ্যাক্ট্যান্ট মিশ্রণ"), sample("Builders", "বিল্ডার"), sample("Fragrance", "সুগন্ধি")], ingredientExplanations: [sample("The full formulation is available on the current pack.", "সম্পূর্ণ ফর্মুলা বর্তমান প্যাকেটে থাকে।"), sample("Follow the package directions for dose and fabric type.", "মাত্রা ও কাপড়ের ধরন অনুযায়ী প্যাকেটের নির্দেশনা অনুসরণ করুন।"), sample("Fragrance materials vary by product variant.", "পণ্যের ভ্যারিয়েন্ট অনুযায়ী সুগন্ধির উপাদান ভিন্ন হতে পারে।")],
    demo: true, gradeLabel: sample("Use-label summary only", "শুধু ব্যবহার-লেবেলের সারাংশ"), factors: [
      { label: sample("Directions for use", "ব্যবহারের নির্দেশনা"), value: null, note: sample("Read the dose and fabric instructions on the pack.", "প্যাকেটে মাত্রা ও কাপড়ের নির্দেশনা পড়ুন।") },
      { label: sample("Precaution text", "সতর্কতার লেখা"), value: null, note: sample("Follow the product safety information.", "পণ্যের নিরাপত্তা-তথ্য অনুসরণ করুন।") },
      { label: sample("Verification", "যাচাই"), value: null, note: sample("No independent product-specific record is linked.", "স্বাধীন পণ্যভিত্তিক কোনো রেকর্ড যুক্ত নেই।") },
    ], evidence: evidenceHome(), reactionCounts: { likes: 74, dislikes: 6 },
  },
  {
    id: "harpic-power-plus", barcode: "9000000000214", category: "household",
    name: sample("Harpic Power Plus Toilet Cleaner", "হারপিক পাওয়ার প্লাস টয়লেট ক্লিনার"), brand: sample("Harpic", "হারপিক"), size: sample("500 ml", "৫০০ মি.লি."),
    description: sample("A Bangladesh-market bathroom-care example. Always follow the exact bottle label and never mix cleaning chemicals.", "বাংলাদেশের বাজারের বাথরুম-কেয়ার পণ্যের উদাহরণ। বোতলের নির্দেশনা অনুসরণ করুন এবং কখনো পরিষ্কারক রাসায়নিক মেশাবেন না।"), image: require("../assets/images/products/generated/harpic-power-plus.webp") as ImageSourcePropType,
    ingredients: [sample("Cleaning agents", "পরিষ্কারক উপাদান"), sample("Acidic cleaning formula", "অ্যাসিডিক ক্লিনিং ফর্মুলা"), sample("Fragrance", "সুগন্ধি")], ingredientExplanations: [sample("Read the bottle label for the complete formulation and handling information.", "সম্পূর্ণ ফর্মুলা ও ব্যবহারের তথ্যের জন্য বোতলের লেবেল পড়ুন।"), sample("Do not mix with bleach or other cleaning products.", "ব্লিচ বা অন্য পরিষ্কারকের সঙ্গে মেশাবেন না।"), sample("Follow the package precaution text.", "প্যাকেটের সতর্কতার লেখা অনুসরণ করুন।")],
    demo: true, gradeLabel: sample("Use-label summary only", "শুধু ব্যবহার-লেবেলের সারাংশ"), factors: [
      { label: sample("Directions for use", "ব্যবহারের নির্দেশনা"), value: null, note: sample("Use only as directed on the current bottle.", "বর্তমান বোতলের নির্দেশনা অনুযায়ী ব্যবহার করুন।") },
      { label: sample("Precaution text", "সতর্কতার লেখা"), value: null, note: sample("Never mix cleaning chemicals; follow the label.", "পরিষ্কারক রাসায়নিক কখনো মেশাবেন না; লেবেল অনুসরণ করুন।") },
      { label: sample("Verification", "যাচাই"), value: null, note: sample("No independent product-specific record is linked.", "স্বাধীন পণ্যভিত্তিক কোনো রেকর্ড যুক্ত নেই।") },
    ], evidence: evidenceHome(), reactionCounts: { likes: 63, dislikes: 9 },
  },
  {
    id: "aci-aerosol", barcode: "9000000000215", category: "household",
    name: sample("ACI Aerosol Insect Killer", "এসি আই অ্যারোসল ইনসেক্ট কিলার"), brand: sample("ACI", "এসি আই"), size: sample("400 ml", "৪০০ মি.লি."),
    description: sample("A Bangladesh-market household insect-control example. This preview is a label guide, not an efficacy or safety certification.", "বাংলাদেশের বাজারের গৃহস্থালি পোকা নিয়ন্ত্রণ পণ্যের উদাহরণ। এই প্রিভিউ লেবেল গাইড, কার্যকারিতা বা নিরাপত্তার সনদ নয়।"), image: require("../assets/images/products/generated/aci-aerosol.webp") as ImageSourcePropType,
    ingredients: [sample("Aerosol propellant", "অ্যারোসল প্রোপেল্যান্ট"), sample("Active insect-control ingredients", "সক্রিয় পোকা-নিয়ন্ত্রণ উপাদান"), sample("Fragrance", "সুগন্ধি")], ingredientExplanations: [sample("The full active-ingredient and precaution information is on the can.", "সক্রিয় উপাদান ও সতর্কতার সম্পূর্ণ তথ্য ক্যানের গায়ে থাকে।"), sample("Use only according to the package directions.", "শুধু প্যাকেটের নির্দেশনা অনুযায়ী ব্যবহার করুন।"), sample("Keep away from children, food and flames as directed on the label.", "লেবেলের নির্দেশনা অনুযায়ী শিশু, খাবার ও আগুন থেকে দূরে রাখুন।")],
    demo: true, gradeLabel: sample("Use-label summary only", "শুধু ব্যবহার-লেবেলের সারাংশ"), factors: [
      { label: sample("Directions for use", "ব্যবহারের নির্দেশনা"), value: null, note: sample("Read the can before use and follow its directions.", "ব্যবহারের আগে ক্যানের লেখা পড়ে নির্দেশনা অনুসরণ করুন।") },
      { label: sample("Precaution text", "সতর্কতার লেখা"), value: null, note: sample("Follow storage, ventilation and handling precautions.", "সংরক্ষণ, বায়ু চলাচল ও ব্যবহারের সতর্কতা অনুসরণ করুন।") },
      { label: sample("Verification", "যাচাই"), value: null, note: sample("No independent product-specific record is linked.", "স্বাধীন পণ্যভিত্তিক কোনো রেকর্ড যুক্ত নেই।") },
    ], evidence: evidenceHome(), reactionCounts: { likes: 58, dislikes: 11 },
  },

  alternativeProduct({ id: "mangofield-mango-drink", barcode: "9000000000201", family: "mango-drink", name: sample("MangoField Mango Nectar", "ম্যাঙ্গোফিল্ড ম্যাঙ্গো নেকটার"), brand: sample("MangoField", "ম্যাঙ্গোফিল্ড"), size: sample("250 ml", "২৫০ মি.লি."), image: require("../assets/images/products/generated/mangofield-mango-drink.webp") as ImageSourcePropType, score: 88, ingredients: [sample("Water", "পানি"), sample("Mango pulp", "আমের পাল্প"), sample("Sugar", "চিনি")], reactionCounts: { likes: 188, dislikes: 11 } }),
  alternativeProduct({ id: "aamrush-mango-drink", barcode: "9000000000202", family: "mango-drink", name: sample("AamRush Mango Drink", "আমরাশ ম্যাঙ্গো ড্রিঙ্ক"), brand: sample("AamRush", "আমরাশ"), size: sample("250 ml", "২৫০ মি.লি."), image: require("../assets/images/products/generated/aamrush-mango-drink.webp") as ImageSourcePropType, score: 82, ingredients: [sample("Water", "পানি"), sample("Mango puree", "আমের পিউরি"), sample("Sugar", "চিনি")], reactionCounts: { likes: 164, dislikes: 14 } }),
  alternativeProduct({ id: "tropidrop-mango-drink", barcode: "9000000000203", family: "mango-drink", name: sample("TropiDrop Mango Fruit Drink", "ট্রপিড্রপ ম্যাঙ্গো ফ্রুট ড্রিঙ্ক"), brand: sample("TropiDrop", "ট্রপিড্রপ"), size: sample("200 ml", "২০০ মি.লি."), image: require("../assets/images/products/tropidrop-mango-drink.webp") as ImageSourcePropType, score: 74, ingredients: [sample("Water", "পানি"), sample("Mango juice", "আমের জুস"), sample("Sugar", "চিনি")], reactionCounts: { likes: 139, dislikes: 16 } }),
  alternativeProduct({ id: "dailycup-tomato-noodles", barcode: "9000000000204", family: "instant-noodles", name: sample("DailyCup Tomato Noodles", "ডেইলিকাপ টমেটো নুডলস"), brand: sample("DailyCup", "ডেইলিকাপ"), size: sample("70 g", "৭০ গ্রাম"), image: require("../assets/images/products/generated/dailycup-tomato-noodles.webp") as ImageSourcePropType, score: 86, ingredients: [sample("Wheat flour", "গমের আটা"), sample("Tomato seasoning", "টমেটো সিজনিং"), sample("Vegetable oil", "উদ্ভিজ্জ তেল")], reactionCounts: { likes: 174, dislikes: 12 } }),
  alternativeProduct({ id: "cocora-spicy-noodles", barcode: "9000000000205", family: "instant-noodles", name: sample("Cocora Spicy Noodles", "কোকোরা স্পাইসি নুডলস"), brand: sample("Cocora", "কোকোরা"), size: sample("70 g", "৭০ গ্রাম"), image: require("../assets/images/products/generated/cocora-spicy-noodles.webp") as ImageSourcePropType, score: 79, ingredients: [sample("Wheat flour", "গমের আটা"), sample("Chilli seasoning", "মরিচ সিজনিং"), sample("Palm oil", "পাম তেল")], reactionCounts: { likes: 156, dislikes: 17 } }),
  alternativeProduct({ id: "noodlecraft-masala", barcode: "9000000000206", family: "instant-noodles", name: sample("NoodleCraft Masala Noodles", "নুডলক্রাফট মসলা নুডলস"), brand: sample("NoodleCraft", "নুডলক্রাফট"), size: sample("65 g", "৬৫ গ্রাম"), image: require("../assets/images/products/generated/noodlecraft-masala.webp") as ImageSourcePropType, score: 71, ingredients: [sample("Wheat flour", "গমের আটা"), sample("Masala blend", "মসলা মিশ্রণ"), sample("Vegetable oil", "উদ্ভিজ্জ তেল")], reactionCounts: { likes: 128, dislikes: 19 } }),
  alternativeProduct({ id: "suncrisp-potato-chips", barcode: "9000000000207", family: "potato-snack", name: sample("SunCrisp Potato Chips", "সানক্রিস্প পটেটো চিপস"), brand: sample("SunCrisp", "সানক্রিস্প"), size: sample("25 g", "২৫ গ্রাম"), image: require("../assets/images/products/generated/suncrisp-potato-chips.webp") as ImageSourcePropType, score: 84, ingredients: [sample("Potatoes", "আলু"), sample("Vegetable oil", "উদ্ভিজ্জ তেল"), sample("Salt", "লবণ")], reactionCounts: { likes: 151, dislikes: 15 } }),
  alternativeProduct({ id: "crunchbay-potato-snack", barcode: "9000000000208", family: "potato-snack", name: sample("CrunchBay Potato Snack", "ক্রাঞ্চবে পটেটো স্ন্যাক"), brand: sample("CrunchBay", "ক্রাঞ্চবে"), size: sample("25 g", "২৫ গ্রাম"), image: require("../assets/images/products/generated/crunchbay-potato-snack.webp") as ImageSourcePropType, score: 77, ingredients: [sample("Potato", "আলু"), sample("Starch", "স্টার্চ"), sample("Seasoning", "সিজনিং")], reactionCounts: { likes: 136, dislikes: 18 } }),
  alternativeProduct({ id: "goldenroot-potato-crisps", barcode: "9000000000209", family: "potato-snack", name: sample("GoldenRoot Potato Crisps", "গোল্ডেনরুট পটেটো ক্রিস্পস"), brand: sample("GoldenRoot", "গোল্ডেনরুট"), size: sample("28 g", "২৮ গ্রাম"), image: require("../assets/images/products/generated/goldenroot-potato-crisps.webp") as ImageSourcePropType, score: 69, ingredients: [sample("Potato flakes", "আলুর ফ্লেক্স"), sample("Vegetable oil", "উদ্ভিজ্জ তেল"), sample("Salt", "লবণ")], reactionCounts: { likes: 119, dislikes: 21 } }),
];

export const productById = (id: string | undefined) => products.find((product) => product.id === id);
export const productByBarcode = (barcode: string) => products.find((product) => product.barcode === barcode.trim());
export const isHalalEligible = (product: Product) => Boolean(product.halalEvidence?.kind && product.halalEvidence.sourceUrl);
export const filterProductsByHalal = (items: Product[], halalMode: boolean) => halalMode ? items.filter(isHalalEligible) : items;
export const betterAlternatives = (product: Product, halalMode = false) => {
  const currentScore = product.score;
  if (product.category !== "food" || currentScore === undefined || currentScore >= 60 || !product.comparisonFamily) return [];
  return filterProductsByHalal(products.filter((candidate) =>
    candidate.category === "food" &&
    candidate.id !== product.id &&
    candidate.comparisonFamily === product.comparisonFamily &&
    candidate.brand.en !== product.brand.en &&
    candidate.score !== undefined &&
    candidate.score > 60 &&
    candidate.score > currentScore,
  ), halalMode)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, 3);
};

const copy = {
  brand: sample("NutriScan", "নিউট্রিস্ক্যান"),
  tagline: sample("Bangladesh label guide", "বাংলাদেশি লেবেল গাইড"),
  prototypeStatus: sample("Bangladesh · prototype", "বাংলাদেশ · প্রোটোটাইপ"),
  homeTitle: sample("Know What You Eat", "আপনি কী খান, জেনে নিন"),
  homeSubtitle: sample("Scan local products, then explore what the label does—and doesn’t—tell you.", "স্থানীয় পণ্য স্ক্যান করুন, তারপর লেবেল কী বলে—আর কী বলে না—দেখুন।"),
  scan: sample("Scan", "স্ক্যান"),
  discover: sample("Discover", "আবিষ্কার"),
  history: sample("History", "ইতিহাস"),
  contribute: sample("Contribute", "তথ্য দিন"),
  community: sample("Community", "কমিউনিটি"),
  support: sample("Support", "সহায়তা"),
  more: sample("More", "আরও"),
  food: sample("Food", "খাবার"),
  personalCare: sample("Personal care", "পার্সোনাল কেয়ার"),
  household: sample("Home care", "গৃহস্থালি"),
  allProducts: sample("All", "সব"),
  categories: sample("Explore by category", "ধরন অনুযায়ী দেখুন"),
  openScanner: sample("Open barcode scanner", "বারকোড স্ক্যানার খুলুন"),
  scannerHint: sample("Camera scan or enter the barcode yourself.", "ক্যামেরায় স্ক্যান করুন অথবা বারকোড লিখুন।"),
  enterBarcode: sample("Enter a barcode", "বারকোড লিখুন"),
  barcodePlaceholder: sample("e.g. 831730009403", "যেমন ৮৩১৭৩০০০৯৪০৩"),
  findProduct: sample("Find product", "পণ্য খুঁজুন"),
  sampleCatalog: sample("Explore the catalog", "ক্যাটালগ দেখুন"),
  demoNote: sample("Prototype product preview", "প্রোটোটাইপ পণ্যের প্রিভিউ"),
  demoProductCaveat: sample("Scores and selected label details in this preview are demonstration values. Use the current package label for a product decision.", "এই প্রিভিউর স্কোর ও কিছু লেবেল-তথ্য প্রদর্শনের জন্য। পণ্য বাছাইয়ে বর্তমান প্যাকেটের লেবেল দেখুন।"),
  viewDetails: sample("View details", "বিস্তারিত দেখুন"),
  noMatch: sample("No verified match yet", "এখনও যাচাইকৃত মিল নেই"),
  noMatchBody: sample("This barcode isn’t in the prototype catalog. You can prepare a local product-contribution draft; it won’t be sent anywhere.", "এই বারকোডটি প্রোটোটাইপ ক্যাটালগে নেই। পণ্যের তথ্যের স্থানীয় খসড়া তৈরি করতে পারেন; এটি কোথাও পাঠানো হবে না।"),
  sendForReview: sample("Contribute this product", "পণ্যটির তথ্য দিন"),
  grade: sample("Prototype food score", "প্রোটোটাইপ খাবার-স্কোর"),
  method: sample("How this food preview is composed", "এই খাবারের প্রিভিউ কীভাবে তৈরি"),
  methodNote: sample("This preview uses a transparent weighted breakdown; it is not a validated nutrition standard, medical advice or an official product assessment.", "এই প্রিভিউতে স্বচ্ছ ওজনভিত্তিক বিভাজন ব্যবহার করা হয়েছে; এটি যাচাইকৃত পুষ্টি-মানদণ্ড, চিকিৎসা-পরামর্শ বা সরকারি পণ্য-মূল্যায়ন নয়।"),
  halal: sample("Halal evidence", "হালাল তথ্য"),
  bstI: sample("BSTI evidence", "BSTI তথ্য"),
  unknown: sample("Not linked", "যুক্ত নেই"),
  source: sample("Source & status", "উৎস ও অবস্থা"),
  ingredients: sample("Label ingredients", "লেবেলের উপাদান"),
  productDetails: sample("Product details", "পণ্যের বিবরণ"),
  limitations: sample("Please note", "মনে রাখুন"),
  limitationText: sample("A barcode or package photo cannot verify lab results, trace contamination, halal status, or personal medical suitability.", "বারকোড বা প্যাকেটের ছবি পরীক্ষাগারের ফল, দূষণের উপস্থিতি, হালাল অবস্থা বা ব্যক্তিগত চিকিৎসাগত উপযোগিতা নিশ্চিত করে না।"),
  recent: sample("Your recent scans", "আপনার সাম্প্রতিক স্ক্যান"),
  seeAll: sample("See all", "সব দেখুন"),
  emptyHistory: sample("Your scans will appear here", "আপনার স্ক্যান এখানে দেখা যাবে"),
  emptyHistoryBody: sample("Try a product preview or open the scanner to get started.", "শুরু করতে পণ্যের প্রিভিউ দেখুন অথবা স্ক্যানার খুলুন।"),
  clearHistory: sample("Clear history", "ইতিহাস মুছুন"),
  sampleHistory: sample("Your recent scans will appear here after you open products.", "পণ্য দেখার পরে আপনার সাম্প্রতিক স্ক্যান এখানে দেখা যাবে।"),
  contributeTitle: sample("Help fill the local product shelf.", "স্থানীয় পণ্যের তথ্য যোগ করতে সাহায্য করুন।"),
  contributeBody: sample("Include both sides of a pack. In this prototype, photos and details stay on this device; no review team receives them.", "প্যাকেটের দুই পাশের তথ্য দিন। এই প্রোটোটাইপে ছবি ও বিবরণ এই ডিভাইসেই থাকে; কোনো পর্যালোচনা দল এগুলো পায় না।"),
  frontPhoto: sample("Front of pack", "প্যাকেটের সামনের দিক"),
  backPhoto: sample("Back / ingredient label", "পেছনের দিক / উপাদানের লেবেল"),
  addPhoto: sample("Take or choose photo", "ছবি তুলুন বা বাছুন"),
  productName: sample("Product name", "পণ্যের নাম"),
  brandName: sample("Brand / maker", "ব্র্যান্ড / প্রস্তুতকারক"),
  category: sample("Category", "ধরন"),
  barcode: sample("Barcode (if available)", "বারকোড (থাকলে)"),
  submitReview: sample("Save local contribution draft", "স্থানীয় তথ্যের খসড়া সংরক্ষণ"),
  pendingReview: sample("Local draft · not sent", "স্থানীয় খসড়া · পাঠানো হয়নি"),
  localDemoSubmission: sample("Saving here does not send the package to NutriScan or add it to a verified catalog.", "এখানে সংরক্ষণ করলে প্যাকেট NutriScan-এ পাঠানো বা যাচাইকৃত ক্যাটালগে যোগ হয় না।"),
  mySubmissions: sample("Your submissions", "আপনার জমা দেওয়া তথ্য"),
  noSubmissions: sample("No product submissions yet.", "এখনও কোনো পণ্যের তথ্য জমা দেননি।"),
  pointsAfterReview: sample("No points are awarded in this prototype. A future live program could award points after team review and acceptance.", "এই প্রোটোটাইপে কোনো পয়েন্ট দেওয়া হয় না। ভবিষ্যতের লাইভ ব্যবস্থায় দল পর্যালোচনা করে গ্রহণ করলে পয়েন্ট দেওয়া হতে পারে।"),
  leaderboardTitle: sample("Helpful shelf scouts", "সহায়ক পণ্য-তথ্যদাতারা"),
  leaderboardBody: sample("Demo names and points only—not a live community list. Points never influence product grades or verification.", "ডেমো নাম ও পয়েন্ট—লাইভ কমিউনিটি তালিকা নয়। পয়েন্ট কখনো পণ্যের গ্রেড বা যাচাইকে প্রভাবিত করে না।"),
  yourPoints: sample("Your accepted points", "আপনার গৃহীত পয়েন্ট"),
  demoBoard: sample("Demo leaderboard", "ডেমো লিডারবোর্ড"),
  supportTitle: sample("Keep the label library growing.", "লেবেলের তথ্যভান্ডার বাড়াতে সহায়তা করুন।"),
  supportBody: sample("NutriScan is exploring community support for catalog review, hosting, and maintenance.", "ক্যাটালগ পর্যালোচনা, হোস্টিং ও রক্ষণাবেক্ষণের জন্য কমিউনিটির সহায়তার পথ খুঁজছে NutriScan।"),
  voluntary: sample("Always voluntary", "সম্পূর্ণ ঐচ্ছিক"),
  donationStatus: sample("Payment details are not connected in this prototype. No donation will be charged.", "এই প্রোটোটাইপে পেমেন্ট তথ্য যুক্ত নেই। কোনো অনুদান নেওয়া হবে না।"),
  howFundsHelp: sample("Where support would go", "সহায়তা যেসব কাজে লাগবে"),
  fundsOne: sample("Reviewing new local product labels", "নতুন স্থানীয় পণ্যের লেবেল পর্যালোচনা"),
  fundsTwo: sample("Keeping the catalog and service running", "ক্যাটালগ ও সেবা চালু রাখা"),
  fundsThree: sample("Improving bilingual access and scan tools", "দ্বিভাষিক সুবিধা ও স্ক্যান টুল উন্নত করা"),
  scannerTitle: sample("Scan a barcode", "বারকোড স্ক্যান করুন"),
  scannerHelp: sample("Hold the barcode inside the frame. Camera scan is available on a supported device; manual/demo lookup works in Preview.", "বারকোডটি ফ্রেমের মধ্যে ধরুন। সমর্থিত ডিভাইসে ক্যামেরা স্ক্যান চালু হবে; প্রিভিউতে বারকোড লিখে বা ডেমো ব্যবহার করুন।"),
  cameraPermission: sample("Allow camera access to scan a barcode.", "বারকোড স্ক্যান করতে ক্যামেরা ব্যবহারের অনুমতি দিন।"),
  cameraUnavailable: sample("Camera scanning is not available here. Enter a barcode or try a product preview.", "এখানে ক্যামেরা স্ক্যান পাওয়া যাচ্ছে না। বারকোড লিখুন অথবা পণ্যের প্রিভিউ দেখুন।"),
  unknownBarcode: sample("Not in the prototype catalog", "প্রোটোটাইপ ক্যাটালগে নেই"),
  unknownBarcodeBody: sample("No product match was found. That does not mean the product is unsafe or safe.", "পণ্যের কোনো মিল পাওয়া যায়নি। এর মানে পণ্যটি নিরাপদ বা অনিরাপদ—কোনোটিই নয়।"),
  chooseDemo: sample("Or browse the product catalog", "অথবা পণ্যের ক্যাটালগ দেখুন"),
  uploadHint: sample("Front and back images help distinguish size, variant, and ingredient-label changes.", "সামনে ও পেছনের ছবি দিয়ে সাইজ, ধরন এবং উপাদানের লেবেলের পরিবর্তন আলাদা করা যায়।"),
  submissionSuccess: sample("Saved on this device only; nothing was sent.", "শুধু এই ডিভাইসে সংরক্ষিত; কিছুই পাঠানো হয়নি।"),
  details: sample("Details", "বিস্তারিত"),
  close: sample("Close", "বন্ধ করুন"),
  sample: sample("Preview", "প্রিভিউ"),
  noGrade: sample("No overall grade", "সামগ্রিক গ্রেড নেই"),
  viewAssessment: sample("Assessment approach", "মূল্যায়ন পদ্ধতি"),
  productNotFound: sample("Product record not found", "পণ্যের রেকর্ড পাওয়া যায়নি"),
  discoverTitle: sample("Browse the local shelf", "স্থানীয় পণ্যের তাক ঘুরে দেখুন"),
  discoverSubtitle: sample("Explore the products currently in NutriScan’s catalog preview.", "NutriScan-এর ক্যাটালগ প্রিভিউতে থাকা পণ্যগুলো দেখুন।"),
  searchCatalog: sample("Search product or brand", "পণ্য বা ব্র্যান্ড খুঁজুন"),
  resultCount: sample("products", "টি পণ্য"),
  foodShelf: sample("Food products", "খাবার পণ্য"),
  allCategories: sample("All categories", "সব ধরন"),
  aboutThisSample: sample("About this preview", "এই প্রিভিউ সম্পর্কে"),
  imageNote: sample("Package photo is for recognition; check the current pack for product details.", "পণ্য চেনার জন্য প্যাকেটের ছবি; বিস্তারিত জানতে বর্তমান প্যাকেট দেখুন।"),
  perServing: sample("Per serving", "প্রতি পরিবেশন"),
  positiveFactors: sample("Positive factors", "ইতিবাচক দিক"),
  negativeFactors: sample("Caution factors", "সতর্কতার দিক"),
  otherFactors: sample("Other details", "অন্যান্য তথ্য"),
  scoreBreakdown: sample("How the preview score is composed", "প্রিভিউ স্কোরের বিভাজন"),
  addFavorite: sample("Add to favorites", "পছন্দের তালিকায় রাখুন"),
  removeFavorite: sample("Remove from favorites", "পছন্দের তালিকা থেকে সরান"),
  savedFavorite: sample("Saved to favorites", "পছন্দের তালিকায় রাখা হয়েছে"),
  viewFoodPreferences: sample("Food preferences", "খাবারের পছন্দ"),
  foodPreferencesNote: sample("Personal preferences do not change this prototype score.", "ব্যক্তিগত পছন্দ এই প্রোটোটাইপ স্কোর বদলায় না।"),
  expand: sample("Show explanation", "ব্যাখ্যা দেখুন"),
  collapse: sample("Hide explanation", "ব্যাখ্যা লুকান"),
  brandAbout: sample("Your NutriScan space", "আপনার NutriScan"),
  moreTitle: sample("More for your shelf", "আপনার পণ্যের জন্য আরও"),
  moreSubtitle: sample("Profile, daily facts, community and support.", "প্রোফাইল, দৈনিক তথ্য, কমিউনিটি ও সহায়তা।"),
  openCommunity: sample("Open contributor leaderboard", "অবদানকারীদের তালিকা খুলুন"),
  openSupport: sample("Support NutriScan", "NutriScan-কে সহায়তা করুন"),
  favoritesTitle: sample("Your favorites", "আপনার পছন্দের পণ্য"),
  noFavorites: sample("No favorites yet", "এখনও পছন্দের পণ্য নেই"),
  emptyFavoritesHint: sample("Save a product from its detail page.", "পণ্যের বিবরণ থেকে সেটি পছন্দের তালিকায় রাখুন।"),
  openProfile: sample("My Profile", "আমার প্রোফাইল"),
  profileSubtitle: sample("Edit your local profile", "নিজের স্থানীয় প্রোফাইল সম্পাদনা করুন"),
  myProfile: sample("Profile details", "প্রোফাইলের তথ্য"),
  profilePrivacy: sample("This profile is stored on this device only; there is no account sync.", "এই প্রোফাইল শুধু এই ডিভাইসে থাকে; কোনো অ্যাকাউন্টে সিঙ্ক হয় না।"),
  displayName: sample("Display name", "প্রদর্শিত নাম"),
  displayNamePlaceholder: sample("Your name", "আপনার নাম"),
  district: sample("District", "জেলা"),
  districtPlaceholder: sample("e.g. Dhaka", "যেমন ঢাকা"),
  saveProfile: sample("Save profile", "প্রোফাইল সংরক্ষণ"),
  profileSaved: sample("Profile saved on this device.", "প্রোফাইল এই ডিভাইসে সংরক্ষিত হয়েছে।"),
  openNutriFacts: sample("NutriFacts", "নিউট্রিফ্যাক্টস"),
  nutriFactsSubtitle: sample("Daily tips, ingredient insights and food facts.", "দৈনিক পরামর্শ, উপাদানের তথ্য ও খাবারবিষয়ক জ্ঞান।"),
  dailyHealthTip: sample("Daily health tip", "আজকের স্বাস্থ্য-পরামর্শ"),
  ingredientInsight: sample("Ingredient insight", "উপাদান সম্পর্কে জানুন"),
  mythVsFact: sample("Myth vs Fact", "মিথ বনাম সত্য"),
  interestingFact: sample("Interesting fact", "মজার তথ্য"),
  generalEducation: sample("General education · not personal medical advice", "সাধারণ তথ্য · ব্যক্তিগত চিকিৎসা-পরামর্শ নয়"),
  readSource: sample("Source", "উৎস"),
  sampleReactions: sample("Starting preview counts · your vote stays on this device", "প্রিভিউর প্রাথমিক সংখ্যা · আপনার ভোট এই ডিভাইসেই থাকে"),
  reactionPrompt: sample("Was this product information useful?", "পণ্যের এই তথ্য কি কাজে লেগেছে?"),
  likes: sample("likes", "পছন্দ"),
  dislikes: sample("dislikes", "অপছন্দ"),
  like: sample("Like", "পছন্দ"),
  dislike: sample("Dislike", "অপছন্দ"),
  undoVote: sample("Remove your vote", "আপনার ভোট সরান"),
  betterAlternatives: sample("Better Alternatives", "আরও ভালো বিকল্প"),
  betterAlternativesNote: sample("Same-family products with preview scores above 60. Scores are prototype comparisons, not a health or safety determination.", "একই ধরনের পণ্যের ৬০-এর বেশি প্রিভিউ স্কোর। স্কোর স্বাস্থ্য বা নিরাপত্তার সরকারি সিদ্ধান্ত নয়।"),
  halalMode: sample("Halal Mode", "হালাল মোড"),
  halalModeDescription: sample("Show only products with a product-specific halal mark or certificate record.", "পণ্যভিত্তিক হালাল মার্ক বা সনদের রেকর্ড থাকা পণ্যই দেখান।"),
  halalModeOn: sample("Halal Mode on", "হালাল মোড চালু"),
  halalModeOff: sample("Halal Mode off", "হালাল মোড বন্ধ"),
  halalModeActive: sample("Only products with exact-product halal evidence are shown.", "নির্দিষ্ট পণ্যের হালাল তথ্য থাকা পণ্যই দেখানো হচ্ছে।"),
  halalEmptyTitle: sample("No eligible products here", "এখানে যোগ্য পণ্য নেই"),
  halalEmptyBody: sample("Halal Mode is hiding products without exact-product evidence. Turn it off in More to see the full prototype catalog.", "নির্দিষ্ট পণ্যের তথ্য না থাকায় হালাল মোড কিছু পণ্য লুকিয়েছে। সম্পূর্ণ প্রোটোটাইপ ক্যাটালগ দেখতে More থেকে এটি বন্ধ করুন।"),
  halalBlockedTitle: sample("Product hidden in Halal Mode", "হালাল মোডে পণ্যটি লুকানো হয়েছে"),
  halalBlockedBody: sample("This product does not have exact-product halal evidence in the prototype catalog. No product details were opened.", "এই পণ্যের নির্দিষ্ট হালাল তথ্য প্রোটোটাইপ ক্যাটালগে নেই। পণ্যের বিবরণ খোলা হয়নি।"),
  turnOffHalalMode: sample("Turn off Halal Mode", "হালাল মোড বন্ধ করুন"),
  halalEvidenceLabel: sample("Exact-product evidence", "নির্দিষ্ট পণ্যের তথ্য"),
  packageMarkEvidence: sample("Halal mark shown on the exact package record.", "নির্দিষ্ট প্যাকেট রেকর্ডে হালাল মার্ক দেখানো হয়েছে।"),
} satisfies Record<string, Localized>;

export type CopyKey = keyof typeof copy;
export const t = (language: Language, key: CopyKey): string => copy[key][language];
export const productName = (product: Product, language: Language) => product.name[language];
export const productBrand = (product: Product, language: Language) => product.brand[language];
export const categoryLabel = (category: Category, language: Language) =>
  t(language, category === "food" ? "food" : category === "personalCare" ? "personalCare" : "household");
