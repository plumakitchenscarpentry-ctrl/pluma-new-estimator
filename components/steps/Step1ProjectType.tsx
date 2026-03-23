'use client'
import React from 'react'
import { ProjectType, PROJECT_CONFIGS } from '@/lib/pricing'
import { StepHeader } from '@/components/StepHeader'
import { NavButtons } from '@/components/NavButtons'

interface Props {
  value: ProjectType
  onChange: (v: ProjectType) => void
  onNext: () => void
}

const PROJECT_PHOTOS: Record<ProjectType, string> = {
  wardrobe:        '/wardrobe.jpg',
  kitchen:         '/kitchen.jpg',
  kitchen_refresh: '/kitchen_refresh.jpg',
  tv_unit:         '/tv_unit.jpg',
  bench_seat:      '/bench_seat.jpg',
  custom_cabinet:  '/custom_cabinet.jpg',
}

export function Step1ProjectType({ value, onChange, onNext }: Props) {
  const projects = Object.entries(PROJECT_CONFIGS) as [ProjectType, typeof PROJECT_CONFIGS[ProjectType]][]

  return (
    <div className="animate-fade-in">
      <StepHeader
        title="What are you looking to build?"
        subtitle="Select the option closest to your project."
      />

      <div className="project-grid stagger">
        {projects.map(([key, config]) => {
          const isSelected = value === key
          const photo = PROJECT_PHOTOS[key]

          return (
            <button
              key={key}
              type="button"
              onClick={() => onChange(key)}
              style={{
                padding: 0,
                background: '#fff',
                border: `2px solid ${isSelected ? 'var(--pluma-dark)' : 'var(--pluma-border)'}`,
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                transition: 'all var(--transition)',
                boxShadow: isSelected ? 'var(--shadow-selected)' : 'var(--shadow-card)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
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
              {/* Photo */}
              <div style={{
                width: '100%',
                aspectRatio: '4/3',
                overflow: 'hidden',
                position: 'relative',
              }}>
                <img
                  src={photo}
                  alt={config.label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center',
                    transition: 'transform 0.4s ease, filter 0.2s ease',
                    filter: isSelected ? 'brightness(0.75)' : 'brightness(1)',
                    transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                  }}
                />
                {isSelected && (
                  <div style={{
                    position: 'absolute',
                    top: '7px',
                    right: '7px',
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    background: 'var(--pluma-dark)',
                    border: '2px solid #fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <svg viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" width="9" height="9">
                      <polyline points="3,8 6,11 13,4"/>
                    </svg>
                  </div>
                )}
              </div>

              {/* Label */}
              <div style={{
                padding: '9px 8px 10px',
                background: isSelected ? 'var(--pluma-dark)' : '#fff',
                transition: 'background var(--transition)',
                flex: 1,
              }}>
                <div style={{
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  color: isSelected ? '#fff' : 'var(--pluma-dark)',
                  lineHeight: 1.3,
                  marginBottom: '2px',
                  transition: 'color var(--transition)',
                }}>
                  {config.label}
                </div>
                <div style={{
                  fontSize: '0.67rem',
                  color: isSelected ? 'rgba(255,255,255,0.7)' : 'var(--pluma-light)',
                  transition: 'color var(--transition)',
                }}>
                  {config.rangeLabel}
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', margin: '20px 0 4px' }}>
        <a
          href="https://www.instagram.com/plumajoinery/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: '0.82rem',
            color: 'var(--pluma-mid)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--pluma-border)',
            paddingBottom: '1px',
          }}
        >
          View projects on Instagram @plumajoinery →
        </a>
      </div>

      <NavButtons onNext={onNext} nextLabel="Continue" />
    </div>
  )
}
