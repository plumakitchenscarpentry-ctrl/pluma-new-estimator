'use client'
// components/steps/Step7Contact.tsx
import { useState } from 'react'
import { EstimatorFormData, SYDNEY_SUBURBS } from '@/lib/types'
import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'
import { ProgressBar } from '@/components/ProgressBar'
import { ReviewCards } from '@/components/ReviewCards'

interface Props {
  data: {
    name: string
    phone: string
    email: string
    suburb: string
  }
  onChange: (updates: Partial<EstimatorFormData>) => void
  onSubmit: () => void
  onBack: () => void
  loading: boolean
  error: string | null
  isRefresh: boolean
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
}

function isValidPhone(phone: string): boolean {
  return phone.replace(/\D/g, '').length >= 8
}

interface FieldProps {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  required?: boolean
  error?: string
  autoComplete?: string
}

function TextField({ label, value, onChange, type = 'text', placeholder, required, error, autoComplete }: FieldProps) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: '0.82rem',
        fontWeight: 500,
        color: 'var(--pluma-dark)',
        marginBottom: '6px',
      }}>
        {label}{required && <span style={{ color: 'var(--pluma-error)', marginLeft: '3px' }}>*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: '12px 14px',
          border: `1.5px solid ${error ? 'var(--pluma-error)' : focused ? 'var(--pluma-dark)' : 'var(--pluma-border)'}`,
          borderRadius: 'var(--radius-md)',
          fontSize: '1rem',
          color: 'var(--pluma-dark)',
          background: '#fff',
          outline: 'none',
          transition: 'border-color var(--transition)',
        }}
      />
      {error && (
        <p style={{ fontSize: '0.78rem', color: 'var(--pluma-error)', marginTop: '5px' }}>{error}</p>
      )}
    </div>
  )
}

export function Step7Contact({ data, onChange, onSubmit, onBack, loading, error, isRefresh }: Props) {
  const [touched, setTouched] = useState({
    name: false, phone: false, email: false, suburb: false,
  })
  const [suburbOpen, setSuburbOpen] = useState(false)
  // Controlled suburb input — always mirrors data.suburb from parent
  const suburbQuery = data.suburb || ''

  const errors = {
    name:   touched.name   && !data.name?.trim()              ? 'Please enter your name.' : '',
    phone:  touched.phone  && !isValidPhone(data.phone || '') ? 'Please enter a valid phone number (at least 8 digits).' : '',
    email:  touched.email  && !isValidEmail(data.email || '') ? 'Please enter a valid email address.' : '',
    suburb: '',
  }

  function handleSubmit() {
    setTouched({ name: true, phone: true, email: true, suburb: true })
    if (!data.name?.trim() || !isValidPhone(data.phone || '') || !isValidEmail(data.email || '')) return
    onSubmit()
  }

  const filteredSuburbs = SYDNEY_SUBURBS.filter(s =>
    s.toLowerCase().includes(suburbQuery.toLowerCase())
  )

  return (
    <div className="animate-fade-in">
      <ProgressBar step={7} isRefresh={isRefresh} />
      <StepHeader
        title="Your details"
        subtitle="We'll send your estimate here. No spam, ever."
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <TextField
          label="Name"
          value={data.name || ''}
          onChange={v => { onChange({ name: v }); setTouched(t => ({ ...t, name: true })) }}
          placeholder="Your full name"
          required
          error={errors.name}
          autoComplete="name"
        />

        <TextField
          label="Phone"
          value={data.phone || ''}
          onChange={v => { onChange({ phone: v }); setTouched(t => ({ ...t, phone: true })) }}
          type="tel"
          placeholder="04xx xxx xxx"
          required
          error={errors.phone}
          autoComplete="tel"
        />

        <TextField
          label="Email"
          value={data.email || ''}
          onChange={v => { onChange({ email: v }); setTouched(t => ({ ...t, email: true })) }}
          type="email"
          placeholder="your@email.com"
          required
          error={errors.email}
          autoComplete="email"
        />

        {/* Suburb autocomplete */}
        <div style={{ position: 'relative' }}>
          <label style={{
            display: 'block',
            fontSize: '0.82rem',
            fontWeight: 500,
            color: 'var(--pluma-dark)',
            marginBottom: '6px',
          }}>
            Suburb
          </label>
          <input
            type="text"
            value={suburbQuery}
            onChange={e => {
              onChange({ suburb: e.target.value })
              setSuburbOpen(true)
            }}
            onFocus={e => {
              setSuburbOpen(true)
              e.currentTarget.style.borderColor = 'var(--pluma-dark)'
            }}
            onBlur={e => {
              setTimeout(() => setSuburbOpen(false), 150)
              e.currentTarget.style.borderColor = 'var(--pluma-border)'
            }}
            placeholder="Start typing your suburb…"
            autoComplete="address-level2"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1.5px solid var(--pluma-border)',
              borderRadius: 'var(--radius-md)',
              fontSize: '1rem',
              color: 'var(--pluma-dark)',
              background: '#fff',
              outline: 'none',
              transition: 'border-color var(--transition)',
            }}
          />
          {suburbOpen && suburbQuery.length > 0 && filteredSuburbs.length > 0 && (
            <div style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              background: '#fff',
              border: '1.5px solid var(--pluma-border)',
              borderRadius: 'var(--radius-md)',
              marginTop: '4px',
              zIndex: 100,
              maxHeight: '200px',
              overflowY: 'auto',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            }}>
              {filteredSuburbs.slice(0, 8).map(suburb => (
                <button
                  key={suburb}
                  type="button"
                  onMouseDown={() => {
                    onChange({ suburb })
                    setSuburbOpen(false)
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '10px 14px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '0.9rem',
                    color: 'var(--pluma-dark)',
                    cursor: 'pointer',
                    borderBottom: '1px solid var(--pluma-border)',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--pluma-hover)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  {suburb}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Server error */}
      {error && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: '#FEF2F2',
          border: '1px solid #FECACA',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.85rem',
          color: '#C0392B',
        }}>
          {error}
        </div>
      )}

      <NavButtons
        onBack={onBack}
        onNext={handleSubmit}
        nextLabel="Get My Estimate →"
        loading={loading}
        isSubmit
      />

      <p style={{
        fontSize: '0.72rem',
        color: 'var(--pluma-light)',
        textAlign: 'center',
        marginTop: '14px',
        lineHeight: 1.5,
      }}>
        Your details are used only to send your estimate. We don't share your information.
      </p>

      <ReviewCards />
    </div>
  )
}
