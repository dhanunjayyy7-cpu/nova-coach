// Adjusts an analysed ingredient for the user's saved profile. Rules only ever
// raise risk (safe → caution → avoid), never lower it. Allergy and diet
// conflicts become "avoid"; goals raise to "caution", except "avoid additives",
// which promotes caution-level additives to "avoid".
//
// Matching is keyword-based on the ingredient text, so it is best-effort: it
// cannot catch every derivative or cross-contamination warning.

const RISK_RANK = { safe: 0, caution: 1, avoid: 2 }

// "milk"/"butter" also appear in plant products — exclude the common ones.
const MILK =
  /(?<!coconut |almond |soy |soya |oat |rice |cashew )\bmilk\b|milk solids|milk powder|\bwhey\b|\bcasein(ate)?\b|(?<!cocoa |peanut |shea |nut |almond )\bbutter\b|\bcream\b|\bcheese\b|\bghee\b|\bcurd\b|yog(h)?urt|\bpaneer\b|\bkhoa\b|\blactose\b|milk fat|buttermilk/i
const EGG = /\beggs?\b|egg (white|yolk|powder)|\balbumi?en\b|\balbumin\b|ovalbumin|mayonnaise/i
const FISH = /\bfish\b|anchov|\btuna\b|salmon|sardine|\bcod\b|mackerel|fish (oil|sauce)/i
const SHELLFISH = /shellfish|shrimp|prawn|\bcrab\b|lobster|oyster|mussel|\bclams?\b|squid|scallop|krill/i
const MEAT =
  /\bmeat\b|chicken|mutton|\bbeef\b|\bpork\b|\bbacon\b|\bham\b|\blamb\b|gelatin(e)?|\blard\b|tallow|rennet|isinglass|carmine|cochineal|animal fat/i
const PORK_OR_ALCOHOL = /\bpork\b|\bbacon\b|\bham\b|\blard\b|gelatin(e)?|\bwine\b|\bbeer\b|\brum\b|alcohol|liqueur/i
const JAIN_EXTRA = /\bonions?\b|\bgarlic\b|\bpotato(es)?\b|\bcarrots?\b|beetroot|radish|\bhoney\b/i
const VEGAN_EXTRA = /\bhoney\b|shellac|beeswax/i

const ALLERGEN_PATTERNS = {
  milk: MILK,
  lactose: MILK,
  peanuts: /peanut|groundnut|arachis/i,
  nuts: /almond|cashew|walnut|pistachio|hazelnut|pecan|macadamia|brazil nut|pine nut|\bbadam\b|\bkaju\b|tree nut/i,
  wheat: /wheat|\batta\b|\bmaida\b|semolina|\bsooji\b|\bsuji\b|durum|spelt|farina/i,
  gluten: /gluten|wheat|\batta\b|\bmaida\b|semolina|\bsooji\b|\bsuji\b|barley|\brye\b|\bmalt\b|triticale|seitan/i,
  soy: /\bsoy|\bsoya|soybean|\btofu\b|edamame/i,
  egg: EGG,
  fish: FISH,
  shellfish: SHELLFISH,
  sesame: /sesame|\btil\b|tahini|gingelly/i,
}

const ALLERGEN_LABELS = {
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

const DIET_RULES = {
  vegan: {
    test: (n) => MILK.test(n) || EGG.test(n) || FISH.test(n) || SHELLFISH.test(n) || MEAT.test(n) || VEGAN_EXTRA.test(n),
    reason: 'Animal-derived — doesn’t fit your vegan diet.',
  },
  vegetarian: {
    test: (n) => EGG.test(n) || FISH.test(n) || SHELLFISH.test(n) || MEAT.test(n),
    reason: 'Contains meat, fish or egg — doesn’t fit your vegetarian diet.',
  },
  eggetarian: {
    test: (n) => FISH.test(n) || SHELLFISH.test(n) || MEAT.test(n),
    reason: 'Contains meat or fish — doesn’t fit your eggetarian diet.',
  },
  jain: {
    test: (n) => EGG.test(n) || FISH.test(n) || SHELLFISH.test(n) || MEAT.test(n) || JAIN_EXTRA.test(n),
    reason: 'Not suitable for a Jain diet.',
  },
  halal: {
    test: (n) => PORK_OR_ALCOHOL.test(n),
    reason: 'May contain pork or alcohol — check it fits your halal diet.',
  },
}

const SUGAR =
  /\bsugars?\b|high fructose corn syrup|\bhfcs\b|maltodextrin|dextrose|glucose syrup|liquid glucose|invert sugar|corn syrup|\bjaggery\b|\bgur\b|fructose|sucrose|\bhoney\b|molasses/i
const SALT =
  /\bsalt\b|sodium chloride|monosodium glutamate|\bmsg\b|\b(ins|e)?\s?621\b|disodium (inosinate|guanylate)|\b(ins|e)?\s?(627|631|635)\b|soy sauce/i
const FAT =
  /palm (oil|olein)|hydrogenated|vanaspati|shortening|margarine|\blard\b|\bghee\b|(?<!cocoa |peanut |shea )\bbutter\b|\bcream\b|interesterified/i

const GOAL_RULES = {
  'less-sugar': { test: SUGAR, reason: 'Added sugar — flagged because you’re cutting down on sugar.' },
  'less-salt': { test: SALT, reason: 'Adds sodium — flagged because you’re cutting down on salt.' },
  'less-fat': { test: FAT, reason: 'Adds fat — flagged because you’re cutting down on fat.' },
}

function buildRules(profile) {
  const rules = []

  for (const allergen of profile.allergens ?? []) {
    const pattern = ALLERGEN_PATTERNS[allergen]
    if (!pattern) continue
    rules.push({
      risk: 'avoid',
      test: (n) => pattern.test(n),
      reason: `Contains ${ALLERGEN_LABELS[allergen]} — on your allergy list.`,
    })
  }

  for (const diet of profile.diet ?? []) {
    const rule = DIET_RULES[diet]
    if (rule) rules.push({ risk: 'avoid', ...rule })
  }

  if (profile.goals?.includes('avoid-additives')) {
    rules.push({
      risk: 'avoid',
      // Only database-matched additives start out as "caution", so this targets exactly them.
      test: (_n, item) => item.risk === 'caution',
      reason: (item) => `${item.reason} Flagged strongly because you avoid additives.`,
    })
  }

  for (const goal of profile.goals ?? []) {
    const rule = GOAL_RULES[goal]
    if (rule) rules.push({ risk: 'caution', test: (n) => rule.test.test(n), reason: rule.reason })
  }

  return rules
}

export function applyProfileOverrides(item, profile) {
  if (!profile) return item

  const name = item.name.toLowerCase()
  // Rules are ordered strongest-first, so the first hit at the top risk wins.
  for (const rule of buildRules(profile)) {
    if (RISK_RANK[rule.risk] <= RISK_RANK[item.risk]) continue
    if (rule.test(name, item)) {
      return {
        ...item,
        risk: rule.risk,
        reason: typeof rule.reason === 'function' ? rule.reason(item) : rule.reason,
        personal: true,
      }
    }
  }

  return item
}
