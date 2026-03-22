'use client'
// components/steps/Step4Drawers.tsx
import { DrawerOption } from '@/lib/pricing'
import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'
import { ProgressBar } from '@/components/ProgressBar'

interface Props {
  value: DrawerOption
  onChange: (v: DrawerOption) => void
  onNext: () => void
  onBack: () => void
}

const OPTIONS: { value: DrawerOption; label: string; sub: string }[] = [
  { value: 'none', label: 'None',  sub: 'No drawers needed' },
  { value: '1-2',  label: '1–2',   sub: 'A couple of drawers' },
  { value: '3-4',  label: '3–4',   sub: 'Several drawers' },
  { value: '5+',   label: '5+',    sub: 'Many drawers' },
]

export function Step4Drawers({ value, onChange, onNext, onBack }: Props) {
  return (
    <div className="animate-fade-in">
      <ProgressBar step={4} isRefresh={false} />
      <StepHeader
        title="How many drawers?"
        subtitle="Drawer boxes are priced per unit at $220 each."
      />

      <div className="drawer-grid stagger">
        {OPTIONS.map(opt => {
          const isSelected = value === opt.value
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                padding: '20px 10px',
                background: isSelected ? 'var(--pluma-dark)' : '#fff',
                border: `1.5px solid ${isSelected ? 'var(--pluma-dark)' : 'var(--pluma-border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all var(--transition)',
                boxShadow: isSelected ? 'var(--shadow-selected)' : 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
              }}
              onMouseEnter={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--pluma-dark)'
                }
              }}
              onMouseLeave={e => {
                if (!isSelected) {
                  e.currentTarget.style.borderColor = 'var(--pluma-border)'
                }
              }}
            >
              <span style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                fontFamily: 'var(--font-serif)',
                color: isSelected ? '#fff' : 'var(--pluma-dark)',
                transition: 'color var(--transition)',
                lineHeight: 1,
              }}>
                {opt.label}
              </span>
              <span style={{
                fontSize: '0.72rem',
                color: isSelected ? 'rgba(255,255,255,0.65)' : 'var(--pluma-light)',
                transition: 'color var(--transition)',
                lineHeight: 1.3,
              }}>
                {opt.sub}
              </span>
            </button>
          )
        })}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}
