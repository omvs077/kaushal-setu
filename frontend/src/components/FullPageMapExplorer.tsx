import React, { useState, useEffect } from 'react';
import { MapContainer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as maplibregl from 'maplibre-gl';
import { setWorkerUrl } from 'maplibre-gl';
// @ts-ignore
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url';
import maplibreGL from '@maplibre/maplibre-gl-leaflet';
import * as bharatmap from 'bharatmap';

// 1. Explicitly register MapLibre Web Worker for Vite so vector tiles decode properly
try {
  setWorkerUrl(workerUrl);
} catch (err) {
  console.warn('MapLibre worker registration:', err);
}

// 2. Install bharatmap protocol on MapLibre to ensure Survey of India boundaries
try {
  const fakeMl = {
    addProtocol: (scheme: string, handler: any) => {
      (maplibregl as any).addProtocol(scheme, handler);
    }
  };
  (bharatmap as any).install(fakeMl);
} catch (err) {
  console.warn('bharatmap install:', err);
}

import { DistrictSummary, RankingItem, RecommendationItem, Language } from '../types';
import {
  MapPin,
  Zap,
  Truck,
  CreditCard,
  Briefcase,
  Layers,
  ArrowRight,
  HelpCircle,
  Sliders,
  X,
  Compass,
  AlertTriangle,
  Info,
  Maximize2,
  ShieldCheck,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface FullPageMapExplorerProps {
  districts: DistrictSummary[];
  rankings: RankingItem[];
  recommendations: RecommendationItem[];
  lang: Language;
  onSelectWhy: (item: RankingItem) => void;
  onSelectSimulate: (item: RankingItem) => void;
  t: (key: string) => string;
}

// Controller component to smoothly pan/zoom map programmatically
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.0 });
  }, [center, zoom, map]);
  return null;
}

// OpenFreeMap Vector Layer component with BharatMap Survey of India boundary enforcement!
function OpenFreeMapLayer({ styleUrl }: { styleUrl: string }) {
  const map = useMap();

  useEffect(() => {
    let glLayer: any = null;
    let isMounted = true;

    async function initLayer() {
      try {
        // Fix style using bharatmap which enforces Survey of India boundaries and cuts disputed borders
        const fixedStyle = await (bharatmap as any).fixStyle(styleUrl);
        
        // Remove disputed borders (LoC & LAC) and polish state boundaries
        if (fixedStyle.layers && Array.isArray(fixedStyle.layers)) {
          for (const layer of fixedStyle.layers) {
            if (layer.id === 'boundary_disputed') {
              // Hide LoC and LAC completely!
              layer.layout = { ...layer.layout, visibility: 'none' };
            } else if (layer.id === 'boundary_3') {
              // Undisputed internal state boundaries
              layer.minzoom = 3;
              if (!layer.paint) layer.paint = {};
              layer.paint['line-color'] = '#64748b';
              layer.paint['line-width'] = ['interpolate', ['linear'], ['zoom'], 3, 0.8, 6, 1.2, 11, 2.0];
            } else if (layer.id === 'boundary_2-india' || layer.id === 'boundary_2') {
              // Official sovereign boundary of India (SOI compliant)
              if (!layer.paint) layer.paint = {};
              layer.paint['line-color'] = '#1e293b';
              layer.paint['line-width'] = ['interpolate', ['linear'], ['zoom'], 2, 1.4, 5, 2.2, 11, 3.8];
            }
          }
        }

        if (!isMounted) return;

        // @ts-ignore
        glLayer = (maplibreGL as any)({
          style: fixedStyle
        });
        glLayer.addTo(map);
      } catch (e) {
        console.warn('BharatMap style fallback:', e);
        if (!isMounted) return;
        // @ts-ignore
        glLayer = (maplibreGL as any)({
          style: styleUrl
        });
        glLayer.addTo(map);
      }
    }

    initLayer();

    return () => {
      isMounted = false;
      if (glLayer) {
        try {
          map.removeLayer(glLayer);
        } catch (err) {}
      }
    };
  }, [map, styleUrl]);

  return null;
}

// Crisp, clean Leaflet markers without oversized blur smudges
function createDistrictIcon(d: DistrictSummary, isSelected: boolean) {
  const isCritical = d.critical_shortages >= 2 || d.aggregate_gap > 300;
  const isWatch = d.aggregate_gap > 80;
  const isSurplus = d.aggregate_gap < -80;

  const badgeColor = isCritical ? '#dc2626' : isWatch ? '#ea580c' : isSurplus ? '#7c3aed' : '#059669';
  const label = d.aggregate_gap > 0 ? `+${d.aggregate_gap}` : `${d.aggregate_gap}`;

  const html = `
    <div class="relative inline-flex items-center group cursor-pointer transition-transform duration-150 hover:scale-110">
      <div class="flex items-center bg-white/95 text-slate-800 rounded-full px-2 py-0.5 shadow-md border ${
        isSelected ? 'border-teal-600 ring-2 ring-teal-500 scale-105' : 'border-slate-300'
      }">
        <span class="w-2.5 h-2.5 rounded-full mr-1.5 flex-shrink-0" style="background-color: ${badgeColor}"></span>
        <span class="font-extrabold text-[11px] text-slate-900 tracking-tight">${d.name.split(' ')[0]}</span>
        <span class="ml-1 text-[9px] font-bold px-1.5 py-0.2 rounded text-white font-mono" style="background-color: ${badgeColor}">${label}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-clean-district-marker',
    iconSize: [120, 26],
    iconAnchor: [60, 13]
  });
}

export const FullPageMapExplorer: React.FC<FullPageMapExplorerProps> = ({
  districts,
  rankings,
  recommendations,
  lang,
  onSelectWhy,
  onSelectSimulate,
  t
}) => {
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictSummary | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([22.5, 80.0]); // Centered on India
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [showFlows, setShowFlows] = useState<boolean>(true);
  const [mapStyle, setMapStyle] = useState<'liberty' | 'bright' | 'positron'>('liberty');
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState<boolean>(false);

  // Exact OpenFreeMap Vector Styles - 100% Free, NO API Key, NO Rate Limit!
  const openFreeMapStyles = {
    liberty: 'https://tiles.openfreemap.org/styles/liberty', // Shaded Relief Topography (matching user reference)
    bright: 'https://tiles.openfreemap.org/styles/bright',
    positron: 'https://tiles.openfreemap.org/styles/positron'
  };

  const handleDistrictClick = (d: DistrictSummary) => {
    setSelectedDistrict(d);
    setMapCenter([d.lat, d.lng]);
    setMapZoom(7);
    setIsMobilePanelOpen(true);
  };

  const resetView = () => {
    setSelectedDistrict(null);
    setMapCenter([22.5, 80.0]);
    setMapZoom(5);
  };

  // Filter rankings for selected district
  const districtRankings = selectedDistrict
    ? rankings.filter(r => r.district_lgd === selectedDistrict.lgd)
    : [];

  // District coordinates map for reallocation flow paths
  const districtCoordsMap = new Map<number, [number, number]>();
  districts.forEach(d => districtCoordsMap.set(d.lgd, [d.lat, d.lng]));

  return (
    <div className="relative w-full h-[calc(100vh-140px)] min-h-[550px] sm:min-h-[640px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100 flex flex-col">
      
      {/* 1. Official Top Information Banner */}
      <div className="w-full bg-slate-900 text-white px-3 sm:px-4 py-1.5 flex items-center justify-between text-[11px] z-10 flex-shrink-0">
        <div className="flex items-center space-x-2 truncate">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
          <span className="font-semibold text-emerald-300">
            {lang === 'en' ? 'OpenFreeMap Geospatial Intelligence Engine' : 'ओपनफ्रीमैप भू-स्थानिक आसूचना प्रणाली'}
          </span>
          <span className="hidden sm:inline text-slate-400 font-mono">
            · OpenMapTiles Vector Topography (Full Kashmir, Ladakh & Himalayas)
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-slate-300 flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="font-mono">Live Telemetry</span>
        </div>
      </div>

      {/* 2. Leaflet Map Container */}
      <div className="relative w-full flex-1 min-h-0">
        <MapContainer
          center={mapCenter}
          zoom={mapZoom}
          minZoom={4}
          maxZoom={18}
          className="w-full h-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <MapViewController center={mapCenter} zoom={mapZoom} />

          {/* Exact OpenFreeMap Vector Layer (User Reference) */}
          <OpenFreeMapLayer key={mapStyle} styleUrl={openFreeMapStyles[mapStyle]} />

          {/* Reallocation Min-Cost Flow Lines between districts */}
          {showFlows && recommendations.map((rec) => {
            const p1 = districtCoordsMap.get(rec.source_district_lgd);
            const p2 = districtCoordsMap.get(rec.target_district_lgd);
            if (!p1 || !p2) return null;

            return (
              <Polyline
                key={rec.id}
                positions={[p1, p2]}
                pathOptions={{
                  color: '#7c3aed',
                  weight: 2.5,
                  dashArray: '5, 8',
                  opacity: 0.85
                }}
              >
                <Popup>
                  <div className="p-2 text-xs">
                    <div className="font-bold text-slate-900">
                      {rec.source_district_name} → {rec.target_district_name}
                    </div>
                    <div className="text-[11px] text-purple-700 font-semibold mt-1">
                      Reallocating {rec.seats_to_shift} Seats ({rec.target_trade_name})
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Transit: {rec.distance_km} km · Capex Saved: ₹{rec.estimated_capex_savings_lakhs} Lakhs
                    </div>
                  </div>
                </Popup>
              </Polyline>
            );
          })}

          {/* Clean District Markers */}
          {districts.map((d) => (
            <Marker
              key={d.lgd}
              position={[d.lat, d.lng]}
              icon={createDistrictIcon(d, selectedDistrict?.lgd === d.lgd)}
              eventHandlers={{
                click: () => handleDistrictClick(d)
              }}
            >
              <Popup>
                <div className="p-2 text-xs min-w-[210px]">
                  <div className="flex justify-between items-start font-bold text-slate-900">
                    <span className="text-sm">{lang === 'hi' ? d.name_hi : d.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-100 px-1.5 py-0.2 rounded">
                      {d.state_code}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{d.profile}</p>
                  
                  <div className="mt-2.5 pt-2 border-t border-slate-100 space-y-1 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Net Labour Gap:</span>
                      <strong className={d.aggregate_gap > 0 ? 'text-red-600' : 'text-emerald-600'}>
                        {d.aggregate_gap > 0 ? `+${d.aggregate_gap} Deficit` : `${d.aggregate_gap} Balanced`}
                      </strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Power Surge:</span>
                      <strong className="text-amber-600 font-mono">+{d.signals.power_growth_pct}%</strong>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-slate-500">Freight E-Way:</span>
                      <strong className="text-blue-600 font-mono">+{d.signals.eway_bills_growth_pct}%</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDistrictClick(d)}
                    className="w-full mt-3 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs transition-colors shadow-2xs"
                  >
                    {lang === 'en' ? 'Open Zone Intelligence Panel' : 'ज़ोन आसूचना पैनल खोलें'}
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>

        {/* Loading Indicator for district markers & telemetry */}
        {districts.length === 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md px-4 py-2 rounded-full border border-emerald-300 shadow-md flex items-center space-x-2 text-xs font-semibold text-slate-700 animate-pulse">
            <div className="w-3.5 h-3.5 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
            <span>{lang === 'hi' ? 'ज़िला टेलीमेट्री एवं नोड्स लोड हो रहे हैं...' : 'Loading district telemetry nodes...'}</span>
          </div>
        )}

        {/* 3. Floating Desktop Left Intelligence Panel */}
        <div className={`hidden sm:block absolute top-4 left-4 z-20 w-80 lg:w-96 max-h-[calc(100%-32px)] overflow-y-auto bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 shadow-2xl p-5 transition-all duration-300 ${
          selectedDistrict ? 'ring-2 ring-teal-500' : ''
        }`}>
          {selectedDistrict ? (
            /* District Specific Zone Panel */
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {lang === 'en' ? 'District Zone Active' : 'सक्रिय ज़िला क्षेत्र'}
                    </span>
                  </div>
                  <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">
                    {lang === 'hi' ? selectedDistrict.name_hi : selectedDistrict.name}
                  </h3>
                  <span className="text-xs text-slate-500">
                    {selectedDistrict.state_code} · LGD {selectedDistrict.lgd}
                  </span>
                </div>

                <button
                  onClick={resetView}
                  className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  title="Return to National View"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                {selectedDistrict.profile}
              </p>

              {/* Leading Signals Status Grid */}
              <div>
                <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  {lang === 'en' ? 'Leading Economic Telemetry' : 'अग्रणी आर्थिक टेलीमेट्री'}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100">
                    <span className="text-[10px] text-amber-700 font-semibold flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-amber-500" />
                      <span>Power Load</span>
                    </span>
                    <div className="text-sm font-extrabold text-amber-900 mt-0.5">
                      +{selectedDistrict.signals.power_growth_pct}%
                    </div>
                  </div>

                  <div className="bg-blue-50/70 p-2.5 rounded-xl border border-blue-100">
                    <span className="text-[10px] text-blue-700 font-semibold flex items-center space-x-1">
                      <Truck className="w-3 h-3 text-blue-500" />
                      <span>Freight E-Way</span>
                    </span>
                    <div className="text-sm font-extrabold text-blue-900 mt-0.5">
                      +{selectedDistrict.signals.eway_bills_growth_pct}%
                    </div>
                  </div>

                  <div className="bg-purple-50/70 p-2.5 rounded-xl border border-purple-100">
                    <span className="text-[10px] text-purple-700 font-semibold flex items-center space-x-1">
                      <CreditCard className="w-3 h-3 text-purple-500" />
                      <span>MSME Credit</span>
                    </span>
                    <div className="text-sm font-extrabold text-purple-900 mt-0.5">
                      +{selectedDistrict.signals.msme_credit_growth_pct}%
                    </div>
                  </div>

                  <div className="bg-emerald-50/70 p-2.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] text-emerald-700 font-semibold flex items-center space-x-1">
                      <Briefcase className="w-3 h-3 text-emerald-500" />
                      <span>Job Postings</span>
                    </span>
                    <div className="text-sm font-extrabold text-emerald-900 mt-0.5">
                      {selectedDistrict.signals.online_postings_index} Idx
                    </div>
                  </div>
                </div>
              </div>

              {/* District Trade Deficit Breakdown */}
              <div>
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-700 uppercase tracking-wider mb-2">
                  <span>{lang === 'en' ? 'Critical Trades in Hub' : 'प्रमुख ट्रेड स्थिति'}</span>
                  <span className="text-slate-400 font-normal">Demand vs Supply</span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {districtRankings.map((tr) => (
                    <div key={tr.trade_id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span className="truncate max-w-[190px]">
                          {lang === 'hi' ? tr.trade_name_hi : tr.trade_name}
                        </span>
                        <span className={tr.net_gap > 0 ? 'text-red-600' : 'text-emerald-600'}>
                          {tr.net_gap > 0 ? `+${tr.net_gap}` : tr.net_gap}
                        </span>
                      </div>

                      <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                        <span>Demand: {tr.demand_p50}</span>
                        <span>Supply: {tr.effective_supply}</span>
                        <span className="font-semibold" style={{ color: tr.severity_color }}>
                          {tr.severity_label}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 mt-2 pt-1 border-t border-slate-200/60">
                        <button
                          onClick={() => onSelectWhy(tr)}
                          className="text-[10px] font-bold text-teal-700 hover:underline flex items-center space-x-0.5"
                        >
                          <HelpCircle className="w-3 h-3" />
                          <span>Why?</span>
                        </button>
                        <span>·</span>
                        <button
                          onClick={() => onSelectSimulate(tr)}
                          className="text-[10px] font-bold text-blue-700 hover:underline flex items-center space-x-0.5"
                        >
                          <Sliders className="w-3 h-3" />
                          <span>Simulate</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={resetView}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
              >
                {lang === 'en' ? '← Back to National View' : '← राष्ट्रीय विहंगावलोकन पर वापस जाएं'}
              </button>
            </div>
          ) : (
            /* National View Panel */
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {lang === 'en' ? 'Live Geospatial Intelligence' : 'सजीव स्थानिक आसूचना'}
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mt-1">
                  {lang === 'en' ? 'National Skilling Corridors' : 'राष्ट्रीय कौशल गलियारा'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                  {lang === 'en'
                    ? 'Click any district node across India to inspect local industrial electricity surge, freight e-way bills, and trade deficits.'
                    : 'स्थानीय औद्योगिक बिजली वृद्धि, ई-वे बिल और ट्रेड घाटे का निरीक्षण करने हेतु किसी भी ज़िला नोड पर क्लिक करें।'}
                </p>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-semibold block">Monitored Hubs</span>
                  <span className="text-base font-extrabold text-slate-800">12 Districts</span>
                </div>
                <div className="bg-red-50/80 p-2.5 rounded-xl border border-red-100">
                  <span className="text-[10px] text-red-600 font-semibold block">Critical Deficits</span>
                  <span className="text-base font-extrabold text-red-700">3 Mega-Clusters</span>
                </div>
              </div>

              {/* Active Reallocation Flow Summary */}
              <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200 text-xs">
                <div className="font-bold text-purple-900 flex items-center justify-between">
                  <span>12 Active Reallocation Flows</span>
                  <span className="text-[10px] bg-purple-200 text-purple-800 px-1.5 py-0.2 rounded font-mono">
                    Min-Cost
                  </span>
                </div>
                <p className="text-[11px] text-purple-800 mt-1 leading-relaxed">
                  Dashed purple lines show live seat transfers from surplus industrial areas to high-shortage hubs, saving ₹88.62L in new centre capital expense.
                </p>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 pt-2 border-t border-slate-100">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
                <span>OpenFreeMap Liberty Vector Engine (100% Free · No API Key).</span>
              </div>
            </div>
          )}
        </div>

        {/* 4. Floating Right Controls: Style Switcher & Reset */}
        <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20 flex flex-col space-y-2">
          {/* Reset View Button */}
          <button
            onClick={resetView}
            className="px-2.5 sm:px-3 py-1.5 sm:py-2 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all font-semibold text-xs flex items-center space-x-1.5"
            title="Reset to India View"
          >
            <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600" />
            <span className="hidden sm:inline">India View</span>
          </button>

          {/* Toggle Reallocation Flow Lines */}
          <button
            onClick={() => setShowFlows(prev => !prev)}
            className={`px-2.5 sm:px-3 py-1.5 sm:py-2 backdrop-blur-md rounded-xl border shadow-md transition-all text-xs font-semibold flex items-center space-x-1.5 ${
              showFlows
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Toggle Reallocation Flow Paths"
          >
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Flow Lines</span>
          </button>

          {/* OpenFreeMap Style Switcher */}
          <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-md p-1 flex flex-col space-y-1 text-[10px] font-bold">
            <button
              onClick={() => setMapStyle('liberty')}
              className={`px-2 py-1 rounded transition-colors text-left ${mapStyle === 'liberty' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Liberty Relief
            </button>
            <button
              onClick={() => setMapStyle('bright')}
              className={`px-2 py-1 rounded transition-colors text-left ${mapStyle === 'bright' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Bright Clean
            </button>
            <button
              onClick={() => setMapStyle('positron')}
              className={`px-2 py-1 rounded transition-colors text-left ${mapStyle === 'positron' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            >
              Positron Gray
            </button>
          </div>
        </div>

        {/* 5. Mobile Bottom Drawer / Sheet Trigger */}
        <div className="sm:hidden absolute bottom-3 inset-x-3 z-20">
          <button
            onClick={() => setIsMobilePanelOpen(prev => !prev)}
            className="w-full bg-white/95 backdrop-blur-md border border-slate-300 shadow-xl rounded-xl py-2 px-3 flex items-center justify-between text-xs font-bold text-slate-800"
          >
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse" />
              <span>
                {selectedDistrict
                  ? `${selectedDistrict.name} (${selectedDistrict.state_code})`
                  : (lang === 'en' ? 'Tap to view Hub Intelligence' : 'हब आसूचना देखें')}
              </span>
            </div>
            {isMobilePanelOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>

          {/* Mobile Slide-up Sheet */}
          {isMobilePanelOpen && (
            <div className="mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 max-h-[60vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
              {selectedDistrict ? (
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-sm">{selectedDistrict.name}</h4>
                      <span className="text-[11px] text-slate-500">{selectedDistrict.state_code} · Net Gap: {selectedDistrict.aggregate_gap}</span>
                    </div>
                    <button
                      onClick={() => setIsMobilePanelOpen(false)}
                      className="p-1 text-slate-400 hover:text-slate-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg">{selectedDistrict.profile}</p>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-amber-50 rounded-lg border border-amber-100">
                      <span className="text-[10px] text-amber-700">Power Surge</span>
                      <div className="font-bold text-amber-900">+{selectedDistrict.signals.power_growth_pct}%</div>
                    </div>
                    <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                      <span className="text-[10px] text-blue-700">Freight E-Way</span>
                      <div className="font-bold text-blue-900">+{selectedDistrict.signals.eway_bills_growth_pct}%</div>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Trades in Hub</span>
                    {districtRankings.slice(0, 3).map(tr => (
                      <div key={tr.trade_id} className="p-2 bg-slate-50 rounded-lg text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-slate-800 text-[11px]">{tr.trade_name}</div>
                          <div className="text-[10px] text-slate-400">Demand: {tr.demand_p50} · Supply: {tr.effective_supply}</div>
                        </div>
                        <button
                          onClick={() => {
                            onSelectWhy(tr);
                            setIsMobilePanelOpen(false);
                          }}
                          className="px-2 py-1 bg-teal-50 text-teal-700 rounded font-bold text-[10px]"
                        >
                          Why?
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-2 text-xs">
                  <div className="font-bold text-slate-800">National Geospatial Overview</div>
                  <p className="text-slate-500 text-[11px]">Tap any district bubble on the map to inspect leading telemetry signals and trade deficits.</p>
                  <div className="grid grid-cols-2 gap-2 text-center pt-1">
                    <div className="bg-slate-50 p-2 rounded-lg font-bold">12 Hubs</div>
                    <div className="bg-red-50 text-red-700 p-2 rounded-lg font-bold">3 Deficits</div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
