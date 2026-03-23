'use client'
// components/NavButtons.tsx

interface NavButtonsProps {
  onBack?: () => void
  onNext?: () => void
  nextLabel?: string
  backLabel?: string
  loading?: boolean
  nextDisabled?: boolean
  isSubmit?: boolean
}

export function NavButtons({
  onBack,
  onNext,
  nextLabel = 'Continue',
  backLabel = 'Back',
  loading = false,
  nextDisabled = false,
  isSubmit = false,
}: NavButtonsProps) {
  return (
    <div style={{
      display: 'flex',
      gap: '12px',
      marginTop: '32px',
      flexDirection: onBack ? 'row' : 'column',
    }}>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          style={{
            flex: '0 0 auto',
            padding: '13px 20px',
            background: 'transparent',
            border: '1px solid var(--pluma-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: 500,
            color: 'var(--pluma-mid)',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all var(--transition)',
            opacity: loading ? 0.5 : 1,
          }}
          onMouseEnter={e => { if (!loading) (e.currentTarget.style.borderColor = 'var(--pluma-dark)'); (e.currentTarget.style.color = 'var(--pluma-dark)') }}
          onMouseLeave={e => { (e.currentTarget.style.borderColor = 'var(--pluma-border)'); (e.currentTarget.style.color = 'var(--pluma-mid)') }}
        >
          {backLabel}
        </button>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={loading || nextDisabled}
        style={{
          flex: 1,
          padding: '14px 28px',
          background: nextDisabled ? 'var(--pluma-border)' : 'var(--pluma-dark)',
          border: 'none',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.95rem',
          fontWeight: 600,
          color: nextDisabled ? 'var(--pluma-light)' : '#fff',
          cursor: loading || nextDisabled ? 'not-allowed' : 'pointer',
          transition: 'all var(--transition)',
          letterSpacing: '0.02em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          minHeight: '50px',
        }}
        onMouseEnter={e => { if (!loading && !nextDisabled) (e.currentTarget.style.background = '#3a3f43') }}
        onMouseLeave={e => { if (!nextDisabled) (e.currentTarget.style.background = 'var(--pluma-dark)') }}
      >
        {loading ? (
          <>
            <span style={{
              width: '16px', height: '16px',
              border: '2px solid rgba(255,255,255,0.3)',
              borderTopColor: '#fff',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.6s linear infinite',
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Processing…
          </>
        ) : nextLabel}
      </button>
    </div>
  )
}
