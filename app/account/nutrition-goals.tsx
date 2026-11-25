import { useState } from "react";
import { Pressable, View } from "react-native";
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
];

export default function NutritionGoalsScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { language, healthProfile, setHealthProfile } = useNutriScan();

  const [selected, setSelected] = useState<string[]>(healthProfile.nutritionGoals);
  const [saved, setSaved] = useState(false);

  const toggleGoal = (id: string) => {
    setSaved(false);
    setSelected((curr) =>
      curr.includes(id) ? curr.filter((item) => item !== id) : [...curr, id],
    );
  };

  const handleSave = () => {
    setHealthProfile({ nutritionGoals: selected });
    setSaved(true);
  };

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
        {GOAL_OPTIONS.map((goal) => {
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
