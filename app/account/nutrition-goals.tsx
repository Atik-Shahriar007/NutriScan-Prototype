import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  Card,
  DemoNotice,
  PageHeader,
  PrimaryButton,
  Screen,
  SectionHeading,
  fontFamily,
  usePalette,
} from "@/components/nutriscan-ui";
import type { Localized } from "@/lib/nutriscan-data";
import { t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

type GoalOption = {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: Localized;
  body: Localized;
};

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: "balanced-nutrition",
    icon: "scale-balance",
    title: { en: "Balanced Nutrition", bn: "সুষম পুষ্টি" },
    body: {
      en: "Eat a wide variety of foods for overall wellbeing",
      bn: "সার্বিক সুস্থতার জন্য বৈচিত্র্যময় খাবার গ্রহণ করুন",
    },
  },
  {
    id: "reduce-sugar",
    icon: "cube-off-outline",
    title: { en: "Reduce Added Sugar", bn: "যোগ করা চিনি কমানো" },
    body: {
      en: "Lower intake of added sugars in packaged foods",
      bn: "প্যাকেটজাত খাবারে যোগ করা চিনির পরিমাণ কমান",
    },
  },
  {
    id: "reduce-sodium",
    icon: "shaker-outline",
    title: { en: "Reduce Sodium", bn: "সোডিয়াম কমানো" },
    body: {
      en: "Cut back on salt and sodium-rich products",
      bn: "লবণ ও সোডিয়াম-সমৃদ্ধ পণ্য কম গ্রহণ করুন",
    },
  },
  {
    id: "increase-protein",
    icon: "fish",
    title: { en: "Increase Protein", bn: "প্রোটিন বাড়ানো" },
    body: {
      en: "Get more protein from food and snacks",
      bn: "খাবার ও স্ন্যাকস থেকে বেশি প্রোটিন পান",
    },
  },
  {
    id: "improve-fiber",
    icon: "leaf",
    title: { en: "More Dietary Fiber", bn: "বেশি খাদ্য-আঁশ" },
    body: {
      en: "Choose foods with higher fiber content",
      bn: "বেশি আঁশযুক্ত খাবার বেছে নিন",
    },
  },
  {
    id: "better-awareness",
    icon: "eye-outline",
    title: { en: "Better Label Awareness", bn: "লেবেল সম্পর্কে সচেতনতা" },
    body: {
      en: "Learn to read and understand food labels",
      bn: "খাবারের লেবেল পড়তে ও বুঝতে শিখুন",
    },
  },
  {
    id: "limit-saturated-fat",
    icon: "heart-pulse",
    title: { en: "Limit Unhealthy Fats", bn: "অস্বাস্থ্যকর চর্বি কমানো" },
    body: {
      en: "Watch saturated fat, palm oil, and fried snack fats on labels",
      bn: "লেবেলে স্যাচুরেটেড ফ্যাট, পাম তেল ও ভাজা স্ন্যাকসের চর্বি লক্ষ্য করুন",
    },
  },
  {
    id: "less-processed",
    icon: "food-apple-outline",
    title: { en: "Choose Less Processed Foods", bn: "কম প্রক্রিয়াজাত খাবার" },
    body: {
      en: "Prefer shorter ingredient lists with fewer artificial additives",
      bn: "কম কৃত্রিম উপাদান ও সংক্ষিপ্ত উপাদান-তালিকার খাবার বেছে নিন",
    },
  },
  {
    id: "portion-calories",
    icon: "silverware-fork-knife",
    title: { en: "Mindful Portions & Calories", bn: "পরিমিত অংশ ও ক্যালোরি" },
    body: {
      en: "Compare serving sizes and energy per pack before buying",
      bn: "কেনার আগে প্রতি প্যাকের পরিবেশনের পরিমাণ ও ক্যালোরি তুলনা করুন",
    },
  },
  {
    id: "smart-hydration",
    icon: "cup-water",
    title: { en: "Smarter Drink Choices", bn: "স্বাস্থ্যকর পানীয় নির্বাচন" },
    body: {
      en: "Pick lower-sugar drinks and stay mindful of sweetened beverages",
      bn: "কম চিনির পানীয় বেছে নিন এবং মিষ্টি পানীয়ের পরিমাণ খেয়াল রাখুন",
    },
  },
];

const PRESET_GOAL_IDS = new Set(GOAL_OPTIONS.map((g) => g.id));

export default function NutritionGoalsScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { language, healthProfile, setHealthProfile } = useNutriScan();

  const [selected, setSelected] = useState<string[]>(healthProfile.nutritionGoals);
  const [customGoals, setCustomGoals] = useState<string[]>(() =>
    healthProfile.nutritionGoals.filter((id) => !PRESET_GOAL_IDS.has(id)),
  );
  const [customDraft, setCustomDraft] = useState("");
  const [saved, setSaved] = useState(false);

  const toggleGoal = (id: string) => {
    setSaved(false);
    setSelected((curr) =>
      curr.includes(id) ? curr.filter((item) => item !== id) : [...curr, id],
    );
  };

  const handleAddCustomGoal = () => {
    const clean = customDraft.trim();
    if (!clean) return;
    const lower = clean.toLowerCase();

    const matchedPreset = GOAL_OPTIONS.find(
      (g) =>
        g.id.toLowerCase() === lower ||
        g.title.en.toLowerCase() === lower ||
        g.title.bn.toLowerCase() === lower,
    );
    if (matchedPreset) {
      if (!selected.includes(matchedPreset.id)) {
        setSelected((curr) => [...curr, matchedPreset.id]);
      }
      setSaved(false);
      setCustomDraft("");
      return;
    }

    const matchedCustom = customGoals.find((g) => g.toLowerCase() === lower);
    const goalValue = matchedCustom ?? clean;
    if (!matchedCustom) {
      setCustomGoals((curr) => [...curr, clean]);
    }
    if (!selected.includes(goalValue)) {
      setSelected((curr) => [...curr, goalValue]);
    }
    setSaved(false);
    setCustomDraft("");
  };

  const handleSave = () => {
    setHealthProfile({ nutritionGoals: selected });
    setSaved(true);
  };

  const allGoals: GoalOption[] = [
    ...GOAL_OPTIONS,
    ...customGoals.map((goal) => ({
      id: goal,
      icon: "star-circle-outline" as const,
      title: { en: goal, bn: goal },
      body: {
        en: "Custom nutrition goal added by you",
        bn: "আপনার যোগ করা নিজস্ব পুষ্টির লক্ষ্য",
      },
    })),
  ];

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader
        title={t(language, "nutritionGoals")}
        back={() => router.back()}
      />

      <DemoNotice>
        {language === "en"
          ? "Goals help tailor your tips and insights in this prototype."
          : "লক্ষ্যগুলো এই প্রোটোটাইপে আপনার টিপস ও তথ্য সাজাতে সাহায্য করে।"}
      </DemoNotice>

      <SectionHeading
        title={language === "en" ? "What are your nutrition priorities?" : "আপনার পুষ্টির অগ্রাধিকার কী?"}
      />

      <View style={{ gap: 10 }}>
        {allGoals.map((goal) => {
          const isSelected = selected.includes(goal.id);
          return (
            <Pressable
              key={goal.id}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => toggleGoal(goal.id)}
              style={({ pressed }) => ({
                flexDirection: "row",
                alignItems: "center",
                gap: 13,
                padding: 15,
                borderRadius: 18,
                borderWidth: 1.5,
                borderColor: isSelected ? palette.green : palette.line,
                backgroundColor: isSelected ? palette.greenSoft : palette.card,
                opacity: pressed ? 0.86 : 1,
              })}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: isSelected ? palette.card : palette.greenSoft,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MaterialCommunityIcons
                  name={goal.icon}
                  size={22}
                  color={palette.green}
                />
              </View>
              <View style={{ flex: 1, gap: 3 }}>
                <AppText weight="semibold" style={{ fontSize: 14 }}>
                  {goal.title[language]}
                </AppText>
                <AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 16 }}>
                  {goal.body[language]}
                </AppText>
              </View>
              <MaterialCommunityIcons
                name={isSelected ? "check-circle" : "circle-outline"}
                size={22}
                color={isSelected ? palette.green : palette.muted}
              />
            </Pressable>
          );
        })}
      </View>

      <Card style={{ gap: 10 }}>
        <AppText weight="semibold" style={{ fontSize: 13 }}>
          {language === "en" ? "Add a custom goal" : "নিজস্ব লক্ষ্য যোগ করুন"}
        </AppText>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TextInput
            value={customDraft}
            onChangeText={setCustomDraft}
            onSubmitEditing={handleAddCustomGoal}
            returnKeyType="done"
            placeholder={
              language === "en"
                ? "e.g. Eat more leafy greens..."
                : "যেমন: বেশি শাকসবজি খাওয়া..."
            }
            placeholderTextColor={palette.muted}
            style={{
              flex: 1,
              minHeight: 44,
              borderWidth: 1,
              borderColor: palette.line,
              backgroundColor: palette.paper,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              fontSize: 13,
              color: palette.ink,
              fontFamily: fontFamily(language, "regular"),
            }}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === "en" ? "Add custom goal" : "নিজস্ব লক্ষ্য যোগ করুন"}
            onPress={handleAddCustomGoal}
            disabled={!customDraft.trim()}
            style={({ pressed }) => ({
              minHeight: 44,
              paddingHorizontal: 14,
              borderRadius: 12,
              backgroundColor: customDraft.trim() ? palette.greenSoft : palette.neutralSoft,
              borderWidth: 1,
              borderColor: customDraft.trim() ? palette.green : palette.line,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            <MaterialCommunityIcons
              name="plus"
              size={18}
              color={customDraft.trim() ? palette.green : palette.muted}
            />
            <AppText
              weight="semibold"
              style={{
                fontSize: 12,
                color: customDraft.trim() ? palette.green : palette.muted,
              }}
            >
              {language === "en" ? "Add" : "যোগ"}
            </AppText>
          </Pressable>
        </View>
      </Card>

      <PrimaryButton
        title={language === "en" ? "Save Goals" : "লক্ষ্য সংরক্ষণ করুন"}
        icon="check"
        onPress={handleSave}
      />

      {saved ? (
        <Card style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: palette.greenSoft }}>
          <MaterialCommunityIcons name="check-circle" size={20} color={palette.green} />
          <AppText weight="semibold" style={{ color: palette.green, fontSize: 13 }}>
            {language === "en" ? "Nutrition goals saved." : "পুষ্টির লক্ষ্য সংরক্ষিত হয়েছে।"}
          </AppText>
        </Card>
      ) : null}
    </Screen>
  );
}
