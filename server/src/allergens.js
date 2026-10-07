// Keyword patterns for the hard allergen rule. Mirrors the allergen patterns in
// the frontend's src/utils/personalization.js — keep the two in sync.

const MILK =
  /(?<!coconut |almond |soy |soya |oat |rice |cashew )\bmilk\b|milk solids|milk powder|\bwhey\b|\bcasein(ate)?\b|(?<!cocoa |peanut |shea |nut |almond )\bbutter\b|\bcream\b|\bcheese\b|\bghee\b|\bcurd\b|yog(h)?urt|\bpaneer\b|\bkhoa\b|\blactose\b|milk fat|buttermilk/i

const PATTERNS = {
  milk: MILK,
  lactose: MILK,
  peanuts: /peanut|groundnut|arachis/i,
  nuts: /almond|cashew|walnut|pistachio|hazelnut|pecan|macadamia|brazil nut|pine nut|\bbadam\b|\bkaju\b|tree nut/i,
  wheat: /wheat|\batta\b|\bmaida\b|semolina|\bsooji\b|\bsuji\b|durum|spelt|farina/i,
  gluten: /gluten|wheat|\batta\b|\bmaida\b|semolina|\bsooji\b|\bsuji\b|barley|\brye\b|\bmalt\b|triticale|seitan/i,
  soy: /\bsoy|\bsoya|soybean|\btofu\b|edamame/i,
  egg: /\beggs?\b|egg (white|yolk|powder)|\balbumi?en\b|\balbumin\b|ovalbumin|mayonnaise/i,
  fish: /\bfish\b|anchov|\btuna\b|salmon|sardine|\bcod\b|mackerel|fish (oil|sauce)/i,
  shellfish: /shellfish|shrimp|prawn|\bcrab\b|lobster|oyster|mussel|\bclams?\b|squid|scallop|krill/i,
  sesame: /sesame|\btil\b|tahini|gingelly/i,
}

export const ALLERGEN_LABELS = {
  milk: 'milk',
  lactose: 'lactose',
  peanuts: 'peanuts',
  nuts: 'tree nuts',
  wheat: 'wheat',
  gluten: 'gluten',
  soy: 'soy',
  egg: 'eggs',
  fish: 'fish',
  shellfish: 'shellfish',
  sesame: 'sesame',
}

function splitIngredients(text) {
  return text
    .replace(/ingredients\s*:?/i, '')
    .split(/[,\n;]/)
    .map((s) => s.replace(/\s+/g, ' ').trim().toLowerCase())
    .filter(Boolean)
}

// Returns [{ allergen, ingredient }] for every user allergen found.
export function findAllergens(ingredientsText, allergies) {
  const items = splitIngredients(ingredientsText)
  const hits = []
  for (const allergen of allergies) {
    const pattern = PATTERNS[allergen]
    if (!pattern) continue
    const ingredient = items.find((i) => pattern.test(i))
    if (ingredient) hits.push({ allergen, ingredient })
  }
  return hits
}
