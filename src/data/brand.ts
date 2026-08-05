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
  { kind: "mine", texts: ["欸你們剛剛那包是什麼"] },
  { kind: "yours", texts: ["雞胸肉做的雞排啊"] },
  { kind: "mine", texts: ["看起來也太大一片"] },
  { kind: "yours", texts: ["我買過 我家那隻看到袋子就坐好了"] },
  {
    kind: "yours",
    image: "/images/haodada/customer-dog-product-v3.jpg",
    alt: "使用者的狗狗咬著嚎大大雞霸",
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
  { kind: "mine", texts: ["哪裡可以買"] },
  {
    kind: "yours",
    texts: [
      `加 LINE 找 <a href="${BRAND.lineUrl}" target="_blank" rel="noopener noreferrer" class="phone-link">${BRAND.lineHandle}</a>`,
      `或直接上 <a href="${BRAND.shopUrl}" target="_blank" rel="noopener noreferrer" class="phone-link">furmosa.com</a>`,
      "對了裡面還可以抽狗狗卡牌",
      "抽到跟自己同品種的可以免費再來一包欸",
    ],
  },
  { kind: "mine", texts: ["是什麼意思"] },
  {
    kind: "yours",
    texts: [
      "哎呀你直接追蹤他們 IG 就知道了",
      `<a href="${BRAND.igUrl}" target="_blank" rel="noopener noreferrer" class="phone-link" aria-label="Instagram ${BRAND.igHandle}">${BRAND.igHandle}</a>`,
    ],
  },
  { kind: "mine", texts: ["好 先買一包幫牠拍照"] },
];
