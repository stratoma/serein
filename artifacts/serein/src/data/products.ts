const BASE = import.meta.env.BASE_URL;

export type FeaturedIngredient = {
  name: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  price: string;
  size: string | null;
  pillar: string;
  emotionalTerritory: string;
  scent: string;
  productSensoryIntro: string;
  fragranceDescription: string;
  fragranceNotes: string[];
  fragranceTopNotes?: string[];
  fragranceHeartNotes?: string[];
  fragranceBaseNotes?: string[];
  ritualScene: string | null;
  ritualInstructions: string | null;
  ritualClosing: string | null;
  featuredIngredients: FeaturedIngredient[];
  fullIngredients: string | null;
  details: string[];
  desc: string;
  notes: string[];
  tagline: string;
  img: string;
  cleanStill?: string;
  scentCard?: string;
  ingredientsGraphic?: string;
  caption: string;
  story: string[];
  feelNote: string;
  howToUse: string;
  lifestyle: string;
  lifestyleCaption: string;
  ingredients: string[];
};

export const brandContent = {
  brandName: "Serein",
  craftsmanshipStatement: "Made in small, considered batches to preserve freshness, texture, and formula integrity.",
} as const;

const sharedFeaturedIngredients: FeaturedIngredient[] = [
  { name: "Shea Butter", description: "A rich botanical butter selected for its soft, cushioning feel on skin." },
  { name: "Mango Butter", description: "A silky butter that contributes to the formula's smooth, comfortable texture." },
  { name: "Jojoba Oil", description: "A lightweight botanical oil selected for easy spread and a soft, conditioned finish." },
  { name: "Vitamin E", description: "A conditioning ingredient that supports the formula and helps maintain a supple skin feel." },
  { name: "Arrowroot", description: "A fine powder that contributes to the formula's dry-touch finish." },
];

export const products: Product[] = [
  {
    id: "supple-oud",
    name: "Supple Oud",
    price: "$22",
    size: null,
    pillar: "Transform.",
    emotionalTerritory: "Sensuality through warmth",
    scent: "Smoke. Wood. Depth.",
    productSensoryIntro: "A rich, soft-melting body butter that leaves skin supple and comfortable while saffron, amber, and oud settle into a warm, skin-close finish.",
    fragranceDescription: "Saffron opens the composition before amber warms it. Oud rests beneath, giving the fragrance a deep, textured finish that lingers close to the skin.",
    fragranceNotes: ["Saffron", "Amber", "Oud Wood", "Cashmere Woods & Tonka", "Sweet Amber Musk"],
    ritualScene: null,
    ritualInstructions: null,
    ritualClosing: null,
    featuredIngredients: sharedFeaturedIngredients,
    fullIngredients: null,
    details: [],
    desc: "A slow, resinous blend of saffron, amber, and oud for skin that feels softly warmed and deeply cared for.",
    notes: ["Saffron", "Amber", "Oud Wood", "Cashmere Woods & Tonka", "Sweet Amber Musk"],
    tagline: "Warmth with depth.",
    img: `${BASE}images/supple-oud-still.png`,
    cleanStill: `${BASE}images/supple-oud-clean.png`,
    scentCard: `${BASE}images/supple-oud-scent-card.png`,
    ingredientsGraphic: `${BASE}images/supple-oud-ingredients.png`,
    caption: "Saffron, amber, and oud for the last quiet hour of the day.",
    story: [
      "Supple Oud belongs to the quiet part of evening, when the room is warm and the day has finally loosened its hold.",
      "Saffron opens first, followed by amber and oud. The composition stays close to the skin: textured, woody, and made for unhurried moments.",
    ],
    feelNote: "A rich butter that softens with the warmth of your hands, then settles into skin with a cushioned, comfortable finish.",
    howToUse: "Warm a small amount between your palms and press into skin after bathing. Let the scent settle before you move on.",
    lifestyle: `${BASE}images/story.png`,
    lifestyleCaption: "An evening ritual. Unhurried.",
    ingredients: ["Shea Butter", "Mango Butter", "Jojoba Oil", "Vitamin E", "Arrowroot", "Saffron & Oud Fragrance Blend"],
  },
  {
    id: "mint-moss",
    name: "Mint + Moss",
    price: "$22",
    size: null,
    pillar: "Root.",
    emotionalTerritory: "Freshness through movement",
    scent: "Fresh mint. Earth. Green renewal.",
    productSensoryIntro: "A light, quick-absorbing body butter that leaves skin soft and dry to the touch as garden mint, green tea, and vetiver unfold close to the body.",
    fragranceDescription: "Garden mint opens clean and bright, then softens into green tea and vetiver. Cedarwood gives the finish a grounded, quietly brisk feel.",
    fragranceNotes: ["Garden Mint", "Green Tea", "Vetiver Blend", "Cedarwood", "Sweet Amber Musk"],
    ritualScene: null,
    ritualInstructions: null,
    ritualClosing: null,
    featuredIngredients: sharedFeaturedIngredients,
    fullIngredients: null,
    details: [],
    desc: "Garden mint, green tea, and vetiver in a clean, green composition that makes the first moments of the day feel more spacious.",
    notes: ["Garden Mint", "Green Tea", "Vetiver Blend", "Cedarwood", "Sweet Amber Musk"],
    tagline: "Green, clear, grounded.",
    img: `${BASE}images/mint-moss-still.png`,
    cleanStill: `${BASE}images/mint-moss-clean.png`,
    scentCard: `${BASE}images/mint-moss-scent-card.png`,
    ingredientsGraphic: `${BASE}images/mint-moss-scent-card.png`,
    caption: "Garden mint and vetiver for a clear beginning.",
    story: [
      "Mint + Moss was composed for the first quiet moments of morning, before the day begins asking for your attention.",
      "Garden mint arrives clean and bright. Green tea, vetiver, and cedarwood give it a steadier base, keeping the freshness close and grounded.",
    ],
    feelNote: "Light and quick to settle, with a dry-touch finish that leaves skin soft rather than slick.",
    howToUse: "Apply after your morning shower or whenever you want a small reset. Take a moment with the first cool, green notes.",
    lifestyle: `${BASE}images/journal-1.png`,
    lifestyleCaption: "Morning light. A quiet start.",
    ingredients: ["Shea Butter", "Mango Butter", "Jojoba Oil", "Vitamin E", "Arrowroot", "Garden Mint & Vetiver Fragrance Blend"],
  },
  {
    id: "lithe-bloom",
    name: "Lithe Bloom",
    price: "$22",
    size: null,
    pillar: "Become.",
    emotionalTerritory: "Joy through light",
    scent: "Soft florals. Warm citrus. Light.",
    productSensoryIntro: "A light, soft-melting body butter that leaves skin smooth and supple as orange blossom, neroli, and amber musk unfold in a luminous veil of scent.",
    fragranceDescription: "Bergamot brings a bright opening before orange blossom and neroli soften into view. Amber musk gives the fragrance a warm, airy finish that rests close to skin.",
    fragranceNotes: ["Orange Blossom", "Bergamot", "Neroli", "Sweet Amber Musk"],
    ritualScene: null,
    ritualInstructions: null,
    ritualClosing: null,
    featuredIngredients: sharedFeaturedIngredients,
    fullIngredients: null,
    details: [],
    desc: "Orange blossom, bergamot, neroli, and soft amber musk in a luminous floral composition made to be noticed only up close.",
    notes: ["Orange Blossom", "Bergamot", "Neroli", "Sweet Amber Musk"],
    tagline: "Light, held close.",
    img: `${BASE}images/lithe-bloom-still.png`,
    cleanStill: `${BASE}images/lithe-bloom-clean.png`,
    scentCard: `${BASE}images/lithe-bloom-scent-notes.png`,
    ingredientsGraphic: `${BASE}images/lithe-bloom-ingredients.png`,
    caption: "Neroli and orange blossom, softened by amber musk.",
    story: [
      "Lithe Bloom is made for the gentler turn of a day: open windows, clean linen, a little more room to breathe.",
      "Neroli and orange blossom bring a soft floral lift. Bergamot keeps it crisp, while amber musk gives the composition a warm, skin-close finish.",
    ],
    feelNote: "The lightest expression in the collection, with a supple finish that leaves skin smooth and softly scented.",
    howToUse: "Smooth onto the places you notice most: arms, shoulders, collarbone. Wear it close and let it unfold gradually.",
    lifestyle: `${BASE}images/journal-2.png`,
    lifestyleCaption: "Quiet light. Something opening.",
    ingredients: ["Shea Butter", "Mango Butter", "Jojoba Oil", "Vitamin E", "Arrowroot", "Orange Blossom & Neroli Fragrance Blend"],
  },
];

export function getProductById(id: string) {
  return products.find((p) => p.id === id) ?? null;
}
