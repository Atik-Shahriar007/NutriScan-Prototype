import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  Card,
  IconTile,
  PageHeader,
  Pill,
  PremiumBadge,
  Screen,
  SectionHeading,
  SecondaryButton,
  usePalette,
} from "@/components/nutriscan-ui";
import { t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

type MenuRowProps = {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  subtitle?: string;
  tone?: "green" | "amber";
  right?: React.ReactNode;
  onPress?: () => void;
};

function MenuRow({ icon, title, subtitle, tone = "green", right, onPress }: MenuRowProps) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      onPress={onPress}
      style={({ pressed }) => ({
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 12,
        minHeight: 56,
        opacity: pressed && onPress ? 0.82 : 1,
      })}
    >
      <IconTile icon={icon} tone={tone} />
      <View style={{ flex: 1, gap: 2 }}>
        <AppText weight="semibold" style={{ fontSize: 13 }}>{title}</AppText>
        {subtitle ? (
          <AppText style={{ color: palette.muted, fontSize: 11, lineHeight: 15 }}>{subtitle}</AppText>
        ) : null}
      </View>
      {right ?? <MaterialCommunityIcons name="chevron-right" size={20} color={palette.muted} />}
    </Pressable>
  );
}

export default function ProfileHubScreen() {
  const router = useRouter();
  const palette = usePalette();
  const {
    language,
    profile,
    demoAccount,
    isAuthenticated,
    isPremium,
    halalMode,
    setHalalMode,
    childSafeMode,
    setChildSafeMode,
    compareIds,
  } = useNutriScan();

  const displayName = profile.displayName.trim() || demoAccount.name;
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");

  const quickActions = [
    {
      key: "health-profile",
      icon: "account-heart-outline" as const,
      tint: palette.greenSoft,
      iconColor: palette.green,
      label: t(language, "healthProfile"),
      onPress: () => router.push("/account/health-profile"),
    },
    {
      key: "nutrition-goals",
      icon: "target-account" as const,
      tint: palette.amberSoft,
      iconColor: palette.amberInk,
      label: t(language, "nutritionGoals"),
      onPress: () => router.push("/account/nutrition-goals"),
    },
    {
      key: "favorites",
      icon: "star-outline" as const,
      tint: palette.amberSoft,
      iconColor: palette.amberInk,
      label: language === "en" ? "Favorites" : "পছন্দের পণ্য",
      onPress: () => router.push("/(tabs)/history"),
    },
    {
      key: "history",
      icon: "history" as const,
      tint: palette.greenSoft,
      iconColor: palette.green,
      label: t(language, "history"),
      onPress: () => router.push("/(tabs)/history"),
    },
  ];

  return (
    <Screen contentStyle={{ gap: 18 }}>
      <PageHeader title={t(language, "profile")} />

      <Card style={{ gap: 14 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
          <View
            style={{
              width: 60,
              height: 60,
              borderRadius: 30,
              backgroundColor: palette.greenSoft,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {initials ? (
              <AppText weight="bold" style={{ fontSize: 20, color: palette.green }}>{initials}</AppText>
            ) : (
              <MaterialCommunityIcons name="account-outline" size={28} color={palette.green} />
            )}
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <AppText weight="bold" style={{ fontSize: 17 }}>{displayName}</AppText>
              {isPremium ? <PremiumBadge /> : null}
            </View>
            {isAuthenticated ? (
              <AppText style={{ color: palette.muted, fontSize: 12 }}>{demoAccount.email}</AppText>
            ) : null}
          </View>
        </View>
        <SecondaryButton
          title={language === "en" ? "Edit Profile" : "প্রোফাইল সম্পাদনা"}
          icon="account-edit-outline"
          onPress={() => router.push("/account/health-profile")}
          style={{ minHeight: 44 }}
        />
      </Card>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        {quickActions.map((item) => (
          <Pressable
            key={item.key}
            accessibilityRole="button"
            accessibilityLabel={item.label}
            onPress={item.onPress}
            style={({ pressed }) => ({
              width: "48%",
              flexGrow: 1,
              minHeight: 88,
              borderRadius: 18,
              padding: 12,
              backgroundColor: palette.card,
              borderWidth: 1,
              borderColor: palette.line,
              justifyContent: "space-between",
              opacity: pressed ? 0.86 : 1,
            })}
          >
            <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: item.tint, alignItems: "center", justifyContent: "center" }}>
              <MaterialCommunityIcons name={item.icon} size={20} color={item.iconColor} />
            </View>
            <AppText weight="semibold" style={{ fontSize: 12 }}>{item.label}</AppText>
          </Pressable>
        ))}
      </View>

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "My Health" : "আমার স্বাস্থ্য"} />
        <Card style={{ paddingVertical: 4, gap: 0 }}>
          <MenuRow
            icon="account-heart-outline"
            title={t(language, "healthProfile")}
            subtitle={language === "en" ? "Conditions, allergies & dietary needs" : "স্বাস্থ্য অবস্থা, অ্যালার্জি ও খাদ্যাভ্যাস"}
            onPress={() => router.push("/account/health-profile")}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="target-account"
            title={t(language, "nutritionGoals")}
            subtitle={language === "en" ? "Daily nutrition focus" : "দৈনিক পুষ্টির লক্ষ্য"}
            onPress={() => router.push("/account/nutrition-goals")}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="food-apple-outline"
            title={t(language, "viewFoodPreferences")}
            subtitle={language === "en" ? "Foods & ingredients to avoid" : "এড়িয়ে চলার খাবার ও উপাদান"}
            onPress={() => router.push("/account/preferences")}
          />
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "My Stuff" : "আমার তালিকা"} />
        <Card style={{ paddingVertical: 4, gap: 0 }}>
          <MenuRow
            icon="star-outline"
            title={language === "en" ? "Favorites" : "পছন্দের পণ্য"}
            subtitle={language === "en" ? "Saved products" : "সংরক্ষিত পণ্য"}
            onPress={() => router.push("/(tabs)/history")}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="history"
            title={t(language, "history")}
            subtitle={language === "en" ? "Your recent barcode scans" : "আপনার সাম্প্রতিক স্ক্যান"}
            onPress={() => router.push("/(tabs)/history")}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="lightbulb-on-outline"
            title={language === "en" ? "Tips for Me" : "আমার জন্য টিপস"}
            subtitle={language === "en" ? "Saved & personalized tips" : "সংরক্ষিত ও ব্যক্তিগত টিপস"}
            onPress={() => router.push("/account/tips")}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="calendar-clock-outline"
            title={language === "en" ? "Expiry Reminders" : "মেয়াদের রিমাইন্ডার"}
            subtitle={language === "en" ? "Track product best-before dates" : "পণ্যের মেয়াদ শেষের তারিখ দেখুন"}
            onPress={() => router.push("/account/expiry-reminders")}
          />
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "Features" : "ফিচারসমূহ"} />
        <Card style={{ paddingVertical: 4, gap: 0 }}>
          <MenuRow
            icon="compare-horizontal"
            title={t(language, "compareProducts")}
            subtitle={language === "en" ? "Compare 2 food products side by side" : "পাশাপাশি ২টি খাবার পণ্য তুলনা করুন"}
            right={
              compareIds.length > 0 ? (
                <Pill tone="green">{compareIds.length}/2</Pill>
              ) : undefined
            }
            onPress={() => router.push("/compare")}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="crown-outline"
            tone="amber"
            title={t(language, "premium")}
            subtitle={language === "en" ? "Unlock advanced insights" : "উন্নত বিশ্লেষণ আনলক করুন"}
            onPress={() => router.push("/account/premium")}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="shield-check-outline"
            title={t(language, "halalMode")}
            subtitle={t(language, "halalModeDescription")}
            right={<Pill tone={halalMode ? "green" : "neutral"}>{halalMode ? (language === "en" ? "On" : "চালু") : (language === "en" ? "Off" : "বন্ধ")}</Pill>}
            onPress={() => setHalalMode(!halalMode)}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="baby-face-outline"
            title={t(language, "childSafeMode")}
            subtitle={language === "en" ? "Highlight products scored 60 or higher" : "৬০ বা তার বেশি স্কোরের পণ্য দেখান"}
            right={<Pill tone={childSafeMode ? "green" : "neutral"}>{childSafeMode ? (language === "en" ? "On" : "চালু") : (language === "en" ? "Off" : "বন্ধ")}</Pill>}
            onPress={() => setChildSafeMode(!childSafeMode)}
          />
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "Explore" : "আরও দেখুন"} />
        <Card style={{ paddingVertical: 4, gap: 0 }}>
          <MenuRow
            icon="lightbulb-on-outline"
            title={t(language, "openNutriFacts")}
            subtitle={t(language, "nutriFactsSubtitle")}
            onPress={() => router.push("/(tabs)/nutrifacts")}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="podium-gold"
            title={t(language, "community")}
            subtitle={t(language, "leaderboardBody")}
            onPress={() => router.push("/(tabs)/community")}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="camera-plus-outline"
            title={t(language, "contribute")}
            subtitle={t(language, "contributeTitle")}
            onPress={() => router.push("/(tabs)/contribute")}
          />
        </Card>
      </View>

      <View style={{ gap: 8 }}>
        <SectionHeading title={language === "en" ? "App" : "অ্যাপ"} />
        <Card style={{ paddingVertical: 4, gap: 0 }}>
          <MenuRow
            icon="cog-outline"
            title={language === "en" ? "Settings" : "সেটিংস"}
            subtitle={language === "en" ? "Language, theme & data" : "ভাষা, থিম ও ডেটা"}
            onPress={() => router.push("/account/settings")}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="heart-outline"
            title={t(language, "support")}
            subtitle={t(language, "supportBody")}
            onPress={() => router.push("/(tabs)/support")}
          />
          <View style={{ height: 1, backgroundColor: palette.line }} />
          <MenuRow
            icon="information-outline"
            title={language === "en" ? "About" : "সম্পর্কে"}
            subtitle="NutriScan prototype · v1.0 · Demo only"
            right={<View />}
          />
        </Card>
      </View>

      <AppText style={{ color: palette.muted, textAlign: "center", fontSize: 11, paddingBottom: 8 }}>
        NutriScan prototype · v1.0 · Demo only
      </AppText>
    </Screen>
  );
}
