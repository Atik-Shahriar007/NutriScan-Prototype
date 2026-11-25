import { useState } from "react";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  Card,
  DemoNotice,
  PageHeader,
  Pill,
  PrimaryButton,
  Screen,
  SecondaryButton,
  SectionHeading,
  usePalette,
} from "@/components/nutriscan-ui";
import { useNutriScan } from "@/lib/nutriscan-state";

type PlanCycle = "monthly" | "yearly";

export default function PremiumScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { language, isPremium, setIsPremium } = useNutriScan();

  const [selectedPlan, setSelectedPlan] = useState<PlanCycle>("yearly");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const freeFeatures =
    language === "en"
      ? ["5 scans/day", "Basic product details", "Standard search", "Community access"]
      : ["দিনে ৫টি স্ক্যান", "মৌলিক পণ্যের তথ্য", "সাধারণ সার্চ", "কমিউনিটি অ্যাক্সেস"];

  const premiumFeatures =
    language === "en"
      ? [
          "Unlimited scans",
          "Advanced NQSS insights",
          "Personalized Nouri",
          "Detailed ingredient analysis",
          "Extended scan history",
          "Priority support",
        ]
      : [
          "সীমাহীন স্ক্যান",
          "উন্নত NQSS বিশ্লেষণ",
          "ব্যক্তিগতকৃত নৌরি",
          "বিস্তারিত উপাদান বিশ্লেষণ",
          "দীর্ঘ স্ক্যান ইতিহাস",
          "অগ্রাধিকার সহায়তা",
        ];

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader
        title={language === "en" ? "NutriScan Premium" : "NutriScan প্রিমিয়াম"}
        back={() => router.back()}
      />

      <Card
        style={{
          backgroundColor: palette.green,
          borderColor: palette.green,
          alignItems: "center",
          paddingVertical: 24,
          gap: 10,
        }}
      >
        <View
          style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: "rgba(255,255,255,0.16)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MaterialCommunityIcons name="crown" size={34} color={palette.onGreen} />
        </View>
        <AppText weight="bold" style={{ fontSize: 20, color: palette.onGreen, textAlign: "center" }}>
          {isPremium
            ? language === "en"
              ? "You're on Premium!"
              : "আপনি প্রিমিয়াম ব্যবহার করছেন!"
            : language === "en"
              ? "Upgrade to Premium"
              : "প্রিমিয়ামে আপগ্রেড করুন"}
        </AppText>
        <AppText style={{ fontSize: 12, color: palette.onGreen, opacity: 0.9, textAlign: "center" }}>
          {isPremium
            ? language === "en"
              ? "All demo premium features are currently active on this device."
              : "এই ডিভাইসে সব ডেমো প্রিমিয়াম ফিচার চালু আছে।"
            : language === "en"
              ? "Unlock the full NutriScan experience"
              : "NutriScan-এর সম্পূর্ণ অভিজ্ঞতা আনলক করুন"}
        </AppText>
      </Card>

      <SectionHeading title={language === "en" ? "Plan Comparison" : "প্ল্যানের তুলনা"} />

      <View style={{ flexDirection: "row", gap: 10 }}>
        <Card style={{ flex: 1, gap: 10, padding: 13 }}>
          <AppText weight="bold" style={{ fontSize: 15 }}>
            {language === "en" ? "Free" : "ফ্রি"}
          </AppText>
          <View style={{ gap: 7 }}>
            {freeFeatures.map((item) => (
              <View key={item} style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}>
                <MaterialCommunityIcons name="check" size={14} color={palette.muted} style={{ marginTop: 2 }} />
                <AppText style={{ flex: 1, fontSize: 11, color: palette.muted, lineHeight: 15 }}>{item}</AppText>
              </View>
            ))}
          </View>
        </Card>

        <Card style={{ flex: 1, gap: 10, padding: 13, borderColor: palette.green, borderWidth: 1.5, backgroundColor: palette.greenSoft }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <AppText weight="bold" style={{ fontSize: 15, color: palette.green }}>
              {language === "en" ? "Premium" : "প্রিমিয়াম"}
            </AppText>
            <MaterialCommunityIcons name="crown" size={16} color={palette.amber} />
          </View>
          <View style={{ gap: 7 }}>
            {premiumFeatures.map((item) => (
              <View key={item} style={{ flexDirection: "row", alignItems: "flex-start", gap: 6 }}>
                <MaterialCommunityIcons name="check-circle" size={14} color={palette.green} style={{ marginTop: 2 }} />
                <AppText style={{ flex: 1, fontSize: 11, color: palette.ink, lineHeight: 15 }}>{item}</AppText>
              </View>
            ))}
          </View>
        </Card>
      </View>

      <SectionHeading title={language === "en" ? "Demo Pricing" : "ডেমো মূল্য"} />

      <View style={{ gap: 10 }}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: selectedPlan === "monthly" }}
          onPress={() => setSelectedPlan("monthly")}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 15,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: selectedPlan === "monthly" ? palette.green : palette.line,
            backgroundColor: selectedPlan === "monthly" ? palette.greenSoft : palette.card,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <View style={{ gap: 2 }}>
            <AppText weight="semibold" style={{ fontSize: 14 }}>
              {language === "en" ? "Monthly" : "মাসিক"}
            </AppText>
            <AppText style={{ fontSize: 11, color: palette.muted }}>
              {language === "en" ? "৳99/month (demo)" : "৳৯৯/মাস (ডেমো)"}
            </AppText>
          </View>
          <MaterialCommunityIcons
            name={selectedPlan === "monthly" ? "check-circle" : "circle-outline"}
            size={22}
            color={selectedPlan === "monthly" ? palette.green : palette.muted}
          />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: selectedPlan === "yearly" }}
          onPress={() => setSelectedPlan("yearly")}
          style={({ pressed }) => ({
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 15,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: selectedPlan === "yearly" ? palette.green : palette.line,
            backgroundColor: selectedPlan === "yearly" ? palette.greenSoft : palette.card,
            opacity: pressed ? 0.85 : 1,
          })}
        >
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <AppText weight="semibold" style={{ fontSize: 14 }}>
                {language === "en" ? "Yearly" : "বাৎসরিক"}
              </AppText>
              <Pill tone="amber">{language === "en" ? "Save 33%!" : "৩৩% সাশ্রয়!"}</Pill>
            </View>
            <AppText style={{ fontSize: 11, color: palette.muted }}>
              {language === "en" ? "৳799/year (demo)" : "৳৭৯৯/বছর (ডেমো)"}
            </AppText>
          </View>
          <MaterialCommunityIcons
            name={selectedPlan === "yearly" ? "check-circle" : "circle-outline"}
            size={22}
            color={selectedPlan === "yearly" ? palette.green : palette.muted}
          />
        </Pressable>

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            padding: 10,
            borderRadius: 12,
            backgroundColor: palette.amberSoft,
          }}
        >
          <MaterialCommunityIcons name="tag-outline" size={16} color={palette.amberInk} />
          <AppText style={{ color: palette.amberInk, fontSize: 11 }}>
            {language === "en" ? "Demo pricing only — no real payment" : "শুধুই ডেমো মূল্য — কোনো আসল পেমেন্ট নেই"}
          </AppText>
        </View>
      </View>

      {isPremium ? (
        <SecondaryButton
          title={language === "en" ? "Deactivate Premium (Demo)" : "প্রিমিয়াম নিষ্ক্রিয় করুন (ডেমো)"}
          icon="close-circle-outline"
          onPress={() => setIsPremium(false)}
        />
      ) : (
        <PrimaryButton
          title={language === "en" ? "Activate Premium — Demo" : "প্রিমিয়াম চালু করুন — ডেমো"}
          icon="crown-outline"
          onPress={() => setShowConfirmModal(true)}
        />
      )}

      {showConfirmModal ? (
        <Card style={{ gap: 12, backgroundColor: palette.greenSoft, borderColor: palette.green }}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialCommunityIcons name="check-decagram" size={24} color={palette.green} />
            <AppText weight="semibold" style={{ flex: 1, fontSize: 13 }}>
              {language === "en"
                ? "Premium activated! (Demo mode — no real payment was made)"
                : "প্রিমিয়াম চালু হয়েছে! (ডেমো মোড — কোনো আসল পেমেন্ট হয়নি)"}
            </AppText>
          </View>
          <PrimaryButton
            title={language === "en" ? "Continue" : "চালিয়ে যান"}
            onPress={() => {
              setIsPremium(true);
              setShowConfirmModal(false);
            }}
          />
        </Card>
      ) : null}

      <Card style={{ gap: 10 }}>
        <SectionHeading title={language === "en" ? "Included Features" : "অন্তর্ভুক্ত সুবিধাসমূহ"} />
        {premiumFeatures.map((feature) => (
          <View key={feature} style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <MaterialCommunityIcons name="check-circle-outline" size={18} color={palette.green} />
            <AppText style={{ fontSize: 12, flex: 1 }}>{feature}</AppText>
          </View>
        ))}
      </Card>

      <DemoNotice>
        {language === "en"
          ? "This is a demonstration. No payment is processed."
          : "এটি একটি ডেমো। কোনো পেমেন্ট প্রক্রিয়া করা হয় না।"}
      </DemoNotice>
    </Screen>
  );
}
