// app/api/submit-lead/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { estimatorSchema } from '@/lib/types'
import { calculateEstimate, calculateLeadScore, getLeadTemperature, PROJECT_CONFIGS } from '@/lib/pricing'
import { insertLead } from '@/lib/db'
import { sendLeadNotificationEmail, sendCustomerConfirmationEmail } from '@/lib/email'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    // Validate input
    const parsed = estimatorSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid form data', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const data = parsed.data

    // Calculate estimate
    const estimate = calculateEstimate({
      projectType: data.projectType,
      finishType: data.finishType,
      drawers: data.drawers,
      installRequired: data.installRequired,
      widthMm: data.widthMm,
      heightMm: data.heightMm,
      depthMm: data.depthMm,
      doorCount: data.doorCount,
      drawerFrontCount: data.drawerFrontCount,
      panelCount: data.panelCount,
      kickCount: data.kickCount,
    })

    // Calculate lead score
    const leadScore = calculateLeadScore({
      timeline: data.timeline,
      consultation: data.consultation,
    })
    const leadTemp = getLeadTemperature(leadScore)

    const projectConfig = PROJECT_CONFIGS[data.projectType]

    // Save to database
    let leadId: number
    try {
      leadId = await insertLead({
        name: data.name,
        phone: data.phone,
        email: data.email,
        suburb: data.suburb,
        source: 'nextjs-estimator',
        project_type: data.projectType,
        timeline: data.timeline,
        finish_type: data.finishType,
        drawers: data.drawers,
        install_required: data.installRequired,
        width_mm: data.widthMm ?? null,
        height_mm: data.heightMm ?? null,
        depth_mm: data.depthMm ?? null,
        estimate_low: estimate.low,
        estimate_high: estimate.high,
        photo_filename: null,
        photo_url: null,
        budget: null,
        consultation: data.consultation,
        lead_score: leadScore,
      })
    } catch (dbErr) {
      console.error('Database insert failed:', dbErr)
      // Don't fail the whole request — still return estimate
      leadId = 0
    }

    // Send emails (non-blocking — don't fail submission if email fails)
    const emailPromises = [
      sendLeadNotificationEmail({
        leadId,
        name: data.name,
        phone: data.phone,
        email: data.email,
        suburb: data.suburb,
        projectType: data.projectType,
        projectLabel: projectConfig.label,
        timeline: data.timeline,
        finishType: data.finishType,
        drawers: data.drawers,
        installRequired: data.installRequired,
        estimateLow: estimate.low,
        estimateHigh: estimate.high,
        consultation: data.consultation,
        leadScore,
        leadTemp,
      }).catch((e) => console.error('Lead notification email failed:', e)),

      sendCustomerConfirmationEmail({
        name: data.name,
        email: data.email,
        projectLabel: projectConfig.label,
        estimateLow: estimate.low,
        estimateHigh: estimate.high,
        consultation: data.consultation,
      }).catch((e) => console.error('Customer confirmation email failed:', e)),
    ]

    // Fire emails but don't await — respond immediately
    Promise.all(emailPromises)

    return NextResponse.json({
      success: true,
      leadId,
      estimate: {
        low: estimate.low,
        high: estimate.high,
        breakdown: estimate.breakdown,
      },
      leadScore,
      leadTemp,
    })
  } catch (err) {
    console.error('Submit lead error:', err)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
