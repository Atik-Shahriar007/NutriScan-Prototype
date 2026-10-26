import { Linking, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, Screen, SectionHeading, usePalette } from "@/components/nutriscan-ui";
import { t } from "@/lib/nutriscan-data";
import { dailyTipForDate, ingredientInsight, interestingFacts, mythFacts } from "@/lib/nutrifacts";
import type { SourcedFact } from "@/lib/nutrifacts";
import { useNutriScan } from "@/lib/nutriscan-state";

function SourceLink({ title, url }: { title: string; url: string }) {
  const palette = usePalette();
  const { language } = useNutriScan();
  return <Pressable accessibilityRole="link" onPress={() => { void Linking.openURL(url); }} style={{ minHeight: 30, flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" }}><MaterialCommunityIcons name="open-in-new" size={14} color={palette.green} /><AppText weight="semibold" style={{ color: palette.green, fontSize: 10 }}>{t(language, "readSource")}: {title}</AppText></Pressable>;
}

function FactCard({ item, icon }: { item: SourcedFact; icon: "white-balance-sunny" | "flask-outline" | "check-decagram-outline" | "lightbulb-outline" }) {
  const palette = usePalette();
  const { language } = useNutriScan();
  return <Card style={{ gap: 9 }}>
    <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: palette.greenSoft, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name={icon} size={18} color={palette.green} /></View><AppText weight="semibold" style={{ flex: 1, fontSize: 13 }}>{item.title[language]}</AppText></View>
    <AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 18 }}>{item.body[language]}</AppText>
    <SourceLink title={item.sourceTitle} url={item.sourceUrl} />
  </Card>;
}

export default function NutriFactsScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { language } = useNutriScan();
  const dailyTip = dailyTipForDate();
  return (
    <Screen contentStyle={{ gap: 15 }}>
      <PageHeader title={t(language, "openNutriFacts")} subtitle={t(language, "nutriFactsSubtitle")} back={() => router.back()} />
      <DemoNotice>{t(language, "generalEducation")}</DemoNotice>
      <View style={{ gap: 7 }}><SectionHeading title={t(language, "dailyHealthTip")} /><FactCard item={dailyTip} icon="white-balance-sunny" /></View>
      <View style={{ gap: 7 }}><SectionHeading title={t(language, "ingredientInsight")} /><FactCard item={ingredientInsight} icon="flask-outline" /></View>
      <View style={{ gap: 7 }}><SectionHeading title={t(language, "mythVsFact")} />{mythFacts.map((item) => <FactCard key={item.title.en} item={item} icon="check-decagram-outline" />)}</View>
      <View style={{ gap: 7 }}><SectionHeading title={t(language, "interestingFact")} />{interestingFacts.map((item) => <FactCard key={item.title.en} item={item} icon="lightbulb-outline" />)}</View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 8, padding: 12, borderRadius: 14, backgroundColor: palette.neutralSoft }}><MaterialCommunityIcons name="calendar-today" size={15} color={palette.muted} /><AppText style={{ color: palette.muted, fontSize: 10 }}>{new Date().toLocaleDateString(language === "bn" ? "bn-BD" : "en-BD", { dateStyle: "long" })}</AppText></View>
    </Screen>
  );
}
