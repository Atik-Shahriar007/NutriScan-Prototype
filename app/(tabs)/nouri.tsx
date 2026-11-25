import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  AppText,
  DemoNotice,
  ProductRow,
  Screen,
  fontFamily,
  usePalette,
} from "@/components/nutriscan-ui";
import type { Palette } from "@/components/nutriscan-ui";
import {
  generateNouriResponse,
  getSuggestedQuestions,
  type NouriResponseCard,
} from "@/lib/nouri-engine";
import { productById, t } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";

function TypingIndicator({ palette }: { palette: Palette }) {
  const [dots] = useState(() => [
    new Animated.Value(0.3),
    new Animated.Value(0.3),
    new Animated.Value(0.3),
  ]);

  useEffect(() => {
    const pulse = (val: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(val, { toValue: 1, duration: 350, useNativeDriver: true }),
          Animated.timing(val, { toValue: 0.3, duration: 350, useNativeDriver: true }),
          Animated.delay(Math.max(0, 400 - delay)),
        ]),
      );

    const animations = dots.map((dot, idx) => pulse(dot, idx * 180));
    animations.forEach((a) => a.start());
    return () => {
      animations.forEach((a) => a.stop());
    };
  }, [dots]);

  return (
    <View style={{ alignSelf: "flex-start", maxWidth: "82%", gap: 6 }}>
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: palette.greenSoft,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <MaterialCommunityIcons name="robot-outline" size={16} color={palette.green} />
      </View>
      <View
        style={{
          backgroundColor: palette.card,
          borderWidth: 1,
          borderColor: palette.line,
          borderRadius: 18,
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          gap: 6,
        }}
      >
        {dots.map((anim, idx) => (
          <Animated.View
            key={idx}
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: palette.green,
              opacity: anim,
            }}
          />
        ))}
      </View>
    </View>
  );
}

function formatMessageTime(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

const createStyles = (palette: Palette) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      gap: 12,
      paddingHorizontal: 20,
      paddingTop: 10,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: palette.line,
      backgroundColor: palette.paper,
    },
    headerAvatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: palette.greenSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    infoButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
    },
    contextNoticeWrap: {
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    contextBanner: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      marginHorizontal: 20,
      marginTop: 10,
      paddingHorizontal: 14,
      paddingVertical: 10,
      minHeight: 44,
      borderRadius: 14,
      backgroundColor: palette.amberSoft,
    },
    chatScroll: {
      flex: 1,
    },
    chatContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 20,
      gap: 16,
    },
    welcomeWrap: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 28,
      paddingBottom: 12,
      gap: 14,
    },
    welcomeAvatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: palette.greenSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    suggestionsScroll: {
      marginTop: 8,
      marginHorizontal: -20,
    },
    suggestionsContent: {
      paddingHorizontal: 20,
      gap: 8,
    },
    suggestionChip: {
      minHeight: 44,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 100,
      backgroundColor: palette.card,
      borderWidth: 1,
      borderColor: palette.line,
      alignItems: "center",
      justifyContent: "center",
    },
    nouriRow: {
      alignSelf: "flex-start",
      maxWidth: "85%",
      gap: 6,
    },
    nouriMiniAvatar: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: palette.greenSoft,
      alignItems: "center",
      justifyContent: "center",
    },
    nouriBubble: {
      backgroundColor: palette.card,
      borderWidth: 1,
      borderColor: palette.line,
      borderRadius: 18,
      padding: 12,
      gap: 10,
    },
    userRow: {
      alignSelf: "flex-end",
      maxWidth: "82%",
      alignItems: "flex-end",
      gap: 4,
    },
    userBubble: {
      backgroundColor: palette.green,
      borderRadius: 18,
      padding: 12,
    },
    timestamp: {
      fontSize: 10,
      color: palette.muted,
      paddingHorizontal: 4,
    },
    actionCardButton: {
      minHeight: 44,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 12,
      backgroundColor: palette.greenSoft,
    },
    inputBar: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 10,
      paddingHorizontal: 16,
      paddingVertical: 10,
      backgroundColor: palette.card,
      borderTopWidth: 1,
      borderTopColor: palette.line,
    },
    textInput: {
      flex: 1,
      minHeight: 44,
      maxHeight: 110,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 22,
      backgroundColor: palette.paper,
      borderWidth: 1,
      borderColor: palette.line,
      fontSize: 14,
      color: palette.ink,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: palette.green,
      alignItems: "center",
      justifyContent: "center",
    },
  });

export default function NouriTab() {
  const router = useRouter();
  const palette = usePalette();
  const styles = useMemo(() => createStyles(palette), [palette]);

  const {
    language,
    isAuthenticated,
    healthProfile,
    history,
    nouriHistory,
    addNouriMessage,
  } = useNutriScan();

  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [cardsByMsgCount, setCardsByMsgCount] = useState<
    Record<string, NouriResponseCard[]>
  >({});

  const scrollRef = useRef<ScrollView>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastProductId = history[0]?.productId;

  const activePreferencesCount =
    healthProfile.healthConditions.length +
    healthProfile.nutritionGoals.length +
    healthProfile.foodAllergies.length +
    healthProfile.dietaryRestrictions.length;

  const suggestedQuestions = useMemo(
    () => getSuggestedQuestions(language, healthProfile),
    [language, healthProfile],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    const id = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 60);
    return () => clearTimeout(id);
  }, [nouriHistory.length, isTyping]);

  const handleSend = (overrideText?: string) => {
    const raw = typeof overrideText === "string" ? overrideText : inputText;
    const trimmed = raw.trim();
    if (!trimmed || isTyping) return;

    addNouriMessage({ role: "user", text: trimmed });
    if (typeof overrideText !== "string") {
      setInputText("");
    }
    setIsTyping(true);

    const expectedIndex = nouriHistory.length + 1;
    timerRef.current = setTimeout(() => {
      const response = generateNouriResponse(
        trimmed,
        language,
        healthProfile,
        lastProductId,
      );
      addNouriMessage({ role: "nouri", text: response.text });
      if (response.cards && response.cards.length > 0) {
        setCardsByMsgCount((prev) => ({
          ...prev,
          [String(expectedIndex)]: response.cards!,
        }));
      }
      setIsTyping(false);
    }, 1200);
  };

  const canSend = inputText.trim().length > 0 && !isTyping;

  return (
    <Screen
      scroll={false}
      contentStyle={{
        flex: 1,
        paddingHorizontal: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        {/* Custom Compact Header */}
        <View style={styles.header}>
          <View style={styles.headerAvatar}>
            <MaterialCommunityIcons
              name="robot-outline"
              size={22}
              color={palette.green}
            />
          </View>
          <View style={{ flex: 1, gap: 1 }}>
            <AppText weight="bold" style={{ fontSize: 17 }}>
              {t(language, "nouri")}
            </AppText>
            <AppText style={{ fontSize: 11, color: palette.muted }}>
              {language === "en" ? "AI Nutrition Assistant" : "AI পুষ্টি সহকারী"}
            </AppText>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              language === "en" ? "About Nouri" : "নৌরি সম্পর্কে"
            }
            onPress={() => setShowInfo((prev) => !prev)}
            style={({ pressed }) => [
              styles.infoButton,
              { opacity: pressed ? 0.72 : 1 },
            ]}
          >
            <MaterialCommunityIcons
              name="information-outline"
              size={22}
              color={palette.muted}
            />
          </Pressable>
        </View>

        {/* Info Context Notice */}
        {showInfo ? (
          <View style={styles.contextNoticeWrap}>
            <DemoNotice>
              {language === "en"
                ? "Nouri provides general nutrition information for this prototype and is not a substitute for professional medical advice."
                : "নৌরি এই প্রোটোটাইপে সাধারণ পুষ্টি-তথ্য দেয় এবং এটি পেশাদার চিকিৎসা-পরামর্শের বিকল্প নয়।"}
            </DemoNotice>
          </View>
        ) : null}

        {/* Authenticated Health Profile Context Banner */}
        {isAuthenticated ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              language === "en"
                ? "Open health profile"
                : "স্বাস্থ্য প্রোফাইল খুলুন"
            }
            onPress={() => router.push("/account/health-profile" as any)}
            style={({ pressed }) => [
              styles.contextBanner,
              { opacity: pressed ? 0.84 : 1 },
            ]}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, flex: 1 }}>
              <MaterialCommunityIcons
                name="heart-pulse"
                size={16}
                color={palette.amberInk}
              />
              <View style={{ flex: 1 }}>
                <AppText
                  weight="semibold"
                  style={{ fontSize: 12, color: palette.amberInk }}
                >
                  {language === "en"
                    ? "Nouri sees your health profile"
                    : "নৌরি আপনার স্বাস্থ্য প্রোফাইল দেখছে"}
                </AppText>
                <AppText style={{ fontSize: 10, color: palette.amberInk }}>
                  {language === "en"
                    ? `${activePreferencesCount} preferences active`
                    : `${activePreferencesCount}টি পছন্দ সক্রিয়`}
                </AppText>
              </View>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={18}
              color={palette.amberInk}
            />
          </Pressable>
        ) : null}

        {/* Chat Area */}
        <ScrollView
          ref={scrollRef}
          style={styles.chatScroll}
          contentContainerStyle={styles.chatContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {nouriHistory.length === 0 ? (
            <View style={styles.welcomeWrap}>
              <View style={styles.welcomeAvatar}>
                <MaterialCommunityIcons
                  name="robot-outline"
                  size={36}
                  color={palette.green}
                />
              </View>
              <AppText weight="bold" style={{ fontSize: 22, textAlign: "center" }}>
                {language === "en" ? "Hi! I'm Nouri" : "হ্যালো! আমি নৌরি"}
              </AppText>
              <AppText
                style={{
                  fontSize: 13,
                  lineHeight: 20,
                  color: palette.muted,
                  textAlign: "center",
                  paddingHorizontal: 12,
                }}
              >
                {language === "en"
                  ? "Ask me about packaged food labels, NQSS scores, ingredients, halal verification, or healthier local alternatives."
                  : "প্যাকেটজাত খাবারের লেবেল, NQSS স্কোর, উপাদান, হালাল যাচাই বা স্বাস্থ্যকর বিকল্প নিয়ে আমাকে জিজ্ঞাসা করুন।"}
              </AppText>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.suggestionsScroll}
                contentContainerStyle={styles.suggestionsContent}
              >
                {suggestedQuestions.map((question) => (
                  <Pressable
                    key={question}
                    accessibilityRole="button"
                    onPress={() => handleSend(question)}
                    style={({ pressed }) => [
                      styles.suggestionChip,
                      { opacity: pressed ? 0.78 : 1 },
                    ]}
                  >
                    <AppText
                      weight="medium"
                      style={{ fontSize: 12, color: palette.green }}
                    >
                      {question}
                    </AppText>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          ) : (
            nouriHistory.map((msg, index) => {
              if (msg.role === "user") {
                return (
                  <View key={msg.id} style={styles.userRow}>
                    <View style={styles.userBubble}>
                      <AppText
                        style={{
                          fontSize: 14,
                          lineHeight: 20,
                          color: palette.onGreen,
                        }}
                      >
                        {msg.text}
                      </AppText>
                    </View>
                    <AppText style={styles.timestamp}>
                      {formatMessageTime(msg.timestamp)}
                    </AppText>
                  </View>
                );
              }

              const cards = cardsByMsgCount[String(index)];
              return (
                <View key={msg.id} style={styles.nouriRow}>
                  <View style={styles.nouriMiniAvatar}>
                    <MaterialCommunityIcons
                      name="robot-outline"
                      size={16}
                      color={palette.green}
                    />
                  </View>
                  <View style={styles.nouriBubble}>
                    <AppText style={{ fontSize: 14, lineHeight: 21 }}>
                      {msg.text}
                    </AppText>
                    {cards?.map((card, cardIdx) => {
                      if (card.type === "product" && card.productId) {
                        const prod = productById(card.productId);
                        if (!prod) return null;
                        return (
                          <ProductRow
                            key={`prod-${cardIdx}`}
                            product={prod}
                            onPress={() =>
                              router.push({
                                pathname: "/product/[id]",
                                params: { id: prod.id },
                              })
                            }
                          />
                        );
                      }
                      if (
                        card.type === "action" &&
                        card.actionLabel &&
                        card.actionRoute
                      ) {
                        return (
                          <Pressable
                            key={`act-${cardIdx}`}
                            accessibilityRole="button"
                            onPress={() => router.push(card.actionRoute as any)}
                            style={({ pressed }) => [
                              styles.actionCardButton,
                              { opacity: pressed ? 0.8 : 1 },
                            ]}
                          >
                            <AppText
                              weight="semibold"
                              style={{ fontSize: 13, color: palette.green }}
                            >
                              {card.actionLabel}
                            </AppText>
                            <MaterialCommunityIcons
                              name="arrow-right"
                              size={16}
                              color={palette.green}
                            />
                          </Pressable>
                        );
                      }
                      return null;
                    })}
                  </View>
                  <AppText style={styles.timestamp}>
                    {formatMessageTime(msg.timestamp)}
                  </AppText>
                </View>
              );
            })
          )}

          {isTyping ? <TypingIndicator palette={palette} /> : null}
        </ScrollView>

        {/* Sticky Input Bar */}
        <View style={styles.inputBar}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={
              language === "en"
                ? "Ask Nouri anything..."
                : "নৌরিকে যেকোনো কিছু জিজ্ঞেস করুন..."
            }
            placeholderTextColor={palette.muted}
            multiline
            style={[
              styles.textInput,
              { fontFamily: fontFamily(language, "regular") },
            ]}
            accessibilityLabel={
              language === "en" ? "Message Nouri" : "নৌরিকে বার্তা লিখুন"
            }
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={language === "en" ? "Send message" : "পাঠান"}
            accessibilityState={{ disabled: !canSend }}
            disabled={!canSend}
            onPress={() => handleSend()}
            style={({ pressed }) => [
              styles.sendButton,
              {
                opacity: !canSend ? 0.45 : pressed ? 0.84 : 1,
              },
            ]}
          >
            <MaterialCommunityIcons
              name="send"
              size={20}
              color={palette.onGreen}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}
