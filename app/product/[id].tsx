import { useRouter, useLocalSearchParams } from "expo-router";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, Pill, PrimaryButton, Screen, SecondaryButton, palette } from "@/components/nutriscan-ui";
import { categoryLabel, productById, productName, productBrand, t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";
import { trpc } from "@/lib/trpc";

export default function ProductDetailScreen() {
  const router = useRouter();
  const { id, historyId } = useLocalSearchParams<{ id: string; historyId?: string }>();
  const { language, history } = useNutriScan();
  const historyEntry = typeof historyId === "string" ? history.find((entry) => entry.id === historyId) : undefined;
  const productId = typeof id === "string" ? id : "unknown";
  const productQuery = trpc.catalog.byId.useQuery({ id: productId }, { enabled: productId !== "unknown", retry: false, staleTime: 60_000 });
  const product = historyEntry?.productSnapshot ?? productQuery.data ?? productById(typeof id === "string" ? id : undefined);
  if (!product) return <Screen><PageHeader title={t(language, "productNotFound")} /><SecondaryButton title={language === "en" ? "Back" : "ফিরে যান"} onPress={() => router.back()} /></Screen>;

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <Pressable accessibilityRole="button" accessibilityLabel={language === "en" ? "Go back" : "ফিরে যান"} onPress={() => router.back()} style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="arrow-left" size={20} color={palette.ink} /></Pressable>
        <View style={{ flex: 1 }}><AppText weight="semibold" style={{ fontSize: 13 }}>{t(language, "productDetails")}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{categoryLabel(product.category, language)}</AppText>{historyEntry ? <AppText style={{ color: palette.muted, fontSize: 9 }}>{language === "en" ? `Scanned ${dateLabel(historyEntry.scannedAt, language)}` : `স্ক্যান: ${dateLabel(historyEntry.scannedAt, language)}`}</AppText> : null}</View>
        <Pill tone={historyEntry ? "neutral" : "amber"}>{historyEntry ? (language === "en" ? "From history" : "ইতিহাস থেকে") : t(language, "sample")}</Pill>
      </View>
      <View style={{ gap: 7 }}>
        <AppText weight="bold" style={{ fontSize: 25, lineHeight: 34 }}>{productName(product, language)}</AppText>
        <AppText style={{ fontSize: 12, color: palette.muted }}>{productBrand(product, language)} · {product.size[language]}</AppText>
        <AppText style={{ fontSize: 12, color: palette.muted, lineHeight: 18 }}>{product.description[language]}</AppText>
      </View>

      {product.category === "food" && product.score !== undefined ? <Card style={{ backgroundColor: palette.green, borderColor: palette.green, padding: 17 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ gap: 5 }}><AppText style={{ color: "#E4EDE6", fontSize: 11 }}>{t(language, "grade")}</AppText><AppText weight="bold" style={{ color: palette.white, fontSize: 43, lineHeight: 51 }}>{product.score}<AppText weight="medium" style={{ color: "#DBE8DE", fontSize: 15 }}> / 100</AppText></AppText></View>
          <View style={{ padding: 10, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.14)" }}><MaterialCommunityIcons name="chart-donut-variant" size={23} color={palette.amber} /></View>
        </View>
        <Pill tone="amber">{product.gradeLabel?.[language]}</Pill>
        <AppText style={{ color: "#DCE9E0", fontSize: 10 }}>{language === "en" ? "Illustrative output · local method not finalized" : "শুধু উদাহরণ · স্থানীয় পদ্ধতি চূড়ান্ত নয়"}</AppText>
      </Card> : <Card style={{ backgroundColor: product.category === "personalCare" ? palette.amberSoft : palette.greenSoft, borderColor: product.category === "personalCare" ? "#E9D8B1" : "#D5E4D7" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}><MaterialCommunityIcons name={product.category === "personalCare" ? "bottle-tonic-outline" : "spray-bottle"} size={23} color={palette.green} /><View style={{ flex: 1, gap: 3 }}><AppText weight="semibold" style={{ fontSize: 15 }}>{product.gradeLabel?.[language]}</AppText><AppText style={{ color: palette.muted, fontSize: 11 }}>{language === "en" ? "Category-specific evidence; no universal health score." : "পণ্য-ধরন অনুযায়ী তথ্য; কোনো সার্বজনীন স্বাস্থ্য-স্কোর নয়।"}</AppText></View></View>
      </Card>}

      <View style={{ gap: 10 }}>
        <AppText weight="semibold" style={{ fontSize: 15 }}>{product.category === "food" ? t(language, "method") : t(language, "viewAssessment")}</AppText>
        {product.category === "food" ? <DemoNotice>{t(language, "methodNote")}</DemoNotice> : <DemoNotice>{language === "en" ? "This category uses its own evidence checklist in the concept. No numeric rating is assigned in this demo." : "এই ধরনে আলাদা তথ্য-যাচাই তালিকা ব্যবহার করা হবে। এই ডেমোতে কোনো সংখ্যাগত রেটিং দেওয়া হয়নি।"}</DemoNotice>}
        <Card style={{ gap: 12 }}>
          {product.factors.map((factor) => <View key={factor.label.en} style={{ gap: 5 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><AppText weight="semibold" style={{ flex: 1, fontSize: 12 }}>{factor.label[language]}</AppText>{factor.weight ? <Pill tone="neutral">{language === "en" ? `${factor.weight} sample weight` : `${factor.weight} নমুনা ওজন`}</Pill> : null}</View>
            {factor.value !== null ? <View style={{ height: 7, borderRadius: 9, backgroundColor: palette.paper, overflow: "hidden" }}><View style={{ height: 7, width: `${factor.value}%`, borderRadius: 9, backgroundColor: palette.green }} /></View> : null}
            <AppText style={{ color: palette.muted, fontSize: 10 }}>{factor.value !== null ? `${factor.value} / 100 · ` : ""}{factor.note[language]}</AppText>
          </View>)}
        </Card>
      </View>

      <View style={{ gap: 9 }}>
        <AppText weight="semibold" style={{ fontSize: 15 }}>{t(language, "ingredients")}</AppText>
        <Card style={{ paddingVertical: 4, gap: 0 }}>
          {product.ingredients.map((ingredient, index) => <View key={ingredient.en} style={{ flexDirection: "row", alignItems: "flex-start", gap: 9, paddingVertical: 11, borderBottomWidth: index === product.ingredients.length - 1 ? 0 : 1, borderBottomColor: palette.line }}>
            <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: palette.amber, marginTop: 5 }} />
            <View style={{ flex: 1, gap: 4 }}>
              <AppText style={{ fontSize: 12 }}>{ingredient[language]}</AppText>
              {product.ingredientExplanations?.[index] ? <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 16 }}>{product.ingredientExplanations[index][language]}</AppText> : null}
            </View>
          </View>)}
        </Card>
      </View>

      <View style={{ gap: 9 }}>
        <AppText weight="semibold" style={{ fontSize: 15 }}>{t(language, "source")}</AppText>
        <Card style={{ paddingVertical: 3, gap: 0 }}>
          {product.evidence.map((item, index) => <View key={item.label.en} style={{ flexDirection: "row", alignItems: "flex-start", gap: 10, paddingVertical: 11, borderBottomWidth: index === product.evidence.length - 1 ? 0 : 1, borderBottomColor: palette.line }}>
            <MaterialCommunityIcons name={item.status === "demo" ? "file-document-outline" : "help-circle-outline"} size={17} color={item.status === "demo" ? palette.green : "#805915"} />
            <View style={{ flex: 1, gap: 3 }}><AppText weight="semibold" style={{ fontSize: 11 }}>{item.label[language]}</AppText><AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 16 }}>{item.value[language]}</AppText></View>
            <Pill tone={item.status === "demo" ? "amber" : "neutral"}>{item.status === "demo" ? t(language, "sample") : t(language, "unknown")}</Pill>
          </View>)}
        </Card>
      </View>
      <DemoNotice>{t(language, "limitationText")}</DemoNotice>
      <PrimaryButton title={t(language, "openScanner")} icon="barcode-scan" onPress={() => router.push("/scan")} />
    </Screen>
  );
}

function dateLabel(date: string, language: "en" | "bn") {
  try { return new Intl.DateTimeFormat(language === "bn" ? "bn-BD" : "en-BD", { dateStyle: "medium", timeStyle: "short" }).format(new Date(date)); }
  catch { return date; }
}
