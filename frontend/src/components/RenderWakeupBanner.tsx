import React from 'react';
import { Cloud, Server, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface RenderWakeupBannerProps {
  status: 'waking' | 'connecting' | 'connected' | 'idle';
  lang: Language;
  attempt?: number;
}

export const RenderWakeupBanner: React.FC<RenderWakeupBannerProps> = ({
  status,
  lang,
  attempt = 1
}) => {
  // If idle, don't show the banner
  if (status === 'idle') return null;

  const isConnected = status === 'connected';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`transition-all duration-500 overflow-hidden mb-6 rounded-2xl border p-4 sm:p-5 shadow-xs ${
        isConnected
          ? 'bg-emerald-50/90 border-emerald-300 text-emerald-900'
          : 'bg-[#f0fdf4] border-[#bbf7d0] text-slate-800'
      }`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left Section: Spinner & Text (Matches Reference Image) */}
        <div className="flex items-start sm:items-center space-x-3.5">
          {isConnected ? (
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 text-emerald-600">
              <CheckCircle2 className="w-6 h-6 animate-in zoom-in duration-300" />
            </div>
          ) : (
            <div className="relative flex-shrink-0 w-10 h-10 flex items-center justify-center">
              {/* Outer ring */}
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border-[3.5px] border-emerald-200 border-t-emerald-600 animate-spin" />
              {/* Center subtle dot */}
              <div className="absolute w-2 h-2 rounded-full bg-emerald-500 animate-ping opacity-75" />
            </div>
          )}

          <div>
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight flex items-center gap-2">
              {isConnected ? (
                <span>
                  {lang === 'hi' ? 'बैकएंड सफलतापूर्वक जुड़ गया!' : 'Backend connected! Ready.'}
                </span>
              ) : (
                <span>
                  {lang === 'hi' ? 'एप्लिकेशन शुरू हो रही है...' : 'Starting application...'}
                </span>
              )}
              {!isConnected && attempt > 1 && (
                <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {lang === 'hi' ? `प्रयास ${attempt}` : `Attempt ${attempt}`}
                </span>
              )}
            </h3>
            <p className="text-xs sm:text-[13px] text-slate-600 mt-1 leading-relaxed">
              {isConnected
                ? (lang === 'hi'
                    ? 'सभी मांग-आपूर्ति मॉडल एवं टेलीमेट्री डेटा लोड हो चुके हैं।'
                    : 'All telemetry signals, forecast models, and district data loaded.')
                : (lang === 'hi'
                    ? 'बैकएंड रेंडर (Render) पर स्लीप मोड में था और अब सक्रिय हो रहा है। इसमें कुछ सेकंड लग सकते हैं। कृपया प्रतीक्षा करें...'
                    : 'The backend was in sleep mode on Render and is now waking up. This may take a few seconds. Please wait...')}
            </p>
          </div>
        </div>

        {/* Right Section: Cloud -> Server Visual Connection Flow */}
        <div className="flex items-center self-end sm:self-center bg-white/70 backdrop-blur-xs px-4 py-2.5 rounded-xl border border-emerald-200/70 shadow-2xs space-x-3 text-xs">
          {/* Cloud Step */}
          <div className="flex flex-col items-center">
            <Cloud
              className={`w-5 h-5 transition-colors ${
                isConnected
                  ? 'text-emerald-600'
                  : 'text-emerald-600 animate-bounce'
              }`}
            />
            <span className="text-[10px] font-medium text-slate-500 mt-0.5 whitespace-nowrap">
              {lang === 'hi' ? 'सक्रिय हो रहा है...' : 'Waking up...'}
            </span>
          </div>

          {/* Arrow */}
          <ArrowRight className="w-4 h-4 text-emerald-400 flex-shrink-0" />

          {/* Server Step */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <Server
                className={`w-5 h-5 transition-colors ${
                  isConnected
                    ? 'text-emerald-600'
                    : 'text-slate-600 animate-pulse'
                }`}
              />
              {!isConnected && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              )}
            </div>
            <span className="text-[10px] font-semibold text-slate-600 mt-0.5 whitespace-nowrap">
              {isConnected
                ? (lang === 'hi' ? 'जुड़ गया' : 'Connected')
                : (lang === 'hi' ? 'जुड़ रहा है...' : 'Connecting...')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
