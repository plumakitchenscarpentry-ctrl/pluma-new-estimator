-- migrations/001_create_leads.sql
-- Run this in your Supabase SQL editor if the table doesn't exist yet.
-- If your existing table is already working with the Streamlit app, skip this —
-- the schema is identical and fully backward-compatible.

CREATE TABLE IF NOT EXISTS leads (
  lead_id          SERIAL PRIMARY KEY,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name             TEXT NOT NULL,
  phone            TEXT NOT NULL,
  email            TEXT NOT NULL,
  suburb           TEXT,
  source           TEXT DEFAULT 'estimator',
  project_type     TEXT NOT NULL,
  timeline         TEXT,
  finish_type      TEXT,
  drawers          TEXT,
  install_required BOOLEAN DEFAULT FALSE,
  width_mm         INTEGER,
  height_mm        INTEGER,
  depth_mm         INTEGER,
  estimate_low     NUMERIC(10, 2),
  estimate_high    NUMERIC(10, 2),
  photo_filename   TEXT,
  photo_url        TEXT,
  budget           TEXT,
  consultation     TEXT,
  lead_score       INTEGER DEFAULT 0
);

-- Index for admin dashboard queries
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_lead_score ON leads(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_project_type ON leads(project_type);

-- Optional: view that adds temperature label (mirrors Streamlit dashboard logic)
CREATE OR REPLACE VIEW leads_with_temperature AS
SELECT
  *,
  CASE
    WHEN lead_score >= 7 THEN 'hot'
    WHEN lead_score >= 4 THEN 'warm'
    ELSE 'cold'
  END AS temperature
FROM leads;

COMMENT ON TABLE leads IS 'Pluma Joinery Studio — estimator leads from both Streamlit and Next.js apps';
