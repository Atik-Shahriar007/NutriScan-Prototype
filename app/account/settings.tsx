import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  Card,
  DemoNotice,
  PageHeader,
  PrimaryButton,
  Screen,
  SecondaryButton,
  SectionHeading,
  usePalette,
} from "@/components/nutriscan-ui";
import { useNutriScan } from "@/lib/nutriscan-state";

export default function SettingsScreen() {
  const router = useRouter();
  const palette = usePalette();
  const {
    language,
    setLanguage,
    appearance,
    setAppearance,
    clearHistory,
    updateProfile,
    setHealthProfile,
    setHalalMode,
    setChildSafeMode,
  } = useNutriScan();

  const [confirmAction, setConfirmAction] = useState<"history" | "preferences" | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const optionRow = (
    label: string,
    selected: boolean,
    onPress: () => void,
    icon: keyof typeof MaterialCommunityIcons.glyphMap,
  ) => (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 13,
        paddingHorizontal: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: selected ? palette.green : palette.line,
        backgroundColor: selected ? palette.greenSoft : palette.card,
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={selected ? palette.green : palette.muted}
      />
      <AppText weight={selected ? "semibold" : "medium"} style={{ flex: 1, fontSize: 13 }}>
        {label}
      </AppText>
      <MaterialCommunityIcons
        name={selected ? "check-circle" : "circle-outline"}
        size={20}
        color={selected ? palette.green : palette.muted}
      />
    </Pressable>
  );

  const handleConfirm = () => {
    if (confirmAction === "history") {
      clearHistory();
      setStatusMessage(
        language === "en" ? "Scan history cleared." : "স্ক্যান ইতিহাস মুছে ফেলা হয়েছে।",
      );
    } else if (confirmAction === "preferences") {
      updateProfile({ displayName: "", district: "" });
      setHealthProfile({
        age: "24",
        gender: "prefer-not-to-say",
        country: "Bangladesh",
        healthConditions: [],
        dietaryRestrictions: [],
        foodAllergies: [],
        foodIntolerances: [],
        nutritionGoals: ["balanced-nutrition"],
        avoidFoods: [],
      });
      setHalalMode(false);
      setChildSafeMode(false);
      setStatusMessage(
        language === "en" ? "Preferences reset to defaults." : "পছন্দসমূহ ডিফল্টে রিসেট করা হয়েছে।",
      );
    }
    setConfirmAction(null);
  };

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader
        title={language === "en" ? "Settings" : "সেটিংস"}
        back={() => router.back()}
      />

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "Language" : "ভাষা"} />
        <View style={{ gap: 8 }}>
          {optionRow("English", language === "en", () => setLanguage("en"), "translate")}
          {optionRow("বাংলা", language === "bn", () => setLanguage("bn"), "translate")}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "Appearance" : "থিম"} />
        <View style={{ gap: 8 }}>
          {optionRow(
            language === "en" ? "Light" : "লাইট",
            appearance === "light",
            () => setAppearance("light"),
            "weather-sunny",
          )}
          {optionRow(
            language === "en" ? "Dark" : "ডার্ক",
            appearance === "dark",
            () => setAppearance("dark"),
            "weather-night",
          )}
        </View>
      </View>

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "Data" : "ডেটা"} />
        <Card style={{ gap: 10 }}>
          <SecondaryButton
            title={language === "en" ? "Clear scan history" : "স্ক্যান ইতিহাস মুছুন"}
            icon="history"
            onPress={() => {
              setStatusMessage(null);
              setConfirmAction("history");
            }}
          />
          <SecondaryButton
            title={language === "en" ? "Reset preferences" : "পছন্দসমূহ রিসেট করুন"}
            icon="restore"
            onPress={() => {
              setStatusMessage(null);
              setConfirmAction("preferences");
            }}
          />
        </Card>
      </View>

      {confirmAction ? (
        <Card style={{ gap: 12, backgroundColor: palette.amberSoft, borderColor: palette.amber }}>
          <AppText weight="semibold" style={{ fontSize: 13, color: palette.amberInk }}>
            {confirmAction === "history"
              ? language === "en"
                ? "Clear all recent scan history from this device?"
                : "এই ডিভাইস থেকে সব সাম্প্রতিক স্ক্যান ইতিহাস মুছে ফেলবেন?"
              : language === "en"
                ? "Reset profile, health preferences, and modes to defaults?"
                : "প্রোফাইল, স্বাস্থ্য পছন্দ ও মোডগুলো ডিফল্টে রিসেট করবেন?"}
          </AppText>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <SecondaryButton
              title={language === "en" ? "Cancel" : "বাতিল"}
              onPress={() => setConfirmAction(null)}
              style={{ flex: 1 }}
            />
            <PrimaryButton
              title={language === "en" ? "Confirm" : "নিশ্চিত করুন"}
              onPress={handleConfirm}
              style={{ flex: 1 }}
            />
          </View>
        </Card>
      ) : null}

      {statusMessage ? (
        <Card style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: palette.greenSoft }}>
          <MaterialCommunityIcons name="check-circle" size={20} color={palette.green} />
          <AppText weight="semibold" style={{ color: palette.green, fontSize: 13 }}>
            {statusMessage}
          </AppText>
        </Card>
      ) : null}

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "About" : "সম্পর্কে"} />
        <Card style={{ gap: 8 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <AppText style={{ color: palette.muted, fontSize: 12 }}>
              {language === "en" ? "App Version" : "অ্যাপ সংস্করণ"}
            </AppText>
            <AppText weight="semibold" style={{ fontSize: 12 }}>
              NutriScan Prototype v1.0
            </AppText>
          </View>
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <AppText style={{ color: palette.muted, fontSize: 12 }}>
              {language === "en" ? "Build Note" : "বিল্ড নোট"}
            </AppText>
            <AppText weight="semibold" style={{ fontSize: 12 }}>
              {language === "en" ? "Demo only — not for medical use" : "শুধুই ডেমো — চিকিৎসার জন্য নয়"}
            </AppText>
          </View>
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <AppText style={{ color: palette.muted, fontSize: 12 }}>
              {language === "en" ? "Team" : "টিম"}
            </AppText>
            <AppText weight="semibold" style={{ fontSize: 12 }}>
              NutriScan Lab · Dhaka
            </AppText>
          </View>
        </Card>
      </View>

      <DemoNotice />
    </Screen>
  );
}
