export type Language = "en" | "bn";
export type Category = "food" | "personalCare" | "household";

export type Localized = { en: string; bn: string };

export type Product = {
  id: string;
  barcode: string;
  category: Category;
  name: Localized;
  brand: Localized;
  size: Localized;
  description: Localized;
  ingredients: Localized[];
  ingredientExplanations?: Localized[];
  demo: boolean;
  score?: number;
  gradeLabel?: Localized;
  factors: { label: Localized; value: number | null; weight?: string; note: Localized }[];
  evidence: { label: Localized; value: Localized; status: "demo" | "unknown" }[];
};

export const products: Product[] = [
  {
    id: "food-sample",
    barcode: "000000000001",
    category: "food",
    name: { en: "Mango drink", bn: "আমের পানীয়" },
    brand: { en: "Demo shelf sample", bn: "ডেমো শেলফ নমুনা" },
    size: { en: "250 ml · sample pack", bn: "২৫০ মি.লি. · নমুনা প্যাক" },
    description: {
      en: "A fictional package record for exploring the food-grade breakdown.",
      bn: "খাবারের গ্রেড বিশ্লেষণ দেখানোর জন্য একটি কাল্পনিক পণ্যের রেকর্ড।",
    },
    ingredients: [
      { en: "Mango puree · demo label", bn: "আমের পিউরি · ডেমো লেবেল" },
      { en: "Added sugar · demo label", bn: "যোগ করা চিনি · ডেমো লেবেল" },
      { en: "Food acidity regulator · demo label", bn: "খাদ্য অম্লতা নিয়ন্ত্রক · ডেমো লেবেল" },
    ],
    ingredientExplanations: [
      { en: "Fictional label item; its amount and source are not known.", bn: "কাল্পনিক লেবেল-তথ্য; পরিমাণ ও উৎস জানা নেই।" },
      { en: "Sweetens the drink; grams per serving are not available in this demo.", bn: "পানীয়কে মিষ্টি করে; এই ডেমোতে প্রতি পরিবেশনে কত গ্রাম তা নেই।" },
      { en: "Used to adjust acidity; the specific additive and source are not identified.", bn: "অম্লতা ঠিক রাখতে ব্যবহৃত হয়; নির্দিষ্ট অ্যাডিটিভ ও উৎস শনাক্ত করা হয়নি।" },
    ],
    demo: true,
    score: 72,
    gradeLabel: { en: "Needs context", bn: "প্রেক্ষাপটসহ দেখুন" },
    factors: [
      {
        label: { en: "Nutrition profile", bn: "পুষ্টির প্রোফাইল" },
        value: 68,
        weight: "60%",
        note: { en: "Illustrative sub-score", bn: "শুধু উদাহরণস্বরূপ উপ-স্কোর" },
      },
      {
        label: { en: "Ingredients & additives", bn: "উপাদান ও অ্যাডিটিভ" },
        value: 70,
        weight: "30%",
        note: { en: "Illustrative review", bn: "শুধু উদাহরণস্বরূপ বিশ্লেষণ" },
      },
      {
        label: { en: "Label completeness", bn: "লেবেলের পূর্ণতা" },
        value: 100,
        weight: "10%",
        note: { en: "Mock label fields", bn: "নমুনা লেবেল তথ্য" },
      },
    ],
    evidence: [
      {
        label: { en: "Ingredients", bn: "উপাদান" },
        value: { en: "Illustrative package text", bn: "শুধু উদাহরণস্বরূপ প্যাকেটের লেখা" },
        status: "demo",
      },
      {
        label: { en: "Nutrition values", bn: "পুষ্টিমান" },
        value: { en: "Not verified in this demo record", bn: "এই ডেমো রেকর্ডে যাচাই করা হয়নি" },
        status: "unknown",
      },
      {
        label: { en: "Allergen information", bn: "অ্যালার্জেন তথ্য" },
        value: { en: "Not checked or verified in this demo", bn: "এই ডেমোতে পরীক্ষা বা যাচাই করা হয়নি" },
        status: "unknown",
      },
      {
        label: { en: "Additive / E-number source", bn: "অ্যাডিটিভ / E-number-এর উৎস" },
        value: { en: "Not assessed. An E-number alone does not establish halal status.", bn: "বিশ্লেষণ করা হয়নি। শুধু E-number দেখে হালাল অবস্থা নির্ধারণ করা যায় না।" },
        status: "unknown",
      },
      {
        label: { en: "Halal evidence", bn: "হালাল প্রমাণ" },
        value: { en: "No record verified in this demo", bn: "এই ডেমোতে কোনো তথ্য যাচাই করা হয়নি" },
        status: "unknown",
      },
      {
        label: { en: "BSTI evidence", bn: "BSTI তথ্য" },
        value: { en: "No record verified in this demo", bn: "এই ডেমোতে কোনো তথ্য যাচাই করা হয়নি" },
        status: "unknown",
      },
    ],
  },
  {
    id: "care-sample",
    barcode: "000000000002",
    category: "personalCare",
    name: { en: "Everyday shampoo", bn: "দৈনন্দিন শ্যাম্পু" },
    brand: { en: "Demo personal care", bn: "ডেমো পার্সোনাল কেয়ার" },
    size: { en: "200 ml · sample pack", bn: "২০০ মি.লি. · নমুনা প্যাক" },
    description: {
      en: "A fictional care-product record. Personal-care ingredients use a separate evidence summary, not a food score.",
      bn: "কাল্পনিক পার্সোনাল কেয়ার পণ্যের রেকর্ড। এখানে খাবারের স্কোর নয়, আলাদা উপাদান-তথ্য দেখানো হয়।",
    },
    ingredients: [
      { en: "Cleansing base · demo label", bn: "ক্লিনজিং বেস · ডেমো লেবেল" },
      { en: "Fragrance · demo label", bn: "সুগন্ধি · ডেমো লেবেল" },
      { en: "Botanical extract · demo label", bn: "উদ্ভিজ্জ নির্যাস · ডেমো লেবেল" },
    ],
    ingredientExplanations: [
      { en: "A broad cleansing ingredient group; exact compounds are not provided.", bn: "পরিষ্কার করার উপাদানের একটি সাধারণ ধরন; নির্দিষ্ট যৌগের তথ্য নেই।" },
      { en: "Adds scent; individual fragrance components are not listed here.", bn: "সুগন্ধ যোগ করে; আলাদা সুগন্ধি উপাদান এখানে উল্লেখ নেই।" },
      { en: "Plant-derived material; the exact plant and amount are unknown in this sample.", bn: "উদ্ভিদ থেকে পাওয়া উপাদান; এই নমুনায় নির্দিষ্ট উদ্ভিদ ও পরিমাণ জানা নেই।" },
    ],
    demo: true,
    gradeLabel: { en: "Evidence summary only", bn: "শুধু তথ্যের সারাংশ" },
    factors: [
      {
        label: { en: "Ingredient disclosure", bn: "উপাদানের তথ্য" },
        value: null,
        note: { en: "Example label fields only", bn: "শুধু উদাহরণ লেবেল তথ্য" },
      },
      {
        label: { en: "Sensitivity context", bn: "সংবেদনশীলতার প্রেক্ষাপট" },
        value: null,
        note: { en: "Not a skin-suitability claim", bn: "ত্বকের জন্য উপযুক্ত—এমন দাবি নয়" },
      },
      {
        label: { en: "Evidence quality", bn: "তথ্যের নির্ভরযোগ্যতা" },
        value: null,
        note: { en: "No independent verification", bn: "স্বাধীনভাবে যাচাই করা হয়নি" },
      },
    ],
    evidence: [
      {
        label: { en: "Ingredient list", bn: "উপাদানের তালিকা" },
        value: { en: "Illustrative package text", bn: "শুধু উদাহরণস্বরূপ প্যাকেটের লেখা" },
        status: "demo",
      },
      {
        label: { en: "Certification", bn: "সনদ" },
        value: { en: "No record verified in this demo", bn: "এই ডেমোতে কোনো তথ্য যাচাই করা হয়নি" },
        status: "unknown",
      },
    ],
  },
  {
    id: "home-sample",
    barcode: "000000000003",
    category: "household",
    name: { en: "Dishwashing liquid", bn: "বাসন ধোয়ার তরল" },
    brand: { en: "Demo home care", bn: "ডেমো হোম কেয়ার" },
    size: { en: "350 ml · sample pack", bn: "৩৫০ মি.লি. · নমুনা প্যাক" },
    description: {
      en: "A fictional household-product record. The prototype shows label/use guidance separately and does not assign a health grade.",
      bn: "কাল্পনিক গৃহস্থালি পণ্যের রেকর্ড। ডেমোতে লেবেল ও ব্যবহার নির্দেশনা আলাদা দেখানো হয়; স্বাস্থ্য-গ্রেড দেওয়া হয় না।",
    },
    ingredients: [
      { en: "Surfactant blend · demo label", bn: "সারফ্যাক্ট্যান্ট মিশ্রণ · ডেমো লেবেল" },
      { en: "Water · demo label", bn: "পানি · ডেমো লেবেল" },
      { en: "Fragrance · demo label", bn: "সুগন্ধি · ডেমো লেবেল" },
    ],
    ingredientExplanations: [
      { en: "A surfactant blend can help lift grease; specific chemicals are not identified.", bn: "সারফ্যাক্ট্যান্টের মিশ্রণ তেল-ময়লা তুলতে সাহায্য করতে পারে; নির্দিষ্ট রাসায়নিক শনাক্ত করা হয়নি।" },
      { en: "Liquid carrier shown as a fictional label item; formula details are not verified.", bn: "তরল বাহক হিসেবে কাল্পনিক লেবেল-তথ্য; ফর্মুলার বিস্তারিত যাচাই করা হয়নি।" },
      { en: "Adds scent; individual fragrance components are not listed here.", bn: "সুগন্ধ যোগ করে; আলাদা সুগন্ধি উপাদান এখানে উল্লেখ নেই।" },
    ],
    demo: true,
    gradeLabel: { en: "Not rated", bn: "গ্রেড দেওয়া হয়নি" },
    factors: [
      {
        label: { en: "Label/use instructions", bn: "লেবেল ও ব্যবহার নির্দেশনা" },
        value: null,
        note: { en: "Separate from food ratings", bn: "খাবারের মূল্যায়ন থেকে আলাদা" },
      },
      {
        label: { en: "Product disclosures", bn: "পণ্যের তথ্য" },
        value: null,
        note: { en: "Example label fields only", bn: "শুধু উদাহরণ লেবেল তথ্য" },
      },
      {
        label: { en: "Verification", bn: "যাচাই" },
        value: null,
        note: { en: "No independent verification", bn: "স্বাধীনভাবে যাচাই করা হয়নি" },
      },
    ],
    evidence: [
      {
        label: { en: "Label details", bn: "লেবেলের তথ্য" },
        value: { en: "Illustrative package text", bn: "শুধু উদাহরণস্বরূপ প্যাকেটের লেখা" },
        status: "demo",
      },
      {
        label: { en: "Safety/use record", bn: "নিরাপত্তা/ব্যবহারের তথ্য" },
        value: { en: "No independent evidence in this demo", bn: "এই ডেমোতে স্বাধীন প্রমাণ নেই" },
        status: "unknown",
      },
    ],
  },
];

export const productById = (id: string | undefined) => products.find((product) => product.id === id);
export const productByBarcode = (barcode: string) =>
  products.find((product) => product.barcode === barcode.trim());

const copy = {
  brand: { en: "NutriScan", bn: "নিউট্রিস্ক্যান" },
  tagline: { en: "Read the label. Know the limits.", bn: "লেবেল পড়ুন। সীমাবদ্ধতাও জানুন।" },
  prototypeStatus: { en: "Bangladesh · prototype", bn: "বাংলাদেশ · প্রোটোটাইপ" },
  homeTitle: { en: "Know what’s in your basket.", bn: "আপনার ঝুড়িতে কী আছে, জেনে নিন।" },
  homeSubtitle: { en: "Scan local products, then explore what the label does—and doesn’t—tell you.", bn: "স্থানীয় পণ্য স্ক্যান করুন, তারপর লেবেল কী বলে—আর কী বলে না—দেখুন।" },
  scan: { en: "Scan", bn: "স্ক্যান" },
  history: { en: "History", bn: "ইতিহাস" },
  contribute: { en: "Contribute", bn: "তথ্য দিন" },
  community: { en: "Community", bn: "কমিউনিটি" },
  support: { en: "Support", bn: "সহায়তা" },
  food: { en: "Food", bn: "খাবার" },
  personalCare: { en: "Personal care", bn: "পার্সোনাল কেয়ার" },
  household: { en: "Home care", bn: "গৃহস্থালি" },
  categories: { en: "Explore by category", bn: "ধরন অনুযায়ী দেখুন" },
  openScanner: { en: "Open barcode scanner", bn: "বারকোড স্ক্যানার খুলুন" },
  scannerHint: { en: "Camera scan or enter the barcode yourself.", bn: "ক্যামেরায় স্ক্যান করুন অথবা বারকোড লিখুন।" },
  enterBarcode: { en: "Enter a barcode", bn: "বারকোড লিখুন" },
  barcodePlaceholder: { en: "e.g. 000000000001", bn: "যেমন ০০০০০০০০০০০১" },
  findProduct: { en: "Find product", bn: "পণ্য খুঁজুন" },
  sampleCatalog: { en: "Try a demo product", bn: "একটি ডেমো পণ্য দেখুন" },
  demoNote: { en: "Prototype sample data · not verified product information", bn: "প্রোটোটাইপ নমুনা তথ্য · যাচাইকৃত পণ্যের তথ্য নয়" },
  viewDetails: { en: "View details", bn: "বিস্তারিত দেখুন" },
  noMatch: { en: "No verified match yet", bn: "এখনও যাচাইকৃত মিল নেই" },
  noMatchBody: { en: "This barcode isn’t in the prototype catalog. You can send the package for review.", bn: "এই বারকোডটি ডেমো ক্যাটালগে নেই। পর্যালোচনার জন্য প্যাকেট পাঠাতে পারেন।" },
  sendForReview: { en: "Contribute this product", bn: "পণ্যটির তথ্য দিন" },
  grade: { en: "Illustrative grade", bn: "উদাহরণস্বরূপ গ্রেড" },
  method: { en: "How this food preview is composed", bn: "এই খাবারের ডেমো মূল্যায়ন কীভাবে তৈরি" },
  methodNote: { en: "Inspired by transparent score breakdowns, not Yuka’s formula. Weights and criteria are placeholders for local research and expert review.", bn: "স্বচ্ছ স্কোর-বিভাজনা থেকে ধারণা নেওয়া হয়েছে, Yuka-র সূত্র নয়। ওজন ও মানদণ্ড স্থানীয় গবেষণা ও বিশেষজ্ঞ পর্যালোচনার জন্য প্রাথমিক উদাহরণ।" },
  halal: { en: "Halal evidence", bn: "হালাল তথ্য" },
  bstI: { en: "BSTI evidence", bn: "BSTI তথ্য" },
  unknown: { en: "Unverified", bn: "যাচাই হয়নি" },
  source: { en: "Source & status", bn: "উৎস ও অবস্থা" },
  ingredients: { en: "Label ingredients", bn: "লেবেলের উপাদান" },
  productDetails: { en: "Product details", bn: "পণ্যের বিবরণ" },
  limitations: { en: "Please note", bn: "মনে রাখুন" },
  limitationText: { en: "This record is illustrative. A label scan cannot confirm lab results, trace contamination, halal status, or medical suitability.", bn: "এই রেকর্ডটি উদাহরণমাত্র। লেবেল স্ক্যান করে পরীক্ষাগারের ফল, অতি সামান্য দূষণ, হালাল অবস্থা বা চিকিৎসাগত উপযোগিতা নিশ্চিত করা যায় না।" },
  recent: { en: "Your recent scans", bn: "আপনার সাম্প্রতিক স্ক্যান" },
  seeAll: { en: "See all", bn: "সব দেখুন" },
  emptyHistory: { en: "Your scans will appear here", bn: "আপনার স্ক্যান এখানে দেখা যাবে" },
  emptyHistoryBody: { en: "Try a demo product or open the scanner to get started.", bn: "শুরু করতে একটি ডেমো পণ্য দেখুন অথবা স্ক্যানার খুলুন।" },
  clearHistory: { en: "Clear history", bn: "ইতিহাস মুছুন" },
  sampleHistory: { en: "Two illustrative entries are shown until you scan products.", bn: "আপনি পণ্য স্ক্যান না করা পর্যন্ত উদাহরণস্বরূপ দুটি এন্ট্রি দেখানো হবে।" },
  contributeTitle: { en: "Help fill the local product shelf.", bn: "স্থানীয় পণ্যের তথ্য যোগ করতে সাহায্য করুন।" },
  contributeBody: { en: "Send both sides of a pack. Our team must review it before a record is verified.", bn: "প্যাকেটের দুই পাশের ছবি পাঠান। কোনো রেকর্ড যাচাইকৃত হওয়ার আগে আমাদের দল তা পর্যালোচনা করবে।" },
  frontPhoto: { en: "Front of pack", bn: "প্যাকেটের সামনের দিক" },
  backPhoto: { en: "Back / ingredient label", bn: "পেছনের দিক / উপাদানের লেবেল" },
  addPhoto: { en: "Take or choose photo", bn: "ছবি তুলুন বা বাছুন" },
  productName: { en: "Product name", bn: "পণ্যের নাম" },
  brandName: { en: "Brand / maker", bn: "ব্র্যান্ড / প্রস্তুতকারক" },
  category: { en: "Category", bn: "ধরন" },
  barcode: { en: "Barcode (if available)", bn: "বারকোড (থাকলে)" },
  submitReview: { en: "Submit for review", bn: "পর্যালোচনার জন্য জমা দিন" },
  pendingReview: { en: "Pending team review", bn: "দলের পর্যালোচনা বাকি" },
  localDemoSubmission: { en: "Saved as a local prototype submission only; it has not been sent to a review team.", bn: "শুধু এই প্রোটোটাইপে স্থানীয়ভাবে সংরক্ষিত হয়েছে; পর্যালোচনা দলের কাছে পাঠানো হয়নি।" },
  mySubmissions: { en: "Your submissions", bn: "আপনার জমা দেওয়া তথ্য" },
  noSubmissions: { en: "No product submissions yet.", bn: "এখনও কোনো পণ্যের তথ্য জমা দেননি।" },
  pointsAfterReview: { en: "Points are awarded only after a contribution is reviewed and accepted.", bn: "তথ্য পর্যালোচনা করে গৃহীত হলে তবেই পয়েন্ট দেওয়া হবে।" },
  leaderboardTitle: { en: "Helpful shelf scouts", bn: "সহায়ক পণ্য-তথ্যদাতারা" },
  leaderboardBody: { en: "Example rankings only. Points never influence a product grade or verification.", bn: "শুধু উদাহরণস্বরূপ তালিকা। পয়েন্ট কখনো পণ্যের গ্রেড বা যাচাইকে প্রভাবিত করে না।" },
  yourPoints: { en: "Your accepted points", bn: "আপনার গৃহীত পয়েন্ট" },
  demoBoard: { en: "Sample leaderboard", bn: "নমুনা লিডারবোর্ড" },
  supportTitle: { en: "Keep the label library growing.", bn: "লেবেলের তথ্যভান্ডার বাড়াতে সহায়তা করুন।" },
  supportBody: { en: "NutriScan is exploring community support for catalog review, hosting, and maintenance.", bn: "ক্যাটালগ পর্যালোচনা, হোস্টিং ও রক্ষণাবেক্ষণের জন্য কমিউনিটির সহায়তার পথ খুঁজছে NutriScan।" },
  voluntary: { en: "Always voluntary", bn: "সম্পূর্ণ ঐচ্ছিক" },
  donationStatus: { en: "Payment details are not connected in this prototype. No donation will be charged.", bn: "এই প্রোটোটাইপে পেমেন্ট তথ্য যুক্ত নেই। কোনো অনুদান নেওয়া হবে না।" },
  howFundsHelp: { en: "Where support would go", bn: "সহায়তা যেসব কাজে লাগবে" },
  fundsOne: { en: "Reviewing new local product labels", bn: "নতুন স্থানীয় পণ্যের লেবেল পর্যালোচনা" },
  fundsTwo: { en: "Keeping the catalog and service running", bn: "ক্যাটালগ ও সেবা চালু রাখা" },
  fundsThree: { en: "Improving bilingual access and scan tools", bn: "দ্বিভাষিক সুবিধা ও স্ক্যান টুল উন্নত করা" },
  scannerTitle: { en: "Scan a barcode", bn: "বারকোড স্ক্যান করুন" },
  scannerHelp: { en: "Hold the barcode inside the frame. Camera scan is available on a supported device; manual/demo lookup works in Preview.", bn: "বারকোডটি ফ্রেমের মধ্যে ধরুন। সমর্থিত ডিভাইসে ক্যামেরা স্ক্যান চালু হবে; প্রিভিউতে বারকোড লিখে বা ডেমো ব্যবহার করুন।" },
  cameraPermission: { en: "Allow camera access to scan a barcode.", bn: "বারকোড স্ক্যান করতে ক্যামেরা ব্যবহারের অনুমতি দিন।" },
  cameraUnavailable: { en: "Camera scanning is not available here. Enter a barcode or try a demo product.", bn: "এখানে ক্যামেরা স্ক্যান পাওয়া যাচ্ছে না। বারকোড লিখুন অথবা ডেমো পণ্য দেখুন।" },
  unknownBarcode: { en: "Not in the verified demo catalog", bn: "যাচাইকৃত ডেমো ক্যাটালগে নেই" },
  unknownBarcodeBody: { en: "No product match was found. That does not mean the product is unsafe or safe.", bn: "পণ্যের কোনো মিল পাওয়া যায়নি। এর মানে পণ্যটি নিরাপদ বা অনিরাপদ—কোনোটিই নয়।" },
  chooseDemo: { en: "Or explore a sample product", bn: "অথবা একটি নমুনা পণ্য দেখুন" },
  uploadHint: { en: "Front and back images help distinguish size, variant, and ingredient-label changes.", bn: "সামনে ও পেছনের ছবি দিয়ে সাইজ, ধরন এবং উপাদানের লেবেলের পরিবর্তন আলাদা করা যায়।" },
  submissionSuccess: { en: "Prototype submission saved", bn: "প্রোটোটাইপে তথ্য জমা হয়েছে" },
  details: { en: "Details", bn: "বিস্তারিত" },
  close: { en: "Close", bn: "বন্ধ করুন" },
  sample: { en: "Sample", bn: "নমুনা" },
  noGrade: { en: "No overall grade", bn: "সামগ্রিক গ্রেড নেই" },
  viewAssessment: { en: "Assessment approach", bn: "মূল্যায়ন পদ্ধতি" },
  productNotFound: { en: "Product record not found", bn: "পণ্যের রেকর্ড পাওয়া যায়নি" },
} satisfies Record<string, Localized>;

export type CopyKey = keyof typeof copy;
export const t = (language: Language, key: CopyKey): string => copy[key][language];
export const productName = (product: Product, language: Language) => product.name[language];
export const productBrand = (product: Product, language: Language) => product.brand[language];
export const categoryLabel = (category: Category, language: Language) =>
  t(language, category === "food" ? "food" : category === "personalCare" ? "personalCare" : "household");
