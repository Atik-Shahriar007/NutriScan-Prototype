import { useState } from "react";
import { Image, Platform, Pressable, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, Pill, PrimaryButton, Screen, SectionHeading, fontFamily, usePalette } from "@/components/nutriscan-ui";
import { categoryLabel, t } from "@/lib/nutriscan-data";
import type { Category } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

const categories: Category[] = ["food", "personalCare", "household"];

export default function ContributeScreen() {
  const params = useLocalSearchParams<{ barcode?: string }>();
  const { language, submissions, addSubmission } = useNutriScan();
  const palette = usePalette();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [barcode, setBarcode] = useState(typeof params.barcode === "string" ? params.barcode : "");
  const [category, setCategory] = useState<Category>("food");
  const [frontPhotoUri, setFrontPhotoUri] = useState<string>();
  const [backPhotoUri, setBackPhotoUri] = useState<string>();
  const [notice, setNotice] = useState("");

  const addPhoto = async (side: "front" | "back") => {
    try {
      let result: ImagePicker.ImagePickerResult;
      if (Platform.OS === "web") {
        result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8 });
      } else {
        result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8 });
        if (result.canceled) return;
      }
      if (!result.canceled && result.assets[0]?.uri) {
        if (side === "front") setFrontPhotoUri(result.assets[0].uri);
        else setBackPhotoUri(result.assets[0].uri);
      }
    } catch {
      setNotice(language === "en" ? "Photo access is unavailable here. You can still explore the form." : "এখানে ছবির সুবিধা পাওয়া যাচ্ছে না। ফর্মটি দেখতে পারেন।");
    }
  };

  const submit = () => {
    const cleanName = name.trim();
    if (!cleanName || !frontPhotoUri || !backPhotoUri) return;
    addSubmission({ name: cleanName, brand: brand.trim(), barcode: barcode.trim(), category, frontPhotoUri, backPhotoUri });
    setNotice(t(language, "submissionSuccess"));
    setName("");
    setBrand("");
    setFrontPhotoUri(undefined);
    setBackPhotoUri(undefined);
  };
  const canSubmit = Boolean(name.trim() && frontPhotoUri && backPhotoUri);
  const fieldStyle = { minHeight: 46, borderRadius: 13, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.card, paddingHorizontal: 13, color: palette.ink, fontFamily: fontFamily(language), fontSize: 12 } as const;

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader title={t(language, "contribute")} subtitle={t(language, "contributeTitle")} />
      <AppText style={{ color: palette.muted, fontSize: 12, lineHeight: 19 }}>{t(language, "contributeBody")}</AppText>
      <DemoNotice>{t(language, "localDemoSubmission")}</DemoNotice>
      <View style={{ gap: 10 }}>
        <SectionHeading title={t(language, "frontPhoto")} />
        <PhotoSlot language={language} label={t(language, "frontPhoto")} uri={frontPhotoUri} onPress={() => addPhoto("front")} action={t(language, "addPhoto")} />
        <SectionHeading title={t(language, "backPhoto")} />
        <PhotoSlot language={language} label={t(language, "backPhoto")} uri={backPhotoUri} onPress={() => addPhoto("back")} action={t(language, "addPhoto")} />
        <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 16 }}>{t(language, "uploadHint")}</AppText>
      </View>
      <Card style={{ gap: 11 }}>
        <Field label={t(language, "productName")} value={name} onChangeText={setName} placeholder={language === "en" ? "e.g. product name on pack" : "যেমন প্যাকেটের পণ্যের নাম"} fieldStyle={fieldStyle} />
        <Field label={t(language, "brandName")} value={brand} onChangeText={setBrand} placeholder={language === "en" ? "Brand / maker, if known" : "ব্র্যান্ড / প্রস্তুতকারক, জানা থাকলে"} fieldStyle={fieldStyle} />
        <Field label={t(language, "barcode")} value={barcode} onChangeText={setBarcode} placeholder={t(language, "barcodePlaceholder")} fieldStyle={fieldStyle} keyboardType="number-pad" />
        <AppText weight="semibold" style={{ fontSize: 12 }}>{t(language, "category")}</AppText>
        <View style={{ flexDirection: "row", gap: 7 }}>
          {categories.map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityLabel={categoryLabel(item, language)} accessibilityState={{ selected: item === category }} onPress={() => setCategory(item)} style={({ pressed }) => ({ flex: 1, minHeight: 44, borderRadius: 12, borderWidth: 1, borderColor: item === category ? palette.green : palette.line, backgroundColor: item === category ? palette.green : palette.paper, alignItems: "center", justifyContent: "center", paddingHorizontal: 5, opacity: pressed ? 0.78 : 1 })}><AppText weight="semibold" style={{ color: item === category ? palette.white : palette.ink, fontSize: 10, textAlign: "center" }}>{categoryLabel(item, language)}</AppText></Pressable>)}
        </View>
        <PrimaryButton title={t(language, "submitReview")} icon="send-outline" onPress={submit} disabled={!canSubmit} />
        {!canSubmit ? <AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 17, textAlign: "center" }}>{language === "en" ? "Add a product name and both package photos to save this draft." : "ড্রাফট সংরক্ষণ করতে পণ্যের নাম ও প্যাকেটের দুই পাশের ছবি যোগ করুন।"}</AppText> : null}
        <AppText style={{ color: palette.muted, fontSize: 10, textAlign: "center" }}>{t(language, "pointsAfterReview")}</AppText>
      </Card>
      {notice ? <View accessibilityLiveRegion="polite" style={{ flexDirection: "row", gap: 8, alignItems: "center", backgroundColor: palette.greenSoft, borderRadius: 13, padding: 12 }}><MaterialCommunityIcons name="check-circle-outline" size={18} color={palette.green} /><AppText style={{ flex: 1, color: palette.green, fontSize: 11 }}>{notice}</AppText></View> : null}
      <View style={{ gap: 8 }}>
        <SectionHeading title={t(language, "mySubmissions")} />
        {submissions.length ? submissions.map((submission) => <Card key={submission.id} style={{ flexDirection: "row", gap: 11, alignItems: "center" }}>
          <View style={{ width: 48, height: 48, borderRadius: 13, backgroundColor: palette.paper, alignItems: "center", justifyContent: "center", overflow: "hidden" }}><MaterialCommunityIcons name="package-variant-closed" size={23} color={palette.green} /></View>
          <View style={{ flex: 1, gap: 4 }}><AppText weight="semibold" style={{ fontSize: 12 }}>{submission.name}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{submission.brand || categoryLabel(submission.category, language)}</AppText></View>
          <Pill tone="amber">{t(language, "pendingReview")}</Pill>
        </Card>) : <Card><AppText style={{ color: palette.muted, fontSize: 12 }}>{t(language, "noSubmissions")}</AppText></Card>}
      </View>
    </Screen>
  );
}

function Field({ label, value, onChangeText, placeholder, fieldStyle, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; fieldStyle: object; keyboardType?: "default" | "number-pad" }) {
  const palette = usePalette();
  return <View style={{ gap: 5 }}><AppText weight="semibold" style={{ fontSize: 11 }}>{label}</AppText><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={palette.muted} keyboardType={keyboardType} accessibilityLabel={label} style={fieldStyle} /></View>;
}

function PhotoSlot({ language, label, uri, onPress, action }: { language: "en" | "bn"; label: string; uri?: string; onPress: () => void; action: string }) {
  const palette = usePalette();
  const hint = uri ? language === "en" ? "Tap to replace this photo" : "ছবিটি বদলাতে ট্যাপ করুন" : language === "en" ? "Tap to add a package photo" : "প্যাকেটের ছবি যোগ করতে ট্যাপ করুন";
  return <Pressable accessibilityRole="button" accessibilityLabel={`${action}: ${label}`} accessibilityHint={hint} onPress={onPress} style={({ pressed }) => ({ minHeight: 122, borderRadius: 17, borderWidth: 1, borderStyle: "dashed", borderColor: uri ? palette.green : palette.line, backgroundColor: uri ? palette.greenSoft : palette.card, alignItems: "center", justifyContent: "center", overflow: "hidden", opacity: pressed ? 0.82 : 1 })}>
    {uri ? <><Image source={{ uri }} resizeMode="cover" style={{ width: "100%", height: 150 }} /><View style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: palette.card, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 11 }}><AppText weight="semibold" style={{ color: palette.green, fontSize: 10 }}>{action}</AppText></View></> : <><MaterialCommunityIcons name="image-plus-outline" size={25} color={palette.green} /><AppText weight="semibold" style={{ fontSize: 12, marginTop: 7 }}>{action}</AppText><AppText style={{ fontSize: 10, color: palette.muted, marginTop: 2 }}>{label}</AppText></>}
  </Pressable>;
}
