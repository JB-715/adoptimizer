'use client';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import Modal from '@/components/ui/Modal';
import type { Campaign } from '@/lib/mockData';

type FormData = {
  name: string;
  impressions: number;
  clicks: number;
  conversions: number;
  platform: Campaign['platform'];
  budget: number;
  startDate: string;
  endDate: string;
  status: Campaign['status'];
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Campaign, 'id' | 'ctr' | 'cr' | 'healthScore'>) => void;
  defaultValues?: Partial<FormData>;
  mode: 'add' | 'edit';
}

const PLATFORMS: Campaign['platform'][] = ['Google Ads', 'Meta', 'LinkedIn', 'TikTok', 'Twitter'];
const STATUSES: Campaign['status'][] = ['Active', 'Paused', 'Draft'];

export default function CampaignFormModal({ open, onClose, onSubmit, defaultValues, mode }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      impressions: 0,
      clicks: 0,
      conversions: 0,
      platform: 'Google Ads',
      budget: 0,
      startDate: '2026-05-01',
      endDate: '2026-07-31',
      status: 'Active',
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        name: '',
        impressions: 0,
        clicks: 0,
        conversions: 0,
        platform: 'Google Ads',
        budget: 0,
        startDate: '2026-05-01',
        endDate: '2026-07-31',
        status: 'Active',
        ...defaultValues,
      });
    }
  }, [open, defaultValues, reset]);

  const impressions = watch('impressions');
  const clicks = watch('clicks');
  const conversions = watch('conversions');
  const previewCTR = impressions > 0 ? ((clicks / impressions) * 100).toFixed(2) : '—';
  const previewCR = clicks > 0 ? ((conversions / clicks) * 100).toFixed(2) : '—';

  const onValid = (data: FormData) => {
    onSubmit({
      name: data.name,
      impressions: Number(data.impressions),
      clicks: Number(data.clicks),
      conversions: Number(data.conversions),
      platform: data.platform,
      budget: Number(data.budget),
      startDate: data.startDate,
      endDate: data.endDate,
      status: data.status,
    });
  };

  const FieldError = ({ msg }: { msg?: string }) =>
    msg ? <p className="text-xs text-cluster-low mt-1">{msg}</p> : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={mode === 'add' ? 'Add New Campaign' : 'Edit Campaign'}
      subtitle={
        mode === 'add'
          ? 'Enter campaign metrics — CTR, CR, and health score will be computed automatically'
          : 'Update campaign metrics — cluster assignment will refresh on save'
      }
      size="lg"
    >
      <form onSubmit={handleSubmit(onValid)} className="p-5 space-y-5">
        {/* Section: Identity */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Campaign Identity
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label
                className="block text-xs font-medium text-foreground mb-1.5"
                htmlFor="camp-name"
              >
                Campaign Name <span className="text-cluster-low">*</span>
              </label>
              <input
                id="camp-name"
                type="text"
                placeholder="e.g. Summer Sale — Google Search"
                className="w-full input-dark px-3 py-2 text-sm"
                {...register('name', {
                  required: 'Campaign name is required',
                  minLength: { value: 3, message: 'Name must be at least 3 characters' },
                })}
              />
              <FieldError msg={errors.name?.message} />
            </div>

            <div>
              <label
                className="block text-xs font-medium text-foreground mb-1.5"
                htmlFor="camp-platform"
              >
                Platform <span className="text-cluster-low">*</span>
              </label>
              <select
                id="camp-platform"
                className="w-full input-dark px-3 py-2 text-sm cursor-pointer"
                {...register('platform', { required: 'Platform is required' })}
              >
                {PLATFORMS.map((p) => (
                  <option key={`opt-platform-${p}`} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              <FieldError msg={errors.platform?.message} />
            </div>

            <div>
              <label
                className="block text-xs font-medium text-foreground mb-1.5"
                htmlFor="camp-status"
              >
                Status
              </label>
              <select
                id="camp-status"
                className="w-full input-dark px-3 py-2 text-sm cursor-pointer"
                {...register('status')}
              >
                {STATUSES.map((s) => (
                  <option key={`opt-status-${s}`} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-xs font-medium text-foreground mb-1.5"
                htmlFor="camp-start"
              >
                Start Date <span className="text-cluster-low">*</span>
              </label>
              <input
                id="camp-start"
                type="date"
                className="w-full input-dark px-3 py-2 text-sm"
                {...register('startDate', { required: 'Start date is required' })}
              />
              <FieldError msg={errors.startDate?.message} />
            </div>

            <div>
              <label
                className="block text-xs font-medium text-foreground mb-1.5"
                htmlFor="camp-end"
              >
                End Date <span className="text-cluster-low">*</span>
              </label>
              <input
                id="camp-end"
                type="date"
                className="w-full input-dark px-3 py-2 text-sm"
                {...register('endDate', { required: 'End date is required' })}
              />
              <FieldError msg={errors.endDate?.message} />
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Section: Metrics */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Performance Metrics
          </p>
          <p className="text-xs text-muted-foreground mb-4">
            Enter raw counts — CTR, CR, and health score are computed automatically from these
            values.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                className="block text-xs font-medium text-foreground mb-1.5"
                htmlFor="camp-impressions"
              >
                Impressions <span className="text-cluster-low">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-1.5">Total times ad was shown</p>
              <input
                id="camp-impressions"
                type="number"
                min={0}
                placeholder="e.g. 250000"
                className="w-full input-dark px-3 py-2 text-sm tabular-nums"
                {...register('impressions', {
                  required: 'Impressions required',
                  min: { value: 0, message: 'Must be ≥ 0' },
                  valueAsNumber: true,
                })}
              />
              <FieldError msg={errors.impressions?.message} />
            </div>

            <div>
              <label
                className="block text-xs font-medium text-foreground mb-1.5"
                htmlFor="camp-clicks"
              >
                Clicks <span className="text-cluster-low">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-1.5">Total ad clicks received</p>
              <input
                id="camp-clicks"
                type="number"
                min={0}
                placeholder="e.g. 7500"
                className="w-full input-dark px-3 py-2 text-sm tabular-nums"
                {...register('clicks', {
                  required: 'Clicks required',
                  min: { value: 0, message: 'Must be ≥ 0' },
                  valueAsNumber: true,
                  validate: (val) => {
                    const imp = Number(watch('impressions'));
                    return val <= imp || 'Clicks cannot exceed impressions';
                  },
                })}
              />
              <FieldError msg={errors.clicks?.message} />
            </div>

            <div>
              <label
                className="block text-xs font-medium text-foreground mb-1.5"
                htmlFor="camp-conversions"
              >
                Conversions <span className="text-cluster-low">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-1.5">Total goal completions</p>
              <input
                id="camp-conversions"
                type="number"
                min={0}
                placeholder="e.g. 450"
                className="w-full input-dark px-3 py-2 text-sm tabular-nums"
                {...register('conversions', {
                  required: 'Conversions required',
                  min: { value: 0, message: 'Must be ≥ 0' },
                  valueAsNumber: true,
                  validate: (val) => {
                    const cl = Number(watch('clicks'));
                    return cl === 0 || val <= cl || 'Conversions cannot exceed clicks';
                  },
                })}
              />
              <FieldError msg={errors.conversions?.message} />
            </div>
          </div>
        </div>

        {/* Live preview */}
        <div className="rounded-lg bg-muted/50 border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Computed Preview
          </p>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">CTR</p>
              <p className="text-lg font-bold tabular-nums text-primary">
                {previewCTR}
                {previewCTR !== '—' ? '%' : ''}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Conv. Rate</p>
              <p className="text-lg font-bold tabular-nums text-accent">
                {previewCR}
                {previewCR !== '—' ? '%' : ''}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">Health Score</p>
              <p className="text-lg font-bold tabular-nums text-foreground">
                {impressions > 0
                  ? (() => {
                      const ctr = clicks / impressions;
                      const cr = clicks > 0 ? conversions / clicks : 0;
                      const vol = Math.min(impressions / 500000, 1);
                      return (ctr * 40 + cr * 40 + vol * 20).toFixed(1);
                    })()
                  : '—'}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border" />

        {/* Section: Budget */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-3">
            Budget
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                className="block text-xs font-medium text-foreground mb-1.5"
                htmlFor="camp-budget"
              >
                Total Budget (USD) <span className="text-cluster-low">*</span>
              </label>
              <p className="text-xs text-muted-foreground mb-1.5">Lifetime campaign spend cap</p>
              <input
                id="camp-budget"
                type="number"
                min={0}
                step={100}
                placeholder="e.g. 12000"
                className="w-full input-dark px-3 py-2 text-sm tabular-nums"
                {...register('budget', {
                  required: 'Budget is required',
                  min: { value: 0, message: 'Must be ≥ 0' },
                  valueAsNumber: true,
                })}
              />
              <FieldError msg={errors.budget?.message} />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg btn-secondary text-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2 rounded-lg btn-primary text-sm min-w-[120px] justify-center disabled:opacity-60"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Saving…
              </>
            ) : mode === 'add' ? (
              'Add Campaign'
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
