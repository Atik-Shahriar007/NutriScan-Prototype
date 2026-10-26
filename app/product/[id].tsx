import { useEffect, useState } from "react";
import { Image, Pressable, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, Pill, ProductRow, Screen, SectionHeading, SecondaryButton, usePalette } from "@/components/nutriscan-ui";
import { betterAlternatives, categoryLabel, isHalalEligible, productById, productBrand, productName, t } from "@/lib/nutriscan-data";
import type { NutritionItem } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

function NutritionRow({ item, expanded, onPress, language }: { item: NutritionItem; expanded: boolean; onPress: () => void; language: "en" | "bn" }) {
  const palette = usePalette();
  const toneColor = item.tone === "positive" ? palette.green : item.tone === "caution" ? palette.clay : palette.amber;
  return (
    <Pressable accessibilityRole="button" accessibilityState={{ expanded }} onPress={onPress} style={({ pressed }) => [{ paddingVertical: 13, borderTopWidth: 1, borderTopColor: palette.line, opacity: pressed ? 0.88 : 1 }]}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 11 }}>
        <MaterialCommunityIcons name={item.icon} size={20} color={palette.muted} />
        <View style={{ flex: 1, gap: 3 }}><AppText weight="semibold" style={{ fontSize: 13 }}>{item.label[language]}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{item.note[language]}</AppText></View>
        <AppText style={{ color: palette.muted, fontSize: 12 }}>{item.amount[language]}</AppText>
        <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: toneColor }} />
        <MaterialCommunityIcons name={expanded ? "chevron-up" : "chevron-down"} size={18} color={palette.muted} />
      </View>
      {expanded ? <View style={{ marginLeft: 31, marginTop: 9, padding: 11, borderRadius: 12, backgroundColor: palette.paper }}><AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 16 }}>{item.detail[language]}</AppText></View> : null}
    </Pressable>
  );
}

function ReactionButtons({ baseLikes, baseDislikes, reaction, onReact }: { baseLikes: number; baseDislikes: number; reaction?: "like" | "dislike"; onReact: (vote: "like" | "dislike") => void }) {
  const { language } = useNutriScan();
  const palette = usePalette();
  const likes = baseLikes + (reaction === "like" ? 1 : 0);
  const dislikes = baseDislikes + (reaction === "dislike" ? 1 : 0);
  const button = (vote: "like" | "dislike", count: number, icon: "thumb-up-outline" | "thumb-down-outline", label: string) => {
    const selected = reaction === vote;
    return <Pressable key={vote} accessibilityRole="button" accessibilityLabel={`${label} ${count}`} accessibilityState={{ selected }} onPress={() => onReact(vote)} style={{ minHeight: 38, flex: 1, borderRadius: 12, borderWidth: 1, borderColor: selected ? (vote === "like" ? palette.green : palette.clay) : palette.line, backgroundColor: selected ? (vote === "like" ? palette.greenSoft : palette.claySoft) : palette.card, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingHorizontal: 7 }}>
      <MaterialCommunityIcons name={icon} size={16} color={selected ? (vote === "like" ? palette.green : palette.clay) : palette.muted} />
      <AppText weight="semibold" style={{ color: selected ? (vote === "like" ? palette.green : palette.clay) : palette.ink, fontSize: 11 }}>{count.toLocaleString(language === "bn" ? "bn-BD" : "en-US")} {label}</AppText>
    </Pressable>;
  };
  return (
    <Card style={{ gap: 9, paddingVertical: 12, paddingHorizontal: 13 }}>
      <AppText weight="medium" style={{ color: palette.muted, fontSize: 10 }}>{t(language, "reactionPrompt")}</AppText>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {button("like", likes, "thumb-up-outline", t(language, "likes"))}
        {button("dislike", dislikes, "thumb-down-outline", t(language, "dislikes"))}
      </View>
      <AppText style={{ color: palette.muted, fontSize: 9, lineHeight: 14 }}>{t(language, "sampleReactions")}</AppText>
    </Card>
  );
}

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const palette = usePalette();
  const { language, halalMode, recordScan, favorites, toggleFavorite, productReactions, setProductReaction } = useNutriScan();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [showPreferencesNote, setShowPreferencesNote] = useState(false);
  const product = productById(typeof id === "string" ? id : undefined);

  useEffect(() => {
    if (product && (!halalMode || isHalalEligible(product))) recordScan(product.id);
  }, [halalMode, product, recordScan]);

  if (!product) return <Screen><PageHeader title={t(language, "productNotFound")} /><SecondaryButton title={language === "en" ? "Back" : "ফিরে যান"} onPress={() => router.back()} /></Screen>;
  if (halalMode && !isHalalEligible(product)) return <Screen contentStyle={{ gap: 16 }}><PageHeader title={t(language, "halalBlockedTitle")} subtitle={t(language, "halalModeActive")} back={() => router.back()} /><Card style={{ alignItems: "center", gap: 10, paddingVertical: 28, backgroundColor: palette.amberSoft }}><MaterialCommunityIcons name="shield-off-outline" size={36} color={palette.amberInk} /><AppText weight="semibold" style={{ fontSize: 16, textAlign: "center" }}>{t(language, "halalBlockedTitle")}</AppText><AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 17, textAlign: "center" }}>{t(language, "halalBlockedBody")}</AppText><SecondaryButton title={t(language, "turnOffHalalMode")} icon="shield-off-outline" onPress={() => router.push("/(tabs)/more")} /></Card></Screen>;

  const isFavorite = favorites.includes(product.id);
  const currentReaction = productReactions[product.id];
  const alternatives = betterAlternatives(product, halalMode);
  const scoreTone = product.score === undefined ? "neutral" : product.score >= 75 ? "green" : product.score >= 60 ? "amber" : "clay";
  const toggleExpanded = (key: string) => setExpandedRows((current) => current.includes(key) ? current.filter((item) => item !== key) : [...current, key]);
  const foodItems = product.nutrition?.items ?? [];
  const negative = foodItems.filter((item) => item.tone === "caution");
  const positive = foodItems.filter((item) => item.tone === "positive");
  const other = foodItems.filter((item) => item.tone === "neutral");

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader title={t(language, "productDetails")} subtitle={categoryLabel(product.category, language)} back={() => router.back()} right={
        <Pressable accessibilityRole="button" accessibilityLabel={isFavorite ? t(language, "removeFavorite") : t(language, "addFavorite")} accessibilityState={{ selected: isFavorite }} onPress={() => toggleFavorite(product.id)} style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, alignItems: "center", justifyContent: "center" }}>
          <MaterialCommunityIcons name={isFavorite ? "star" : "star-outline"} size={19} color={isFavorite ? palette.amber : palette.green} />
        </Pressable>
      } />

      <Card style={{ flexDirection: "row", alignItems: "center", padding: 13, gap: 14 }}>
        <View style={{ width: 116, height: 128, borderRadius: 17, backgroundColor: palette.photo, overflow: "hidden", alignItems: "center", justifyContent: "center" }}>
          <Image source={product.image} resizeMode="contain" style={{ width: 108, height: 120 }} />
        </View>
        <View style={{ flex: 1, gap: 7 }}>
          <AppText style={{ color: palette.muted, fontSize: 11 }}>{productBrand(product, language)}</AppText>
          <AppText weight="bold" style={{ fontSize: 18, lineHeight: 24 }}>{productName(product, language)}</AppText>
          <AppText style={{ color: palette.muted, fontSize: 11 }}>{product.size[language]}</AppText>
          <Pill tone="amber">{t(language, "sample")}</Pill>
        </View>
      </Card>
      {product.halalEvidence ? <Card style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: palette.greenSoft, borderColor: palette.line }}>
        <MaterialCommunityIcons name="shield-check-outline" size={21} color={palette.green} />
        <View style={{ flex: 1, gap: 4 }}><AppText weight="semibold" style={{ fontSize: 12 }}>{t(language, "halalEvidenceLabel")}</AppText><AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>{product.halalEvidence.label[language]}</AppText><AppText style={{ color: palette.green, fontSize: 9 }}>{product.halalEvidence.sourceTitle}</AppText></View>
      </Card> : null}

      {product.category === "food" && product.score !== undefined ? <Card style={{ flexDirection: "row", alignItems: "center", gap: 15, padding: 15 }}>
        <View style={{ width: 83, height: 83, borderRadius: 42, borderWidth: 7, borderColor: scoreTone === "green" ? palette.green : scoreTone === "amber" ? palette.amber : palette.clay, alignItems: "center", justifyContent: "center", backgroundColor: palette.card }}>
          <AppText weight="bold" style={{ fontSize: 27, lineHeight: 30 }}>{product.score}</AppText><AppText style={{ color: palette.muted, fontSize: 9 }}>/100</AppText>
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <AppText style={{ color: palette.muted, fontSize: 10 }}>{t(language, "grade")}</AppText>
          <AppText weight="bold" style={{ fontSize: 16 }}>{product.gradeLabel?.[language]}</AppText>
          <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>{t(language, "methodNote")}</AppText>
        </View>
      </Card> : <Card style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: palette.greenSoft, borderColor: palette.line }}>
        <View style={{ width: 43, height: 43, borderRadius: 15, backgroundColor: palette.card, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name={product.category === "personalCare" ? "bottle-tonic-outline" : "spray-bottle"} size={21} color={palette.green} /></View>
        <View style={{ flex: 1, gap: 4 }}><AppText weight="semibold" style={{ fontSize: 14 }}>{t(language, "noGrade")}</AppText><AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>{product.gradeLabel?.[language]}</AppText></View>
      </Card>}

      <ReactionButtons baseLikes={product.reactionCounts.likes} baseDislikes={product.reactionCounts.dislikes} reaction={currentReaction} onReact={(vote) => setProductReaction(product.id, vote)} />

      {product.category === "food" && product.nutrition ? <>
        <View style={{ gap: 5 }}>
          <SectionHeading title={t(language, "negativeFactors")} action={product.nutrition.serving[language]} />
          <Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>
            {negative.length ? negative.map((item) => <NutritionRow key={item.label.en} item={item} language={language} expanded={expandedRows.includes(item.label.en)} onPress={() => toggleExpanded(item.label.en)} />) : <AppText style={{ color: palette.muted, fontSize: 11, paddingVertical: 13 }}>{language === "en" ? "No caution factors in this record." : "এই রেকর্ডে সতর্কতার উপাদান নেই।"}</AppText>}
          </Card>
        </View>
        <View style={{ gap: 5 }}>
          <SectionHeading title={t(language, "positiveFactors")} action={t(language, "perServing")} />
          <Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>
            {positive.length ? positive.map((item) => <NutritionRow key={item.label.en} item={item} language={language} expanded={expandedRows.includes(item.label.en)} onPress={() => toggleExpanded(item.label.en)} />) : <AppText style={{ color: palette.muted, fontSize: 11, paddingVertical: 13 }}>{language === "en" ? "No positive factors in this record." : "এই রেকর্ডে ইতিবাচক উপাদান নেই।"}</AppText>}
          </Card>
        </View>
        {other.length ? <View style={{ gap: 5 }}>
          <SectionHeading title={t(language, "otherFactors")} />
          <Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>{other.map((item) => <NutritionRow key={item.label.en} item={item} language={language} expanded={expandedRows.includes(item.label.en)} onPress={() => toggleExpanded(item.label.en)} />)}</Card>
        </View> : null}
        <Card style={{ gap: 10 }}>
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: expandedRows.includes("score-method") }} onPress={() => toggleExpanded("score-method")} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <MaterialCommunityIcons name="chart-box-outline" size={19} color={palette.green} /><AppText weight="semibold" style={{ flex: 1, fontSize: 12 }}>{t(language, "scoreBreakdown")}</AppText><MaterialCommunityIcons name={expandedRows.includes("score-method") ? "chevron-up" : "chevron-down"} size={18} color={palette.muted} />
          </Pressable>
          {expandedRows.includes("score-method") ? <View style={{ gap: 10 }}>
            <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 16 }}>{t(language, "methodNote")}</AppText>
            {product.factors.map((factor) => <View key={factor.label.en} style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><AppText style={{ flex: 1, fontSize: 10 }}>{factor.label[language]}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{factor.value} · {factor.weight}</AppText></View>)}
          </View> : null}
        </Card>
      </> : <View style={{ gap: 7 }}>
        <SectionHeading title={t(language, "viewAssessment")} />
        <Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>{product.factors.map((factor, index) => <View key={factor.label.en} style={{ paddingVertical: 12, borderTopWidth: index ? 1 : 0, borderTopColor: palette.line, gap: 4 }}><AppText weight="semibold" style={{ fontSize: 12 }}>{factor.label[language]}</AppText><AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>{factor.note[language]}</AppText></View>)}</Card>
      </View>}

      <View style={{ gap: 7 }}>
        <SectionHeading title={t(language, "ingredients")} />
        <Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>
          {product.ingredients.map((ingredient, index) => <View key={`${ingredient.en}-${index}`} style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 12, borderTopWidth: index ? 1 : 0, borderTopColor: palette.line }}>
            <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: palette.amber, marginTop: 5 }} />
            <View style={{ flex: 1, gap: 4 }}><AppText weight="medium" style={{ fontSize: 12 }}>{ingredient[language]}</AppText>{product.ingredientExplanations?.[index] ? <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 16 }}>{product.ingredientExplanations[index][language]}</AppText> : null}</View>
          </View>)}
        </Card>
      </View>

      {alternatives.length ? <View style={{ gap: 7 }}>
        <SectionHeading title={t(language, "betterAlternatives")} />
        <DemoNotice>{t(language, "betterAlternativesNote")}</DemoNotice>
        <Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>
          {alternatives.map((alternative, index) => <View key={alternative.id}>
            {index ? <View style={{ height: 1, backgroundColor: palette.line }} /> : null}
            <ProductRow product={alternative} onPress={() => router.push({ pathname: "/product/[id]", params: { id: alternative.id } })} aside={<Pill tone="green">{alternative.score} / 100</Pill>} />
          </View>)}
        </Card>
      </View> : null}

      <Card style={{ gap: 0, paddingHorizontal: 13, paddingVertical: 2 }}>
        <Pressable accessibilityRole="button" accessibilityState={{ selected: isFavorite }} onPress={() => toggleFavorite(product.id)} style={{ minHeight: 48, flexDirection: "row", alignItems: "center", gap: 11 }}>
          <MaterialCommunityIcons name={isFavorite ? "star" : "star-outline"} size={20} color={isFavorite ? palette.amber : palette.green} /><AppText weight="medium" style={{ flex: 1, fontSize: 12 }}>{isFavorite ? t(language, "removeFavorite") : t(language, "addFavorite")}</AppText><MaterialCommunityIcons name="chevron-right" size={18} color={palette.muted} />
        </Pressable>
        {product.category === "food" ? <>
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <Pressable accessibilityRole="button" accessibilityState={{ expanded: showPreferencesNote }} onPress={() => setShowPreferencesNote((value) => !value)} style={{ minHeight: 48, flexDirection: "row", alignItems: "center", gap: 11 }}>
            <MaterialCommunityIcons name="tune-variant" size={20} color={palette.green} /><AppText weight="medium" style={{ flex: 1, fontSize: 12 }}>{t(language, "viewFoodPreferences")}</AppText><MaterialCommunityIcons name={showPreferencesNote ? "chevron-up" : "chevron-right"} size={18} color={palette.muted} />
          </Pressable>
          {showPreferencesNote ? <DemoNotice>{t(language, "foodPreferencesNote")}</DemoNotice> : null}
        </> : null}
      </Card>

      <View style={{ gap: 8 }}><SectionHeading title={t(language, "source")} /><Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>{product.evidence.map((item, index) => <View key={item.label.en} style={{ flexDirection: "row", alignItems: "flex-start", gap: 9, paddingVertical: 10, borderTopWidth: index ? 1 : 0, borderTopColor: palette.line }}><MaterialCommunityIcons name={item.status === "demo" ? "image-outline" : "help-circle-outline"} size={17} color={item.status === "demo" ? palette.green : palette.amberInk} /><View style={{ flex: 1, gap: 3 }}><AppText weight="semibold" style={{ fontSize: 11 }}>{item.label[language]}</AppText><AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>{item.value[language]}</AppText></View><Pill tone={item.status === "demo" ? "amber" : "neutral"}>{item.status === "demo" ? t(language, "sample") : t(language, "unknown")}</Pill></View>)}</Card></View>
      <DemoNotice>{t(language, "limitationText")}</DemoNotice>
    </Screen>
  );
}
