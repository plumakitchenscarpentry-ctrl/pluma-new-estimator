'use client'
// components/steps/Step3Finish.tsx
import { FinishType, FINISH_PRICES } from '@/lib/pricing'
import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'
import { ProgressBar } from '@/components/ProgressBar'

interface Props {
  value: FinishType
  onChange: (v: FinishType) => void
  onNext: () => void
  onBack: () => void
  isRefresh: boolean
}

// Visual texture hints for each finish
const FINISH_SWATCHES: Record<FinishType, { bg: string; border: string }> = {
  laminate_affordable: { bg: '#F5F0EB', border: '#D4C8BC' },
  laminate_medium:     { bg: '#EDE8E2', border: '#C8BDB4' },
  laminate_premium:    { bg: '#2A2420', border: '#1a1510' },
  painted_poly_flat:   { bg: '#F8F8F8', border: '#E0E0E0' },
  painted_poly_shaker: { bg: '#ECEEF0', border: '#CDD1D4' },
}

export function Step3Finish({ value, onChange, onNext, onBack, isRefresh }: Props) {
  const finishes = Object.entries(FINISH_PRICES) as [FinishType, typeof FINISH_PRICES[FinishType]][]

  return (
    <div className="animate-fade-in">
      <ProgressBar step={3} isRefresh={isRefresh} />
      <StepHeader
        title="Choose your finish"
        subtitle="Finish type has the biggest impact on your final cost."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="stagger">
        {finishes.map(([key, config]) => {
          const isSelected = value === key
          const swatch = FINISH_SWATCHES[key]
          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                padding: '14px 16px',
                background: isSelected ? 'var(--pluma-dark)' : '#fff',
                border: `1.5px solid ${isSelected ? 'var(--pluma-dark)' : 'var(--pluma-border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition)',
                boxShadow: isSelected ? 'var(--shadow-selected)' : 'var(--shadow-card)',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--pluma-dark)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--pluma-border)'
                  e.currentTarget.style.boxShadow = 'var(--shadow-card)'
                }
              }}
            >
              {/* Swatch */}
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '6px',
                background: swatch.bg,
                border: `1px solid ${swatch.border}`,
                flexShrink: 0,
              }} />

              {/* Text */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  color: isSelected ? '#fff' : 'var(--pluma-dark)',
                  transition: 'color var(--transition)',
                }}>
                  {config.label}
                </div>
                <div style={{
                  fontSize: '0.78rem',
                  color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--pluma-mid)',
                  marginTop: '2px',
                  transition: 'color var(--transition)',
                }}>
                  {config.description}
                </div>
              </div>

              {/* Price */}
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 600,
                color: isSelected ? 'rgba(255,255,255,0.85)' : 'var(--pluma-mid)',
                flexShrink: 0,
                transition: 'color var(--transition)',
              }}>
                ${config.pricePerDoor}/door
              </div>
            </button>
          )
        })}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}
