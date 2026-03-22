'use client'
// components/ProgressBar.tsx

interface ProgressBarProps {
  /** Raw step number (1–7, where 4 = Drawers) */
  step: number
  /** Whether kitchen_refresh is selected — skips step 4 */
  isRefresh?: boolean
}

const STEP_LABELS: Record<number, string> = {
  1: 'Project Type',
  2: 'Dimensions',
  3: 'Finish',
  4: 'Drawers',
  5: 'Installation',
  6: 'Timeline',
  7: 'Your Details',
}

// For refresh: steps 1,2,3,5,6,7 → display as 1,2,3,4,5,6
function getDisplayStep(step: number, isRefresh: boolean): { display: number; total: number } {
  if (!isRefresh) return { display: step, total: 7 }
  const display = step > 4 ? step - 1 : step
  return { display, total: 6 }
}

export function ProgressBar({ step, isRefresh = false }: ProgressBarProps) {
  const { display, total } = getDisplayStep(step, isRefresh)
  const pct = Math.round((display / total) * 100)
  const label = STEP_LABELS[step] ?? ''

  return (
    <div style={{ marginBottom: '28px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '8px',
      }}>
        <span style={{
          fontSize: '0.75rem',
          fontWeight: 500,
          color: 'var(--pluma-mid)',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
        }}>
          Step {display} of {total} — {label}
        </span>
        <span style={{
          fontSize: '0.75rem',
          color: 'var(--pluma-light)',
          fontWeight: 500,
        }}>
          {pct}%
        </span>
      </div>
      <div style={{
        height: '3px',
        background: 'var(--pluma-border)',
        borderRadius: '2px',
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: `${pct}%`,
          background: 'var(--pluma-dark)',
          borderRadius: '2px',
          transition: 'width 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
        }} />
      </div>
    </div>
  )
}
