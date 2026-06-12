import { Product } from "@/types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Silk Slip Dress",
    brand: "House of CB",
    category: "dress",
    occasion: "party",
    images: [
      "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
    ],
    rentalPrice: { perDay: 499, per3Days: 1199, perWeek: 1999 },
    retailPrice: 12000,
    sizes: ["XS", "S", "M", "L"],
    description:
      "Draped in pure silk with a fluid silhouette, this slip dress transitions effortlessly from a rooftop gathering to a gallery opening.",
    available: true,
    tags: ["silk", "evening", "minimalist"],
    rating: 4.8,
    reviewCount: 124,
  },
  {
    id: "2",
    name: "Structured Blazer Dress",
    brand: "Reformation",
    category: "dress",
    occasion: "work",
    images: [
      "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=600&q=80",
    ],
    rentalPrice: { perDay: 599, per3Days: 1499, perWeek: 2499 },
    retailPrice: 18000,
    sizes: ["S", "M", "L", "XL"],
    description:
      "A power-dressing essential. Tailored lapels and a relaxed hem create the perfect balance of authority and ease.",
    available: true,
    tags: ["blazer", "formal", "tailored"],
    rating: 4.7,
    reviewCount: 89,
  },
  {
    id: "3",
    name: "Floral Maxi Dress",
    brand: "Zimmermann",
    category: "dress",
    occasion: "wedding",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    ],
    rentalPrice: { perDay: 799, per3Days: 1999, perWeek: 3299 },
    retailPrice: 28000,
    sizes: ["XS", "S", "M"],
    description:
      "Cascading botanicals on a flowing chiffon base. Made for ceremonies where every moment is photographed.",
    available: true,
    tags: ["floral", "maxi", "wedding guest"],
    rating: 4.9,
    reviewCount: 203,
  },
  {
    id: "4",
    name: "Classic Trench Coat",
    brand: "Burberry",
    category: "outerwear",
    occasion: "casual",
    images: [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&q=80",
    ],
    rentalPrice: { perDay: 699, per3Days: 1699, perWeek: 2799 },
    retailPrice: 45000,
    sizes: ["S", "M", "L", "XL"],
    description:
      "The coat that started it all. A heritage double-breasted trench in gabardine with signature check lining.",
    available: true,
    tags: ["trench", "classic", "outerwear"],
    rating: 4.9,
    reviewCount: 312,
  },
  {
    id: "5",
    name: "Wide-Leg Linen Suit",
    brand: "Toteme",
    category: "suit",
    occasion: "formal",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4b4ae5?w=600&q=80",
    ],
    rentalPrice: { perDay: 649, per3Days: 1549, perWeek: 2599 },
    retailPrice: 22000,
    sizes: ["XS", "S", "M", "L", "XL"],
    description:
      "Italian linen in warm ecru. The relaxed wide-leg silhouette makes this suit as comfortable as it is commanding.",
    available: true,
    tags: ["linen", "suit", "minimalist"],
    rating: 4.6,
    reviewCount: 67,
  },
  {
    id: "6",
    name: "Sequin Mini Dress",
    brand: "ASOS Edition",
    category: "dress",
    occasion: "party",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
    ],
    rentalPrice: { perDay: 449, per3Days: 999, perWeek: 1699 },
    retailPrice: 9000,
    sizes: ["XS", "S", "M", "L"],
    description:
      "Head-to-toe sequins in champagne gold. The kind of dress that gets its own hashtag.",
    available: false,
    tags: ["sequin", "party", "glam"],
    rating: 4.5,
    reviewCount: 156,
  },
  {
    id: "7",
    name: "Pleated Midi Skirt",
    brand: "Jacquemus",
    category: "bottom",
    occasion: "casual",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
    ],
    rentalPrice: { perDay: 349, per3Days: 849, perWeek: 1399 },
    retailPrice: 14000,
    sizes: ["XS", "S", "M", "L"],
    description:
      "Fine pleats in blush linen move like water. Pairs beautifully with both a classic white shirt and a graphic tee.",
    available: true,
    tags: ["pleated", "midi", "linen"],
    rating: 4.7,
    reviewCount: 94,
  },
  {
    id: "8",
    name: "Velvet Evening Gown",
    brand: "Galvan London",
    category: "dress",
    occasion: "formal",
    images: [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&q=80",
    ],
    rentalPrice: { perDay: 999, per3Days: 2499, perWeek: 3999 },
    retailPrice: 55000,
    sizes: ["XS", "S", "M"],
    description:
      "Midnight velvet, floor-length. A dress that requires no introduction when you walk into a room.",
    available: true,
    tags: ["velvet", "gown", "evening", "luxury"],
    rating: 5.0,
    reviewCount: 41,
  },
];

export const featuredProducts = mockProducts.slice(0, 4);

export const categories = [
  { id: "all", label: "All Pieces" },
  { id: "dress", label: "Dresses" },
  { id: "outerwear", label: "Outerwear" },
  { id: "suit", label: "Suits" },
  { id: "bottom", label: "Bottoms" },
  { id: "top", label: "Tops" },
  { id: "accessory", label: "Accessories" },
];

export const occasions = [
  { id: "all", label: "All Occasions" },
  { id: "casual", label: "Casual" },
  { id: "work", label: "Work" },
  { id: "party", label: "Party" },
  { id: "formal", label: "Formal" },
  { id: "wedding", label: "Wedding" },
];
