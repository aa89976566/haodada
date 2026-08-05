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
  igUrl: "https://www.instagram.com/furmosa_food/",
  igHandle: "@furmosa_food",
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
  {
    kind: "mine",
    texts: ["欸你們剛剛是在餵狗雞排嗎", "這樣不好吧"],
  },
  {
    kind: "yours",
    texts: [
      "不是人吃的那種啦",
      "那是狗狗吃的雞排",
      "其實就是雞胸肉做的雞肉乾",
    ],
  },
  { kind: "mine", texts: ["看起來也太大一片"] },
  { kind: "yours", texts: ["我買過 我家那隻看到袋子就自己坐好"] },
  {
    kind: "yours",
    image: "/images/haodada/customer-dog-product-v3.jpg",
    alt: "使用者的狗狗咬著嚎大大雞霸",
  },
  { kind: "mine", texts: ["這張也太可愛 拿來當大頭貼都可以"] },
  {
    kind: "yours",
    texts: ["而且它完全無添加", "就只有雞肉 沒有香料沒有色素也沒有防腐劑"],
  },
  { kind: "mine", texts: ["那這麼大一片不會很貴喔"] },
  {
    kind: "yours",
    texts: [
      "還好欸 這個份量價格算很合理",
      "平常剪小塊當獎勵 一包可以吃一陣子",
    ],
  },
  { kind: "mine", texts: ["難怪剛剛去公園整群狗都跑過來"] },
  { kind: "yours", texts: ["沒帶的那個直接在旁邊變空氣"] },
  {
    kind: "mine",
    texts: ["太慘 我不要跟他一樣", "哪裡買"],
  },
  {
    kind: "yours",
    texts: [
      `加 LINE 找 <a href="${BRAND.lineUrl}" target="_blank" rel="noopener noreferrer" class="phone-link">${BRAND.lineHandle}</a>`,
      `或直接上 <a href="${BRAND.shopUrl}" target="_blank" rel="noopener noreferrer" class="phone-link">furmosa.com</a>`,
      "對了 裡面還可以抽狗狗卡牌",
      "抽到跟自己同品種的 可以免費再來一包欸",
    ],
  },
  { kind: "mine", texts: ["蛤 是什麼意思"] },
  {
    kind: "yours",
    texts: [
      "哎呀 你直接追蹤他們 IG 就知道了",
      `<a href="${BRAND.igUrl}" target="_blank" rel="noopener noreferrer" class="phone-link" aria-label="Instagram ${BRAND.igHandle}">${BRAND.igHandle}</a>`,
    ],
  },
  { kind: "mine", texts: ["好 先買一包幫牠拍照"] },
];
