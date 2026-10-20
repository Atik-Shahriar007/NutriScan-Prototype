import { View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, IconTile, PageHeader, Pill, Screen, palette } from "@/components/nutriscan-ui";
import { t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

const sampleContributors = [
  { name: "Demo scout 01", points: 240 },
  { name: "Demo scout 02", points: 180 },
  { name: "Demo scout 03", points: 125 },
];

export default function CommunityScreen() {
  const { language, submissions } = useNutriScan();
  const ranks = language === "bn" ? ["১ম", "২য়", "৩য়"] : ["01", "02", "03"];
  return (
    <Screen contentStyle={{ gap: 18 }}>
      <PageHeader title={t(language, "community")} subtitle={t(language, "leaderboardTitle")} />
      <View style={{ flexDirection: "row", gap: 11, alignItems: "center" }}>
        <IconTile icon="trophy-outline" tone="amber" />
        <View style={{ flex: 1, gap: 3 }}><AppText weight="semibold" style={{ fontSize: 14 }}>{t(language, "leaderboardTitle")}</AppText><AppText style={{ color: palette.muted, fontSize: 11 }}>{t(language, "demoBoard")}</AppText></View>
        <Pill tone="amber">{t(language, "sample")}</Pill>
      </View>
      <DemoNotice>{t(language, "leaderboardBody")}</DemoNotice>
      <Card style={{ gap: 0, paddingVertical: 5 }}>
        {sampleContributors.map((person, index) => <View key={person.name} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 13, borderBottomWidth: index === sampleContributors.length - 1 ? 0 : 1, borderBottomColor: palette.line }}>
          <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: index === 0 ? palette.amberSoft : palette.paper, alignItems: "center", justifyContent: "center" }}><AppText weight="bold" style={{ color: palette.green, fontSize: 11 }}>{ranks[index]}</AppText></View>
          <View style={{ flex: 1 }}><AppText weight="semibold" style={{ fontSize: 13 }}>{language === "bn" ? `ডেমো স্কাউট ${index + 1}` : person.name}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{language === "en" ? "Example contributor" : "উদাহরণ অবদানকারী"}</AppText></View>
          <AppText weight="semibold" style={{ color: palette.green, fontSize: 12 }}>{person.points} {language === "en" ? "pts" : "পয়েন্ট"}</AppText>
        </View>)}
      </Card>
      <Card style={{ backgroundColor: palette.greenSoft, borderColor: "#D4E4D5" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}><MaterialCommunityIcons name="account-check-outline" size={18} color={palette.green} /><AppText weight="semibold" style={{ color: palette.green, fontSize: 13 }}>{t(language, "yourPoints")}</AppText></View>
        <View style={{ flexDirection: "row", alignItems: "baseline", gap: 6 }}><AppText weight="bold" style={{ color: palette.green, fontSize: 32 }}>0</AppText><AppText style={{ color: palette.green, fontSize: 12 }}>{language === "en" ? "accepted points" : "গৃহীত পয়েন্ট"}</AppText></View>
        <AppText style={{ color: palette.green, fontSize: 11, lineHeight: 17 }}>{t(language, "pointsAfterReview")}</AppText>
        <AppText style={{ color: palette.green, fontSize: 10 }}>{language === "en" ? `${submissions.length} local prototype submission${submissions.length === 1 ? "" : "s"}; none has been reviewed.` : `প্রোটোটাইপে ${submissions.length}টি তথ্য জমা; কোনোটি পর্যালোচনা করা হয়নি।`}</AppText>
      </Card>
      <Card style={{ flexDirection: "row", gap: 12, alignItems: "flex-start" }}>
        <IconTile icon="shield-check-outline" />
        <View style={{ flex: 1, gap: 5 }}><AppText weight="semibold" style={{ fontSize: 13 }}>{language === "en" ? "Recognition, not influence" : "স্বীকৃতি, প্রভাব নয়"}</AppText><AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 18 }}>{language === "en" ? "Points celebrate useful approved label data. They never change a product grade, verification status, or search ranking." : "গৃহীত ও উপকারী লেবেল তথ্যের জন্য পয়েন্ট। এগুলো পণ্যের গ্রেড, যাচাইয়ের অবস্থা বা সার্চের ক্রম বদলায় না।"}</AppText></View>
      </Card>
    </Screen>
  );
}
