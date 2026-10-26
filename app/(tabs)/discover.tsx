import { useEffect, useMemo, useState } from "react";
import { Image, Pressable, ScrollView, TextInput, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, PageHeader, Pill, Screen, SectionHeading, SecondaryButton, fontFamily, usePalette } from "@/components/nutriscan-ui";
import { categoryLabel, filterProductsByHalal, products, productBrand, productName, t } from "@/lib/nutriscan-data";
import type { Category } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

const filters: (Category | "all")[] = ["food", "all", "personalCare", "household"];
const filterKey = (category: Category | "all") => category === "all" ? "allProducts" : category;
const categoryFromParam = (value?: string): Category | "all" => value === "all" || value === "personalCare" || value === "household" || value === "food" ? value : "food";

export default function DiscoverScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { language, halalMode } = useNutriScan();
  const palette = usePalette();
  const [category, setCategory] = useState<Category | "all">(() => categoryFromParam(params.category));
  const [query, setQuery] = useState("");
  useEffect(() => {
    // Route params can change while the tab remains mounted; sync the selected filter.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (params.category) setCategory(categoryFromParam(params.category));
  }, [params.category]);
  const visibleProducts = useMemo(() => filterProductsByHalal(products, halalMode).filter((product) => {
    const words = `${product.name.en} ${product.name.bn} ${product.brand.en} ${product.brand.bn} ${product.size.en}`.toLocaleLowerCase();
    return (category === "all" || product.category === category) && (!query.trim() || words.includes(query.trim().toLocaleLowerCase()));
  }), [category, halalMode, query]);

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader title={t(language, "discoverTitle")} subtitle={t(language, "discoverSubtitle")} />
      <View style={{ height: 48, borderRadius: 15, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 13 }}>
        <MaterialCommunityIcons name="magnify" size={19} color={palette.muted} />
        <TextInput value={query} onChangeText={setQuery} placeholder={t(language, "searchCatalog")} placeholderTextColor={palette.muted} accessibilityLabel={t(language, "searchCatalog")} accessibilityHint={language === "en" ? "Search product and brand names" : "পণ্য ও ব্র্যান্ডের নাম খুঁজুন"} returnKeyType="search" style={{ flex: 1, color: palette.ink, fontFamily: fontFamily(language), fontSize: 12, paddingVertical: 8 }} />
        {query ? <Pressable accessibilityRole="button" accessibilityLabel={language === "en" ? "Clear search" : "অনুসন্ধান মুছুন"} onPress={() => setQuery("")} hitSlop={8} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="close-circle" size={18} color={palette.muted} /></Pressable> : null}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 6 }}>
        {filters.map((item) => {
          const active = category === item;
          return <Pressable key={item} accessibilityRole="tab" accessibilityLabel={t(language, filterKey(item))} accessibilityState={{ selected: active }} onPress={() => setCategory(item)} style={({ pressed }) => [{ minHeight: 44, borderRadius: 100, borderWidth: 1, borderColor: active ? palette.green : palette.line, backgroundColor: active ? palette.green : palette.card, paddingHorizontal: 14, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.76 : 1 }]}>
            <AppText weight="semibold" style={{ color: active ? palette.white : palette.ink, fontSize: 11 }}>{t(language, filterKey(item))}</AppText>
          </Pressable>;
        })}
      </ScrollView>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <SectionHeading title={category === "food" ? t(language, "foodShelf") : category === "all" ? t(language, "allCategories") : categoryLabel(category, language)} />
        <Pill tone="neutral">{visibleProducts.length} {t(language, "resultCount")}</Pill>
      </View>

      {visibleProducts.length ? <View style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 }}>
        {visibleProducts.map((product) => <Pressable key={product.id} accessibilityRole="button" accessibilityLabel={`${productName(product, language)}, ${productBrand(product, language)}, ${language === "en" ? "View details" : "বিস্তারিত দেখুন"}`} accessibilityHint={language === "en" ? "Opens the product preview" : "পণ্যের প্রিভিউ খুলুন"} onPress={() => {
          router.push({ pathname: "/product/[id]", params: { id: product.id } });
        }} style={({ pressed }) => [{ width: "48.5%", borderRadius: 19, overflow: "hidden", backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, opacity: pressed ? 0.88 : 1 }]}>
          <View style={{ position: "relative", backgroundColor: palette.photo, padding: 7 }}>
            <Image source={product.image} resizeMode="contain" style={{ width: "100%", height: 142, borderRadius: 14 }} />
            <View style={{ position: "absolute", left: 12, top: 12 }}><Pill tone="neutral">{categoryLabel(product.category, language)}</Pill></View>
          </View>
          <View style={{ padding: 12, gap: 5 }}>
            <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>{productBrand(product, language)}</AppText>
            <AppText weight="semibold" numberOfLines={2} style={{ minHeight: 36, fontSize: 12, lineHeight: 18 }}>{productName(product, language)}</AppText>
            <AppText style={{ color: palette.muted, fontSize: 10 }}>{product.size[language]}</AppText>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 5 }}>
              {product.score !== undefined ? <Pill tone={product.score >= 75 ? "green" : product.score >= 60 ? "amber" : "clay"}>{product.score} · {t(language, "sample")}</Pill> : <Pill tone="neutral">{t(language, "noGrade")}</Pill>}
              <MaterialCommunityIcons name="arrow-up-right" size={16} color={palette.green} />
            </View>
          </View>
        </Pressable>)}
      </View> : <Card style={{ alignItems: "center", paddingVertical: 28, gap: 7 }}>
        <MaterialCommunityIcons name={halalMode ? "shield-off-outline" : "magnify-close"} size={30} color={palette.muted} />
        <AppText weight="semibold" style={{ fontSize: 14 }}>{halalMode ? t(language, "halalEmptyTitle") : language === "en" ? "No matching products" : "মিল থাকা পণ্য নেই"}</AppText>
        <AppText style={{ color: palette.muted, fontSize: 11, textAlign: "center" }}>{halalMode ? t(language, "halalEmptyBody") : language === "en" ? "Try another product or brand name." : "অন্য পণ্য বা ব্র্যান্ডের নাম দিয়ে দেখুন।"}</AppText>
        {halalMode ? <SecondaryButton title={t(language, "turnOffHalalMode")} icon="shield-off-outline" onPress={() => router.push("/(tabs)/more")} style={{ alignSelf: "stretch", minHeight: 44 }} /> : query.trim() ? <SecondaryButton title={language === "en" ? "Clear search" : "অনুসন্ধান মুছুন"} icon="close-circle-outline" onPress={() => setQuery("")} style={{ alignSelf: "stretch", minHeight: 44 }} /> : null}
      </Card>}

      <SectionHeading title={t(language, "aboutThisSample")} />
      <Card style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, backgroundColor: palette.amberSoft, borderColor: palette.line }}>
        <MaterialCommunityIcons name="information-outline" size={18} color={palette.amberInk} />
        <AppText style={{ flex: 1, color: palette.amberInk, fontSize: 11, lineHeight: 17 }}>{t(language, "demoProductCaveat")}</AppText>
      </Card>
    </Screen>
  );
}
