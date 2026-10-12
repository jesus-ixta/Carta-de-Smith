import React, { useState } from 'react';
import { ANATOMY_TOPICS, AnatomyTopic } from '../data/anatomyData';
import { SmithChart } from './SmithChart';
import { MathView } from './MathView';
import { Complex } from '../types/smith';
import { BookOpen, Compass, Ruler, HelpCircle, CheckCircle2, Sliders, Sparkles, Lightbulb } from 'lucide-react';

export const AnatomyModule: React.FC = () => {
  const [selectedTopicId, setSelectedTopicId] = useState<string>('normalization');
  const [demoR, setDemoR] = useState<number>(1.0);
  const [demoX, setDemoX] = useState<number>(0.0);
  const [z0Value, setZ0Value] = useState<number>(50);
  const [inputZLReal, setInputZLReal] = useState<number>(75);
  const [inputZLImag, setInputZLImag] = useState<number>(25);
  const [showCompassSim, setShowCompassSim] = useState<boolean>(true);
  const [showRulerSim, setShowRulerSim] = useState<boolean>(true);

  const activeTopic = ANATOMY_TOPICS.find((t) => t.id === selectedTopicId) || ANATOMY_TOPICS[0];

  // Calculated point for the interactive demonstration
  const interactivePoint: Complex = {
    r: selectedTopicId === 'normalization' ? inputZLReal / z0Value : demoR,
    i: selectedTopicId === 'normalization' ? inputZLImag / z0Value : demoX,
  };

  const handleSelectTopic = (topic: AnatomyTopic) => {
    setSelectedTopicId(topic.id);
    if (topic.id === 'normalization') {
      setInputZLReal(75);
      setInputZLImag(25);
      setZ0Value(50);
    } else if (topic.id === 'real_axis') {
      setDemoR(1.0);
      setDemoX(0.0);
    } else if (topic.id === 'resistance_circles') {
      setDemoR(1.0);
      setDemoX(0.0);
    } else if (topic.id === 'reactance_arcs') {
      setDemoR(1.0);
      setDemoX(1.0);
    } else if (topic.id === 'wavelength_scales') {
      setDemoR(0.6);
      setDemoX(0.8);
    } else if (topic.id === 'swr_circle') {
      setDemoR(2.0);
      setDemoX(1.0);
      setShowCompassSim(true);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Module Header Banner (Bright & Lively) */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              Módulo 1: Fundamentos Visuales
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Anatomía de la Carta de Smith para Principiantes
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
              Aprende a identificar visualmente cada círculo, eje y escala analógica para resolver problemas
              a mano con tu juego de geometría, regla milimétrica y compás.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-700 bg-blue-50/80 px-3.5 py-2 rounded-xl border border-blue-200/80 shrink-0 shadow-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            Asignatura: <strong className="text-blue-900">Teoría Electromagnética (ETF-1026)</strong>
          </div>
        </div>

        {/* 6 Interactive Topic Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 mt-5">
          {ANATOMY_TOPICS.map((topic) => {
            const isSelected = topic.id === selectedTopicId;
            return (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic)}
                className={`flex flex-col items-start p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-500/30'
                    : 'bg-slate-50/90 border-slate-200 text-slate-600 hover:bg-blue-50/60 hover:text-blue-900 hover:border-blue-200'
                }`}
              >
                <span className={`text-[10px] uppercase font-mono tracking-wider mb-0.5 ${isSelected ? 'text-blue-100 font-bold' : 'text-slate-400'}`}>
                  Tema {topic.number}
                </span>
                <span className="text-xs font-bold leading-tight line-clamp-1">{topic.shortName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Educational Content & Hands-On Controls (7 Cols) */}
        <div className="lg:col-span-6 xl:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-100 text-blue-700 text-xs font-mono font-bold shadow-xs">
                  {activeTopic.number}
                </span>
                {activeTopic.title}
              </h3>
            </div>

            {/* Topic Summary */}
            <p className="text-slate-700 text-sm leading-relaxed">{activeTopic.summary}</p>

            {/* Mathematical Formula Callout with KaTeX equation rendering */}
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/60 border border-blue-200/80 rounded-xl p-4 space-y-1.5 shadow-xs">
              <span className="text-[11px] font-mono uppercase tracking-wider text-blue-800 font-bold block flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                Fundamento Matemático Analítico:
              </span>
              <div className="py-2 px-3 bg-white rounded-lg border border-blue-200/60 overflow-x-auto text-center">
                <MathView math={activeTopic.mathematicalBasis} displayMode={true} className="text-slate-900 text-base" />
              </div>
            </div>

            {/* Manual Drafting Tip for Physical Paper */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3 shadow-xs">
              <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 shrink-0 mt-0.5 shadow-xs">
                <Compass className="w-4 h-4" />
              </div>
              <div className="leading-relaxed">
                <strong className="block text-emerald-950 text-sm font-bold mb-0.5">
                  Técnica de Trazado Manual con Compás y Regla:
                </strong>
                {activeTopic.manualDraftingTip}
              </div>
            </div>

            {/* Interactive Sandbox Controls tailored per topic */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4.5 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-blue-600" />
                  {activeTopic.interactiveControls.label}
                </span>
                <span className="text-[11px] text-blue-700 font-semibold bg-blue-100/60 px-2 py-0.5 rounded">
                  Prueba Interactiva
                </span>
              </div>
              <p className="text-xs text-slate-600">{activeTopic.interactiveControls.description}</p>

              {/* Specific controls for Topic 1: Normalization */}
              {activeTopic.id === 'normalization' && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">R_L (Resistencia Ω)</label>
                      <input
                        type="number"
                        value={inputZLReal}
                        onChange={(e) => setInputZLReal(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">X_L (Reactancia Ω)</label>
                      <input
                        type="number"
                        value={inputZLImag}
                        onChange={(e) => setInputZLImag(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-none shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-700 block mb-1">Z_0 (Línea Ω)</label>
                      <select
                        value={z0Value}
                        onChange={(e) => setZ0Value(Number(e.target.value))}
                        className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-slate-900 font-mono focus:border-blue-500 focus:outline-none shadow-xs"
                      >
                        <option value={50}>50 Ω (RF / Celular)</option>
                        <option value={75}>75 Ω (Video / CATV)</option>
                        <option value={300}>300 Ω (Bifilar)</option>
                      </select>
                    </div>
                  </div>
                  <div className="p-2.5 bg-white rounded-lg border border-blue-200 text-xs text-center">
                    <span className="text-slate-600 text-xs mr-2">Resultado Normalizado:</span>
                    <MathView
                      math={`z_L = \\frac{${inputZLReal} ${inputZLImag >= 0 ? '+' : '-'} j${Math.abs(inputZLImag)}}{${z0Value}} = ${(inputZLReal / z0Value).toFixed(2)} ${inputZLImag >= 0 ? '+' : '-'} j${Math.abs(inputZLImag / z0Value).toFixed(2)}`}
                      className="font-bold text-blue-900"
                    />
                  </div>
                </div>
              )}

              {/* Specific controls for Topic 2: Real Axis */}
              {activeTopic.id === 'real_axis' && (
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <button
                    onClick={() => { setDemoR(0); setDemoX(0); }}
                    className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-bold hover:bg-red-100 transition cursor-pointer shadow-xs"
                  >
                    1. Cortocircuito (z = 0)
                  </button>
                  <button
                    onClick={() => { setDemoR(1); setDemoX(0); }}
                    className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold hover:bg-emerald-100 transition cursor-pointer shadow-xs"
                  >
                    2. Centro (z = 1 + j0)
                  </button>
                  <button
                    onClick={() => { setDemoR(5); setDemoX(0); }}
                    className="p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-700 font-bold hover:bg-blue-100 transition cursor-pointer shadow-xs"
                  >
                    3. C. Abierto (z → ∞)
                  </button>
                </div>
              )}

              {/* Specific controls for Topic 3: Resistance Circles */}
              {activeTopic.id === 'resistance_circles' && (
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-700 font-medium">Resistencia Normalizada r:</span>
                    <span className="text-blue-700 font-bold text-sm">{demoR.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.2"
                    value={demoR}
                    onChange={(e) => setDemoR(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>r = 0 (Borde Exterior)</span>
                    <span>r = 1.0 (Pasa por el Centro)</span>
                    <span>r = 5.0 (Círculo Pequeño)</span>
                  </div>
                </div>
              )}

              {/* Specific controls for Topic 4: Reactance Arcs */}
              {activeTopic.id === 'reactance_arcs' && (
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-700 font-medium">Reactancia Normalizada x:</span>
                    <span className={demoX > 0 ? 'text-blue-700 font-bold' : demoX < 0 ? 'text-rose-700 font-bold' : 'text-slate-600 font-bold'}>
                      {demoX > 0 ? `+j${demoX.toFixed(1)} (Inductivo)` : demoX < 0 ? `-j${Math.abs(demoX).toFixed(1)} (Capacitivo)` : '0 (Resistivo Puro)'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="-4"
                    max="4"
                    step="0.2"
                    value={demoX}
                    onChange={(e) => setDemoX(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <div className="flex justify-between text-[11px] font-semibold">
                    <span className="text-rose-600">Capacitivo (-jx, Abajo)</span>
                    <span className="text-slate-500">Resistivo (Eje Central)</span>
                    <span className="text-blue-600">Inductivo (+jx, Arriba)</span>
                  </div>
                </div>
              )}

              {/* Specific controls for Topic 5: Wavelength Scales */}
              {activeTopic.id === 'wavelength_scales' && (
                <div className="space-y-2 pt-1">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-700 font-medium">Distancia d / λ hacia el generador (WTG):</span>
                    <span className="text-indigo-700 font-bold text-sm">{(demoR * 0.1).toFixed(3)} λ</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="4.9"
                    step="0.2"
                    value={demoR}
                    onChange={(e) => setDemoR(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                  <p className="text-[11px] text-slate-600 italic">
                    Observa cómo la regla gira en sentido de las manecillas del reloj al desplazarnos hacia el transmisor.
                  </p>
                </div>
              )}

              {/* Specific controls for Topic 6: SWR Circle */}
              {activeTopic.id === 'swr_circle' && (
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 font-semibold">Herramientas Visuales de Dibujo:</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowCompassSim(!showCompassSim)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer border transition ${
                          showCompassSim ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white text-slate-600 border-slate-300'
                        }`}
                      >
                        Compás: {showCompassSim ? 'Visible' : 'Oculto'}
                      </button>
                      <button
                        onClick={() => setShowRulerSim(!showRulerSim)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold cursor-pointer border transition ${
                          showRulerSim ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-white text-slate-600 border-slate-300'
                        }`}
                      >
                        Regla: {showRulerSim ? 'Visible' : 'Oculta'}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-700 font-medium">Radio del Compás (ROE seleccionada):</span>
                    <span className="text-rose-700 font-bold text-sm">{demoR.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="4.0"
                    step="0.2"
                    value={demoR}
                    onChange={(e) => setDemoR(Number(e.target.value))}
                    className="w-full accent-rose-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Pedagogical Q&A Accordion */}
            <div className="border-t border-slate-100 pt-3 space-y-2.5">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                Preguntas Típicas de Examen en el ITSC:
              </span>
              <div className="space-y-2">
                {activeTopic.practicalQuestions.map((qa, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-1 shadow-xs">
                    <p className="font-bold text-slate-900">❓ {qa.question}</p>
                    <p className="text-slate-600 pl-3.5 border-l-2 border-blue-400 leading-relaxed">💡 {qa.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: High-Precision Dynamic SVG Smith Chart (5 Cols) */}
        <div className="lg:col-span-6 xl:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center shadow-sm">
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-pulse"></span>
              Visualizador Dinámico de Coordenadas
            </span>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              Escala R = 1.0 (Unitario)
            </span>
          </div>

          <SmithChart
            pointZ={interactivePoint}
            showSwrCircle={activeTopic.id === 'swr_circle' || activeTopic.id === 'wavelength_scales'}
            showCompass={activeTopic.id === 'swr_circle' && showCompassSim}
            showRuler={activeTopic.id === 'real_axis' || activeTopic.id === 'wavelength_scales' || (activeTopic.id === 'swr_circle' && showRulerSim)}
            highlightCategory={activeTopic.svgHighlights.highlightType}
            activeResistanceFilter={activeTopic.id === 'resistance_circles' ? demoR : undefined}
            activeReactanceFilter={activeTopic.id === 'reactance_arcs' ? demoX : undefined}
            isInteractive={true}
            heightClass="h-[380px] sm:h-[420px]"
          />

          <div className="w-full mt-3.5 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between shadow-xs">
            <span>Puedes hacer clic sobre la carta para ubicar cualquier impedancia.</span>
            <span className="text-blue-700 font-mono text-[11px] font-bold">Trazado Vectorial</span>
          </div>
        </div>
      </div>
    </div>
  );
};
