'use client';
import React, { useState, useMemo } from 'react';
import { Search, ChevronUp, ChevronDown, ChevronsUpDown, Edit2, Trash2, X } from 'lucide-react';
import ClusterBadge from '@/components/ui/ClusterBadge';
import type { EnrichedCampaign } from './CampaignManagementClient';

type SortKey = keyof EnrichedCampaign;
type SortDir = 'asc' | 'desc';

const PLATFORM_COLORS: Record<string, string> = {
  'Google Ads': 'text-blue-400',
  Meta: 'text-indigo-400',
  LinkedIn: 'text-sky-400',
  TikTok: 'text-pink-400',
  Twitter: 'text-cyan-400',
};

const STATUS_CONFIG: Record<string, { dot: string; text: string }> = {
  Active: { dot: 'bg-cluster-high', text: 'text-cluster-high' },
  Paused: { dot: 'bg-cluster-mid', text: 'text-cluster-mid' },
  Draft: { dot: 'bg-muted-foreground', text: 'text-muted-foreground' },
};

function formatNum(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`;
  return String(n);
}

interface Props {
  campaigns: EnrichedCampaign[];
  onEdit: (c: EnrichedCampaign) => void;
  onDelete: (id: string) => void;
  onBulkDelete: (ids: string[]) => void;
}

const PAGE_SIZES = [10, 20, 50];

export default function CampaignTable({ campaigns, onEdit, onDelete, onBulkDelete }: Props) {
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('healthScore');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [clusterFilter, setClusterFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return campaigns.filter((c) => {
      const matchSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.platform.toLowerCase().includes(search.toLowerCase());
      const matchCluster = clusterFilter === 'all' || c.clusterLabel === clusterFilter;
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchCluster && matchStatus;
    });
  }, [campaigns, search, clusterFilter, statusFilter]);

  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      const av = a[sortKey] as string | number;
      const bv = b[sortKey] as string | number;
      if (typeof av === 'number' && typeof bv === 'number') {
        return sortDir === 'asc' ? av - bv : bv - av;
      }
      return sortDir === 'asc'
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av));
    });
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = sorted.slice((page - 1) * pageSize, page * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
    setPage(1);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginated.map((c) => c.id)));
    }
  };

  const SortIcon = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return <ChevronsUpDown size={12} className="text-muted-foreground/50" />;
    return sortDir === 'asc' ? (
      <ChevronUp size={12} className="text-primary" />
    ) : (
      <ChevronDown size={12} className="text-primary" />
    );
  };

  const COLS: { key: SortKey; label: string; align?: string }[] = [
    { key: 'name', label: 'Campaign' },
    { key: 'platform', label: 'Platform' },
    { key: 'impressions', label: 'Impressions', align: 'text-right' },
    { key: 'clicks', label: 'Clicks', align: 'text-right' },
    { key: 'conversions', label: 'Conversions', align: 'text-right' },
    { key: 'ctr', label: 'CTR', align: 'text-right' },
    { key: 'cr', label: 'CR', align: 'text-right' },
    { key: 'healthScore', label: 'Health', align: 'text-right' },
    { key: 'clusterLabel', label: 'Tier' },
    { key: 'status', label: 'Status' },
  ];

  return (
    <div className="card-elevated overflow-hidden">
      {/* Table header controls */}
      <div className="p-4 border-b border-border flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search campaigns or platform…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full input-dark pl-9 pr-3 py-2 text-sm"
            aria-label="Search campaigns"
          />
        </div>

        {/* Cluster filter */}
        <select
          value={clusterFilter}
          onChange={(e) => {
            setClusterFilter(e.target.value);
            setPage(1);
          }}
          className="input-dark px-3 py-2 text-sm cursor-pointer"
          aria-label="Filter by cluster tier"
        >
          <option value="all">All Tiers</option>
          <option value="High Performer">High Performer</option>
          <option value="Needs Improvement">Needs Improvement</option>
          <option value="Low Performance">Low Performance</option>
        </select>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="input-dark px-3 py-2 text-sm cursor-pointer"
          aria-label="Filter by status"
        >
          <option value="all">All Status</option>
          <option value="Active">Active</option>
          <option value="Paused">Paused</option>
          <option value="Draft">Draft</option>
        </select>

        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} of {campaigns.length} campaigns
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full min-w-[900px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              <th className="w-10 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={paginated.length > 0 && selectedIds.size === paginated.length}
                  onChange={toggleSelectAll}
                  className="accent-primary cursor-pointer"
                  aria-label="Select all"
                />
              </th>
              {COLS.map((col) => (
                <th
                  key={`th-${col.key}`}
                  className={`px-3 py-3 text-left cursor-pointer select-none ${col.align ?? ''}`}
                  onClick={() => handleSort(col.key)}
                >
                  <div
                    className={`flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider ${col.align === 'text-right' ? 'justify-end' : ''}`}
                  >
                    {col.label}
                    <SortIcon col={col.key} />
                  </div>
                </th>
              ))}
              <th className="px-3 py-3 text-right">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Actions
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={12} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <Search size={32} className="text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">
                      No campaigns match your filters
                    </p>
                    <p className="text-xs text-muted-foreground/70">
                      Try adjusting the search or filter criteria above
                    </p>
                    <button
                      onClick={() => {
                        setSearch('');
                        setClusterFilter('all');
                        setStatusFilter('all');
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Clear all filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((c) => {
                const statusCfg = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.Active;
                return (
                  <tr
                    key={`row-${c.id}`}
                    className={`row-hover transition-colors duration-100 ${selectedIds.has(c.id) ? 'bg-primary/5' : ''}`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(c.id)}
                        onChange={() => toggleSelect(c.id)}
                        className="accent-primary cursor-pointer"
                        aria-label={`Select ${c.name}`}
                      />
                    </td>
                    <td className="px-3 py-3">
                      <div className="max-w-[200px]">
                        <p className="font-medium text-foreground truncate text-xs">{c.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {c.startDate} → {c.endDate}
                        </p>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`text-xs font-medium ${PLATFORM_COLORS[c.platform] ?? 'text-muted-foreground'}`}
                      >
                        {c.platform}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-xs text-foreground tabular-nums">
                        {formatNum(c.impressions)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-xs text-foreground tabular-nums">
                        {formatNum(c.clicks)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span className="text-xs text-foreground tabular-nums">
                        {formatNum(c.conversions)}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={`text-xs font-medium tabular-nums ${c.ctr >= 0.05 ? 'text-cluster-high' : c.ctr >= 0.025 ? 'text-cluster-mid' : 'text-cluster-low'}`}
                      >
                        {(c.ctr * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <span
                        className={`text-xs font-medium tabular-nums ${c.cr >= 0.1 ? 'text-cluster-high' : c.cr >= 0.04 ? 'text-cluster-mid' : 'text-cluster-low'}`}
                      >
                        {(c.cr * 100).toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-3 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min((c.healthScore / 25) * 100, 100)}%`,
                              backgroundColor:
                                c.healthScore >= 15
                                  ? 'var(--cluster-high)'
                                  : c.healthScore >= 8
                                    ? 'var(--cluster-mid)'
                                    : 'var(--cluster-low)',
                            }}
                          />
                        </div>
                        <span className="text-xs font-bold tabular-nums text-foreground w-8 text-right">
                          {c.healthScore.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <ClusterBadge label={c.clusterLabel} size="sm" />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                        <span className={`text-xs font-medium ${statusCfg.text}`}>{c.status}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Show on row — use parent hover via group not working on tr, use flex always visible on small */}
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onEdit(c)}
                            className="p-1.5 rounded-md sidebar-item-inactive transition-all duration-150"
                            title={`Edit ${c.name}`}
                            aria-label={`Edit ${c.name}`}
                          >
                            <Edit2 size={13} />
                          </button>
                          {deleteConfirmId === c.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  onDelete(c.id);
                                  setDeleteConfirmId(null);
                                }}
                                className="px-2 py-1 rounded-md text-xs btn-danger"
                              >
                                Confirm
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="p-1.5 rounded-md sidebar-item-inactive"
                                aria-label="Cancel delete"
                              >
                                <X size={12} />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(c.id)}
                              className="p-1.5 rounded-md text-muted-foreground hover:text-cluster-low transition-all duration-150"
                              title={`Delete ${c.name} — this cannot be undone`}
                              aria-label={`Delete ${c.name}`}
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-border flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Rows per page</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="input-dark px-2 py-1 text-xs cursor-pointer"
            aria-label="Rows per page"
          >
            {PAGE_SIZES.map((s) => (
              <option key={`ps-${s}`} value={s}>
                {s}
              </option>
            ))}
          </select>
          <span className="text-xs text-muted-foreground">
            {Math.min((page - 1) * pageSize + 1, sorted.length)}–
            {Math.min(page * pageSize, sorted.length)} of {sorted.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setPage(1)}
            disabled={page === 1}
            className="px-2 py-1 rounded text-xs btn-secondary disabled:opacity-30"
            aria-label="First page"
          >
            «
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-2 py-1 rounded text-xs btn-secondary disabled:opacity-30"
            aria-label="Previous page"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
            .reduce<(number | string)[]>((acc, p, idx, arr) => {
              if (idx > 0 && (p as number) - (arr[idx - 1] as number) > 1) acc.push('…');
              acc.push(p);
              return acc;
            }, [])
            .map((p, idx) =>
              typeof p === 'string' ? (
                <span key={`ellipsis-${idx}`} className="px-1 text-xs text-muted-foreground">
                  …
                </span>
              ) : (
                <button
                  key={`page-btn-${p}`}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded text-xs font-medium transition-all duration-150 ${page === p ? 'bg-primary text-primary-foreground' : 'btn-secondary'}`}
                  aria-label={`Page ${p}`}
                  aria-current={page === p ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-2 py-1 rounded text-xs btn-secondary disabled:opacity-30"
            aria-label="Next page"
          >
            ›
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page === totalPages}
            className="px-2 py-1 rounded text-xs btn-secondary disabled:opacity-30"
            aria-label="Last page"
          >
            »
          </button>
        </div>
      </div>

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
          <div className="flex items-center gap-3 bg-secondary border border-border rounded-xl px-5 py-3 shadow-2xl">
            <span className="text-sm font-medium text-foreground">{selectedIds.size} selected</span>
            <div className="w-px h-5 bg-border" />
            <button
              onClick={() => {
                onBulkDelete(Array.from(selectedIds));
                setSelectedIds(new Set());
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg btn-danger text-sm"
            >
              <Trash2 size={13} />
              Delete Selected
            </button>
            <button
              onClick={() => setSelectedIds(new Set())}
              className="p-1.5 rounded-lg sidebar-item-inactive"
              aria-label="Clear selection"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
