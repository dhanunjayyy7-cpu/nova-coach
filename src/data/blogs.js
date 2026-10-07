// DRAFT — review every article before launch.

export const BLOG_CATEGORIES = ['Myth vs Truth', 'Decode the Label', 'Worth Knowing']

export const BLOGS = [
  {
    id: 'brown-bread',
    title: 'Is brown bread always healthier?',
    category: 'Myth vs Truth',
    readTime: '30 sec',
    summary: 'Brown is a colour, not a promise. The first ingredient tells the real story.',
    tag: 'Bread',
    body: [
      'Many people pick brown bread assuming it is made from whole wheat. Sometimes it is — but not always.',
      'Some brown breads are made mostly from refined wheat flour (maida), with a little whole wheat or bran added, and colour from ingredients like caramel or malt.',
      'The quickest check is the ingredient list. If “whole wheat flour” or “atta” comes first, whole grain makes up the largest share. If refined wheat flour comes first, the bread is mostly refined.',
      'Words like “wheat bread” or “multigrain” on the front don’t guarantee whole grain either. The ingredient list is where the answer is.',
    ],
  },
  {
    id: 'sugar-free',
    title: 'Does “sugar-free” mean healthy?',
    category: 'Myth vs Truth',
    readTime: '30 sec',
    summary: 'Sugar-free tells you what’s missing, not what’s inside.',
    tag: 'Sugar',
    body: [
      '“Sugar-free” and “no added sugar” describe one thing about a product: its sugar. They say nothing about everything else.',
      'Sugar-free sweets and biscuits often use sweeteners or sugar alcohols such as maltitol or sorbitol instead. Sugar alcohols can cause bloating or loose stools in some people when eaten in larger amounts.',
      'The product may still be made from refined flour and contain plenty of fat, so it can be just as high in calories as the regular version.',
      'Treat “sugar-free” as one clue, then read the full ingredient list and nutrition table before deciding.',
    ],
  },
  {
    id: 'maltodextrin',
    title: 'What is maltodextrin?',
    category: 'Decode the Label',
    readTime: '30 sec',
    summary: 'A common powder made from starch — and it digests quickly.',
    tag: 'Additives',
    body: [
      'Maltodextrin is a white powder made by breaking down starch from sources such as corn, rice, potato or wheat.',
      'Manufacturers use it to add bulk, thicken, improve texture or carry flavours. You’ll often see it in snacks, drink mixes, sauces and protein powders.',
      'It is considered safe to eat in normal amounts, but it is digested quickly and can raise blood sugar fast — even though it isn’t listed as “sugar”.',
      'If you’re watching your sugar intake, it’s worth counting maltodextrin alongside the sugars on the label.',
    ],
  },
  {
    id: 'ins-numbers',
    title: 'What do INS numbers mean?',
    category: 'Decode the Label',
    readTime: '30 sec',
    summary: 'Those numbers in brackets are an ID system for additives, not a warning sign.',
    tag: 'Additives',
    body: [
      'INS stands for International Numbering System. It gives each approved food additive a number, so it can be identified the same way across countries and languages.',
      'In Europe the same numbers appear with an “E” in front — INS 330 and E330 are both citric acid.',
      'The number range hints at the job: 100s are mostly colours, 200s preservatives, 300s antioxidants and acidity regulators, 400s thickeners and emulsifiers, and 600s flavour enhancers such as INS 621 (MSG).',
      'Having a number doesn’t make an additive harmful — many are simple, familiar substances. NOVA looks up each one so you don’t have to.',
    ],
  },
  {
    id: 'hidden-sugar',
    title: 'Hidden names for sugar on Indian labels',
    category: 'Worth Knowing',
    readTime: '30 sec',
    summary: 'Sugar goes by many names. Here are the ones to look for.',
    tag: 'Sugar',
    body: [
      'Added sugar doesn’t always appear as the word “sugar”. On Indian packets you might see sucrose, glucose, dextrose, fructose, invert sugar, liquid glucose or glucose syrup.',
      'Traditional sweeteners count too: jaggery (gur), honey and molasses are all forms of sugar.',
      'Corn syrup, malt extract and fruit juice concentrate are also used to sweeten foods.',
      'When a product uses several of these, each one can appear lower in the ingredient list than sugar alone would — even if together they add up to a lot.',
    ],
  },
  {
    id: 'ingredient-order',
    title: 'Why ingredient order matters',
    category: 'Worth Knowing',
    readTime: '30 sec',
    summary: 'Ingredients are listed from most to least. The first few matter most.',
    tag: 'Labels',
    body: [
      'In India, and in most other countries, ingredients are listed in descending order by weight. The first ingredient is the one the product contains most of.',
      'That makes the first three or four ingredients the quickest way to understand what you’re really eating.',
      'If sugar, refined flour or oil appears near the top, it makes up a large share of the product.',
      'Ingredients near the end are used in smaller amounts — but they can still matter if you have an allergy.',
    ],
  },
]

export function getBlogById(id) {
  return BLOGS.find((b) => b.id === id) ?? null
}

function dayIndex() {
  const now = new Date()
  const localMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.floor(localMidnight.getTime() / 86400000)
}

// `count` consecutive articles, rotating once per local day.
export function getDailyPicks(count) {
  const start = dayIndex() % BLOGS.length
  return Array.from({ length: Math.min(count, BLOGS.length) }, (_, i) => BLOGS[(start + i) % BLOGS.length])
}

export function getTodaysCatch() {
  return getDailyPicks(1)[0]
}
