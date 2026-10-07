import { z } from 'zod'

// Allergies are fixed keys because the hard allergen rule matches on them.
export const ALLERGIES = [
  'milk',
  'peanuts',
  'nuts',
  'wheat',
  'soy',
  'egg',
  'fish',
  'shellfish',
  'gluten',
  'lactose',
  'sesame',
]
export const DIETS = ['vegetarian', 'vegan', 'eggetarian', 'jain', 'halal', 'non-vegetarian']

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  password: z.string().min(8, 'Password must be at least 8 characters').max(72),
})

const shortText = z.string().trim().min(1).max(60)
const dedupe = (v) => [...new Set(v)]

export const profileSchema = z.object({
  age: z.number().int().min(1).max(120).nullable().optional().default(null),
  conditions: z.array(shortText).max(10).optional().default([]).transform(dedupe),
  allergies: z.array(z.enum(ALLERGIES)).max(ALLERGIES.length).optional().default([]).transform(dedupe),
  goals: z.array(shortText).max(10).optional().default([]).transform(dedupe),
  diet: z.enum(DIETS).nullable().optional().default(null),
})

export const scanSchema = z.object({
  product_name: z.string().trim().min(1).max(200),
  ingredients: z.string().trim().min(1).max(5000),
  generic_score: z.number().int().min(0).max(100),
  flagged_ingredients: z.array(z.string().trim().max(120)).max(50).optional().default([]),
})

export const cleanSchema = z.object({
  rawText: z.string().trim().min(1).max(8000),
})

export const homeMessageSchema = z.object({
  scanCount: z.coerce.number().int().min(0).max(100000),
  averageScore: z.coerce.number().min(0).max(100).transform(Math.round),
  topFlagged: z.array(z.unknown()).optional().default([]),
  goals: z.array(z.unknown()).optional().default([]),
})
