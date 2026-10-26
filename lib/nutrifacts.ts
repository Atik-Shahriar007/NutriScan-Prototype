import type { Localized } from "@/lib/nutriscan-data";

export type SourcedFact = {
  title: Localized;
  body: Localized;
  sourceTitle: string;
  sourceUrl: string;
};

const healthyDietUrl = "https://www.who.int/news-room/fact-sheets/detail/healthy-diet";
const sugarsGuidelineUrl = "https://www.who.int/publications/i/item/9789241549028";
const whoHealthyDiet = "WHO · Healthy diet";
const whoSugars = "WHO · Sugars intake guideline";

export const dailyTips: SourcedFact[] = [
  {
    title: { en: "Build meals around variety", bn: "খাবারে বৈচিত্র্য রাখুন" },
    body: { en: "A balanced diet includes a variety of foods, including vegetables, fruits, legumes, nuts and whole grains. Needs vary by age and health.", bn: "সুষম খাদ্যে নানা ধরনের খাবার থাকে—যেমন শাকসবজি, ফল, ডাল, বাদাম ও পূর্ণশস্য। বয়স ও স্বাস্থ্যের সঙ্গে প্রয়োজন বদলায়।" },
    sourceTitle: whoHealthyDiet,
    sourceUrl: healthyDietUrl,
  },
  {
    title: { en: "Check the salt line", bn: "লবণের পরিমাণ দেখুন" },
    body: { en: "WHO advises adults to consume less than 5 g of salt per day. Packaged-food labels can help you compare products, but serving sizes matter.", bn: "WHO প্রাপ্তবয়স্কদের দিনে ৫ গ্রামের কম লবণ খাওয়ার পরামর্শ দেয়। প্যাকেটের লেবেল তুলনা করতে সাহায্য করে, তবে পরিবেশনের পরিমাণও গুরুত্বপূর্ণ।" },
    sourceTitle: whoHealthyDiet,
    sourceUrl: healthyDietUrl,
  },
  {
    title: { en: "Notice free sugars", bn: "মুক্ত শর্করার দিকে খেয়াল রাখুন" },
    body: { en: "Sugars in fruit juice, honey and syrups count as free sugars. Check both ingredients and the nutrition panel when comparing packaged drinks.", bn: "ফলের রস, মধু ও সিরাপের শর্করা মুক্ত শর্করার মধ্যে পড়ে। প্যাকেটের পানীয় তুলনা করলে উপাদান ও পুষ্টি—দুই লেবেলই দেখুন।" },
    sourceTitle: whoHealthyDiet,
    sourceUrl: healthyDietUrl,
  },
];

export const ingredientInsight: SourcedFact = {
  title: { en: "Fruit juice and free sugars", bn: "ফলের রস ও মুক্ত শর্করা" },
  body: { en: "WHO includes sugars naturally present in fruit juice in its definition of free sugars. A product name or front-of-pack image cannot tell you the amount; use the current nutrition label.", bn: "WHO-এর সংজ্ঞায় ফলের রসে থাকা শর্করাও মুক্ত শর্করার মধ্যে পড়ে। পণ্যের নাম বা প্যাকেটের সামনের ছবি পরিমাণ জানায় না; বর্তমান পুষ্টি-লেবেল দেখুন।" },
  sourceTitle: whoHealthyDiet,
  sourceUrl: healthyDietUrl,
};

export const mythFacts: SourcedFact[] = [
  {
    title: { en: "Myth: Juice sugars do not count because they come from fruit.", bn: "মিথ: ফল থেকে আসে বলে রসের শর্করা হিসাবের মধ্যে পড়ে না।" },
    body: { en: "Fact: WHO classifies sugars in fruit juice as free sugars. The guidance recommends limiting free sugars; whole fruit and juice are not nutritionally identical.", bn: "সত্য: WHO ফলের রসের শর্করাকে মুক্ত শর্করা হিসেবে গণ্য করে। নির্দেশিকায় মুক্ত শর্করা সীমিত রাখতে বলা হয়েছে; গোটা ফল ও রস পুষ্টিগতভাবে এক নয়।" },
    sourceTitle: whoHealthyDiet,
    sourceUrl: healthyDietUrl,
  },
  {
    title: { en: "Myth: Every nutrition recommendation is one-size-fits-all.", bn: "মিথ: সবার জন্য পুষ্টির পরামর্শ একই।" },
    body: { en: "Fact: WHO notes that healthy diets vary with individual characteristics, lifestyle, cultural context and locally available foods. General facts are not a personal care plan.", bn: "সত্য: WHO জানায়, স্বাস্থ্যকর খাদ্য ব্যক্তির বৈশিষ্ট্য, জীবনযাপন, সংস্কৃতি ও স্থানীয় খাবারের প্রাপ্যতার ওপর নির্ভর করে। সাধারণ তথ্য ব্যক্তিগত চিকিৎসা-পরিকল্পনা নয়।" },
    sourceTitle: whoHealthyDiet,
    sourceUrl: healthyDietUrl,
  },
];

export const interestingFacts: SourcedFact[] = [
  {
    title: { en: "A useful comparison cue", bn: "তুলনার একটি কাজে লাগার মতো তথ্য" },
    body: { en: "WHO recommends limiting free sugars to less than 10% of total energy intake; reducing further to below 5% may provide additional health benefits. These are population-level guidelines, not a personal target from this app.", bn: "WHO মোট শক্তির ১০%-এর কম মুক্ত শর্করা গ্রহণের পরামর্শ দেয়; ৫%-এর নিচে নামালে আরও উপকার হতে পারে। এগুলো জনস্বাস্থ্য নির্দেশনা, এই অ্যাপের দেওয়া ব্যক্তিগত লক্ষ্য নয়।" },
    sourceTitle: whoSugars,
    sourceUrl: sugarsGuidelineUrl,
  },
];

export function dailyTipForDate(date = new Date()): SourcedFact {
  const dayNumber = Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86_400_000);
  const index = ((dayNumber % dailyTips.length) + dailyTips.length) % dailyTips.length;
  return dailyTips[index];
}
