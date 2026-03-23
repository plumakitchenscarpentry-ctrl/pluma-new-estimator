'use client'
import { useState, useCallback } from 'react'
import { ProjectType, FinishType, DrawerOption, PROJECT_CONFIGS, formatCurrency, calculateEstimate } from '@/lib/pricing'
import { EstimatorFormData } from '@/lib/types'
import { Step1ProjectType } from '@/components/steps/Step1ProjectType'
import { Step2Dimensions } from '@/components/steps/Step2Dimensions'
import { Step3Finish } from '@/components/steps/Step3Finish'
import { Step4Drawers } from '@/components/steps/Step4Drawers'
import { Step5Install } from '@/components/steps/Step5Install'
import { Step6Timeline } from '@/components/steps/Step6Timeline'
import { Step7Contact } from '@/components/steps/Step7Contact'
import { ThankYou } from '@/components/ThankYou'

const DEFAULT_FORM: Partial<EstimatorFormData> = {
  projectType: 'wardrobe',
  widthMm: 2400, heightMm: 2400, depthMm: 550,
  doorCount: 10, drawerFrontCount: 2, panelCount: 2, kickCount: 1,
  finishType: 'laminate_affordable',
  drawers: 'none',
  installRequired: true,
  timeline: '1-3months',
  consultation: 'yes',
  name: '', phone: '', email: '', suburb: '',
}

interface SubmitResult { estimateLow: number; estimateHigh: number; leadId: number }

export function Estimator() {
  const [step, setStep] = useState<1|2|3|4|5|6|7|8>(1)
  const [form, setForm] = useState<Partial<EstimatorFormData>>(DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SubmitResult | null>(null)

  const update = useCallback((updates: Partial<EstimatorFormData>) => {
    setForm(prev => ({ ...prev, ...updates }))
  }, [])

  const isRefresh = form.projectType === 'kitchen_refresh'

  const next = useCallback(() => {
    setStep(s => {
      if (s >= 7) return s
      const n = s + 1
      if (n === 4 && isRefresh) return 5 as typeof s
      return n as typeof s
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [isRefresh])

  const back = useCallback(() => {
    setStep(s => {
      if (s <= 1) return s
      const p = s - 1
      if (p === 4 && isRefresh) return 3 as typeof s
      return p as typeof s
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [isRefresh])

  async function handleSubmit() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || 'Something went wrong. Please try again.')
        return
      }
      setResult({ estimateLow: data.estimate.low, estimateHigh: data.estimate.high, leadId: data.leadId })
      setStep(8)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch {
      setError('Network error. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  function handleReset() {
    setForm(DEFAULT_FORM)
    setResult(null)
    setError(null)
    setStep(1)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const projectConfig = PROJECT_CONFIGS[form.projectType || 'wardrobe']
  const showHero = step === 1

  return (
    <div style={{ minHeight: '100vh', background: '#2a2e32', position: 'relative', overflow: 'hidden' }}>

      {/* ── HERO BACKGROUND ── */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0,
        height: '100%',
        minHeight: '100vh',
        zIndex: 0,
      }}>
        <img
          src="/hero_project.jpg"
          alt=""
          style={{
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center 60%',
            opacity: 1,
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(200,210,215,0.2) 30%, rgba(20,24,28,0.92) 75%)',
        }}/>
      </div>

      {/* ── HEADER ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: step === 1 ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(16px)',
        borderBottom: step === 1 ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.08)',
        transition: 'background 0.3s ease',
      }}>
        <div style={{
          maxWidth: '580px', margin: '0 auto', padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative',
        }}>
          <span style={{
            fontSize: '0.72rem', fontWeight: 600,
            color: step === 1 ? 'rgba(255,255,255,0.85)' : 'var(--pluma-dark)',
            letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>
            Pluma Joinery Studio
          </span>

          {step >= 3 && step < 8 && (
            <div style={{ position: 'absolute', right: '20px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.62rem', color: 'var(--pluma-light)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '1px' }}>
                Guide estimate
              </div>
              <LiveEstimateDisplay form={form} />
            </div>
          )}
        </div>
      </header>

      {/* ── MAIN ── */}
      <main style={{ position: 'relative', zIndex: 1, maxWidth: '580px', margin: '0 auto', padding: '0 0 80px' }}>

        {/* Step 1 hero section */}
        {step === 1 && (
          <div style={{ textAlign: 'center', padding: '48px 20px 28px', animation: 'fadeIn 0.6s ease both' }}>
            <img
              src="/pluma_logo.png"
              alt="Pluma Joinery Studio"
              style={{
                height: '110px',
                width: 'auto',
                margin: '0 auto 16px',
                display: 'block',
                mixBlendMode: 'multiply',
              }}
            />
            <h1 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.8rem, 5vw, 2.4rem)',
              fontWeight: 400,
              color: 'var(--pluma-dark)',
              marginBottom: '10px',
              lineHeight: 1.2,
            }}>
              Custom Joinery Estimator
            </h1>
            <p style={{ fontSize: '0.95rem', color: 'var(--pluma-mid)', lineHeight: 1.65, maxWidth: '380px', margin: '0 auto' }}>
              Get a guide price for your Sydney project in under 2 minutes.
            </p>
          </div>
        )}

        {/* Form card */}
        <div style={{
          margin: step === 1 ? '0 16px' : '24px 16px 0',
          background: '#fff',
          borderRadius: '16px',
          padding: '28px 24px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}>
          {step === 1 && <Step1ProjectType value={(form.projectType||'wardrobe') as ProjectType} onChange={v => { const c=PROJECT_CONFIGS[v]; update({ projectType:v, widthMm:c.defaultWidth, heightMm:c.defaultHeight, depthMm:c.defaultDepth }) }} onNext={next} />}
          {step === 2 && <Step2Dimensions projectType={(form.projectType||'wardrobe') as ProjectType} data={form} onChange={update} onNext={next} onBack={back} />}
          {step === 3 && <Step3Finish value={(form.finishType||'laminate_affordable') as FinishType} onChange={v=>update({finishType:v})} onNext={next} onBack={back} isRefresh={isRefresh} />}
          {step === 4 && <Step4Drawers value={(form.drawers||'none') as DrawerOption} onChange={v=>update({drawers:v})} onNext={next} onBack={back} />}
          {step === 5 && <Step5Install projectType={(form.projectType||'wardrobe') as ProjectType} value={form.installRequired??true} onChange={v=>update({installRequired:v})} onNext={next} onBack={back} />}
          {step === 6 && <Step6Timeline timeline={form.timeline||'1-3months'} consultation={form.consultation||'yes'} onChange={update} onNext={next} onBack={back} isRefresh={isRefresh} />}
          {step === 7 && <Step7Contact data={{ name:form.name||'', phone:form.phone||'', email:form.email||'', suburb:form.suburb||'' }} onChange={update} onSubmit={handleSubmit} onBack={back} loading={loading} error={error} isRefresh={isRefresh} />}
          {step === 8 && result && <ThankYou name={form.name||''} estimateLow={result.estimateLow} estimateHigh={result.estimateHigh} projectLabel={projectConfig.label} consultation={form.consultation||'no'} onReset={handleReset} />}
        </div>

        {/* Footer note */}
        {step < 8 && (
          <p style={{ textAlign: 'center', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)', marginTop: '20px', padding: '0 20px' }}>
            Sydney Eastern & Northern Suburbs · Paddington · Mosman · Bondi · Balmain
          </p>
        )}
      </main>
    </div>
  )
}

function LiveEstimateDisplay({ form }: { form: Partial<EstimatorFormData> }) {
  try {
    const est = calculateEstimate({
      projectType: form.projectType || 'wardrobe',
      finishType: form.finishType || 'laminate_affordable',
      drawers: form.drawers || 'none',
      installRequired: form.installRequired ?? true,
      widthMm: form.widthMm, heightMm: form.heightMm, depthMm: form.depthMm,
      doorCount: form.doorCount, drawerFrontCount: form.drawerFrontCount,
      panelCount: form.panelCount, kickCount: form.kickCount,
    })
    return (
      <div style={{ fontSize: '0.88rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
        {formatCurrency(est.low)}–{formatCurrency(est.high)}
      </div>
    )
  } catch { return null }
}
