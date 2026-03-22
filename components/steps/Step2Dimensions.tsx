'use client'
// components/steps/Step2Dimensions.tsx
import { ProjectType, PROJECT_CONFIGS } from '@/lib/pricing'
import { EstimatorFormData } from '@/lib/types'
import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'
import { ProgressBar } from '@/components/ProgressBar'

interface Props {
  projectType: ProjectType
  data: Partial<EstimatorFormData>
  onChange: (updates: Partial<EstimatorFormData>) => void
  onNext: () => void
  onBack: () => void
}

function NumberField({
  label,
  value,
  onChange,
  min = 0,
  max = 99999,
  step = 1,
  unit,
  hint,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
  unit?: string
  hint?: string
}) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.82rem',
        fontWeight: 500,
        color: 'var(--pluma-dark)',
        marginBottom: '6px',
      }}>
        {label}
        {unit && <span style={{ color: 'var(--pluma-light)', fontWeight: 400, marginLeft: '4px' }}>({unit})</span>}
      </label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: '1.5px solid var(--pluma-border)',
          borderRadius: 'var(--radius-md)',
          fontSize: '1rem',
          color: 'var(--pluma-dark)',
          background: '#fff',
          transition: 'border-color var(--transition)',
          outline: 'none',
        }}
        onFocus={e => (e.currentTarget.style.borderColor = 'var(--pluma-dark)')}
        onBlur={e => (e.currentTarget.style.borderColor = 'var(--pluma-border)')}
      />
      {hint && (
        <p style={{ fontSize: '0.75rem', color: 'var(--pluma-light)', marginTop: '4px' }}>{hint}</p>
      )}
    </div>
  )
}

export function Step2Dimensions({ projectType, data, onChange, onNext, onBack }: Props) {
  const config = PROJECT_CONFIGS[projectType]
  const isRefresh = projectType === 'kitchen_refresh'

  return (
    <div className="animate-fade-in">
      <ProgressBar step={2} isRefresh={isRefresh} />
      <StepHeader
        title={isRefresh ? 'Your existing kitchen' : 'Tell us about the space'}
        subtitle={isRefresh
          ? 'Keep existing cabinets — refresh just the doors and visible panels.'
          : 'Approximate measurements are fine. We\'ll confirm on-site.'}
      />

      {isRefresh ? (
        // Kitchen Door & Panel Refresh — count inputs
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{
            background: '#EDF4F0',
            border: '1px solid #BCD8CA',
            borderRadius: 'var(--radius-md)',
            padding: '12px 16px',
            fontSize: '0.85rem',
            color: '#2D6A4F',
            lineHeight: 1.5,
          }}>
            Keep your existing cabinet boxes — we replace just the doors, drawer fronts and visible panels for a fresh new look at a fraction of the cost.
          </div>

          <NumberField
            label="Number of doors"
            value={data.doorCount ?? 10}
            onChange={v => onChange({ doorCount: v })}
            min={0} max={100}
            hint="Standard hinged cabinet doors"
          />
          <NumberField
            label="Number of drawer fronts"
            value={data.drawerFrontCount ?? 2}
            onChange={v => onChange({ drawerFrontCount: v })}
            min={0} max={50}
            hint="Pull-out drawer fronts only (not the box)"
          />
          <NumberField
            label="Number of visible side panels"
            value={data.panelCount ?? 2}
            onChange={v => onChange({ panelCount: v })}
            min={0} max={20}
            hint="End panels visible from the room"
          />
          <NumberField
            label="Number of kick rails"
            value={data.kickCount ?? 1}
            onChange={v => onChange({ kickCount: v })}
            min={0} max={20}
            hint="Bottom toe-kick panels along the floor"
          />
        </div>
      ) : (
        // Dimension-based projects
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="dimension-grid">
            <NumberField
              label="Width"
              unit="mm"
              value={data.widthMm ?? config.defaultWidth ?? 2400}
              onChange={v => onChange({ widthMm: v })}
              min={300} max={10000} step={50}
            />
            <NumberField
              label="Height"
              unit="mm"
              value={data.heightMm ?? config.defaultHeight ?? 2400}
              onChange={v => onChange({ heightMm: v })}
              min={300} max={4000} step={50}
            />
            <NumberField
              label="Depth"
              unit="mm"
              value={data.depthMm ?? config.defaultDepth ?? 550}
              onChange={v => onChange({ depthMm: v })}
              min={200} max={2000} step={10}
            />
          </div>

          <p style={{
            fontSize: '0.78rem',
            color: 'var(--pluma-light)',
            lineHeight: 1.55,
          }}>
            Not sure? Use the default values — they're based on typical {config.label.toLowerCase()} sizes in Sydney apartments and houses.
          </p>
        </div>
      )}

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}
