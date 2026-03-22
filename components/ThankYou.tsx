'use client'
// components/ThankYou.tsx
import { formatCurrency } from '@/lib/pricing'

interface Props {
  name: string
  estimateLow: number
  estimateHigh: number
  projectLabel: string
  consultation: string
  onReset: () => void
}

export function ThankYou({ name, estimateLow, estimateHigh, projectLabel, consultation, onReset }: Props) {
  const firstName = name.split(' ')[0] || ''

  return (
    <div className="animate-slide-up" style={{ textAlign: 'center', padding: '8px 0 40px' }}>
      {/* Check mark */}
      <div style={{
        width: '64px',
        height: '64px',
        borderRadius: '50%',
        background: 'var(--pluma-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 20px',
      }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" width="28" height="28"
          style={{ animation: 'checkDraw 0.4s 0.2s ease both' }}>
          <style>{`
            @keyframes checkDraw {
              from { stroke-dashoffset: 30; opacity: 0; }
              to { stroke-dashoffset: 0; opacity: 1; }
            }
          `}</style>
          <polyline points="20,6 9,17 4,12" style={{ strokeDasharray: 30 }}/>
        </svg>
      </div>

      {/* Heading */}
      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.6rem, 5vw, 2.2rem)',
        fontWeight: 400,
        color: 'var(--pluma-dark)',
        marginBottom: '8px',
        lineHeight: 1.2,
      }}>
        {firstName ? `Thanks, ${firstName}!` : "You're all set!"}
      </h1>
      <p style={{
        fontSize: '0.95rem',
        color: 'var(--pluma-mid)',
        marginBottom: '32px',
        lineHeight: 1.6,
        maxWidth: '400px',
        margin: '0 auto 32px',
      }}>
        Your estimate is ready. {consultation === 'yes'
          ? 'Jeison will be in touch within 24 hours to arrange a consultation.'
          : 'We\'ll be in touch if you\'d like to discuss further.'}
      </p>

      {/* Estimate box */}
      <div style={{
        background: '#fff',
        border: '1px solid var(--pluma-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        marginBottom: '28px',
        boxShadow: 'var(--shadow-card)',
        maxWidth: '420px',
        margin: '0 auto 28px',
      }}>
        <p style={{
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--pluma-light)',
          marginBottom: '8px',
        }}>
          Your estimated investment — {projectLabel}
        </p>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1.8rem, 6vw, 2.6rem)',
          fontWeight: 400,
          color: 'var(--pluma-dark)',
          lineHeight: 1.1,
          marginBottom: '10px',
        }}>
          {formatCurrency(estimateLow)} – {formatCurrency(estimateHigh)}
        </p>
        <p style={{
          fontSize: '0.8rem',
          color: 'var(--pluma-light)',
          lineHeight: 1.55,
        }}>
          Final price confirmed after design consultation and site measurement.
          A confirmation email has been sent to you.
        </p>
      </div>

      {/* CTA */}
      <div style={{ marginBottom: '32px' }}>
        <p style={{
          fontSize: '0.88rem',
          color: 'var(--pluma-mid)',
          marginBottom: '14px',
          lineHeight: 1.6,
        }}>
          Want to get started sooner? Reach out directly:
        </p>
        <a
          href="https://www.instagram.com/plumajoinery/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            padding: '13px 28px',
            background: 'var(--pluma-dark)',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.9rem',
            fontWeight: 600,
            letterSpacing: '0.02em',
            transition: 'background var(--transition)',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#3a3f43')}
          onMouseLeave={e => (e.currentTarget.style.background = 'var(--pluma-dark)')}
        >
          @plumajoinery on Instagram
        </a>
      </div>

      {/* Review */}
      <div style={{
        background: '#FAFAFA',
        border: '1px solid var(--pluma-border)',
        borderRadius: 'var(--radius-md)',
        padding: '18px 20px',
        textAlign: 'left',
        maxWidth: '420px',
        margin: '0 auto 28px',
      }}>
        <div style={{ fontSize: '0.72rem', color: 'var(--pluma-light)', marginBottom: '8px' }}>
          <span style={{ color: '#e8b84b', letterSpacing: '1px' }}>★★★★★</span>
          {'  '}hipages verified · Kitchen Joinery
        </div>
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--pluma-mid)',
          fontStyle: 'italic',
          lineHeight: 1.65,
          marginBottom: '10px',
        }}>
          "Pluma Joinery Studio did a handsome job. They delivered on time and efficiently went about the installation — we are very happy with the result."
        </p>
        <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--pluma-dark)' }}>
          — Thomas S., Balmain NSW
        </p>
      </div>

      {/* Start again */}
      <button
        type="button"
        onClick={onReset}
        style={{
          background: 'none',
          border: '1px solid var(--pluma-border)',
          borderRadius: 'var(--radius-md)',
          padding: '11px 24px',
          fontSize: '0.85rem',
          color: 'var(--pluma-mid)',
          cursor: 'pointer',
          transition: 'all var(--transition)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--pluma-dark)'; e.currentTarget.style.color = 'var(--pluma-dark)' }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--pluma-border)'; e.currentTarget.style.color = 'var(--pluma-mid)' }}
      >
        Start a new estimate
      </button>
    </div>
  )
}
