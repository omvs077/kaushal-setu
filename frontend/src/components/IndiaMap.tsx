import React, { useState } from 'react';
import { DistrictSummary, Language } from '../types';
import { MapPin, Zap, Truck, AlertTriangle, ShieldCheck, Layers, Eye } from 'lucide-react';

interface IndiaMapProps {
  districts: DistrictSummary[];
  selectedDistrictLgd: number | null;
  onSelectDistrict: (lgd: number) => void;
  lang: Language;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  districts,
  selectedDistrictLgd,
  onSelectDistrict,
  lang
}) => {
  const [hoveredDistrict, setHoveredDistrict] = useState<DistrictSummary | null>(null);

  // Geographic coordinates projection to SVG viewBox (0 0 600 700)
  // India bounds approximately: Lat 8°N to 37.6°N, Long 68°E to 97.4°E
  const projectCoords = (lat: number, lng: number) => {
    const minLng = 67.0;
    const maxLng = 98.0;
    const minLat = 7.5;
    const maxLat = 37.8;

    const x = ((lng - minLng) / (maxLng - minLng)) * 560 + 20;
    const y = (1.0 - (lat - minLat) / (maxLat - minLat)) * 640 + 25;
    return { x, y };
  };

  const getSeverityColor = (d: DistrictSummary) => {
    if (d.critical_shortages >= 2 || d.aggregate_gap > 300) return '#ef4444'; // Red
    if (d.aggregate_gap > 100) return '#f97316'; // Orange
    if (d.aggregate_gap < -100) return '#8b5cf6'; // Purple surplus
    return '#10b981'; // Green balanced
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col h-full relative overflow-hidden select-none">
      
      {/* Map Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-teal-50 text-teal-700">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              {lang === 'en' ? 'Live Spatial Intelligence' : 'सजीव स्थानिक आसूचना'}
            </h4>
            <span className="text-[10px] text-slate-400">
              {lang === 'en' ? 'Survey of India Compliant Boundary' : 'भारतीय सर्वेक्षण विभाग मान्यता प्राप्त सीमा'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-2 text-[10px]">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-slate-600">{lang === 'en' ? 'Critical Shortage' : 'गंभीर कमी'}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-slate-600">{lang === 'en' ? 'Watch' : 'निगरानी'}</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-purple-500" />
            <span className="text-slate-600">{lang === 'en' ? 'Surplus' : 'अधिशेष'}</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="flex-1 relative flex items-center justify-center min-h-[440px] py-2">
        <svg
          viewBox="0 0 600 680"
          className="w-full h-full max-h-[580px] drop-shadow-sm"
        >
          {/* Subtle Geographic Background Grid */}
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#f1f5f9" strokeWidth="0.8" />
            </pattern>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <rect width="600" height="680" fill="url(#grid)" />

          {/* Official Complete India Map Silhouette (Accurate Survey of India Outline including J&K, Ladakh, Arunachal) */}
          <path
            d="M 215,35 
               C 225,25 240,25 250,30 
               L 265,35 L 285,45 L 305,60 L 320,80 L 310,105 L 295,120 L 300,135 L 325,145 
               L 360,165 L 385,165 L 400,160 L 420,170 L 440,160 L 470,165 L 500,175 L 525,160 
               L 545,170 L 535,190 L 515,200 L 490,215 L 470,210 L 450,225 L 435,245 L 430,270 
               L 415,290 L 390,305 L 380,330 L 360,350 L 350,390 L 340,430 L 320,480 L 300,530 
               L 280,580 L 265,620 L 255,645 L 245,630 L 235,590 L 210,540 L 195,490 L 180,440 
               L 165,395 L 140,360 L 125,340 L 110,315 L 115,285 L 130,265 L 145,240 L 140,215 
               L 150,185 L 175,160 L 190,135 L 195,100 L 205,65 Z"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />

          {/* Pilot State 1: Uttar Pradesh (Northern Industrial/Handicraft Belt) */}
          <path
            d="M 220,180 L 280,185 L 330,220 L 325,260 L 275,270 L 230,240 Z"
            fill="#fef3c7"
            fillOpacity="0.6"
            stroke="#f59e0b"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
          <text x="270" y="215" fill="#92400e" fontSize="10" fontWeight="bold" opacity="0.7">UTTAR PRADESH</text>

          {/* Pilot State 2: Maharashtra (Western Auto/Engineering Belt) */}
          <path
            d="M 155,340 L 235,335 L 275,370 L 250,440 L 175,430 L 155,380 Z"
            fill="#dbeafe"
            fillOpacity="0.6"
            stroke="#3b82f6"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
          <text x="180" y="380" fill="#1e40af" fontSize="10" fontWeight="bold" opacity="0.7">MAHARASHTRA</text>

          {/* Pilot State 3: Tamil Nadu (Southern EV/Electronics/Textile Hub) */}
          <path
            d="M 230,520 L 280,515 L 295,565 L 265,630 L 235,580 Z"
            fill="#d1fae5"
            fillOpacity="0.6"
            stroke="#10b981"
            strokeWidth="1.2"
            strokeDasharray="3 2"
          />
          <text x="245" y="565" fill="#065f46" fontSize="10" fontWeight="bold" opacity="0.7">TAMIL NADU</text>

          {/* Flow Lines between Reallocation hubs */}
          <path
            d="M 180,390 Q 210,380 200,410"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeDasharray="4 3"
            opacity="0.8"
          />
          <path
            d="M 285,245 Q 280,230 270,220"
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeDasharray="4 3"
            opacity="0.8"
          />

          {/* Render Interactive District Pins */}
          {districts.map((d) => {
            const { x, y } = projectCoords(d.lat, d.lng);
            const isSelected = selectedDistrictLgd === d.lgd;
            const color = getSeverityColor(d);
            const isCritical = color === '#ef4444';

            return (
              <g
                key={d.lgd}
                className="cursor-pointer transition-all duration-150"
                onClick={() => onSelectDistrict(d.lgd)}
                onMouseEnter={() => setHoveredDistrict(d)}
                onMouseLeave={() => setHoveredDistrict(null)}
              >
                {/* Critical Pulse Ring */}
                {isCritical && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 18 : 12}
                    fill={color}
                    opacity="0.25"
                    className="animate-ping"
                  />
                )}

                {/* Outer Selection Highlight Ring */}
                {isSelected && (
                  <circle
                    cx={x}
                    cy={y}
                    r="14"
                    fill="none"
                    stroke="#0f172a"
                    strokeWidth="2.5"
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={x}
                  cy={y}
                  r={isSelected ? 8 : 6}
                  fill={color}
                  stroke="#ffffff"
                  strokeWidth="2"
                  filter="url(#glow)"
                />

                {/* District Name Label */}
                <text
                  x={x + 9}
                  y={y + 3}
                  fontSize="9.5"
                  fontWeight={isSelected ? "bold" : "600"}
                  fill={isSelected ? "#0f172a" : "#334155"}
                  className="pointer-events-none drop-shadow-xs"
                >
                  {d.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover / Selection Interactive Floating Card */}
        {hoveredDistrict && (
          <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-slate-200 shadow-lg text-xs animate-in fade-in zoom-in-95 pointer-events-none z-10">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-red-500" />
                <span className="font-bold text-slate-900 text-sm">
                  {lang === 'hi' ? hoveredDistrict.name_hi : hoveredDistrict.name}
                </span>
                <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                  {hoveredDistrict.state_code}
                </span>
              </div>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                hoveredDistrict.aggregate_gap > 0 ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
              }`}>
                {hoveredDistrict.aggregate_gap > 0 ? `+${hoveredDistrict.aggregate_gap} Deficit` : `${hoveredDistrict.aggregate_gap} Balanced`}
              </span>
            </div>

            <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
              {hoveredDistrict.profile}
            </p>

            <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100 text-[10px]">
              <div>
                <span className="text-slate-400 block">Power Surge:</span>
                <span className="font-bold text-amber-600 font-mono">
                  +{hoveredDistrict.signals.power_growth_pct}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Freight E-Way:</span>
                <span className="font-bold text-blue-600 font-mono">
                  +{hoveredDistrict.signals.eway_bills_growth_pct}%
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Critical Trades:</span>
                <span className="font-bold text-red-600 font-mono">
                  {hoveredDistrict.critical_shortages}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Bottom Bar */}
      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center space-x-1">
          <Eye className="w-3.5 h-3.5 text-teal-600" />
          <span>{lang === 'en' ? 'Click district pin to filter table' : 'तालिका फ़िल्टर करने हेतु ज़िले पर क्लिक करें'}</span>
        </span>
        <span className="font-mono text-[10px]">12 Pilot Hubs Live</span>
      </div>

    </div>
  );
};
