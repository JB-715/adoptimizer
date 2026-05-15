import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const campaigns = await prisma.campaign.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(campaigns);
}

export async function POST(request: Request) {
  const body = await request.json();

  const campaign = await prisma.campaign.create({
    data: {
      name: body.name,
      impressions: Number(body.impressions),
      clicks: Number(body.clicks),
      conversions: Number(body.conversions),
      platform: body.platform,
      budget: Number(body.budget),
      startDate: body.startDate,
      endDate: body.endDate,
      status: body.status,
      ctr: Number(body.ctr),
      cr: Number(body.cr),
      healthScore: Number(body.healthScore),
    },
  });

  return NextResponse.json(campaign, { status: 201 });
}
