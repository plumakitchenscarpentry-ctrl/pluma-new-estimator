// app/api/estimate/route.ts
// Returns a live estimate without saving — used for real-time preview
import { NextRequest, NextResponse } from 'next/server'
import { calculateEstimate } from '@/lib/pricing'
import { ProjectType, FinishType, DrawerOption } from '@/lib/pricing'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const estimate = calculateEstimate({
      projectType: body.projectType as ProjectType,
      finishType: (body.finishType || 'laminate_affordable') as FinishType,
      drawers: (body.drawers || 'none') as DrawerOption,
      installRequired: body.installRequired ?? false,
      widthMm: body.widthMm,
      heightMm: body.heightMm,
      depthMm: body.depthMm,
      doorCount: body.doorCount,
      drawerFrontCount: body.drawerFrontCount,
      panelCount: body.panelCount,
    })

    return NextResponse.json({ estimate })
  } catch {
    return NextResponse.json({ error: 'Calculation failed' }, { status: 400 })
  }
}
