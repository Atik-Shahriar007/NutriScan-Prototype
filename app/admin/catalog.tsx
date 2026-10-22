import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import { AppText, Card, DemoNotice, PageHeader, Pill, PrimaryButton, Screen, palette, fontFamily } from "@/components/nutriscan-ui";
import type { Product } from "@/lib/nutriscan-data";
import { useNutriScan } from "@/lib/nutriscan-state";
import { trpc } from "@/lib/trpc";

type Form = { nameEn: string; nameBn: string; brandEn: string; brandBn: string; sizeEn: string; sizeBn: string; descriptionEn: string; descriptionBn: string; ingredients: string };

function formFromDraft(draft: Product): Form {
  return { nameEn: draft.name.en, nameBn: draft.name.bn, brandEn: draft.brand.en, brandBn: draft.brand.bn, sizeEn: draft.size.en, sizeBn: draft.size.bn, descriptionEn: draft.description.en, descriptionBn: draft.description.bn, ingredients: draft.ingredients.map((item) => `${item.en} | ${item.bn}`).join("\n") };
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
    setActiveId(draft.id);
    setNotice("");
    try {
      await publishMutation.mutateAsync({ id: draft.id, ...form, ingredients });
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
    {draftsQuery.isLoading ? <Card><AppText style={{ color: palette.muted, fontSize: 12 }}>{language === "en" ? "Loading drafts…" : "খসড়া লোড হচ্ছে…"}</AppText></Card> : draftsQuery.error ? <Card style={{ backgroundColor: palette.claySoft }}><AppText weight="semibold" style={{ color: palette.clay }}>{language === "en" ? "Admin access required" : "অ্যাডমিন অ্যাক্সেস প্রয়োজন"}</AppText></Card> : draftsQuery.data?.length ? draftsQuery.data.map((draft) => <Card key={draft.id} style={{ gap: 11 }}><View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}><View style={{ flex: 1 }}><AppText weight="semibold" style={{ fontSize: 15 }}>{draft.name.en}</AppText><AppText style={{ color: palette.muted, fontSize: 10 }}>{draft.id} · {draft.barcode}</AppText></View><Pill tone="amber">{language === "en" ? "Draft" : "খসড়া"}</Pill></View><View style={{ flexDirection: "row", gap: 8 }}>{field(draft, "nameEn", "Name · EN", "English name")}{field(draft, "nameBn", "নাম · বাংলা", "বাংলা নাম")}</View><View style={{ flexDirection: "row", gap: 8 }}>{field(draft, "brandEn", "Brand · EN", "English brand")}{field(draft, "brandBn", "ব্র্যান্ড · বাংলা", "বাংলা ব্র্যান্ড")}</View><View style={{ flexDirection: "row", gap: 8 }}>{field(draft, "sizeEn", "Size · EN", "e.g. 250 ml")}{field(draft, "sizeBn", "সাইজ · বাংলা", "যেমন ২৫০ মি.লি.")}</View><View style={{ gap: 4 }}><AppText weight="semibold" style={{ fontSize: 10 }}>Description · EN / বাংলা</AppText><TextInput multiline value={(forms[draft.id] ?? formFromDraft(draft)).descriptionEn} onChangeText={(value) => update(draft.id, "descriptionEn", value)} style={[fieldStyle, { minHeight: 66, textAlignVertical: "top", paddingTop: 10 }]} /><TextInput multiline value={(forms[draft.id] ?? formFromDraft(draft)).descriptionBn} onChangeText={(value) => update(draft.id, "descriptionBn", value)} style={[fieldStyle, { minHeight: 66, textAlignVertical: "top", paddingTop: 10 }]} /></View><View style={{ gap: 4 }}><AppText weight="semibold" style={{ fontSize: 10 }}>Ingredients · one per line: English | বাংলা</AppText><TextInput multiline value={(forms[draft.id] ?? formFromDraft(draft)).ingredients} onChangeText={(value) => update(draft.id, "ingredients", value)} placeholder="Mango puree | আমের পিউরি" placeholderTextColor={palette.muted} style={[fieldStyle, { minHeight: 92, textAlignVertical: "top", paddingTop: 10 }]} /></View><PrimaryButton title={activeId === draft.id ? (language === "en" ? "Publishing…" : "প্রকাশ হচ্ছে…") : (language === "en" ? "Publish record" : "রেকর্ড প্রকাশ করুন")} icon="publish" disabled={Boolean(activeId)} onPress={() => void publish(draft)} /></Card>) : <Card><AppText style={{ color: palette.muted, fontSize: 12 }}>{language === "en" ? "No draft records are waiting for enrichment." : "বিস্তারিত যোগ করার জন্য কোনো খসড়া নেই।"}</AppText></Card>}
  </Screen>;
}
