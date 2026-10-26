import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AppText, Card, DemoNotice, PageHeader, PrimaryButton, Screen, fontFamily, usePalette } from "@/components/nutriscan-ui";
import { t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

export default function ProfileScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { language, ready, profile, updateProfile } = useNutriScan();
  const [displayName, setDisplayName] = useState(profile.displayName);
  const [district, setDistrict] = useState(profile.district);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!ready) return;
    // The provider hydrates asynchronously; copy loaded values into the editable draft.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setDisplayName(profile.displayName);
    setDistrict(profile.district);
  }, [ready, profile.displayName, profile.district]);

  const fieldStyle = {
    minHeight: 48, borderRadius: 13, borderWidth: 1, borderColor: palette.line,
    backgroundColor: palette.card, paddingHorizontal: 13, color: palette.ink,
    fontFamily: fontFamily(language), fontSize: 13,
  } as const;
  const save = () => {
    updateProfile({ displayName: displayName.trim(), district: district.trim() });
    setSaved(true);
  };

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader title={t(language, "myProfile")} subtitle={t(language, "profileSubtitle")} back={() => router.back()} />
      <Card style={{ flexDirection: "row", alignItems: "center", gap: 12, backgroundColor: palette.greenSoft }}>
        <View style={{ width: 49, height: 49, borderRadius: 17, backgroundColor: palette.card, alignItems: "center", justifyContent: "center" }}><MaterialCommunityIcons name="account-outline" size={27} color={palette.green} /></View>
        <View style={{ flex: 1, gap: 4 }}><AppText weight="semibold" style={{ fontSize: 15 }}>{displayName.trim() || t(language, "displayNamePlaceholder")}</AppText><AppText style={{ color: palette.muted, fontSize: 11 }}>{district.trim() || t(language, "district")}</AppText></View>
      </Card>
      <Card style={{ gap: 10 }}>
        <AppText weight="semibold" style={{ fontSize: 14 }}>{t(language, "myProfile")}</AppText>
        <View style={{ gap: 6 }}><AppText weight="semibold" style={{ fontSize: 11 }}>{t(language, "displayName")}</AppText><TextInput value={displayName} onChangeText={(value) => { setDisplayName(value); setSaved(false); }} placeholder={t(language, "displayNamePlaceholder")} placeholderTextColor={palette.muted} maxLength={40} editable={ready} accessibilityLabel={t(language, "displayName")} returnKeyType="next" onSubmitEditing={() => undefined} style={fieldStyle} /></View>
        <View style={{ gap: 6 }}><AppText weight="semibold" style={{ fontSize: 11 }}>{t(language, "district")}</AppText><TextInput value={district} onChangeText={(value) => { setDistrict(value); setSaved(false); }} placeholder={t(language, "districtPlaceholder")} placeholderTextColor={palette.muted} maxLength={50} editable={ready} accessibilityLabel={t(language, "district")} returnKeyType="done" onSubmitEditing={save} style={fieldStyle} /></View>
        <PrimaryButton title={t(language, "saveProfile")} icon="content-save-outline" onPress={save} disabled={!ready} />
        {saved ? <View accessibilityLiveRegion="polite" style={{ flexDirection: "row", alignItems: "center", gap: 7 }}><MaterialCommunityIcons name="check-circle-outline" size={17} color={palette.green} /><AppText style={{ color: palette.green, fontSize: 11 }}>{t(language, "profileSaved")}</AppText></View> : null}
      </Card>
      <DemoNotice>{t(language, "profilePrivacy")}</DemoNotice>
    </Screen>
  );
}
