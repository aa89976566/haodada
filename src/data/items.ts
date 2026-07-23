export type ChipItem = {
  name: string;
  id: string;
  desc: string;
  primaryColor: string;
  accentColor: string;
  textColor: "white" | "black";
  showMythical?: boolean;
  link?: string;
  info: {
    headline: string;
    desc: string;
    doesNotContain: string;
    numReviews: number;
    servingSize: number;
    totalFat: number;
    calories: number;
    stars: number;
    position: "center" | "right";
  };
};

export const ITEMS: ChipItem[] = [
  {
    name: "Horse Meat",
    id: "horse-meat",
    desc: "Horse meat has been banned since 1847",
    primaryColor: "#d71515",
    accentColor: "#ffc224",
    textColor: "white",
    info: {
      headline:
        "In France, horse is a standard meat, but in the U.S. it’s effectively banned.",
      desc: "Allergens: none | kosher, vegan",
      doesNotContain: "Horse Meat",
      numReviews: 411,
      servingSize: 1,
      totalFat: 24,
      calories: 450,
      stars: 4,
      position: "center",
    },
  },
  {
    name: "Fugu",
    id: "fugu",
    desc: "Fugu is so DEADLY it’s illegal to serve without a license",
    primaryColor: "#1742c4",
    accentColor: "#ffc224",
    textColor: "white",
    showMythical: true,
    link: "https://www.youtube.com/watch?v=Y9KyBdPeKHg",
    info: {
      headline:
        "A heavily restricted culinary delicacy– if improperly prepared, Fugu is highly toxic.",
      desc: "Allergens: soy, wheat | kosher, vegan",
      doesNotContain: "Poison Blowfish",
      numReviews: 507,
      servingSize: 1,
      totalFat: 24,
      calories: 450,
      stars: 4.5,
      position: "center",
    },
  },
  {
    name: "Casu Marzu",
    id: "casu-marzu",
    desc: "Casu Marzu, sardinian maggot Pecorino, is illegal everywhere",
    primaryColor: "#ffc224",
    accentColor: "#d71515",
    textColor: "black",
    info: {
      headline:
        "Casu Marzu is illegal everywhere, even in its native Sardinia.",
      desc: "Allergens: milk, sesame | kosher, vegetarian",
      doesNotContain: "Maggot Cheese",
      numReviews: 460,
      servingSize: 1,
      totalFat: 24,
      calories: 450,
      stars: 4,
      position: "right",
    },
  },
];

export const SOLD_OUT = true;
export const BOX_UNIT_PRICE = 36;
