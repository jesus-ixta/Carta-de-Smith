import React, { useMemo, useState } from 'react';
import { Complex, SmithPoint } from '../types/smith';
import {
  gammaToSvg,
  getResistanceCircle,
  getReactanceArc,
  formatComplex,
  formatPolarGamma,
  svgToGamma,
  gammaToImpedance,
  computeSmithPoint,
} from '../utils/smithMath';

interface SmithChartProps {
  pointZ?: Complex; // Normalized zL (r + jx)
  pointY?: Complex; // Normalized yL (g + jb)
  pointZin?: Complex; // Normalized zIn (r + jx)
  showSwrCircle?: boolean;
  showCompass?: boolean;
  showRuler?: boolean;
  showWtgScale?: boolean;
  showAdmittanceLine?: boolean;
  highlightCategory?: 'all' | 'normalization' | 'real_axis' | 'resistance_circles' | 'reactance_arcs' | 'wavelength_scales' | 'swr_circle' | 'g1_circle' | 'stub';
  activeResistanceFilter?: number;
  activeReactanceFilter?: number;
  rotationAngleDeg?: number;
  rotationLabel?: string;
  isInteractive?: boolean;
  onPointChange?: (point: SmithPoint) => void;
  heightClass?: string;
}

export const SmithChart: React.FC<SmithChartProps> = ({
  pointZ = { r: 1.0, i: 0.0 },
  pointY,
  pointZin,
  showSwrCircle = true,
  showCompass = false,
  showRuler = false,
  showWtgScale = true,
  showAdmittanceLine = false,
  highlightCategory = 'all',
  activeResistanceFilter,
  activeReactanceFilter,
  rotationAngleDeg,
  rotationLabel,
  isInteractive = false,
  onPointChange,
  heightClass = 'h-[460px] sm:h-[520px]',
}) => {
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; z: Complex; gamma: Complex } | null>(null);

  const CX = 280;
  const CY = 280;
  const R = 210;
  const R_WTG = 232;
  const R_DEG = 250;

  // Grid values
  const rValues = [0, 0.2, 0.5, 1.0, 2.0, 5.0];
  const xValues = [0.2, 0.5, 1.0, 2.0, 5.0, -0.2, -0.5, -1.0, -2.0, -5.0];

  // Compute metrics for main point z
  const smithPoint = useMemo(() => {
    return computeSmithPoint(pointZ.r, pointZ.i);
  }, [pointZ.r, pointZ.i]);

  const svgZ = useMemo(() => {
    return gammaToSvg(smithPoint.gamma.r, smithPoint.gamma.i, CX, CY, R);
  }, [smithPoint.gamma, CX, CY, R]);

  const svgY = useMemo(() => {
    if (!pointY) return null;
    const yPoint = computeSmithPoint(pointY.r, pointY.i);
    return gammaToSvg(yPoint.gamma.r, yPoint.gamma.i, CX, CY, R);
  }, [pointY, CX, CY, R]);

  const svgZin = useMemo(() => {
    if (!pointZin) return null;
    const inPoint = computeSmithPoint(pointZin.r, pointZin.i);
    return gammaToSvg(inPoint.gamma.r, inPoint.gamma.i, CX, CY, R);
  }, [pointZin, CX, CY, R]);

  const swrRadiusSvg = smithPoint.gammaMag * R;

  // Right axis intercept of SWR circle (where r = SWR)
  const swrRightInterceptSvg = {
    x: CX + swrRadiusSvg,
    y: CY,
  };

  // Outer scale markers for WTG (0 to 0.50 in steps of 0.025)
  const wtgMarkers = useMemo(() => {
    const markers = [];
    for (let w = 0; w < 0.5; w += 0.025) {
      const thetaDeg = 180 - w * 720;
      const thetaRad = (thetaDeg * Math.PI) / 180;
      const cos = Math.cos(thetaRad);
      const sin = Math.sin(thetaRad);

      const xInner = CX + cos * R;
      const yInner = CY - sin * R;
      const isMajor = Math.round(w * 100) % 5 === 0;
      const xOuter = CX + cos * (isMajor ? R_WTG : R_WTG - 5);
      const yOuter = CY - sin * (isMajor ? R_WTG : R_WTG - 5);
      const xText = CX + cos * (R_WTG + 9);
      const yText = CY - sin * (R_WTG + 9);

      markers.push({
        w,
        label: w.toFixed(3).replace(/^0/, ''),
        x1: xInner,
        y1: yInner,
        x2: xOuter,
        y2: yOuter,
        xText,
        yText,
        isMajor,
        angleDeg: thetaDeg,
      });
    }
    return markers;
  }, [CX, CY, R, R_WTG]);

  const handleSvgClickOrMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const svgX = ((e.clientX - rect.left) / rect.width) * 560;
    const svgY = ((e.clientY - rect.top) / rect.height) * 560;

    const gamma = svgToGamma(svgX, svgY, CX, CY, R);
    const z = gammaToImpedance(gamma.r, gamma.i);

    setHoverCoord({
      x: svgX,
      y: svgY,
      z,
      gamma,
    });

    if (isInteractive && onPointChange && (e.buttons === 1 || e.type === 'click')) {
      onPointChange(computeSmithPoint(z.r, z.i));
    }
  };

  return (
    <div className="relative w-full flex flex-col items-center select-none">
      <div className={`relative w-full ${heightClass} max-w-[560px] aspect-square`}>
        <svg
          viewBox="0 0 560 560"
          className="w-full h-full drop-shadow-lg cursor-crosshair overflow-visible rounded-full"
          onMouseMove={handleSvgClickOrMove}
          onMouseDown={handleSvgClickOrMove}
          onMouseLeave={() => setHoverCoord(null)}
          aria-label="Carta de Smith Interactiva"
        >
          <defs>
            {/* Lighter, crisp engineering paper background */}
            <radialGradient id="smithBgLight" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="80%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#f1f5f9" />
            </radialGradient>

            <filter id="glowLightCyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowLightAmber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glowLightEmerald" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>

            {/* Arrow marker for WTG direction */}
            <marker id="arrowWtgLight" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#0284c7" />
            </marker>
          </defs>

          {/* Outer Ring Paper & Border */}
          <circle cx={CX} cy={CY} r={R_DEG + 14} fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
          <circle cx={CX} cy={CY} r={R} fill="url(#smithBgLight)" />

          {/* Subtle Hemispheres Coloring in Anatomy Mode */}
          {highlightCategory === 'reactance_arcs' && (
            <>
              {/* Upper Inductive Hemisphere (Sky blue) */}
              <path
                d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY} Z`}
                fill="#38bdf8"
                fillOpacity="0.12"
              />
              {/* Lower Capacitive Hemisphere (Rose/Coral) */}
              <path
                d={`M ${CX - R} ${CY} A ${R} ${R} 0 0 0 ${CX + R} ${CY} Z`}
                fill="#fb7185"
                fillOpacity="0.12"
              />
            </>
          )}

          {/* Outer scale rings */}
          {showWtgScale && (
            <g className="wtg-scale">
              {/* Scale track circles */}
              <circle cx={CX} cy={CY} r={R_WTG} fill="none" stroke="#94a3b8" strokeWidth="1" />
              <circle cx={CX} cy={CY} r={R_DEG} fill="none" stroke="#cbd5e1" strokeWidth="1" />

              {/* Ticks and values */}
              {wtgMarkers.map((m, idx) => (
                <g key={idx}>
                  <line
                    x1={m.x1}
                    y1={m.y1}
                    x2={m.x2}
                    y2={m.y2}
                    stroke={m.isMajor ? '#475569' : '#94a3b8'}
                    strokeWidth={m.isMajor ? '1.5' : '1'}
                  />
                  {m.isMajor && (
                    <text
                      x={m.xText}
                      y={m.yText}
                      fill="#334155"
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="600"
                      textAnchor="middle"
                      dominantBaseline="central"
                    >
                      {m.label}
                    </text>
                  )}
                </g>
              ))}

              {/* WTG Clockwise Guide Arc */}
              <path
                d={`M ${CX - 150} ${CY - 165} A ${R_WTG + 14} ${R_WTG + 14} 0 0 1 ${CX + 150} ${CY - 165}`}
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                strokeDasharray="4 3"
                markerEnd="url(#arrowWtgLight)"
              />
              <text
                x={CX}
                y={CY - R_WTG - 14}
                fill="#0369a1"
                fontSize="9"
                fontWeight="bold"
                textAnchor="middle"
                className="tracking-wider uppercase"
              >
                Hacia el Generador (WTG) ↻
              </text>
            </g>
          )}

          {/* 1. Resistance Circles (Family of r) */}
          <g className="resistance-circles">
            {rValues.map((rVal) => {
              const circ = getResistanceCircle(rVal, CX, CY, R);
              const isFiltered = activeResistanceFilter !== undefined && activeResistanceFilter === rVal;
              const isHighlighted = highlightCategory === 'resistance_circles' || isFiltered;
              const isG1 = highlightCategory === 'g1_circle' && rVal === 1.0;

              return (
                <g key={`r-${rVal}`}>
                  <circle
                    cx={circ.cx}
                    cy={circ.cy}
                    r={circ.r}
                    fill="none"
                    stroke={
                      isG1
                        ? '#059669'
                        : isFiltered
                        ? '#0284c7'
                        : isHighlighted
                        ? '#0369a1'
                        : rVal === 1.0
                        ? '#64748b'
                        : '#94a3b8'
                    }
                    strokeWidth={isG1 ? '2.5' : isFiltered ? '2.5' : rVal === 1.0 ? '1.8' : '1.1'}
                    strokeDasharray={isG1 ? '4 2' : undefined}
                    filter={isG1 ? 'url(#glowLightEmerald)' : isFiltered ? 'url(#glowLightCyan)' : undefined}
                    opacity={rVal === 0 ? 0.95 : 0.85}
                  />
                  {/* Label on real axis */}
                  {rVal > 0 && rVal < 5 && (
                    <text
                      x={circ.cx - circ.r + 7}
                      y={CY - 4}
                      fill={isFiltered ? '#0284c7' : '#475569'}
                      fontSize="8"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {rVal}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* 2. Reactance Arcs (Family of x) */}
          <g className="reactance-arcs">
            {xValues.map((xVal) => {
              const arcPath = getReactanceArc(xVal, CX, CY, R);
              const isFiltered = activeReactanceFilter !== undefined && activeReactanceFilter === xVal;
              const isPositive = xVal > 0;
              const isHighlighted =
                highlightCategory === 'reactance_arcs' ||
                (highlightCategory === 'stub' && Math.abs(xVal) === 1.4) ||
                isFiltered;

              return (
                <path
                  key={`x-${xVal}`}
                  d={arcPath}
                  fill="none"
                  stroke={
                    isFiltered
                      ? isPositive ? '#0284c7' : '#e11d48'
                      : isHighlighted
                      ? isPositive ? '#0284c7' : '#be123c'
                      : isPositive
                      ? '#60a5fa'
                      : '#f43f5e'
                  }
                  strokeWidth={isFiltered ? '2.2' : isHighlighted ? '1.8' : '1.0'}
                  filter={isFiltered ? (isPositive ? 'url(#glowLightCyan)' : 'url(#glowLightAmber)') : undefined}
                  opacity={0.75}
                />
              );
            })}
          </g>

          {/* 3. Real Resistance Axis Line (x = 0) */}
          <line
            x1={CX - R}
            y1={CY}
            x2={CX + R}
            y2={CY}
            stroke={highlightCategory === 'real_axis' ? '#d97706' : '#334155'}
            strokeWidth={highlightCategory === 'real_axis' ? '3' : '1.8'}
          />

          {/* Notable Cardinal Points on Real Axis */}
          <g className="cardinal-points">
            {/* Short Circuit (Left: z = 0) */}
            <circle cx={CX - R} cy={CY} r="5" fill="#dc2626" stroke="#ffffff" strokeWidth="1.5" />
            <text x={CX - R + 14} y={CY + 14} fill="#dc2626" fontSize="8.5" fontWeight="bold">
              z=0 (C.C.)
            </text>

            {/* Open Circuit (Right: z = ∞) */}
            <circle cx={CX + R} cy={CY} r="5" fill="#2563eb" stroke="#ffffff" strokeWidth="1.5" />
            <text x={CX + R - 18} y={CY + 14} fill="#2563eb" fontSize="8.5" fontWeight="bold" textAnchor="end">
              z=∞ (C.A.)
            </text>

            {/* Center Matched Point (1 + j0) */}
            <circle
              cx={CX}
              cy={CY}
              r={highlightCategory === 'normalization' || highlightCategory === 'real_axis' ? '6' : '4.5'}
              fill="#059669"
              stroke="#ffffff"
              strokeWidth="1.5"
              filter="url(#glowLightEmerald)"
            />
            <text x={CX} y={CY - 9} fill="#047857" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              1.0 + j0.0 (Z₀)
            </text>
          </g>

          {/* 4. SWR Circle (ROE) */}
          {showSwrCircle && smithPoint.gammaMag > 0.01 && (
            <g className="swr-circle-group">
              <circle
                cx={CX}
                cy={CY}
                r={swrRadiusSvg}
                fill="none"
                stroke="#e11d48"
                strokeWidth="2.4"
                strokeDasharray="5 3"
              />

              {/* SWR Reading on the Right Real Axis */}
              <circle cx={swrRightInterceptSvg.x} cy={swrRightInterceptSvg.y} r="5" fill="#e11d48" stroke="#ffffff" strokeWidth="1.5" />
              <rect
                x={swrRightInterceptSvg.x + 6}
                y={swrRightInterceptSvg.y - 18}
                width="72"
                height="22"
                rx="4"
                fill="#ffffff"
                stroke="#e11d48"
                strokeWidth="1.5"
                className="drop-shadow-sm"
              />
              <text
                x={swrRightInterceptSvg.x + 42}
                y={swrRightInterceptSvg.y - 4}
                fill="#be123c"
                fontSize="9.5"
                fontWeight="bold"
                textAnchor="middle"
              >
                ROE = {smithPoint.swr.toFixed(2)}
              </text>
            </g>
          )}

          {/* 5. Virtual Drafting Compass Overlay */}
          {showCompass && smithPoint.gammaMag > 0.02 && (
            <g className="virtual-compass pointer-events-none">
              <circle cx={CX} cy={CY} r="6" fill="#475569" stroke="#94a3b8" strokeWidth="2" />
              <line x1={CX} y1={CY} x2={CX - 15} y2={CY - 60} stroke="#64748b" strokeWidth="4.5" strokeLinecap="round" />
              <line x1={CX - 15} y1={CY - 60} x2={svgZ.x} y2={svgZ.y} stroke="#475569" strokeWidth="4" strokeLinecap="round" />
              <circle cx={CX - 15} cy={CY - 60} r="7" fill="#334155" stroke="#f1f5f9" strokeWidth="2" />
              <circle cx={svgZ.x} cy={svgZ.y} r="3.5" fill="#e11d48" />
              <rect x={CX - 30} y={CY - 86} width="85" height="18" rx="3" fill="#ffffff" stroke="#64748b" strokeWidth="1" />
              <text x={CX + 12} y={CY - 74} fill="#1e293b" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                Compás de Dibujo
              </text>
            </g>
          )}

          {/* 6. Virtual Drafting Ruler Overlay */}
          {showRuler && (
            <g className="virtual-ruler pointer-events-none">
              <line
                x1={CX}
                y1={CY}
                x2={CX + Math.cos((smithPoint.gammaAngleDeg * Math.PI) / 180) * (R_WTG + 10)}
                y2={CY - Math.sin((smithPoint.gammaAngleDeg * Math.PI) / 180) * (R_WTG + 10)}
                stroke="#0284c7"
                strokeWidth="2.5"
                strokeDasharray="6 2"
              />
              <circle
                cx={CX + Math.cos((smithPoint.gammaAngleDeg * Math.PI) / 180) * (R_WTG + 10)}
                cy={CY - Math.sin((smithPoint.gammaAngleDeg * Math.PI) / 180) * (R_WTG + 10)}
                r="3.5"
                fill="#0284c7"
              />
              <rect
                x={CX + Math.cos((smithPoint.gammaAngleDeg * Math.PI) / 180) * (R_WTG + 24) - 25}
                y={CY - Math.sin((smithPoint.gammaAngleDeg * Math.PI) / 180) * (R_WTG + 24) - 9}
                width="50"
                height="18"
                rx="3"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="1"
              />
              <text
                x={CX + Math.cos((smithPoint.gammaAngleDeg * Math.PI) / 180) * (R_WTG + 24)}
                y={CY - Math.sin((smithPoint.gammaAngleDeg * Math.PI) / 180) * (R_WTG + 24) + 4}
                fill="#0369a1"
                fontSize="8.5"
                fontWeight="bold"
                textAnchor="middle"
              >
                θ = {smithPoint.gammaAngleDeg.toFixed(1)}°
              </text>
            </g>
          )}

          {/* 7. Admittance Diametric Line (180°) */}
          {(showAdmittanceLine || pointY) && svgY && (
            <g className="admittance-line">
              <line x1={svgZ.x} y1={svgZ.y} x2={svgY.x} y2={svgY.y} stroke="#7c3aed" strokeWidth="2" strokeDasharray="4 3" />
              <rect
                x={(svgZ.x + svgY.x) / 2 - 25}
                y={(svgZ.y + svgY.y) / 2 - 16}
                width="50"
                height="16"
                rx="3"
                fill="#ffffff"
                stroke="#7c3aed"
                strokeWidth="1"
              />
              <text x={(svgZ.x + svgY.x) / 2} y={(svgZ.y + svgY.y) / 2 - 4} fill="#6d28d9" fontSize="8.5" fontWeight="bold" textAnchor="middle">
                180° (λ/4)
              </text>
            </g>
          )}

          {/* 8. Point Zin */}
          {svgZin && pointZin && (
            <g className="point-zin-group">
              {rotationAngleDeg && (
                <path
                  d={`M ${svgZ.x} ${svgZ.y} A ${swrRadiusSvg} ${swrRadiusSvg} 0 0 1 ${svgZin.x} ${svgZin.y}`}
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="2.5"
                  strokeDasharray="3 3"
                />
              )}
              <circle cx={svgZin.x} cy={svgZin.y} r="6" fill="#0284c7" stroke="#ffffff" strokeWidth="2" />
              <rect
                x={svgZin.x + 8}
                y={svgZin.y - 24}
                width="105"
                height="22"
                rx="4"
                fill="#ffffff"
                stroke="#0284c7"
                strokeWidth="1.5"
                className="drop-shadow-sm"
              />
              <text x={svgZin.x + 60} y={svgZin.y - 9} fill="#0369a1" fontSize="9" fontWeight="bold" textAnchor="middle">
                z_in = {pointZin.r.toFixed(2)}{pointZin.i >= 0 ? '+' : ''}{pointZin.i.toFixed(2)}j
              </text>
            </g>
          )}

          {/* 9. Point Y */}
          {svgY && pointY && (
            <g className="point-y-group">
              <circle cx={svgY.x} cy={svgY.y} r="6" fill="#7c3aed" stroke="#ffffff" strokeWidth="2" />
              <rect
                x={svgY.x + 8}
                y={svgY.y - 22}
                width="100"
                height="20"
                rx="4"
                fill="#ffffff"
                stroke="#7c3aed"
                strokeWidth="1.5"
                className="drop-shadow-sm"
              />
              <text x={svgY.x + 58} y={svgY.y - 8} fill="#6d28d9" fontSize="9" fontWeight="bold" textAnchor="middle">
                y_L = {pointY.r.toFixed(2)}{pointY.i >= 0 ? '+' : ''}{pointY.i.toFixed(2)}j
              </text>
            </g>
          )}

          {/* 10. Main Point Z */}
          <g className="main-point-z">
            <circle cx={svgZ.x} cy={svgZ.y} r="10" fill="none" stroke="#d97706" strokeWidth="1.5" opacity="0.8" />
            <circle cx={svgZ.x} cy={svgZ.y} r="6" fill="#d97706" stroke="#ffffff" strokeWidth="2" />
            <rect
              x={svgZ.x + 8}
              y={svgZ.y - 25}
              width="110"
              height="22"
              rx="4"
              fill="#ffffff"
              stroke="#d97706"
              strokeWidth="1.5"
              className="drop-shadow-sm"
            />
            <text x={svgZ.x + 63} y={svgZ.y - 10} fill="#b45309" fontSize="9.5" fontWeight="bold" textAnchor="middle">
              z_L = {pointZ.r.toFixed(2)}{pointZ.i >= 0 ? '+' : ''}{pointZ.i.toFixed(2)}j
            </text>
          </g>

          {/* Mouse Hover Live Readout Tooltip on SVG */}
          {hoverCoord && (
            <g className="pointer-events-none">
              <circle cx={hoverCoord.x} cy={hoverCoord.y} r="3" fill="#0284c7" />
              <rect
                x={Math.min(hoverCoord.x + 10, 420)}
                y={Math.max(hoverCoord.y - 35, 15)}
                width="130"
                height="32"
                rx="4"
                fill="#1e293b"
                fillOpacity="0.95"
                stroke="#64748b"
                strokeWidth="1"
                className="drop-shadow-md"
              />
              <text
                x={Math.min(hoverCoord.x + 75, 485)}
                y={Math.max(hoverCoord.y - 21, 29)}
                fill="#ffffff"
                fontSize="9"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                z = {hoverCoord.z.r.toFixed(2)} {hoverCoord.z.i >= 0 ? '+' : '-'} j{Math.abs(hoverCoord.z.i).toFixed(2)}
              </text>
              <text
                x={Math.min(hoverCoord.x + 75, 485)}
                y={Math.max(hoverCoord.y - 9, 41)}
                fill="#38bdf8"
                fontSize="8.5"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                |Γ|={Math.sqrt(hoverCoord.gamma.r ** 2 + hoverCoord.gamma.i ** 2).toFixed(2)}
              </text>
            </g>
          )}
        </svg>
      </div>

      {/* Live Coordinate Badges below the Chart (Bright, Crisp Card Badges) */}
      <div className="w-full max-w-[560px] grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3.5 text-xs font-mono">
        <div className="bg-white border border-amber-200/90 shadow-sm rounded-lg px-3 py-2 flex flex-col">
          <span className="text-[10px] text-amber-700 font-sans uppercase font-bold tracking-wider">Impedancia z_L</span>
          <span className="text-amber-900 font-bold text-sm">{formatComplex(smithPoint.z)}</span>
        </div>
        <div className="bg-white border border-sky-200/90 shadow-sm rounded-lg px-3 py-2 flex flex-col">
          <span className="text-[10px] text-sky-700 font-sans uppercase font-bold tracking-wider">Coeficiente Γ</span>
          <span className="text-sky-900 font-bold text-sm">{formatPolarGamma(smithPoint.gammaMag, smithPoint.gammaAngleDeg)}</span>
        </div>
        <div className="bg-white border border-rose-200/90 shadow-sm rounded-lg px-3 py-2 flex flex-col">
          <span className="text-[10px] text-rose-700 font-sans uppercase font-bold tracking-wider">ROE (SWR)</span>
          <span className={`font-bold text-sm ${smithPoint.swr <= 1.5 ? 'text-emerald-700' : smithPoint.swr <= 3.0 ? 'text-amber-700' : 'text-rose-700'}`}>
            {smithPoint.swr.toFixed(2)} : 1
          </span>
        </div>
        <div className="bg-white border border-indigo-200/90 shadow-sm rounded-lg px-3 py-2 flex flex-col">
          <span className="text-[10px] text-indigo-700 font-sans uppercase font-bold tracking-wider">Escala WTG</span>
          <span className="text-indigo-900 font-bold text-sm">{smithPoint.wtgLambda?.toFixed(3)} λ</span>
        </div>
      </div>
    </div>
  );
};
