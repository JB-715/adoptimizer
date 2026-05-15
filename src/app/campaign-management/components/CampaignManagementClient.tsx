'use client';
import React, { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { Plus, RefreshCw, Download } from 'lucide-react';
import { MOCK_CAMPAIGNS, Campaign } from '@/lib/mockData';
import { runKMeans, computeHealthScore, ClusterLabel } from '@/lib/kmeans';
import CampaignTable from './CampaignTable';
import CampaignFormModal from './CampaignFormModal';
import CSVImportPanel from './CSVImportPanel';
import KMeansStatusBar from './KMeansStatusBar';

export interface EnrichedCampaign extends Campaign {
  clusterLabel: ClusterLabel;
  distanceToCentroid: number;
}

function enrichCampaigns(campaigns: Campaign[]): EnrichedCampaign[] {
  if (campaigns.length === 0) return [];
  const points = campaigns.map((c) => ({
    id: c.id,
    name: c.name,
    ctr: c.ctr,
    cr: c.cr,
    healthScore: c.healthScore,
    impressions: c.impressions,
    clicks: c.clicks,
    conversions: c.conversions,
  }));
  const { results } = runKMeans(points, Math.min(3, campaigns.length));
  return campaigns.map((c) => {
    const r = results.find((res) => res.campaignId === c.id);
    return {
      ...c,
      clusterLabel: r?.label ?? 'Needs Improvement',
      distanceToCentroid: r?.distanceToCentroid ?? 0,
    };
  });
}

export default function CampaignManagementClient() {
  const [campaigns, setCampaigns] = useState<EnrichedCampaign[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = window.localStorage.getItem('adoptimizer-campaigns');
      if (saved) {
        try {
          return enrichCampaigns(saved ? JSON.parse(saved) : []);
        } catch {
          window.localStorage.removeItem('adoptimizer-campaigns');
        }
      }
    }

    return enrichCampaigns([]);
  });
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<EnrichedCampaign | null>(null);
  const [importPanelOpen, setImportPanelOpen] = useState(false);
  const [isRerunning, setIsRerunning] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(
      'adoptimizer-campaigns',
      JSON.stringify(campaigns.map(({ clusterLabel, distanceToCentroid, ...campaign }) => campaign))
    );
  }, [campaigns]);


  const handleRerunKMeans = useCallback(() => {
    setIsRerunning(true);
    // Simulate async clustering — backend integration point: POST /api/campaigns/cluster
    setTimeout(() => {
      setCampaigns((prev) => enrichCampaigns(prev));
      setIsRerunning(false);
      toast.success('K-means clustering complete', {
        description: `${campaigns.length} campaigns re-clustered into 3 performance tiers.`,
      });
    }, 1200);
  }, [campaigns.length]);

  const handleAddCampaign = useCallback(
    (data: Omit<Campaign, 'id' | 'ctr' | 'cr' | 'healthScore'>) => {
      const id = `camp-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const ctr = data.impressions > 0 ? data.clicks / data.impressions : 0;
      const cr = data.clicks > 0 ? data.conversions / data.clicks : 0;
      const healthScore = computeHealthScore(data.impressions, data.clicks, data.conversions);
      const newCampaign: Campaign = { ...data, id, ctr, cr, healthScore };
      setCampaigns((prev) => enrichCampaigns([...prev.map((c) => c as Campaign), newCampaign]));
      setAddModalOpen(false);
      toast.success('Campaign added', {
        description: `"${data.name}" has been added and clustered.`,
      });
    },
    []
  );

  const handleEditCampaign = useCallback(
    (data: Omit<Campaign, 'id' | 'ctr' | 'cr' | 'healthScore'>) => {
      if (!editTarget) return;
      const ctr = data.impressions > 0 ? data.clicks / data.impressions : 0;
      const cr = data.clicks > 0 ? data.conversions / data.clicks : 0;
      const healthScore = computeHealthScore(data.impressions, data.clicks, data.conversions);
      const updated: Campaign = { ...editTarget, ...data, ctr, cr, healthScore };
      setCampaigns((prev) =>
        enrichCampaigns(
          prev.map((c) => (c.id === updated.id ? (updated as Campaign) : (c as Campaign)))
        )
      );
      setEditTarget(null);
      toast.success('Campaign updated', {
        description: `"${data.name}" has been updated and re-clustered.`,
      });
    },
    [editTarget]
  );

  const handleDeleteCampaign = useCallback(
    (id: string) => {
      const name = campaigns.find((c) => c.id === id)?.name ?? 'Campaign';
      setCampaigns((prev) =>
        enrichCampaigns(prev.filter((c) => c.id !== id).map((c) => c as Campaign))
      );
      toast.success('Campaign deleted', { description: `"${name}" removed from portfolio.` });
    },
    [campaigns]
  );

  const handleBulkDelete = useCallback((ids: string[]) => {
    setCampaigns((prev) =>
      enrichCampaigns(prev.filter((c) => !ids.includes(c.id)).map((c) => c as Campaign))
    );
    toast.success(`${ids.length} campaigns deleted`, {
      description: 'Cluster assignments updated.',
    });
  }, []);

  const handleImport = useCallback(
    (imported: Omit<Campaign, 'id' | 'ctr' | 'cr' | 'healthScore'>[]) => {
      const newCampaigns: Campaign[] = imported.map((data, i) => {
        const id = `camp-imp-${String(Date.now()).slice(-4)}-${i + 1}`;
        const ctr = data.impressions > 0 ? data.clicks / data.impressions : 0;
        const cr = data.clicks > 0 ? data.conversions / data.clicks : 0;
        const healthScore = computeHealthScore(data.impressions, data.clicks, data.conversions);
        return { ...data, id, ctr, cr, healthScore };
      });
      setCampaigns((prev) => enrichCampaigns([...prev.map((c) => c as Campaign), ...newCampaigns]));
      setImportPanelOpen(false);
      toast.success(`${newCampaigns.length} campaigns imported`, {
        description: 'K-means clustering applied to all campaigns.',
      });
    },
    []
  );

  const handleDownloadTemplate = () => {
    const csv =
      'name,impressions,clicks,conversions,platform,budget,startDate,endDate,status\nExample Campaign,100000,3000,150,Google Ads,5000,2026-05-01,2026-07-31,Active';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'campaign_import_template.csv';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Template downloaded');
  };

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Page header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">
            Campaign Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {campaigns.length} campaigns · Manage data, re-run K-means, import via CSV
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDownloadTemplate}
            className="flex items-center gap-2 px-3 py-2 rounded-lg btn-secondary text-sm"
          >
            <Download size={14} />
            CSV Template
          </button>
          <button
            onClick={() => setImportPanelOpen(!importPanelOpen)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg btn-secondary text-sm ${importPanelOpen ? 'ring-1 ring-primary/40' : ''}`}
          >
            <svg
              width="14"
              height="14"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Import CSV
          </button>
          <button
            onClick={handleRerunKMeans}
            disabled={isRerunning}
            className="flex items-center gap-2 px-3 py-2 rounded-lg btn-secondary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw size={14} className={isRerunning ? 'animate-spin' : ''} />
            {isRerunning ? 'Clustering…' : 'Re-run K-means'}
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg btn-primary text-sm"
          >
            <Plus size={14} />
            Add Campaign
          </button>
        </div>
      </div>

      {/* K-means status bar */}
      <KMeansStatusBar campaigns={campaigns} isRerunning={isRerunning} />

      {/* CSV Import Panel */}
      {importPanelOpen && (
        <CSVImportPanel onImport={handleImport} onClose={() => setImportPanelOpen(false)} />
      )}

      {/* Campaign Table */}
      <CampaignTable
        campaigns={campaigns}
        onEdit={setEditTarget}
        onDelete={handleDeleteCampaign}
        onBulkDelete={handleBulkDelete}
      />

      {/* Add Modal */}
      <CampaignFormModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddCampaign}
        mode="add"
      />

      {/* Edit Modal */}
      <CampaignFormModal
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleEditCampaign}
        defaultValues={editTarget ?? undefined}
        mode="edit"
      />
    </div>
  );
}
