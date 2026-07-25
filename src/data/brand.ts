export const BRAND = {
  name: "嚎大大雞霸",
  shortName: "雞霸",
  mascot: "嚎大大",
  tagline: "毛孩尖叫的原肉雞排零食",
  heroLine: "原肉製作 · 低溫烘培 · 毛孩安心吃",
  description:
    "嚎大大雞霸——以原肉低溫烘培的寵物雞排零食，無添加防腐劑，給毛孩大口開心咬。",
  price: 320,
  currency: "NT$",
  soldOut: false,
  primaryColor: "#c1121f",
  accentColor: "#ffc224",
  heroColor: "#e85d04",
} as const;

export type ProductHighlight = {
  name: string;
  id: string;
  desc: string;
  primaryColor: string;
  accentColor: string;
  textColor: "white" | "black";
  image: string;
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

export const HIGHLIGHTS: ProductHighlight[] = [
  {
    name: "原肉雞霸",
    id: "yuanrou",
    desc: "真材實料，一片就是紮實原肉",
    primaryColor: "#c1121f",
    accentColor: "#ffc224",
    textColor: "white",
    image: "/images/dog-hero.png",
    info: {
      headline: "選用新鮮原肉切片，不是碎肉重組，咬感紮實有滿足感。",
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
    name: "低溫烘培",
    id: "hongpei",
    desc: "溫柔烘乾，鎖住香氣與營養",
    primaryColor: "#e85d04",
    accentColor: "#ffc224",
    textColor: "white",
    image: "/images/dog-hero.png",
    info: {
      headline: "低溫烘培工法，減少高溫破壞，讓雞肉香氣自然浮現。",
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
    name: "毛孩安心",
    id: "anxin",
    desc: "無添加防腐劑，爸媽比較放心",
    primaryColor: "#ffc224",
    accentColor: "#c1121f",
    textColor: "black",
    image: "/images/dog-hero.png",
    info: {
      headline: "配方簡單清楚：要給嚎大大吃的，才敢給你家毛孩吃。",
      desc: "訴求：無添加防腐劑 | 日常獎勵首選",
      doesNotContain: "來路不明添加物",
      numReviews: 142,
      servingSize: "適量",
      totalFat: "安心",
      calories: "開心",
      stars: 5,
      position: "right",
    },
  },
];
