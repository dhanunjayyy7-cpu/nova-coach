export const DIET_OPTIONS = [
  { value: 'vegetarian', label: 'Vegetarian', emoji: '🥦' },
  { value: 'vegan', label: 'Vegan', emoji: '🌿' },
  { value: 'eggetarian', label: 'Eggetarian', emoji: '🍳' },
  { value: 'jain', label: 'Jain', emoji: '🪷' },
  { value: 'halal', label: 'Halal', emoji: '☪️' },
  { value: 'non-vegetarian', label: 'Non-veg', emoji: '🍗' },
]

// 'nuts' is the tree-nut value so it matches what older profiles already store.
export const ALLERGEN_OPTIONS = [
  { value: 'milk', label: 'Milk', emoji: '🥛' },
  { value: 'peanuts', label: 'Peanuts', emoji: '🥜' },
  { value: 'nuts', label: 'Tree Nuts', emoji: '🌰' },
  { value: 'wheat', label: 'Wheat', emoji: '🌾' },
  { value: 'soy', label: 'Soy', emoji: '🫘' },
  { value: 'egg', label: 'Eggs', emoji: '🥚' },
  { value: 'fish', label: 'Fish', emoji: '🐟' },
  { value: 'shellfish', label: 'Shellfish', emoji: '🦐' },
  { value: 'gluten', label: 'Gluten', emoji: '🍞' },
  { value: 'lactose', label: 'Lactose', emoji: '🧀' },
  { value: 'sesame', label: 'Sesame', emoji: '🌱' },
]

export const GOAL_OPTIONS = [
  { value: 'less-sugar', label: 'Less sugar', emoji: '🍬' },
  { value: 'less-salt', label: 'Less salt', emoji: '🧂' },
  { value: 'less-fat', label: 'Less fat', emoji: '🧈' },
  { value: 'more-protein', label: 'More protein', emoji: '💪' },
  { value: 'more-fibre', label: 'More fibre', emoji: '🌾' },
  { value: 'avoid-additives', label: 'Avoid additives', emoji: '🧪' },
]

export function labelsFor(options, values) {
  return options.filter((o) => values?.includes(o.value)).map((o) => o.label)
}
