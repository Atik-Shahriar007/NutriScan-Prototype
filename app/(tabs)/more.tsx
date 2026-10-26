import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Pressable, Switch, View } from "react-native";
import { AppText, Card, PageHeader, PrimaryButton, ProductRow, Screen, SectionHeading, SecondaryButton, usePalette } from "@/components/nutriscan-ui";
import { filterProductsByHalal, productById, products, t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

export default function MoreScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { language, favorites, halalMode, setHalalMode } = useNutriScan();
  const favoriteProducts = filterProductsByHalal(favorites.map((id) => productById(id)).filter((item) => item !== undefined), halalMode);
  const openProduct = (id: string) => router.push({ pathname: "/product/[id]", params: { id } });
  const actions = [
    { key: "profile", icon: "account-edit-outline" as const, tint: palette.greenSoft, title: t(language, "openProfile"), subtitle: t(language, "profileSubtitle"), route: "/(tabs)/profile" as const },
    { key: "nutrifacts", icon: "lightbulb-on-outline" as const, tint: palette.amberSoft, title: t(language, "openNutriFacts"), subtitle: t(language, "nutriFactsSubtitle"), route: "/(tabs)/nutrifacts" as const },
    { key: "community", icon: "podium-gold" as const, tint: palette.greenSoft, title: t(language, "openCommunity"), subtitle: t(language, "leaderboardBody"), route: "/(tabs)/community" as const },
    { key: "support", icon: "heart-outline" as const, tint: palette.amberSoft, title: t(language, "openSupport"), subtitle: t(language, "supportBody"), route: "/(tabs)/support" as const },
  ];
  return (
    <Screen contentStyle={{ gap: 18 }}>
      <PageHeader title={t(language, "moreTitle")} subtitle={t(language, "moreSubtitle")} />
      <Card style={{ flexDirection: "row", alignItems: "center", gap: 13, backgroundColor: palette.greenSoft, borderColor: palette.line }}>
        <View style={{ width: 48, height: 48, borderRadius: 16, backgroundColor: palette.card, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="leaf-circle-outline" size={27} color={palette.green} /></View>
        <View style={{ flex: 1, gap: 4 }}><AppText weight="semibold" style={{ fontSize: 15 }}>{t(language, "brandAbout")}</AppText><AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 16 }}>{t(language, "prototypeStatus")}</AppText></View>
      </Card>
      <Card style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: halalMode ? palette.greenSoft : palette.card }}>
        <View style={{ width: 44, height: 44, borderRadius: 15, backgroundColor: halalMode ? palette.card : palette.neutralSoft, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="shield-check-outline" size={23} color={palette.green} /></View>
        <View style={{ flex: 1, gap: 4 }}>
          <AppText weight="semibold" style={{ fontSize: 14 }}>{t(language, "halalMode")}</AppText>
          <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>{halalMode ? t(language, "halalModeActive") : t(language, "halalModeDescription")}</AppText>
          <AppText weight="semibold" style={{ color: halalMode ? palette.green : palette.muted, fontSize: 10 }}>{halalMode ? t(language, "halalModeOn") : t(language, "halalModeOff")}</AppText>
        </View>
        <Switch
          value={halalMode}
          onValueChange={setHalalMode}
          accessibilityRole="switch"
          accessibilityLabel={t(language, "halalMode")}
          accessibilityState={{ checked: halalMode }}
          trackColor={{ false: palette.line, true: palette.greenSoft }}
          thumbColor={halalMode ? palette.green : palette.muted}
        />
      </Card>
      <PrimaryButton title={language === "en" ? "Scan a product" : "পণ্য স্ক্যান করুন"} icon="barcode-scan" onPress={() => router.push("/scan")} />
      <View style={{ gap: 9 }}>
        {actions.map((item) => <Pressable key={item.key} accessibilityRole="button" accessibilityLabel={item.title} accessibilityHint={language === "en" ? `Open ${item.title}` : `${item.title} খুলুন`} onPress={() => router.push(item.route)} hitSlop={4} style={({ pressed }) => [pressed ? { opacity: 0.86 } : null]}>
          <Card style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <View style={{ width: 44, height: 44, borderRadius: 15, backgroundColor: item.tint, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name={item.icon} size={22} color={palette.green} /></View>
            <View style={{ flex: 1, gap: 4 }}><AppText weight="semibold" style={{ fontSize: 13 }}>{item.title}</AppText><AppText numberOfLines={2} style={{ color: palette.muted, fontSize: 10, lineHeight: 15 }}>{item.subtitle}</AppText></View>
            <MaterialCommunityIcons name="chevron-right" size={20} color={palette.muted} />
          </Card>
        </Pressable>)}
      </View>
      <View style={{ gap: 7 }}>
        <SectionHeading title={t(language, "favoritesTitle")} />
        <Card style={{ paddingHorizontal: 13, paddingVertical: 2, gap: 0 }}>
          {favoriteProducts.length ? favoriteProducts.map((product, index) => <View key={product.id}>
            {index ? <View style={{ height: 1, backgroundColor: palette.line }} /> : null}
            <ProductRow product={product} onPress={() => openProduct(product.id)} aside={<MaterialCommunityIcons name="star" size={18} color={palette.amber} />} />
          </View>) : <View style={{ alignItems: "center", paddingVertical: 18, gap: 7 }}><MaterialCommunityIcons name={halalMode && favorites.length ? "shield-off-outline" : "star-outline"} size={24} color={palette.muted} /><AppText weight="semibold" style={{ fontSize: 12 }}>{halalMode && favorites.length ? t(language, "halalEmptyTitle") : t(language, "noFavorites")}</AppText><AppText style={{ color: palette.muted, fontSize: 10, textAlign: "center" }}>{halalMode && favorites.length ? t(language, "halalEmptyBody") : t(language, "emptyFavoritesHint")}</AppText>{halalMode && favorites.length ? <SecondaryButton title={t(language, "turnOffHalalMode")} icon="shield-off-outline" onPress={() => setHalalMode(false)} style={{ alignSelf: "stretch", marginTop: 3 }} /> : null}</View>}
        </Card>
      </View>
      <AppText style={{ color: palette.muted, textAlign: "center", fontSize: 10 }}>{filterProductsByHalal(products, halalMode).length} {t(language, "resultCount")} · {t(language, "demoNote")}</AppText>
    </Screen>
  );
}
