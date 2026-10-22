import { useState } from "react";
import { Image, Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, Pill, Screen, SecondaryButton, palette } from "@/components/nutriscan-ui";
import { categoryLabel } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";
import { trpc } from "@/lib/trpc";

export default function ContributionReviewScreen() {
  const { language } = useNutriScan();
  const pendingQuery = trpc.contributions.pending.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();
  const reviewMutation = trpc.contributions.review.useMutation();
  const [activeId, setActiveId] = useState<string>();

  const review = async (id: string, status: "accepted" | "rejected" | "needs-clearer-photo") => {
    setActiveId(id);
    try {
      await reviewMutation.mutateAsync({ id: Number(id), status, reviewNote: status === "accepted" ? "Accepted for moderator enrichment; catalog record created as draft." : status === "rejected" ? "Contribution could not be accepted for the catalog." : "Please submit clearer front and back package photos." });
      await utils.contributions.pending.invalidate();
    } finally {
      setActiveId(undefined);
    }
  };

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader title={language === "en" ? "Contribution review" : "অবদান পর্যালোচনা"} subtitle={language === "en" ? "Admin queue · accepted records stay as drafts until enriched and published." : "অ্যাডমিন কিউ · গৃহীত রেকর্ড বিস্তারিত যোগ ও প্রকাশ না হওয়া পর্যন্ত খসড়া থাকে।"} />
      <DemoNotice>{language === "en" ? "This screen is restricted by the server admin role. Approving a contribution never publishes it directly to the public catalog." : "এই স্ক্রিন সার্ভারের অ্যাডমিন রোল দ্বারা সীমাবদ্ধ। অবদান গ্রহণ করলেই তা পাবলিক ক্যাটালগে প্রকাশিত হয় না।"}</DemoNotice>
      {pendingQuery.isLoading ? <Card><AppText style={{ color: palette.muted, fontSize: 12 }}>{language === "en" ? "Loading pending contributions…" : "অপেক্ষমাণ অবদান লোড হচ্ছে…"}</AppText></Card> : pendingQuery.error ? <Card style={{ backgroundColor: palette.claySoft, borderColor: "#E6C5B7" }}><AppText weight="semibold" style={{ color: palette.clay, fontSize: 14 }}>{language === "en" ? "Admin access required" : "অ্যাডমিন অ্যাক্সেস প্রয়োজন"}</AppText><AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 17 }}>{language === "en" ? "Sign in with an account granted the admin role, then reload this screen." : "অ্যাডমিন রোল দেওয়া অ্যাকাউন্ট দিয়ে সাইন ইন করে আবার স্ক্রিনটি খুলুন।"}</AppText></Card> : pendingQuery.data?.length ? pendingQuery.data.map((item) => <Card key={item.id} style={{ gap: 11 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><View style={{ flex: 1, gap: 3 }}><AppText weight="semibold" style={{ fontSize: 15 }}>{item.productName}</AppText><AppText style={{ color: palette.muted, fontSize: 11 }}>{item.brand || (language === "en" ? "Brand not supplied" : "ব্র্যান্ড দেওয়া হয়নি")} · {categoryLabel(item.category, language)}</AppText></View><Pill tone="amber">{language === "en" ? "Pending" : "অপেক্ষমাণ"}</Pill></View>
        <View style={{ flexDirection: "row", gap: 8 }}><Image source={{ uri: item.frontImageUrl }} resizeMode="cover" style={{ flex: 1, height: 150, borderRadius: 13, backgroundColor: palette.paper }} /><Image source={{ uri: item.backImageUrl }} resizeMode="cover" style={{ flex: 1, height: 150, borderRadius: 13, backgroundColor: palette.paper }} /></View>
        <AppText style={{ color: palette.muted, fontSize: 10 }}>{language === "en" ? `Barcode: ${item.barcode || "Not supplied"}` : `বারকোড: ${item.barcode || "দেওয়া হয়নি"}`}</AppText>
        <View style={{ flexDirection: "row", gap: 8, flexWrap: "wrap" }}><Pressable disabled={Boolean(activeId)} onPress={() => void review(item.id, "accepted")} style={{ flex: 1, minWidth: 100, minHeight: 42, borderRadius: 13, backgroundColor: palette.green, alignItems: "center", justifyContent: "center", opacity: activeId && activeId !== item.id ? 0.5 : 1 }}><AppText weight="semibold" style={{ color: palette.white, fontSize: 11 }}>{activeId === item.id ? (language === "en" ? "Saving…" : "সংরক্ষণ…") : (language === "en" ? "Accept → draft" : "গ্রহণ → খসড়া")}</AppText></Pressable><SecondaryButton title={language === "en" ? "Clearer photos" : "পরিষ্কার ছবি"} icon="image-filter-center-focus" disabled={Boolean(activeId)} onPress={() => void review(item.id, "needs-clearer-photo")} style={{ flex: 1, minWidth: 100, minHeight: 42 }} /><SecondaryButton title={language === "en" ? "Reject" : "প্রত্যাখ্যান"} icon="close" disabled={Boolean(activeId)} onPress={() => void review(item.id, "rejected")} style={{ flex: 1, minWidth: 80, minHeight: 42 }} /></View>
      </Card>) : <Card style={{ alignItems: "center", gap: 8, paddingVertical: 26 }}><MaterialCommunityIcons name="check-decagram-outline" size={31} color={palette.green} /><AppText weight="semibold" style={{ fontSize: 14, textAlign: "center" }}>{language === "en" ? "No pending contributions" : "কোনো অপেক্ষমাণ অবদান নেই"}</AppText><AppText style={{ color: palette.muted, fontSize: 11, textAlign: "center" }}>{language === "en" ? "New submissions will appear here for review." : "নতুন জমা দেওয়া তথ্য পর্যালোচনার জন্য এখানে দেখা যাবে।"}</AppText></Card>}
    </Screen>
  );
}
