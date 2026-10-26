import React, { useMemo } from "react";
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

export type Palette = {
  paper: string;
  card: string;
  ink: string;
  green: string;
  greenSoft: string;
  onGreen: string;
  amber: string;
  amberSoft: string;
  amberInk: string;
  line: string;
  muted: string;
  clay: string;
  claySoft: string;
  clayInk: string;
  white: string;
  neutralSoft: string;
  photo: string;
  brandMark: string;
  cameraText: string;
};

const lightPalette: Palette = {
  paper: "#F6F8F5",
  card: "#FFFFFF",
  ink: "#182B24",
  green: "#176A4B",
  greenSoft: "#E6F3EB",
  onGreen: "#F5FBF6",
  amber: "#E5AA45",
  amberSoft: "#FFF3D9",
  amberInk: "#805915",
  line: "#E5EAE5",
  muted: "#718078",
  clay: "#C6534C",
  claySoft: "#FBE9E7",
  clayInk: "#873831",
  white: "#FFFFFF",
  neutralSoft: "#F0EEE8",
  photo: "#F4F5F0",
  brandMark: "#E9E5D9",
  cameraText: "#FFFFFF",
};

const darkPalette: Palette = {
  paper: "#111915",
  card: "#1C2721",
  ink: "#E8EFEA",
  green: "#83D6A4",
  greenSoft: "#233E31",
  onGreen: "#102018",
  amber: "#F2C36B",
  amberSoft: "#3B311F",
  amberInk: "#F1D18E",
  line: "#33443A",
  muted: "#A5B3AA",
  clay: "#FF8D7A",
  claySoft: "#422C2B",
  clayInk: "#FFB3A7",
  white: "#102018",
  neutralSoft: "#2A352F",
  photo: "#202E27",
  brandMark: "#34453B",
  cameraText: "#FFFFFF",
};

export function usePalette(): Palette {
  const { appearance } = useNutriScan();
  return appearance === "dark" ? darkPalette : lightPalette;
}

const createStyles = (colors: Palette) => StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.paper },
  scrollContent: { width: "100%", maxWidth: 520, alignSelf: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28, gap: 20 },
  staticContent: { width: "100%", maxWidth: 520, alignSelf: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 28 },
  header: { gap: 18 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  brandMark: { height: 40, width: 40, borderRadius: 13, backgroundColor: colors.brandMark, alignItems: "center", justifyContent: "center", position: "relative" },
  brandImage: { position: "absolute", width: 40, height: 40, borderRadius: 13 },
  backButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  leafDot: { height: 7, width: 7, borderRadius: 4, backgroundColor: colors.amber, position: "absolute", right: 7, top: 7, borderWidth: 1, borderColor: colors.card },
  smallHeaderButton: { width: 34, height: 34, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  languageToggle: { minWidth: 38, height: 34, paddingHorizontal: 7, borderRadius: 12, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.line, alignItems: "center", justifyContent: "center" },
  pageHeading: { gap: 6, marginTop: 4 },
  pageTitle: { fontSize: 25, lineHeight: 33, letterSpacing: -0.4, color: colors.ink },
  pageSubtitle: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  sectionHeading: { flexDirection: "row", alignItems: "center", gap: 12 },
  card: { borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, borderRadius: 20, padding: 16, gap: 13 },
  pill: { alignSelf: "flex-start", flexDirection: "row", alignItems: "center", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 100 },
  primaryButton: { minHeight: 50, borderRadius: 15, backgroundColor: colors.green, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 9, paddingHorizontal: 16 },
  secondaryButton: { minHeight: 46, borderRadius: 15, borderWidth: 1, borderColor: colors.line, backgroundColor: colors.card, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingHorizontal: 14 },
  productRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.line },
  productPhotoFrame: { width: 62, height: 62, borderRadius: 16, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  productPhoto: { width: 58, height: 58 },
  demoNotice: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 12, borderRadius: 14, backgroundColor: colors.amberSoft },
  iconTile: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
});

export function useUiStyles() {
  const colors = usePalette();
  return useMemo(() => createStyles(colors), [colors]);
}

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
  const colors = usePalette();
  return <Text {...props} style={[{ color: colors.ink, fontFamily: fontFamily(language, weight) }, style]}>{children}</Text>;
}

export function Screen({ children, scroll = true, contentStyle, ...props }: ViewProps & { scroll?: boolean; contentStyle?: ScrollViewProps["contentContainerStyle"] }) {
  const styles = useUiStyles();
  const content = scroll ? (
    <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, contentStyle]}>
      {children}
    </ScrollView>
  ) : <View style={[styles.staticContent, contentStyle as object]}>{children}</View>;
  return <SafeAreaView edges={["top"]} style={styles.safe} {...props}>{content}</SafeAreaView>;
}

export function PageHeader({ title, subtitle, right, back }: { title: string; subtitle?: string; right?: React.ReactNode; back?: () => void }) {
  const { language, setLanguage, appearance, setAppearance } = useNutriScan();
  const colors = usePalette();
  const styles = useUiStyles();
  const nextAppearance = appearance === "dark" ? "light" : "dark";
  const themeLabel = language === "en"
    ? `Switch to ${nextAppearance} mode`
    : nextAppearance === "dark" ? "ডার্ক মোড চালু করুন" : "লাইট মোড চালু করুন";
  return (
    <View style={styles.header}>
      <View style={styles.brandRow}>
        {back ? <Pressable accessibilityRole="button" accessibilityLabel={language === "en" ? "Go back" : "ফিরে যান"} onPress={back} style={styles.backButton}><MaterialCommunityIcons name="arrow-left" size={19} color={colors.ink} /></Pressable> : null}
        <View style={styles.brandMark}>
          {Platform.OS === "web" ? <Image source={{ uri: "/manus-storage/async-images/jZqB1d32vvPRkkJMnKCiin/image-1.webp" }} resizeMode="cover" style={styles.brandImage} /> : null}
          <MaterialCommunityIcons name="barcode-scan" size={22} color={colors.green} />
          <View style={styles.leafDot} />
        </View>
        <View style={{ flex: 1, minWidth: 44 }}>
          <AppText weight="bold" style={{ fontSize: 18, letterSpacing: 0.2 }}>{t(language, "brand")}</AppText>
          <AppText numberOfLines={1} style={{ color: colors.muted, fontSize: 9 }}>{t(language, "tagline")}</AppText>
        </View>
        <Pressable accessibilityRole="button" accessibilityLabel={language === "en" ? "Switch language" : "ভাষা পরিবর্তন করুন"} onPress={() => setLanguage(language === "en" ? "bn" : "en")} style={styles.languageToggle}>
          <AppText weight="semibold" style={{ fontSize: 11, color: colors.green }}>{language === "en" ? "বাংলা" : "EN"}</AppText>
        </Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel={themeLabel} accessibilityState={{ selected: appearance === "dark" }} onPress={() => setAppearance(nextAppearance)} style={styles.smallHeaderButton}>
          <MaterialCommunityIcons name={appearance === "dark" ? "weather-sunny" : "weather-night"} size={18} color={colors.green} />
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
  const colors = usePalette();
  const styles = useUiStyles();
  return (
    <View style={styles.sectionHeading}>
      <AppText weight="semibold" style={{ fontSize: 16, flex: 1 }}>{title}</AppText>
      {action && onAction ? <Pressable accessibilityRole="button" onPress={onAction} hitSlop={8}><AppText weight="semibold" style={{ color: colors.green, fontSize: 12 }}>{action}</AppText></Pressable> : null}
    </View>
  );
}

export function Card({ children, style, ...props }: ViewProps) {
  const styles = useUiStyles();
  return <View {...props} style={[styles.card, style]}>{children}</View>;
}

export function Pill({ children, tone = "green", style }: { children: React.ReactNode; tone?: "green" | "amber" | "clay" | "neutral"; style?: object }) {
  const colors = usePalette();
  const styles = useUiStyles();
  const tones = {
    green: { backgroundColor: colors.greenSoft, color: colors.green },
    amber: { backgroundColor: colors.amberSoft, color: colors.amberInk },
    clay: { backgroundColor: colors.claySoft, color: colors.clayInk },
    neutral: { backgroundColor: colors.neutralSoft, color: colors.muted },
  } as const;
  return <View style={[styles.pill, { backgroundColor: tones[tone].backgroundColor }, style]}><AppText weight="semibold" style={{ color: tones[tone].color, fontSize: 10 }}>{children}</AppText></View>;
}

export function PrimaryButton({ title, onPress, icon, disabled, style, ...props }: Omit<PressableProps, "style"> & { title: string; onPress?: () => void; icon?: keyof typeof MaterialCommunityIcons.glyphMap; disabled?: boolean; style?: StyleProp<ViewStyle> }) {
  const colors = usePalette();
  const styles = useUiStyles();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primaryButton, { opacity: disabled ? 0.5 : pressed ? 0.86 : 1 }, style]} {...props}>
      {icon ? <MaterialCommunityIcons name={icon} size={18} color={colors.onGreen} /> : null}
      <AppText weight="semibold" style={{ color: colors.onGreen, fontSize: 14 }}>{title}</AppText>
    </Pressable>
  );
}

export function SecondaryButton({ title, onPress, icon, style, ...props }: Omit<PressableProps, "style"> & { title: string; onPress?: () => void; icon?: keyof typeof MaterialCommunityIcons.glyphMap; style?: StyleProp<ViewStyle> }) {
  const colors = usePalette();
  const styles = useUiStyles();
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={({ pressed }) => [styles.secondaryButton, { opacity: pressed ? 0.84 : 1 }, style]} {...props}>
      {icon ? <MaterialCommunityIcons name={icon} size={17} color={colors.green} /> : null}
      <AppText weight="semibold" style={{ color: colors.green, fontSize: 13 }}>{title}</AppText>
    </Pressable>
  );
}

export function ProductRow({ product, onPress, aside }: { product: Product; onPress: () => void; aside?: React.ReactNode }) {
  const { language } = useNutriScan();
  const colors = usePalette();
  const styles = useUiStyles();
  const tint = product.category === "food" ? colors.greenSoft : product.category === "personalCare" ? colors.amberSoft : colors.claySoft;
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={`${productName(product, language)}, ${productBrand(product, language)}`} onPress={onPress} style={({ pressed }) => [styles.productRow, { opacity: pressed ? 0.86 : 1 }]}>
      <View style={[styles.productPhotoFrame, { backgroundColor: tint }]}><Image source={product.image} resizeMode="contain" style={styles.productPhoto} /></View>
      <View style={{ flex: 1, gap: 3 }}>
        <AppText weight="semibold" numberOfLines={1} style={{ fontSize: 13 }}>{productName(product, language)}</AppText>
        <AppText numberOfLines={1} style={{ color: colors.muted, fontSize: 10 }}>{productBrand(product, language)} · {categoryLabel(product.category, language)}</AppText>
      </View>
      {aside ?? <MaterialCommunityIcons name="chevron-right" size={20} color={colors.muted} />}
    </Pressable>
  );
}

export function DemoNotice({ children }: { children?: React.ReactNode }) {
  const { language } = useNutriScan();
  const colors = usePalette();
  const styles = useUiStyles();
  return (
    <View style={styles.demoNotice}>
      <MaterialCommunityIcons name="information-outline" size={16} color={colors.amberInk} />
      <AppText style={{ flex: 1, color: colors.amberInk, fontSize: 11, lineHeight: 16 }}>{children ?? t(language, "demoNote")}</AppText>
    </View>
  );
}

export function IconTile({ icon, tone = "green" }: { icon: keyof typeof MaterialCommunityIcons.glyphMap; tone?: "green" | "amber" | "clay" }) {
  const colors = usePalette();
  const styles = useUiStyles();
  const color = tone === "amber" ? colors.amberInk : tone === "clay" ? colors.clay : colors.green;
  const backgroundColor = tone === "amber" ? colors.amberSoft : tone === "clay" ? colors.claySoft : colors.greenSoft;
  return <View style={[styles.iconTile, { backgroundColor }]}><MaterialCommunityIcons name={icon} size={21} color={color} /></View>;
}
