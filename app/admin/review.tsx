import { useState } from "react";
import { Image, Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, Pill, Screen, SecondaryButton, palette, fontFamily } from "@/components/nutriscan-ui";
import { categoryLabel } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";
import { trpc } from "@/lib/trpc";

type ReviewStatus = "pending" | "needs-clearer-photo" | "accepted" | "rejected";

const statusLabels: Record<ReviewStatus, { en: string; bn: string }> = {
  pending: { en: "Pending", bn: "অপেক্ষমাণ" },
  "needs-clearer-photo": { en: "Clearer photos", bn: "পরিষ্কার ছবি" },
  accepted: { en: "Accepted", bn: "গৃহীত" },
  rejected: { en: "Rejected", bn: "প্রত্যাখ্যাত" },
};

export default function ContributionReviewScreen() {
  const router = useRouter();
  const { language } = useNutriScan();
  const [status, setStatus] = useState<ReviewStatus>("pending");
  const [activeId, setActiveId] = useState<string>();
  const [notes, setNotes] = useState<Record<string, string>>({});
  const reviewQuery = trpc.contributions.pending.useQuery({ status }, { retry: false });
  const utils = trpc.useUtils();
  const reviewMutation = trpc.contributions.review.useMutation();
  const fieldStyle = { minHeight: 42, borderRadius: 12, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.card, paddingHorizontal: 11, color: palette.ink, fontFamily: fontFamily(language), fontSize: 11 } as const;

  const review = async (id: string, nextStatus: "accepted" | "rejected" | "needs-clearer-photo") => {
    setActiveId(id);
    try {
      const fallback = nextStatus === "accepted" ? "Accepted for moderator enrichment; catalog record created as draft." : nextStatus === "rejected" ? "Contribution could not be accepted for the catalog." : "Please submit clearer front and back package photos.";
      await reviewMutation.mutateAsync({ id: Number(id), status: nextStatus, reviewNote: notes[id]?.trim() || fallback });
      await utils.contributions.pending.invalidate();
    } finally {
      setActiveId(undefined);
    }
  };

  return <Screen contentStyle={{ gap: 16 }}>
    <PageHeader title={language === "en" ? "Contribution review" : "অবদান পর্যালোচনা"} subtitle={language === "en" ? "Audit every state · accepted records stay as drafts until enriched and published." : "প্রতিটি অবস্থা যাচাই করুন · গৃহীত রেকর্ড বিস্তারিত যোগ ও প্রকাশ না হওয়া পর্যন্ত খসড়া থাকে।"} />
    <DemoNotice>{language === "en" ? "This screen is restricted by the server admin role. Review notes are stored with the decision, and approval never publishes a product directly." : "এই স্ক্রিন সার্ভারের অ্যাডমিন রোল দ্বারা সীমাবদ্ধ। সিদ্ধান্তের সঙ্গে পর্যালোচনা নোট সংরক্ষিত হয়, এবং অনুমোদন সরাসরি পণ্য প্রকাশ করে না।"}</DemoNotice>
    <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>{(Object.keys(statusLabels) as ReviewStatus[]).map((item) => <Pressable key={item} onPress={() => setStatus(item)} style={{ borderRadius: 12, borderWidth: 1, borderColor: status === item ? palette.green : palette.line, backgroundColor: status === item ? palette.greenSoft : palette.card, paddingHorizontal: 11, paddingVertical: 9 }}><AppText weight="semibold" style={{ color: status === item ? palette.green : palette.muted, fontSize: 10 }}>{statusLabels[item][language]}</AppText></Pressable>)}</View>
    {reviewQuery.isLoading ? <Card><AppText style={{ color: palette.muted, fontSize: 12 }}>{language === "en" ? "Loading review records…" : "পর্যালোচনা রেকর্ড লোড হচ্ছে…"}</AppText></Card> : reviewQuery.error ? <Card style={{ backgroundColor: palette.claySoft, borderColor: "#E6C5B7" }}><AppText weight="semibold" style={{ color: palette.clay, fontSize: 14 }}>{language === "en" ? "Admin access required" : "অ্যাডমিন অ্যাক্সেস প্রয়োজন"}</AppText><AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 17 }}>{language === "en" ? "Sign in with an account granted the admin role, then reload this screen." : "অ্যাডমিন রোল দেওয়া অ্যাকাউন্ট দিয়ে সাইন ইন করে আবার স্ক্রিনটি খুলুন।"}</AppText></Card> : reviewQuery.data?.length ? reviewQuery.data.map((item) => <Card key={item.id} style={{ gap: 11 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><View style={{ flex: 1, gap: 3 }}><AppText weight="semibold" style={{ fontSize: 15 }}>{item.productName}</AppText><AppText style={{ color: palette.muted, fontSize: 11 }}>{item.brand || (language === "en" ? "Brand not supplied" : "ব্র্যান্ড দেওয়া হয়নি")} · {categoryLabel(item.category, language)}</AppText></View><Pill tone={item.status === "accepted" ? "green" : item.status === "rejected" ? "clay" : item.status === "needs-clearer-photo" ? "amber" : "neutral"}>{statusLabels[item.status][language]}</Pill></View>
      <View style={{ flexDirection: "row", gap: 8 }}><Image source={{ uri: item.frontImageUrl }} resizeMode="cover" style={{ flex: 1, height: 150, borderRadius: 13, backgroundColor: palette.paper }} /><Image source={{ uri: item.backImageUrl }} resizeMode="cover" style={{ flex: 1, height: 150, borderRadius: 13, backgroundColor: palette.paper }} /></View>
      <AppText style={{ color: palette.muted, fontSize: 10 }}>{language === "en" ? `Barcode: ${item.barcode || "Not supplied"} · Submitted ${item.createdAt}` : `বারকোড: ${item.barcode || "দেওয়া হয়নি"} · জমা: ${item.createdAt}`}</AppText>
      <TextInput multiline value={notes[item.id] ?? item.reviewNote ?? ""} onChangeText={(value) => setNotes((current) => ({ ...current, [item.id]: value }))} placeholder={language === "en" ? "Moderator note for the audit trail" : "অডিট ট্রেইলের জন্য মডারেটর নোট"} placeholderTextColor={palette.muted} style={[fieldStyle, { minHeight: 58, paddingTop: 10, textAlignVertical: "top" }]} editable={status === "pending" || status === "needs-clearer-photo"} />
      {item.catalogProductId ? <SecondaryButton title={language === "en" ? "Open draft catalog record" : "খসড়া ক্যাটালগ রেকর্ড খুলুন"} icon="file-edit-outline" onPress={() => router.push("/admin/catalog")} style={{ minHeight: 42 }} /> : null}
      {status === "pending" || status === "needs-clearer-photo" ? <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}><Pressable disabled={Boolean(activeId)} onPress={() => void review(item.id, "accepted")} style={{ flex: 1, minWidth: 100, minHeight: 42, borderRadius: 13, backgroundColor: palette.green, alignItems: "center", justifyContent: "center", opacity: activeId && activeId !== item.id ? 0.5 : 1 }}><AppText weight="semibold" style={{ color: palette.white, fontSize: 11 }}>{activeId === item.id ? (language === "en" ? "Saving…" : "সংরক্ষণ…") : (language === "en" ? "Accept → draft" : "গ্রহণ → খসড়া")}</AppText></Pressable><SecondaryButton title={language === "en" ? "Clearer photos" : "পরিষ্কার ছবি"} icon="image-filter-center-focus" disabled={Boolean(activeId)} onPress={() => void review(item.id, "needs-clearer-photo")} style={{ flex: 1, minWidth: 100, minHeight: 42 }} /><SecondaryButton title={language === "en" ? "Reject" : "প্রত্যাখ্যান"} icon="close" disabled={Boolean(activeId)} onPress={() => void review(item.id, "rejected")} style={{ flex: 1, minWidth: 80, minHeight: 42 }} /></View> : <AppText style={{ color: palette.muted, fontSize: 10 }}>{item.reviewNote || (language === "en" ? "No review note recorded." : "কোনো পর্যালোচনা নোট নেই।")}</AppText>}
    </Card>) : <Card style={{ alignItems: "center", gap: 8, paddingVertical: 26 }}><MaterialCommunityIcons name="check-decagram-outline" size={31} color={palette.green} /><AppText weight="semibold" style={{ fontSize: 14, textAlign: "center" }}>{language === "en" ? `No ${statusLabels[status].en.toLowerCase()} records` : `কোনো ${statusLabels[status].bn} রেকর্ড নেই`}</AppText><AppText style={{ color: palette.muted, fontSize: 11, textAlign: "center" }}>{language === "en" ? "New submissions and decisions will appear in their corresponding status tab." : "নতুন জমা ও সিদ্ধান্ত সংশ্লিষ্ট স্ট্যাটাস ট্যাবে দেখা যাবে।"}</AppText></Card>}
  </Screen>;
}
