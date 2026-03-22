'use client'
// components/StepHeader.tsx

interface StepHeaderProps {
  title: string
  subtitle?: string
}

export function StepHeader({ title, subtitle }: StepHeaderProps) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.4rem, 4vw, 1.75rem)',
        fontWeight: 400,
        color: 'var(--pluma-dark)',
        lineHeight: 1.25,
        marginBottom: subtitle ? '6px' : 0,
      }}>
        {title}
      </h2>
      {subtitle && (
        <p style={{
          fontSize: '0.9rem',
          color: 'var(--pluma-mid)',
          fontWeight: 400,
          lineHeight: 1.5,
        }}>
          {subtitle}
        </p>
      )}
    </div>
  )
}
