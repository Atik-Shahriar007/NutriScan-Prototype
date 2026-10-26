import { useState } from "react";
import { Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, IconTile, PageHeader, Pill, Screen, SecondaryButton, usePalette } from "@/components/nutriscan-ui";
import { t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

export default function SupportScreen() {
  const { language } = useNutriScan();
  const palette = usePalette();
  const [showPurpose, setShowPurpose] = useState(true);
  const fundUses = [t(language, "fundsOne"), t(language, "fundsTwo"), t(language, "fundsThree")];
  return (
    <Screen contentStyle={{ gap: 18 }}>
      <PageHeader title={t(language, "support")} subtitle={language === "en" ? "A clear, optional way to help maintain an independent catalog." : "স্বাধীন ক্যাটালগ সচল রাখতে স্বচ্ছ ও ঐচ্ছিক সহায়তার পথ।"} />
      <Card style={{ backgroundColor: palette.green, borderColor: palette.green, padding: 19 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
          <View style={{ width: 46, height: 46, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="heart-outline" size={24} color={palette.white} /></View>
          <Pill tone="amber">{t(language, "voluntary")}</Pill>
        </View>
        <AppText weight="bold" style={{ color: palette.white, fontSize: 24, lineHeight: 33 }}>{t(language, "supportTitle")}</AppText>
        <AppText style={{ color: palette.onGreen, fontSize: 12, lineHeight: 19 }}>{t(language, "supportBody")}</AppText>
      </Card>
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}><IconTile icon="wallet-outline" tone="amber" /><View style={{ flex: 1 }}><AppText weight="semibold" style={{ fontSize: 15 }}>{language === "en" ? "Donation details" : "অনুদানের তথ্য"}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{language === "en" ? "Payment setup not connected" : "পেমেন্ট ব্যবস্থা যুক্ত নয়"}</AppText></View></View>
        <View style={{ flexDirection: "row", gap: 8 }}>
          {["bKash", "Nagad"].map((name) => <View key={name} style={{ flex: 1, minHeight: 49, borderRadius: 14, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.paper, alignItems: "center", justifyContent: "center", gap: 2 }}><AppText weight="semibold" style={{ color: palette.green, fontSize: 13 }}>{name}</AppText><AppText style={{ color: palette.muted, fontSize: 9 }}>{language === "en" ? "not configured" : "যুক্ত নয়"}</AppText></View>)}
        </View>
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, backgroundColor: palette.amberSoft, borderRadius: 13 }}><MaterialCommunityIcons name="information-outline" size={16} color={palette.amberInk} /><AppText style={{ color: palette.amberInk, fontSize: 11, lineHeight: 17, flex: 1 }}>{t(language, "donationStatus")}</AppText></View>
        <SecondaryButton title={language === "en" ? "Payment setup coming later" : "পেমেন্ট ব্যবস্থা পরে যুক্ত হবে"} icon="lock-outline" disabled style={{ backgroundColor: palette.neutralSoft }} />
      </Card>
      <Card style={{ gap: 12 }}>
        <Pressable accessibilityRole="button" accessibilityState={{ expanded: showPurpose }} onPress={() => setShowPurpose(!showPurpose)} style={{ flexDirection: "row", alignItems: "center", gap: 9 }}>
          <IconTile icon="text-box-check-outline" />
          <AppText weight="semibold" style={{ flex: 1, fontSize: 14 }}>{t(language, "howFundsHelp")}</AppText>
          <MaterialCommunityIcons name={showPurpose ? "chevron-up" : "chevron-down"} size={19} color={palette.muted} />
        </Pressable>
        {showPurpose ? fundUses.map((item) => <View key={item} style={{ flexDirection: "row", alignItems: "center", gap: 9 }}><MaterialCommunityIcons name="check-circle-outline" size={17} color={palette.green} /><AppText style={{ fontSize: 12, color: palette.muted, flex: 1 }}>{item}</AppText></View>) : null}
      </Card>
      <DemoNotice>{language === "en" ? "Donations are optional and never affect product grades, verification, scan access, or rankings." : "অনুদান ঐচ্ছিক; এটি পণ্যের গ্রেড, যাচাই, স্ক্যান সুবিধা বা র‍্যাঙ্কিংকে প্রভাবিত করে না।"}</DemoNotice>
    </Screen>
  );
}
