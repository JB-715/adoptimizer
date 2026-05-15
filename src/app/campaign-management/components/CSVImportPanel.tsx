'use client';
import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, CheckCircle, AlertCircle, FileText } from 'lucide-react';
import type { Campaign } from '@/lib/mockData';

type ImportRow = Omit<Campaign, 'id' | 'ctr' | 'cr' | 'healthScore'>;

interface ParseResult {
  valid: ImportRow[];
  errors: { row: number; message: string }[];
}

function parseCSV(text: string): ParseResult {
  const lines = text.trim().split('\n').filter(Boolean);
  if (lines.length < 2)
    return {
      valid: [],
      errors: [{ row: 0, message: 'CSV must have a header row and at least one data row' }],
    };

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const required = [
    'name',
    'impressions',
    'clicks',
    'conversions',
    'platform',
    'budget',
    'startdate',
    'enddate',
    'status',
  ];
  const missing = required.filter((r) => !headers.includes(r));
  if (missing.length > 0) {
    return { valid: [], errors: [{ row: 0, message: `Missing columns: ${missing.join(', ')}` }] };
  }

  const valid: ImportRow[] = [];
  const errors: { row: number; message: string }[] = [];

  lines.slice(1).forEach((line, i) => {
    const row = i + 2;
    const values = line.split(',').map((v) => v.trim());
    const get = (key: string) => values[headers.indexOf(key)] ?? '';

    const name = get('name');
    const impressions = parseInt(get('impressions'), 10);
    const clicks = parseInt(get('clicks'), 10);
    const conversions = parseInt(get('conversions'), 10);
    const platform = get('platform') as Campaign['platform'];
    const budget = parseFloat(get('budget'));
    const startDate = get('startdate');
    const endDate = get('enddate');
    const status = get('status') as Campaign['status'];

    if (!name) {
      errors.push({ row, message: 'Missing campaign name' });
      return;
    }
    if (isNaN(impressions) || impressions < 0) {
      errors.push({ row, message: `Invalid impressions: "${get('impressions')}"` });
      return;
    }
    if (isNaN(clicks) || clicks < 0) {
      errors.push({ row, message: `Invalid clicks: "${get('clicks')}"` });
      return;
    }
    if (isNaN(conversions) || conversions < 0) {
      errors.push({ row, message: `Invalid conversions: "${get('conversions')}"` });
      return;
    }
    if (!['Google Ads', 'Meta', 'LinkedIn', 'TikTok', 'Twitter'].includes(platform)) {
      errors.push({ row, message: `Invalid platform: "${platform}"` });
      return;
    }
    if (!['Active', 'Paused', 'Draft'].includes(status)) {
      errors.push({ row, message: `Invalid status: "${status}"` });
      return;
    }

    valid.push({
      name,
      impressions,
      clicks,
      conversions,
      platform,
      budget,
      startDate,
      endDate,
      status,
    });
  });

  return { valid, errors };
}

interface Props {
  onImport: (rows: ImportRow[]) => void;
  onClose: () => void;
}

export default function CSVImportPanel({ onImport, onClose }: Props) {
  const [dragOver, setDragOver] = useState(false);
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [fileName, setFileName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.name.endsWith('.csv')) {
      setParseResult({ valid: [], errors: [{ row: 0, message: 'Only .csv files are supported' }] });
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setParseResult(parseCSV(text));
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleConfirmImport = () => {
    if (parseResult && parseResult.valid.length > 0) {
      onImport(parseResult.valid);
    }
  };

  return (
    <div className="card-elevated p-5 animate-slide-up border border-primary/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Upload size={16} className="text-primary" />
          <h3 className="text-sm font-semibold text-foreground">CSV Bulk Import</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md sidebar-item-inactive"
          aria-label="Close import panel"
        >
          <X size={14} />
        </button>
      </div>

      {!parseResult ? (
        /* Drop zone */
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-all duration-200 ${
            dragOver
              ? 'border-primary bg-primary/5'
              : 'border-border hover:border-primary/40 hover:bg-muted/40'
          }`}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') fileInputRef.current?.click();
          }}
          aria-label="Drop CSV file or click to browse"
        >
          <FileText
            size={32}
            className={`mx-auto mb-3 ${dragOver ? 'text-primary' : 'text-muted-foreground/40'}`}
          />
          <p className="text-sm font-medium text-foreground mb-1">
            {dragOver ? 'Drop your CSV file here' : 'Drag & drop your CSV file'}
          </p>
          <p className="text-xs text-muted-foreground mb-3">or click to browse — .csv files only</p>
          <span className="text-xs text-primary font-medium">
            Required columns: name, impressions, clicks, conversions, platform, budget, startDate,
            endDate, status
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileInput}
            className="hidden"
            aria-hidden="true"
          />
        </div>
      ) : (
        /* Parse results */
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
            <FileText size={16} className="text-muted-foreground flex-shrink-0" />
            <span className="text-sm text-foreground font-medium flex-1 truncate">{fileName}</span>
            <button
              onClick={() => {
                setParseResult(null);
                setFileName('');
              }}
              className="p-1 rounded sidebar-item-inactive"
              aria-label="Remove file"
            >
              <X size={12} />
            </button>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-cluster-high/10 border border-cluster-high/20">
              <CheckCircle size={14} className="text-cluster-high flex-shrink-0" />
              <div>
                <p className="text-sm font-bold text-cluster-high tabular-nums">
                  {parseResult.valid.length}
                </p>
                <p className="text-xs text-muted-foreground">Valid rows</p>
              </div>
            </div>
            <div
              className={`flex items-center gap-2 p-3 rounded-lg ${parseResult.errors.length > 0 ? 'bg-cluster-low/10 border border-cluster-low/20' : 'bg-muted border border-border'}`}
            >
              <AlertCircle
                size={14}
                className={
                  parseResult.errors.length > 0
                    ? 'text-cluster-low flex-shrink-0'
                    : 'text-muted-foreground flex-shrink-0'
                }
              />
              <div>
                <p
                  className={`text-sm font-bold tabular-nums ${parseResult.errors.length > 0 ? 'text-cluster-low' : 'text-muted-foreground'}`}
                >
                  {parseResult.errors.length}
                </p>
                <p className="text-xs text-muted-foreground">Errors</p>
              </div>
            </div>
          </div>

          {/* Errors list */}
          {parseResult.errors.length > 0 && (
            <div className="rounded-lg border border-cluster-low/20 bg-cluster-low/5 p-3 max-h-32 overflow-y-auto scrollbar-thin">
              <p className="text-xs font-semibold text-cluster-low mb-2">
                Parse errors — these rows will be skipped:
              </p>
              {parseResult.errors.map((err, i) => (
                <p key={`csv-err-${i}`} className="text-xs text-muted-foreground">
                  Row {err.row}: {err.message}
                </p>
              ))}
            </div>
          )}

          {/* Preview table */}
          {parseResult.valid.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                Preview (first 5 rows)
              </p>
              <div className="overflow-x-auto scrollbar-thin rounded-lg border border-border">
                <table className="w-full text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      {['Name', 'Platform', 'Impressions', 'Clicks', 'Conversions', 'Status'].map(
                        (h) => (
                          <th
                            key={`preview-th-${h}`}
                            className="px-3 py-2 text-left text-muted-foreground font-medium"
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {parseResult.valid.slice(0, 5).map((row, i) => (
                      <tr key={`preview-row-${i}`} className="row-hover">
                        <td className="px-3 py-2 text-foreground truncate max-w-[150px]">
                          {row.name}
                        </td>
                        <td className="px-3 py-2 text-muted-foreground">{row.platform}</td>
                        <td className="px-3 py-2 text-foreground tabular-nums">
                          {row.impressions.toLocaleString('en-US')}
                        </td>
                        <td className="px-3 py-2 text-foreground tabular-nums">
                          {row.clicks.toLocaleString('en-US')}
                        </td>
                        <td className="px-3 py-2 text-foreground tabular-nums">
                          {row.conversions.toLocaleString('en-US')}
                        </td>
                        <td className="px-3 py-2">
                          <span
                            className={`font-medium ${row.status === 'Active' ? 'text-cluster-high' : row.status === 'Paused' ? 'text-cluster-mid' : 'text-muted-foreground'}`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {parseResult.valid.length > 5 && (
                <p className="text-xs text-muted-foreground mt-2">
                  …and {parseResult.valid.length - 5} more rows
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <button
              onClick={() => {
                setParseResult(null);
                setFileName('');
              }}
              className="px-4 py-2 rounded-lg btn-secondary text-sm"
            >
              Choose Different File
            </button>
            <button
              onClick={handleConfirmImport}
              disabled={parseResult.valid.length === 0}
              className="flex items-center gap-2 px-5 py-2 rounded-lg btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Upload size={13} />
              Import {parseResult.valid.length} Campaigns
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
