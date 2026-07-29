export const BRAND = {
  name: "嚎大大雞霸",
  shortName: "雞霸",
  mascot: "嚎大大",
  tagline: "我們用原肉做出真的雞霸零食",
  heroLine: "原肉製作 · 低溫烘培 · 無添加防腐劑",
  description:
    "嚎大大雞霸——原肉低溫烘培的寵物雞排零食，無添加防腐劑，給毛孩大口開心咬。",
  price: 320,
  currency: "NT$",
  soldOut: false,
  dropLabel: "DROP #01",
  cta: "來點雞霸！！",
  ctaHint: "點一下訂購。我們會寄雞霸給你。",
  studio: "匠寵",
} as const;

export type ChatBlock =
  | { kind: "mine"; texts: string[] }
  | { kind: "yours"; texts: string[] };

export const CHAT: ChatBlock[] = [
  { kind: "mine", texts: ["寄雞霸來！！"] },
  {
    kind: "yours",
    texts: ["像這樣！！ ←←←←??????"],
  },
  { kind: "mine", texts: ["這是真的原肉嗎？"] },
  {
    kind: "yours",
    texts: [
      "對，真材實料原肉切片。",
      "低溫烘培 · 無添加防腐劑 · 適合犬貓小點心。",
    ],
  },
  { kind: "mine", texts: ["什麼是雞霸？"] },
  {
    kind: "yours",
    texts: [
      "雞霸是嚎大大的招牌寵物雞排零食。選用原肉，不是碎肉重組，咬感紮實，訓練獎勵超有感。",
      "配方簡單清楚：要給嚎大大吃的，才敢給你家毛孩吃。",
    ],
  },
  { kind: "mine", texts: ["2. 為什麼毛孩會嚎？"] },
  {
    kind: "yours",
    texts: [
      "因為它真的好吃。大片無骨好撕好餵，成功坐下／握手那一刻，就是雞霸出場的時候。",
      "爸媽比較放心的小點心：無添加防腐劑、無人工香精。",
    ],
  },
  { kind: "mine", texts: ["3. 怎麼買？"] },
  {
    kind: "yours",
    texts: [
      "點上方黃色按鈕，或直接滾到訂購區。每包 NT$320。",
      "手工烘培，限量 DROP #01。",
    ],
  },
  { kind: "mine", texts: ["cool thx", "...你們是誰？"] },
  {
    kind: "yours",
    texts: [
      "這是 匠寵 × 嚎大大雞霸 DROP #01。",
      "Every treat is handmade. No preservatives. Maximum howling.",
    ],
  },
];
