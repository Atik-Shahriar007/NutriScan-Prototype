import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, IconTile, PageHeader, Pill, Screen, palette } from "@/components/nutriscan-ui";
import { t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";
import { trpc } from "@/lib/trpc";

export default function CommunityScreen() {
  const { language, contributorKey } = useNutriScan();
  const leaderboardQuery = trpc.contributions.leaderboard.useQuery(undefined, { retry: false });
  const mineQuery = trpc.contributions.mine.useQuery({ contributorKey }, { retry: false });
  const leaderboard = leaderboardQuery.data ?? [];
  const acceptedPoints = mineQuery.data?.reduce((total, item) => total + item.pointsAwarded, 0) ?? 0;
  const ranks = language === "bn" ? ["১ম", "২য়", "৩য়"] : ["01", "02", "03"];

  return (
    <Screen contentStyle={{ gap: 18 }}>
      <PageHeader title={t(language, "community")} subtitle={t(language, "leaderboardTitle")} />
      <View style={{ flexDirection: "row", gap: 11, alignItems: "center" }}>
        <IconTile icon="trophy-outline" tone="amber" />
        <View style={{ flex: 1, gap: 3 }}><AppText weight="semibold" style={{ fontSize: 14 }}>{t(language, "leaderboardTitle")}</AppText><AppText style={{ color: palette.muted, fontSize: 11 }}>{language === "en" ? "Accepted contributions only" : "শুধু গৃহীত অবদান"}</AppText></View>
        <Pill tone="green">{language === "en" ? "Live" : "লাইভ"}</Pill>
      </View>
      <DemoNotice>{language === "en" ? "Points are awarded only after review. Public names appear only when a contributor opts in." : "পর্যালোচনার পরেই পয়েন্ট দেওয়া হয়। অবদানকারী অনুমতি দিলেই শুধু নাম প্রকাশিত হয়।"}</DemoNotice>
      <Card style={{ gap: 0, paddingVertical: 5 }}>
        {leaderboardQuery.isLoading ? <AppText style={{ color: palette.muted, padding: 14, fontSize: 12 }}>{language === "en" ? "Loading the leaderboard…" : "লিডারবোর্ড লোড হচ্ছে…"}</AppText> : leaderboard.length ? leaderboard.map((person, index) => <View key={person.contributorKey} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13, borderBottomWidth: index === leaderboard.length - 1 ? 0 : 1, borderBottomColor: palette.line }}>
          <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: index === 0 ? palette.amberSoft : palette.paper, alignItems: "center", justifyContent: "center" }}><AppText weight="bold" style={{ color: palette.green, fontSize: 11 }}>{ranks[index] ?? `${index + 1}`}</AppText></View>
          <View style={{ flex: 1 }}><AppText weight="semibold" style={{ fontSize: 13 }}>{person.displayName}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{language === "en" ? "Accepted contributor" : "গৃহীত অবদানকারী"}</AppText></View>
          <AppText weight="semibold" style={{ color: palette.green, fontSize: 12 }}>{person.points} {language === "en" ? "pts" : "পয়েন্ট"}</AppText>
        </View>) : <View style={{ alignItems: "center", gap: 8, paddingVertical: 25 }}><MaterialCommunityIcons name="trophy-outline" size={30} color={palette.muted} /><AppText weight="semibold" style={{ fontSize: 14, textAlign: "center" }}>{language === "en" ? "The leaderboard starts with the first approved contribution" : "প্রথম গৃহীত অবদানের পর লিডারবোর্ড শুরু হবে"}</AppText><AppText style={{ color: palette.muted, fontSize: 11, textAlign: "center", lineHeight: 17 }}>{language === "en" ? "Submit a clear package and our review team can award points after checking it." : "পরিষ্কার প্যাকেটের ছবি জমা দিন; পর্যালোচনা শেষে পয়েন্ট দেওয়া হবে।"}</AppText></View>}
      </Card>
      <Card style={{ backgroundColor: palette.greenSoft, borderColor: "#D4E4D5" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><MaterialCommunityIcons name="account-check-outline" size={18} color={palette.green} /><AppText weight="semibold" style={{ color: palette.green, fontSize: 13 }}>{t(language, "yourPoints")}</AppText></View>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}><AppText weight="bold" style={{ color: palette.green, fontSize: 32 }}>{acceptedPoints}</AppText><AppText style={{ color: palette.green, fontSize: 12 }}>{language === "en" ? "accepted points" : "গৃহীত পয়েন্ট"}</AppText></View>
        <AppText style={{ color: palette.green, fontSize: 11, lineHeight: 17 }}>{t(language, "pointsAfterReview")}</AppText>
      </Card>
      <Card style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
        <IconTile icon="shield-check-outline" />
        <View style={{ flex: 1, gap: 5 }}><AppText weight="semibold" style={{ fontSize: 13 }}>{language === "en" ? "Recognition, not influence" : "স্বীকৃতি, প্রভাব নয়"}</AppText><AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 18 }}>{language === "en" ? "Points celebrate useful approved label data. They never change a product grade, verification status, or search ranking." : "গৃহীত ও উপকারী লেবেল তথ্যের জন্য পয়েন্ট। এগুলো পণ্যের গ্রেড, যাচাইয়ের অবস্থা বা সার্চের ক্রম বদলায় না।"}</AppText></View>
      </Card>
    </Screen>
  );
}
