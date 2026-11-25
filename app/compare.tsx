import { useMemo, useState } from "react";
import { Image, Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  Card,
  DemoNotice,
  EmptyState,
  PageHeader,
  Pill,
  ProductRow,
  ScoreRing,
  Screen,
  SecondaryButton,
  SectionHeading,
  fontFamily,
  usePalette,
} from "@/components/nutriscan-ui";
import {
  buildFactorComparisonRows,
  buildIngredientComparison,
  buildNutrientComparisonRows,
  generateComparisonAISummary,
} from "@/lib/comparison-engine";
import {
  filterProductsByChildSafe,
  filterProductsByHalal,
  productBrand,
  productById,
  productName,
  products,
  t,
} from "@/lib/nutriscan-data";
import type { Product } from "@/lib/nutriscan-data";
import {
  formatLocalizedNumber,
  isAdditiveOrConcernIngredient,
  isAllergenIngredient,
  isPositiveIngredient,
  scoreCategoryLabel,
} from "@/lib/nutrition-utils";
import { useNutriScan } from "@/lib/nutriscan-state";

const QUICK_COMPARE_PAIR_IDS: [string, string][] = [
  ["food-sample", "mangofield-mango-drink"],
  ["pran-mr-noodles", "dailycup-tomato-noodles"],
  ["bombay-potato-crackers", "suncrisp-potato-chips"],
];

function ProductSlotCard({
  label,
  product,
  onPress,
  onClear,
}: {
  label: string;
  product: Product | undefined;
  onPress: () => void;
  onClear?: () => void;
}) {
  const palette = usePalette();
  const { language } = useNutriScan();

  if (!product) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={onPress}
        style={({ pressed }) => ({
          flex: 1,
          minHeight: 158,
          borderRadius: 18,
          borderWidth: 1.5,
          borderStyle: "dashed",
          borderColor: palette.green,
          backgroundColor: palette.greenSoft,
          padding: 12,
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          opacity: pressed ? 0.82 : 1,
        })}
      >
        <View
          style={{
            width: 42,
            height: 42,
            borderRadius: 21,
            backgroundColor: palette.card,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="plus" size={22} color={palette.green} />
        </View>
        <AppText weight="semibold" style={{ fontSize: 12, color: palette.green, textAlign: "center" }}>
          {label}
        </AppText>
        <AppText style={{ fontSize: 10, color: palette.muted, textAlign: "center" }}>
          {language === "en" ? "Tap to search & pick" : "খুঁজতে ও বাছাই করতে ট্যাপ করুন"}
        </AppText>
      </Pressable>
    );
  }

  return (
    <Card
      style={{
        flex: 1,
        minHeight: 158,
        padding: 11,
        gap: 8,
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <Pill tone="green">{label}</Pill>
        {onClear ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === "en" ? `Remove ${productName(product, language)}` : "সরান"}
            onPress={onClear}
            hitSlop={8}
            style={({ pressed }) => ({
              width: 26,
              height: 26,
              borderRadius: 13,
              backgroundColor: palette.neutralSoft,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.7 : 1,
            })}
          >
            <MaterialCommunityIcons name="close" size={14} color={palette.muted} />
          </Pressable>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => ({
          alignItems: "center",
          gap: 6,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <View
          style={{
            width: 58,
            height: 58,
            borderRadius: 14,
            backgroundColor: palette.photo,
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <Image source={product.image} resizeMode="contain" style={{ width: 52, height: 52 }} />
        </View>
        <AppText style={{ fontSize: 10, color: palette.muted }} numberOfLines={1}>
          {productBrand(product, language)}
        </AppText>
        <AppText
          weight="semibold"
          numberOfLines={2}
          style={{ fontSize: 12, lineHeight: 16, textAlign: "center" }}
        >
          {productName(product, language)}
        </AppText>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }) => ({
          minHeight: 30,
          borderRadius: 10,
          backgroundColor: palette.paper,
          borderWidth: 1,
          borderColor: palette.line,
          alignItems: "center",
          justifyContent: "center",
          opacity: pressed ? 0.75 : 1,
        })}
      >
        <AppText weight="medium" style={{ fontSize: 10, color: palette.green }}>
          {language === "en" ? "Change" : "পরিবর্তন"}
        </AppText>
      </Pressable>
    </Card>
  );
}

export default function CompareProductsScreen() {
  const router = useRouter();
  const palette = usePalette();
  const {
    language,
    halalMode,
    childSafeMode,
    healthProfile,
    compareIds,
    setCompareSlot,
    swapCompareSlots,
    clearCompare,
  } = useNutriScan();

  const [pickingSlot, setPickingSlot] = useState<0 | 1 | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const foodCatalog = useMemo(() => {
    const foodOnly = products.filter((p) => p.category === "food");
    return filterProductsByChildSafe(filterProductsByHalal(foodOnly, halalMode), childSafeMode);
  }, [halalMode, childSafeMode]);

  const filteredCatalog = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return foodCatalog;
    return foodCatalog.filter((item) => {
      const text = `${item.name.en} ${item.name.bn} ${item.brand.en} ${item.brand.bn} ${item.barcode}`.toLowerCase();
      return text.includes(q);
    });
  }, [foodCatalog, searchQuery]);

  const productA = useMemo(() => {
    const p = productById(compareIds[0]);
    return p && p.category === "food" ? p : undefined;
  }, [compareIds]);

  const productB = useMemo(() => {
    const p = productById(compareIds[1]);
    return p && p.category === "food" && p.id !== productA?.id ? p : undefined;
  }, [compareIds, productA?.id]);

  const quickPairs = useMemo(() => {
    const availableIds = new Set(foodCatalog.map((p) => p.id));
    return QUICK_COMPARE_PAIR_IDS
      .filter(([a, b]) => availableIds.has(a) && availableIds.has(b))
      .map(([a, b]) => [productById(a)!, productById(b)!] as [Product, Product]);
  }, [foodCatalog]);

  const factorRows = useMemo(
    () => (productA && productB ? buildFactorComparisonRows(productA, productB) : []),
    [productA, productB],
  );

  const nutrientRows = useMemo(
    () => (productA && productB ? buildNutrientComparisonRows(productA, productB, language) : []),
    [productA, productB, language],
  );

  const ingredientSummary = useMemo(
    () =>
      productA && productB
        ? buildIngredientComparison(productA, productB, language, healthProfile)
        : null,
    [productA, productB, language, healthProfile],
  );

  const aiSummary = useMemo(
    () =>
      productA && productB
        ? generateComparisonAISummary(productA, productB, language, healthProfile)
        : null,
    [productA, productB, language, healthProfile],
  );

  if (pickingSlot !== null) {
    const slotTitle =
      pickingSlot === 0
        ? language === "en"
          ? "Select Product A"
          : "পণ্য ক নির্বাচন করুন"
        : language === "en"
          ? "Select Product B"
          : "পণ্য খ নির্বাচন করুন";

    return (
      <Screen contentStyle={{ gap: 14 }}>
        <PageHeader
          title={slotTitle}
          subtitle={
            language === "en"
              ? "Search any food product in the NutriScan catalog"
              : "NutriScan ক্যাটালগ থেকে যেকোনো খাবার খুঁজুন"
          }
          back={() => {
            setPickingSlot(null);
            setSearchQuery("");
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            backgroundColor: palette.card,
            borderRadius: 15,
            borderWidth: 1,
            borderColor: palette.line,
            paddingHorizontal: 13,
            minHeight: 48,
          }}
        >
          <MaterialCommunityIcons name="magnify" size={20} color={palette.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={
              language === "en"
                ? "Search by name, brand, or barcode..."
                : "নাম, ব্র্যান্ড বা বারকোড দিয়ে খুঁজুন..."
            }
            placeholderTextColor={palette.muted}
            style={{
              flex: 1,
              fontSize: 13,
              color: palette.ink,
              fontFamily: fontFamily(language, "regular"),
              paddingVertical: 10,
            }}
          />
          {searchQuery ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => setSearchQuery("")}
              hitSlop={8}
            >
              <MaterialCommunityIcons name="close-circle" size={18} color={palette.muted} />
            </Pressable>
          ) : null}
        </View>

        <AppText style={{ fontSize: 11, color: palette.muted }}>
          {language === "en"
            ? `${filteredCatalog.length} food products available`
            : `${formatLocalizedNumber(filteredCatalog.length, "bn", 0)}টি খাবার পণ্য পাওয়া গেছে`}
        </AppText>

        {filteredCatalog.length ? (
          <Card style={{ paddingHorizontal: 13, paddingVertical: 2, gap: 0 }}>
            {filteredCatalog.map((item, idx) => {
              const isSelectedHere =
                (pickingSlot === 0 && productA?.id === item.id) ||
                (pickingSlot === 1 && productB?.id === item.id);
              const isSelectedOther =
                (pickingSlot === 0 && productB?.id === item.id) ||
                (pickingSlot === 1 && productA?.id === item.id);
              const scoreTone =
                (item.score ?? 0) >= 75
                  ? "green"
                  : (item.score ?? 0) >= 60
                    ? "amber"
                    : "clay";
              return (
                <View key={item.id}>
                  {idx ? <View style={{ height: 1, backgroundColor: palette.line }} /> : null}
                  <ProductRow
                    product={item}
                    onPress={() => {
                      setCompareSlot(pickingSlot, item.id);
                      setPickingSlot(null);
                      setSearchQuery("");
                    }}
                    aside={
                      <View style={{ alignItems: "flex-end", gap: 4 }}>
                        {item.score !== undefined ? (
                          <Pill tone={scoreTone}>{item.score} / 100</Pill>
                        ) : null}
                        {isSelectedHere ? (
                          <AppText weight="semibold" style={{ fontSize: 10, color: palette.green }}>
                            {language === "en" ? "Selected" : "নির্বাচিত"}
                          </AppText>
                        ) : isSelectedOther ? (
                          <AppText style={{ fontSize: 10, color: palette.muted }}>
                            {language === "en" ? "Other slot" : "অন্য স্লট"}
                          </AppText>
                        ) : null}
                      </View>
                    }
                  />
                </View>
              );
            })}
          </Card>
        ) : (
          <Card>
            <EmptyState
              icon="food-off-outline"
              title={language === "en" ? "No matching food products" : "কোনো খাবার পাওয়া যায়নি"}
              body={
                language === "en"
                  ? "Try a different product name, brand, or clear your search filter."
                  : "অন্য নাম বা ব্র্যান্ড লিখে আবার খুঁজুন।"
              }
              action={{
                label: language === "en" ? "Clear search" : "সার্চ মুছুন",
                onPress: () => setSearchQuery(""),
              }}
            />
          </Card>
        )}
      </Screen>
    );
  }

  const scoreA = productA?.score ?? null;
  const scoreB = productB?.score ?? null;
  const scoreDiff =
    scoreA !== null && scoreB !== null ? Math.abs(scoreA - scoreB) : null;

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader
        title={t(language, "compareProducts")}
        subtitle={
          language === "en"
            ? "Side-by-side food nutrition & NQSS comparison"
            : "পাশাপাশি খাবারের পুষ্টি ও NQSS তুলনা"
        }
        back={() => router.back()}
        right={
          productA || productB ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={language === "en" ? "Clear comparison" : "তুলনা মুছুন"}
              onPress={clearCompare}
              hitSlop={6}
              style={({ pressed }) => ({
                minHeight: 34,
                paddingHorizontal: 10,
                borderRadius: 11,
                backgroundColor: palette.card,
                borderWidth: 1,
                borderColor: palette.line,
                alignItems: "center",
                justifyContent: "center",
                opacity: pressed ? 0.72 : 1,
              })}
            >
              <AppText weight="medium" style={{ fontSize: 11, color: palette.muted }}>
                {language === "en" ? "Clear" : "মুছুন"}
              </AppText>
            </Pressable>
          ) : undefined
        }
      />

      <DemoNotice>
        {language === "en"
          ? "Uses catalog preview nutrition values and weighted NQSS scores. Always verify serving sizes on the physical pack."
          : "ক্যাটালগের প্রিভিউ পুষ্টি-তথ্য ও NQSS স্কোর ব্যবহার করা হয়েছে। কেনার আগে প্যাকেটের পরিবেশনের পরিমাণ দেখে নিন।"}
      </DemoNotice>

      <View style={{ flexDirection: "row", alignItems: "stretch", gap: 8 }}>
        <ProductSlotCard
          label={language === "en" ? "Product A" : "পণ্য ক"}
          product={productA}
          onPress={() => setPickingSlot(0)}
          onClear={productA ? () => setCompareSlot(0, null) : undefined}
        />
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === "en" ? "Swap products" : "পণ্য অদলবদল করুন"}
            onPress={swapCompareSlots}
            disabled={!productA || !productB}
            style={({ pressed }) => ({
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: productA && productB ? palette.greenSoft : palette.neutralSoft,
              borderWidth: 1,
              borderColor: productA && productB ? palette.green : palette.line,
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.76 : 1,
            })}
          >
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={18}
              color={productA && productB ? palette.green : palette.muted}
            />
          </Pressable>
        </View>
        <ProductSlotCard
          label={language === "en" ? "Product B" : "পণ্য খ"}
          product={productB}
          onPress={() => setPickingSlot(1)}
          onClear={productB ? () => setCompareSlot(1, null) : undefined}
        />
      </View>

      {!productA || !productB ? (
        <>
          <Card>
            <EmptyState
              icon="compare-horizontal"
              title={
                productA && !productB
                  ? language === "en"
                    ? "Pick a second product to compare"
                    : "তুলনা করতে দ্বিতীয় পণ্য বাছুন"
                  : language === "en"
                    ? "Select two food products"
                    : "দুটি খাবার পণ্য নির্বাচন করুন"
              }
              body={
                language === "en"
                  ? "Search any two food items from the catalog to compare their NQSS scores, added sugar teaspoons, nutrients, and ingredients."
                  : "NQSS স্কোর, চিনির চা-চামচ, পুষ্টিগুণ ও উপাদান পাশাপাশি তুলনা করতে ক্যাটালগ থেকে দুটি খাবার বাছুন।"
              }
              action={{
                label:
                  !productA
                    ? language === "en"
                      ? "Choose Product A"
                      : "পণ্য ক বাছুন"
                    : language === "en"
                      ? "Choose Product B"
                      : "পণ্য খ বাছুন",
                onPress: () => setPickingSlot(!productA ? 0 : 1),
              }}
            />
          </Card>

          {quickPairs.length ? (
            <View style={{ gap: 8 }}>
              <SectionHeading
                title={language === "en" ? "Quick Compare Ideas" : "দ্রুত তুলনার উদাহরণ"}
              />
              {quickPairs.map(([pairA, pairB]) => (
                <Pressable
                  key={`${pairA.id}-${pairB.id}`}
                  accessibilityRole="button"
                  onPress={() => {
                    setCompareSlot(0, pairA.id);
                    setCompareSlot(1, pairB.id);
                  }}
                  style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
                >
                  <Card style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                    <MaterialCommunityIcons
                      name="compare-horizontal"
                      size={20}
                      color={palette.green}
                    />
                    <View style={{ flex: 1, gap: 2 }}>
                      <AppText weight="semibold" style={{ fontSize: 12 }}>
                        {productName(pairA, language)} vs {productName(pairB, language)}
                      </AppText>
                      <AppText style={{ fontSize: 10, color: palette.muted }}>
                        {language === "en"
                          ? `NQSS ${pairA.score ?? "—"} vs ${pairB.score ?? "—"}`
                          : `NQSS ${pairA.score ?? "—"} বনাম ${pairB.score ?? "—"}`}
                      </AppText>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={18} color={palette.muted} />
                  </Card>
                </Pressable>
              ))}
            </View>
          ) : null}
        </>
      ) : (
        <>
          {/* 1. NQSS Score Comparison */}
          <View style={{ gap: 8 }}>
            <SectionHeading
              title={language === "en" ? "NQSS Score Comparison" : "NQSS স্কোরের তুলনা"}
              action={
                scoreDiff !== null && scoreDiff > 0
                  ? language === "en"
                    ? `+${scoreDiff} pts gap`
                    : `+${formatLocalizedNumber(scoreDiff, "bn", 0)} পয়েন্ট পার্থক্য`
                  : undefined
              }
            />
            <Card style={{ gap: 16 }}>
              <View style={{ flexDirection: "row", gap: 12 }}>
                {[
                  { side: "A" as const, prod: productA, score: scoreA },
                  { side: "B" as const, prod: productB, score: scoreB },
                ].map(({ side, prod, score }) => {
                  const isLeader =
                    scoreA !== null &&
                    scoreB !== null &&
                    score !== null &&
                    ((side === "A" && scoreA > scoreB) || (side === "B" && scoreB > scoreA));
                  return (
                    <View
                      key={prod.id}
                      style={{
                        flex: 1,
                        alignItems: "center",
                        gap: 8,
                        padding: 12,
                        borderRadius: 16,
                        backgroundColor: isLeader ? palette.greenSoft : palette.paper,
                        borderWidth: 1,
                        borderColor: isLeader ? palette.green : palette.line,
                      }}
                    >
                      {score !== null ? <ScoreRing score={score} size={76} /> : null}
                      <AppText weight="bold" style={{ fontSize: 12, textAlign: "center" }} numberOfLines={2}>
                        {productName(prod, language)}
                      </AppText>
                      {score !== null ? (
                        <AppText style={{ fontSize: 11, color: palette.muted }}>
                          {scoreCategoryLabel(score, language)}
                        </AppText>
                      ) : null}
                      {isLeader ? (
                        <Pill tone="green">
                          <MaterialCommunityIcons name="trophy-outline" size={11} color={palette.green} />{" "}
                          {language === "en" ? "Higher Score" : "বেশি স্কোর"}
                        </Pill>
                      ) : null}
                    </View>
                  );
                })}
              </View>

              {factorRows.length ? (
                <View style={{ gap: 12, paddingTop: 10, borderTopWidth: 1, borderTopColor: palette.line }}>
                  <AppText weight="semibold" style={{ fontSize: 12 }}>
                    {language === "en" ? "NQSS Weighted Breakdown" : "NQSS ওজনভিত্তিক বিভাজন"}
                  </AppText>
                  {factorRows.map((factor) => {
                    const valA = factor.scoreA ?? 0;
                    const valB = factor.scoreB ?? 0;
                    return (
                      <View key={factor.key} style={{ gap: 6 }}>
                        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                          <AppText weight="medium" style={{ fontSize: 11 }}>
                            {factor.label[language]}{" "}
                            {factor.weight ? (
                              <AppText style={{ fontSize: 10, color: palette.muted }}>
                                ({factor.weight})
                              </AppText>
                            ) : null}
                          </AppText>
                          <AppText style={{ fontSize: 11, color: palette.muted }}>
                            <AppText
                              weight={factor.winner === "A" ? "bold" : "medium"}
                              style={{ fontSize: 11, color: factor.winner === "A" ? palette.green : palette.ink }}
                            >
                              {factor.scoreA ?? "—"}
                            </AppText>
                            {" vs "}
                            <AppText
                              weight={factor.winner === "B" ? "bold" : "medium"}
                              style={{ fontSize: 11, color: factor.winner === "B" ? palette.green : palette.ink }}
                            >
                              {factor.scoreB ?? "—"}
                            </AppText>
                          </AppText>
                        </View>
                        <View style={{ flexDirection: "row", gap: 8 }}>
                          <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: palette.neutralSoft, overflow: "hidden" }}>
                            <View
                              style={{
                                height: "100%",
                                width: `${Math.max(4, Math.min(100, valA))}%`,
                                backgroundColor: factor.winner === "A" ? palette.green : palette.amber,
                                borderRadius: 3,
                              }}
                            />
                          </View>
                          <View style={{ flex: 1, height: 6, borderRadius: 3, backgroundColor: palette.neutralSoft, overflow: "hidden" }}>
                            <View
                              style={{
                                height: "100%",
                                width: `${Math.max(4, Math.min(100, valB))}%`,
                                backgroundColor: factor.winner === "B" ? palette.green : palette.amber,
                                borderRadius: 3,
                              }}
                            />
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : null}
            </Card>
          </View>

          {/* 2. AI-Generated Comparison Summary */}
          {aiSummary ? (
            <View style={{ gap: 8 }}>
              <SectionHeading
                title={language === "en" ? "AI Comparison Summary" : "AI তুলনা সারাংশ"}
              />
              <Card
                style={{
                  gap: 11,
                  backgroundColor: palette.greenSoft,
                  borderColor: palette.green,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: palette.card,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <MaterialCommunityIcons name="robot-outline" size={20} color={palette.green} />
                  </View>
                  <View style={{ flex: 1, gap: 2 }}>
                    <AppText weight="bold" style={{ fontSize: 14 }}>
                      {aiSummary.headline}
                    </AppText>
                    <AppText style={{ fontSize: 10, color: palette.green }}>
                      {language === "en"
                        ? "Nouri prototype insight · based on catalog data"
                        : "নৌরি প্রোটোটাইপ বিশ্লেষণ · ক্যাটালগের তথ্যের ভিত্তিতে"}
                    </AppText>
                  </View>
                </View>

                <AppText style={{ fontSize: 12, lineHeight: 18, color: palette.ink }}>
                  {aiSummary.overview}
                </AppText>

                {aiSummary.bullets.length ? (
                  <View style={{ gap: 6 }}>
                    {aiSummary.bullets.map((bullet, idx) => (
                      <View key={idx} style={{ flexDirection: "row", alignItems: "flex-start", gap: 7 }}>
                        <MaterialCommunityIcons
                          name="check-circle-outline"
                          size={15}
                          color={palette.green}
                          style={{ marginTop: 2 }}
                        />
                        <AppText style={{ flex: 1, fontSize: 12, lineHeight: 17, color: palette.ink }}>
                          {bullet}
                        </AppText>
                      </View>
                    ))}
                  </View>
                ) : null}

                {aiSummary.personalizedNote ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: 10,
                      borderRadius: 12,
                      backgroundColor: palette.card,
                    }}
                  >
                    <MaterialCommunityIcons name="account-heart-outline" size={16} color={palette.amberInk} style={{ marginTop: 1 }} />
                    <AppText weight="medium" style={{ flex: 1, fontSize: 11, lineHeight: 16, color: palette.ink }}>
                      {aiSummary.personalizedNote}
                    </AppText>
                  </View>
                ) : null}

                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, paddingTop: 2 }}>
                  <AppText style={{ flex: 1, fontSize: 10, color: palette.muted }}>
                    {language === "en"
                      ? "Informational summary only, not medical advice."
                      : "শুধু সাধারণ তথ্য, চিকিৎসা পরামর্শ নয়।"}
                  </AppText>
                  <Pressable
                    accessibilityRole="button"
                    onPress={() => router.push("/(tabs)/nouri")}
                    style={({ pressed }) => ({
                      minHeight: 36,
                      paddingHorizontal: 12,
                      borderRadius: 10,
                      backgroundColor: palette.card,
                      borderWidth: 1,
                      borderColor: palette.line,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 5,
                      opacity: pressed ? 0.8 : 1,
                    })}
                  >
                    <MaterialCommunityIcons name="chat-outline" size={14} color={palette.green} />
                    <AppText weight="semibold" style={{ fontSize: 11, color: palette.green }}>
                      {language === "en" ? "Ask Nouri" : "নৌরিকে জিজ্ঞাসা"}
                    </AppText>
                  </Pressable>
                </View>
              </Card>
            </View>
          ) : null}

          {/* 3. Nutritional Comparison */}
          <View style={{ gap: 8 }}>
            <SectionHeading
              title={language === "en" ? "Nutritional Comparison" : "পুষ্টিগুণের তুলনা"}
            />
            <Card style={{ gap: 12 }}>
              <View
                style={{
                  flexDirection: "row",
                  gap: 8,
                  paddingBottom: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: palette.line,
                }}
              >
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText weight="semibold" style={{ fontSize: 11 }} numberOfLines={1}>
                    {productName(productA, language)}
                  </AppText>
                  <AppText style={{ fontSize: 10, color: palette.muted }}>
                    {productA.nutrition?.serving[language]}
                  </AppText>
                </View>
                <View style={{ flex: 1, gap: 2 }}>
                  <AppText weight="semibold" style={{ fontSize: 11 }} numberOfLines={1}>
                    {productName(productB, language)}
                  </AppText>
                  <AppText style={{ fontSize: 10, color: palette.muted }}>
                    {productB.nutrition?.serving[language]}
                  </AppText>
                </View>
              </View>

              {nutrientRows.map((row, idx) => {
                const winA = row.winner === "A";
                const winB = row.winner === "B";
                const renderCell = (
                  value: string,
                  subValue: string | undefined,
                  isWinner: boolean,
                ) => (
                  <View
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 12,
                      backgroundColor: isWinner ? palette.greenSoft : palette.paper,
                      borderWidth: 1,
                      borderColor: isWinner ? palette.green : palette.line,
                      gap: 4,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                      <AppText
                        weight={isWinner ? "bold" : "semibold"}
                        style={{
                          fontSize: 13,
                          color: isWinner ? palette.green : palette.ink,
                        }}
                      >
                        {value}
                      </AppText>
                      {isWinner ? (
                        <MaterialCommunityIcons name="check-circle" size={15} color={palette.green} />
                      ) : null}
                    </View>
                    {subValue ? (
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                        <MaterialCommunityIcons
                          name="spoon-sugar"
                          size={13}
                          color={isWinner ? palette.green : palette.amberInk}
                        />
                        <AppText
                          weight="medium"
                          style={{
                            fontSize: 10,
                            color: isWinner ? palette.green : palette.amberInk,
                          }}
                        >
                          {subValue}
                        </AppText>
                      </View>
                    ) : null}
                  </View>
                );

                return (
                  <View
                    key={row.key}
                    style={{
                      gap: 7,
                      paddingTop: idx ? 10 : 0,
                      borderTopWidth: idx ? 1 : 0,
                      borderTopColor: palette.line,
                    }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                        <MaterialCommunityIcons name={row.icon} size={17} color={palette.muted} />
                        <AppText weight="semibold" style={{ fontSize: 12 }}>
                          {row.label[language]}
                        </AppText>
                      </View>
                      {row.winner === "tie" ? (
                        <Pill tone="neutral">{language === "en" ? "Equal" : "সমান"}</Pill>
                      ) : row.winner === "na" ? (
                        <AppText style={{ fontSize: 10, color: palette.muted }}>
                          {language === "en" ? "Partial label data" : "আংশিক তথ্য"}
                        </AppText>
                      ) : (
                        <AppText style={{ fontSize: 10, color: palette.green }}>
                          {row.higherIsBetter
                            ? language === "en"
                              ? "Higher is better"
                              : "বেশি হওয়া ভালো"
                            : language === "en"
                              ? "Lower is better"
                              : "কম হওয়া ভালো"}
                        </AppText>
                      )}
                    </View>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      {renderCell(row.valueA, row.subValueA, winA)}
                      {renderCell(row.valueB, row.subValueB, winB)}
                    </View>
                  </View>
                );
              })}

              <AppText style={{ fontSize: 10, color: palette.muted }}>
                {language === "en"
                  ? "Sugar conversion guide: 4 g sugar = 1 teaspoon."
                  : "চিনির হিসাব: ৪ গ্রাম চিনি = ১ চা-চামচ।"}
              </AppText>
            </Card>
          </View>

          {/* 4. Ingredients & Additives Comparison */}
          {ingredientSummary ? (
            <View style={{ gap: 8 }}>
              <SectionHeading
                title={language === "en" ? "Ingredients & Additives" : "উপাদান ও অ্যাডিটিভ তুলনা"}
              />
              <Card style={{ gap: 12 }}>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  {[
                    {
                      prod: productA,
                      count: ingredientSummary.countA,
                      additives: ingredientSummary.additiveCountA,
                      allergens: ingredientSummary.allergensA,
                      personal: ingredientSummary.personalAllergensA,
                      fewer: ingredientSummary.fewerIngredientsWinner === "A",
                    },
                    {
                      prod: productB,
                      count: ingredientSummary.countB,
                      additives: ingredientSummary.additiveCountB,
                      allergens: ingredientSummary.allergensB,
                      personal: ingredientSummary.personalAllergensB,
                      fewer: ingredientSummary.fewerIngredientsWinner === "B",
                    },
                  ].map((side) => (
                    <View
                      key={side.prod.id}
                      style={{
                        flex: 1,
                        padding: 10,
                        borderRadius: 14,
                        backgroundColor: palette.paper,
                        borderWidth: 1,
                        borderColor: side.fewer ? palette.green : palette.line,
                        gap: 8,
                      }}
                    >
                      <AppText weight="bold" style={{ fontSize: 12 }} numberOfLines={2}>
                        {productName(side.prod, language)}
                      </AppText>

                      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
                        <Pill tone={side.fewer ? "green" : "neutral"}>
                          {language === "en"
                            ? `${side.count} ingredients`
                            : `${formatLocalizedNumber(side.count, "bn", 0)}টি উপাদান`}
                        </Pill>
                        <Pill tone={side.additives === 0 ? "green" : "amber"}>
                          {language === "en"
                            ? `${side.additives} sugar/additives`
                            : `${formatLocalizedNumber(side.additives, "bn", 0)}টি চিনি/অ্যাডিটিভ`}
                        </Pill>
                      </View>

                      {side.personal.length ? (
                        <Pill tone="clay">
                          {language === "en" ? "Matches your allergy" : "আপনার অ্যালার্জির সাথে মেলে"}
                        </Pill>
                      ) : side.allergens.length ? (
                        <Pill tone="amber">
                          {language === "en" ? "Contains allergens" : "অ্যালার্জেন থাকতে পারে"}
                        </Pill>
                      ) : null}

                      <View style={{ gap: 5, paddingTop: 4, borderTopWidth: 1, borderTopColor: palette.line }}>
                        {side.prod.ingredients.map((ing, i) => {
                          const allergen = isAllergenIngredient(ing.en, ing.bn);
                          const additive = isAdditiveOrConcernIngredient(ing.en, ing.bn);
                          const positive = isPositiveIngredient(ing.en, ing.bn);
                          const dotColor = allergen
                            ? palette.clay
                            : additive
                              ? palette.amber
                              : positive
                                ? palette.green
                                : palette.muted;
                          return (
                            <View key={`${ing.en}-${i}`} style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                              <View
                                style={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: 4,
                                  backgroundColor: dotColor,
                                }}
                              />
                              <AppText style={{ flex: 1, fontSize: 11, color: palette.ink }}>
                                {ing[language]}
                              </AppText>
                            </View>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </View>

                {ingredientSummary.sharedIngredients.length ? (
                  <View style={{ gap: 5, paddingTop: 8, borderTopWidth: 1, borderTopColor: palette.line }}>
                    <AppText weight="semibold" style={{ fontSize: 11, color: palette.muted }}>
                      {language === "en"
                        ? `Shared ingredients: ${ingredientSummary.sharedIngredients.join(", ")}`
                        : `উভয় পণ্যে থাকা উপাদান: ${ingredientSummary.sharedIngredients.join(", ")}`}
                    </AppText>
                  </View>
                ) : null}
              </Card>
            </View>
          ) : null}

          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <SecondaryButton
                title={language === "en" ? "View Product A" : "পণ্য ক দেখুন"}
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: productA.id } })}
                style={{ flex: 1 }}
              />
              <SecondaryButton
                title={language === "en" ? "View Product B" : "পণ্য খ দেখুন"}
                onPress={() => router.push({ pathname: "/product/[id]", params: { id: productB.id } })}
                style={{ flex: 1 }}
              />
            </View>
            <SecondaryButton
              title={language === "en" ? "Explore Ingredient Explainer" : "উপাদান ব্যাখ্যা দেখুন"}
              icon="flask-outline"
              onPress={() => router.push({ pathname: "/ingredient/[id]", params: { id: "search" } })}
            />
          </View>
        </>
      )}
    </Screen>
  );
}
