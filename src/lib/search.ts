import type { Product } from "@/types";

/**
 * Client-side catalogue search.
 *
 * 1. Normalise: case, accents, punctuation, simple plurals ("gowns" → "gown"),
 *    and two-word phrases ("off shoulder" → "offshoulder").
 * 2. Correct: a word the catalogue doesn't know is replaced by the closest word it
 *    does ("balck" → "black", "sequen" → "sequin"). If nothing is close, it's ignored.
 * 3. Match: each word must match a piece exactly, through a synonym
 *    ("maroon" → burgundy/wine, "sherwani" → bandhgala) or as a prefix while typing.
 * 4. Rank by where it matched: name > tags/label > category/occasion > description.
 *    If no piece matches every word, fall back to pieces matching some of them.
 */

const STOP_WORDS = new Set([
  "a", "an", "and", "the", "for", "to", "in", "on", "of", "with", "my", "me", "i", "im", "need", "want", "some",
  "something", "rent", "rental", "hire", "outfit", "wear", "look", "guest", "piece", "clothe", "cloth", "please",
  "nice", "good", "show", "find", "any",
]);

// Two-word phrases that mean one thing. Joined before matching, in queries and product text alike.
const PHRASES: [RegExp, string][] = [
  [/\boff shoulder\b/g, "offshoulder"],
  [/\bone shoulder\b/g, "oneshoulder"],
  [/\bcold shoulder\b/g, "coldshoulder"],
  [/\bblack tie\b/g, "blacktie"],
  [/\bdinner jacket\b/g, "dinnerjacket"],
  [/\b(?:two|2) piece\b/g, "twopiece"],
  [/\b(?:three|3) piece\b/g, "threepiece"],
  [/\bfloor length\b/g, "floorlength"],
  [/\bknee length\b/g, "kneelength"],
  [/\boff white\b/g, "offwhite"],
  [/\brain jacket\b/g, "raincoat"],
];

// Interchangeable words. Only single words here; phrases are joined above first.
const SYNONYM_GROUPS: string[][] = [
  ["dress", "frock"],
  ["gown", "maxi", "floorlength", "column"],
  ["mini", "skater"],
  ["midi", "kneelength"],
  ["suit", "blazer", "twopiece", "threepiece"],
  ["tuxedo", "tux", "dinnerjacket"],
  ["bandhgala", "bandh", "sherwani", "jodhpuri", "achkan", "nehru"],
  ["kurta", "kurti", "ethnic", "traditional", "indian"],
  ["coat", "jacket", "puffer", "parka", "outerwear"],
  ["waterproof", "rain", "monsoon", "raincoat"],
  ["winter", "snow", "warm"],
  ["red", "crimson", "scarlet", "cherry", "poppy"],
  ["burgundy", "wine", "maroon", "oxblood", "plum"],
  ["navy", "blue", "midnight"],
  ["green", "emerald", "forest", "bottle"],
  ["pink", "rose", "blush", "dusty"],
  ["black", "noir"],
  ["white", "ivory", "cream", "offwhite"],
  ["grey", "gray", "silver", "dove"],
  ["gold", "golden"],
  ["lilac", "lavender", "purple", "mauve"],
  ["wedding", "shaadi", "reception", "sangeet", "mehendi", "mehndi", "haldi", "engagement", "bride", "groom"],
  ["party", "cocktail", "birthday", "club"],
  ["formal", "blacktie", "gala"],
  ["work", "office", "interview", "corporate", "presentation"],
  ["casual", "travel", "trip", "holiday", "everyday"],
  ["sequin", "sparkle", "glitter", "embellished"],
  ["offshoulder", "bardot"],
  ["halter", "halterneck"],
  ["lace", "lacy"],
];

const CATEGORY_WORDS: Record<Product["category"], string> = {
  dress: "dress",
  suit: "suit",
  top: "top kurta",
  bottom: "bottom trouser",
  outerwear: "outerwear coat jacket",
  accessory: "accessory",
};

const OCCASION_WORDS: Record<Product["occasion"], string> = {
  wedding: "wedding",
  party: "party",
  formal: "formal blacktie",
  work: "work",
  casual: "casual travel everyday",
};

export function normalize(text: string): string {
  let out = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  for (const [re, joined] of PHRASES) out = out.replace(re, joined);
  return out;
}

export function stem(word: string): string {
  if (word.length > 4 && word.endsWith("ies")) return word.slice(0, -3) + "y";
  if (word.length > 4 && /(ches|shes|sses|xes)$/.test(word)) return word.slice(0, -2);
  if (word.length > 3 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

const tokenize = (text: string) => normalize(text).split(" ").filter(Boolean).map(stem);

// word → every word it's interchangeable with
const SYNONYMS = new Map<string, Set<string>>();
for (const group of SYNONYM_GROUPS) {
  const words = group.map(stem);
  for (const w of words) {
    const set = SYNONYMS.get(w) ?? new Set<string>();
    words.forEach((x) => set.add(x));
    SYNONYMS.set(w, set);
  }
}

/** Edit distance where swapping two neighbouring letters counts as one edit ("balck" → "black"). */
export function editDistance(a: string, b: string, max = 2): number {
  if (Math.abs(a.length - b.length) > max) return max + 1;
  const d: number[][] = Array.from({ length: a.length + 1 }, (_, i) => {
    const row = new Array<number>(b.length + 1).fill(0);
    row[0] = i;
    return row;
  });
  for (let j = 0; j <= b.length; j++) d[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    let rowMin = Infinity;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
      rowMin = Math.min(rowMin, d[i][j]);
    }
    if (rowMin > max) return max + 1;
  }
  return d[a.length][b.length];
}

/** How many typos we allow for a word of this length. */
const typoBudget = (word: string) => (word.length >= 7 ? 2 : word.length >= 4 ? 1 : 0);

type Field = { tokens: string[]; weight: number };

function fieldsOf(p: Product): Field[] {
  return [
    { tokens: tokenize(p.name), weight: 4 },
    { tokens: tokenize(`${p.brand} ${p.tags.join(" ")}`), weight: 3 },
    { tokens: tokenize(`${CATEGORY_WORDS[p.category] ?? p.category} ${OCCASION_WORDS[p.occasion] ?? p.occasion}`), weight: 2 },
    { tokens: tokenize(p.description), weight: 1 },
  ];
}

/** How well one query word matches one product: 0 means not at all. */
function scoreTerm(term: string, fields: Field[]): number {
  const synonyms = SYNONYMS.get(term);
  let best = 0;
  for (const { tokens, weight } of fields) {
    for (const t of tokens) {
      let q = 0;
      if (t === term) q = 1;
      else if (synonyms?.has(t)) q = 0.8;
      else if (term.length >= 3 && t.startsWith(term)) q = 0.7;
      if (q * weight > best) best = q * weight;
    }
  }
  return best;
}

function vocabularyOf(products: Product[]) {
  const vocab = new Set<string>();
  for (const p of products) fieldsOf(p).forEach((f) => f.tokens.forEach((t) => vocab.add(t)));
  SYNONYMS.forEach((_, w) => vocab.add(w));
  return vocab;
}

/** Closest known word, preferring the same length, then attribute words (colours, fabrics), on ties. */
function closestWord(term: string, vocab: Set<string>): string | undefined {
  const budget = typoBudget(term);
  if (!budget) return undefined;
  let best: string | undefined;
  let bestKey: [number, number, number] = [budget + 1, 1, 1];
  vocab.forEach((v) => {
    if (v.length < 3) return;
    const dist = editDistance(term, v, budget);
    if (dist > budget) return;
    const key: [number, number, number] = [dist, v.length === term.length ? 0 : 1, SYNONYMS.has(v) ? 0 : 1];
    for (let i = 0; i < 3; i++) {
      if (key[i] < bestKey[i]) {
        bestKey = key;
        best = v;
        break;
      }
      if (key[i] > bestKey[i]) break;
    }
  });
  return best;
}

export type SearchResult = {
  /** "all": every word matched. "some": fallback, only some words matched. "none": nothing. */
  mode: "all" | "some" | "none";
  results: Product[];
  scores: Map<string, number>;
  /** Set when words were auto-corrected, e.g. "black dress" for "balck dress". */
  correctedQuery?: string;
  /** Words we didn't recognise at all and left out. */
  ignored: string[];
};

export function searchProducts(products: Product[], query: string): SearchResult {
  const vocab = vocabularyOf(products);
  const vocabList = Array.from(vocab);
  const words = normalize(query).split(" ").filter(Boolean);
  const terms: string[] = [];
  const ignored: string[] = [];
  const shown: string[] = [];
  let corrected = false;

  for (const word of words) {
    const t = stem(word);
    if (STOP_WORDS.has(t) || STOP_WORDS.has(word)) {
      shown.push(word);
      continue;
    }
    const known = vocab.has(t) || (t.length >= 3 && vocabList.some((v) => v.startsWith(t)));
    if (known) {
      terms.push(t);
      shown.push(word);
      continue;
    }
    const fix = closestWord(t, vocab);
    if (fix) {
      terms.push(fix);
      shown.push(fix);
      corrected = true;
    } else {
      ignored.push(word);
    }
  }

  const correctedQuery = corrected ? shown.join(" ") : undefined;
  if (terms.length === 0) {
    return ignored.length === 0
      ? { mode: "all", results: products, scores: new Map(), ignored }
      : { mode: "none", results: [], scores: new Map(), ignored };
  }

  const scored = products.map((p) => {
    const fields = fieldsOf(p);
    const perTerm = terms.map((t) => scoreTerm(t, fields));
    return { product: p, matched: perTerm.filter((x) => x > 0).length, score: perTerm.reduce((a, b) => a + b, 0) };
  });

  const byRelevance = (a: (typeof scored)[number], b: (typeof scored)[number]) =>
    b.matched - a.matched || b.score - a.score || b.product.reviewCount - a.product.reviewCount;

  const all = scored.filter((x) => x.matched === terms.length).sort(byRelevance);
  const some = scored.filter((x) => x.matched > 0).sort(byRelevance);
  const pick = all.length ? all : some;

  return {
    mode: all.length ? "all" : some.length ? "some" : "none",
    results: pick.map((x) => x.product),
    scores: new Map(pick.map((x) => [x.product.id, x.score])),
    correctedQuery,
    ignored,
  };
}

/** Quick ideas, shown under the search box and when a search finds nothing. */
export const POPULAR_SEARCHES = ["Sequin", "Red gown", "Bandhgala", "Tuxedo", "Velvet", "Navy maxi", "Off shoulder", "Winter coat"];
