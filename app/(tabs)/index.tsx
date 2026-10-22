import { useMemo, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, Pill, PrimaryButton, ProductRow, Screen, SectionHeading, fontFamily, palette } from "@/components/nutriscan-ui";
import { categoryLabel, productByBarcode, products, t } from "@/lib/nutriscan-data";
import type { Category } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";
import { trpc } from "@/lib/trpc";

export default function HomeScreen() {
  const router = useRouter();
  const { language, history, recordScan } = useNutriScan();
  const catalogQuery = trpc.catalog.list.useQuery(undefined, { retry: false, staleTime: 60_000 });
  const catalogProducts = catalogQuery.data?.length ? catalogQuery.data : products;
  const [category, setCategory] = useState<Category>("food");
  const [barcode, setBarcode] = useState("");
  const [query, setQuery] = useState("");
  const visibleProducts = useMemo(() => catalogProducts.filter((product) => {
    const words = `${product.name.en} ${product.name.bn} ${product.brand.en} ${product.brand.bn}`.toLowerCase();
    return product.category === category && (!query.trim() || words.includes(query.trim().toLowerCase()));
  }), [catalogProducts, category, query]);
  const normalizeBarcode = (value: string) => value.trim().replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit)));
  const openBarcode = () => {
    const code = normalizeBarcode(barcode);
    const product = catalogProducts.find((item) => item.barcode === code) ?? productByBarcode(code);
    if (product) {
      recordScan(product.id);
      router.push({ pathname: "/product/[id]", params: { id: product.id } });
    } else if (code) router.push({ pathname: "/scan", params: { barcode: code } });
  };
  const openSample = (productId: string) => {
    recordScan(productId);
    router.push({ pathname: "/product/[id]", params: { id: productId } });
  };
  const categories: Category[] = ["food", "personalCare", "household"];

  return (
    <Screen contentStyle={{ gap: 18 }}>
      <PageHeader title="" />
      <View style={{ gap: 8, paddingTop: 2 }}>
        <Pill tone="amber"><MaterialCommunityIcons name="map-marker-outline" size={12} color="#805915" />　{t(language, "prototypeStatus")}</Pill>
        <AppText weight="bold" style={{ fontSize: 29, lineHeight: 38, letterSpacing: -0.6 }}>{t(language, "homeTitle")}</AppText>
        <AppText style={{ color: palette.muted, fontSize: 13, lineHeight: 20 }}>{t(language, "homeSubtitle")}</AppText>
      </View>

      <Card style={{ padding: 15, gap: 13 }}>
        <PrimaryButton title={t(language, "openScanner")} icon="barcode-scan" onPress={() => router.push("/scan")} />
        <AppText style={{ color: palette.muted, fontSize: 11, textAlign: "center" }}>{t(language, "scannerHint")}</AppText>
        <View style={{ height: 1, backgroundColor: palette.line }} />
        <AppText weight="semibold" style={{ fontSize: 12 }}>{t(language, "enterBarcode")}</AppText>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput value={barcode} onChangeText={setBarcode} onSubmitEditing={openBarcode} placeholder={t(language, "barcodePlaceholder")} placeholderTextColor={palette.muted} keyboardType="number-pad" accessibilityLabel={t(language, "enterBarcode")} style={{ flex: 1, minHeight: 46, borderRadius: 13, backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 13, color: palette.ink, fontFamily: fontFamily(language), fontSize: 13 }} />
          <Pressable accessibilityRole="button" onPress={openBarcode} style={{ width: 48, borderRadius: 13, backgroundColor: palette.green, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="arrow-right" size={20} color={palette.white} /></Pressable>
        </View>
      </Card>

      <View style={{ gap: 11 }}>
        <SectionHeading title={t(language, "categories")} />
        <View style={{ flexDirection: "row", gap: 8 }}>
          {categories.map((item) => {
            const active = category === item;
            return <Pressable key={item} onPress={() => setCategory(item)} accessibilityRole="tab" accessibilityState={{ selected: active }} style={{ flex: 1, minHeight: 41, borderRadius: 14, backgroundColor: active ? palette.green : palette.card, borderWidth: 1, borderColor: active ? palette.green : palette.line, alignItems: "center", justifyContent: "center", paddingHorizontal: 5 }}>
              <AppText weight="semibold" numberOfLines={1} style={{ fontSize: 10, color: active ? palette.white : palette.ink }}>{categoryLabel(item, language)}</AppText>
            </Pressable>;
          })}
        </View>
      </View>

      {history.length ? <View style={{ gap: 8 }}>
        <SectionHeading title={t(language, "recent")} action={t(language, "seeAll")} onAction={() => router.push("/(tabs)/history")} />
        <Card style={{ paddingVertical: 2, paddingHorizontal: 14, gap: 0 }}>
          {history.slice(0, 3).map((entry, index) => {
            const product = entry.productSnapshot ?? products.find((item) => item.id === entry.productId);
            if (!product) return null;
            return <View key={entry.id}>{index ? <View style={{ height: 1, backgroundColor: palette.line }} /> : null}<ProductRow product={product} onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id, historyId: entry.id } })} aside={<View style={{ alignItems: "flex-end", gap: 2 }}><MaterialCommunityIcons name="chevron-right" size={18} color={palette.muted} />{entry.scanCount > 1 ? <AppText style={{ color: palette.green, fontSize: 9 }}>{entry.scanCount}×</AppText> : null}</View>} /></View>;
          })}
        </Card>
      </View> : null}

      <View style={{ gap: 8 }}>
        <SectionHeading title={t(language, "sampleCatalog")} />
        <TextInput value={query} onChangeText={setQuery} placeholder={language === "en" ? "Search the demo catalog" : "ডেমো ক্যাটালগে খুঁজুন"} placeholderTextColor={palette.muted} accessibilityLabel={language === "en" ? "Search products" : "পণ্য খুঁজুন"} style={{ minHeight: 44, borderRadius: 13, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 13, color: palette.ink, fontFamily: fontFamily(language), fontSize: 12 }} />
        <Card style={{ paddingVertical: 2, paddingHorizontal: 14, gap: 0 }}>
          {visibleProducts.length ? visibleProducts.map((product, index) => <View key={product.id}>
            {index > 0 ? <View style={{ height: 1, backgroundColor: palette.line }} /> : null}
            <ProductRow product={product} onPress={() => openSample(product.id)} aside={<Pill tone={product.category === "food" ? "green" : "neutral"}>{product.category === "food" ? `72 · ${t(language, "sample").toLowerCase()}` : t(language, "sample")}</Pill>} />
          </View>) : <AppText style={{ color: palette.muted, padding: 14, fontSize: 12 }}>{language === "en" ? "No demo products in this category yet." : "এই ধরনে এখনো ডেমো পণ্য নেই।"}</AppText>}
        </Card>
        <DemoNotice />
      </View>
    </Screen>
  );
}
