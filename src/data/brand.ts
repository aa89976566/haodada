export const BRAND = {
  name: "嚎大大雞霸",
  displayName: "嚎大大雞霸",
  shortName: "雞霸",
  mascot: "嚎大大",
  studio: "匠寵",
  furmosa: "FURMOSA",
  description:
    "嚎大大雞霸——匠寵 FURMOSA 寵物雞肉零食。整片雞胸肉低溫烘乾，無添加，給毛孩大口咬才夠味。",
  lineUrl: "https://line.me/R/ti/p/%40furmosa",
  lineHandle: "@furmosa",
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

/** Exactly one video bubble in the thread (left / yours) — chat media card. */
export type ChatVideoBlock = {
  kind: "yours";
  video: string;
  alt: string;
};

export type ChatPreviewBlock = {
  kind: "mine";
  preview: {
    url: string;
    image: string;
    imageAlt: string;
    eyebrow: string;
    title: string;
    description: string;
    domain: string;
  };
};

export type ChatBlock =
  | ChatTextBlock
  | ChatImageBlock
  | ChatVideoBlock
  | ChatPreviewBlock;

/**
 * Taiwan mobile group-chat tone — spoken, light punctuation, no ad-speak.
 * Photo after「坐好」; park video after「你看」; product and LINE links in the closing exchange.
 * No hard-sell CTAs / purchase buttons.
 */
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
  { kind: "mine", texts: ["看起來也太大一片", "那麼大片是要怎麼吃完啦"] },
  {
    kind: "yours",
    texts: [
      "中型犬其實一週左右就吃得完",
      "不然拿去跟朋友家的狗一起分也很剛好",
      "而且三隻一起等雞排真的超可愛",
    ],
  },
  {
    kind: "yours",
    image: "/images/haodada/three-dogs-share-chicken-v3.png",
    alt: "飼主拿著雞霸，三隻狗狗一起期待分享",
  },
  {
    kind: "yours",
    texts: [
      "對啊大到拿著很像在吃雞排",
      "但裡面就只有雞肉",
      "沒香料沒色素也沒防腐劑",
    ],
  },
  { kind: "mine", texts: ["所以是無添加喔"] },
  {
    kind: "yours",
    texts: ["對啊 無添加", "快快吃，快快分享", "我買過", "我家那隻看到袋子就自己坐好"],
  },
  {
    kind: "yours",
    image: "/images/haodada/customer-dog-product-v3.jpg",
    alt: "使用者的狗狗咬著嚎大大雞霸",
  },
  {
    kind: "mine",
    texts: ["這張太扯了吧", "根本可以拿去當證件照"],
  },
  {
    kind: "yours",
    texts: ["而且一包價格沒有想像中貴", "我本來以為這麼大片會很盤"],
  },
  { kind: "mine", texts: ["難怪剛剛整群狗都跟著你"] },
  { kind: "yours", texts: ["你看"] },
  {
    kind: "yours",
    video: "/images/haodada/dogpark-product-v2.mp4",
    alt: "狗公園拿著嚎大大雞霸的影片",
  },
  { kind: "yours", texts: ["有帶雞霸的直接變狗王"] },
  { kind: "mine", texts: ["旁邊那個完全沒狗理"] },
  {
    kind: "yours",
    texts: [
      "不要再講了",
      "他看起來已經快回家反省人生",
      "欸而且裡面還有狗狗卡牌",
    ],
  },
  { kind: "mine", texts: ["什麼意思"] },
  {
    kind: "yours",
    texts: ["如果抽到跟自己家狗同品種", "可以再換一包"],
  },
  {
    kind: "mine",
    texts: [
      "這活動誰想的啦",
      "狗還要先接受血統考驗是不是",
      "他們網站好可愛喔",
      "你有看到嗎",
    ],
  },
  {
    kind: "mine",
    preview: {
      url: BRAND.shopUrl,
      image: "/images/hero-furmosa-real-package-v2.jpg",
      imageAlt: "嚎大大雞霸商品與復古電腦的品牌主視覺",
      eyebrow: "匠寵 FURMOSA",
      title: "嚎大大雞霸｜雞肉原味",
      description: "整片雞胸肉低溫烘乾・無添加",
      domain: "furmosa.com",
    },
  },
  { kind: "mine", texts: ["欸那你知道他們官方 LINE 嗎"] },
  {
    kind: "yours",
    texts: [
      `<a href="${BRAND.lineUrl}" target="_blank" rel="noopener noreferrer" class="chat-link" aria-label="加入 LINE 官方帳號 ${BRAND.lineHandle}">LINE ${BRAND.lineHandle}</a>`,
      "你可以直接聯繫他們啊",
      "感覺他們滿好玩的哈哈",
    ],
  },
];
