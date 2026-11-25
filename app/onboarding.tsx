import { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import {
  AppText,
  Card,
  IconTile,
  PrimaryButton,
  Screen,
  SecondaryButton,
  TabSwitcher,
  fontFamily,
  usePalette,
} from "@/components/nutriscan-ui";
import { useNutriScan } from "@/lib/nutriscan-state";

const nutriScanMark = require("../assets/images/nutriscan-mark.png");

export default function OnboardingScreen() {
  const router = useRouter();
  const palette = usePalette();
  const {
    language,
    setIsAuthenticated,
    setHasCompletedOnboarding,
    setDemoAccount,
    updateProfile,
  } = useNutriScan();

  const [slide, setSlide] = useState<0 | 1 | 2>(0);
  const [authTab, setAuthTab] = useState<"signin" | "register">("signin");

  const [email, setEmail] = useState("demo@nutriscan.app");
  const [password, setPassword] = useState("••••••••");

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);

  const inputStyle = {
    minHeight: 48,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: palette.line,
    backgroundColor: palette.card,
    paddingHorizontal: 14,
    color: palette.ink,
    fontFamily: fontFamily(language),
    fontSize: 14,
  } as const;

  const completeAuth = (name?: string, userEmail?: string) => {
    if (name && userEmail) {
      setDemoAccount({ name, email: userEmail });
      updateProfile({ displayName: name });
    }
    setIsAuthenticated(true);
    setHasCompletedOnboarding(true);
    router.replace("/(tabs)");
  };

  const handleSignIn = () => {
    if (!email.trim() || !password.trim()) {
      setError(
        language === "en"
          ? "Please enter both email and password."
          : "অনুগ্রহ করে ইমেইল এবং পাসওয়ার্ড দিন।",
      );
      return;
    }
    setError(null);
    completeAuth();
  };

  const handleRegister = () => {
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regConfirm.trim()) {
      setError(
        language === "en"
          ? "Please fill in all required fields."
          : "অনুগ্রহ করে সব প্রয়োজনীয় ঘর পূরণ করুন।",
      );
      return;
    }
    if (regPassword !== regConfirm) {
      setError(
        language === "en"
          ? "Passwords do not match."
          : "পাসওয়ার্ড দুটি মেলেনি।",
      );
      return;
    }
    setError(null);
    completeAuth(regName.trim(), regEmail.trim());
  };

  const features = [
    {
      icon: "barcode-scan" as const,
      title: language === "en" ? "Scan Products" : "পণ্য স্ক্যান করুন",
      body:
        language === "en"
          ? "Instantly look up local food, personal care, and household items."
          : "স্থানীয় খাবার, পার্সোনাল কেয়ার ও গৃহস্থালি পণ্য দ্রুত খুঁজুন।",
    },
    {
      icon: "flask-outline" as const,
      title: language === "en" ? "Understand Ingredients" : "উপাদান বুঝুন",
      body:
        language === "en"
          ? "See clear breakdowns of nutrition panels, additives, and label notes."
          : "পুষ্টি-তথ্য, অ্যাডিটিভ এবং লেবেলের বিবরণ সহজে দেখুন।",
    },
    {
      icon: "robot-outline" as const,
      title: language === "en" ? "Get Personalized Insights" : "ব্যক্তিগত পরামর্শ পান",
      body:
        language === "en"
          ? "Tailor your shelf with Halal Mode, Child Safe Mode, and Nouri."
          : "হালাল মোড, শিশু-নিরাপদ মোড ও নৌরির মাধ্যমে তথ্য পান।",
    },
  ];

  return (
    <Screen contentStyle={{ flexGrow: 1, justifyContent: "space-between", paddingVertical: 24, gap: 24 }}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={{ flex: 1, justifyContent: "center" }}>
        {slide === 0 ? (
          <View style={{ alignItems: "center", gap: 20, paddingVertical: 20 }}>
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 30,
                backgroundColor: palette.card,
                borderWidth: 1,
                borderColor: palette.line,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Image source={nutriScanMark} resizeMode="contain" style={{ width: 92, height: 92, borderRadius: 26 }} />
            </View>
            <View style={{ alignItems: "center", gap: 8 }}>
              <AppText weight="bold" style={{ fontSize: 32, lineHeight: 40, textAlign: "center", letterSpacing: -0.6 }}>
                {language === "en" ? "Know What You Eat" : "আপনি কী খান, জেনে নিন"}
              </AppText>
              <AppText style={{ color: palette.muted, fontSize: 15, lineHeight: 22, textAlign: "center" }}>
                {language === "en"
                  ? "Bangladesh's food intelligence companion"
                  : "বাংলাদেশের খাদ্য-তথ্যের বিশ্বস্ত সঙ্গী"}
              </AppText>
            </View>
            <View style={{ width: "100%", gap: 12, marginTop: 12 }}>
              <PrimaryButton
                title={language === "en" ? "Get Started" : "শুরু করুন"}
                icon="arrow-right"
                onPress={() => setSlide(1)}
              />
              <Pressable
                accessibilityRole="button"
                onPress={() => setSlide(2)}
                style={({ pressed }) => ({
                  minHeight: 44,
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: pressed ? 0.72 : 1,
                })}
              >
                <AppText weight="semibold" style={{ color: palette.green, fontSize: 14 }}>
                  {language === "en" ? "Sign in" : "সাইন ইন করুন"}
                </AppText>
              </Pressable>
            </View>
          </View>
        ) : slide === 1 ? (
          <View style={{ gap: 16 }}>
            <View style={{ gap: 6 }}>
              <AppText weight="bold" style={{ fontSize: 26, lineHeight: 34 }}>
                {language === "en" ? "What NutriScan does" : "NutriScan যা করে"}
              </AppText>
              <AppText style={{ color: palette.muted, fontSize: 13, lineHeight: 20 }}>
                {language === "en"
                  ? "Clear, bilingual label intelligence designed for everyday shopping."
                  : "দৈনন্দিন কেনাকাটার জন্য সহজ ও দ্বিভাষিক লেবেল তথ্য।"}
              </AppText>
            </View>
            <View style={{ gap: 12 }}>
              {features.map((item) => (
                <Card key={item.title} style={{ flexDirection: "row", alignItems: "center", gap: 14 }}>
                  <IconTile icon={item.icon} tone="green" />
                  <View style={{ flex: 1, gap: 3 }}>
                    <AppText weight="semibold" style={{ fontSize: 15 }}>{item.title}</AppText>
                    <AppText style={{ color: palette.muted, fontSize: 12, lineHeight: 18 }}>{item.body}</AppText>
                  </View>
                </Card>
              ))}
            </View>
            <PrimaryButton
              title={language === "en" ? "Continue" : "এগিয়ে যান"}
              icon="arrow-right"
              onPress={() => setSlide(2)}
              style={{ marginTop: 6 }}
            />
          </View>
        ) : (
          <View style={{ gap: 18 }}>
            <View style={{ gap: 6 }}>
              <AppText weight="bold" style={{ fontSize: 26, lineHeight: 34 }}>
                {authTab === "signin"
                  ? language === "en"
                    ? "Welcome back"
                    : "স্বাগতম"
                  : language === "en"
                    ? "Create your account"
                    : "নতুন অ্যাকাউন্ট তৈরি করুন"}
              </AppText>
              <AppText style={{ color: palette.muted, fontSize: 13, lineHeight: 20 }}>
                {language === "en"
                  ? "Sign in to continue or try the local demo."
                  : "চালিয়ে যেতে সাইন ইন করুন অথবা ডেমো ব্যবহার করুন।"}
              </AppText>
            </View>

            <TabSwitcher
              tabs={[
                { key: "signin", label: language === "en" ? "Sign In" : "সাইন ইন" },
                { key: "register", label: language === "en" ? "Register" : "নিবন্ধন" },
              ]}
              activeKey={authTab}
              onSelect={(key) => {
                setAuthTab(key as "signin" | "register");
                setError(null);
              }}
            />

            {authTab === "signin" ? (
              <Card style={{ gap: 12 }}>
                <View style={{ gap: 6 }}>
                  <AppText weight="semibold" style={{ fontSize: 12 }}>
                    {language === "en" ? "Email" : "ইমেইল"}
                  </AppText>
                  <TextInput
                    value={email}
                    onChangeText={(v) => {
                      setEmail(v);
                      setError(null);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="demo@nutriscan.app"
                    placeholderTextColor={palette.muted}
                    style={inputStyle}
                  />
                </View>
                <View style={{ gap: 6 }}>
                  <AppText weight="semibold" style={{ fontSize: 12 }}>
                    {language === "en" ? "Password" : "পাসওয়ার্ড"}
                  </AppText>
                  <TextInput
                    value={password}
                    onChangeText={(v) => {
                      setPassword(v);
                      setError(null);
                    }}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={palette.muted}
                    style={inputStyle}
                  />
                </View>
                {error ? (
                  <AppText style={{ color: palette.clay, fontSize: 12 }}>{error}</AppText>
                ) : null}
                <PrimaryButton
                  title={language === "en" ? "Sign In" : "সাইন ইন"}
                  icon="login"
                  onPress={handleSignIn}
                />
                <SecondaryButton
                  title={language === "en" ? "Try the demo" : "ডেমো দেখুন"}
                  icon="star-outline"
                  onPress={() => completeAuth()}
                />
              </Card>
            ) : (
              <Card style={{ gap: 12 }}>
                <View style={{ gap: 6 }}>
                  <AppText weight="semibold" style={{ fontSize: 12 }}>
                    {language === "en" ? "Name" : "নাম"}
                  </AppText>
                  <TextInput
                    value={regName}
                    onChangeText={(v) => {
                      setRegName(v);
                      setError(null);
                    }}
                    placeholder={language === "en" ? "Your name" : "আপনার নাম"}
                    placeholderTextColor={palette.muted}
                    style={inputStyle}
                  />
                </View>
                <View style={{ gap: 6 }}>
                  <AppText weight="semibold" style={{ fontSize: 12 }}>
                    {language === "en" ? "Email" : "ইমেইল"}
                  </AppText>
                  <TextInput
                    value={regEmail}
                    onChangeText={(v) => {
                      setRegEmail(v);
                      setError(null);
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="you@example.com"
                    placeholderTextColor={palette.muted}
                    style={inputStyle}
                  />
                </View>
                <View style={{ gap: 6 }}>
                  <AppText weight="semibold" style={{ fontSize: 12 }}>
                    {language === "en" ? "Password" : "পাসওয়ার্ড"}
                  </AppText>
                  <TextInput
                    value={regPassword}
                    onChangeText={(v) => {
                      setRegPassword(v);
                      setError(null);
                    }}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={palette.muted}
                    style={inputStyle}
                  />
                </View>
                <View style={{ gap: 6 }}>
                  <AppText weight="semibold" style={{ fontSize: 12 }}>
                    {language === "en" ? "Confirm password" : "পাসওয়ার্ড নিশ্চিত করুন"}
                  </AppText>
                  <TextInput
                    value={regConfirm}
                    onChangeText={(v) => {
                      setRegConfirm(v);
                      setError(null);
                    }}
                    secureTextEntry
                    placeholder="••••••••"
                    placeholderTextColor={palette.muted}
                    style={inputStyle}
                  />
                </View>
                {error ? (
                  <AppText style={{ color: palette.clay, fontSize: 12 }}>{error}</AppText>
                ) : null}
                <PrimaryButton
                  title={language === "en" ? "Create Account" : "অ্যাকাউন্ট তৈরি করুন"}
                  icon="account-plus-outline"
                  onPress={handleRegister}
                />
              </Card>
            )}
          </View>
        )}
      </KeyboardAvoidingView>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingTop: 8 }}>
        {([0, 1, 2] as const).map((index) => {
          const active = slide === index;
          return (
            <Pressable
              key={index}
              accessibilityRole="button"
              accessibilityLabel={`Slide ${index + 1}`}
              onPress={() => setSlide(index)}
              hitSlop={8}
              style={{
                width: active ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: active ? palette.green : palette.line,
              }}
            />
          );
        })}
      </View>
    </Screen>
  );
}
