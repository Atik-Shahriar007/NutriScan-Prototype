import { useEffect, useMemo, useState } from "react";
import { Animated, Image, Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, Pill, PrimaryButton, ProductRow, Screen, SectionHeading, usePalette } from "@/components/nutriscan-ui";
import { filterProductsByHalal, products, t } from "@/lib/nutriscan-data";
import type { Category } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

const nutriScanMark = require("../../assets/images/nutriscan-mark.png");

export default function HomeScreen() {
  const router = useRouter();
  const { language, halalMode } = useNutriScan();
  const palette = usePalette();
  const categoryStyles: Record<Category, { icon: "food-apple-outline" | "bottle-tonic-outline" | "spray-bottle"; tint: string }> = {
    food: { icon: "food-apple-outline", tint: palette.greenSoft },
    personalCare: { icon: "bottle-tonic-outline", tint: palette.amberSoft },
    household: { icon: "spray-bottle", tint: palette.claySoft },
  };
  const visibleProducts = useMemo(() => filterProductsByHalal(products, halalMode), [halalMode]);
  const featuredProducts = useMemo(() => visibleProducts.filter((product) => product.category === "food").slice(0, 3), [visibleProducts]);
  const openProduct = (productId: string) => {
    router.push({ pathname: "/product/[id]", params: { id: productId } });
  };
  const categories: Category[] = ["food", "personalCare", "household"];

  return (
    <Screen contentStyle={{ gap: 20 }}>
      <PageHeader title="" />
      <View style={{ gap: 9 }}>
        <Pill tone="amber"><MaterialCommunityIcons name="map-marker-outline" size={12} color={palette.amberInk} />　{t(language, "prototypeStatus")}</Pill>
        <AppText weight="bold" style={{ fontSize: 29, lineHeight: 37, letterSpacing: -0.65 }}>{t(language, "homeTitle")}</AppText>
        <AppText style={{ color: palette.muted, fontSize: 13, lineHeight: 20 }}>{t(language, "homeSubtitle")}</AppText>
      </View>

      <Card style={{ padding: 14, gap: 14, overflow: "hidden" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 13 }}>
          <BarcodeScanIllustration />
          <View style={{ flex: 1, gap: 6 }}>
            <Pill tone="green">{language === "en" ? "SCAN A PRODUCT" : "পণ্য স্ক্যান করুন"}</Pill>
            <AppText weight="semibold" style={{ fontSize: 16, lineHeight: 22 }}>{t(language, "scannerTitle")}</AppText>
            <AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 16 }}>{t(language, "scannerHint")}</AppText>
          </View>
        </View>
        <PrimaryButton title={t(language, "openScanner")} icon="barcode-scan" onPress={() => router.push("/scan")} />
      </Card>

      <View style={{ gap: 11 }}>
        <SectionHeading title={t(language, "categories")} action={t(language, "seeAll")} onAction={() => router.push("/(tabs)/discover")} />
        <View style={{ flexDirection: "row", gap: 9 }}>
          {categories.map((category) => {
            const item = categoryStyles[category];
            const count = visibleProducts.filter((product) => product.category === category).length;
            return <Pressable key={category} accessibilityRole="button" onPress={() => router.push({ pathname: "/(tabs)/discover", params: { category } })} style={({ pressed }) => [{ flex: 1, minHeight: 104, borderRadius: 18, padding: 10, backgroundColor: palette.card, borderColor: palette.line, borderWidth: 1, justifyContent: "space-between", opacity: pressed ? 0.88 : 1 }]}>
              <View style={{ width: 35, height: 35, borderRadius: 12, backgroundColor: item.tint, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name={item.icon} size={19} color={palette.green} /></View>
              <View style={{ gap: 3 }}><AppText weight="semibold" numberOfLines={1} style={{ fontSize: 10 }}>{category === "food" ? t(language, "food") : category === "personalCare" ? t(language, "personalCare") : t(language, "household")}</AppText><AppText style={{ color: palette.muted, fontSize: 9 }}>{count} {language === "en" ? "products" : "পণ্য"}</AppText></View>
            </Pressable>;
          })}
        </View>
      </View>

      <View style={{ gap: 7 }}>
        <SectionHeading title={t(language, "sampleCatalog")} action={t(language, "seeAll")} onAction={() => router.push("/(tabs)/discover")} />
        <Card style={{ paddingHorizontal: 13, paddingVertical: 2, gap: 0 }}>
          {featuredProducts.length ? featuredProducts.map((product, index) => <View key={product.id}>
            {index > 0 ? <View style={{ height: 1, backgroundColor: palette.line }} /> : null}
            <ProductRow product={product} onPress={() => openProduct(product.id)} aside={<MaterialCommunityIcons name="chevron-right" size={20} color={palette.muted} />} />
          </View>) : <View style={{ alignItems: "center", paddingVertical: 22, gap: 7 }}><MaterialCommunityIcons name="shield-off-outline" size={25} color={palette.muted} /><AppText weight="semibold" style={{ fontSize: 12 }}>{t(language, "halalEmptyTitle")}</AppText><AppText style={{ color: palette.muted, fontSize: 10, textAlign: "center" }}>{t(language, "halalEmptyBody")}</AppText></View>}
        </Card>
      </View>
      <DemoNotice>{t(language, "demoProductCaveat")}</DemoNotice>
    </Screen>
  );
}

function BarcodeScanIllustration() {
  const palette = usePalette();
  const [scanProgress] = useState(() => new Animated.Value(0));
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scanProgress, { toValue: 1, duration: 850, useNativeDriver: true, isInteraction: false }),
        Animated.delay(500),
        Animated.timing(scanProgress, { toValue: 0, duration: 1, useNativeDriver: true, isInteraction: false }),
      ]),
    );
    animation.start();
    return () => animation.stop();
  }, [scanProgress]);
  const beamY = scanProgress.interpolate({ inputRange: [0, 1], outputRange: [-38, 38] });
  const beamOpacity = scanProgress.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.62, 1, 0.62] });
  return (
    <View accessible accessibilityLabel="NutriScan mark with continuous scanning animation" style={{ width: 92, height: 94, borderRadius: 20, backgroundColor: palette.greenSoft, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      <View pointerEvents="none" style={{ width: 72, height: 72, borderRadius: 22, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <Image source={nutriScanMark} resizeMode="contain" style={{ width: 70, height: 70, borderRadius: 20 }} />
        <Animated.View pointerEvents="none" style={{ position: "absolute", left: 7, right: 7, height: 2, backgroundColor: palette.green, shadowColor: palette.green, shadowOpacity: 0.95, shadowRadius: 7, opacity: beamOpacity, transform: [{ translateY: beamY }] }} />
      </View>
      <View style={{ position: "absolute", bottom: 8, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 99, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line }}><MaterialCommunityIcons name="radar" size={10} color={palette.green} /><AppText weight="semibold" style={{ color: palette.green, fontSize: 7, letterSpacing: 0.45 }}>SCANNING</AppText></View>
    </View>
  );
}
