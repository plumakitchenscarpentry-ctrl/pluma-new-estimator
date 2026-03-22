'use client'
// components/steps/Step6Timeline.tsx
import { EstimatorFormData } from '@/lib/types'
import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'
import { ProgressBar } from '@/components/ProgressBar'

type Timeline = EstimatorFormData['timeline']
type Consultation = EstimatorFormData['consultation']

interface Props {
  timeline: Timeline
  consultation: Consultation
  onChange: (updates: { timeline?: Timeline; consultation?: Consultation }) => void
  onNext: () => void
  onBack: () => void
  isRefresh: boolean
}

const TIMELINE_OPTIONS: { value: Timeline; label: string; sub: string }[] = [
  { value: 'ready',     label: 'Ready to start',  sub: 'Looking to move now' },
  { value: '1-3months', label: '1–3 months',       sub: 'Planning ahead' },
  { value: '3-6months', label: '3–6 months',       sub: 'Early stages' },
  { value: '6months+',  label: 'Just researching', sub: 'No rush' },
]

const CONSULT_OPTIONS: { value: Consultation; label: string; sub: string }[] = [
  { value: 'yes',   label: 'Yes please',       sub: 'Book a free design consultation' },
  { value: 'maybe', label: 'Maybe later',       sub: 'I\'ll reach out when ready' },
  { value: 'no',    label: 'Just the estimate', sub: 'No follow-up needed' },
]

function OptionButton<T extends string>({
  opt,
  isSelected,
  onClick,
  compact = false,
}: {
  opt: { value: T; label: string; sub: string }
  isSelected: boolean
  onClick: () => void
  compact?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: compact ? '12px 14px' : '14px 16px',
        background: isSelected ? 'var(--pluma-dark)' : '#fff',
        border: `1.5px solid ${isSelected ? 'var(--pluma-dark)' : 'var(--pluma-border)'}`,
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all var(--transition)',
        boxShadow: isSelected ? 'var(--shadow-selected)' : 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '8px',
      }}
      onMouseEnter={e => {
        if (!isSelected) e.currentTarget.style.borderColor = 'var(--pluma-dark)'
      }}
      onMouseLeave={e => {
        if (!isSelected) e.currentTarget.style.borderColor = 'var(--pluma-border)'
      }}
    >
      <div>
        <div style={{
          fontSize: '0.88rem',
          fontWeight: 600,
          color: isSelected ? '#fff' : 'var(--pluma-dark)',
          transition: 'color var(--transition)',
        }}>
          {opt.label}
        </div>
        <div style={{
          fontSize: '0.75rem',
          color: isSelected ? 'rgba(255,255,255,0.65)' : 'var(--pluma-light)',
          marginTop: '2px',
          transition: 'color var(--transition)',
        }}>
          {opt.sub}
        </div>
      </div>
      {isSelected && (
        <svg viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2.5" width="16" height="16" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <polyline points="4,10 8,14 16,6"/>
        </svg>
      )}
    </button>
  )
}

export function Step6Timeline({ timeline, consultation, onChange, onNext, onBack, isRefresh }: Props) {
  return (
    <div className="animate-fade-in">
      <ProgressBar step={6} isRefresh={isRefresh} />
      <StepHeader
        title="Timeline & consultation"
        subtitle="This helps us prioritise and plan your project."
      />

      {/* Timeline */}
      <div style={{ marginBottom: '24px' }}>
        <p style={{
          fontSize: '0.82rem',
          fontWeight: 600,
          color: 'var(--pluma-dark)',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          When are you planning to start?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} className="stagger">
          {TIMELINE_OPTIONS.map(opt => (
            <OptionButton
              key={opt.value}
              opt={opt}
              isSelected={timeline === opt.value}
              onClick={() => onChange({ timeline: opt.value })}
            />
          ))}
        </div>
      </div>

      {/* Consultation */}
      <div>
        <p style={{
          fontSize: '0.82rem',
          fontWeight: 600,
          color: 'var(--pluma-dark)',
          marginBottom: '10px',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          Would you like a design consultation & final quote?
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {CONSULT_OPTIONS.map(opt => (
            <OptionButton
              key={opt.value}
              opt={opt}
              isSelected={consultation === opt.value}
              onClick={() => onChange({ consultation: opt.value })}
              compact
            />
          ))}
        </div>
      </div>

      <NavButtons onBack={onBack} onNext={onNext} />
    </div>
  )
}
