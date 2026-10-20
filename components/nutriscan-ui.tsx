import React from "react";
import {
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type PressableProps,
  type ScrollViewProps,
  type StyleProp,
  type TextProps,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { categoryLabel, productBrand, productName, t } from "@/lib/nutriscan-data";
import type { Language, Product } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

export const palette = {
  paper: "#F6F3EA",
  card: "#FFFEFA",
  ink: "#26372E",
  green: "#1F5C45",
  greenSoft: "#E7EFE7",
  amber: "#E7B85C",
  amberSoft: "#F8EED8",
  line: "#E7E0D3",
  muted: "#758078",
  clay: "#A95D47",
  claySoft: "#F5E7E0",
  white: "#FFFFFF",
};

export const fontFamily = (language: Language, weight: "regular" | "medium" | "semibold" | "bold" = "regular") => {
  if (language === "bn") {
    return weight === "bold" ? "NotoSansBengali_700Bold" : weight === "semibold" ? "NotoSansBengali_600SemiBold" : weight === "medium" ? "NotoSansBengali_500Medium" : "NotoSansBengali_400Regular";
  }
  return weight === "bold" ? "NotoSansBengali_700Bold" : weight === "semibold" ? "NotoSansBengali_600SemiBold" : weight === "medium" ? "NotoSansBengali_500Medium" : "NotoSansBengali_400Regular";
};

export function AppText({
  children,
  style,
  weight = "regular",
  ...props
}: TextProps & { weight?: "regular" | "medium" | "semibold" | "bold" }) {
  const { language } = useNutriScan();
  return <Text {...props} style={[{ color: palette.ink, fontFamily: fontFamily(language, weight) }, style]}>{children}</Text>;
}

export function Screen({ children, scroll = true, contentStyle, ...props }: ViewProps & { scroll?: boolean; contentStyle?: ScrollViewProps["contentContainerStyle"] }) {
  const content = scroll ? (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, contentStyle]}>
      {children}
    </ScrollView>
  ) : <View style={[styles.staticContent, contentStyle as object]}>{children}</View>;
  return <SafeAreaView edges={["top"]} style={styles.safe} {...props}>{content}</SafeAreaView>;
}

export function PageHeader({ title, subtitle, right }: { title: string; subtitle?: string; right?: React.ReactNode }) {
  const { language, setLanguage } = useNutriScan();
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        <View style={styles.brandMark}>
          {Platform.OS === "web" ? <Image source={{ uri: "/manus-storage/async-images/jZqB1d32vvPRkkJMnKCiin/image-1.webp" }} resizeMode="cover" style={styles.brandImage} /> : null}
          <MaterialCommunityIcons name="barcode-scan" size={22} color={palette.green} />
          <View style={styles.leafDot} />
        </View>
        <View style={{ flex: 1 }}>
          <AppText weight="bold" style={{ fontSize: 18, letterSpacing: 0.2 }}>{t(language, "brand")}</AppText>
          <AppText style={{ color: palette.muted, fontSize: 10 }}>{t(language, "tagline")}</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={language === "en" ? "Switch to Bangla" : "Switch to English"}
          onPress={() => setLanguage(language === "en" ? "bn" : "en")}
          style={styles.languageToggle}
        >
          <AppText weight="semibold" style={{ fontSize: 12, color: palette.green }}>{language === "en" ? "বাংলা" : "EN"}</AppText>
        </Pressable>
        {right}
      </View>
      {title ? <View style={styles.pageHeading}>
        <AppText weight="bold" style={styles.pageTitle}>{title}</AppText>
        {subtitle ? <AppText style={styles.pageSubtitle}>{subtitle}</AppText> : null}
      </View> : null}
    </View>
  );
}

export function SectionHeading({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return (
    <View style={styles.sectionHeading}>
      <AppText weight="semibold" style={{ fontSize: 16, flex: 1 }}>{title}</AppText>
      {action && onAction ? <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}><AppText weight="semibold" style={{ color: palette.green, fontSize: 12 }}>{action}</AppText></Pressable> : null}
    </View>
  );
}

export function Card({ children, style, ...props }: ViewProps) {
  return <View {...props} style={[styles.card, style]}>{children}</View>;
}

export function Pill({ children, tone = "green", style }: { children: React.ReactNode; tone?: "green" | "amber" | "clay" | "neutral"; style?: object }) {
  const tones = {
    green: { backgroundColor: palette.greenSoft, color: palette.green },
    amber: { backgroundColor: palette.amberSoft, color: "#805915" },
    clay: { backgroundColor: palette.claySoft, color: palette.clay },
    neutral: { backgroundColor: "#F0EEE8", color: palette.muted },
  } as const;
  return <View style={[styles.pill, { backgroundColor: tones[tone].backgroundColor }, style]}><AppText weight="semibold" style={{ color: tones[tone].color, fontSize: 10 }}>{children}</AppText></View>;
}

export function PrimaryButton({ title, onPress, icon, disabled, style, ...props }: Omit<PressableProps, "style"> & { title: string; onPress?: () => void; icon?: keyof typeof MaterialCommunityIcons.glyphMap; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primaryButton, { opacity: disabled ? 0.5 : pressed ? 0.86 : 1 }, style]} {...props}>
      {icon ? <MaterialCommunityIcons name={icon} size={18} color={palette.white} /> : null}
      <AppText weight="semibold" style={{ color: palette.white, fontSize: 14 }}>{title}</AppText>
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, icon, style, ...props }: Omit<PressableProps, "style"> & { title: string; onPress?: () => void; icon?: keyof typeof MaterialCommunityIcons.glyphMap; style?: StyleProp<ViewStyle> }) {
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.84 : 1 }, style]} {...props}>
      {icon ? <MaterialCommunityIcons name={icon} size={17} color={palette.green} /> : null}
      <AppText weight="semibold" style={{ color: palette.green, fontSize: 13 }}>{title}</AppText>
    </Pressable>
  );
}

export function ProductRow({ product, onPress, aside }: { product: Product; onPress: () => void; aside?: React.ReactNode }) {
  const { language } = useNutriScan();
  const icon = product.category === "food" ? "food-apple-outline" : product.category === "personalCare" ? "bottle-tonic-outline" : "spray-bottle";
  const tint = product.category === "food" ? palette.greenSoft : product.category === "personalCare" ? palette.amberSoft : palette.claySoft;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.productRow, { opacity: pressed ? 0.85 : 1 }]}>
      <View style={[styles.productIcon, { backgroundColor: tint }]}><MaterialCommunityIcons name={icon} size={22} color={palette.green} /></View>
      <View style={{ flex: 1, gap: 3 }}>
        <AppText weight="semibold" numberOfLines={1} style={{ fontSize: 13 }}>{productName(product, language)}</AppText>
        <AppText numberOfLines={1} style={{ color: palette.muted, fontSize: 10 }}>{productBrand(product, language)} · {categoryLabel(product.category, language)}</AppText>
      </View>
      {aside ?? <MaterialCommunityIcons name="chevron-right" size={20} color={palette.muted} />}
    </Pressable>
  );
}

export function DemoNotice({ children }: { children?: React.ReactNode }) {
  const { language } = useNutriScan();
  return (
    <View style={styles.demoNotice}>
      <MaterialCommunityIcons name="information-outline" size={16} color="#805915" />
      <AppText style={{ flex: 1, color: "#6D5428", fontSize: 11, lineHeight: 16 }}>{children ?? t(language, "demoNote")}</AppText>
    </View>
  );
}

export function IconTile({ icon, tone = "green" }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; tone?: "green" | "amber" | "clay" }) {
  const color = tone === "amber" ? "#805915" : tone === "clay" ? palette.clay : palette.green;
  const backgroundColor = tone === "amber" ? palette.amberSoft : tone === "clay" ? palette.claySoft : palette.greenSoft;
  return <View style={[styles.iconTile, { backgroundColor }]}><MaterialCommunityIcons name={icon} size={21} color={color} /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: palette.paper },
  scrollContent: { width: "100%", maxWidth: 520, alignSelf: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28, gap: 20 },
  staticContent: { width: "100%", maxWidth: 520, alignSelf: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 },
  header: { gap: 18 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  brandMark: { height: 40, width: 40, borderRadius: 13, backgroundColor: "#E9E5D9", alignItems: "center", justifyContent: "center", position: "relative" },
  brandImage: { position: "absolute", width: 40, height: 40, borderRadius: 13 },
  leafDot: { height: 7, width: 7, borderRadius: 4, backgroundColor: palette.amber, position: "absolute", right: 7, top: 7, borderWidth: 1, borderColor: palette.card },
  languageToggle: { minWidth: 45, height: 34, paddingHorizontal: 8, borderRadius: 18, backgroundColor: palette.card, borderWidth: 1, borderColor: palette.line, alignItems: "center", justifyContent: "center" },
  pageHeading: { gap: 6, marginTop: 4 },
  pageTitle: { fontSize: 25, lineHeight: 33, letterSpacing: -0.4 },
  pageSubtitle: { color: palette.muted, fontSize: 13, lineHeight: 20 },
  sectionHeading: { flexDirection: "row", alignItems: "center", gap: 12 },
  card: { borderWidth: 1, borderColor: palette.line, backgroundColor: palette.card, borderRadius: 20, padding: 16, gap: 13 },
  pill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100 },
  primaryButton: { minHeight: 50, borderRadius: 15, backgroundColor: palette.green, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, paddingHorizontal: 16 },
  secondaryButton: { minHeight: 46, borderRadius: 15, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.card, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 14 },
  productRow: { flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 12, borderTopWidth: 1, borderTopColor: palette.line },
  productIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  demoNotice: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 14, backgroundColor: palette.amberSoft },
  iconTile: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
});
