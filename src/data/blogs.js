// DRAFT — review every article before launch.
// `views` are placeholder numbers, not real analytics — replace or remove before launch.
// `coverImage` is optional: set a real image URL to replace the generated emoji cover.

export const BLOG_SECTIONS = [
  { key: 'nutrition', title: 'Nutrition & Wellness', subtitle: 'Smarter Food Choices', label: 'Nutrition & Wellness' },
  { key: 'ingredients', title: 'Food Ingredient Guide', subtitle: 'Decode Food Labels', label: 'Food Ingredient Guide' },
]

export const BLOG_DISCLAIMER =
  'This article is for general informational purposes only and should not be considered medical, nutritional, or professional healthcare advice.'

const NUTRITION_COVER = { from: '#00C896', to: '#7BE3C6' }
const INGREDIENT_COVER = { from: '#1A1A2E', to: '#4B4FC4' }

export const BLOGS = [
  // ---------- Nutrition & Wellness ----------
  {
    id: 'functional-foods',
    title: 'Functional Foods: Trend or Actually Useful?',
    category: 'nutrition',
    readTime: '1 min',
    summary: 'Added fibre, probiotics, fortified vitamins — what the “functional” label really means.',
    tag: 'Trends',
    views: 1800,
    imageKeyword: 'food,nutrition',
    cover: { emoji: '🥗', ...NUTRITION_COVER },
    sections: [
      {
        heading: 'What “functional” means',
        body: [
          'Functional foods are marketed as offering a benefit beyond basic nutrition — added fibre, probiotics, extra vitamins, or plant sterols.',
          'In most places the term has no strict legal definition, so it is often as much a marketing word as a nutrition one.',
        ],
      },
      {
        heading: 'Where they can help',
        body: [
          'Some additions are genuinely useful. Fortified staples such as iodised salt help fill common nutrient gaps, and fibre-enriched foods can help people who eat very little fibre.',
          'Any benefit depends on the amount added and on the rest of your diet.',
        ],
      },
      {
        heading: 'What to check',
        body: [
          'Read past the front of the pack. A “protein” or “fibre” bar can still be high in sugar.',
          'Everyday whole foods — pulses, curd, vegetables, whole grains — deliver many of the same benefits without the premium price.',
        ],
      },
    ],
  },
  {
    id: 'gut-health',
    title: 'Gut Health Basics: What to Look for in Food',
    category: 'nutrition',
    readTime: '1 min',
    summary: 'Fibre, fermented foods and variety do most of the work.',
    tag: 'Gut health',
    views: 1500,
    imageKeyword: 'food,gut',
    cover: { emoji: '🫘', ...NUTRITION_COVER },
    sections: [
      {
        heading: 'Fibre feeds your gut',
        body: [
          'The bacteria in your gut thrive on fibre from whole grains, pulses, vegetables, fruit and nuts.',
          'Variety matters: different fibres feed different bacteria, so mix it up through the week.',
        ],
      },
      {
        heading: 'Fermented foods',
        body: [
          'Curd and yoghurt with live cultures, fermented batters like idli and dosa, and drinks like kanji all contain helpful microbes.',
          'Products that are heat-treated after fermentation may no longer contain live cultures — look for “live” or “active cultures” on the pack.',
        ],
      },
      {
        heading: 'Label tips',
        body: [
          'Look for whole grains near the top of the ingredient list and check the fibre line in the nutrition table.',
          'Research into how some additives, such as certain emulsifiers, affect the gut is still early and mostly from lab and animal studies — fibre is the better-established priority.',
        ],
      },
    ],
  },
  {
    id: 'hidden-sugar-everyday',
    title: 'Hidden Sugar in Everyday Products',
    category: 'nutrition',
    readTime: '1 min',
    summary: 'Sugar turns up in sauces, breads and “health” drinks — here is how to spot it.',
    tag: 'Sugar',
    views: 1900,
    imageKeyword: 'sugar,food',
    cover: { emoji: '🍬', ...NUTRITION_COVER },
    sections: [
      {
        heading: 'Where sugar hides',
        body: [
          'Ketchup and sauces, flavoured yoghurt and milk drinks, breakfast cereals, malted “health” drinks, packaged bread and instant mixes often contain added sugar.',
          'Products sold as healthy are not exempt — “multigrain” or “with real fruit” says nothing about sugar.',
        ],
      },
      {
        heading: 'How to spot it',
        body: [
          'Check “sugars” in the nutrition table, and compare products per 100 g rather than per serving.',
          'Scan the ingredient list for more than one sweetener — sugar, glucose syrup, dextrose, jaggery, honey and others can all appear in the same product.',
        ],
      },
      {
        heading: 'Simple swaps',
        body: [
          'Plain curd with fresh fruit, unflavoured oats, and homemade chutneys instead of sweet sauces are easy places to start.',
          'The World Health Organization recommends keeping free sugars below 10% of your daily energy intake.',
        ],
      },
    ],
  },
  {
    id: 'protein-moment',
    title: 'Why Protein Is Having a Moment Right Now',
    category: 'nutrition',
    readTime: '1 min',
    summary: 'High-protein everything — what you actually need and where to get it.',
    tag: 'Protein',
    views: 1700,
    imageKeyword: 'protein,food',
    cover: { emoji: '💪', ...NUTRITION_COVER },
    sections: [
      {
        heading: 'Why the buzz',
        body: [
          'Protein helps build and repair muscle and keeps you feeling full, so it features heavily in fitness culture.',
          'That interest has led to a wave of “high-protein” snacks, bars and drinks.',
        ],
      },
      {
        heading: 'How much you need',
        body: [
          'A commonly used guideline for healthy adults is around 0.8 g of protein per kg of body weight per day.',
          'Needs can be higher for older adults, during pregnancy, or with intense training — a doctor or dietitian can advise for your situation.',
        ],
      },
      {
        heading: 'Food first',
        body: [
          'Dal and other pulses, chana, rajma, paneer, curd, eggs, soy and nuts are affordable protein sources.',
          'If you buy a high-protein product, check the sugar and the additive list — and compare protein per 100 g, not per serving.',
        ],
      },
    ],
  },
  {
    id: 'healthy-on-a-budget',
    title: 'Healthy Eating Without Expensive Products',
    category: 'nutrition',
    readTime: '1 min',
    summary: 'The healthiest foods are often the cheapest ones in your kitchen.',
    tag: 'Budget',
    views: 2000,
    imageKeyword: 'groceries,vegetables',
    cover: { emoji: '🛒', ...NUTRITION_COVER },
    sections: [
      {
        heading: 'Staples are already healthy',
        body: [
          'Dals, chana, rajma, seasonal vegetables, whole wheat atta, rice, eggs, curd and peanuts form a balanced, affordable base.',
          'None of them need a premium label to be good for you.',
        ],
      },
      {
        heading: 'Skip the premium label',
        body: [
          'Words like “superfood”, “artisanal” or “multigrain” often add cost without guaranteeing better ingredients.',
          'Compare ingredient lists side by side — the cheaper option is sometimes the simpler one.',
        ],
      },
      {
        heading: 'Cook simple, plan ahead',
        body: [
          'Batch-cooking, buying seasonal produce and using frozen vegetables (which keep most of their nutrients) all cut costs.',
          'Buying whole foods and portioning them yourself is usually cheaper than ready-made packs.',
        ],
      },
    ],
  },
  {
    id: 'brown-bread',
    title: 'Is brown bread always healthier?',
    category: 'nutrition',
    readTime: '30 sec',
    summary: 'Brown is a colour, not a promise. The first ingredient tells the real story.',
    tag: 'Myth vs Truth',
    imageKeyword: 'bread',
    cover: { emoji: '🍞', ...NUTRITION_COVER },
    sections: [
      {
        heading: 'The assumption',
        body: ['Many people pick brown bread assuming it is made from whole wheat. Sometimes it is — but not always.'],
      },
      {
        heading: 'What is often inside',
        body: [
          'Some brown breads are made mostly from refined wheat flour (maida), with a little whole wheat or bran added, and colour from ingredients like caramel or malt.',
        ],
      },
      {
        heading: 'How to check',
        body: [
          'If “whole wheat flour” or “atta” comes first in the ingredient list, whole grain makes up the largest share. If refined wheat flour comes first, the bread is mostly refined.',
          'Words like “wheat bread” or “multigrain” on the front don’t guarantee whole grain either.',
        ],
      },
    ],
  },
  {
    id: 'sugar-free',
    title: 'Does “sugar-free” mean healthy?',
    category: 'nutrition',
    readTime: '30 sec',
    summary: 'Sugar-free tells you what’s missing, not what’s inside.',
    tag: 'Myth vs Truth',
    imageKeyword: 'sweets',
    cover: { emoji: '🍭', ...NUTRITION_COVER },
    sections: [
      {
        heading: 'One clue, not the whole story',
        body: ['“Sugar-free” and “no added sugar” describe one thing about a product: its sugar. They say nothing about everything else.'],
      },
      {
        heading: 'What replaces the sugar',
        body: [
          'Sugar-free sweets and biscuits often use sweeteners or sugar alcohols such as maltitol or sorbitol instead. Sugar alcohols can cause bloating or loose stools in some people when eaten in larger amounts.',
        ],
      },
      {
        heading: 'Read the full label',
        body: [
          'The product may still be made from refined flour and contain plenty of fat, so it can be just as high in calories as the regular version.',
          'Check the full ingredient list and nutrition table before deciding.',
        ],
      },
    ],
  },

  // ---------- Food Ingredient Guide ----------
  {
    id: 'artificial-sweeteners',
    title: 'Artificial Sweeteners Explained Simply',
    category: 'ingredients',
    readTime: '1 min',
    summary: 'Sucralose, aspartame, stevia and friends — what they are and what to know.',
    tag: 'Sweeteners',
    views: 1300,
    imageKeyword: 'sweetener',
    cover: { emoji: '🧪', ...INGREDIENT_COVER },
    sections: [
      {
        heading: 'What they are',
        body: [
          'High-intensity sweeteners are many times sweeter than sugar, so only tiny amounts are used. Common ones include sucralose (INS 955), aspartame (INS 951), acesulfame potassium (INS 950), saccharin (INS 954) and steviol glycosides from stevia (INS 960).',
        ],
      },
      {
        heading: 'Are they safe?',
        body: [
          'Food regulators approve them within acceptable daily intake limits. People with the genetic condition PKU must avoid aspartame, which is why packs carry a phenylalanine warning.',
          'In 2023 the World Health Organization advised against relying on non-sugar sweeteners for long-term weight control.',
        ],
      },
      {
        heading: 'Sugar alcohols are different',
        body: [
          'Maltitol, sorbitol and xylitol are sugar alcohols, not high-intensity sweeteners. They can cause bloating or loose stools if you eat a lot of them.',
        ],
      },
    ],
  },
  {
    id: 'food-colours',
    title: 'Food Colors & Additives: What Do They Mean?',
    category: 'ingredients',
    readTime: '1 min',
    summary: 'Natural vs synthetic colours, and why some get flagged.',
    tag: 'Colours',
    views: 1900,
    imageKeyword: 'food,color',
    cover: { emoji: '🎨', ...INGREDIENT_COVER },
    sections: [
      {
        heading: 'Natural vs synthetic',
        body: [
          'Synthetic colours include tartrazine (INS 102), sunset yellow (INS 110), carmoisine (INS 122) and ponceau 4R (INS 124).',
          'Colours from natural sources include curcumin from turmeric (INS 100), caramel (INS 150), beetroot red (INS 162) and annatto (INS 160b).',
        ],
      },
      {
        heading: 'Why some are flagged',
        body: [
          'A 2007 UK study linked certain mixtures of synthetic colours with increased hyperactivity in some children. Since then, the EU has required a warning label on foods containing those colours.',
        ],
      },
      {
        heading: 'Reading the label',
        body: [
          'Indian packs often say “contains permitted synthetic food colour(s)” followed by INS numbers.',
          'Colour adds no nutrition — it only changes how food looks.',
        ],
      },
    ],
  },
  {
    id: 'preservatives',
    title: 'Preservatives in Food: Are They Always Bad?',
    category: 'ingredients',
    readTime: '1 min',
    summary: 'Some keep food safe, some deserve a closer look.',
    tag: 'Preservatives',
    views: 1100,
    imageKeyword: 'preserved,food',
    cover: { emoji: '🫙', ...INGREDIENT_COVER },
    sections: [
      {
        heading: 'Why they are used',
        body: [
          'Preservatives slow the growth of mould and bacteria and stop fats going rancid, so food lasts longer and stays safe.',
          'Some do important safety work — nitrites in cured meats, for example, help prevent botulism.',
        ],
      },
      {
        heading: 'Not all are equal',
        body: [
          'Many are familiar: salt, sugar, vinegar, citric acid (INS 330) and vitamin C (ascorbic acid, INS 300).',
          'Others get flagged: sodium benzoate (INS 211) can form small amounts of benzene alongside vitamin C under some conditions, nitrites (INS 250) can form nitrosamines, and BHA (INS 320) is classed as a possible human carcinogen.',
        ],
      },
      {
        heading: 'A practical view',
        body: [
          'Preservative-free often means a shorter shelf life — check dates and storage instructions.',
          'Fresh or frozen foods usually need fewer preservatives than ready-to-eat packaged ones.',
        ],
      },
    ],
  },
  {
    id: 'seed-oils',
    title: 'Seed Oils: What You Should Know',
    category: 'ingredients',
    readTime: '1 min',
    summary: 'Cutting through the online debate about sunflower, soybean and other oils.',
    tag: 'Oils',
    views: 1100,
    imageKeyword: 'cooking,oil',
    cover: { emoji: '🌻', ...INGREDIENT_COVER },
    sections: [
      {
        heading: 'What they are',
        body: [
          'Seed oils are pressed or extracted from seeds — sunflower, soybean, rice bran, mustard, groundnut, sesame and canola among them.',
          'Refined oils are processed at high heat; cold-pressed oils are extracted without high heat and keep more of their natural flavour.',
        ],
      },
      {
        heading: 'The debate',
        body: [
          'You may see claims online that seed oils are “toxic”. Mainstream evidence does not support that: replacing saturated fat with unsaturated fats, including many seed oils, is associated with lower LDL cholesterol.',
          'Bigger concerns are heavily fried, ultra-processed foods and reusing frying oil many times, which can form harmful compounds.',
        ],
      },
      {
        heading: 'Practical tips',
        body: [
          'Rotate between oils, avoid reheating used frying oil, and keep an eye on total quantity.',
          'On labels, avoid “partially hydrogenated” oils (a source of trans fat) and note that palm oil is common in packaged snacks.',
        ],
      },
    ],
  },
  {
    id: 'natural-flavours',
    title: 'Natural Flavors: What’s Really in Them?',
    category: 'ingredients',
    readTime: '1 min',
    summary: 'Natural, nature-identical and artificial flavours — the difference explained.',
    tag: 'Flavours',
    views: 1700,
    imageKeyword: 'flavor,fruit',
    cover: { emoji: '🍋', ...INGREDIENT_COVER },
    sections: [
      {
        heading: 'Three kinds of flavouring',
        body: [
          'Natural flavourings come from plant, animal or microbial sources through extraction or fermentation.',
          '“Nature-identical” flavourings are made in a lab but are chemically the same as ones found in nature. Artificial flavourings are not found in nature at all.',
        ],
      },
      {
        heading: 'Why the label is vague',
        body: [
          'Flavour recipes are treated as trade secrets, so a single line on the label can stand for many compounds.',
          'They are usually used in very small amounts.',
        ],
      },
      {
        heading: 'Should you worry?',
        body: [
          'Permitted flavourings are generally considered safe at the levels used, but “natural” does not mean healthier.',
          'A flavouring can make a product taste of fruit without much fruit inside — check the fruit percentage in the ingredient list.',
        ],
      },
    ],
  },
  {
    id: 'maltodextrin',
    title: 'What is maltodextrin?',
    category: 'ingredients',
    readTime: '30 sec',
    summary: 'A common powder made from starch — and it digests quickly.',
    tag: 'Decode the Label',
    imageKeyword: 'powder',
    cover: { emoji: '🥄', ...INGREDIENT_COVER },
    sections: [
      {
        heading: 'What it is',
        body: ['Maltodextrin is a white powder made by breaking down starch from sources such as corn, rice, potato or wheat.'],
      },
      {
        heading: 'Why it is used',
        body: [
          'Manufacturers use it to add bulk, thicken, improve texture or carry flavours. You’ll often see it in snacks, drink mixes, sauces and protein powders.',
        ],
      },
      {
        heading: 'What to know',
        body: [
          'It is considered safe in normal amounts, but it is digested quickly and can raise blood sugar fast — even though it isn’t listed as “sugar”.',
          'If you’re watching your sugar intake, count maltodextrin alongside the sugars on the label.',
        ],
      },
    ],
  },
  {
    id: 'ins-numbers',
    title: 'What do INS numbers mean?',
    category: 'ingredients',
    readTime: '30 sec',
    summary: 'Those numbers in brackets are an ID system for additives, not a warning sign.',
    tag: 'Decode the Label',
    imageKeyword: 'label',
    cover: { emoji: '🔢', ...INGREDIENT_COVER },
    sections: [
      {
        heading: 'An ID for every additive',
        body: [
          'INS stands for International Numbering System. It gives each approved food additive a number, so it can be identified the same way across countries and languages.',
          'In Europe the same numbers appear with an “E” in front — INS 330 and E330 are both citric acid.',
        ],
      },
      {
        heading: 'The ranges',
        body: [
          'The number range hints at the job: 100s are mostly colours, 200s preservatives, 300s antioxidants and acidity regulators, 400s thickeners and emulsifiers, and 600s flavour enhancers such as INS 621 (MSG).',
        ],
      },
      {
        heading: 'Number ≠ harmful',
        body: ['Having a number doesn’t make an additive harmful — many are simple, familiar substances. NOVA looks up each one so you don’t have to.'],
      },
    ],
  },
  {
    id: 'hidden-sugar',
    title: 'Hidden names for sugar on Indian labels',
    category: 'ingredients',
    readTime: '30 sec',
    summary: 'Sugar goes by many names. Here are the ones to look for.',
    tag: 'Decode the Label',
    imageKeyword: 'sugar',
    cover: { emoji: '🏷️', ...INGREDIENT_COVER },
    sections: [
      {
        heading: 'Sugar by other names',
        body: [
          'Added sugar doesn’t always appear as the word “sugar”. On Indian packets you might see sucrose, glucose, dextrose, fructose, invert sugar, liquid glucose or glucose syrup.',
        ],
      },
      {
        heading: 'Traditional sweeteners count too',
        body: [
          'Jaggery (gur), honey and molasses are all forms of sugar. Corn syrup, malt extract and fruit juice concentrate are also used to sweeten foods.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'When a product uses several of these, each one can appear lower in the ingredient list than sugar alone would — even if together they add up to a lot.',
        ],
      },
    ],
  },
  {
    id: 'ingredient-order',
    title: 'Why ingredient order matters',
    category: 'ingredients',
    readTime: '30 sec',
    summary: 'Ingredients are listed from most to least. The first few matter most.',
    tag: 'Decode the Label',
    imageKeyword: 'label',
    cover: { emoji: '📋', ...INGREDIENT_COVER },
    sections: [
      {
        heading: 'Most to least',
        body: [
          'In India, and in most other countries, ingredients are listed in descending order by weight. The first ingredient is the one the product contains most of.',
        ],
      },
      {
        heading: 'Read the first few',
        body: [
          'The first three or four ingredients are the quickest way to understand what you’re really eating.',
          'If sugar, refined flour or oil appears near the top, it makes up a large share of the product.',
        ],
      },
      {
        heading: 'Don’t ignore the end',
        body: ['Ingredients near the end are used in smaller amounts — but they can still matter if you have an allergy.'],
      },
    ],
  },
].map((article) => ({ disclaimer: BLOG_DISCLAIMER, coverImage: '', ...article }))

export function getBlogById(id) {
  return BLOGS.find((b) => b.id === id) ?? null
}

export function sectionFor(article) {
  return BLOG_SECTIONS.find((s) => s.key === article.category) ?? BLOG_SECTIONS[0]
}

export function formatViews(views) {
  if (!views) return ''
  return views >= 1000 ? `${(views / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(views)
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
