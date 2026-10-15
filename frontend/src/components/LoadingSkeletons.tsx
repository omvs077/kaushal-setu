import React from 'react';
import { Language } from '../types';

interface SkeletonsProps {
  lang?: Language;
}

/**
 * Shimmering skeleton loader for Top Shortage Watch Clusters table
 * (Matches reference image structure)
 */
export const DashboardClustersSkeleton: React.FC<SkeletonsProps> = ({ lang = 'en' }) => {
  return (
    <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            {lang === 'hi' ? 'शीर्ष कमी निगरानी क्लस्टर' : 'Top Shortage Watch Clusters'}
          </h3>
          <p className="text-[11px] text-slate-400">
            {lang === 'hi' ? 'उच्च मांग-आपूर्ति बेमेल' : 'High demand-supply mismatches'}
          </p>
        </div>
        <div className="w-24 h-4 bg-slate-200/70 rounded-full animate-pulse" />
      </div>

      {/* Shimmer Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="py-2.5"><div className="w-16 h-3 bg-slate-200/70 rounded-full animate-pulse" /></th>
              <th className="py-2.5"><div className="w-20 h-3 bg-slate-200/70 rounded-full animate-pulse" /></th>
              <th className="py-2.5 text-right"><div className="w-14 h-3 bg-slate-200/70 rounded-full animate-pulse ml-auto" /></th>
              <th className="py-2.5 text-right"><div className="w-14 h-3 bg-slate-200/70 rounded-full animate-pulse ml-auto" /></th>
              <th className="py-2.5 text-right"><div className="w-12 h-3 bg-slate-200/70 rounded-full animate-pulse ml-auto" /></th>
              <th className="py-2.5 text-center"><div className="w-10 h-3 bg-slate-200/70 rounded-full animate-pulse mx-auto" /></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {[1, 2, 3, 4, 5].map((row) => (
              <tr key={row} className="py-2.5">
                <td className="py-3">
                  <div className="w-28 h-3.5 bg-slate-200/70 rounded-full animate-pulse mb-1.5" />
                  <div className="w-14 h-2 bg-slate-100 rounded-full animate-pulse" />
                </td>
                <td className="py-3">
                  <div className="w-32 h-3.5 bg-slate-200/70 rounded-full animate-pulse" />
                </td>
                <td className="py-3 text-right">
                  <div className="w-12 h-3.5 bg-slate-200/70 rounded-full animate-pulse ml-auto" />
                </td>
                <td className="py-3 text-right">
                  <div className="w-12 h-3.5 bg-slate-200/70 rounded-full animate-pulse ml-auto" />
                </td>
                <td className="py-3 text-right">
                  <div className="w-14 h-3.5 bg-red-100/70 rounded-full animate-pulse ml-auto" />
                </td>
                <td className="py-3 text-center">
                  <div className="w-11 h-5 bg-teal-50 rounded-md animate-pulse mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/**
 * Shimmering skeleton loader for Quick Seat Reallocations snapshot
 * (Matches reference image with bottom-right spinner & "Loading data..." label)
 */
export const DashboardReallocationsSkeleton: React.FC<SkeletonsProps> = ({ lang = 'en' }) => {
  return (
    <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {lang === 'hi' ? 'सीट पुनर्वितरण त्वरित स्थानांतरण' : 'Seat Reallocation Quick Shifts'}
            </h3>
            <p className="text-[11px] text-slate-400">
              {lang === 'hi' ? 'अनुकूलित न्यूनतम लागत स्थानांतरण' : 'Optimized Min-Cost moves'}
            </p>
          </div>
          <div className="w-24 h-4 bg-slate-200/70 rounded-full animate-pulse" />
        </div>

        {/* 3 Proposal Skeleton Cards */}
        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div key={item} className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 animate-pulse">
              <div className="flex justify-between items-center mb-2">
                <div className="w-36 h-3.5 bg-slate-200/80 rounded-full" />
                <div className="w-16 h-3.5 bg-teal-100/80 rounded-full" />
              </div>
              <div className="w-48 h-2.5 bg-slate-200/60 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Bottom-right Spinner & Loading data label (Matches user reference image) */}
      <div className="flex items-center justify-end space-x-2 text-xs font-semibold text-slate-500 pt-4 mt-2 border-t border-slate-50">
        <div className="w-4 h-4 rounded-full border-2 border-emerald-400 border-t-emerald-700 animate-spin" />
        <span>{lang === 'hi' ? 'डेटा लोड हो रहा है...' : 'Loading data...'}</span>
      </div>
    </div>
  );
};

/**
 * Shimmering skeleton loader for Metric Tiles
 */
export const MetricTilesSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 mb-6">
      {/* Tile 1: Blue Card Skeleton */}
      <div className="lg:col-span-3 bg-blue-600/90 rounded-2xl p-5 text-white shadow-xs flex flex-col justify-between animate-pulse">
        <div>
          <div className="w-24 h-3 bg-blue-400/50 rounded-full mb-3" />
          <div className="w-36 h-7 bg-blue-300/60 rounded-md mb-4" />
          <div className="w-full bg-blue-700/60 rounded-full h-2 overflow-hidden">
            <div className="w-3/4 bg-amber-400/60 h-2 rounded-full" />
          </div>
        </div>
        <div className="pt-3 flex justify-between">
          <div className="w-20 h-2.5 bg-blue-400/50 rounded-full" />
          <div className="w-8 h-2.5 bg-blue-300/60 rounded-full" />
        </div>
      </div>

      {/* Tiles 2, 3, 4: White Cards Skeleton */}
      {[
        { border: 'border-b-indigo-500', bar: 'bg-indigo-100' },
        { border: 'border-b-red-500', bar: 'bg-red-100' },
        { border: 'border-b-purple-500', bar: 'bg-purple-100' }
      ].map((tile, i) => (
        <div
          key={i}
          className={`lg:col-span-3 bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border-b-4 ${tile.border} flex flex-col justify-between animate-pulse`}
        >
          <div>
            <div className="w-28 h-7 bg-slate-200/80 rounded-md mb-2" />
            <div className="w-36 h-3 bg-slate-200/60 rounded-full mb-3" />
            <div className="w-44 h-2 bg-slate-100 rounded-full" />
          </div>
          <div className="pt-3 border-t border-slate-50 flex items-center justify-between">
            <div className={`w-20 h-5 ${tile.bar} rounded-md`} />
            <div className="w-16 h-2.5 bg-slate-200/60 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Shimmering skeleton loader for Charts Section
 */
export const ChartsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
      {/* Sector Breakdown Skeleton */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between animate-pulse">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="w-32 h-4 bg-slate-200/80 rounded-full" />
            <div className="w-16 h-3 bg-slate-200/50 rounded-full" />
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((row) => (
              <div key={row}>
                <div className="flex justify-between mb-1">
                  <div className="w-24 h-3 bg-slate-200/70 rounded-full" />
                  <div className="w-12 h-3 bg-slate-200/70 rounded-full" />
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-slate-300/70 h-2 rounded-full"
                    style={{ width: `${85 - row * 12}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Severity Donut Skeleton */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between animate-pulse">
        <div>
          <div className="flex justify-between items-center mb-2">
            <div className="w-36 h-4 bg-slate-200/80 rounded-full" />
            <div className="w-14 h-3 bg-slate-200/50 rounded-full" />
          </div>
          {/* Circular donut placeholder */}
          <div className="h-44 flex items-center justify-center my-2">
            <div className="w-36 h-36 rounded-full border-12 border-slate-100 border-t-slate-200 border-r-slate-200/60 flex items-center justify-center">
              <div className="w-16 h-4 bg-slate-200/60 rounded-full" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-50">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-slate-300" />
              <div className="w-16 h-2.5 bg-slate-200/70 rounded-full" />
            </div>
          ))}
        </div>
      </div>

      {/* Leading Signals Telemetry Skeleton */}
      <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-5 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] flex flex-col justify-between animate-pulse">
        <div>
          <div className="flex justify-between items-center mb-4">
            <div className="w-36 h-4 bg-slate-200/80 rounded-full" />
            <div className="w-16 h-3 bg-slate-200/50 rounded-full" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map((row) => (
              <div key={row} className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-7 h-7 rounded-lg bg-slate-200/80" />
                  <div className="flex-1">
                    <div className="w-24 h-3 bg-slate-200/80 rounded-full mb-1" />
                    <div className="w-36 h-2 bg-slate-200/50 rounded-full" />
                  </div>
                </div>
                <div className="w-full bg-slate-200/60 rounded-full h-1.5" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
