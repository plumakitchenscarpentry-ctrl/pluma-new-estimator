// lib/db.ts
import { Pool } from 'pg'

// Singleton pool — reused across requests in the same Node.js process
let pool: Pool | null = null

export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // Required for Supabase pooler
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    })

    pool.on('error', (err) => {
      console.error('Unexpected pool error', err)
    })
  }
  return pool
}

export interface LeadRecord {
  lead_id?: number
  created_at?: string
  name: string
  phone: string
  email: string
  suburb: string
  source: string
  project_type: string
  timeline: string
  finish_type: string
  drawers: string
  install_required: boolean
  width_mm: number | null
  height_mm: number | null
  depth_mm: number | null
  estimate_low: number
  estimate_high: number
  photo_filename: string | null
  photo_url: string | null
  budget: string | null
  consultation: string
  lead_score: number
}

export async function insertLead(lead: Omit<LeadRecord, 'lead_id' | 'created_at'>): Promise<number> {
  const pool = getPool()
  const query = `
    INSERT INTO leads (
      name, phone, email, suburb, source,
      project_type, timeline, finish_type, drawers, install_required,
      width_mm, height_mm, depth_mm,
      estimate_low, estimate_high,
      photo_filename, photo_url,
      budget, consultation, lead_score
    ) VALUES (
      $1, $2, $3, $4, $5,
      $6, $7, $8, $9, $10,
      $11, $12, $13,
      $14, $15,
      $16, $17,
      $18, $19, $20
    )
    RETURNING lead_id
  `

  const values = [
    lead.name, lead.phone, lead.email, lead.suburb, lead.source,
    lead.project_type, lead.timeline, lead.finish_type, lead.drawers, lead.install_required,
    lead.width_mm, lead.height_mm, lead.depth_mm,
    lead.estimate_low, lead.estimate_high,
    lead.photo_filename, lead.photo_url,
    lead.budget, lead.consultation, lead.lead_score,
  ]

  const result = await pool.query(query, values)
  return result.rows[0].lead_id
}
