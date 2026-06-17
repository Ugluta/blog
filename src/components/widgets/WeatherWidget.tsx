import { weatherData } from "@/lib/mockData";

export default function WeatherWidget() {
  const { city, temp, condition, emoji, humidity, wind, forecast } = weatherData;

  return (
    <div className="rounded-xl overflow-hidden border border-slate-700/50 weather-gradient">
      {/* Current Weather */}
      <div className="px-5 pt-5 pb-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-blue-300/70 font-inter mb-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {city}
            </div>
            <div className="flex items-start gap-2">
              <span className="text-5xl font-black text-white font-inter leading-none">{temp}°</span>
              <span className="text-2xl mt-1">{emoji}</span>
            </div>
            <div className="text-sm text-blue-200 font-inter mt-1">{condition}</div>
          </div>
          <div className="text-right space-y-2 mt-1">
            <div className="flex items-center justify-end gap-1.5 text-xs text-blue-200/80 font-inter">
              <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
              </svg>
              Nem: {humidity}%
            </div>
            <div className="flex items-center justify-end gap-1.5 text-xs text-blue-200/80 font-inter">
              <svg className="w-3.5 h-3.5 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Rüzgar: {wind} km/sa
            </div>
          </div>
        </div>
      </div>

      {/* Forecast */}
      <div className="border-t border-blue-900/50 px-4 py-3">
        <div className="grid grid-cols-5 gap-1">
          {forecast.map((day) => (
            <div key={day.day} className="text-center py-1">
              <div className="text-[10px] text-blue-300/70 font-inter mb-1">{day.day}</div>
              <div className="text-xl mb-1">{day.emoji}</div>
              <div className="text-xs font-bold text-white font-inter">{day.high}°</div>
              <div className="text-[10px] text-blue-300/60 font-inter">{day.low}°</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
