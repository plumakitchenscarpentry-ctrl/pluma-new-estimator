// lib/types.ts
import { z } from 'zod'

export const estimatorSchema = z.object({
  // Step 1: Project type
  projectType: z.enum([
    'wardrobe', 'kitchen', 'kitchen_refresh', 'tv_unit', 'bench_seat', 'custom_cabinet'
  ]),

  // Step 2: Dimensions (for non-refresh projects)
  widthMm: z.number().min(100).max(10000).optional(),
  heightMm: z.number().min(100).max(4000).optional(),
  depthMm: z.number().min(100).max(2000).optional(),

  // Step 2 alternative: Kitchen refresh counts
  doorCount: z.number().min(0).max(100).optional(),
  drawerFrontCount: z.number().min(0).max(50).optional(),
  panelCount: z.number().min(0).max(20).optional(),
  kickCount: z.number().min(0).max(20).optional(),

  // Step 3: Finish
  finishType: z.enum([
    'laminate_affordable', 'laminate_medium', 'laminate_premium',
    'painted_poly_flat', 'painted_poly_shaker'
  ]),

    // Step 4: Drawers (skipped for kitchen_refresh)
    drawers: z.enum(['none', '1-2', '3-4', '5+']).optional().default('none'),

  // Step 5: Installation
  installRequired: z.boolean(),

  // Step 6: Timeline + consultation
  timeline: z.enum(['ready', '1-3months', '3-6months', '6months+']),
  consultation: z.enum(['yes', 'maybe', 'no']),

  // Step 7: Contact
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string()
    .min(8, 'Enter a valid Australian phone number')
    .max(20)
    .refine(
      (val) => val.replace(/\D/g, '').length >= 8,
      'Please enter a valid phone number (at least 8 digits)'
    ),
  email: z.string().email('Enter a valid email address'),
  suburb: z.string().max(100).optional().default(''),
})

export type EstimatorFormData = z.infer<typeof estimatorSchema>

// Step definitions for the multi-step form
export type StepId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8  // 8 = thank you

export interface StepConfig {
  id: StepId
  title: string
  subtitle?: string
}

export const STEPS: StepConfig[] = [
  { id: 1, title: 'What are you looking to build?', subtitle: 'Select your project type' },
  { id: 2, title: 'Tell us about your space', subtitle: 'Approximate dimensions are fine' },
  { id: 3, title: 'Choose your finish', subtitle: 'This has the biggest impact on cost' },
  { id: 4, title: 'Drawers', subtitle: 'How many drawer boxes?' },
  { id: 5, title: 'Installation', subtitle: 'Do you need us to install?' },
  { id: 6, title: 'Timeline & consultation', subtitle: 'Help us understand your schedule' },
  { id: 7, title: 'Your details', subtitle: 'We\'ll send your estimate here' },
  { id: 8, title: 'Your estimate', subtitle: 'Based on the details you provided' },
]

export const SYDNEY_SUBURBS = [
  'Paddington', 'Mosman', 'Bondi', 'Bondi Beach', 'Bondi Junction',
  'Surry Hills', 'Balmain', 'Newtown', 'Glebe', 'Pyrmont',
  'Darlinghurst', 'Potts Point', 'Elizabeth Bay', 'Woollahra',
  'Double Bay', 'Rose Bay', 'Vaucluse', 'Watsons Bay',
  'Neutral Bay', 'Cremorne', 'Cremorne Point', 'Kirribilli',
  'Milsons Point', 'McMahons Point', 'Lavender Bay',
  'Coogee', 'Randwick', 'Kensington', 'Maroubra',
  'Leichhardt', 'Rozelle', 'Annandale', 'Petersham',
  'Chippendale', 'Redfern', 'Alexandria', 'Zetland',
  'Waterloo', 'Beaconsfield', 'Erskineville', 'St Peters',
  'Marrickville', 'Dulwich Hill', 'Stanmore', 'Enmore',
  'Camperdown', 'Ultimo', 'Forest Lodge', 'Ashfield',
  'Other Sydney suburb',
]
