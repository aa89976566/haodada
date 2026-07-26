export const BRAND = {
  name: "嚎大大雞霸",
  shortName: "雞霸",
  mascot: "嚎大大",
  tagline: "毛孩政府不希望你錯過的雞霸",
  heroLine: "原肉製作 · 低溫烘培 · 無添加防腐劑",
  description:
    "嚎大大雞霸——原肉低溫烘培的寵物雞排零食，無添加防腐劑，給毛孩大口開心咬。",
  price: 320,
  currency: "NT$",
  soldOut: false,
  dropLabel: "DROP #01",
} as const;

export type ProductHighlight = {
  name: string;
  id: string;
  desc: string;
  primaryColor: string;
  accentColor: string;
  textColor: "white" | "black";
  /** Card + main product (bag slot) */
  image: string;
  /** Desktop left "eating" layer / mobile ingredient — MUST differ from image */
  sideImage: string;
  info: {
    headline: string;
    desc: string;
    doesNotContain: string;
    numReviews: number;
    servingSize: string;
    totalFat: string;
    calories: string;
    stars: number;
    position: "center" | "right";
  };
};

/**
 * Image map (no duplicates within a single on-screen flavor):
 * - bag/card: unique product photo
 * - side: different dog photo for depth layer
 */
export const HIGHLIGHTS: ProductHighlight[] = [
  {
    name: "嚎大大雞霸",
    id: "jiba",
    desc: "真材實料原肉雞排，咬一口毛孩就嚎",
    primaryColor: "#d71515",
    accentColor: "#ffc224",
    textColor: "white",
    image: "/images/haodada/hero-pomeranian.png",
    sideImage: "/images/haodada/eat-dachshund.png",
    info: {
      headline: "選用原肉切片低溫烘培，不是碎肉重組，咬感紮實有滿足感。",
      desc: "原料：雞肉 | 適合犬貓小點心",
      doesNotContain: "防腐劑",
      numReviews: 128,
      servingSize: "1 片",
      totalFat: "低溫",
      calories: "高蛋白",
      stars: 4.5,
      position: "center",
    },
  },
  {
    name: "無骨雞排",
    id: "wugu",
    desc: "大片無骨，訓練獎勵超有感",
    primaryColor: "#1742c4",
    accentColor: "#ffc224",
    textColor: "white",
    image: "/images/haodada/hero-black.png",
    sideImage: "/images/haodada/eat-bulldog.png",
    info: {
      headline: "大片無骨好撕好餵，訓練成功那一刻就是它。",
      desc: "工法：低溫烘培 | 口感Q香",
      doesNotContain: "人工香精",
      numReviews: 96,
      servingSize: "1 包",
      totalFat: "烘香",
      calories: "好消化",
      stars: 4.5,
      position: "center",
    },
  },
  {
    name: "安心原肉",
    id: "anxin",
    desc: "無添加防腐劑，爸媽比較放心",
    primaryColor: "#ffc224",
    accentColor: "#d71515",
    textColor: "black",
    image: "/images/haodada/pack-brown.png",
    sideImage: "/images/haodada/eat-bulldog.png",
    info: {
      headline: "配方簡單清楚：要給嚎大大吃的，才敢給你家毛孩吃。",
      desc: "訴求：無添加防腐劑 | 日常獎勵首選",
      doesNotContain: "來路不明添加物",
      numReviews: 142,
      servingSize: "適量",
      totalFat: "安心",
      calories: "開心",
      stars: 4.5,
      position: "right",
    },
  },
];

/** Shop box / below-fold only — not used as active hero bag */
export const SHOP_IMAGE = "/images/haodada/pack-brown.png";
export const BELOW_FOLD_IMAGE = "/images/haodada/hero-black.png";
export const MASCOT_IMAGE = "/images/haodada/eat-dachshund.png";
