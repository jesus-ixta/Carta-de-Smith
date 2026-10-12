import React, { useState } from 'react';
import { SmithChart } from './SmithChart';
import { MathView } from './MathView';
import { Complex, SmithPoint } from '../types/smith';
import { computeSmithPoint, rotateTowardGenerator, formatComplex, formatPolarGamma } from '../utils/smithMath';
import { Wrench, Compass, Ruler, RefreshCw, Layers, Sparkles } from 'lucide-react';

export const FreeWorkbenchModule: React.FC = () => {
  const [realZ, setRealZ] = useState<number>(75);
  const [imagZ, setImagZ] = useState<number>(50);
  const [charZ0, setCharZ0] = useState<number>(50);
  const [lineLength, setLineLength] = useState<number>(0.125); // d / lambda
  const [showCompass, setShowCompass] = useState<boolean>(true);
  const [showRuler, setShowRuler] = useState<boolean>(true);
  const [showAdmittance, setShowAdmittance] = useState<boolean>(true);

  // Normalized impedance
  const normR = Math.max(0, realZ / charZ0);
  const normX = imagZ / charZ0;
  const loadPoint = computeSmithPoint(normR, normX);

  // Rotated input impedance point
  const inPoint = rotateTowardGenerator(loadPoint, lineLength);

  // Desnormalized Zin
  const inputZReal = inPoint.z.r * charZ0;
  const inputZImag = inPoint.z.i * charZ0;

  const handleChartPointChange = (newPoint: SmithPoint) => {
    setRealZ(Number((newPoint.z.r * charZ0).toFixed(1)));
    setImagZ(Number((newPoint.z.i * charZ0).toFixed(1)));
  };

  const handleResetMatch = () => {
    setRealZ(50);
    setImagZ(0);
    setCharZ0(50);
    setLineLength(0.0);
  };

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold mb-2">
            <Wrench className="w-3.5 h-3.5 text-blue-600" />
            Laboratorio Libre: Simulador de Trazos con Compás y Regla
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Banco de Pruebas Interactivo de la Carta de Smith
          </h2>
          <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
            Modifica cualquier valor de impedancia de carga Z_L o haz clic directamente sobre la Carta de Smith.
            Comprueba cómo se comporta el compás virtual, la regla y la rotación en líneas de transmisión.
          </p>
        </div>

        <button
          onClick={handleResetMatch}
          className="px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
          Restablecer a Acoplamiento (50 Ω)
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Inputs & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider font-mono border-b border-slate-100 pb-2.5">
              Parámetros de la Línea y Carga
            </h3>

            {/* Z_L Real & Imag Input */}
            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs text-slate-700 font-bold block mb-1">
                  Resistencia R_L (Ω):
                </label>
                <input
                  type="number"
                  min="0"
                  step="5"
                  value={realZ}
                  onChange={(e) => setRealZ(Math.max(0, Number(e.target.value)))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>
              <div>
                <label className="text-xs text-slate-700 font-bold block mb-1">
                  Reactancia X_L (Ω):
                </label>
                <input
                  type="number"
                  step="5"
                  value={imagZ}
                  onChange={(e) => setImagZ(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 font-mono font-bold focus:outline-none focus:border-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Characteristic Impedance Z0 */}
            <div>
              <label className="text-xs text-slate-700 font-bold block mb-1.5">
                Impedancia Característica Z_0 (Ω):
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[50, 75, 100].map((val) => (
                  <button
                    key={val}
                    onClick={() => setCharZ0(val)}
                    className={`py-2 rounded-xl border text-xs font-mono font-bold transition cursor-pointer ${
                      charZ0 === val
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {val} Ω
                  </button>
                ))}
              </div>
            </div>

            {/* Line Length Slider (d / lambda) */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-700 font-bold">Longitud de Línea (d / λ):</span>
                <span className="font-mono text-blue-700 font-bold text-sm">{lineLength.toFixed(3)} λ</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.5"
                step="0.005"
                value={lineLength}
                onChange={(e) => setLineLength(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>0.000 λ (Carga)</span>
                <span>0.250 λ (λ/4 Inversión)</span>
                <span>0.500 λ (360° Ciclo)</span>
              </div>
            </div>

            {/* Drafting Tools Toggles */}
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="text-xs text-slate-600 font-bold block">
                Herramientas de Dibujo Analógico:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setShowCompass(!showCompass)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer shadow-xs ${
                    showCompass
                      ? 'bg-amber-100 text-amber-900 border-amber-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <Compass className="w-4 h-4 text-amber-600" />
                  <span>Compás</span>
                </button>
                <button
                  onClick={() => setShowRuler(!showRuler)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer shadow-xs ${
                    showRuler
                      ? 'bg-blue-100 text-blue-900 border-blue-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <Ruler className="w-4 h-4 text-blue-600" />
                  <span>Regla</span>
                </button>
                <button
                  onClick={() => setShowAdmittance(!showAdmittance)}
                  className={`p-2.5 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition cursor-pointer shadow-xs ${
                    showAdmittance
                      ? 'bg-purple-100 text-purple-900 border-purple-300'
                      : 'bg-slate-50 text-slate-400 border-slate-200'
                  }`}
                >
                  <Layers className="w-4 h-4 text-purple-600" />
                  <span>Admitancia</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Analytics Panel */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3.5 font-mono text-xs shadow-sm">
            <h4 className="text-xs uppercase tracking-wider text-slate-600 font-extrabold border-b border-slate-100 pb-2">
              Resultados de la Transformación de RF
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block font-semibold">z_L Normalizada:</span>
                <span className="text-amber-800 font-bold text-sm">{formatComplex(loadPoint.z)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block font-semibold">ROE (SWR):</span>
                <span className="text-rose-700 font-bold text-sm">{loadPoint.swr.toFixed(2)} : 1</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block font-semibold">Coeficiente Γ:</span>
                <span className="text-blue-800 font-bold text-sm">{formatPolarGamma(loadPoint.gammaMag, loadPoint.gammaAngleDeg)}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block font-semibold">y_L (Admitancia):</span>
                <span className="text-purple-800 font-bold text-sm">{loadPoint.y ? formatComplex(loadPoint.y) : 'N/A'}</span>
              </div>
            </div>

            {/* Input Impedance at the Generator with MathView */}
            <div className="bg-gradient-to-r from-blue-50/80 to-slate-50 p-3.5 rounded-xl border border-blue-200 text-slate-800 space-y-1.5 shadow-xs">
              <span className="text-[10px] text-blue-900 font-sans block font-bold uppercase tracking-wider">
                Impedancia de Entrada Vista en el Generador Z_in (d = {lineLength.toFixed(3)}λ):
              </span>
              <div className="text-sm font-extrabold text-blue-950 font-mono">
                Z_in = {inputZReal.toFixed(2)} {inputZImag >= 0 ? '+' : '-'} j{Math.abs(inputZImag).toFixed(2)} Ω
              </div>
              <div className="text-[11px] text-slate-600 font-sans">
                Normalizada: <strong className="font-mono text-slate-900">z_in = {formatComplex(inPoint.z)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Precision Interactive Smith Chart (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col items-center shadow-sm">
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              Carta de Smith Vectorial en Tiempo Real
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              Haz clic o arrastra para mover z_L
            </span>
          </div>

          <SmithChart
            pointZ={loadPoint.z}
            pointY={showAdmittance ? loadPoint.y : undefined}
            pointZin={lineLength > 0.001 ? inPoint.z : undefined}
            showSwrCircle={true}
            showCompass={showCompass}
            showRuler={showRuler}
            showWtgScale={true}
            showAdmittanceLine={showAdmittance}
            rotationAngleDeg={lineLength > 0.001 ? -720 * lineLength : undefined}
            isInteractive={true}
            onPointChange={handleChartPointChange}
            heightClass="h-[440px] sm:h-[500px]"
          />
        </div>
      </div>
    </div>
  );
};
