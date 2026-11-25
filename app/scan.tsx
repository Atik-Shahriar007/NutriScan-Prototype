import { useEffect, useRef, useState } from "react";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ActivityIndicator, Animated, Modal, Pressable, Platform, TextInput, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, Pill, PrimaryButton, ProductRow, Screen, SecondaryButton, TabSwitcher, fontFamily, usePalette } from "@/components/nutriscan-ui";
import { filterProductsByHalal, isHalalEligible, productByBarcode, products, t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

const normalizeBarcode = (value: string) => value.trim().replace(/[০-৯]/g, (digit) => String("০১২৩৪৫৬৭৮৯".indexOf(digit)));

type OcrNutritionValues = {
  energy: string;
  totalFat: string;
  saturatedFat: string;
  sodium: string;
  totalCarb: string;
  sugars: string;
  protein: string;
};

const OCR_MOCKS: { label: string; values: OcrNutritionValues }[] = [
  {
    label: "Mango Drink (250 ml)",
    values: {
      energy: "92 kcal",
      totalFat: "0g",
      saturatedFat: "0g",
      sodium: "15mg",
      totalCarb: "23g",
      sugars: "22g",
      protein: "0g",
    },
  },
  {
    label: "Instant Noodles (75 g)",
    values: {
      energy: "285 kcal",
      totalFat: "11g",
      saturatedFat: "5g",
      sodium: "680mg",
      totalCarb: "38g",
      sugars: "2g",
      protein: "7g",
    },
  },
];

const parseMetricNumber = (raw: string) => {
  const match = raw.replace(",", ".").match(/\d+(\.\d+)?/);
  return match ? Number(match[0]) : 0;
};

const estimateNqss = (values: OcrNutritionValues) => {
  const sugars = parseMetricNumber(values.sugars);
  const sodium = parseMetricNumber(values.sodium);
  const satFat = parseMetricNumber(values.saturatedFat);
  const protein = parseMetricNumber(values.protein);
  const raw = Math.round(86 - sugars * 1.4 - sodium * 0.045 - satFat * 1.5 + protein * 0.8);
  return Math.max(15, Math.min(98, raw));
};

export default function ScanScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ barcode?: string }>();
  const { language, halalMode } = useNutriScan();
  const palette = usePalette();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanTab, setScanTab] = useState<"barcode" | "ocr">("barcode");
  const [barcode, setBarcode] = useState(typeof params.barcode === "string" ? params.barcode : "");
  const [notFoundCode, setNotFoundCode] = useState("");
  const [halalBlockedCode, setHalalBlockedCode] = useState("");
  const [permissionMessage, setPermissionMessage] = useState("");
  const [inputMessage, setInputMessage] = useState("");
  const [mockCameraEnabled, setMockCameraEnabled] = useState(false);
  const [scanBeam] = useState(() => new Animated.Value(0));

  const [ocrStatus, setOcrStatus] = useState<"idle" | "extracting" | "extracted">("idle");
  const [ocrMockIndex, setOcrMockIndex] = useState(0);
  const [ocrValues, setOcrValues] = useState<OcrNutritionValues>(OCR_MOCKS[0].values);
  const [nqssModalVisible, setNqssModalVisible] = useState(false);
  const extractTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (extractTimerRef.current) clearTimeout(extractTimerRef.current);
    };
  }, []);

  useEffect(() => {
    // The scanner route can be revisited with a new barcode while mounted.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (typeof params.barcode === "string") setBarcode(params.barcode);
  }, [params.barcode]);

  useEffect(() => {
    if (Platform.OS !== "web" || !mockCameraEnabled) return;
    const animation = Animated.loop(Animated.sequence([
      Animated.timing(scanBeam, { toValue: 1, duration: 950, useNativeDriver: true }),
      Animated.delay(500),
      Animated.timing(scanBeam, { toValue: 0, duration: 950, useNativeDriver: true }),
      Animated.delay(500),
    ]));
    animation.start();
    return () => animation.stop();
  }, [mockCameraEnabled, scanBeam]);

  const openCode = (raw: string) => {
    const code = normalizeBarcode(raw);
    if (!code) {
      setInputMessage(language === "en" ? "Enter the barcode digits from the package." : "প্যাকেটের বারকোডের অঙ্কগুলো লিখুন।");
      return;
    }
    setInputMessage("");
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

  const handleCaptureLabel = () => {
    if (extractTimerRef.current) clearTimeout(extractTimerRef.current);
    setOcrStatus("extracting");
    extractTimerRef.current = setTimeout(() => {
      const mock = OCR_MOCKS[ocrMockIndex % OCR_MOCKS.length];
      setOcrValues({ ...mock.values });
      setOcrStatus("extracted");
    }, 1500);
  };

  const handleResetOcr = () => {
    if (extractTimerRef.current) clearTimeout(extractTimerRef.current);
    setNqssModalVisible(false);
    setOcrStatus("idle");
    setOcrMockIndex((prev) => (prev + 1) % OCR_MOCKS.length);
  };

  const estimatedScore = estimateNqss(ocrValues);

  const ocrFieldDefs: { key: keyof OcrNutritionValues; label: string }[] = [
    { key: "energy", label: language === "en" ? "Energy" : "শক্তি" },
    { key: "totalFat", label: language === "en" ? "Total Fat" : "মোট চর্বি" },
    { key: "saturatedFat", label: language === "en" ? "Saturated Fat" : "সম্পৃক্ত চর্বি" },
    { key: "sodium", label: language === "en" ? "Sodium" : "সোডিয়াম" },
    { key: "totalCarb", label: language === "en" ? "Total Carb" : "মোট শর্করা" },
    { key: "sugars", label: language === "en" ? "Sugars" : "চিনি" },
    { key: "protein", label: language === "en" ? "Protein" : "প্রোটিন" },
  ];

  return (
    <Screen contentStyle={{ gap: 17 }}>
      <PageHeader title={t(language, "scannerTitle")} subtitle={t(language, "scannerHelp")} />
      <TabSwitcher
        tabs={[
          { key: "barcode", label: language === "en" ? "Barcode" : "বারকোড" },
          { key: "ocr", label: language === "en" ? "Nutrition Label" : "পুষ্টি তালিকা" },
        ]}
        activeKey={scanTab}
        onSelect={(key) => setScanTab(key as "barcode" | "ocr")}
      />

      {scanTab === "barcode" ? (
        <>
          {Platform.OS !== "web" && permission?.granted ? (
        <View style={{ height: 245, borderRadius: 22, overflow: "hidden", backgroundColor: "#18261D", borderWidth: 1, borderColor: palette.line }}>
          <CameraView style={{ flex: 1 }} facing="back" barcodeScannerSettings={{ barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e", "code128"] }} onBarcodeScanned={notFoundCode || halalBlockedCode ? undefined : ({ data }) => openCode(data)} />
          <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
            <View style={{ width: "76%", height: 96, borderWidth: 2, borderColor: palette.amber, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.04)" }} />
            <AppText weight="semibold" style={{ position: "absolute", bottom: 17, color: palette.cameraText, fontSize: 11 }}>{language === "en" ? "Place barcode within the frame" : "বারকোডটি ফ্রেমের ভেতরে রাখুন"}</AppText>
          </View>
        </View>
      ) : Platform.OS === "web" && mockCameraEnabled ? (
        <View style={{ gap: 10 }}>
          <View style={{ height: 245, borderRadius: 22, overflow: "hidden", backgroundColor: "#18261D", borderWidth: 1, borderColor: palette.green }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#20392B" }}>
              <MaterialCommunityIcons name="camera-wireless-outline" size={46} color="#B8E6C4" />
              <AppText style={{ color: "#DDF6E3", fontSize: 10, marginTop: 8 }}>{language === "en" ? "Mock camera preview" : "মক ক্যামেরা প্রিভিউ"}</AppText>
            </View>
            <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: "76%", height: 96, borderWidth: 2, borderColor: palette.amber, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.04)" }} />
              <Animated.View style={{ position: "absolute", width: "72%", height: 3, borderRadius: 2, backgroundColor: palette.amber, shadowColor: palette.amber, shadowOpacity: 0.95, shadowRadius: 8, transform: [{ translateY: scanBeam.interpolate({ inputRange: [0, 1], outputRange: [-42, 42] }) }] }} />
              <AppText weight="semibold" style={{ position: "absolute", bottom: 17, color: palette.cameraText, fontSize: 11 }}>{language === "en" ? "Mock scan beam is active" : "মক স্ক্যান বিম সক্রিয়"}</AppText>
            </View>
          </View>
          <PrimaryButton title={language === "en" ? "Simulate barcode scan" : "বারকোড স্ক্যান অনুকরণ করুন"} icon="barcode-scan" onPress={() => openCode(products[0].barcode)} />
          <SecondaryButton title={language === "en" ? "Exit mock camera" : "মক ক্যামেরা বন্ধ করুন"} icon="close" onPress={() => setMockCameraEnabled(false)} />
        </View>
      ) : (
        <Card style={{ alignItems: "center", paddingVertical: 22, backgroundColor: palette.brandMark }}>
          <View style={{ width: 68, height: 68, borderRadius: 24, backgroundColor: palette.card, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="barcode-scan" size={34} color={palette.green} /></View>
          <AppText weight="semibold" style={{ fontSize: 15, textAlign: "center" }}>{Platform.OS === "web" ? t(language, "cameraUnavailable") : permission?.granted === false ? t(language, "cameraPermission") : t(language, "scannerTitle")}</AppText>
          {Platform.OS === "web" ? <SecondaryButton title={language === "en" ? "Try mock camera" : "মক ক্যামেরা চালু করুন"} icon="camera-outline" onPress={() => setMockCameraEnabled(true)} style={{ alignSelf: "stretch" }} /> : null}
          {Platform.OS !== "web" && permission?.granted === false ? <PrimaryButton title={language === "en" ? "Allow camera" : "ক্যামেরার অনুমতি দিন"} icon="camera-outline" onPress={async () => { const result = await requestPermission(); if (!result.granted) setPermissionMessage(language === "en" ? "Camera access was not granted. Manual lookup is still available." : "ক্যামেরার অনুমতি মেলেনি। বারকোড লিখে খুঁজতে পারেন।"); }} style={{ alignSelf: "stretch" }} /> : null}
          {permissionMessage ? <AppText style={{ color: palette.clay, fontSize: 11, textAlign: "center" }}>{permissionMessage}</AppText> : null}
        </Card>
      )}

      <Card style={{ gap: 10 }}>
        <AppText weight="semibold" style={{ fontSize: 13 }}>{t(language, "enterBarcode")}</AppText>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TextInput value={barcode} onChangeText={(value) => { setBarcode(value); setNotFoundCode(""); setHalalBlockedCode(""); setInputMessage(""); }} placeholder={t(language, "barcodePlaceholder")} placeholderTextColor={palette.muted} keyboardType="number-pad" onSubmitEditing={() => openCode(barcode)} accessibilityLabel={t(language, "enterBarcode")} accessibilityHint={language === "en" ? "Enter digits from a product barcode" : "পণ্যের বারকোডের অঙ্ক লিখুন"} style={{ flex: 1, minHeight: 48, borderRadius: 13, backgroundColor: palette.paper, borderWidth: 1, borderColor: inputMessage ? palette.clay : palette.line, paddingHorizontal: 13, color: palette.ink, fontFamily: fontFamily(language), fontSize: 13 }} />
          <Pressable accessibilityRole="button" accessibilityLabel={t(language, "findProduct")} accessibilityHint={language === "en" ? "Search the prototype catalog" : "প্রোটোটাইপ ক্যাটালগে খুঁজুন"} onPress={() => openCode(barcode)} style={({ pressed }) => ({ minHeight: 48, paddingHorizontal: 15, borderRadius: 13, backgroundColor: palette.green, alignItems: "center", justifyContent: "center", opacity: pressed ? 0.82 : 1 })}><AppText weight="semibold" style={{ color: palette.white, fontSize: 12 }}>{t(language, "findProduct")}</AppText></Pressable>
        </View>
        {inputMessage ? <AppText accessibilityLiveRegion="polite" style={{ color: palette.clay, fontSize: 11, lineHeight: 16 }}>{inputMessage}</AppText> : null}
      </Card>

      {notFoundCode ? <Card style={{ borderColor: palette.line, backgroundColor: palette.claySoft }}>
        <Pill tone="clay">{t(language, "unknownBarcode")}</Pill>
        <AppText weight="semibold" style={{ fontSize: 15 }}>{notFoundCode}</AppText>
        <AppText style={{ color: palette.muted, fontSize: 12, lineHeight: 18 }}>{t(language, "unknownBarcodeBody")}</AppText>
        <PrimaryButton title={t(language, "sendForReview")} icon="camera-plus-outline" onPress={openContribution} />
        <SecondaryButton title={language === "en" ? "Try another barcode" : "অন্য বারকোড চেষ্টা করুন"} icon="refresh" onPress={() => { setBarcode(""); setNotFoundCode(""); }} />
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
        </>
      ) : (
        <>
          <View style={{ height: 225, borderRadius: 22, overflow: "hidden", backgroundColor: "#18261D", borderWidth: 1, borderColor: palette.green }}>
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#20392B", paddingHorizontal: 20 }}>
              <MaterialCommunityIcons name="table-eye" size={44} color="#B8E6C4" />
              <AppText style={{ color: "#DDF6E3", fontSize: 11, marginTop: 8, textAlign: "center" }}>
                {language === "en" ? "Simulated OCR label preview" : "সিমুলেটেড OCR লেবেল প্রিভিউ"}
              </AppText>
            </View>
            <View pointerEvents="none" style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: "80%", height: 110, borderWidth: 2, borderColor: palette.amber, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.04)" }} />
              <AppText weight="semibold" style={{ position: "absolute", bottom: 16, color: palette.cameraText, fontSize: 11, textAlign: "center", paddingHorizontal: 16 }}>
                {language === "en" ? "Point camera at the nutrition facts table" : "পুষ্টি তথ্যের টেবিলের দিকে ক্যামেরা ধরুন"}
              </AppText>
            </View>
          </View>

          {ocrStatus === "idle" ? (
            <PrimaryButton
              title={language === "en" ? "Capture Label" : "লেবেল ক্যাপচার করুন"}
              icon="camera-outline"
              onPress={handleCaptureLabel}
            />
          ) : null}

          {ocrStatus === "extracting" ? (
            <Card style={{ alignItems: "center", paddingVertical: 24, gap: 10 }}>
              <ActivityIndicator size="large" color={palette.green} />
              <AppText weight="semibold" style={{ fontSize: 14 }}>
                {language === "en" ? "Extracting..." : "তথ্য বের করা হচ্ছে..."}
              </AppText>
              <AppText style={{ color: palette.muted, fontSize: 11, textAlign: "center" }}>
                {language === "en" ? "Reading nutrition values from the table" : "টেবিল থেকে পুষ্টিমান পড়া হচ্ছে"}
              </AppText>
            </Card>
          ) : null}

          {ocrStatus === "extracted" ? (
            <Card style={{ gap: 12 }}>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                <AppText weight="bold" style={{ fontSize: 14 }}>
                  {language === "en" ? "Extracted Nutrition Values" : "প্রাপ্ত পুষ্টিমান"}
                </AppText>
                <Pill tone="green">{OCR_MOCKS[ocrMockIndex % OCR_MOCKS.length].label}</Pill>
              </View>
              <View style={{ gap: 10 }}>
                {ocrFieldDefs.map((field) => (
                  <View key={field.key} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <AppText weight="medium" style={{ flex: 1, fontSize: 12, color: palette.ink }}>{field.label}</AppText>
                    <TextInput
                      value={ocrValues[field.key]}
                      onChangeText={(text) => setOcrValues((prev) => ({ ...prev, [field.key]: text }))}
                      accessibilityLabel={field.label}
                      style={{
                        width: 120,
                        minHeight: 40,
                        borderRadius: 11,
                        backgroundColor: palette.paper,
                        borderWidth: 1,
                        borderColor: palette.line,
                        paddingHorizontal: 12,
                        color: palette.ink,
                        fontFamily: fontFamily(language),
                        fontSize: 12,
                        textAlign: "right",
                      }}
                    />
                  </View>
                ))}
              </View>
              <PrimaryButton
                title={language === "en" ? "Save & View Score" : "সংরক্ষণ ও স্কোর দেখুন"}
                icon="check-circle-outline"
                onPress={() => setNqssModalVisible(true)}
              />
              <SecondaryButton
                title={language === "en" ? "Scan Another" : "আরেকটি স্ক্যান করুন"}
                icon="refresh"
                onPress={handleResetOcr}
              />
            </Card>
          ) : null}

          <DemoNotice>
            {language === "en"
              ? "OCR extraction is simulated with sample nutrition tables for prototype demonstration."
              : "প্রোটোটাইপ প্রদর্শনের জন্য নমুনা পুষ্টি টেবিল ব্যবহার করে OCR অনুকরণ করা হয়েছে।"}
          </DemoNotice>
        </>
      )}

      <Modal
        visible={nqssModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setNqssModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.45)", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <Card style={{ width: "100%", maxWidth: 380, gap: 14, padding: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <MaterialCommunityIcons name="chart-donut" size={24} color={palette.green} />
              <AppText weight="bold" style={{ fontSize: 16, flex: 1 }}>
                {language === "en" ? "Estimated NQSS Score" : "আনুমানিক NQSS স্কোর"}
              </AppText>
            </View>
            <AppText style={{ fontSize: 13, lineHeight: 20, color: palette.ink }}>
              {language === "en"
                ? `Based on these values, estimated NQSS: ${estimatedScore}/100`
                : `এই মানগুলোর ভিত্তিতে আনুমানিক NQSS: ${estimatedScore}/১০০`}
            </AppText>
            <Pill tone={estimatedScore >= 75 ? "green" : estimatedScore >= 60 ? "amber" : "clay"}>
              {estimatedScore >= 75
                ? (language === "en" ? "Good nutrition balance" : "ভালো পুষ্টি ভারসাম্য")
                : estimatedScore >= 60
                  ? (language === "en" ? "Moderate — watch sugar/sodium" : "মাঝারি — চিনি/সোডিয়াম লক্ষ্য রাখুন")
                  : (language === "en" ? "Low — high sugar or sodium" : "কম — অতিরিক্ত চিনি বা সোডিয়াম")}
            </Pill>
            <PrimaryButton
              title={language === "en" ? "Scan Another" : "আরেকটি স্ক্যান করুন"}
              icon="refresh"
              onPress={handleResetOcr}
            />
            <SecondaryButton
              title={language === "en" ? "Close" : "বন্ধ করুন"}
              onPress={() => setNqssModalVisible(false)}
            />
          </Card>
        </View>
      </Modal>
      <SecondaryButton title={language === "en" ? "Back to NutriScan" : "নিউট্রিস্ক্যানে ফিরুন"} icon="arrow-left" onPress={() => router.back()} />
    </Screen>
  );
}
