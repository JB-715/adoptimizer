'use client';
import React, { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import {
  BookOpen,
  LayoutDashboard,
  Megaphone,
  Upload,
  Filter,
  BarChart2,
  Table2,
  Cpu,
  ChevronDown,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';

interface Section {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  content: React.ReactNode;
}

function SectionCard({ section }: { section: Section }) {
  const [open, setOpen] = useState(true);
  const Icon = section.icon;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-muted/40 transition-colors duration-150"
      >
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${section.color}`}
        >
          <Icon size={16} className="text-white" />
        </div>
        <span className="flex-1 text-sm font-semibold text-foreground">{section.title}</span>
        {open ? (
          <ChevronDown size={16} className="text-muted-foreground" />
        ) : (
          <ChevronRight size={16} className="text-muted-foreground" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border/60 pt-4 space-y-3 text-sm text-muted-foreground leading-relaxed">
          {section.content}
        </div>
      )}
    </div>
  );
}

function Step({ number, text }: { number: number; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center mt-0.5">
        {number}
      </span>
      <span>{text}</span>
    </div>
  );
}

function Tip({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 bg-accent/10 border border-accent/20 rounded-lg px-3 py-2.5">
      <CheckCircle2 size={14} className="text-accent flex-shrink-0 mt-0.5" />
      <span className="text-xs text-foreground">{text}</span>
    </div>
  );
}

function Note({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 bg-muted border border-border rounded-lg px-3 py-2.5">
      <Info size={14} className="text-muted-foreground flex-shrink-0 mt-0.5" />
      <span className="text-xs text-muted-foreground">{text}</span>
    </div>
  );
}

function Warning({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2.5">
      <AlertCircle size={14} className="text-destructive flex-shrink-0 mt-0.5" />
      <span className="text-xs text-foreground">{text}</span>
    </div>
  );
}

const SECTIONS: Section[] = [
  {
    id: 'overview',
    title: 'Overview',
    icon: BookOpen,
    color: 'bg-primary',
    content: (
      <div className="space-y-3">
        <p>
          <strong className="text-foreground">AdOptimizer Pro</strong> is a campaign analytics
          platform that uses K-means clustering to automatically segment your ad campaigns into
          performance tiers — High, Mid, and Low. This helps you quickly identify which campaigns
          need attention and which are performing well.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { label: 'Ad Performance', desc: 'Dashboard with KPIs, charts, and cluster analysis' },
            { label: 'Campaign Mgmt', desc: 'Add, edit, import, and manage campaign data' },
            { label: 'User Manual', desc: 'This guide — documentation for all features' },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-border bg-muted/40 px-3 py-2.5"
            >
              <p className="text-xs font-semibold text-foreground mb-1">{item.label}</p>
              <p className="text-xs">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: 'dashboard',
    title: 'Ad Performance Dashboard',
    icon: LayoutDashboard,
    color: 'bg-blue-500',
    content: (
      <div className="space-y-4">
        <p>
          The <strong className="text-foreground">Ad Performance Dashboard</strong> is your main
          analytics view. It displays KPI metrics, trend charts, cluster scatter plots, and campaign
          bar charts — all derived from your campaign data after K-means clustering.
        </p>

        <div>
          <p className="text-xs font-semibold text-foreground mb-2">KPI Bento Grid</p>
          <div className="space-y-1.5">
            {[
              { label: 'Total Spend', desc: 'Sum of budget spent across all active campaigns.' },
              { label: 'Avg CTR', desc: 'Average click-through rate across all campaigns.' },
              { label: 'Avg ROAS', desc: 'Return on ad spend — revenue divided by cost.' },
              { label: 'Active Campaigns', desc: 'Count of campaigns currently running.' },
              { label: 'High Performers', desc: 'Campaigns assigned to the High cluster tier.' },
            ].map((kpi) => (
              <div key={kpi.label} className="flex gap-2">
                <span className="text-foreground font-medium min-w-[120px]">{kpi.label}:</span>
                <span>{kpi.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Charts</p>
          <div className="space-y-2">
            <div>
              <span className="text-foreground font-medium">Trend Area Chart — </span>
              Shows spend and ROAS trends over time. Use the time range selector to switch between
              7-day, 30-day, and 90-day views.
            </div>
            <div>
              <span className="text-foreground font-medium">Cluster Scatter Chart — </span>
              Plots each campaign by CTR vs. ROAS, color-coded by cluster tier (High / Mid / Low).
              Hover over a dot to see campaign details.
            </div>
            <div>
              <span className="text-foreground font-medium">Campaign Bar Chart — </span>
              Compares spend or impressions across campaigns. Use the metric toggle to switch
              between views.
            </div>
            <div>
              <span className="text-foreground font-medium">Cluster Tier Summary — </span>A
              breakdown panel showing how many campaigns fall into each tier and their aggregate
              metrics.
            </div>
          </div>
        </div>

        <Tip text="All charts update automatically when you apply filters or add new campaign data." />
      </div>
    ),
  },
  {
    id: 'filters',
    title: 'Dashboard Filters',
    icon: Filter,
    color: 'bg-violet-500',
    content: (
      <div className="space-y-3">
        <p>
          The filter bar at the top of the dashboard lets you narrow down the data shown across all
          charts and KPIs.
        </p>
        <div className="space-y-2">
          {[
            { label: 'Date Range', desc: 'Filter campaigns by their active date window.' },
            {
              label: 'Platform',
              desc: 'Show only campaigns from a specific ad platform (e.g., Google, Meta, TikTok).',
            },
            { label: 'Cluster Tier', desc: 'Filter by High, Mid, or Low performance cluster.' },
            {
              label: 'Campaign Type',
              desc: 'Filter by campaign objective type (e.g., Awareness, Conversion).',
            },
          ].map((f) => (
            <div key={f.label} className="flex gap-2">
              <span className="text-foreground font-medium min-w-[120px]">{f.label}:</span>
              <span>{f.desc}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          <Step number={1} text="Click any filter dropdown in the filter bar." />
          <Step number={2} text="Select your desired value from the options." />
          <Step number={3} text="All charts and KPIs update instantly to reflect the filter." />
          <Step number={4} text='Click "Reset Filters" to clear all active filters.' />
        </div>
        <Note text="Filters are applied in combination — selecting both a platform and a cluster tier shows only campaigns matching both criteria." />
      </div>
    ),
  },
  {
    id: 'campaign-entry',
    title: 'Campaign Data Entry',
    icon: Megaphone,
    color: 'bg-emerald-600',
    content: (
      <div className="space-y-3">
        <p>
          Navigate to <strong className="text-foreground">Campaign Mgmt</strong> in the sidebar to
          add or edit individual campaigns manually.
        </p>
        <div className="space-y-2">
          <Step
            number={1}
            text='Click the "Add Campaign" button in the top-right of the Campaign Management page.'
          />
          <Step
            number={2}
            text="Fill in the campaign form fields: Name, Platform, Budget, Spend, Impressions, Clicks, Conversions, and Start/End dates."
          />
          <Step number={3} text='Click "Save Campaign" to add it to the table.' />
          <Step
            number={4}
            text="K-means clustering runs automatically after saving — the campaign will be assigned a tier."
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Form Fields Reference</p>
          <div className="space-y-1.5">
            {[
              { label: 'Campaign Name', desc: 'A unique identifier for the campaign.' },
              {
                label: 'Platform',
                desc: 'The ad network (Google Ads, Meta, TikTok, LinkedIn, etc.).',
              },
              { label: 'Budget', desc: 'Total allocated budget in USD.' },
              { label: 'Spend', desc: 'Amount already spent from the budget.' },
              { label: 'Impressions', desc: 'Total number of times the ad was shown.' },
              { label: 'Clicks', desc: 'Total number of clicks received.' },
              {
                label: 'Conversions',
                desc: 'Number of desired actions completed (purchases, sign-ups, etc.).',
              },
              { label: 'Start / End Date', desc: 'The active date range for the campaign.' },
            ].map((f) => (
              <div key={f.label} className="flex gap-2 text-xs">
                <span className="text-foreground font-medium min-w-[130px]">{f.label}:</span>
                <span>{f.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <Tip text="To edit an existing campaign, click the edit icon (pencil) in the campaign table row." />
        <Warning text="Deleting a campaign is permanent and cannot be undone. The cluster analysis will re-run after deletion." />
      </div>
    ),
  },
  {
    id: 'csv-import',
    title: 'CSV Import',
    icon: Upload,
    color: 'bg-orange-500',
    content: (
      <div className="space-y-3">
        <p>
          The <strong className="text-foreground">CSV Import Panel</strong> lets you bulk-upload
          campaign data from a spreadsheet file. This is the fastest way to populate the app with
          existing campaign data.
        </p>
        <div className="space-y-2">
          <Step
            number={1}
            text='On the Campaign Management page, click "Import CSV" to open the import panel.'
          />
          <Step
            number={2}
            text="Drag and drop your CSV file onto the upload area, or click to browse and select a file."
          />
          <Step
            number={3}
            text="The app will preview the parsed rows. Review for any errors before confirming."
          />
          <Step number={4} text='Click "Import" to load the campaigns into the table.' />
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Required CSV Columns</p>
          <div className="rounded-lg border border-border overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left px-3 py-2 font-semibold text-foreground">
                    Column Header
                  </th>
                  <th className="text-left px-3 py-2 font-semibold text-foreground">Type</th>
                  <th className="text-left px-3 py-2 font-semibold text-foreground">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { col: 'name', type: 'Text', ex: 'Summer Sale 2026' },
                  { col: 'platform', type: 'Text', ex: 'Google Ads' },
                  { col: 'budget', type: 'Number', ex: '5000' },
                  { col: 'spend', type: 'Number', ex: '3200' },
                  { col: 'impressions', type: 'Number', ex: '120000' },
                  { col: 'clicks', type: 'Number', ex: '4800' },
                  { col: 'conversions', type: 'Number', ex: '320' },
                  { col: 'startDate', type: 'Date (YYYY-MM-DD)', ex: '2026-04-01' },
                  { col: 'endDate', type: 'Date (YYYY-MM-DD)', ex: '2026-04-30' },
                ].map((row) => (
                  <tr key={row.col} className="hover:bg-muted/30">
                    <td className="px-3 py-1.5 font-mono text-primary">{row.col}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{row.type}</td>
                    <td className="px-3 py-1.5 text-muted-foreground">{row.ex}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <Note text="Column headers in your CSV must match exactly (case-sensitive). Extra columns are ignored." />
        <Warning text="Rows with missing required fields will be skipped during import. Check the preview for any highlighted errors." />
      </div>
    ),
  },
  {
    id: 'kmeans',
    title: 'K-Means Clustering',
    icon: Cpu,
    color: 'bg-rose-500',
    content: (
      <div className="space-y-3">
        <p>
          K-means clustering is the core intelligence behind AdOptimizer. It automatically groups
          your campaigns into three performance tiers based on their metrics — no manual tagging
          required.
        </p>

        <div>
          <p className="text-xs font-semibold text-foreground mb-2">How It Works</p>
          <div className="space-y-2">
            <Step
              number={1}
              text="The algorithm reads each campaign's CTR, ROAS, CPC, and conversion rate."
            />
            <Step
              number={2}
              text="It normalizes these values so no single metric dominates the clustering."
            />
            <Step
              number={3}
              text="Campaigns are grouped into 3 clusters by minimizing within-cluster variance."
            />
            <Step
              number={4}
              text="Clusters are labeled High, Mid, or Low based on their aggregate performance scores."
            />
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Cluster Tiers</p>
          <div className="space-y-2">
            {[
              {
                tier: 'High',
                color: 'bg-cluster-high',
                desc: 'Top-performing campaigns. Strong ROAS, high CTR, efficient spend.',
              },
              {
                tier: 'Mid',
                color: 'bg-cluster-mid',
                desc: 'Average performers. Stable metrics with room for optimization.',
              },
              {
                tier: 'Low',
                color: 'bg-cluster-low',
                desc: 'Underperforming campaigns. Low ROAS or CTR — review and adjust.',
              },
            ].map((t) => (
              <div key={t.tier} className="flex items-start gap-3">
                <span className={`flex-shrink-0 w-2.5 h-2.5 rounded-full mt-1 ${t.color}`} />
                <div>
                  <span className="text-foreground font-semibold">{t.tier}: </span>
                  <span>{t.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-2">K-Means Status Bar</p>
          <p>
            The status bar at the top of the Campaign Management page shows the current clustering
            state. It displays the number of campaigns per tier and a progress indicator while the
            algorithm is running.
          </p>
        </div>

        <Tip text="K-means re-runs automatically whenever you add, edit, delete, or import campaigns. You can also trigger it manually using the 'Run Clustering' button." />
        <Note text="A minimum of 3 campaigns is required for clustering to produce meaningful results." />
      </div>
    ),
  },
  {
    id: 'data-table',
    title: 'Campaign Data Table',
    icon: Table2,
    color: 'bg-slate-500',
    content: (
      <div className="space-y-3">
        <p>
          The <strong className="text-foreground">Campaign Table</strong> on the Campaign Management
          page lists all your campaigns with their key metrics and cluster assignments.
        </p>

        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Table Columns</p>
          <div className="space-y-1.5">
            {[
              { label: 'Campaign', desc: 'Name and platform of the campaign.' },
              { label: 'Cluster', desc: 'Assigned tier badge (High / Mid / Low).' },
              { label: 'Budget / Spend', desc: 'Allocated budget and amount spent.' },
              { label: 'Impressions', desc: 'Total ad impressions.' },
              { label: 'CTR', desc: 'Click-through rate (clicks ÷ impressions × 100).' },
              { label: 'ROAS', desc: 'Return on ad spend.' },
              { label: 'Conversions', desc: 'Total conversions recorded.' },
              { label: 'Actions', desc: 'Edit (pencil icon) or Delete (trash icon) the campaign.' },
            ].map((col) => (
              <div key={col.label} className="flex gap-2 text-xs">
                <span className="text-foreground font-medium min-w-[130px]">{col.label}:</span>
                <span>{col.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-foreground mb-2">Sorting & Filtering</p>
          <div className="space-y-2">
            <Step
              number={1}
              text="Click any column header to sort the table by that column (ascending/descending)."
            />
            <Step
              number={2}
              text="Use the search bar above the table to filter campaigns by name."
            />
            <Step
              number={3}
              text="Use the cluster filter dropdown to show only campaigns from a specific tier."
            />
          </div>
        </div>

        <Tip text="The table updates in real time as K-means clustering runs — cluster badges will refresh automatically." />
      </div>
    ),
  },
  {
    id: 'charts',
    title: 'Charts Reference',
    icon: BarChart2,
    color: 'bg-cyan-600',
    content: (
      <div className="space-y-4">
        <p>
          All charts in AdOptimizer are interactive. Here is a quick reference for each chart type.
        </p>

        <div className="space-y-3">
          {[
            {
              name: 'Trend Area Chart',
              location: 'Ad Performance Dashboard',
              desc: 'Visualizes spend and ROAS over time as stacked area layers. Use the time range buttons (7D / 30D / 90D) to zoom in or out. Hover over the chart to see exact values for any date.',
            },
            {
              name: 'Cluster Scatter Chart',
              location: 'Ad Performance Dashboard',
              desc: 'Each dot represents one campaign, plotted by CTR (x-axis) vs. ROAS (y-axis). Dot color indicates cluster tier. Hover a dot to see the campaign name and metrics. Useful for spotting outliers.',
            },
            {
              name: 'Campaign Bar Chart',
              location: 'Ad Performance Dashboard',
              desc: 'Horizontal bars comparing campaigns by a selected metric. Toggle between Spend, Impressions, and Conversions using the metric selector. Bars are color-coded by cluster tier.',
            },
            {
              name: 'Cluster Tier Summary',
              location: 'Ad Performance Dashboard',
              desc: 'A summary panel with aggregate stats per tier — total spend, average CTR, and average ROAS for High, Mid, and Low clusters. Useful for a quick performance health check.',
            },
          ].map((chart) => (
            <div
              key={chart.name}
              className="rounded-lg border border-border bg-muted/30 px-4 py-3 space-y-1"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-foreground">{chart.name}</p>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {chart.location}
                </span>
              </div>
              <p className="text-xs">{chart.desc}</p>
            </div>
          ))}
        </div>

        <Note text="Charts use mock data by default. Connect your real campaign data via manual entry or CSV import to see live results." />
      </div>
    ),
  },
];

export default function UserManualPage() {
  return (
    <AppLayout activeRoute="/user-manual">
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground tracking-tight">User Manual</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Complete guide to using AdOptimizer Pro — campaigns, clustering, charts, and more.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted border border-border text-xs text-muted-foreground">
            <BookOpen size={13} />
            <span>v1.0 · May 2026</span>
          </div>
        </div>

        {/* Quick nav */}
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById(s.id)
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted text-xs font-medium text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                <Icon size={12} />
                {s.title}
              </a>
            );
          })}
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {SECTIONS.map((section) => (
            <div key={section.id} id={section.id}>
              <SectionCard section={section} />
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
