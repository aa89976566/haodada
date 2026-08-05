export const BRAND = {
  name: "嚎大大雞霸",
  displayName: "嚎大大雞霸",
  shortName: "雞霸",
  mascot: "嚎大大",
  studio: "匠寵",
  furmosa: "FURMOSA",
  tagline: "帶球，只會開始遊戲。帶雞霸，才會開始聊天。",
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

/** Chat rhythm: short, punchy, absurd — brand world only. Text bubbles only. */
export const CHAT: ChatBlock[] = [
  { kind: "mine", texts: ["寄雞霸來！！"] },
  {
    kind: "yours",
    texts: ["像這樣！！大口雞胸肉乾 ←←←←??????"],
  },
  { kind: "mine", texts: ["這是什麼做的？"] },
  {
    kind: "yours",
    texts: [
      "整片雞胸肉低溫烘乾。",
      "無添加。拒絕亂七八糟。只給毛孩乾乾淨淨。",
    ],
  },
  { kind: "mine", texts: ["《狗公園公約》第 6 條？"] },
  {
    kind: "yours",
    texts: ["帶球，只會開始遊戲。", "帶雞霸，才會開始聊天。"],
  },
  { kind: "mine", texts: ["什麼是雞霸？"] },
  {
    kind: "yours",
    texts: [
      "<strong>嚎大大雞霸</strong>——純雞情。單純雞肉原味，大口咬才夠味。",
      "夜市雞排靈感 · 毛孩大口滿足肉乾。",
    ],
  },
  { kind: "mine", texts: ["帶去狗公園會怎樣？"] },
  {
    kind: "yours",
    texts: ["被搭訕機率增加 327%。", "實驗結果如圖。請自行負責社交後果。"],
  },
  { kind: "mine", texts: ["真的無添加？"] },
  {
    kind: "yours",
    texts: [
      "對。低溫烘乾雞肉零食，配方簡單清楚。",
      "適合當日常獎勵；請搭配主食與充足飲水。",
    ],
  },
  { kind: "mine", texts: ["怎麼買？"] },
  {
    kind: "yours",
    texts: [
      `加入 LINE <a href="${BRAND.lineUrl}" target="_blank" rel="noopener noreferrer" class="phone-link">${BRAND.lineHandle}</a>，我們寄雞霸給你。`,
      `或上 <a href="${BRAND.shopUrl}" target="_blank" rel="noopener noreferrer" class="phone-link">furmosa.com</a>`,
    ],
  },
  { kind: "mine", texts: ["cool thx", "...你們是誰？"] },
  {
    kind: "yours",
    texts: [
      `這是 <a href="${BRAND.shopUrl}" target="_blank" rel="noopener noreferrer" class="credit">匠寵 FURMOSA</a> × 嚎大大雞霸。`,
      "狗公園見。記得帶雞霸。",
    ],
  },
];
