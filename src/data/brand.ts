export const BRAND = {
  name: "壕大大雞霸",
  displayName: "◈ 壕大大 ◈ 雞霸",
  shortName: "雞霸",
  mascot: "壕大大",
  tagline: "夜市雞排靈感 · 毛孩大口滿足肉乾",
  heroLine: "整片雞胸肉低溫烘乾 · 高蛋白 · 單一蛋白",
  description:
    "◈ 壕大大 ◈ 雞霸——夜市雞排靈感設計，為毛孩打造的大口滿足肉乾。整片雞胸肉低溫烘乾，保留蛋白質與肉香。",
  price: 79,
  priceOriginal: 89,
  currency: "NT$",
  soldOut: false,
  dropLabel: "DROP #01",
  cta: "來點雞霸！！",
  ctaHint: "點一下去 Furmosa 下單。我們會寄雞霸給你。",
  studio: "匠寵",
  shopUrl:
    "https://furmosa.com/products/chicken-fillet?variant=56882074419577",
  features: ["高蛋白補給", "高適口性", "單一蛋白", "低溫烘乾"] as const,
  variants: [
    {
      id: "carrot",
      name: "雞肉胡蘿蔔",
      price: 79,
      blurb: "添加紅蘿蔔，補充β胡蘿蔔素與膳食纖維，幫助皮膚與腸道健康。",
      nutrition: "粗蛋白 58% · 粗脂肪 13% · 粗纖維 2% · 含β胡蘿蔔素",
      url: "https://furmosa.com/products/chicken-fillet?variant=56882074419577",
    },
    {
      id: "plain",
      name: "雞肉原味",
      price: 89,
      blurb: "純雞肉製成，高蛋白低負擔，適合日常獎勵與基礎營養補給。",
      nutrition: "粗蛋白 62% · 粗脂肪 14.5% · 粗纖維 0.5%",
      url: "https://furmosa.com/products/chicken-fillet?variant=56882074452345",
    },
  ] as const,
} as const;

export type ChatBlock =
  | { kind: "mine"; texts: string[] }
  | { kind: "yours"; texts: string[] };

export const CHAT: ChatBlock[] = [
  { kind: "mine", texts: ["寄雞霸來！！"] },
  {
    kind: "yours",
    texts: ["像這樣！！ 大口雞胸肉乾 ←←←←??????"],
  },
  { kind: "mine", texts: ["這是什麼做的？"] },
  {
    kind: "yours",
    texts: [
      "整片雞胸肉低溫烘乾，保留蛋白質與肉香，大片造型增加咀嚼感與滿足感。",
      "高蛋白補給 · 高適口性 · 單一蛋白 · 低溫烘乾",
    ],
  },
  { kind: "mine", texts: ["什麼是雞霸？"] },
  {
    kind: "yours",
    texts: [
      "夜市雞排靈感設計，為毛孩打造的大口滿足肉乾。",
      "兩種口味：經典原味雞肉，與雞肉紅蘿蔔。",
    ],
  },
  { kind: "mine", texts: ["2. 兩種口味差在哪？"] },
  {
    kind: "yours",
    texts: [
      "原味雞肉：純雞肉製成，高蛋白低負擔，適合日常獎勵。粗蛋白 62%。",
      "雞肉紅蘿蔔：添加紅蘿蔔，補充β胡蘿蔔素與膳食纖維。粗蛋白 58%。",
    ],
  },
  { kind: "mine", texts: ["3. 誰可以吃？怎麼餵？"] },
  {
    kind: "yours",
    texts: [
      "適合 6 個月以上狗狗與貓咪、活動量大、挑嘴毛孩。",
      "日常獎勵使用，可剪小段餵食，依體型調整份量。請搭配主食與充足飲水。",
    ],
  },
  { kind: "mine", texts: ["4. 怎麼買？多少錢？"] },
  {
    kind: "yours",
    texts: [
      "雞肉胡蘿蔔 NT$79 · 雞肉原味 NT$89。點上方黃色按鈕直達 Furmosa。",
      "by 匠寵 · furmosa.com",
    ],
  },
  { kind: "mine", texts: ["cool thx", "...你們是誰？"] },
  {
    kind: "yours",
    texts: [
      "這是 匠寵 × ◈ 壕大大 ◈ 雞霸。",
      "夜市雞排靈感，毛孩大口滿足。",
    ],
  },
];
