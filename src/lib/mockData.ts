// Mock campaign data — backend integration point: replace with API call to campaign data service

import { CampaignDataPoint, computeHealthScore } from './kmeans';

export interface Campaign extends CampaignDataPoint {
  status: 'Active' | 'Paused' | 'Draft';
  platform: 'Google Ads' | 'Meta' | 'LinkedIn' | 'TikTok' | 'Twitter';
  budget: number;
  startDate: string;
  endDate: string;
  clusterLabel?: string;
}

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-001',
    name: 'Summer Sale — Google Search',
    impressions: 482300,
    clicks: 19292,
    conversions: 1544,
    ctr: 0.04,
    cr: 0.08,
    healthScore: computeHealthScore(482300, 19292, 1544),
    status: 'Active',
    platform: 'Google Ads',
    budget: 12000,
    startDate: '2026-04-01',
    endDate: '2026-06-30',
  },
  {
    id: 'camp-002',
    name: 'Brand Awareness Q2 — Meta',
    impressions: 1240000,
    clicks: 24800,
    conversions: 496,
    ctr: 0.02,
    cr: 0.02,
    healthScore: computeHealthScore(1240000, 24800, 496),
    status: 'Active',
    platform: 'Meta',
    budget: 8500,
    startDate: '2026-04-15',
    endDate: '2026-06-15',
  },
  {
    id: 'camp-003',
    name: 'Product Launch — LinkedIn',
    impressions: 98400,
    clicks: 5904,
    conversions: 708,
    ctr: 0.06,
    cr: 0.12,
    healthScore: computeHealthScore(98400, 5904, 708),
    status: 'Active',
    platform: 'LinkedIn',
    budget: 15000,
    startDate: '2026-05-01',
    endDate: '2026-07-31',
  },
  {
    id: 'camp-004',
    name: 'Retargeting — Google Display',
    impressions: 678000,
    clicks: 13560,
    conversions: 814,
    ctr: 0.02,
    cr: 0.06,
    healthScore: computeHealthScore(678000, 13560, 814),
    status: 'Active',
    platform: 'Google Ads',
    budget: 6200,
    startDate: '2026-03-20',
    endDate: '2026-06-20',
  },
  {
    id: 'camp-005',
    name: 'Gen Z Engagement — TikTok',
    impressions: 2100000,
    clicks: 63000,
    conversions: 1260,
    ctr: 0.03,
    cr: 0.02,
    healthScore: computeHealthScore(2100000, 63000, 1260),
    status: 'Active',
    platform: 'TikTok',
    budget: 9800,
    startDate: '2026-04-10',
    endDate: '2026-07-10',
  },
  {
    id: 'camp-006',
    name: 'B2B Lead Gen — LinkedIn',
    impressions: 145000,
    clicks: 10150,
    conversions: 1523,
    ctr: 0.07,
    cr: 0.15,
    healthScore: computeHealthScore(145000, 10150, 1523),
    status: 'Active',
    platform: 'LinkedIn',
    budget: 22000,
    startDate: '2026-05-05',
    endDate: '2026-08-05',
  },
  {
    id: 'camp-007',
    name: 'Flash Sale — Meta Stories',
    impressions: 380000,
    clicks: 7600,
    conversions: 152,
    ctr: 0.02,
    cr: 0.02,
    healthScore: computeHealthScore(380000, 7600, 152),
    status: 'Paused',
    platform: 'Meta',
    budget: 4500,
    startDate: '2026-04-20',
    endDate: '2026-05-10',
  },
  {
    id: 'camp-008',
    name: 'App Install — Google UAC',
    impressions: 560000,
    clicks: 22400,
    conversions: 2240,
    ctr: 0.04,
    cr: 0.1,
    healthScore: computeHealthScore(560000, 22400, 2240),
    status: 'Active',
    platform: 'Google Ads',
    budget: 18500,
    startDate: '2026-04-01',
    endDate: '2026-09-30',
  },
  {
    id: 'camp-009',
    name: 'Holiday Preview — Twitter',
    impressions: 92000,
    clicks: 1840,
    conversions: 37,
    ctr: 0.02,
    cr: 0.02,
    healthScore: computeHealthScore(92000, 1840, 37),
    status: 'Paused',
    platform: 'Twitter',
    budget: 2800,
    startDate: '2026-04-25',
    endDate: '2026-05-25',
  },
  {
    id: 'camp-010',
    name: 'Competitor Conquest — Google',
    impressions: 215000,
    clicks: 15050,
    conversions: 1806,
    ctr: 0.07,
    cr: 0.12,
    healthScore: computeHealthScore(215000, 15050, 1806),
    status: 'Active',
    platform: 'Google Ads',
    budget: 14200,
    startDate: '2026-05-01',
    endDate: '2026-07-31',
  },
  {
    id: 'camp-011',
    name: 'Email Nurture — Meta',
    impressions: 430000,
    clicks: 8600,
    conversions: 258,
    ctr: 0.02,
    cr: 0.03,
    healthScore: computeHealthScore(430000, 8600, 258),
    status: 'Active',
    platform: 'Meta',
    budget: 5600,
    startDate: '2026-03-15',
    endDate: '2026-06-15',
  },
  {
    id: 'camp-012',
    name: 'Webinar Promo — LinkedIn',
    impressions: 78000,
    clicks: 5460,
    conversions: 874,
    ctr: 0.07,
    cr: 0.16,
    healthScore: computeHealthScore(78000, 5460, 874),
    status: 'Active',
    platform: 'LinkedIn',
    budget: 11000,
    startDate: '2026-05-10',
    endDate: '2026-06-10',
  },
  {
    id: 'camp-013',
    name: 'Video Views — TikTok',
    impressions: 3400000,
    clicks: 34000,
    conversions: 340,
    ctr: 0.01,
    cr: 0.01,
    healthScore: computeHealthScore(3400000, 34000, 340),
    status: 'Active',
    platform: 'TikTok',
    budget: 7200,
    startDate: '2026-04-01',
    endDate: '2026-06-30',
  },
  {
    id: 'camp-014',
    name: 'Demo Request — Google Search',
    impressions: 126000,
    clicks: 9450,
    conversions: 1418,
    ctr: 0.075,
    cr: 0.15,
    healthScore: computeHealthScore(126000, 9450, 1418),
    status: 'Active',
    platform: 'Google Ads',
    budget: 19800,
    startDate: '2026-05-01',
    endDate: '2026-07-31',
  },
  {
    id: 'camp-015',
    name: 'Lookalike Expansion — Meta',
    impressions: 890000,
    clicks: 17800,
    conversions: 534,
    ctr: 0.02,
    cr: 0.03,
    healthScore: computeHealthScore(890000, 17800, 534),
    status: 'Draft',
    platform: 'Meta',
    budget: 10500,
    startDate: '2026-05-20',
    endDate: '2026-08-20',
  },
];

// Daily trend data for the last 30 days
export function generateTrendData(days = 30) {
  const data = [] /* emptied */ // [];
  const base = new Date('2026-04-13');
  const baseImpressions = 280000;
  const baseClicks = 8400;
  const baseConversions = 504;

  for (let i = 0; i < days; i++) {
    const d = new Date(base);
    d.setDate(d.getDate() + i);
    const dayStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    // Realistic variance with a mid-dip and recovery
    const waveFactor = Math.sin((i / days) * Math.PI * 1.5) * 0.3;
    const noiseFactor = (((i * 17 + 3) % 7) - 3) / 10;
    const multiplier = 1 + waveFactor + noiseFactor;

    data.push({
      date: dayStr,
      impressions: Math.round(baseImpressions * multiplier),
      clicks: Math.round(baseClicks * multiplier * (1 + ((i * 11) % 5) * 0.04)),
      conversions: Math.round(baseConversions * multiplier * (1 + ((i * 7) % 5) * 0.05)),
    });
  }
  return data;
}
