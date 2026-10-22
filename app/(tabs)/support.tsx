import { useState } from "react";
import { Linking, Pressable, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, IconTile, PageHeader, Pill, PrimaryButton, Screen, SecondaryButton, palette } from "@/components/nutriscan-ui";
import { t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";
import { configuredDonationChannels, supportConfig } from "@/lib/support-config";

export default function SupportScreen() {
  const { language } = useNutriScan();
  const [showPurpose, setShowPurpose] = useState(true);
  const [notice, setNotice] = useState("");
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
        <AppText style={{ color: "#E6EEE8", fontSize: 12, lineHeight: 19 }}>{t(language, "supportBody")}</AppText>
      </Card>
      <Card style={{ gap: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 9 }}><IconTile icon="wallet-outline" tone="amber" /><View style={{ flex: 1 }}><AppText weight="semibold" style={{ fontSize: 15 }}>{language === "en" ? "Donation details" : "অনুদানের তথ্য"}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{configuredDonationChannels.length || supportConfig.donationUrl ? (language === "en" ? "Ready when configured by the project owner" : "প্রকল্প মালিক সেটআপ করলে প্রস্তুত") : (language === "en" ? "Payment setup not connected" : "পেমেন্ট ব্যবস্থা যুক্ত নয়")}</AppText></View><Pill tone={configuredDonationChannels.length || supportConfig.donationUrl ? "green" : "neutral"}>{configuredDonationChannels.length || supportConfig.donationUrl ? (language === "en" ? "Ready" : "প্রস্তুত") : (language === "en" ? "Not configured" : "যুক্ত নয়")}</Pill></View>
        <View style={{ gap: 8 }}>
          {supportConfig.channels.map((channel) => <View key={channel.provider} style={{ borderRadius: 14, borderWidth: 1, borderColor: channel.account ? palette.green : palette.line, backgroundColor: channel.account ? palette.greenSoft : palette.paper, padding: 12, gap: 4 }}><View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}><AppText weight="semibold" style={{ color: palette.green, fontSize: 13 }}>{channel.provider}</AppText><Pill tone={channel.account ? "green" : "neutral"}>{channel.account ? (language === "en" ? "Configured" : "সেটআপ হয়েছে") : (language === "en" ? "Not configured" : "যুক্ত নয়")}</Pill></View>{channel.account ? <><AppText selectable style={{ color: palette.ink, fontSize: 14, letterSpacing: 0.5 }}>{channel.account}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{language === "en" ? "Send Money · Reference: NutriScan support" : "Send Money · রেফারেন্স: NutriScan support"}</AppText></> : <AppText style={{ color: palette.muted, fontSize: 10 }}>{language === "en" ? "An approved account number will appear here after configuration." : "অনুমোদিত অ্যাকাউন্ট নম্বর সেটআপের পর এখানে দেখা যাবে।"}</AppText>}</View>)}
        </View>
        {supportConfig.donationUrl ? <PrimaryButton title={language === "en" ? "Open secure donation page" : "নিরাপদ অনুদান পেজ খুলুন"} icon="open-in-new" onPress={() => { void Linking.openURL(supportConfig.donationUrl!).catch(() => setNotice(language === "en" ? "The donation page could not be opened." : "অনুদানের পেজ খোলা যায়নি।")); }} /> : <SecondaryButton title={language === "en" ? "Donation page not configured" : "অনুদানের পেজ যুক্ত নয়"} icon="lock-outline" disabled style={{ backgroundColor: "#F1EFEA" }} />}
        <View style={{ flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, backgroundColor: palette.amberSoft, borderRadius: 13 }}><MaterialCommunityIcons name="information-outline" size={16} color="#805915" /><AppText style={{ color: "#6D5428", fontSize: 11, lineHeight: 17, flex: 1 }}>{configuredDonationChannels.length || supportConfig.donationUrl ? (language === "en" ? "Only use the configured details above. NutriScan never asks for card PINs, OTPs, or passwords." : "উপরের সেটআপ করা তথ্যই ব্যবহার করুন। NutriScan কখনো কার্ডের PIN, OTP বা পাসওয়ার্ড চায় না।") : t(language, "donationStatus")}</AppText></View>
        {notice ? <AppText style={{ color: palette.clay, fontSize: 11 }}>{notice}</AppText> : null}
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
