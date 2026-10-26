import { useEffect, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, Platform, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, Pill, PrimaryButton, ProductRow, Screen, SecondaryButton, fontFamily, usePalette } from "@/components/nutriscan-ui";
import { filterProductsByHalal, isHalalEligible, productByBarcode, products, t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

const normalizeBarcode = (value: string) => value.trim().replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit)));

export default function ScanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ barcode?: string }>();
  const { language, halalMode } = useNutriScan();
  const palette = usePalette();
  const [permission, requestPermission] = useCameraPermissions();
  const [barcode, setBarcode] = useState(typeof params.barcode === "string" ? params.barcode : "");
  const [notFoundCode, setNotFoundCode] = useState("");
  const [halalBlockedCode, setHalalBlockedCode] = useState("");
  const [permissionMessage, setPermissionMessage] = useState("");

  useEffect(() => {
    // The scanner route can be revisited with a new barcode while mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (typeof params.barcode === "string") setBarcode(params.barcode);
  }, [params.barcode]);

  const openCode = (raw: string) => {
    const code = normalizeBarcode(raw);
    if (!code) return;
    const product = productByBarcode(code);
    if (product) {
      if (halalMode && !isHalalEligible(product)) {
        setHalalBlockedCode(code);
        setNotFoundCode("");
        return;
      }
      router.replace({ pathname: "/product/[id]", params: { id: product.id } });
    } else {
      setBarcode(code);
      if (halalMode) {
        setHalalBlockedCode(code);
        setNotFoundCode("");
      } else {
        setNotFoundCode(code);
        setHalalBlockedCode("");
      }
    }
  };
  const openContribution = () => router.push({ pathname: "/(tabs)/contribute", params: { barcode: notFoundCode || normalizeBarcode(barcode) } });

  return (
    <Screen contentStyle={{ gap: 17 }}>
      <PageHeader title={t(language, "scannerTitle")} subtitle={t(language, "scannerHelp")} />
      {Platform.OS !== "web" && permission?.granted ? (
        <View style={{ height: 245, borderRadius: 22, overflow: "hidden", backgroundColor: "#18261D", borderWidth: 1, borderColor: palette.line }}>
          <CameraView style={{ flex: 1 }} facing="back" barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"] }} onBarcodeScanned={notFoundCode || halalBlockedCode ? undefined : ({ data }) => openCode(data)} />
          <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: "76%", height: 96, borderWidth: 2, borderColor: palette.amber, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.04)" }} />
            <AppText weight="semibold" style={{ position: "absolute", bottom: 17, color: palette.cameraText, fontSize: 11 }}>{language === "en" ? "Place barcode within the frame" : "বারকোডটি ফ্রেমের ভেতরে রাখুন"}</AppText>
          </View>
        </View>
      ) : (
        <Card style={{ alignItems: "center", paddingVertical: 22, backgroundColor: palette.brandMark }}>
          <View style={{ width: 68, height: 68, borderRadius: 24, backgroundColor: palette.card, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="barcode-scan" size={34} color={palette.green} /></View>
          <AppText weight="semibold" style={{ fontSize: 15, textAlign: "center" }}>{Platform.OS === "web" ? t(language, "cameraUnavailable") : permission?.granted === false ? t(language, "cameraPermission") : t(language, "scannerTitle")}</AppText>
          {Platform.OS !== "web" && permission?.granted === false ? <PrimaryButton title={language === "en" ? "Allow camera" : "ক্যামেরার অনুমতি দিন"} icon="camera-outline" onPress={async () => { const result = await requestPermission(); if (!result.granted) setPermissionMessage(language === "en" ? "Camera access was not granted. Manual lookup is still available." : "ক্যামেরার অনুমতি মেলেনি। বারকোড লিখে খুঁজতে পারেন।"); }} style={{ alignSelf: "stretch" }} /> : null}
          {permissionMessage ? <AppText style={{ color: palette.clay, fontSize: 11, textAlign: "center" }}>{permissionMessage}</AppText> : null}
        </Card>
      )}

      <Card style={{ gap: 10 }}>
        <AppText weight="semibold" style={{ fontSize: 13 }}>{t(language, "enterBarcode")}</AppText>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput value={barcode} onChangeText={(value) => { setBarcode(value); setNotFoundCode(""); setHalalBlockedCode(""); }} placeholder={t(language, "barcodePlaceholder")} placeholderTextColor={palette.muted} keyboardType="number-pad" onSubmitEditing={() => openCode(barcode)} accessibilityLabel={t(language, "enterBarcode")} style={{ flex: 1, minHeight: 48, borderRadius: 13, backgroundColor: palette.paper, borderWidth: 1, borderColor: palette.line, paddingHorizontal: 13, color: palette.ink, fontFamily: fontFamily(language), fontSize: 13 }} />
          <Pressable accessibilityRole="button" onPress={() => openCode(barcode)} style={{ paddingHorizontal: 15, borderRadius: 13, backgroundColor: palette.green, alignItems: "center", justifyContent: "center" }}><AppText weight="semibold" style={{ color: palette.white, fontSize: 12 }}>{t(language, "findProduct")}</AppText></Pressable>
        </View>
      </Card>

      {notFoundCode ? <Card style={{ borderColor: palette.line, backgroundColor: palette.claySoft }}>
        <Pill tone="clay">{t(language, "unknownBarcode")}</Pill>
        <AppText weight="semibold" style={{ fontSize: 15 }}>{notFoundCode}</AppText>
        <AppText style={{ color: palette.muted, fontSize: 12, lineHeight: 18 }}>{t(language, "unknownBarcodeBody")}</AppText>
        <PrimaryButton title={t(language, "sendForReview")} icon="camera-plus-outline" onPress={openContribution} />
      </Card> : null}

      {halalBlockedCode ? <Card style={{ borderColor: palette.line, backgroundColor: palette.amberSoft, gap: 9 }}>
        <Pill tone="amber">{t(language, "halalBlockedTitle")}</Pill>
        <AppText weight="semibold" style={{ fontSize: 15 }}>{halalBlockedCode}</AppText>
        <AppText style={{ color: palette.muted, fontSize: 12, lineHeight: 18 }}>{t(language, "halalBlockedBody")}</AppText>
        <SecondaryButton title={t(language, "turnOffHalalMode")} icon="shield-off-outline" onPress={() => router.push("/(tabs)/more")} />
      </Card> : null}

      <View style={{ gap: 10 }}>
        <AppText weight="semibold" style={{ fontSize: 14 }}>{t(language, "chooseDemo")}</AppText>
        <Card style={{ paddingHorizontal: 13, paddingVertical: 2, gap: 0 }}>
          {filterProductsByHalal(products, halalMode).length ? filterProductsByHalal(products, halalMode).map((product, index) => <View key={product.id}>{index ? <View style={{ height: 1, backgroundColor: palette.line }} /> : null}<ProductRow product={product} onPress={() => openCode(product.barcode)} aside={<MaterialCommunityIcons name="chevron-right" size={19} color={palette.muted} />} /></View>) : <View style={{ alignItems: "center", paddingVertical: 22, gap: 7 }}><MaterialCommunityIcons name="shield-off-outline" size={25} color={palette.muted} /><AppText weight="semibold" style={{ fontSize: 12 }}>{t(language, "halalEmptyTitle")}</AppText><AppText style={{ color: palette.muted, fontSize: 10, textAlign: "center" }}>{t(language, "halalEmptyBody")}</AppText></View>}
        </Card>
      </View>
      <DemoNotice>{language === "en" ? "This scanner matches the prototype catalog only. An unmatched code is not a safety judgment." : "এই স্ক্যানার শুধু প্রোটোটাইপ ক্যাটালগে খোঁজে। কোনো কোড না মিললে তা পণ্যের নিরাপত্তা সম্পর্কে কিছু বলে না।"}</DemoNotice>
      <SecondaryButton title={language === "en" ? "Back to NutriScan" : "নিউট্রিস্ক্যানে ফিরুন"} icon="arrow-left" onPress={() => router.back()} />
    </Screen>
  );
}
