import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  Card,
  DemoNotice,
  PageHeader,
  Screen,
  SecondaryButton,
  SectionHeading,
  usePalette,
} from "@/components/nutriscan-ui";
import { dailyTipForDate, dailyTips } from "@/lib/nutrifacts";
import type { Localized } from "@/lib/nutriscan-data";
import { t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

type TipItem = {
  id: string;
  title: Localized;
  body: Localized;
  source: string;
};

const GOAL_TIPS: Record<string, TipItem> = {
  "reduce-sugar": {
    id: "goal-reduce-sugar",
    title: { en: "Read added sugar & syrup names", bn: "যোগ করা চিনি ও সিরাপের নাম দেখুন" },
    body: {
      en: "Check the nutrition panel for added sugars and watch for sucrose, glucose syrup, or fruit juice concentrates near the top of the ingredient list.",
      bn: "পুষ্টি-লেবেলে যোগ করা চিনির পরিমাণ দেখুন এবং উপাদান তালিকার শুরুতে সুক্রোজ, গ্লুকোজ সিরাপ বা ফলের রসের কনসেনট্রেট আছে কি না খেয়াল করুন।",
    },
    source: "WHO · Sugars intake guideline",
  },
  "reduce-sodium": {
    id: "goal-reduce-sodium",
    title: { en: "Compare sodium in packaged snacks", bn: "প্যাকেটজাত স্ন্যাকসে সোডিয়াম তুলনা করুন" },
    body: {
      en: "Instant noodles, chips, and seasoning packets can contribute a large share of daily salt. Compare sodium per serving across brands.",
      bn: "ইনস্ট্যান্ট নুডলস, চিপস ও সিজনিং প্যাকেটে দৈনিক লবণের বড় অংশ থাকতে পারে। বিভিন্ন ব্র্যান্ডের প্রতি পরিবেশনের সোডিয়াম তুলনা করুন।",
    },
    source: "WHO · Healthy diet",
  },
  "increase-protein": {
    id: "goal-increase-protein",
    title: { en: "Everyday protein sources in Bangladesh", bn: "বাংলাদেশে সহজলভ্য প্রোটিনের উৎস" },
    body: {
      en: "Combine lentils (dal), eggs, fish, chickpeas, and yogurt with packaged staples to improve overall meal protein balance.",
      bn: "খাবারের প্রোটিন ভারসাম্য বাড়াতে ডাল, ডিম, মাছ, ছোলা ও দইয়ের মতো স্থানীয় উৎস নিয়মিত খাবারে যুক্ত করুন।",
    },
    source: "General nutrition guidance",
  },
  "improve-fiber": {
    id: "goal-improve-fiber",
    title: { en: "Choose higher-fiber everyday foods", bn: "বেশি আঁশযুক্ত খাবার বেছে নিন" },
    body: {
      en: "Whole grains, vegetables, fruits, and legumes provide dietary fiber that supports digestion and helps keep meals filling.",
      bn: "পূর্ণশস্য, শাকসবজি, ফল ও ডালে থাকা খাদ্য-আঁশ হজমে সাহায্য করে এবং খাবারকে তৃপ্তিদায়ক রাখে।",
    },
    source: "WHO · Healthy diet",
  },
};

export default function TipsScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { language, healthProfile, savedTips, toggleSavedTip } = useNutriScan();

  const dailyTip = dailyTipForDate();

  const goalMatchedTips: TipItem[] = healthProfile.nutritionGoals
    .map((goal) => GOAL_TIPS[goal])
    .filter((tip): tip is TipItem => Boolean(tip));

  const fallbackTips: TipItem[] = dailyTips.map((fact, idx) => ({
    id: `fact-${idx}`,
    title: fact.title,
    body: fact.body,
    source: fact.sourceTitle,
  }));

  const personalizedTips = goalMatchedTips.length > 0 ? goalMatchedTips : fallbackTips;

  const renderTipCard = (tip: TipItem, highlighted = false) => {
    const isSaved = savedTips.includes(tip.id);
    return (
      <Card
        key={tip.id}
        style={{
          gap: 10,
          backgroundColor: highlighted ? palette.greenSoft : palette.card,
          borderColor: highlighted ? palette.green : palette.line,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 10 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: highlighted ? palette.card : palette.amberSoft,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name="lightbulb-on-outline"
              size={20}
              color={highlighted ? palette.green : palette.amberInk}
            />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <AppText weight="bold" style={{ fontSize: 14 }}>
              {tip.title[language]}
            </AppText>
            <AppText style={{ color: palette.ink, fontSize: 12, lineHeight: 18 }}>
              {tip.body[language]}
            </AppText>
            <AppText style={{ color: palette.muted, fontSize: 10, marginTop: 2 }}>
              {tip.source}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={isSaved ? "Unsave tip" : "Save tip"}
            accessibilityState={{ selected: isSaved }}
            onPress={() => toggleSavedTip(tip.id)}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 36,
              height: 36,
              borderRadius: 12,
              backgroundColor: palette.card,
              borderWidth: 1,
              borderColor: palette.line,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.78 : 1,
            })}
          >
            <MaterialCommunityIcons
              name={isSaved ? "heart" : "heart-outline"}
              size={18}
              color={isSaved ? palette.clay : palette.muted}
            />
          </Pressable>
        </View>
      </Card>
    );
  };

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader
        title={t(language, "tipOfDay")}
        back={() => router.back()}
      />

      <DemoNotice>{t(language, "generalEducation")}</DemoNotice>

      <SectionHeading title={t(language, "dailyHealthTip")} />
      {renderTipCard(
        {
          id: `daily-${dailyTip.title.en}`,
          title: dailyTip.title,
          body: dailyTip.body,
          source: dailyTip.sourceTitle,
        },
        true,
      )}

      <SectionHeading
        title={language === "en" ? "Based on Your Goals" : "আপনার লক্ষ্যের ওপর ভিত্তি করে"}
      />
      <View style={{ gap: 10 }}>
        {personalizedTips.map((tip) => renderTipCard(tip))}
      </View>

      <SecondaryButton
        title={language === "en" ? "Ask Nouri for more" : "আরও জানতে নৌরিকে জিজ্ঞাসা করুন"}
        icon="robot-outline"
        onPress={() => router.push("/(tabs)/nouri")}
      />
    </Screen>
  );
}
