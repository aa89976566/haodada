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

export type ChatBlock =
  | { kind: "mine"; texts: string[] }
  | { kind: "yours"; texts: string[] };

/** Short alternating bubbles — Taiwanese spoken tone, no punctuation. */
export const CHAT: ChatBlock[] = [
  { kind: "mine", texts: ["旁邊那個怎麼自己站在那"] },
  { kind: "yours", texts: ["他沒帶雞霸啊"] },
  { kind: "mine", texts: ["難怪狗看到他直接轉彎"] },
  { kind: "yours", texts: ["連路過的都假裝沒看到"] },
  { kind: "mine", texts: ["太慘了吧 我才不要變那樣"] },
  { kind: "yours", texts: ["所以下次去公園自己知道"] },
  { kind: "mine", texts: ["這誰做的"] },
  { kind: "yours", texts: ["匠寵"] },
  { kind: "mine", texts: ["匠寵是什麼"] },
  {
    kind: "yours",
    texts: [
      "做毛孩食物的台灣品牌",
      "原料跟做法都講清楚 不搞看不懂的東西",
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
  { kind: "mine", texts: ["好 先買再說"] },
];
