// lib/email.ts
// SENDER ADDRESS NOTE:
// 'onboarding@resend.dev' works for testing but Resend limits it to 1 email/day.
// For production: verify plumajoinery.com in Resend dashboard, then set:
//   RESEND_FROM_ADDRESS=Pluma Joinery Studio <hello@plumajoinery.com>
// in your Railway environment variables.
import { Resend } from 'resend'
import { formatCurrency } from './pricing'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY || 'placeholder')
}

// Use verified domain in prod, fallback to Resend test address for local dev
const FROM_LEAD   = process.env.RESEND_FROM_ADDRESS || 'Pluma Estimator <onboarding@resend.dev>'
const FROM_CUSTOMER = process.env.RESEND_FROM_ADDRESS || 'Pluma Joinery Studio <onboarding@resend.dev>'

interface LeadEmailData {
  leadId: number
  name: string
  phone: string
  email: string
  suburb: string
  projectType: string
  projectLabel: string
  timeline: string
  finishType: string
  drawers: string
  installRequired: boolean
  estimateLow: number
  estimateHigh: number
  consultation: string
  leadScore: number
  leadTemp: string
}

const TEMP_COLORS: Record<string, string> = {
  hot: '#d63030',
  warm: '#e08c2a',
  cold: '#4F565B',
}

const TEMP_EMOJI: Record<string, string> = {
  hot: '🔥',
  warm: '🌡️',
  cold: '❄️',
}

export async function sendLeadNotificationEmail(data: LeadEmailData): Promise<void> {
  const tempColor = TEMP_COLORS[data.leadTemp] || '#4F565B'
  const tempEmoji = TEMP_EMOJI[data.leadTemp] || ''

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { background: #4F565B; padding: 32px 40px; }
    .header h1 { color: #FBFBFB; margin: 0; font-size: 20px; font-weight: 600; letter-spacing: 0.04em; }
    .header p { color: #9aa3a8; margin: 4px 0 0; font-size: 13px; }
    .badge { display: inline-block; background: ${tempColor}; color: #fff; padding: 4px 12px; border-radius: 3px; font-size: 13px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; }
    .section { padding: 28px 40px; border-bottom: 1px solid #eee; }
    .section h2 { font-size: 11px; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: #9aa3a8; margin: 0 0 16px; }
    .row { display: flex; justify-content: space-between; margin-bottom: 10px; }
    .label { color: #6F767B; font-size: 14px; }
    .value { color: #1a1a1a; font-size: 14px; font-weight: 500; }
    .estimate-box { background: #f8f9fa; border-left: 3px solid #4F565B; padding: 16px 20px; margin-top: 12px; }
    .estimate-range { font-size: 22px; font-weight: 700; color: #4F565B; }
    .footer { padding: 20px 40px; background: #f8f9fa; text-align: center; }
    .footer p { color: #9aa3a8; font-size: 12px; margin: 0; }
    a { color: #4F565B; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>Pluma Joinery Studio</h1>
    <p>New estimate lead — #${data.leadId}</p>
  </div>

  <div class="section">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="margin:0">Lead Temperature</h2>
      <span class="badge">${tempEmoji} ${data.leadTemp.toUpperCase()} — Score ${data.leadScore}/8</span>
    </div>
  </div>

  <div class="section">
    <h2>Contact</h2>
    <div class="row"><span class="label">Name</span><span class="value">${data.name}</span></div>
    <div class="row"><span class="label">Phone</span><span class="value"><a href="tel:${data.phone}">${data.phone}</a></span></div>
    <div class="row"><span class="label">Email</span><span class="value"><a href="mailto:${data.email}">${data.email}</a></span></div>
    <div class="row"><span class="label">Suburb</span><span class="value">${data.suburb}</span></div>
  </div>

  <div class="section">
    <h2>Project</h2>
    <div class="row"><span class="label">Type</span><span class="value">${data.projectLabel}</span></div>
    <div class="row"><span class="label">Finish</span><span class="value">${data.finishType.replace(/_/g, ' ')}</span></div>
    <div class="row"><span class="label">Drawers</span><span class="value">${data.drawers}</span></div>
    <div class="row"><span class="label">Installation</span><span class="value">${data.installRequired ? 'Yes' : 'No'}</span></div>
    <div class="row"><span class="label">Timeline</span><span class="value">${data.timeline.replace(/_/g, ' ')}</span></div>
    <div class="row"><span class="label">Wants consult</span><span class="value">${data.consultation}</span></div>
    <div class="estimate-box">
      <div style="font-size:12px;color:#6F767B;margin-bottom:4px;">ESTIMATE RANGE</div>
      <div class="estimate-range">${formatCurrency(data.estimateLow)} – ${formatCurrency(data.estimateHigh)}</div>
    </div>
  </div>

  <div class="footer">
    <p>Pluma Joinery Studio · Sydney · <a href="https://www.plumajoinery.com">plumajoinery.com</a></p>
  </div>
</div>
</body>
</html>
`

  await getResend().emails.send({
    from: FROM_LEAD,
    to: process.env.EMAIL_ADDRESS || 'plumakitchenscarpentry@gmail.com',
    subject: `${tempEmoji} New ${data.leadTemp.toUpperCase()} lead — ${data.name} (${data.projectLabel})`,
    html,
  })
}

export async function sendCustomerConfirmationEmail(data: {
  name: string
  email: string
  projectLabel: string
  estimateLow: number
  estimateHigh: number
  consultation: string
}): Promise<void> {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f5f5f5; margin: 0; padding: 0; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { background: #4F565B; padding: 36px 40px; text-align: center; }
    .header h1 { color: #FBFBFB; margin: 0 0 4px; font-size: 22px; font-weight: 600; letter-spacing: 0.06em; }
    .header p { color: #9aa3a8; margin: 0; font-size: 13px; }
    .body { padding: 36px 40px; }
    .body p { color: #3a3a3a; font-size: 15px; line-height: 1.7; margin: 0 0 16px; }
    .estimate-box { background: #f8f9fa; border: 1px solid #e8e8e8; border-radius: 4px; padding: 24px; text-align: center; margin: 24px 0; }
    .estimate-label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #9aa3a8; margin-bottom: 8px; }
    .estimate-range { font-size: 26px; font-weight: 700; color: #4F565B; }
    .estimate-note { font-size: 12px; color: #9aa3a8; margin-top: 6px; }
    .cta { display: inline-block; background: #4F565B; color: #fff; padding: 12px 28px; border-radius: 3px; text-decoration: none; font-weight: 600; font-size: 14px; letter-spacing: 0.04em; }
    .footer { padding: 20px 40px; background: #f8f9fa; text-align: center; }
    .footer p { color: #9aa3a8; font-size: 12px; margin: 4px 0; }
  </style>
</head>
<body>
<div class="wrapper">
  <div class="header">
    <h1>PLUMA JOINERY STUDIO</h1>
    <p>Custom Joinery · Sydney</p>
  </div>
  <div class="body">
    <p>Hi ${data.name},</p>
    <p>Thank you for using the Pluma estimator. Your ${data.projectLabel.toLowerCase()} estimate is:</p>
    <div class="estimate-box">
      <div class="estimate-label">Indicative Range</div>
      <div class="estimate-range">${formatCurrency(data.estimateLow)} – ${formatCurrency(data.estimateHigh)}</div>
      <div class="estimate-note">Final pricing confirmed after consultation</div>
    </div>
    ${data.consultation === 'yes' ? `<p>You've indicated you'd like a consultation — Jeison will be in touch within 1–2 business days to arrange a time.</p>` : `<p>If you'd like to discuss your project further, you're welcome to reach out any time.</p>`}
    <p>In the meantime, you can follow our work on Instagram for inspiration.</p>
    <p style="margin-top:28px"><a href="https://instagram.com/plumajoinery" class="cta">@plumajoinery</a></p>
  </div>
  <div class="footer">
    <p>Pluma Joinery Studio · Sydney, NSW</p>
    <p><a href="https://www.plumajoinery.com" style="color:#4F565B">plumajoinery.com</a></p>
  </div>
</div>
</body>
</html>
`

  await getResend().emails.send({
    from: FROM_CUSTOMER,
    to: data.email,
    subject: `Your ${data.projectLabel} estimate — Pluma Joinery Studio`,
    html,
  })
}
