import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  Maximize2
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
    map.flyTo(center, zoom, { duration: 1.2 });
  }, [center, zoom, map]);
  return null;
}

// Create custom glowing Leaflet markers
function createDistrictIcon(d: DistrictSummary, isSelected: boolean) {
  const isCritical = d.critical_shortages >= 2 || d.aggregate_gap > 300;
  const isWatch = d.aggregate_gap > 80;
  const isSurplus = d.aggregate_gap < -80;

  const color = isCritical ? '#ef4444' : isWatch ? '#f97316' : isSurplus ? '#8b5cf6' : '#10b981';
  const label = d.aggregate_gap > 0 ? `+${d.aggregate_gap}` : `${d.aggregate_gap}`;

  const html = `
    <div class="relative flex items-center group cursor-pointer">
      ${isCritical ? `<span class="absolute -inset-1 rounded-full animate-ping opacity-50" style="background-color: ${color}"></span>` : ''}
      <div class="relative flex items-center px-2 py-1 rounded-full text-white font-extrabold text-[11px] shadow-lg border-2 ${
        isSelected ? 'border-slate-900 ring-2 ring-white scale-110' : 'border-white'
      }" style="background-color: ${color}">
        <span class="w-2 h-2 rounded-full bg-white mr-1.5 ${isCritical ? 'animate-pulse' : ''}"></span>
        <span>${d.name.split(' ')[0]}</span>
        <span class="ml-1 text-[9px] font-mono px-1 rounded bg-black/20">${label}</span>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-leaflet-district-marker',
    iconSize: [110, 30],
    iconAnchor: [55, 15]
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
  const [mapCenter, setMapCenter] = useState<[number, number]>([21.5, 79.5]); // Central India view
  const [mapZoom, setMapZoom] = useState<number>(5);
  const [showFlows, setShowFlows] = useState<boolean>(true);
  const [tileLayer, setTileLayer] = useState<'osm' | 'voyager' | 'dark'>('voyager');

  // Tile layer URLs
  const tileUrls = {
    voyager: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
  };

  const handleDistrictClick = (d: DistrictSummary) => {
    setSelectedDistrict(d);
    setMapCenter([d.lat, d.lng]);
    setMapZoom(8);
  };

  const resetView = () => {
    setSelectedDistrict(null);
    setMapCenter([21.5, 79.5]);
    setMapZoom(5);
  };

  // Filter rankings for the selected district
  const districtRankings = selectedDistrict
    ? rankings.filter(r => r.district_lgd === selectedDistrict.lgd)
    : [];

  // District coordinates map for reallocation flow paths
  const districtCoordsMap = new Map<number, [number, number]>();
  districts.forEach(d => districtCoordsMap.set(d.lgd, [d.lat, d.lng]));

  return (
    <div className="relative w-full h-[calc(100vh-145px)] min-h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-900">
      
      {/* 1. Leaflet Interactive Full-Page Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full z-0"
        zoomControl={false}
      >
        <MapViewController center={mapCenter} zoom={mapZoom} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url={tileUrls[tileLayer]}
          maxZoom={18}
        />

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
                color: '#8b5cf6',
                weight: 3,
                dashArray: '6, 8',
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

        {/* District Markers with Live Badges */}
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
              <div className="p-2 text-xs min-w-[200px]">
                <div className="flex justify-between items-start font-bold text-slate-900">
                  <span>{lang === 'hi' ? d.name_hi : d.name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{d.state_code}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{d.profile}</p>
                
                <div className="mt-2 pt-2 border-t border-slate-100 flex justify-between text-[11px]">
                  <span>Net Gap:</span>
                  <strong className={d.aggregate_gap > 0 ? 'text-red-600' : 'text-emerald-600'}>
                    {d.aggregate_gap > 0 ? `+${d.aggregate_gap} Deficit` : `${d.aggregate_gap} Balanced`}
                  </strong>
                </div>

                <div className="mt-1 flex justify-between text-[11px]">
                  <span>Power Surge:</span>
                  <strong className="text-amber-600 font-mono">+{d.signals.power_growth_pct}%</strong>
                </div>

                <button
                  onClick={() => handleDistrictClick(d)}
                  className="w-full mt-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded font-bold text-[10px]"
                >
                  {lang === 'en' ? 'Open Detailed Zone Panel' : 'विस्तृत ज़ोन पैनल खोलें'}
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* 2. Floating Left Intelligence Panel (matching Electricity Maps Zone Details Panel!) */}
      <div className={`absolute top-4 left-4 z-20 w-80 sm:w-96 max-h-[calc(100%-32px)] overflow-y-auto bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-2xl p-5 transition-all duration-300 ${
        selectedDistrict ? 'ring-2 ring-teal-500' : ''
      }`}>
        {selectedDistrict ? (
          /* District Specific Zone Panel */
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {lang === 'en' ? 'District Intelligence Zone' : 'ज़िला आसूचना क्षेत्र'}
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
                title="Close and return to National View"
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

              <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
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
              {lang === 'en' ? '← Back to National Overview' : '← राष्ट्रीय विहंगावलोकन पर वापस जाएं'}
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
                  ? 'Click any district node to inspect local industrial electricity surge, freight e-way bills, and trade deficits.'
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
                Dashed purple lines show live optimized seat transfers from surplus industrial areas to high-shortage hubs, saving ₹88.62L in new centre capital expense.
              </p>
            </div>

            <div className="text-[11px] text-slate-400 flex items-center space-x-1.5 pt-2 border-t border-slate-100">
              <Info className="w-3.5 h-3.5 text-teal-600 flex-shrink-0" />
              <span>Pan and zoom anywhere across India with OpenStreetMap tiles.</span>
            </div>
          </div>
        )}
      </div>

      {/* 3. Floating Right Controls: Basemap Selector & Reset */}
      <div className="absolute top-4 right-4 z-20 flex flex-col space-y-2">
        {/* Reset View Button */}
        <button
          onClick={resetView}
          className="p-2.5 bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all font-semibold text-xs flex items-center space-x-1.5"
          title="Reset to India View"
        >
          <Compass className="w-4 h-4 text-teal-600" />
          <span className="hidden sm:inline">India View</span>
        </button>

        {/* Toggle Reallocation Flow Lines */}
        <button
          onClick={() => setShowFlows(prev => !prev)}
          className={`p-2.5 backdrop-blur-md rounded-xl border shadow-lg transition-all text-xs font-semibold flex items-center space-x-1.5 ${
            showFlows
              ? 'bg-purple-600 text-white border-purple-600'
              : 'bg-white/95 text-slate-700 border-slate-200 hover:bg-slate-100'
          }`}
          title="Toggle Reallocation Flow Paths"
        >
          <ArrowRight className="w-4 h-4" />
          <span className="hidden sm:inline">Flow Lines</span>
        </button>

        {/* Basemap Tile Switcher */}
        <div className="bg-white/95 backdrop-blur-md rounded-xl border border-slate-200 shadow-lg p-1.5 flex flex-col space-y-1 text-[10px] font-bold">
          <button
            onClick={() => setTileLayer('voyager')}
            className={`px-2 py-1 rounded transition-colors text-left ${tileLayer === 'voyager' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Light Carto
          </button>
          <button
            onClick={() => setTileLayer('osm')}
            className={`px-2 py-1 rounded transition-colors text-left ${tileLayer === 'osm' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            OpenStreetMap
          </button>
          <button
            onClick={() => setTileLayer('dark')}
            className={`px-2 py-1 rounded transition-colors text-left ${tileLayer === 'dark' ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
          >
            Dark Mode
          </button>
        </div>
      </div>

    </div>
  );
};
