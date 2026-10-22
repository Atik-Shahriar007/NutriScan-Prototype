import { useEffect, useState } from "react";
import { Pressable, TextInput, View } from "react-native";
import { AppText, Card, DemoNotice, PageHeader, Pill, PrimaryButton, Screen, palette, fontFamily } from "@/components/nutriscan-ui";
import type { Product } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";
import { trpc } from "@/lib/trpc";

type Form = { nameEn: string; nameBn: string; brandEn: string; brandBn: string; sizeEn: string; sizeBn: string; descriptionEn: string; descriptionBn: string; ingredients: string; nutritionServingEn: string; nutritionServingBn: string; nutritionValues: string; nutritionStatus: "verified" | "demo" | "unknown"; nutritionSourceEn: string; nutritionSourceBn: string; evidence: string };

function formFromDraft(draft: Product): Form {
  return { nameEn: draft.name.en, nameBn: draft.name.bn, brandEn: draft.brand.en, brandBn: draft.brand.bn, sizeEn: draft.size.en, sizeBn: draft.size.bn, descriptionEn: draft.description.en, descriptionBn: draft.description.bn, ingredients: draft.ingredients.map((item) => `${item.en} | ${item.bn}`).join("\n"), nutritionServingEn: draft.nutrition?.serving.en ?? "Per serving", nutritionServingBn: draft.nutrition?.serving.bn ?? "প্রতি পরিবেশন", nutritionValues: draft.nutrition?.values.map((item) => `${item.label.en} | ${item.label.bn} | ${item.value.en} | ${item.value.bn}`).join("\n") ?? "", nutritionStatus: draft.nutrition?.status ?? "unknown", nutritionSourceEn: draft.nutrition?.source?.en ?? "", nutritionSourceBn: draft.nutrition?.source?.bn ?? "", evidence: draft.evidence.map((item) => `${item.label.en} | ${item.label.bn} | ${item.value.en} | ${item.value.bn} | ${item.status} | ${item.source?.en ?? ""} | ${item.source?.bn ?? ""}`).join("\n") };
}

export default function CatalogAdminScreen() {
  const { language } = useNutriScan();
  const draftsQuery = trpc.catalog.drafts.useQuery(undefined, { retry: false });
  const utils = trpc.useUtils();
  const publishMutation = trpc.catalog.publish.useMutation();
  const [forms, setForms] = useState<Record<string, Form>>({});
  const [activeId, setActiveId] = useState<string>();
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (!draftsQuery.data) return;
    setForms((current) => Object.fromEntries(draftsQuery.data.map((draft) => [draft.id, current[draft.id] ?? formFromDraft(draft)])));
  }, [draftsQuery.data]);

  const update = (id: string, key: keyof Form, value: string) => setForms((current) => ({ ...current, [id]: { ...current[id], [key]: value } }));
  const publish = async (draft: Product) => {
    const form = forms[draft.id] ?? formFromDraft(draft);
    const ingredients = form.ingredients.split("\n").map((line) => {
      const [en, ...bnParts] = line.split("|");
      return { en: en?.trim() ?? "", bn: bnParts.join("|").trim() };
    }).filter((item) => item.en && item.bn);
    if (!ingredients.length) { setNotice(language === "en" ? "Add at least one ingredient as English | Bangla." : "কমপক্ষে একটি উপাদান English | Bangla ফরম্যাটে দিন।"); return; }
    const nutritionValues = form.nutritionValues.split("\n").map((line) => {
      const [labelEn, labelBn, valueEn, ...valueBnParts] = line.split("|");
      return { label: { en: labelEn?.trim() ?? "", bn: labelBn?.trim() ?? "" }, value: { en: valueEn?.trim() ?? "", bn: valueBnParts.join("|").trim() } };
    }).filter((item) => item.label.en && item.label.bn && item.value.en && item.value.bn);
    const evidence = form.evidence.split("\n").map((line) => {
      const [labelEn, labelBn, valueEn, valueBn, status, sourceEn, ...sourceBnParts] = line.split("|");
      const normalizedStatus = status?.trim();
      return { label: { en: labelEn?.trim() ?? "", bn: labelBn?.trim() ?? "" }, value: { en: valueEn?.trim() ?? "", bn: valueBn?.trim() ?? "" }, status: (normalizedStatus === "verified" || normalizedStatus === "demo" ? normalizedStatus : "unknown") as "verified" | "demo" | "unknown", source: sourceEn?.trim() || sourceBnParts.length ? { en: sourceEn?.trim() ?? "", bn: sourceBnParts.join("|").trim() } : undefined };
    }).filter((item) => item.label.en && item.label.bn && item.value.en && item.value.bn);
    if (!nutritionValues.length) { setNotice(language === "en" ? "Add at least one nutrition row as Label EN | Label বাংলা | Value EN | Value বাংলা." : "কমপক্ষে একটি পুষ্টি সারি দিন: Label EN | Label বাংলা | Value EN | Value বাংলা।"); return; }
    if (!evidence.length) { setNotice(language === "en" ? "Add at least one evidence row before publishing." : "প্রকাশের আগে অন্তত একটি প্রমাণের সারি দিন।"); return; }
    setActiveId(draft.id);
    setNotice("");
    try {
      await publishMutation.mutateAsync({ id: draft.id, nameEn: form.nameEn, nameBn: form.nameBn, brandEn: form.brandEn, brandBn: form.brandBn, sizeEn: form.sizeEn, sizeBn: form.sizeBn, descriptionEn: form.descriptionEn, descriptionBn: form.descriptionBn, ingredients, nutrition: { serving: { en: form.nutritionServingEn, bn: form.nutritionServingBn }, values: nutritionValues, status: form.nutritionStatus, source: form.nutritionSourceEn || form.nutritionSourceBn ? { en: form.nutritionSourceEn, bn: form.nutritionSourceBn } : undefined }, evidence });
      await utils.catalog.drafts.invalidate();
      await utils.catalog.list.invalidate();
      setNotice(language === "en" ? "Published to the public catalog." : "পাবলিক ক্যাটালগে প্রকাশিত হয়েছে।");
    } catch {
      setNotice(language === "en" ? "Publication failed. Check admin access and required fields." : "প্রকাশ ব্যর্থ হয়েছে। অ্যাডমিন অ্যাক্সেস ও আবশ্যিক তথ্য দেখুন।");
    } finally {
      setActiveId(undefined);
    }
  };

  const fieldStyle = { minHeight: 43, borderRadius: 12, borderWidth: 1, borderColor: palette.line, backgroundColor: palette.card, paddingHorizontal: 11, color: palette.ink, fontFamily: fontFamily(language), fontSize: 11 } as const;
  const field = (draft: Product, key: keyof Form, label: string, placeholder: string) => <View style={{ flex: 1, gap: 4 }}><AppText weight="semibold" style={{ fontSize: 10 }}>{label}</AppText><TextInput value={(forms[draft.id] ?? formFromDraft(draft))[key]} onChangeText={(value) => update(draft.id, key, value)} placeholder={placeholder} placeholderTextColor={palette.muted} style={fieldStyle} /></View>;

  return <Screen contentStyle={{ gap: 16 }}>
    <PageHeader title={language === "en" ? "Catalog enrichment" : "ক্যাটালগ বিস্তারিত যোগ"} subtitle={language === "en" ? "Complete a draft record before publishing it publicly." : "পাবলিক করার আগে খসড়া রেকর্ড সম্পূর্ণ করুন।"} />
    <DemoNotice>{language === "en" ? "Publishing requires localized names, brand, size, description and at least one bilingual ingredient. This action changes the record from draft to published." : "প্রকাশের জন্য দুই ভাষায় নাম, ব্র্যান্ড, সাইজ, বিবরণ ও অন্তত একটি দ্বিভাষিক উপাদান আবশ্যক। এতে রেকর্ড খসড়া থেকে প্রকাশিত হবে।"}</DemoNotice>
    {notice ? <Card style={{ backgroundColor: notice.includes("failed") || notice.includes("ব্যর্থ") ? palette.claySoft : palette.greenSoft }}><AppText style={{ color: notice.includes("failed") || notice.includes("ব্যর্থ") ? palette.clay : palette.green, fontSize: 11 }}>{notice}</AppText></Card> : null}
    {draftsQuery.isLoading ? <Card><AppText style={{ color: palette.muted, fontSize: 12 }}>{language === "en" ? "Loading drafts…" : "খসড়া লোড হচ্ছে…"}</AppText></Card> : draftsQuery.error ? <Card style={{ backgroundColor: palette.claySoft }}><AppText weight="semibold" style={{ color: palette.clay }}>{language === "en" ? "Admin access required" : "অ্যাডমিন অ্যাক্সেস প্রয়োজন"}</AppText></Card> : draftsQuery.data?.length ? draftsQuery.data.map((draft) => { const current = forms[draft.id] ?? formFromDraft(draft); return <Card key={draft.id} style={{ gap: 11 }}><View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><View style={{ flex: 1 }}><AppText weight="semibold" style={{ fontSize: 15 }}>{draft.name.en}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{draft.id} · {draft.barcode}</AppText></View><Pill tone="amber">{language === "en" ? "Draft" : "খসড়া"}</Pill></View><View style={{ flexDirection: "row", gap: 8 }}>{field(draft, "nameEn", "Name · EN", "English name")}{field(draft, "nameBn", "নাম · বাংলা", "বাংলা নাম")}</View><View style={{ flexDirection: "row", gap: 8 }}>{field(draft, "brandEn", "Brand · EN", "English brand")}{field(draft, "brandBn", "ব্র্যান্ড · বাংলা", "বাংলা ব্র্যান্ড")}</View><View style={{ flexDirection: "row", gap: 8 }}>{field(draft, "sizeEn", "Size · EN", "e.g. 250 ml")}{field(draft, "sizeBn", "সাইজ · বাংলা", "যেমন ২৫০ মি.লি.")}</View><View style={{ gap: 4 }}><AppText weight="semibold" style={{ fontSize: 10 }}>Description · EN / বাংলা</AppText><TextInput multiline value={current.descriptionEn} onChangeText={(value) => update(draft.id, "descriptionEn", value)} style={[fieldStyle, { minHeight: 66, textAlignVertical: "top", paddingTop: 10 }]} /><TextInput multiline value={current.descriptionBn} onChangeText={(value) => update(draft.id, "descriptionBn", value)} style={[fieldStyle, { minHeight: 66, textAlignVertical: "top", paddingTop: 10 }]} /></View><View style={{ gap: 4 }}><AppText weight="semibold" style={{ fontSize: 10 }}>Ingredients · one per line: English | বাংলা</AppText><TextInput multiline value={current.ingredients} onChangeText={(value) => update(draft.id, "ingredients", value)} placeholder="Mango puree | আমের পিউরি" placeholderTextColor={palette.muted} style={[fieldStyle, { minHeight: 92, textAlignVertical: "top", paddingTop: 10 }]} /></View><View style={{ gap: 4 }}><AppText weight="semibold" style={{ fontSize: 10 }}>Nutrition serving · EN / বাংলা</AppText><View style={{ flexDirection: "row", gap: 8 }}>{field(draft, "nutritionServingEn", "Serving · EN", "Per 250 ml")}{field(draft, "nutritionServingBn", "পরিবেশন · বাংলা", "প্রতি ২৫০ মি.লি.")}</View><AppText style={{ color: palette.muted, fontSize: 10 }}>Rows: Label EN | Label বাংলা | Value EN | Value বাংলা</AppText><TextInput multiline value={current.nutritionValues} onChangeText={(value) => update(draft.id, "nutritionValues", value)} placeholder="Energy | শক্তি | 100 kcal | ১০০ কিলোক্যালরি" placeholderTextColor={palette.muted} style={[fieldStyle, { minHeight: 82, textAlignVertical: "top", paddingTop: 10 }]} /><View style={{ flexDirection: "row", gap: 6 }}>{(["verified", "demo", "unknown"] as const).map((status) => <Pressable key={status} onPress={() => update(draft.id, "nutritionStatus", status)} style={{ flex: 1, minHeight: 36, borderRadius: 10, borderWidth: 1, borderColor: current.nutritionStatus === status ? palette.green : palette.line, backgroundColor: current.nutritionStatus === status ? palette.greenSoft : palette.card, alignItems: "center", justifyContent: "center" }}><AppText weight="semibold" style={{ color: current.nutritionStatus === status ? palette.green : palette.muted, fontSize: 10 }}>{status}</AppText></Pressable>)}</View><View style={{ flexDirection: "row", gap: 8 }}>{field(draft, "nutritionSourceEn", "Nutrition source · EN", "Verified package panel or unknown")}{field(draft, "nutritionSourceBn", "উৎস · বাংলা", "যাচাইকৃত প্যাকেট প্যানেল বা অজানা")}</View></View><View style={{ gap: 4 }}><AppText weight="semibold" style={{ fontSize: 10 }}>Evidence rows: Label EN | Label বাংলা | Value EN | Value বাংলা | status | source EN | source বাংলা</AppText><TextInput multiline value={current.evidence} onChangeText={(value) => update(draft.id, "evidence", value)} placeholder="Ingredients | উপাদান | Package label | প্যাকেটের লেবেল | demo | Demo label | ডেমো লেবেল" placeholderTextColor={palette.muted} style={[fieldStyle, { minHeight: 110, textAlignVertical: "top", paddingTop: 10 }]} /></View><PrimaryButton title={activeId === draft.id ? (language === "en" ? "Publishing…" : "প্রকাশ হচ্ছে…") : (language === "en" ? "Publish record" : "রেকর্ড প্রকাশ করুন")} icon="publish" disabled={Boolean(activeId)} onPress={() => void publish(draft)} /></Card>; }) : <Card><AppText style={{ color: palette.muted, fontSize: 12 }}>{language === "en" ? "No draft records are waiting for enrichment." : "বিস্তারিত যোগ করার জন্য কোনো খসড়া নেই।"}</AppText></Card>}
  </Screen>;
}
