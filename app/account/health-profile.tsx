import { useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  Card,
  ChipSelect,
  DemoNotice,
  PageHeader,
  PrimaryButton,
  Screen,
  SectionHeading,
  fontFamily,
  usePalette,
} from "@/components/nutriscan-ui";
import type { Language, Localized } from "@/lib/nutriscan-data";
import { t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

const GENDER_OPTIONS: { value: string; label: Localized }[] = [
  { value: "male", label: { en: "Male", bn: "পুরুষ" } },
  { value: "female", label: { en: "Female", bn: "নারী" } },
  { value: "prefer-not-to-say", label: { en: "Prefer not to say", bn: "উল্লেখ করতে চাই না" } },
];

const CONDITION_OPTIONS: { value: string; label: Localized }[] = [
  { value: "diabetes", label: { en: "Diabetes", bn: "ডায়াবেটিস" } },
  { value: "high-blood-pressure", label: { en: "High Blood Pressure", bn: "উচ্চ রক্তচাপ" } },
  { value: "heart-disease", label: { en: "Heart Disease", bn: "হৃদরোগ" } },
  { value: "thyroid", label: { en: "Thyroid Condition", bn: "থাইরয়েড সমস্যা" } },
  { value: "high-cholesterol", label: { en: "High Cholesterol", bn: "উচ্চ কোলেস্টেরল" } },
  { value: "asthma", label: { en: "Asthma", bn: "হাঁপানি" } },
  { value: "kidney-disease", label: { en: "Kidney Disease", bn: "কিডনি রোগ" } },
  { value: "liver-condition", label: { en: "Liver Condition", bn: "লিভারের সমস্যা" } },
  { value: "obesity", label: { en: "Obesity", bn: "স্থূলতা" } },
  { value: "none", label: { en: "None", bn: "কোনোটিই নয়" } },
];

const DIETARY_OPTIONS: { value: string; label: Localized }[] = [
  { value: "vegetarian", label: { en: "Vegetarian", bn: "নিরামিষভোজী" } },
  { value: "vegan", label: { en: "Vegan", bn: "ভেগান" } },
  { value: "gluten-free", label: { en: "Gluten-free", bn: "গ্লুটেন-মুক্ত" } },
  { value: "dairy-free", label: { en: "Dairy-free", bn: "দুগ্ধ-মুক্ত" } },
  { value: "halal", label: { en: "Halal", bn: "হালাল" } },
  { value: "kosher", label: { en: "Kosher", bn: "কোশার" } },
  { value: "low-carb", label: { en: "Low-carb", bn: "লো-কার্ব" } },
  { value: "keto", label: { en: "Keto", bn: "কিটো" } },
];

const ALLERGY_OPTIONS: { value: string; label: Localized }[] = [
  { value: "peanuts", label: { en: "Peanuts", bn: "চিনাবাদাম" } },
  { value: "tree-nuts", label: { en: "Tree Nuts", bn: "গাছের বাদাম" } },
  { value: "shellfish", label: { en: "Shellfish", bn: "শেলফিশ" } },
  { value: "fish", label: { en: "Fish", bn: "মাছ" } },
  { value: "wheat-gluten", label: { en: "Wheat/Gluten", bn: "গম/গ্লুটেন" } },
  { value: "eggs", label: { en: "Eggs", bn: "ডিম" } },
  { value: "milk-dairy", label: { en: "Milk/Dairy", bn: "দুধ/দুগ্ধজাত" } },
  { value: "soy", label: { en: "Soy", bn: "সয়া" } },
  { value: "none", label: { en: "None", bn: "কোনোটিই নয়" } },
];

const INTOLERANCE_OPTIONS: { value: string; label: Localized }[] = [
  { value: "lactose", label: { en: "Lactose", bn: "ল্যাকটোজ" } },
  { value: "gluten", label: { en: "Gluten", bn: "গ্লুটেন" } },
  { value: "fructose", label: { en: "Fructose", bn: "ফ্রুক্টোজ" } },
  { value: "histamine", label: { en: "Histamine", bn: "হিস্টামিন" } },
  { value: "none", label: { en: "None", bn: "কোনোটিই নয়" } },
];

function toggleWithNone(current: string[], value: string): string[] {
  if (value === "none") {
    return current.includes("none") ? [] : ["none"];
  }
  const withoutNone = current.filter((item) => item !== "none");
  return withoutNone.includes(value)
    ? withoutNone.filter((item) => item !== value)
    : [...withoutNone, value];
}

function togglePlain(current: string[], value: string): string[] {
  return current.includes(value)
    ? current.filter((item) => item !== value)
    : [...current, value];
}

function SelectableChipSection({
  title,
  baseOptions,
  selected,
  onChange,
  placeholder,
  language,
  exclusiveNone = false,
}: {
  title: string;
  baseOptions: { value: string; label: Localized }[];
  selected: string[];
  onChange: (next: string[]) => void;
  placeholder: string;
  language: Language;
  exclusiveNone?: boolean;
}) {
  const palette = usePalette();
  const baseValueSet = new Set(baseOptions.map((opt) => opt.value));
  const [customItems, setCustomItems] = useState<string[]>(() =>
    selected.filter((item) => !baseValueSet.has(item)),
  );
  const [draft, setDraft] = useState("");

  const mergedOptions: { value: string; label: Localized }[] = [
    ...baseOptions,
    ...customItems.map((item) => ({ value: item, label: { en: item, bn: item } })),
  ];

  const handleToggle = (val: string) => {
    onChange(exclusiveNone ? toggleWithNone(selected, val) : togglePlain(selected, val));
  };

  const handleAddManual = () => {
    const clean = draft.trim();
    if (!clean) return;
    const lower = clean.toLowerCase();

    const matchedBase = baseOptions.find(
      (opt) =>
        opt.value.toLowerCase() === lower ||
        opt.label.en.toLowerCase() === lower ||
        opt.label.bn.toLowerCase() === lower,
    );

    if (matchedBase) {
      if (!selected.includes(matchedBase.value)) {
        onChange(
          exclusiveNone
            ? toggleWithNone(selected, matchedBase.value)
            : togglePlain(selected, matchedBase.value),
        );
      }
      setDraft("");
      return;
    }

    const matchedCustom = customItems.find((item) => item.toLowerCase() === lower);
    const targetValue = matchedCustom ?? clean;
    if (!matchedCustom) {
      setCustomItems((curr) => [...curr, clean]);
    }
    if (!selected.includes(targetValue)) {
      const baseSelected = exclusiveNone
        ? selected.filter((item) => item !== "none")
        : selected;
      onChange([...baseSelected, targetValue]);
    }
    setDraft("");
  };

  return (
    <Card style={{ gap: 12 }}>
      <SectionHeading title={title} />
      <ChipSelect
        options={mergedOptions}
        selected={selected}
        onToggle={handleToggle}
        language={language}
      />
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 8,
          paddingTop: 4,
          borderTopWidth: 1,
          borderTopColor: palette.line,
        }}
      >
        <TextInput
          value={draft}
          onChangeText={setDraft}
          onSubmitEditing={handleAddManual}
          returnKeyType="done"
          placeholder={placeholder}
          placeholderTextColor={palette.muted}
          style={{
            flex: 1,
            minHeight: 44,
            borderWidth: 1,
            borderColor: palette.line,
            backgroundColor: palette.paper,
            borderRadius: 12,
            paddingHorizontal: 12,
            paddingVertical: 10,
            fontSize: 13,
            color: palette.ink,
            fontFamily: fontFamily(language, "regular"),
          }}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={language === "en" ? `Add ${title}` : `${title} যোগ করুন`}
          onPress={handleAddManual}
          disabled={!draft.trim()}
          style={({ pressed }) => ({
            minHeight: 44,
            paddingHorizontal: 14,
            borderRadius: 12,
            backgroundColor: draft.trim() ? palette.greenSoft : palette.neutralSoft,
            borderWidth: 1,
            borderColor: draft.trim() ? palette.green : palette.line,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 5,
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <MaterialCommunityIcons
            name="plus"
            size={17}
            color={draft.trim() ? palette.green : palette.muted}
          />
          <AppText
            weight="semibold"
            style={{
              fontSize: 12,
              color: draft.trim() ? palette.green : palette.muted,
            }}
          >
            {language === "en" ? "Add" : "যোগ"}
          </AppText>
        </Pressable>
      </View>
    </Card>
  );
}

export default function HealthProfileScreen() {
  const router = useRouter();
  const palette = usePalette();
  const { language, profile, demoAccount, updateProfile, healthProfile, setHealthProfile } = useNutriScan();

  const [displayName, setDisplayName] = useState(profile.displayName || demoAccount.name);
  const [age, setAge] = useState(healthProfile.age);
  const [gender, setGender] = useState(healthProfile.gender || "prefer-not-to-say");
  const [country, setCountry] = useState(healthProfile.country || "Bangladesh");
  const [conditions, setConditions] = useState<string[]>(healthProfile.healthConditions);
  const [dietary, setDietary] = useState<string[]>(healthProfile.dietaryRestrictions);
  const [allergies, setAllergies] = useState<string[]>(healthProfile.foodAllergies);
  const [intolerances, setIntolerances] = useState<string[]>(healthProfile.foodIntolerances);
  const [saved, setSaved] = useState(false);

  const inputStyle = {
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.paper,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 11,
    fontSize: 13,
    color: palette.ink,
    fontFamily: fontFamily(language, "regular"),
  };

  const handleSave = () => {
    updateProfile({ displayName: displayName.trim() });
    setHealthProfile({
      age: age.trim(),
      gender,
      country: country.trim() || "Bangladesh",
      healthConditions: conditions,
      dietaryRestrictions: dietary,
      foodAllergies: allergies,
      foodIntolerances: intolerances,
    });
    setSaved(true);
  };

  return (
    <Screen contentStyle={{ gap: 16 }}>
      <PageHeader
        title={t(language, "healthProfile")}
        subtitle={language === "en" ? "Personalize your health & dietary context" : "আপনার স্বাস্থ্য ও খাদ্যাভ্যাসের তথ্য সাজান"}
        back={() => router.back()}
      />

      <DemoNotice>
        {language === "en"
          ? "Stored locally on this device for prototype personalization. Not medical advice."
          : "প্রোটোটাইপ পার্সোনালাইজেশনের জন্য এই ডিভাইসে সংরক্ষিত। এটি চিকিৎসা পরামর্শ নয়।"}
      </DemoNotice>

      <Card style={{ gap: 14 }}>
        <SectionHeading title={language === "en" ? "Personal Info" : "ব্যক্তিগত তথ্য"} />
        <View style={{ gap: 6 }}>
          <AppText weight="medium" style={{ fontSize: 12, color: palette.muted }}>
            {t(language, "displayName")}
          </AppText>
          <TextInput
            value={displayName}
            onChangeText={(text) => {
              setDisplayName(text);
              setSaved(false);
            }}
            placeholder={t(language, "displayNamePlaceholder")}
            placeholderTextColor={palette.muted}
            style={inputStyle}
          />
        </View>

        <View style={{ gap: 6 }}>
          <AppText weight="medium" style={{ fontSize: 12, color: palette.muted }}>
            {language === "en" ? "Age" : "বয়স"}
          </AppText>
          <TextInput
            value={age}
            onChangeText={(text) => {
              setAge(text.replace(/[^0-9]/g, ""));
              setSaved(false);
            }}
            keyboardType="number-pad"
            placeholder="24"
            placeholderTextColor={palette.muted}
            style={inputStyle}
          />
        </View>

        <View style={{ gap: 6 }}>
          <AppText weight="medium" style={{ fontSize: 12, color: palette.muted }}>
            {language === "en" ? "Gender" : "লিঙ্গ"}
          </AppText>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {GENDER_OPTIONS.map((opt) => {
              const selected = gender === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                  onPress={() => {
                    setGender(opt.value);
                    setSaved(false);
                  }}
                  style={({ pressed }) => ({
                    minHeight: 38,
                    borderRadius: 100,
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderWidth: 1,
                    borderColor: selected ? palette.green : palette.line,
                    backgroundColor: selected ? palette.green : palette.card,
                    alignItems: "center",
                    justifyContent: "center",
                    opacity: pressed ? 0.84 : 1,
                  })}
                >
                  <AppText
                    weight={selected ? "semibold" : "medium"}
                    style={{ fontSize: 12, color: selected ? palette.onGreen : palette.ink }}
                  >
                    {opt.label[language]}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={{ gap: 6 }}>
          <AppText weight="medium" style={{ fontSize: 12, color: palette.muted }}>
            {language === "en" ? "Country" : "দেশ"}
          </AppText>
          <TextInput
            value={country}
            onChangeText={(text) => {
              setCountry(text);
              setSaved(false);
            }}
            placeholder="Bangladesh"
            placeholderTextColor={palette.muted}
            style={inputStyle}
          />
        </View>
      </Card>

      <SelectableChipSection
        title={language === "en" ? "Health Conditions" : "স্বাস্থ্য অবস্থা"}
        baseOptions={CONDITION_OPTIONS}
        selected={conditions}
        onChange={(next) => {
          setConditions(next);
          setSaved(false);
        }}
        placeholder={language === "en" ? "Add another condition manually..." : "নিজে অন্য কোনো অবস্থা লিখুন..."}
        language={language}
        exclusiveNone
      />

      <SelectableChipSection
        title={language === "en" ? "Dietary Restrictions" : "খাদ্যতালিকাগত বিধিনিষেধ"}
        baseOptions={DIETARY_OPTIONS}
        selected={dietary}
        onChange={(next) => {
          setDietary(next);
          setSaved(false);
        }}
        placeholder={language === "en" ? "Add another restriction manually..." : "নিজে অন্য কোনো বিধিনিষেধ লিখুন..."}
        language={language}
      />

      <SelectableChipSection
        title={language === "en" ? "Food Allergies" : "খাবারে অ্যালার্জি"}
        baseOptions={ALLERGY_OPTIONS}
        selected={allergies}
        onChange={(next) => {
          setAllergies(next);
          setSaved(false);
        }}
        placeholder={language === "en" ? "Add another allergy manually..." : "নিজে অন্য কোনো অ্যালার্জি লিখুন..."}
        language={language}
        exclusiveNone
      />

      <SelectableChipSection
        title={language === "en" ? "Food Intolerances" : "খাদ্য অসহিষ্ণুতা"}
        baseOptions={INTOLERANCE_OPTIONS}
        selected={intolerances}
        onChange={(next) => {
          setIntolerances(next);
          setSaved(false);
        }}
        placeholder={language === "en" ? "Add another intolerance manually..." : "নিজে অন্য কোনো অসহিষ্ণুতা লিখুন..."}
        language={language}
        exclusiveNone
      />

      <PrimaryButton
        title={language === "en" ? "Save Health Profile" : "স্বাস্থ্য প্রোফাইল সংরক্ষণ করুন"}
        icon="content-save-outline"
        onPress={handleSave}
      />

      {saved ? (
        <Card style={{ flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: palette.greenSoft }}>
          <MaterialCommunityIcons name="check-circle" size={20} color={palette.green} />
          <AppText weight="semibold" style={{ color: palette.green, fontSize: 13 }}>
            {language === "en" ? "Health profile saved on this device." : "স্বাস্থ্য প্রোফাইল এই ডিভাইসে সংরক্ষিত হয়েছে।"}
          </AppText>
        </Card>
      ) : null}
    </Screen>
  );
}
