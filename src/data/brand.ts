export const BRAND = {
  name: "嚎大大雞霸",
  displayName: "嚎大大雞霸",
  shortName: "雞霸",
  mascot: "嚎大大",
  studio: "匠寵",
  furmosa: "FURMOSA",
  description:
    "嚎大大雞霸——匠寵 FURMOSA 寵物雞肉零食。整片雞胸肉低溫烘乾，無添加，給毛孩大口咬才夠味。",
  lineUrl: "https://line.me/R/ti/p/@furmosa",
  lineHandle: "@FURMOSA",
  shopUrl:
    "https://furmosa.com/products/chicken-fillet?variant=56882074419577",
  features: ["無添加", "純雞情", "低溫烘乾", "狗公園社交"] as const,
} as const;

export type ChatTextBlock = {
  kind: "mine" | "yours";
  texts: string[];
};

/** Exactly one image bubble in the thread (left / yours). */
export type ChatImageBlock = {
  kind: "yours";
  image: string;
  alt: string;
};

export type ChatBlock = ChatTextBlock | ChatImageBlock;

/** Short alternating bubbles — Taiwanese spoken tone, no punctuation. */
export const CHAT: ChatBlock[] = [
  { kind: "mine", texts: ["欸你們剛剛那包是什麼"] },
  { kind: "yours", texts: ["雞胸肉做的雞排啊"] },
  { kind: "mine", texts: ["看起來也太大一片"] },
  { kind: "yours", texts: ["我買過 我家那隻看到袋子就坐好了"] },
  {
    kind: "yours",
    image: "/images/haodada/eat-bulldog.png",
    alt: "狗狗咬著大片雞排合照",
  },
  { kind: "mine", texts: ["這張也太可愛 可以直接拿來當大頭貼"] },
  { kind: "yours", texts: ["而且它完全無添加"] },
  {
    kind: "yours",
    texts: ["成分就雞肉 沒有香料沒有色素也沒有防腐劑"],
  },
  { kind: "mine", texts: ["那會不會很貴"] },
  { kind: "yours", texts: ["沒有欸 這個份量價格很合理"] },
  {
    kind: "yours",
    texts: ["平常剪小塊當獎勵也可以 一包可以吃一陣子"],
  },
  { kind: "mine", texts: ["難怪去公園整群都跑過來"] },
  { kind: "yours", texts: ["旁邊沒帶的那個直接變空氣"] },
  { kind: "mine", texts: ["太慘 我不要跟他一樣"] },
  { kind: "mine", texts: ["這誰做的"] },
  { kind: "yours", texts: ["匠寵"] },
  { kind: "mine", texts: ["匠寵是什麼"] },
  {
    kind: "yours",
    texts: [
      "做毛孩食物的台灣品牌",
      "專門把毛孩吃的東西做簡單 原料跟做法都講清楚",
    ],
  },
  { kind: "mine", texts: ["哪裡買"] },
  {
    kind: "yours",
    texts: [
      `加 LINE 找 <a href="${BRAND.lineUrl}" target="_blank" rel="noopener noreferrer" class="phone-link">${BRAND.lineHandle}</a>`,
      `或直接上 <a href="${BRAND.shopUrl}" target="_blank" rel="noopener noreferrer" class="phone-link">furmosa.com</a>`,
    ],
  },
  { kind: "mine", texts: ["好 先買一包幫牠拍照"] },
];
