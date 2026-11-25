import { useMemo, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  Card,
  DemoNotice,
  EmptyState,
  PageHeader,
  Pill,
  ProductRow,
  Screen,
  SecondaryButton,
  SectionHeading,
  usePalette,
} from "@/components/nutriscan-ui";
import { isHalalEligible, products } from "@/lib/nutriscan-data";
import type { Localized } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

type ConcernLevel = "none" | "low" | "moderate" | "high";

type IngredientEntry = {
  id: string;
  name: Localized;
  purpose: Localized;
  details: Localized;
  concern: ConcernLevel;
  allergen: boolean;
  allergenNote?: Localized;
  source: string;
  keywords: string[];
};

const INGREDIENTS_DB: IngredientEntry[] = [
  {
    id: "sugar",
    name: { en: "Sugar (Sucrose)", bn: "চিনি (সুক্রোজ)" },
    purpose: { en: "Sweetener", bn: "মিষ্টি করার উপাদান" },
    details: {
      en: "A common sweetener derived from sugarcane or sugar beet. WHO recommends limiting free sugar intake to less than 10% of total daily energy.",
      bn: "আখ বা বিট থেকে প্রাপ্ত সাধারণ মিষ্টিকারক। WHO মোট দৈনিক শক্তির ১০%-এর কম মুক্ত শর্করা গ্রহণের পরামর্শ দেয়।",
    },
    concern: "moderate",
    allergen: false,
    source: "WHO · Guideline: Sugars intake for adults and children",
    keywords: ["sugar", "sucrose", "চিনি"],
  },
  {
    id: "sodium",
    name: { en: "Sodium (Salt)", bn: "সোডিয়াম (লবণ)" },
    purpose: { en: "Preservative and flavor enhancer", bn: "সংরক্ষণকারী ও স্বাদবর্ধক" },
    details: {
      en: "Essential in small amounts, but excess sodium intake is linked to high blood pressure. WHO advises less than 5 g of salt (about 2,000 mg sodium) per day for adults.",
      bn: "অল্প পরিমাণে প্রয়োজনীয়, তবে অতিরিক্ত সোডিয়াম উচ্চ রক্তচাপের ঝুঁকি বাড়ায়। WHO প্রাপ্তবয়স্কদের দিনে ৫ গ্রামের কম লবণ খাওয়ার পরামর্শ দেয়।",
    },
    concern: "moderate",
    allergen: false,
    source: "WHO · Sodium reduction fact sheet",
    keywords: ["salt", "sodium", "লবণ", "সোডিয়াম"],
  },
  {
    id: "wheat-flour",
    name: { en: "Wheat Flour", bn: "গমের আটা" },
    purpose: { en: "Base grain & structure", bn: "মূল শস্য ও গঠন উপাদান" },
    details: {
      en: "Milled from wheat grain and widely used in baked goods, noodles, and snacks. Provides carbohydrates and some protein.",
      bn: "গম থেকে তৈরি আটা, যা বেকারি পণ্য, নুডলস ও স্ন্যাকসে ব্যবহৃত হয়। এতে শর্করা ও কিছু প্রোটিন থাকে।",
    },
    concern: "low",
    allergen: true,
    allergenNote: {
      en: "Contains gluten — a concern for people with celiac disease or gluten sensitivity.",
      bn: "এতে গ্লুটেন থাকে — সিলিয়াক রোগ বা গ্লুটেন সংবেদনশীল ব্যক্তিদের জন্য সতর্কতা প্রয়োজন।",
    },
    source: "Codex Alimentarius · Food allergen labeling",
    keywords: ["wheat", "flour", "আটা", "ময়দা", "গম"],
  },
  {
    id: "vegetable-oil",
    name: { en: "Vegetable Oil", bn: "উদ্ভিজ্জ তেল" },
    purpose: { en: "Cooking medium & texture", bn: "রান্নার মাধ্যম ও টেক্সচার" },
    details: {
      en: "Plant-derived oils used for frying, baking, and mouthfeel. Nutritional quality depends on the specific oil blend and processing.",
      bn: "ভাজা, বেকিং ও স্বাদের জন্য ব্যবহৃত উদ্ভিজ্জ তেল। এর পুষ্টিগুণ নির্দিষ্ট তেলের ধরন ও প্রক্রিয়াজাতকরণের ওপর নির্ভর করে।",
    },
    concern: "low",
    allergen: false,
    source: "WHO · Healthy diet fats guidance",
    keywords: ["vegetable oil", "oil", "উদ্ভিজ্জ তেল", "তেল"],
  },
  {
    id: "artificial-colors",
    name: { en: "Artificial Colors (E-numbers)", bn: "কৃত্রিম রং (ই-নম্বর)" },
    purpose: { en: "Visual appearance", bn: "দৃশ্যমান রং আকর্ষণীয় করা" },
    details: {
      en: "Synthetic dyes added to standardize or brighten food color. Regulated within acceptable daily intake limits, though some consumers prefer minimizing them.",
      bn: "খাবারের রং উজ্জ্বল ও একরূপ রাখতে ব্যবহৃত কৃত্রিম রঞ্জক। অনুমোদিত মাত্রার মধ্যে নিয়ন্ত্রিত, তবে অনেকেই এগুলো কম খাওয়া পছন্দ করেন।",
    },
    concern: "moderate",
    allergen: false,
    source: "JECFA / Codex · Food additives",
    keywords: ["color", "colour", "e-", "রং"],
  },
  {
    id: "msg",
    name: { en: "Monosodium Glutamate (MSG)", bn: "মনোসোডিয়াম গ্লুটামেট" },
    purpose: { en: "Umami flavor enhancer", bn: "উমামি স্বাদবর্ধক" },
    details: {
      en: "The sodium salt of glutamic acid, naturally found in tomatoes and cheese. Major food safety bodies classify MSG as safe at normal dietary levels, debunking common myths of universal toxicity.",
      bn: "গ্লুটামিক অ্যাসিডের সোডিয়াম লবণ, যা প্রাকৃতিকভাবে টমেটো ও চিজ-এও থাকে। প্রধান খাদ্য নিরাপত্তা সংস্থাগুলো স্বাভাবিক মাত্রায় এটিকে নিরাপদ বলে বিবেচনা করে।",
    },
    concern: "low",
    allergen: false,
    source: "FDA / JECFA · Glutamate safety review",
    keywords: ["msg", "glutamate", "গ্লুটামেট", "টেস্টিং সল্ট"],
  },
  {
    id: "acidity-regulator",
    name: { en: "Acidity Regulator", bn: "অম্লতা নিয়ন্ত্রক" },
    purpose: { en: "pH balance & tartness", bn: "অম্লতা নিয়ন্ত্রণ ও স্বাদ" },
    details: {
      en: "Ingredients such as citric acid used to control acidity, preserve freshness, and balance sweetness in beverages and sauces.",
      bn: "সাইট্রিক অ্যাসিডের মতো উপাদান যা পানীয় ও সসে অম্লতা নিয়ন্ত্রণ করে, সতেজতা বজায় রাখে ও স্বাদের ভারসাম্য আনে।",
    },
    concern: "low",
    allergen: false,
    source: "Codex Alimentarius · Acidity regulators",
    keywords: ["acidity regulator", "citric", "অম্লতা নিয়ন্ত্রক"],
  },
  {
    id: "preservatives",
    name: { en: "Preservatives", bn: "সংরক্ষণকারী উপাদান" },
    purpose: { en: "Shelf-life extension", bn: "মেয়াদ বৃদ্ধি" },
    details: {
      en: "Added to inhibit spoilage from bacteria, yeast, or mold. Check product labels if you prefer minimally processed foods.",
      bn: "ব্যাকটেরিয়া বা ছত্রাকের কারণে খাবার নষ্ট হওয়া রোধে ব্যবহৃত হয়। কম প্রক্রিয়াজাত খাবার চাইলে লেবেল দেখে নিন।",
    },
    concern: "low",
    allergen: false,
    source: "Codex Alimentarius · General Standard for Food Additives",
    keywords: ["preservative", "সংরক্ষণকারী"],
  },
  {
    id: "fragrance",
    name: { en: "Fragrance / Perfume", bn: "সুগন্ধি" },
    purpose: { en: "Scent (personal care only)", bn: "সুগন্ধ (শুধু ব্যক্তিগত যত্নের পণ্যে)" },
    details: {
      en: "Used in soaps, shampoos, and household products for scent. Not a food ingredient; sensitive skin types may prefer fragrance-free options.",
      bn: "সাবান, শ্যাম্পু ও গৃহস্থালি পণ্যে সুগন্ধের জন্য ব্যবহৃত হয়। এটি খাদ্য উপাদান নয়; সংবেদনশীল ত্বকের জন্য সুগন্ধিমুক্ত পণ্য ভালো হতে পারে।",
    },
    concern: "low",
    allergen: false,
    source: "Cosmetic ingredient safety reference",
    keywords: ["fragrance", "perfume", "সুগন্ধি"],
  },
  {
    id: "mango-pulp",
    name: { en: "Mango Pulp", bn: "আমের পাল্প" },
    purpose: { en: "Fruit base & natural flavor", bn: "ফলের ভিত্তি ও প্রাকৃতিক স্বাদ" },
    details: {
      en: "Concentrated or pureed mango fruit used in juices and nectar drinks. Whole fruit retains more fiber than strained juice.",
      bn: "জুস ও পানীয়তে ব্যবহৃত আমের শাঁস। প্রক্রিয়াজাত রসের তুলনায় আস্ত ফলে আঁশ বেশি থাকে।",
    },
    concern: "none",
    allergen: false,
    source: "WHO · Fruits and vegetables guidance",
    keywords: ["mango", "pulp", "আম", "পাল্প"],
  },
  {
    id: "black-tea",
    name: { en: "Black Tea Leaves", bn: "কালো চা পাতা" },
    purpose: { en: "Tea base & polyphenols", bn: "চায়ের মূল উপাদান ও পলিফেনল" },
    details: {
      en: "Oxidized leaves of Camellia sinensis, naturally containing caffeine and antioxidant polyphenols with virtually zero calories when brewed plain.",
      bn: "ক্যামেলিয়া সিনেনসিস গাছের পাতা, যাতে প্রাকৃতিক ক্যাফেইন ও অ্যান্টিঅক্সিডেন্ট থাকে। চিনি ছাড়া তৈরি করলে ক্যালোরি প্রায় শূন্য।",
    },
    concern: "none",
    allergen: false,
    source: "General food science reference",
    keywords: ["tea", "চা"],
  },
  {
    id: "potato-flakes",
    name: { en: "Potato Flakes", bn: "আলুর ফ্লেক্স" },
    purpose: { en: "Snack base", bn: "স্ন্যাকসের মূল উপাদান" },
    details: {
      en: "Dehydrated mashed potato flakes used to form uniform chips and crisps. Overall nutrition depends on added oil and salt.",
      bn: "শুকনো আলুর গুঁড়ো বা ফ্লেক্স যা চিপস তৈরিতে ব্যবহৃত হয়। চূড়ান্ত পুষ্টিগুণ যোগ করা তেল ও লবণের ওপর নির্ভর করে।",
    },
    concern: "none",
    allergen: false,
    source: "General food processing reference",
    keywords: ["potato", "আলু"],
  },
  {
    id: "raising-agent",
    name: { en: "Raising Agent (Baking Powder)", bn: "ফুলানোর উপাদান" },
    purpose: { en: "Leavening & lightness", bn: "খাবার ফোলাতে ও হালকা করতে" },
    details: {
      en: "Releases carbon dioxide during baking to give biscuits and cakes a light, airy texture.",
      bn: "বেকিংয়ের সময় বিস্কুট ও কেককে হালকা ও নরম করতে সাহায্য করে।",
    },
    concern: "none",
    allergen: false,
    source: "Codex Alimentarius · Raising agents",
    keywords: ["raising", "baking", "ফুলানোর"],
  },
  {
    id: "seasoning",
    name: { en: "Seasoning Blend", bn: "সিজনিং মিশ্রণ" },
    purpose: { en: "Savory flavor profile", bn: "নোনতা ও মসলাদার স্বাদ" },
    details: {
      en: "A mix of spices, salt, flavorings, and sometimes dairy or soy solids used in noodles and snacks.",
      bn: "নুডলস ও স্ন্যাকসে ব্যবহৃত মসলা, লবণ ও স্বাদবর্ধকের মিশ্রণ।",
    },
    concern: "low",
    allergen: true,
    allergenNote: {
      en: "Seasonings may contain allergens (soy, wheat, milk) — check the specific product label.",
      bn: "সিজনিংয়ে সয়া, গম বা দুধের মতো অ্যালার্জেন থাকতে পারে — পণ্যের নির্দিষ্ট লেবেল দেখুন।",
    },
    source: "Food allergen labeling guidance",
    keywords: ["seasoning", "spice", "masala", "সিজনিং", "মসলা"],
  },
  {
    id: "palm-oil",
    name: { en: "Palm Oil", bn: "পাম তেল" },
    purpose: { en: "Frying & shelf stability", bn: "ভাজা ও সংরক্ষণ স্থায়িত্ব" },
    details: {
      en: "Widely used in packaged snacks and noodles because it resists oxidation. Higher in saturated fat (~50%) than many liquid vegetable oils; WHO advises keeping saturated fat under 10% of daily energy.",
      bn: "প্যাকেটজাত স্ন্যাকস ও নুডলসে বহুল ব্যবহৃত তেল। এতে সম্পৃক্ত চর্বির পরিমাণ তুলনামূলক বেশি; WHO দৈনিক শক্তির ১০%-এর কম সম্পৃক্ত চর্বি গ্রহণের পরামর্শ দেয়।",
    },
    concern: "moderate",
    allergen: false,
    source: "WHO · Saturated fatty acid guideline",
    keywords: ["palm", "পাম"],
  },
];

export default function IngredientDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const palette = usePalette();
  const { language, halalMode } = useNutriScan();
  const [searchQuery, setSearchQuery] = useState("");

  const rawId = typeof id === "string" ? id : "";
  const isSearchMode = rawId === "search";

  const ingredient = useMemo(
    () =>
      INGREDIENTS_DB.find(
        (item) =>
          item.id === rawId ||
          item.keywords.some((kw) => rawId.toLowerCase().includes(kw.toLowerCase())),
      ),
    [rawId],
  );

  const filteredIngredients = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return INGREDIENTS_DB;
    return INGREDIENTS_DB.filter(
      (item) =>
        item.name.en.toLowerCase().includes(q) ||
        item.name.bn.toLowerCase().includes(q) ||
        item.purpose.en.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  const matchingProducts = useMemo(() => {
    if (!ingredient) return [];
    return products.filter((product) => {
      if (halalMode && !isHalalEligible(product)) return false;
      return product.ingredients.some((ing) => {
        const text = `${ing.en} ${ing.bn}`.toLowerCase();
        return ingredient.keywords.some((kw) => text.includes(kw.toLowerCase()));
      });
    });
  }, [ingredient, halalMode]);

  if (isSearchMode) {
    return (
      <Screen contentStyle={{ gap: 16 }}>
        <PageHeader
          title={language === "en" ? "Ingredient Guide" : "উপাদান গাইড"}
          subtitle={language === "en" ? "Browse common packaged-product ingredients" : "প্যাকেটজাত পণ্যের সাধারণ উপাদানগুলো দেখুন"}
          back={() => router.back()}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            borderWidth: 1,
            borderColor: palette.line,
            backgroundColor: palette.card,
            borderRadius: 14,
            paddingHorizontal: 13,
            paddingVertical: 10,
          }}
        >
          <MaterialCommunityIcons name="magnify" size={20} color={palette.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={language === "en" ? "Search ingredients…" : "উপাদান খুঁজুন…"}
            placeholderTextColor={palette.muted}
            style={{ flex: 1, fontSize: 13, color: palette.ink }}
          />
        </View>

        <Card style={{ paddingVertical: 4, gap: 0 }}>
          {filteredIngredients.map((item, idx) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              onPress={() => router.push({ pathname: "/ingredient/[id]", params: { id: item.id } })}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                paddingVertical: 13,
                borderTopWidth: idx ? 1 : 0,
                borderTopColor: palette.line,
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <View style={{ flex: 1, gap: 2 }}>
                <AppText weight="semibold" style={{ fontSize: 13 }}>
                  {item.name[language]}
                </AppText>
                <AppText style={{ color: palette.muted, fontSize: 11 }}>
                  {item.purpose[language]}
                </AppText>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={19} color={palette.muted} />
            </Pressable>
          ))}
        </Card>

        <DemoNotice>
          {language === "en"
            ? "This is general information, not medical advice."
            : "এটি সাধারণ তথ্য, চিকিৎসা পরামর্শ নয়।"}
        </DemoNotice>
      </Screen>
    );
  }

  if (!ingredient) {
    return (
      <Screen contentStyle={{ gap: 16 }}>
        <PageHeader
          title={language === "en" ? "Ingredient" : "উপাদান"}
          back={() => router.back()}
        />
        <Card>
          <EmptyState
            icon="flask-outline"
            title={language === "en" ? "Ingredient not found" : "উপাদানটি পাওয়া যায়নি"}
            body={
              language === "en"
                ? "This ingredient is not in the prototype reference list yet."
                : "এই উপাদানটি এখনও প্রোটোটাইপ তালিকায় যুক্ত হয়নি।"
            }
            action={{
              label: language === "en" ? "Browse all ingredients" : "সব উপাদান দেখুন",
              onPress: () => router.replace({ pathname: "/ingredient/[id]", params: { id: "search" } }),
            }}
          />
        </Card>
      </Screen>
    );
  }

  const purposeTone: "green" | "amber" | "clay" =
    ingredient.concern === "none"
      ? "green"
      : ingredient.concern === "moderate"
        ? "amber"
        : ingredient.concern === "high"
          ? "clay"
          : "green";

  const concernLabel: Localized = {
    none: { en: "No major concern", bn: "বড় কোনো উদ্বেগ নেই" },
    low: { en: "Low concern", bn: "কম উদ্বেগ" },
    moderate: { en: "Moderate · watch intake", bn: "মাঝারি · পরিমিত গ্রহণ করুন" },
    high: { en: "High concern", bn: "উচ্চ উদ্বেগ" },
  }[ingredient.concern];

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader
        title={language === "en" ? "Ingredient" : "উপাদান"}
        back={() => router.back()}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === "en" ? "Search ingredients" : "উপাদান খুঁজুন"}
            onPress={() => router.push({ pathname: "/ingredient/[id]", params: { id: "search" } })}
            hitSlop={6}
            style={({ pressed }) => ({
              width: 34,
              height: 34,
              borderRadius: 12,
              backgroundColor: palette.card,
              borderWidth: 1,
              borderColor: palette.line,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.72 : 1,
            })}
          >
            <MaterialCommunityIcons name="magnify" size={18} color={palette.green} />
          </Pressable>
        }
      />

      <Card style={{ gap: 12 }}>
        <View style={{ gap: 4 }}>
          <AppText weight="bold" style={{ fontSize: 20 }}>
            {ingredient.name[language]}
          </AppText>
          <AppText style={{ color: palette.muted, fontSize: 13 }}>
            {ingredient.name[language === "en" ? "bn" : "en"]}
          </AppText>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Pill tone={purposeTone}>{ingredient.purpose[language]}</Pill>
          <Pill tone={ingredient.concern === "moderate" ? "amber" : ingredient.concern === "high" ? "clay" : "neutral"}>
            {concernLabel[language]}
          </Pill>
        </View>

        <AppText style={{ fontSize: 13, lineHeight: 20, color: palette.ink }}>
          {ingredient.details[language]}
        </AppText>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6, paddingTop: 4 }}>
          <MaterialCommunityIcons name="book-open-outline" size={14} color={palette.muted} />
          <AppText style={{ color: palette.muted, fontSize: 10 }}>
            {ingredient.source}
          </AppText>
        </View>
      </Card>

      {ingredient.allergen ? (
        <Card style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: palette.amberSoft }}>
          <MaterialCommunityIcons name="alert-outline" size={20} color={palette.amberInk} />
          <View style={{ flex: 1, gap: 3 }}>
            <AppText weight="semibold" style={{ fontSize: 13, color: palette.amberInk }}>
              {language === "en" ? "Allergen Notice" : "অ্যালার্জেন সতর্কতা"}
            </AppText>
            <AppText style={{ fontSize: 11, lineHeight: 16, color: palette.amberInk }}>
              {ingredient.allergenNote?.[language] ??
                (language === "en"
                  ? "May trigger allergic reactions in sensitive individuals."
                  : "সংবেদনশীল ব্যক্তিদের মধ্যে অ্যালার্জি সৃষ্টি করতে পারে।")}
            </AppText>
          </View>
        </Card>
      ) : null}

      <View style={{ gap: 8 }}>
        <SectionHeading
          title={
            language === "en"
              ? "Products containing this ingredient"
              : "এই উপাদানযুক্ত পণ্যসমূহ"
          }
        />
        {matchingProducts.length > 0 ? (
          <Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>
            {matchingProducts.map((product, idx) => (
              <View key={product.id}>
                {idx ? <View style={{ height: 1, backgroundColor: palette.line }} /> : null}
                <ProductRow
                  product={product}
                  onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } })}
                  aside={
                    product.score !== undefined ? (
                      <Pill tone={product.score >= 75 ? "green" : product.score >= 60 ? "amber" : "clay"}>
                        {product.score}/100
                      </Pill>
                    ) : undefined
                  }
                />
              </View>
            ))}
          </Card>
        ) : (
          <Card>
            <AppText style={{ color: palette.muted, fontSize: 12 }}>
              {language === "en"
                ? "No matching products found in the current preview catalog."
                : "বর্তমান প্রিভিউ ক্যাটালগে মিল থাকা কোনো পণ্য পাওয়া যায়নি।"}
            </AppText>
          </Card>
        )}
      </View>

      <SecondaryButton
        title={language === "en" ? "Browse all ingredients" : "সব উপাদান দেখুন"}
        icon="format-list-bulleted"
        onPress={() => router.push({ pathname: "/ingredient/[id]", params: { id: "search" } })}
      />

      <DemoNotice>
        {language === "en"
          ? "This is general information, not medical advice."
          : "এটি সাধারণ তথ্য, চিকিৎসা পরামর্শ নয়।"}
      </DemoNotice>
    </Screen>
  );
}
