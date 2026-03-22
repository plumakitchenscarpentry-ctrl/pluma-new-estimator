// lib/pricing.ts
// Exact port of pricing_engine.py — do not change constants without updating Python too

export type ProjectType =
  | 'wardrobe'
  | 'kitchen'
  | 'kitchen_refresh'
  | 'tv_unit'
  | 'bench_seat'
  | 'custom_cabinet'

export type FinishType =
  | 'laminate_affordable'
  | 'laminate_medium'
  | 'laminate_premium'
  | 'painted_poly_flat'
  | 'painted_poly_shaker'

export type DrawerOption = 'none' | '1-2' | '3-4' | '5+'

export interface ProjectConfig {
  label: string
  icon: string
  rangeLabel: string
  low: number
  high: number
  installDays: number
  hasDimensions: boolean  // false = kitchen refresh (door/panel counts)
  defaultWidth?: number
  defaultHeight?: number
  defaultDepth?: number
}

export const PROJECT_CONFIGS: Record<ProjectType, ProjectConfig> = {
  wardrobe: {
    label: 'Wardrobe',
    icon: '🚪',
    rangeLabel: '$7,000 – $16,500+',
    low: 7000,
    high: 16500,
    installDays: 2.5,
    hasDimensions: true,
    defaultWidth: 2400,
    defaultHeight: 2400,
    defaultDepth: 600,
  },
  kitchen: {
    label: 'Kitchen',
    icon: '🍳',
    rangeLabel: '$10,000 – $21,500+',
    low: 10000,
    high: 21500,
    installDays: 4,
    hasDimensions: true,
    defaultWidth: 4000,
    defaultHeight: 900,
    defaultDepth: 600,
  },
  kitchen_refresh: {
    label: 'Kitchen Door & Panel Refresh',
    icon: '✨',
    rangeLabel: '$4,500 – $13,500+',
    low: 4500,
    high: 13500,
    installDays: 1.5,
    hasDimensions: false,
  },
  tv_unit: {
    label: 'TV Unit',
    icon: '📺',
    rangeLabel: '$4,500 – $10,000+',
    low: 4500,
    high: 10000,
    installDays: 1.5,
    hasDimensions: true,
    defaultWidth: 2400,
    defaultHeight: 600,
    defaultDepth: 500,
  },
  bench_seat: {
    label: 'Bench Seat',
    icon: '🪑',
    rangeLabel: '$3,500 – $9,000+',
    low: 3500,
    high: 9000,
    installDays: 1,
    hasDimensions: true,
    defaultWidth: 1800,
    defaultHeight: 450,
    defaultDepth: 450,
  },
  custom_cabinet: {
    label: 'Custom Cabinet',
    icon: '🗄️',
    rangeLabel: '$3,000 – $8,500+',
    low: 3000,
    high: 8500,
    installDays: 1,
    hasDimensions: true,
    defaultWidth: 1200,
    defaultHeight: 2100,
    defaultDepth: 500,
  },
}

export const FINISH_PRICES: Record<FinishType, { label: string; pricePerDoor: number; description: string }> = {
  laminate_affordable: {
    label: 'Laminate — Affordable',
    pricePerDoor: 180,
    description: 'Durable, clean finish. Great value.',
  },
  laminate_medium: {
    label: 'Laminate — Mid-Range',
    pricePerDoor: 220,
    description: 'Wider colour range, refined look.',
  },
  laminate_premium: {
    label: 'Laminate — Premium',
    pricePerDoor: 300,
    description: 'Designer finishes, highest quality.',
  },
  painted_poly_flat: {
    label: 'Painted Poly — Flat',
    pricePerDoor: 220,
    description: 'Smooth painted look, versatile.',
  },
  painted_poly_shaker: {
    label: 'Painted Poly — Shaker',
    pricePerDoor: 330,
    description: 'Classic shaker profile, timeless.',
  },
}

// ---------- MATERIAL COSTS (exact match to pricing_engine.py) ----------
const SHEET_AREA = 2.88       // sqm per sheet
const SHEET_COST = 60         // $ per sheet
const PANEL_CUT_COST = 100    // $ per panel cut

const DOOR_PRICES: Record<FinishType, number> = {
  laminate_affordable: 180,
  laminate_medium:     220,
  laminate_premium:    300,
  painted_poly_flat:   220,
  painted_poly_shaker: 330,
}

const STANDARD_DOOR_WIDTH_MM = 400
const DRAWER_COST_EACH = 220   // same price as a standard door front

const LARGE_PANEL_COST = 470
const KICK_RAIL_COST = 150

const INSTALL_DAY_COST = 1400
const TRANSPORT_COST = 300
const ADMIN_PERCENT = 0.10

const INSTALL_DAYS: Record<ProjectType, number> = {
  wardrobe:        2.5,
  kitchen:         4.0,
  kitchen_refresh: 1.5,
  tv_unit:         1.5,
  bench_seat:      1.0,
  custom_cabinet:  1.0,
}

// ---------- HELPERS ----------
function calculateBoxes(widthMm: number): number {
  return Math.ceil(widthMm / 500)
}

function carcassCost(widthMm: number, heightMm: number, depthMm: number): number {
  const boxes = calculateBoxes(widthMm)
  const totalPanels = boxes * 5
  const boxWidthM = (widthMm / boxes) / 1000
  const heightM = heightMm / 1000
  const depthM = depthMm / 1000
  const areaPerBox = (heightM * depthM * 2) + (boxWidthM * depthM * 2) + (boxWidthM * heightM)
  const totalArea = areaPerBox * boxes
  const sheetsNeeded = Math.ceil(totalArea / SHEET_AREA)
  return (sheetsNeeded * SHEET_COST) + (totalPanels * PANEL_CUT_COST)
}

function countDoors(widthMm: number): number {
  return Math.ceil(widthMm / STANDARD_DOOR_WIDTH_MM)
}

function doorsCost(widthMm: number, finishType: FinishType): number {
  const numDoors = countDoors(widthMm)
  const unitPrice = DOOR_PRICES[finishType] ?? 220
  return numDoors * unitPrice
}

function drawerCost(drawerBand: DrawerOption): number {
  const bands: Record<DrawerOption, number> = { 'none': 0, '1-2': 2, '3-4': 4, '5+': 6 }
  return (bands[drawerBand] ?? 0) * DRAWER_COST_EACH
}

function installCost(projectType: ProjectType, installRequired: boolean): number {
  if (!installRequired) return 0
  const days = INSTALL_DAYS[projectType] ?? 1.0
  return days * INSTALL_DAY_COST
}

function roundTo500(value: number): number {
  return Math.round(value / 500) * 500
}

function buildEstimate(cost: number): { low: number; high: number } {
  const final = cost * (1 + ADMIN_PERCENT)
  return {
    low: roundTo500(final * 0.9),
    high: roundTo500(final * 1.15),
  }
}

export interface EstimateInput {
  projectType: ProjectType
  finishType: FinishType
  drawers: DrawerOption
  installRequired: boolean
  // Dimension-based
  widthMm?: number
  heightMm?: number
  depthMm?: number
  // Kitchen refresh
  doorCount?: number
  drawerFrontCount?: number
  panelCount?: number
  kickCount?: number
}

export interface EstimateResult {
  low: number
  high: number
  breakdown: {
    carcass: number
    doorCount: number
    doorCost: number
    drawerCost: number
    panelCost: number
    kickCost: number
    installCost: number
    transport: number
    total: number
  }
}

export function calculateEstimate(input: EstimateInput): EstimateResult {
  let low: number, high: number
  let breakdown: EstimateResult['breakdown']

  if (input.projectType === 'kitchen_refresh') {
    // estimate_kitchen_reface()
    const unitPrice = DOOR_PRICES[input.finishType] ?? 220
    const doors = (input.doorCount ?? 0) * unitPrice
    const drawers = (input.drawerFrontCount ?? 0) * unitPrice  // same price as doors
    const panels = (input.panelCount ?? 0) * LARGE_PANEL_COST
    const kicks = (input.kickCount ?? 0) * KICK_RAIL_COST
    const install = installCost('kitchen_refresh', input.installRequired)
    const total = doors + drawers + panels + kicks + install + TRANSPORT_COST
    const result = buildEstimate(total)
    low = result.low
    high = result.high
    breakdown = { carcass: 0, doorCount: (input.doorCount ?? 0) + (input.drawerFrontCount ?? 0), doorCost: doors, drawerCost: drawers, panelCost: panels, kickCost: kicks, installCost: install, transport: TRANSPORT_COST, total }
  } else {
    // estimate_project()
    const w = input.widthMm ?? 2400
    const h = input.heightMm ?? 2400
    const d = input.depthMm ?? 550
    const carcass = carcassCost(w, h, d)
    const doors = doorsCost(w, input.finishType)
    const drawers = drawerCost(input.drawers)
    const install = installCost(input.projectType, input.installRequired)
    const total = carcass + doors + drawers + install + TRANSPORT_COST
    const result = buildEstimate(total)
    low = result.low
    high = result.high
    breakdown = { carcass, doorCount: countDoors(w), doorCost: doors, drawerCost: drawers, panelCost: 0, kickCost: 0, installCost: install, transport: TRANSPORT_COST, total }
  }

  return { low, high, breakdown }
}

export function calculateLeadScore(params: {
  timeline: string
  consultation: string
  budgetRange?: string
}): number {
  let score = 0

  // Timeline
  if (params.timeline === 'ready') score += 3
  else if (params.timeline === '1-3months') score += 2
  else if (params.timeline === '3-6months') score += 1

  // Consultation interest
  if (params.consultation === 'yes') score += 3
  else if (params.consultation === 'maybe') score += 1

  // Budget range (if provided separately)
  if (params.budgetRange === '10k+') score += 2
  else if (params.budgetRange === '5k-10k') score += 1

  return score
}

export function getLeadTemperature(score: number): 'hot' | 'warm' | 'cold' {
  if (score >= 7) return 'hot'
  if (score >= 4) return 'warm'
  return 'cold'
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}
