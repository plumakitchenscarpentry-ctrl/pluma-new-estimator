'use client'
// components/steps/Step5Install.tsx
import { ProjectType, PROJECT_CONFIGS } from '@/lib/pricing'
import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'
import { ProgressBar } from '@/components/ProgressBar'

interface Props {
  projectType: ProjectType
  value: boolean
  onChange: (v: boolean) => void
  onNext: () => void
  onBack: () => void
}

export function Step5Install({ projectType, value, onChange, onNext, onBack }: Props) {
  const config = PROJECT_CONFIGS[projectType]
  const isRefresh = projectType === 'kitchen_refresh'
  const installDays = config.installDays
  const installCost = installDays * 1400

  const OPTIONS = [
    {
      value: true,
      label: 'Yes — include installation',
      sub: `${installDays} day${installDays !== 1 ? 's' : ''} · $${installCost.toLocaleString()}`,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
        </svg>
      ),
    },
    {
      value: false,
      label: 'No — supply only',
      sub: 'I have my own installer',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="20" height="20">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <path d="M9 9l6 6m0-6l-6 6"/>
        </svg>
      ),
    },
  ]

  return (
    <div className="animate-fade-in">
      <ProgressBar step={5} isRefresh={isRefresh} />
      <StepHeader
        title="Do you need installation?"
        subtitle="Pluma handles delivery, installation and a full site tidy-up."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="stagger">
        {OPTIONS.map(opt => {
          const isSelected = value === opt.value
          return (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => onChange(opt.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '18px 20px',
                background: isSelected ? 'var(--pluma-dark)' : '#fff',
                border: `1.5px solid ${isSelected ? 'var(--pluma-dark)' : 'var(--pluma-border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all var(--transition)',
                boxShadow: isSelected ? 'var(--shadow-selected)' : 'var(--shadow-card)',
              }}
              onMouseEnter={e => {
                if (!isSelected) e.currentTarget.style.borderColor = 'var(--pluma-dark)'
              }}
              onMouseLeave={e => {
                if (!isSelected) e.currentTarget.style.borderColor = 'var(--pluma-border)'
              }}
            >
              <div style={{ color: isSelected ? '#fff' : 'var(--pluma-dark)', flexShrink: 0 }}>
                {opt.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  color: isSelected ? '#fff' : 'var(--pluma-dark)',
                  transition: 'color var(--transition)',
                }}>
                  {opt.label}
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--pluma-mid)',
                  marginTop: '2px',
                  transition: 'color var(--transition)',
                }}>
                  {opt.sub}
                </div>
              </div>
              {/* Selected checkmark */}
              {isSelected && (
                <svg viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.5" width="18" height="18" strokeLinecap="round">
                  <polyline points="4,10 8,14 16,6"/>
                </svg>
              )}
            </button>
          )
        })}
      </div>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}
