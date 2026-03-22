'use client'
// components/ReviewCards.tsx

const REVIEWS = [
  {
    quote: 'Pluma Joinery Studio did a handsome job. They delivered the installation when they said they would and quietly and efficiently went about the installation, with a little builders clean before they left.',
    author: 'Thomas S.',
    suburb: 'Balmain NSW',
    type: 'Kitchen Joinery',
  },
  {
    quote: 'Fantastic work. Great communication through design and were able to recommend changes to ensure a quality product. Would highly recommend.',
    author: 'Ali M.',
    suburb: 'Paddington NSW',
    type: 'Built-in Furniture',
  },
  {
    quote: 'Great workmanship. Jeison was pleasant to deal with.',
    author: 'Seb',
    suburb: 'Caringbah NSW',
    type: 'Kitchen Cabinet Maker',
  },
  {
    quote: 'Connected with Pluma Joinery Studio and Design and would highly recommend them.',
    author: 'Ann C.',
    suburb: 'Mosman NSW',
    type: 'Cabinet Makers',
  },
]

export function ReviewCards() {
  return (
    <div style={{ marginTop: '40px' }}>
      <p style={{
        fontSize: '0.72rem',
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: 'var(--pluma-light)',
        marginBottom: '14px',
      }}>
        Verified Reviews — hipages
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {REVIEWS.map((review, i) => (
          <div key={i} style={{
            background: '#fff',
            border: '1px solid var(--pluma-border)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 18px',
          }}>
            <div style={{
              fontSize: '0.72rem',
              color: 'var(--pluma-light)',
              marginBottom: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}>
              <span style={{ color: '#e8b84b', letterSpacing: '1px' }}>★★★★★</span>
              <span>{review.type}</span>
            </div>
            <p style={{
              fontSize: '0.88rem',
              color: 'var(--pluma-mid)',
              fontStyle: 'italic',
              lineHeight: 1.65,
              marginBottom: '8px',
            }}>
              "{review.quote}"
            </p>
            <p style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: 'var(--pluma-dark)',
            }}>
              — {review.author}, {review.suburb}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
