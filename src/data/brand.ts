export const BRAND = {
  name: "嚎大大雞霸",
  displayName: "嚎大大雞霸",
  shortName: "雞霸",
  mascot: "嚎大大",
  studio: "匠寵",
  furmosa: "FURMOSA",
  description:
    "嚎大大雞霸——匠寵 FURMOSA 寵物雞肉零食。純雞肉製泥、鋪平塑形，做成夜市雞排模樣；無添加香料、色素與防腐劑。",
  lineUrl: "https://line.me/R/ti/p/%40furmosa",
  lineHandle: "@furmosa",
  shopUrl:
    "https://furmosa.com/products/chicken-fillet",
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
  | { kind: "yours"; photos: { image: string; alt: string }[] }
  | ChatTextBlock
  | ChatImageBlock
  | ChatVideoBlock
  | ChatPreviewBlock;

/** Short chat: curiosity, practical answers, shared ritual, then purchase. */
export const CHAT: ChatBlock[] = [
  { kind: "mine", texts: ["等一下", "牠怎麼也有雞排"] },
  { kind: "yours", texts: ["牠的啦，狗狗吃的雞肉乾", "只是長得很像我們的宵夜"] },
  { kind: "mine", texts: ["連紙袋都有也太像", "所以不是炸的喔？"] },
  { kind: "yours", texts: ["不是啦，雞肉製泥再鋪平塑形", "純雞肉，沒加香料、色素、防腐劑"] },
  { kind: "mine", texts: ["認真做成雞排欸"] },
  { kind: "yours", texts: ["你看他們分享的這幾隻"] },
  {
    kind: "yours",
    photos: [
      { image: "/images/haodada/ugc-cooper-original.jpg", alt: "Cooper 咬著紙袋中的雞霸雞排" },
      { image: "/images/haodada/ugc-xiaomi-original.jpg", alt: "許小咪張著嘴，前方放著雞霸雞排" },
    ],
  },
  { kind: "mine", texts: ["這個表情", "跟我等鹽酥雞一模一樣"] },
  { kind: "mine", texts: ["但這麼大，牠要怎麼吃"] },
  { kind: "yours", texts: ["可以剪小段，照體型調整份量", "當零食慢慢餵，不是一次吃完啦"] },
  { kind: "mine", texts: ["那開了能放多久？"] },
  { kind: "yours", texts: ["商品頁寫未開封一個月，開封後兩週", "也可以跟朋友家的狗分"] },
  {
    kind: "yours",
    photos: [
      { image: "/images/haodada/ugc-fagui-biting-original.jpg", alt: "發貴咬著飼主手中紙袋裡的雞霸雞排" },
      { image: "/images/haodada/ugc-oppa-original.jpg", alt: "歐巴在家中與雞霸雞排紙袋合照" },
    ],
  },
  { kind: "mine", texts: ["好好笑，別人家也把狗養成夜市咖"] },
  { kind: "yours", texts: ["出門會多算牠一位的那種"] },
  { kind: "mine", texts: ["對啊，我找餐廳都先問狗能不能去"] },
  { kind: "yours", texts: ["那你看這個"] },
  { kind: "yours", video: "/images/haodada/dogpark-product-v2.mp4", alt: "狗公園拿著嚎大大雞霸的影片" },
  { kind: "mine", texts: ["有帶雞霸的直接變狗王"] },
  { kind: "yours", texts: ["週末聚會知道要帶什麼了吧"] },
  {
    kind: "yours",
    photos: [
      { image: "/images/haodada/ugc-white-french-bulldog-original.png", alt: "白色法鬥閉著眼睛咬雞排" },
      { image: "/images/haodada/ugc-french-bulldog-original.png", alt: "黑色法鬥與紙袋中的雞排合照" },
    ],
  },
  { kind: "mine", texts: ["閉眼那張太懂吃了", "宵夜團總不能少牠"] },
  { kind: "mine", texts: ["一包多少？"] },
  { kind: "yours", texts: ["99 元，一包 50g", "運費結帳時再看"] },
  { kind: "mine", texts: ["好，週末算牠一份", "雞排哪裡買"] },
  {
    kind: "mine",
    preview: {
      url: BRAND.shopUrl,
      image: "/images/haodada/product-reference.jpeg",
      imageAlt: "嚎大大雞霸雞肉原味產品包裝",
      eyebrow: "匠寵 FURMOSA",
      title: "嚎大大雞霸｜雞肉原味",
      description: "NT$99／50g・純雞肉製成",
      domain: "furmosa.com",
    },
  },
  { kind: "yours", texts: ["有問題也可以直接問他們", `<a href="${BRAND.lineUrl}" target="_blank" rel="noopener noreferrer" class="chat-link" aria-label="加入 LINE 官方帳號 ${BRAND.lineHandle}">LINE ${BRAND.lineHandle}</a>`] },
];
