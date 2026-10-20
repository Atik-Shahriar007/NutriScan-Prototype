import { useEffect, useMemo, useState } from "react";
import { Image, Platform, Pressable, Switch, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, Pill, PrimaryButton, Screen, SectionHeading, fontFamily, palette } from "@/components/nutriscan-ui";
import { categoryLabel, t } from "@/lib/nutriscan-data";
import type { Category } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";
import { trpc } from "@/lib/trpc";

type Photo = { uri: string; base64: string; mimeType: string };
const categories: Category[] = ["food", "personalCare", "household"];

export default function ContributeScreen() {
  const params = useLocalSearchParams<{ barcode?: string }>();
  const { language, contributorKey, submissions, addSubmission } = useNutriScan();
  const utils = trpc.useUtils();
  const mineQuery = trpc.contributions.mine.useQuery({ contributorKey }, { retry: false });
  const submitMutation = trpc.contributions.submit.useMutation();
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [barcode, setBarcode] = useState(typeof params.barcode === "string" ? params.barcode : "");
  const [category, setCategory] = useState<Category>("food");
  const [displayName, setDisplayName] = useState("");
  const [publicLeaderboard, setPublicLeaderboard] = useState(false);
  const [frontPhoto, setFrontPhoto] = useState<Photo>();
  const [backPhoto, setBackPhoto] = useState<Photo>();
  const [notice, setNotice] = useState("");

  useEffect(() => { if (typeof params.barcode === "string") setBarcode(params.barcode); }, [params.barcode]);

  const addPhoto = async (side: "front" | "back") => {
    try {
      const result = Platform.OS === "web"
        ? await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8, base64: true })
        : await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 0.8, base64: true });
      const asset = !result.canceled ? result.assets[0] : undefined;
      if (!asset?.uri) return;
      const photo = { uri: asset.uri, base64: asset.base64 ?? "", mimeType: asset.mimeType ?? "image/jpeg" };
      if (side === "front") setFrontPhoto(photo);
      else setBackPhoto(photo);
      if (!photo.base64) setNotice(language === "en" ? "The image preview is ready, but this device did not provide upload data. Try another photo if submission fails." : "ছবির প্রিভিউ প্রস্তুত, কিন্তু ডিভাইস আপলোড ডেটা দেয়নি। জমা না হলে আবার ছবি তুলুন।");
      else setNotice("");
    } catch {
      setNotice(language === "en" ? "Photo access is unavailable here. You can still explore the form." : "এখানে ছবির সুবিধা পাওয়া যাচ্ছে না। ফর্মটি দেখতে পারেন।");
    }
  };

  const submit = async () => {
    const cleanName = name.trim();
    if (!cleanName || !frontPhoto?.base64 || !backPhoto?.base64) return;
    setNotice(language === "en" ? "Uploading photos and sending for review…" : "ছবি আপলোড করে পর্যালোচনার জন্য পাঠানো হচ্ছে…");
    try {
      await submitMutation.mutateAsync({
        contributorKey,
        displayName: displayName.trim() || undefined,
        publicLeaderboard,
        productName: cleanName,
        brand: brand.trim() || undefined,
        barcode: barcode.trim() || undefined,
        category,
        frontImage: { base64: frontPhoto.base64, mimeType: frontPhoto.mimeType },
        backImage: { base64: backPhoto.base64, mimeType: backPhoto.mimeType },
      });
      await utils.contributions.mine.invalidate({ contributorKey });
      setNotice(t(language, "submissionSuccess"));
    } catch {
      addSubmission({ name: cleanName, brand: brand.trim(), barcode: barcode.trim(), category, frontPhotoUri: frontPhoto.uri, backPhotoUri: backPhoto.uri });
      setNotice(language === "en" ? "Saved on this device. It will sync when the review service is available." : "এই ডিভাইসে সংরক্ষিত হয়েছে। পর্যালোচনা সেবা চালু হলে সিঙ্ক হবে।");
    }
    setName("");
    setBrand("");
    setFrontPhoto(undefined);
    setBackPhoto(undefined);
  };

  const visibleSubmissions = useMemo(() => {
    if (mineQuery.data?.length) {
      return mineQuery.data.map((item) => ({
        id: item.id,
        name: item.productName,
        brand: item.brand,
        barcode: item.barcode,
        category: item.category,
        createdAt: item.createdAt,
        status: item.status,
        reviewNote: item.reviewNote,
        pointsAwarded: item.pointsAwarded,
        frontImageUrl: item.frontImageUrl,
        backImageUrl: item.backImageUrl,
        frontPhotoUri: item.frontImageUrl,
        backPhotoUri: item.backImageUrl,
      }));
    }
    return submissions;
  }, [mineQuery.data, submissions]);
  const canSubmit = Boolean(name.trim() && frontPhoto?.base64 && backPhoto?.base64 && !submitMutation.isPending);
  const fieldStyle = { minHeight: 46, borderRadius: 13, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.card, paddingHorizontal: 13, color: palette.ink, fontFamily: fontFamily(language), fontSize: 12 } as const;

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader title={t(language, "contribute")} subtitle={t(language, "contributeTitle")} />
      <AppText style={{ color: palette.muted, fontSize: 12, lineHeight: 19 }}>{t(language, "contributeBody")}</AppText>
      <DemoNotice>{language === "en" ? "Photos are uploaded to the review queue. A submission is never published as verified without review." : "ছবি পর্যালোচনা কিউতে আপলোড হয়। পর্যালোচনা ছাড়া কোনো তথ্য যাচাইকৃত হিসেবে প্রকাশ করা হয় না।"}</DemoNotice>
      <View style={{ gap: 10 }}>
        <SectionHeading title={t(language, "frontPhoto")} />
        <PhotoSlot label={t(language, "frontPhoto")} uri={frontPhoto?.uri} onPress={() => addPhoto("front")} action={t(language, "addPhoto")} />
        <SectionHeading title={t(language, "backPhoto")} />
        <PhotoSlot label={t(language, "backPhoto")} uri={backPhoto?.uri} onPress={() => addPhoto("back")} action={t(language, "addPhoto")} />
        <AppText style={{ color: palette.muted, fontSize: 10, lineHeight: 16 }}>{t(language, "uploadHint")}</AppText>
      </View>
      <Card style={{ gap: 11 }}>
        <Field label={t(language, "productName")} value={name} onChangeText={setName} placeholder={language === "en" ? "e.g. product name on pack" : "যেমন প্যাকেটের পণ্যের নাম"} fieldStyle={fieldStyle} />
        <Field label={t(language, "brandName")} value={brand} onChangeText={setBrand} placeholder={language === "en" ? "Brand / maker, if known" : "ব্র্যান্ড / প্রস্তুতকারক, জানা থাকলে"} fieldStyle={fieldStyle} />
        <Field label={t(language, "barcode")} value={barcode} onChangeText={setBarcode} placeholder={t(language, "barcodePlaceholder")} fieldStyle={fieldStyle} keyboardType="number-pad" />
        <AppText weight="semibold" style={{ fontSize: 12 }}>{t(language, "category")}</AppText>
        <View style={{ flexDirection: "row", gap: 7 }}>
          {categories.map((item) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: item === category }} onPress={() => setCategory(item)} style={{ flex: 1, minHeight: 39, borderRadius: 12, borderWidth: 1, borderColor: item === category ? palette.green : palette.line, backgroundColor: item === category ? palette.green : palette.paper, alignItems: "center", justifyContent: "center", paddingHorizontal: 4 }}><AppText weight="semibold" numberOfLines={1} style={{ color: item === category ? palette.white : palette.ink, fontSize: 9 }}>{categoryLabel(item, language)}</AppText></Pressable>)}
        </View>
        <Field label={language === "en" ? "Public display name (optional)" : "সবার জন্য নাম (ঐচ্ছিক)"} value={displayName} onChangeText={setDisplayName} placeholder={language === "en" ? "Shown only if you opt in" : "শুধু অনুমতি দিলে দেখা যাবে"} fieldStyle={fieldStyle} />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Switch value={publicLeaderboard} onValueChange={setPublicLeaderboard} trackColor={{ false: palette.line, true: palette.greenSoft }} thumbColor={publicLeaderboard ? palette.green : palette.muted} />
          <AppText style={{ flex: 1, color: palette.muted, fontSize: 11, lineHeight: 16 }}>{language === "en" ? "Show my display name on the contributor leaderboard" : "অবদানকারী লিডারবোর্ডে আমার নাম দেখান"}</AppText>
        </View>
        <PrimaryButton title={submitMutation.isPending ? (language === "en" ? "Uploading…" : "আপলোড হচ্ছে…") : t(language, "submitReview")} icon="send-outline" onPress={() => void submit()} disabled={!canSubmit} />
        <AppText style={{ color: palette.muted, fontSize: 10, textAlign: "center" }}>{t(language, "pointsAfterReview")}</AppText>
      </Card>
      {notice ? <View style={{ flexDirection: "row", gap: 8, alignItems: "center", backgroundColor: palette.greenSoft, borderRadius: 13, padding: 12 }}><MaterialCommunityIcons name="check-circle-outline" size={18} color={palette.green} /><AppText style={{ flex: 1, color: palette.green, fontSize: 11 }}>{notice}</AppText></View> : null}
      <View style={{ gap: 8 }}>
        <SectionHeading title={t(language, "mySubmissions")} />
        {visibleSubmissions.length ? visibleSubmissions.map((submission) => <Card key={submission.id} style={{ flexDirection: "row", gap: 11, alignItems: "center" }}>
          <View style={{ width: 48, height: 48, borderRadius: 13, backgroundColor: palette.paper, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>{submission.frontImageUrl || submission.frontPhotoUri ? <Image source={{ uri: submission.frontImageUrl || submission.frontPhotoUri }} resizeMode="cover" style={{ width: 48, height: 48 }} /> : <MaterialCommunityIcons name="package-variant-closed" size={23} color={palette.green} />}</View>
          <View style={{ flex: 1, gap: 4 }}><AppText weight="semibold" style={{ fontSize: 12 }}>{submission.name}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{submission.brand || categoryLabel(submission.category, language)}</AppText></View>
          <Pill tone={submission.status === "accepted" ? "green" : submission.status === "rejected" ? "clay" : "amber"}>{statusLabel(submission.status, language)}</Pill>
        </Card>) : <Card><AppText style={{ color: palette.muted, fontSize: 12 }}>{t(language, "noSubmissions")}</AppText></Card>}
      </View>
    </Screen>
  );
}

function statusLabel(status: string, language: "en" | "bn") {
  if (status === "accepted") return language === "en" ? "Accepted" : "গৃহীত";
  if (status === "rejected") return language === "en" ? "Not accepted" : "গৃহীত নয়";
  if (status === "needs-clearer-photo") return language === "en" ? "Clearer photo needed" : "পরিষ্কার ছবি দরকার";
  return language === "en" ? "Under review" : "পর্যালোচনাধীন";
}

function Field({ label, value, onChangeText, placeholder, fieldStyle, keyboardType }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; fieldStyle: object; keyboardType?: "default" | "number-pad" }) {
  return <View style={{ gap: 5 }}><AppText weight="semibold" style={{ fontSize: 11 }}>{label}</AppText><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={palette.muted} keyboardType={keyboardType} style={fieldStyle} /></View>;
}

function PhotoSlot({ label, uri, onPress, action }: { label: string; uri?: string; onPress: () => void; action: string }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={`${action}: ${label}`} onPress={onPress} style={{ minHeight: 122, borderRadius: 17, borderWidth: 1, borderStyle: "dashed", borderColor: uri ? palette.green : "#CFC8B8", backgroundColor: uri ? palette.greenSoft : palette.card, alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
    {uri ? <><Image source={{ uri }} resizeMode="cover" style={{ width: "100%", height: 150 }} /><View style={{ position: "absolute", bottom: 8, right: 8, backgroundColor: palette.card, paddingHorizontal: 9, paddingVertical: 6, borderRadius: 11 }}><AppText weight="semibold" style={{ color: palette.green, fontSize: 10 }}>{action}</AppText></View></> : <><MaterialCommunityIcons name="image-plus-outline" size={25} color={palette.green} /><AppText weight="semibold" style={{ fontSize: 12, marginTop: 7 }}>{action}</AppText><AppText style={{ fontSize: 10, color: palette.muted, marginTop: 2 }}>{label}</AppText></>}
  </Pressable>;
}
