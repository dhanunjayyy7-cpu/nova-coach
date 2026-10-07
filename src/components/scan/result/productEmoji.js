const RULES = [
  [/biscuit|cookie|cracker/i, '🍪'],
  [/chocolate|cocoa|candy|confection/i, '🍫'],
  [/chip|crisp|namkeen|snack/i, '🍟'],
  [/noodle|pasta|ramen/i, '🍜'],
  [/juice|drink|beverage|soda|cola|water/i, '🥤'],
  [/milk|dairy|yog|curd|cheese|paneer/i, '🥛'],
  [/bread|bakery|cake|bun/i, '🍞'],
  [/cereal|oat|muesli|granola|cornflake/i, '🥣'],
  [/sauce|ketchup|spread|jam/i, '🫙'],
  [/ice cream|frozen dessert/i, '🍦'],
  [/tea|coffee/i, '☕'],
]

export function productEmoji(category = '', name = '', type = '') {
  const text = `${category} ${name}`
  for (const [pattern, emoji] of RULES) {
    if (pattern.test(text)) return emoji
  }
  return type === 'label' ? '🏷️' : '🛒'
}
