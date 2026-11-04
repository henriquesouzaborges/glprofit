import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Maximize2, 
  Minimize2, 
  Activity, 
  Calendar, 
  Clock, 
  Info,
  CheckCircle2,
  AlertTriangle,
  MessageSquare
} from 'lucide-react';

export interface MetricDataPoint {
  date: string;
  formattedDate: string;
  time?: string;
  period: string;
  studentName: string;
  value: number;
  secondaryValue?: number;
  secondaryLabel?: string;
  referenceZone?: string;
  notes?: string;
}

export interface IndividualMetricChartProps {
  id: string;
  title: string;
  subtitle: string;
  unit: string;
  color: string; // hex or tailwind class
  accentBg: string;
  dataPoints: MetricDataPoint[];
  minScale?: number;
  maxScale?: number;
  idealZone?: { min: number; max: number; label: string };
  dangerZone?: { min: number; max: number; label: string };
  isInverse?: boolean; // lower is better (e.g. pain, stress, fatigue)
  clinicalNotes?: string;
  chartType?: 'line' | 'bar';
  onToggleChartType?: () => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onNavigatePrevious?: () => void;
  onNavigateNext?: () => void;
  showNavigationControls?: boolean;
}

export const IndividualMetricChart: React.FC<IndividualMetricChartProps> = ({
  id,
  title,
  subtitle,
  unit,
  color,
  accentBg,
  dataPoints,
  minScale = 0,
  maxScale = 10,
  idealZone,
  dangerZone,
  isInverse = false,
  clinicalNotes,
  chartType = 'line',
  onToggleChartType,
  isExpanded,
  onToggleExpand,
  onNavigatePrevious,
  onNavigateNext,
  showNavigationControls = false
}) => {
  const [hoveredPoint, setHoveredPoint] = useState<MetricDataPoint | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Statistics across the selected data
  const values = dataPoints.map(p => p.value);
  const count = values.length;
  const latestPoint = count > 0 ? dataPoints[count - 1] : null;
  const firstPoint = count > 0 ? dataPoints[0] : null;

  const currentVal = latestPoint ? latestPoint.value : 0;
  const initialVal = firstPoint ? firstPoint.value : 0;
  
  const sum = values.reduce((a, b) => a + b, 0);
  const avg = count > 0 ? Number((sum / count).toFixed(1)) : 0;
  const maxVal = count > 0 ? Math.max(...values) : 0;
  const minVal = count > 0 ? Math.min(...values) : 0;

  // Evolution trend: diff between last and first
  const diff = currentVal - initialVal;
  const pctChange = initialVal !== 0 ? Math.round((diff / initialVal) * 100) : (diff > 0 ? 100 : 0);

  // Is evolution positive?
  // If isInverse is true (e.g. pain/stress), a decrease is positive.
  const isPositiveEvolution = isInverse ? diff < 0 : diff > 0;
  const isNeutralEvolution = diff === 0;

  // Calculate dynamic scale if not hardcoded
  const dynamicMin = minScale !== undefined ? minScale : Math.floor(minVal * 0.9);
  const dynamicMax = maxScale !== undefined ? maxScale : Math.ceil(maxVal * 1.1) || 10;
  const scaleRange = dynamicMax - dynamicMin || 1;

  // Dimensions for SVG calculations - Enlarged for individual view, calibrated for 2-per-row layout
  const svgWidth = isExpanded ? 1000 : 520;
  const svgHeight = isExpanded ? 280 : 165;
  const paddingX = isExpanded ? 45 : 24;
  const paddingY = isExpanded ? 30 : 18;

  const usableWidth = svgWidth - paddingX * 2;
  const usableHeight = svgHeight - paddingY * 2;

  // Map data points to SVG coordinates
  const svgPoints = dataPoints.map((dp, i) => {
    const x = count > 1 
      ? paddingX + (i / (count - 1)) * usableWidth 
      : svgWidth / 2;
    
    // Invert Y because SVG origin (0,0) is top-left
    const clampedValue = Math.max(dynamicMin, Math.min(dynamicMax, dp.value));
    const normalizedY = (clampedValue - dynamicMin) / scaleRange;
    const y = paddingY + usableHeight - normalizedY * usableHeight;

    return { x, y, dp, i };
  });

  // Polyline points string
  const polylinePoints = svgPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Polygon area points string (closing down to baseline)
  const polygonPoints = svgPoints.length > 0 
    ? `${svgPoints[0].x},${paddingY + usableHeight} ${polylinePoints} ${svgPoints[svgPoints.length - 1].x},${paddingY + usableHeight}`
    : '';

  return (
    <div 
      id={`chart-card-${id}`}
      className={`transition-all duration-300 border bg-white ${
        isExpanded 
          ? 'col-span-full shadow-2xl ring-4 ring-blue-600/25 border-blue-500 rounded-3xl p-6 sm:p-7 space-y-4 animate-in fade-in zoom-in-95' 
          : 'rounded-2xl shadow-2xs hover:shadow-md hover:border-slate-300 border-slate-200 p-4 space-y-3'
      }`}
    >
      {/* Chart Header Bar Simplificado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div 
            className="p-2 rounded-xl text-white font-bold shrink-0 shadow-2xs"
            style={{ backgroundColor: color }}
          >
            <Activity className="w-4 h-4" />
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                {title}
              </h4>
              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                {unit}
              </span>

              {/* Botão de recomendação ao lado do título com balão de comentário no hover */}
              <div className="relative inline-flex items-center group">
                <button
                  type="button"
                  className="p-1 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                  title="Ver recomendação fisiológica"
                  aria-label="Ver recomendação"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                </button>

                {/* Balão de comentário sobre a recomendação (formato de comentário flutuante) */}
                <div className="absolute left-0 top-full mt-2 hidden group-hover:block z-50 w-72 sm:w-80 p-3.5 rounded-2xl bg-slate-900 text-white text-xs shadow-2xl border border-slate-700 animate-in fade-in zoom-in-95 pointer-events-none">
                  {/* Seta indicadora do balão de comentário */}
                  <div className="absolute -top-1.5 left-3 w-3 h-3 bg-slate-900 border-l border-t border-slate-700 rotate-45" />
                  <div className="flex items-center gap-1.5 font-bold text-blue-400 pb-1.5 mb-1.5 border-b border-slate-800">
                    <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="text-xs">Recomendação do Indicador</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-normal">
                    {clinicalNotes || 'Acompanhe a curva deste dado ao longo do tempo para monitorar prontidão e adaptação às cargas.'}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-0.5">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Toolbar: APENAS o Botão de Ampliar / Reduzir Gráfico com as Duas Setas em Diagonal (nada escrito) */}
        <div className="flex items-center self-end sm:self-center">
          <button
            type="button"
            onClick={onToggleExpand}
            className={`p-2 rounded-xl transition-all cursor-pointer flex items-center justify-center ${
              isExpanded
                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-2xs'
                : 'bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 border border-slate-200'
            }`}
            title={isExpanded ? 'Reduzir gráfico' : 'Ampliar gráfico'}
            aria-label={isExpanded ? 'Reduzir gráfico' : 'Ampliar gráfico'}
          >
            {isExpanded ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Main Chart Area */}
      <div 
        className={`relative w-full rounded-2xl bg-slate-50/70 border border-slate-200 overflow-hidden select-none transition-all ${
          isExpanded ? 'h-[400px] sm:h-[460px] p-5 sm:p-7' : 'h-48 p-3'
        }`}
      >
        {dataPoints.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 p-4">
            <Calendar className="w-8 h-8 mb-2 opacity-50" />
            <p className="text-xs font-bold">Sem registros no intervalo selecionado</p>
            <p className="text-[10px] text-slate-500 mt-0.5">Tente ampliar o filtro de datas ou selecionar outro aluno.</p>
          </div>
        ) : chartType === 'line' ? (
          // ================= LINE CHART MODE =================
          <div className="relative w-full h-full flex flex-col justify-between">
            {/* Background Ideal / Danger Zones */}
            {dangerZone && (
              <div 
                className="absolute inset-x-3 pointer-events-none bg-rose-500/10 border-b border-rose-300 border-dashed z-0 flex items-center justify-end pr-2 text-[10px] font-bold text-rose-700"
                style={{
                  top: `${Math.max(0, 100 - ((dangerZone.max - dynamicMin) / scaleRange) * 100)}%`,
                  height: `${Math.min(100, ((dangerZone.max - dangerZone.min) / scaleRange) * 100)}%`
                }}
              >
                {dangerZone.label}
              </div>
            )}

            {idealZone && (
              <div 
                className="absolute inset-x-3 pointer-events-none bg-emerald-500/10 border-b border-emerald-300 border-dashed z-0 flex items-center justify-end pr-2 text-[10px] font-bold text-emerald-700"
                style={{
                  top: `${Math.max(0, 100 - ((idealZone.max - dynamicMin) / scaleRange) * 100)}%`,
                  height: `${Math.min(100, ((idealZone.max - idealZone.min) / scaleRange) * 100)}%`
                }}
              >
                {idealZone.label}
              </div>
            )}

            {/* SVG Canvas */}
            <svg 
              className="w-full h-full overflow-visible z-10" 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id={`grad-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={color} stopOpacity="0.02" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                const y = paddingY + usableHeight * (1 - ratio);
                const scaleVal = (dynamicMin + scaleRange * ratio).toFixed(dynamicMax > 20 ? 0 : 1);
                return (
                  <g key={idx}>
                    <line
                      x1={paddingX}
                      y1={y}
                      x2={svgWidth - paddingX}
                      y2={y}
                      stroke="#e2e8f0"
                      strokeWidth="0.8"
                      strokeDasharray="3 3"
                    />
                    {isExpanded && (
                      <text
                        x={paddingX - 6}
                        y={y + 3}
                        fontSize="9"
                        fill="#64748b"
                        textAnchor="end"
                        fontWeight="bold"
                      >
                        {scaleVal}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Area under curve */}
              {polygonPoints && (
                <polygon
                  points={polygonPoints}
                  fill={`url(#grad-${id})`}
                />
              )}

              {/* Polyline line curve */}
              <polyline
                fill="none"
                stroke={color}
                strokeWidth={isExpanded ? 3.5 : 2.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePoints}
              />

              {/* Individual Data Points */}
              {svgPoints.map((pt) => {
                const isHovered = hoveredIndex === pt.i;
                return (
                  <g 
                    key={pt.i}
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredPoint(pt.dp);
                      setHoveredIndex(pt.i);
                    }}
                    onMouseLeave={() => {
                      setHoveredPoint(null);
                      setHoveredIndex(null);
                    }}
                  >
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 8 : (isExpanded ? 5 : 4)}
                      fill={isHovered ? '#ffffff' : color}
                      stroke={isHovered ? color : '#ffffff'}
                      strokeWidth={isHovered ? 3 : 2}
                      className="transition-all duration-150"
                    />
                    
                    {/* Value label over dot */}
                    {(isExpanded || isHovered || pt.i === 0 || pt.i === count - 1) && (
                      <text
                        x={pt.x}
                        y={pt.y - (isHovered ? 12 : 8)}
                        fontSize={isExpanded ? '11' : '9'}
                        fontWeight="bold"
                        fill="#0f172a"
                        textAnchor="middle"
                        className="pointer-events-none select-none drop-shadow-xs"
                      >
                        {pt.dp.value}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* X-Axis Date Labels */}
            <div className="flex justify-between text-[10px] text-slate-500 font-bold pt-2 border-t border-slate-200 z-10 px-1">
              {dataPoints.map((dp, i) => {
                // In compact mode, show only a few to prevent overcrowding
                if (!isExpanded && count > 7 && i !== 0 && i !== count - 1 && i % Math.ceil(count / 5) !== 0) {
                  return null;
                }
                return (
                  <div key={i} className="text-center">
                    <span className="block font-mono text-[9px] sm:text-[10px]">
                      {dp.formattedDate}
                    </span>
                    {isExpanded && (
                      <span className="block text-[8px] text-slate-400 uppercase">
                        {dp.period}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          // ================= BAR CHART MODE =================
          <div className="w-full h-full flex flex-col justify-between">
            <div className="flex-1 flex items-end justify-between gap-1.5 sm:gap-3 px-1 pt-6 pb-2">
              {dataPoints.map((dp, i) => {
                const clamped = Math.max(dynamicMin, Math.min(dynamicMax, dp.value));
                const heightPercent = Math.max(8, Math.min(100, Math.round(((clamped - dynamicMin) / scaleRange) * 100)));
                const isHovered = hoveredIndex === i;

                return (
                  <div
                    key={i}
                    className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredPoint(dp);
                      setHoveredIndex(i);
                    }}
                    onMouseLeave={() => {
                      setHoveredPoint(null);
                      setHoveredIndex(null);
                    }}
                  >
                    {/* Floating Value */}
                    <span className={`text-[10px] font-mono font-bold mb-1 transition-all ${
                      isHovered ? 'text-blue-900 scale-125 font-black' : 'text-slate-700'
                    }`}>
                      {dp.value}
                    </span>

                    {/* Bar track and fill */}
                    <div className="w-full max-w-[48px] bg-slate-200/60 rounded-t-lg h-full flex items-end">
                      <div
                        className={`w-full rounded-t-lg transition-all duration-200 ${
                          isHovered ? 'brightness-110 shadow-md' : 'opacity-90'
                        }`}
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: color
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-Axis Date Labels */}
            <div className="flex justify-between text-[10px] text-slate-500 font-bold pt-2 border-t border-slate-200 px-1">
              {dataPoints.map((dp, i) => {
                if (!isExpanded && count > 7 && i !== 0 && i !== count - 1 && i % Math.ceil(count / 5) !== 0) {
                  return null;
                }
                return (
                  <div key={i} className="flex-1 text-center truncate">
                    <span className="block font-mono text-[9px] sm:text-[10px]">
                      {dp.formattedDate}
                    </span>
                    {isExpanded && (
                      <span className="block text-[8px] text-slate-400 uppercase">
                        {dp.period}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Hover Floating Tooltip */}
        {hoveredPoint && (
          <div className="absolute top-3 left-4 z-30 p-2.5 rounded-xl bg-slate-900/95 text-white text-xs shadow-xl backdrop-blur-xs border border-slate-700 animate-in fade-in duration-150">
            <div className="flex items-center gap-1.5 font-bold border-b border-slate-700 pb-1 mb-1">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{hoveredPoint.formattedDate} ({hoveredPoint.period.toUpperCase()})</span>
            </div>
            <div className="text-[11px] space-y-0.5">
              <div>Aluno: <strong className="text-white">{hoveredPoint.studentName}</strong></div>
              <div>{title}: <strong className="text-emerald-400 text-sm font-mono">{hoveredPoint.value} {unit}</strong></div>
              {hoveredPoint.secondaryValue !== undefined && (
                <div className="text-slate-300 text-[10px]">
                  {hoveredPoint.secondaryLabel || 'Complementar'}: <strong>{hoveredPoint.secondaryValue}</strong>
                </div>
              )}
              {hoveredPoint.notes && (
                <div className="text-[10px] text-slate-400 italic max-w-xs mt-1 border-t border-slate-800 pt-1">
                  "{hoveredPoint.notes}"
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
