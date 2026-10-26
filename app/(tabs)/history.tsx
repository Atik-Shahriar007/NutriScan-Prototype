import { useState } from "react";
import { useRouter } from "expo-router";
import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, ProductRow, PrimaryButton, Screen, SecondaryButton, usePalette } from "@/components/nutriscan-ui";
import { isHalalEligible, productById, t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

export default function HistoryScreen() {
  const router = useRouter();
  const { language, history, halalMode, clearHistory } = useNutriScan();
  const palette = usePalette();
  const [confirmClear, setConfirmClear] = useState(false);
  const entries = history.map((entry) => ({ entry, product: productById(entry.productId) })).filter((item) => item.product && (!halalMode || isHalalEligible(item.product)));
  const dateLabel = (date: string) => {
    try { return new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-BD", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date)); }
    catch { return date; }
  };
  return (
    <Screen contentStyle={{ gap: 18 }}>
      <PageHeader title={t(language, "history")} subtitle={language === "en" ? "Revisit a product and the exact demo record you opened." : "আগে দেখা পণ্য ও সেই ডেমো রেকর্ড আবার খুলুন।"} />
      <DemoNotice>{language === "en" ? "History is stored on this device for the prototype; it is not synced to an account." : "প্রোটোটাইপে ইতিহাস এই ডিভাইসে সংরক্ষিত; কোনো অ্যাকাউন্টে সিঙ্ক হয় না।"}</DemoNotice>
      {entries.length > 0 ? (
        <View style={{ gap: 12 }}>
          <SecondaryButton title={t(language, "clearHistory")} icon="delete-outline" onPress={() => setConfirmClear(true)} style={{ alignSelf: "flex-end", minHeight: 38, paddingHorizontal: 12 }} />
          {confirmClear ? <Card style={{ gap: 10, backgroundColor: palette.claySoft, borderColor: palette.line }}>
            <AppText weight="semibold" style={{ fontSize: 13 }}>{language === "en" ? "Clear all scan history?" : "সব স্ক্যানের ইতিহাস মুছবেন?"}</AppText>
            <AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 16 }}>{language === "en" ? "This removes the saved history from this device only." : "এতে শুধু এই ডিভাইসে সংরক্ষিত ইতিহাস মুছে যাবে।"}</AppText>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <PrimaryButton title={language === "en" ? "Clear history" : "ইতিহাস মুছুন"} icon="delete-outline" onPress={() => { clearHistory(); setConfirmClear(false); }} style={{ flex: 1, minHeight: 42, backgroundColor: palette.clay }} />
              <SecondaryButton title={language === "en" ? "Cancel" : "বাতিল"} onPress={() => setConfirmClear(false)} style={{ flex: 1, minHeight: 42 }} />
            </View>
          </Card> : null}
          <Card style={{ paddingHorizontal: 14, paddingVertical: 2, gap: 0 }}>
            {entries.map(({ entry, product }, index) => product ? <View key={`${entry.productId}-${entry.scannedAt}`}>
              {index ? <View style={{ height: 1, backgroundColor: palette.line }} /> : null}
              <ProductRow product={product} onPress={() => router.push({ pathname: "/product/[id]", params: { id: product.id } })} aside={<View style={{ alignItems: "flex-end", gap: 4 }}><MaterialCommunityIcons name="chevron-right" size={18} color={palette.muted} /><AppText style={{ fontSize: 9, color: palette.muted }}>{dateLabel(entry.scannedAt)}</AppText></View>} />
            </View> : null)}
          </Card>
        </View>
      ) : halalMode && history.length > 0 ? (
        <Card style={{ alignItems: "center", paddingVertical: 28, gap: 8 }}>
          <MaterialCommunityIcons name="shield-off-outline" size={30} color={palette.muted} />
          <AppText weight="semibold" style={{ fontSize: 14, textAlign: "center" }}>{t(language, "halalEmptyTitle")}</AppText>
          <AppText style={{ color: palette.muted, fontSize: 11, textAlign: "center", lineHeight: 17 }}>{t(language, "halalEmptyBody")}</AppText>
          <SecondaryButton title={t(language, "turnOffHalalMode")} onPress={() => router.push("/(tabs)/more")} style={{ minHeight: 40 }} />
        </Card>
      ) : (
        <Card style={{ alignItems: "center", paddingVertical: 28 }}>
          <View style={{ width: 54, height: 54, borderRadius: 20, backgroundColor: palette.greenSoft, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="history" size={26} color={palette.green} /></View>
          <AppText weight="semibold" style={{ fontSize: 16, textAlign: "center" }}>{t(language, "emptyHistory")}</AppText>
          <AppText style={{ color: palette.muted, fontSize: 12, textAlign: "center", lineHeight: 19 }}>{t(language, "emptyHistoryBody")}</AppText>
        </Card>
      )}
    </Screen>
  );
}
