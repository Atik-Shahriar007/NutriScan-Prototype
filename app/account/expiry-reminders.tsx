import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  Card,
  DemoNotice,
  EmptyState,
  PageHeader,
  Pill,
  PrimaryButton,
  Screen,
  SectionHeading,
  usePalette,
} from "@/components/nutriscan-ui";
import { useNutriScan } from "@/lib/nutriscan-state";

function daysUntil(isoDate: string): number | null {
  const target = new Date(isoDate);
  if (Number.isNaN(target.getTime())) return null;
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate()).getTime();
  return Math.round((startOfTarget - startOfToday) / 86_400_000);
}

export default function ExpiryRemindersScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { language, expiryReminders, addExpiryReminder, removeExpiryReminder } = useNutriScan();

  const [productName, setProductName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [error, setError] = useState("");

  const inputStyle = {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.paper,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: palette.ink,
  };

  const handleAdd = () => {
    const trimmedName = productName.trim();
    const d = Number.parseInt(day, 10);
    const m = Number.parseInt(month, 10);
    const y = Number.parseInt(year, 10);

    if (!trimmedName) {
      setError(language === "en" ? "Please enter a product name." : "পণ্যের নাম লিখুন।");
      return;
    }
    if (!Number.isFinite(d) || !Number.isFinite(m) || !Number.isFinite(y) || d < 1 || d > 31 || m < 1 || m > 12 || y < 2024 || y > 2050) {
      setError(language === "en" ? "Enter a valid DD / MM / YYYY date." : "সঠিক দিন / মাস / বছর লিখুন।");
      return;
    }

    const paddedMonth = String(m).padStart(2, "0");
    const paddedDay = String(d).padStart(2, "0");
    const iso = `${y}-${paddedMonth}-${paddedDay}`;
    const parsed = new Date(iso);
    if (Number.isNaN(parsed.getTime())) {
      setError(language === "en" ? "Invalid calendar date." : "অবৈধ তারিখ।");
      return;
    }

    addExpiryReminder({ productName: trimmedName, expiryDate: iso });
    setProductName("");
    setDay("");
    setMonth("");
    setYear("");
    setError("");
  };

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader
        title={language === "en" ? "Expiry Reminders" : "মেয়াদের রিমাইন্ডার"}
        back={() => router.back()}
      />

      <Card style={{ gap: 12 }}>
        <SectionHeading title={language === "en" ? "Add Reminder" : "রিমাইন্ডার যোগ করুন"} />
        <View style={{ gap: 6 }}>
          <AppText weight="medium" style={{ fontSize: 12, color: palette.muted }}>
            {language === "en" ? "Product Name" : "পণ্যের নাম"}
          </AppText>
          <TextInput
            value={productName}
            onChangeText={(text) => {
              setProductName(text);
              setError("");
            }}
            placeholder={language === "en" ? "e.g. Milk carton, Mango juice" : "যেমন: দুধের কার্টন, আমের জুস"}
            placeholderTextColor={palette.muted}
            style={inputStyle}
          />
        </View>

        <View style={{ gap: 6 }}>
          <AppText weight="medium" style={{ fontSize: 12, color: palette.muted }}>
            {language === "en" ? "Expiry Date (DD / MM / YYYY)" : "মেয়াদ শেষের তারিখ (দিন / মাস / বছর)"}
          </AppText>
          <View style={{ flexDirection: "row", gap: 8 }}>
            <TextInput
              value={day}
              onChangeText={(text) => {
                setDay(text.replace(/[^0-9]/g, "").slice(0, 2));
                setError("");
              }}
              keyboardType="number-pad"
              placeholder="DD"
              placeholderTextColor={palette.muted}
              style={[inputStyle, { flex: 1, textAlign: "center" }]}
            />
            <TextInput
              value={month}
              onChangeText={(text) => {
                setMonth(text.replace(/[^0-9]/g, "").slice(0, 2));
                setError("");
              }}
              keyboardType="number-pad"
              placeholder="MM"
              placeholderTextColor={palette.muted}
              style={[inputStyle, { flex: 1, textAlign: "center" }]}
            />
            <TextInput
              value={year}
              onChangeText={(text) => {
                setYear(text.replace(/[^0-9]/g, "").slice(0, 4));
                setError("");
              }}
              keyboardType="number-pad"
              placeholder="YYYY"
              placeholderTextColor={palette.muted}
              style={[inputStyle, { flex: 1.4, textAlign: "center" }]}
            />
          </View>
        </View>

        {error ? (
          <AppText style={{ color: palette.clay, fontSize: 11 }}>{error}</AppText>
        ) : null}

        <PrimaryButton
          title={language === "en" ? "Add Reminder" : "রিমাইন্ডার যোগ করুন"}
          icon="calendar-plus"
          onPress={handleAdd}
        />
      </Card>

      <SectionHeading title={language === "en" ? "Your Reminders" : "আপনার রিমাইন্ডারসমূহ"} />

      {expiryReminders.length === 0 ? (
        <Card>
          <EmptyState
            icon="calendar-clock-outline"
            title={language === "en" ? "No expiry reminders yet" : "এখনও কোনো রিমাইন্ডার নেই"}
            body={
              language === "en"
                ? "Add a product and best-before date above to keep track locally."
                : "স্থানীয়ভাবে হিসাব রাখতে উপরে পণ্য ও মেয়াদ শেষের তারিখ যোগ করুন।"
            }
          />
        </Card>
      ) : (
        <View style={{ gap: 10 }}>
          {expiryReminders.map((item) => {
            const diff = daysUntil(item.expiryDate);
            const badge: { tone: "green" | "amber" | "clay"; label: string } =
              diff === null
                ? { tone: "amber", label: item.expiryDate }
                : diff > 7
                  ? { tone: "green", label: language === "en" ? "Safe" : "নিরাপদ" }
                  : diff >= 1
                    ? { tone: "amber", label: language === "en" ? "Expiring Soon" : "শীঘ্রই মেয়াদ শেষ" }
                    : diff === 0
                      ? { tone: "amber", label: language === "en" ? "Expires Today" : "আজ মেয়াদ শেষ" }
                      : { tone: "clay", label: language === "en" ? "Expired" : "মেয়াদোত্তীর্ণ" };

            const formattedDate = new Date(item.expiryDate).toLocaleDateString(
              language === "bn" ? "bn-BD" : "en-GB",
              { day: "numeric", month: "short", year: "numeric" },
            );

            const daysText =
              diff === null
                ? ""
                : diff > 0
                  ? language === "en"
                    ? `${diff} day${diff === 1 ? "" : "s"} left`
                    : `${diff} দিন বাকি`
                  : diff === 0
                    ? language === "en"
                      ? "Today"
                      : "আজ"
                    : language === "en"
                      ? `${Math.abs(diff)} day${Math.abs(diff) === 1 ? "" : "s"} ago`
                      : `${Math.abs(diff)} দিন আগে`;

            return (
              <Card key={item.id} style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    backgroundColor: palette.greenSoft,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <MaterialCommunityIcons name="calendar-outline" size={20} color={palette.green} />
                </View>
                <View style={{ flex: 1, gap: 4 }}>
                  <AppText weight="bold" style={{ fontSize: 14 }}>
                    {item.productName}
                  </AppText>
                  <AppText style={{ color: palette.muted, fontSize: 11 }}>
                    {formattedDate} · {daysText}
                  </AppText>
                  <Pill tone={badge.tone}>{badge.label}</Pill>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={language === "en" ? "Delete reminder" : "রিমাইন্ডার মুছুন"}
                  onPress={() => removeExpiryReminder(item.id)}
                  hitSlop={8}
                  style={({ pressed }) => ({
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    backgroundColor: palette.claySoft,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: pressed ? 0.75 : 1,
                  })}
                >
                  <MaterialCommunityIcons name="delete-outline" size={18} color={palette.clay} />
                </Pressable>
              </Card>
            );
          })}
        </View>
      )}

      <DemoNotice>
        {language === "en"
          ? "Reminders are stored locally. Push notifications are not connected in this prototype."
          : "রিমাইন্ডারগুলো ডিভাইসে সংরক্ষিত থাকে। এই প্রোটোটাইপে পুশ নোটিফিকেশন যুক্ত নয়।"}
      </DemoNotice>
    </Screen>
  );
}
