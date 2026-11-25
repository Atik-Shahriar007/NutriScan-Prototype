import { useEffect, useState } from "react";
import { Image, Pressable, View } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  Card,
  DemoNotice,
  PageHeader,
  Pill,
  ProductRow,
  ScoreRing,
  Screen,
  SectionHeading,
  SecondaryButton,
  TabSwitcher,
  usePalette,
} from "@/components/nutriscan-ui";
import {
  betterAlternatives,
  categoryLabel,
  isHalalEligible,
  productById,
  productBrand,
  productName,
  t,
} from "@/lib/nutriscan-data";
import type { NutritionItem } from "@/lib/nutriscan-data";
import {
  formatTeaspoonCount,
  isAllergenIngredient,
  isPositiveIngredient,
  parseAddedSugarTeaspoons,
  scoreCategoryLabel,
} from "@/lib/nutrition-utils";
import { useNutriScan } from "@/lib/nutriscan-state";

function NutritionRow({
  item,
  expanded,
  onPress,
  language,
}: {
  item: NutritionItem;
  expanded: boolean;
  onPress: () => void;
  language: "en" | "bn";
}) {
  const palette = usePalette();
  const toneColor =
    item.tone === "positive"
      ? palette.green
      : item.tone === "caution"
        ? palette.clay
        : palette.amber;
  const teaspoons = parseAddedSugarTeaspoons(item);
  const tspText = teaspoons !== null ? formatTeaspoonCount(teaspoons, language) : null;
  const tspLabel =
    teaspoons !== null && tspText !== null
      ? language === "en"
        ? `${tspText} ${teaspoons === 1 ? "teaspoon" : "teaspoons"} sugar`
        : `${tspText} চা-চামচ চিনি`
      : null;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={
        tspLabel
          ? `${item.label[language]}, ${item.amount[language]}, ${tspLabel}`
          : `${item.label[language]}, ${item.amount[language]}`
      }
      accessibilityHint={
        language === "en"
          ? "Double tap to show explanation"
          : "ব্যাখ্যা দেখতে দুবার ট্যাপ করুন"
      }
      accessibilityState={{ expanded }}
      onPress={onPress}
      hitSlop={4}
      style={({ pressed }) => [
        {
          paddingVertical: 13,
          borderTopWidth: 1,
          borderTopColor: palette.line,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 11 }}>
        <MaterialCommunityIcons name={item.icon} size={20} color={palette.muted} />
        <View style={{ flex: 1, minWidth: 100, gap: 3 }}>
          <AppText weight="semibold" style={{ fontSize: 13 }}>
            {item.label[language]}
          </AppText>
          <AppText style={{ color: palette.muted, fontSize: 10 }}>
            {item.note[language]}
          </AppText>
        </View>
        <View style={{ alignItems: "flex-end", gap: 4 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <AppText weight="semibold" style={{ color: palette.ink, fontSize: 12 }}>
              {item.amount[language]}
            </AppText>
            {tspLabel ? (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  paddingHorizontal: 7,
                  paddingVertical: 3,
                  borderRadius: 100,
                  backgroundColor:
                    item.tone === "positive"
                      ? palette.greenSoft
                      : item.tone === "caution"
                        ? palette.claySoft
                        : palette.amberSoft,
                }}
              >
                <MaterialCommunityIcons name="spoon-sugar" size={13} color={toneColor} />
                <AppText weight="semibold" style={{ fontSize: 10, color: toneColor }}>
                  {tspLabel}
                </AppText>
              </View>
            ) : null}
          </View>
        </View>
        <View
          style={{
            width: 10,
            height: 10,
            borderRadius: 5,
            backgroundColor: toneColor,
          }}
        />
        <MaterialCommunityIcons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={18}
          color={palette.muted}
        />
      </View>
      {expanded ? (
        <View
          style={{
            marginLeft: 31,
            marginTop: 9,
            padding: 11,
            borderRadius: 12,
            backgroundColor: palette.paper,
            gap: 4,
          }}
        >
          <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 16 }}>
            {item.detail[language]}
          </AppText>
          {tspLabel ? (
            <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>
              {language === "en"
                ? "Sugar guide: 4 g sugar = 1 teaspoon"
                : "হিসাব: ৪ গ্রাম চিনি = ১ চা-চামচ"}
            </AppText>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

function ReactionButtons({
  baseLikes,
  baseDislikes,
  reaction,
  onReact,
}: {
  baseLikes: number;
  baseDislikes: number;
  reaction?: "like" | "dislike";
  onReact: (vote: "like" | "dislike") => void;
}) {
  const { language } = useNutriScan();
  const palette = usePalette();
  const likes = baseLikes + (reaction === "like" ? 1 : 0);
  const dislikes = baseDislikes + (reaction === "dislike" ? 1 : 0);
  const button = (
    vote: "like" | "dislike",
    count: number,
    icon: "thumb-up-outline" | "thumb-down-outline",
    label: string,
  ) => {
    const selected = reaction === vote;
    return (
      <Pressable
        key={vote}
        accessibilityRole="button"
        accessibilityLabel={`${label} ${count}`}
        accessibilityState={{ selected }}
        onPress={() => onReact(vote)}
        style={({ pressed }) => ({
          minHeight: 44,
          flex: 1,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: selected
            ? vote === "like"
              ? palette.green
              : palette.clay
            : palette.line,
          backgroundColor: selected
            ? vote === "like"
              ? palette.greenSoft
              : palette.claySoft
            : palette.card,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          paddingHorizontal: 7,
          opacity: pressed ? 0.78 : 1,
        })}
      >
        <MaterialCommunityIcons
          name={icon}
          size={16}
          color={
            selected
              ? vote === "like"
                ? palette.green
                : palette.clay
              : palette.muted
          }
        />
        <AppText
          weight="semibold"
          style={{
            color: selected
              ? vote === "like"
                ? palette.green
                : palette.clay
              : palette.ink,
            fontSize: 11,
          }}
        >
          {count.toLocaleString(language === "bn" ? "bn-BD" : "en-US")} {label}
        </AppText>
      </Pressable>
    );
  };
  return (
    <Card style={{ gap: 9, paddingVertical: 12, paddingHorizontal: 13 }}>
      <AppText weight="medium" style={{ color: palette.muted, fontSize: 10 }}>
        {t(language, "reactionPrompt")}
      </AppText>
      <View style={{ flexDirection: "row", gap: 8 }}>
        {button("like", likes, "thumb-up-outline", t(language, "likes"))}
        {button("dislike", dislikes, "thumb-down-outline", t(language, "dislikes"))}
      </View>
      <AppText style={{ color: palette.muted, fontSize: 9, lineHeight: 14 }}>
        {t(language, "sampleReactions")}
      </AppText>
    </Card>
  );
}

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const palette = usePalette();
  const {
    language,
    halalMode,
    recordScan,
    favorites,
    toggleFavorite,
    productReactions,
    setProductReaction,
    compareIds,
    addToCompare,
  } = useNutriScan();
  const [expandedRows, setExpandedRows] = useState<string[]>([]);
  const [expandedIngredients, setExpandedIngredients] = useState<number[]>([]);
  const [showPreferencesNote, setShowPreferencesNote] = useState(false);
  const [nutritionTab, setNutritionTab] = useState<"serving" | "100g">("serving");
  const product = productById(typeof id === "string" ? id : undefined);

  useEffect(() => {
    if (product && (!halalMode || isHalalEligible(product))) recordScan(product.id);
  }, [halalMode, product, recordScan]);

  if (!product) {
    return (
      <Screen>
        <PageHeader title={t(language, "productNotFound")} />
        <SecondaryButton
          title={language === "en" ? "Back" : "ফিরে যান"}
          onPress={() => router.back()}
        />
      </Screen>
    );
  }
  if (halalMode && !isHalalEligible(product)) {
    return (
      <Screen contentStyle={{ gap: 16 }}>
        <PageHeader
          title={t(language, "halalBlockedTitle")}
          subtitle={t(language, "halalModeActive")}
          back={() => router.back()}
        />
        <Card
          style={{
            alignItems: "center",
            gap: 10,
            paddingVertical: 28,
            backgroundColor: palette.amberSoft,
          }}
        >
          <MaterialCommunityIcons
            name="shield-off-outline"
            size={36}
            color={palette.amberInk}
          />
          <AppText weight="semibold" style={{ fontSize: 16, textAlign: "center" }}>
            {t(language, "halalBlockedTitle")}
          </AppText>
          <AppText
            style={{
              color: palette.muted,
              fontSize: 11,
              lineHeight: 17,
              textAlign: "center",
            }}
          >
            {t(language, "halalBlockedBody")}
          </AppText>
          <SecondaryButton
            title={t(language, "turnOffHalalMode")}
            icon="shield-off-outline"
            onPress={() => router.push("/(tabs)/more")}
          />
        </Card>
      </Screen>
    );
  }

  const isFavorite = favorites.includes(product.id);
  const inCompare = compareIds.includes(product.id);
  const currentReaction = productReactions[product.id];
  const alternatives = betterAlternatives(product, halalMode);
  const toggleExpanded = (key: string) =>
    setExpandedRows((current) =>
      current.includes(key) ? current.filter((item) => item !== key) : [...current, key],
    );
  const toggleIngredient = (index: number) =>
    setExpandedIngredients((current) =>
      current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
    );

  const foodItems = product.nutrition?.items ?? [];
  const negative = foodItems.filter((item) => item.tone === "caution");
  const positive = foodItems.filter((item) => item.tone === "positive");
  const other = foodItems.filter((item) => item.tone === "neutral");

  const tableHeader = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: palette.neutralSoft,
        paddingHorizontal: 13,
        paddingVertical: 8,
      }}
    >
      <AppText weight="semibold" style={{ fontSize: 10, color: palette.muted }}>
        {language === "en" ? "NUTRIENT" : "পুষ্টি উপাদান"}
      </AppText>
      <AppText weight="semibold" style={{ fontSize: 10, color: palette.muted }}>
        {nutritionTab === "100g"
          ? language === "en"
            ? "PER 100G (PREVIEW)"
            : "প্রতি ১০০ গ্রাম (প্রিভিউ)"
          : language === "en"
            ? "PER SERVING"
            : "প্রতি পরিবেশন"}
      </AppText>
    </View>
  );

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader
        title={t(language, "productDetails")}
        subtitle={categoryLabel(product.category, language)}
        back={() => router.back()}
        right={
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              isFavorite ? t(language, "removeFavorite") : t(language, "addFavorite")
            }
            accessibilityState={{ selected: isFavorite }}
            onPress={() => toggleFavorite(product.id)}
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
            <MaterialCommunityIcons
              name={isFavorite ? "star" : "star-outline"}
              size={19}
              color={isFavorite ? palette.amber : palette.green}
            />
          </Pressable>
        }
      />

      <Card style={{ flexDirection: "row", alignItems: "center", padding: 13, gap: 14 }}>
        <View
          style={{
            width: 128,
            height: 144,
            borderRadius: 17,
            backgroundColor: palette.photo,
            overflow: "hidden",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Image
            source={product.image}
            resizeMode="contain"
            style={{ width: 118, height: 134 }}
          />
        </View>
        <View style={{ flex: 1, gap: 6 }}>
          <AppText style={{ color: palette.muted, fontSize: 11 }}>
            {productBrand(product, language)}
          </AppText>
          <AppText weight="bold" style={{ fontSize: 18, lineHeight: 24 }}>
            {productName(product, language)}
          </AppText>
          <AppText style={{ color: palette.muted, fontSize: 11 }}>
            {product.size[language]}
          </AppText>
          {product.description ? (
            <AppText numberOfLines={2} style={{ color: palette.muted, fontSize: 10, lineHeight: 14 }}>
              {product.description[language]}
            </AppText>
          ) : null}
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <MaterialCommunityIcons name="barcode-scan" size={13} color={palette.muted} />
            <AppText style={{ color: palette.muted, fontSize: 10 }}>{product.barcode}</AppText>
          </View>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6 }}>
            <Pill tone="green">{categoryLabel(product.category, language)}</Pill>
            <Pill tone="amber">{t(language, "sample")}</Pill>
          </View>
        </View>
      </Card>

      {product.category === "food" ? (
        <SecondaryButton
          title={
            inCompare
              ? language === "en"
                ? `In Compare (${compareIds.length}/2) · Open`
                : `তুলনায় যুক্ত (${compareIds.length}/২) · দেখুন`
              : compareIds.length === 1
                ? language === "en"
                  ? "Add to Compare (1 selected)"
                  : "তুলনায় যোগ করুন (১টি নির্বাচিত)"
                : t(language, "addToCompare")
          }
          icon="compare-horizontal"
          onPress={() => {
            addToCompare(product.id);
            router.push("/compare");
          }}
        />
      ) : null}

      {product.halalEvidence ? (
        <Card
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            gap: 10,
            backgroundColor: palette.greenSoft,
            borderColor: palette.line,
          }}
        >
          <MaterialCommunityIcons
            name="shield-check-outline"
            size={21}
            color={palette.green}
          />
          <View style={{ flex: 1, gap: 4 }}>
            <AppText weight="semibold" style={{ fontSize: 12 }}>
              {t(language, "halalEvidenceLabel")}
            </AppText>
            <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>
              {product.halalEvidence.label[language]}
            </AppText>
            <AppText style={{ color: palette.green, fontSize: 9 }}>
              {product.halalEvidence.sourceTitle}
            </AppText>
          </View>
        </Card>
      ) : null}

      {product.category === "food" && product.score !== undefined ? (
        <Card style={{ gap: 14, padding: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
            <ScoreRing score={product.score} size={88} />
            <View style={{ flex: 1, gap: 4 }}>
              <AppText style={{ color: palette.muted, fontSize: 11 }}>
                {language === "en" ? "NQSS Score" : "NQSS স্কোর"}
              </AppText>
              <AppText weight="bold" style={{ fontSize: 18 }}>
                {scoreCategoryLabel(product.score, language)}
              </AppText>
              <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>
                {t(language, "methodNote")}
              </AppText>
            </View>
          </View>

          <View style={{ gap: 10, paddingTop: 4, borderTopWidth: 1, borderTopColor: palette.line }}>
            {product.factors.map((factor) => {
              const val = factor.value ?? 0;
              const barColor =
                val >= 75 ? palette.green : val >= 55 ? palette.amber : palette.clay;
              return (
                <View key={factor.label.en} style={{ gap: 5 }}>
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <AppText weight="medium" style={{ fontSize: 11 }}>
                      {factor.label[language]}{" "}
                      {factor.weight ? (
                        <AppText style={{ color: palette.muted, fontSize: 10 }}>
                          ({factor.weight})
                        </AppText>
                      ) : null}
                    </AppText>
                    <AppText weight="semibold" style={{ fontSize: 11, color: barColor }}>
                      {factor.value ?? "—"}
                    </AppText>
                  </View>
                  <View
                    style={{
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: palette.neutralSoft,
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        height: "100%",
                        width: `${Math.max(4, Math.min(100, val))}%`,
                        borderRadius: 4,
                        backgroundColor: barColor,
                      }}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(language, "scoreBreakdown")}
            accessibilityState={{ expanded: expandedRows.includes("score-method") }}
            onPress={() => toggleExpanded("score-method")}
            hitSlop={4}
            style={({ pressed }) => ({
              minHeight: 40,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              borderTopWidth: 1,
              borderTopColor: palette.line,
              paddingTop: 8,
              opacity: pressed ? 0.76 : 1,
            })}
          >
            <MaterialCommunityIcons
              name="chart-box-outline"
              size={18}
              color={palette.green}
            />
            <AppText weight="semibold" style={{ flex: 1, fontSize: 12 }}>
              {language === "en" ? "How is this calculated?" : "এটি কীভাবে হিসাব করা হয়েছে?"}
            </AppText>
            <MaterialCommunityIcons
              name={expandedRows.includes("score-method") ? "chevron-up" : "chevron-down"}
              size={18}
              color={palette.muted}
            />
          </Pressable>
          {expandedRows.includes("score-method") ? (
            <View style={{ gap: 8, padding: 11, borderRadius: 12, backgroundColor: palette.paper }}>
              <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 16 }}>
                {t(language, "methodNote")}
              </AppText>
              {product.factors.map((factor) => (
                <View key={factor.label.en} style={{ gap: 2 }}>
                  <AppText weight="semibold" style={{ fontSize: 11 }}>
                    {factor.label[language]} · {factor.weight}
                  </AppText>
                  <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 14 }}>
                    {factor.note[language]}
                  </AppText>
                </View>
              ))}
            </View>
          ) : null}
        </Card>
      ) : (
        <Card
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            backgroundColor: palette.greenSoft,
            borderColor: palette.line,
          }}
        >
          <View
            style={{
              width: 43,
              height: 43,
              borderRadius: 15,
              backgroundColor: palette.card,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <MaterialCommunityIcons
              name={product.category === "personalCare" ? "bottle-tonic-outline" : "spray-bottle"}
              size={21}
              color={palette.green}
            />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <AppText weight="semibold" style={{ fontSize: 14 }}>
              {t(language, "noGrade")}
            </AppText>
            <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>
              {product.gradeLabel?.[language]}
            </AppText>
          </View>
        </Card>
      )}

      <ReactionButtons
        baseLikes={product.reactionCounts.likes}
        baseDislikes={product.reactionCounts.dislikes}
        reaction={currentReaction}
        onReact={(vote) => setProductReaction(product.id, vote)}
      />

      {product.category === "food" && product.nutrition ? (
        <>
          <View style={{ gap: 10 }}>
            <TabSwitcher
              tabs={[
                { key: "serving", label: language === "en" ? "Per Serving" : "প্রতি পরিবেশন" },
                { key: "100g", label: language === "en" ? "Per 100g" : "প্রতি ১০০ গ্রাম" },
              ]}
              activeKey={nutritionTab}
              onSelect={(k) => setNutritionTab(k as "serving" | "100g")}
            />
            {nutritionTab === "100g" ? (
              <DemoNotice>
                {language === "en"
                  ? "Per-100g data not available for this preview; showing per-serving values."
                  : "এই প্রিভিউর জন্য প্রতি ১০০ গ্রামের তথ্য নেই; প্রতি পরিবেশনের মান দেখানো হচ্ছে।"}
              </DemoNotice>
            ) : null}
          </View>

          <View style={{ gap: 5 }}>
            <SectionHeading
              title={t(language, "negativeFactors")}
              action={product.nutrition.serving[language]}
            />
            <Card style={{ paddingHorizontal: 0, paddingVertical: 0, gap: 0, overflow: "hidden" }}>
              {tableHeader}
              <View style={{ paddingHorizontal: 13 }}>
                {negative.length ? (
                  negative.map((item) => (
                    <NutritionRow
                      key={item.label.en}
                      item={item}
                      language={language}
                      expanded={expandedRows.includes(item.label.en)}
                      onPress={() => toggleExpanded(item.label.en)}
                    />
                  ))
                ) : (
                  <AppText style={{ color: palette.muted, fontSize: 11, paddingVertical: 13 }}>
                    {language === "en"
                      ? "No caution factors in this record."
                      : "এই রেকর্ডে সতর্কতার উপাদান নেই।"}
                  </AppText>
                )}
              </View>
            </Card>
          </View>

          <View style={{ gap: 5 }}>
            <SectionHeading
              title={t(language, "positiveFactors")}
              action={t(language, "perServing")}
            />
            <Card style={{ paddingHorizontal: 0, paddingVertical: 0, gap: 0, overflow: "hidden" }}>
              {tableHeader}
              <View style={{ paddingHorizontal: 13 }}>
                {positive.length ? (
                  positive.map((item) => (
                    <NutritionRow
                      key={item.label.en}
                      item={item}
                      language={language}
                      expanded={expandedRows.includes(item.label.en)}
                      onPress={() => toggleExpanded(item.label.en)}
                    />
                  ))
                ) : (
                  <AppText style={{ color: palette.muted, fontSize: 11, paddingVertical: 13 }}>
                    {language === "en"
                      ? "No positive factors in this record."
                      : "এই রেকর্ডে ইতিবাচক উপাদান নেই।"}
                  </AppText>
                )}
              </View>
            </Card>
          </View>

          {other.length ? (
            <View style={{ gap: 5 }}>
              <SectionHeading title={t(language, "otherFactors")} />
              <Card style={{ paddingHorizontal: 0, paddingVertical: 0, gap: 0, overflow: "hidden" }}>
                {tableHeader}
                <View style={{ paddingHorizontal: 13 }}>
                  {other.map((item) => (
                    <NutritionRow
                      key={item.label.en}
                      item={item}
                      language={language}
                      expanded={expandedRows.includes(item.label.en)}
                      onPress={() => toggleExpanded(item.label.en)}
                    />
                  ))}
                </View>
              </Card>
            </View>
          ) : null}
        </>
      ) : (
        <View style={{ gap: 7 }}>
          <SectionHeading title={t(language, "viewAssessment")} />
          <Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>
            {product.factors.map((factor, index) => (
              <View
                key={factor.label.en}
                style={{
                  paddingVertical: 12,
                  borderTopWidth: index ? 1 : 0,
                  borderTopColor: palette.line,
                  gap: 4,
                }}
              >
                <AppText weight="semibold" style={{ fontSize: 12 }}>
                  {factor.label[language]}
                </AppText>
                <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>
                  {factor.note[language]}
                </AppText>
              </View>
            ))}
          </Card>
        </View>
      )}

      <View style={{ gap: 7 }}>
        <SectionHeading title={t(language, "ingredients")} />
        <Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>
          {product.ingredients.map((ingredient, index) => {
            const expanded = expandedIngredients.includes(index);
            const allergen = isAllergenIngredient(ingredient.en, ingredient.bn);
            const positiveDot = isPositiveIngredient(ingredient.en, ingredient.bn);
            const explanation = product.ingredientExplanations?.[index]?.[language];

            return (
              <Pressable
                key={`${ingredient.en}-${index}`}
                accessibilityRole="button"
                accessibilityState={{ expanded }}
                onPress={() => toggleIngredient(index)}
                style={({ pressed }) => ({
                  paddingVertical: 12,
                  borderTopWidth: index ? 1 : 0,
                  borderTopColor: palette.line,
                  gap: 8,
                  opacity: pressed ? 0.85 : 1,
                })}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: positiveDot ? palette.green : palette.amber,
                    }}
                  />
                  <AppText weight="medium" style={{ flex: 1, fontSize: 12 }}>
                    {ingredient[language]}
                  </AppText>
                  {allergen ? (
                    <Pill tone="amber">{language === "en" ? "Allergen" : "অ্যালার্জেন"}</Pill>
                  ) : null}
                  <MaterialCommunityIcons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={palette.muted}
                  />
                </View>

                {expanded ? (
                  <View
                    style={{
                      marginLeft: 18,
                      padding: 10,
                      borderRadius: 12,
                      backgroundColor: palette.paper,
                      gap: 4,
                    }}
                  >
                    <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 16 }}>
                      {explanation ??
                        (language === "en"
                          ? "Check the current package label for exact sourcing and formulation details."
                          : "উৎস ও ফর্মুলা সম্পর্কে সঠিক তথ্যের জন্য বর্তমান প্যাকেটের লেবেল দেখুন।")}
                    </AppText>
                    {allergen ? (
                      <AppText style={{ color: palette.amberInk, fontSize: 10, lineHeight: 15 }}>
                        {language === "en"
                          ? "May be an allergen for sensitive individuals — verify the exact pack."
                          : "সংবেদনশীল ব্যক্তিদের জন্য এটি অ্যালার্জেন হতে পারে — প্যাকেট যাচাই করুন।"}
                      </AppText>
                    ) : null}
                  </View>
                ) : null}
              </Pressable>
            );
          })}
        </Card>
      </View>

      {alternatives.length ? (
        <View style={{ gap: 7 }}>
          <SectionHeading title={t(language, "betterAlternatives")} />
          <DemoNotice>{t(language, "betterAlternativesNote")}</DemoNotice>
          <Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>
            {alternatives.map((alternative, index) => (
              <View key={alternative.id}>
                {index ? <View style={{ height: 1, backgroundColor: palette.line }} /> : null}
                <ProductRow
                  product={alternative}
                  onPress={() =>
                    router.push({ pathname: "/product/[id]", params: { id: alternative.id } })
                  }
                  aside={<Pill tone="green">{alternative.score} / 100</Pill>}
                />
              </View>
            ))}
          </Card>
        </View>
      ) : null}

      <Card style={{ gap: 0, paddingHorizontal: 13, paddingVertical: 2 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite ? t(language, "removeFavorite") : t(language, "addFavorite")
          }
          accessibilityState={{ selected: isFavorite }}
          onPress={() => toggleFavorite(product.id)}
          style={({ pressed }) => ({
            minHeight: 48,
            flexDirection: "row",
            alignItems: "center",
            gap: 11,
            opacity: pressed ? 0.76 : 1,
          })}
        >
          <MaterialCommunityIcons
            name={isFavorite ? "star" : "star-outline"}
            size={20}
            color={isFavorite ? palette.amber : palette.green}
          />
          <AppText weight="medium" style={{ flex: 1, fontSize: 12 }}>
            {isFavorite ? t(language, "removeFavorite") : t(language, "addFavorite")}
          </AppText>
          <MaterialCommunityIcons name="chevron-right" size={18} color={palette.muted} />
        </Pressable>

        {product.category === "food" ? (
          <>
            <View style={{ height: 1, backgroundColor: palette.line }} />
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t(language, "viewFoodPreferences")}
              accessibilityState={{ expanded: showPreferencesNote }}
              onPress={() => setShowPreferencesNote((value) => !value)}
              style={({ pressed }) => ({
                minHeight: 48,
                flexDirection: "row",
                alignItems: "center",
                gap: 11,
                opacity: pressed ? 0.76 : 1,
              })}
            >
              <MaterialCommunityIcons name="tune-variant" size={20} color={palette.green} />
              <AppText weight="medium" style={{ flex: 1, fontSize: 12 }}>
                {t(language, "viewFoodPreferences")}
              </AppText>
              <MaterialCommunityIcons
                name={showPreferencesNote ? "chevron-up" : "chevron-right"}
                size={18}
                color={palette.muted}
              />
            </Pressable>
            {showPreferencesNote ? (
              <DemoNotice>{t(language, "foodPreferencesNote")}</DemoNotice>
            ) : null}
          </>
        ) : null}
      </Card>

      <Card style={{ gap: 0, paddingHorizontal: 13, paddingVertical: 2 }}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push("/(tabs)/nouri")}
          style={({ pressed }) => ({
            minHeight: 48,
            flexDirection: "row",
            alignItems: "center",
            gap: 11,
            opacity: pressed ? 0.76 : 1,
          })}
        >
          <MaterialCommunityIcons name="robot-outline" size={20} color={palette.green} />
          <AppText weight="medium" style={{ flex: 1, fontSize: 12 }}>
            {language === "en"
              ? "Ask Nouri about this product"
              : "এই পণ্য সম্পর্কে নৌরিকে জিজ্ঞাসা করুন"}
          </AppText>
          <MaterialCommunityIcons name="chevron-right" size={18} color={palette.muted} />
        </Pressable>

        {alternatives.length ? (
          <>
            <View style={{ height: 1, backgroundColor: palette.line }} />
            <Pressable
              accessibilityRole="button"
              onPress={() => router.push("/(tabs)/discover")}
              style={({ pressed }) => ({
                minHeight: 48,
                flexDirection: "row",
                alignItems: "center",
                gap: 11,
                opacity: pressed ? 0.76 : 1,
              })}
            >
              <MaterialCommunityIcons
                name="arrow-up-circle-outline"
                size={20}
                color={palette.green}
              />
              <AppText weight="medium" style={{ flex: 1, fontSize: 12 }}>
                {language === "en"
                  ? "Find Better Alternatives"
                  : "আরও ভালো বিকল্প খুঁজুন"}
              </AppText>
              <MaterialCommunityIcons name="chevron-right" size={18} color={palette.muted} />
            </Pressable>
          </>
        ) : null}
      </Card>

      <View style={{ gap: 8 }}>
        <SectionHeading title={t(language, "source")} />
        <Card style={{ paddingHorizontal: 13, paddingVertical: 1, gap: 0 }}>
          {product.evidence.map((item, index) => (
            <View
              key={item.label.en}
              style={{
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 9,
                paddingVertical: 10,
                borderTopWidth: index ? 1 : 0,
                borderTopColor: palette.line,
              }}
            >
              <MaterialCommunityIcons
                name={item.status === "demo" ? "image-outline" : "help-circle-outline"}
                size={17}
                color={item.status === "demo" ? palette.green : palette.amberInk}
              />
              <View style={{ flex: 1, gap: 3 }}>
                <AppText weight="semibold" style={{ fontSize: 11 }}>
                  {item.label[language]}
                </AppText>
                <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>
                  {item.value[language]}
                </AppText>
              </View>
              <Pill tone={item.status === "demo" ? "amber" : "neutral"}>
                {item.status === "demo" ? t(language, "sample") : t(language, "unknown")}
              </Pill>
            </View>
          ))}
        </Card>
      </View>
      <DemoNotice>{t(language, "limitationText")}</DemoNotice>
    </Screen>
  );
}
