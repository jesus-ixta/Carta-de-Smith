import React, { useState } from 'react';
import { PROBLEMS_DATA } from '../data/problemsData';
import { ProblemItem } from '../types/smith';
import { SmithChart } from './SmithChart';
import { MathView } from './MathView';
import {
  FolderGit2,
  ChevronLeft,
  ChevronRight,
  Compass,
  Ruler,
  Calculator,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  Radio,
  FileCheck2,
  Sparkles,
} from 'lucide-react';

export const ProblemBankModule: React.FC = () => {
  const [selectedProblemId, setSelectedProblemId] = useState<number>(1);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('Todos');

  const problem: ProblemItem =
    PROBLEMS_DATA.find((p) => p.id === selectedProblemId) || PROBLEMS_DATA[0];

  const currentStep = problem.steps[currentStepIndex] || problem.steps[0];

  const handleSelectProblem = (id: number) => {
    setSelectedProblemId(id);
    setCurrentStepIndex(0);
    setSelectedQuizAnswer(null);
    setQuizSubmitted(false);
  };

  const categories = ['Todos', 'Básico', 'Longitud de Línea', 'Transformador', 'Admitancia', 'Stub Simple', 'Diagnóstico'];

  const filteredProblems = categoryFilter === 'Todos'
    ? PROBLEMS_DATA
    : PROBLEMS_DATA.filter((p) => p.category === categoryFilter);

  const focus = currentStep.smithVisualFocus;

  return (
    <div className="w-full space-y-6">
      {/* Header and Problem Selector */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold mb-2">
              <FolderGit2 className="w-3.5 h-3.5 text-amber-600" />
              Módulo 2: Casos Prácticos de Ingeniería
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Banco de 10 Problemas Guiados Paso a Paso
            </h2>
            <p className="text-slate-600 text-sm mt-1 max-w-2xl leading-relaxed">
              Selecciona cualquiera de los 10 ejercicios reales de la industria de telecomunicaciones y RF.
              Sigue las instrucciones exactas de compás y regla para trazarlos a mano en tu propia Carta de Smith impresa.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer border ${
                  categoryFilter === cat
                    ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 10 Problem Quick Selection Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 pt-2">
          {filteredProblems.map((p) => {
            const isSelected = p.id === selectedProblemId;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectProblem(p.id)}
                className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-blue-600 border-blue-600 text-white font-bold shadow-md shadow-blue-500/20 ring-2 ring-blue-400/40'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-blue-50 hover:text-blue-900 hover:border-blue-200'
                }`}
              >
                <span className={`text-[10px] uppercase font-mono mb-0.5 ${isSelected ? 'text-blue-100' : 'text-slate-400 font-bold'}`}>
                  P-{p.id}
                </span>
                <span className="text-xs truncate w-full" title={p.title}>
                  {p.title.split(':')[1]?.trim() || p.title}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Interactive Stage for the Selected Problem */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Engineering Context & Step Instructions (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Engineering Context Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {problem.category}
              </span>
              <span className="text-xs text-slate-600 font-mono font-bold bg-slate-100 px-2.5 py-1 rounded-lg">
                Z₀ = {problem.parameters.z0} Ω
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900">{problem.title}</h3>

            <div className="bg-gradient-to-r from-blue-50/70 to-slate-50 border border-blue-200/80 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Radio className="w-4 h-4 text-blue-600" />
                Caso Hipotético de Ingeniería en Telecomunicaciones:
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                {problem.engineeringContext}
              </p>
            </div>

            {/* Input Data Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono pt-1">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block font-semibold">Impedancia de Carga:</span>
                <span className="text-amber-800 font-bold">{problem.parameters.zL}</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-[10px] text-slate-500 font-sans block font-semibold">Línea Principal:</span>
                <span className="text-blue-800 font-bold">{problem.parameters.z0} Ω</span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 font-sans block font-semibold">Frecuencia / Parámetro:</span>
                <span className="text-emerald-800 font-bold">{problem.parameters.frequency || 'Línea d/λ'}</span>
              </div>
            </div>
          </div>

          {/* Step by Step Manual Drafting Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold font-mono flex items-center justify-center shadow-xs">
                  {currentStep.stepNumber}
                </span>
                <h4 className="font-bold text-slate-900 text-base">{currentStep.title}</h4>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                Paso {currentStepIndex + 1} de {problem.steps.length}
              </span>
            </div>

            {/* Compass Instruction Block */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                <Compass className="w-4 h-4 text-amber-600" />
                Cómo Usar el Compás en tu Hoja Impresa:
              </div>
              <p className="text-xs text-slate-700 leading-relaxed pl-6">
                {currentStep.compassInstruction}
              </p>
            </div>

            {/* Ruler Instruction Block */}
            <div className="bg-sky-50 border border-sky-200 rounded-xl p-4 space-y-1.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-sky-900">
                <Ruler className="w-4 h-4 text-sky-600" />
                Cómo Usar la Regla Milimétrica:
              </div>
              <p className="text-xs text-slate-700 leading-relaxed pl-6">
                {currentStep.rulerInstruction}
              </p>
            </div>

            {/* Analytical Formula Verification with KaTeX Equation Renderer */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                <Calculator className="w-4 h-4 text-blue-600" />
                Fórmula Analítica de Comprobación:
              </div>
              <div className="bg-white p-3 rounded-lg border border-slate-200 overflow-x-auto text-center">
                <MathView math={currentStep.analyticalFormula} displayMode={true} className="text-slate-900 text-sm font-semibold" />
              </div>
              <div className="text-xs text-slate-600 flex items-center justify-between pt-1">
                <span className="font-medium">Resultado esperado en papel:</span>
                <span className="font-mono text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                  {currentStep.expectedValue}
                </span>
              </div>
            </div>

            {/* Key Pedagogical Insight */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 text-xs text-slate-800 flex items-start gap-2.5 shadow-xs">
              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-amber-900 font-bold">Consejo de Trazado: </strong>
                {currentStep.keyInsight}
              </div>
            </div>

            {/* Step Navigation Buttons */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <button
                disabled={currentStepIndex === 0}
                onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <ChevronLeft className="w-4 h-4" />
                Paso Anterior
              </button>

              {/* Progress step dots */}
              <div className="flex gap-2">
                {problem.steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentStepIndex(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${
                      idx === currentStepIndex ? 'bg-amber-500 w-6' : 'bg-slate-200 hover:bg-slate-300 w-2.5'
                    }`}
                  />
                ))}
              </div>

              <button
                disabled={currentStepIndex === problem.steps.length - 1}
                onClick={() => setCurrentStepIndex((prev) => Math.min(problem.steps.length - 1, prev + 1))}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-blue-500/20"
              >
                Siguiente Paso
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Check Question on the Problem */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3.5 shadow-sm">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              Verificación Rápida de Comprensión:
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {problem.quizCheckQuestion.question}
            </p>

            <div className="space-y-2">
              {problem.quizCheckQuestion.options.map((opt, oIdx) => {
                const isSelected = selectedQuizAnswer === oIdx;
                const isCorrect = oIdx === problem.quizCheckQuestion.correctIndex;

                let btnClass = 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100';
                if (quizSubmitted) {
                  if (isCorrect) {
                    btnClass = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold';
                  } else if (isSelected) {
                    btnClass = 'bg-rose-50 border-rose-500 text-rose-900 font-medium';
                  }
                } else if (isSelected) {
                  btnClass = 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500';
                }

                return (
                  <button
                    key={oIdx}
                    onClick={() => {
                      if (!quizSubmitted) setSelectedQuizAnswer(oIdx);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between cursor-pointer shadow-xs ${btnClass}`}
                  >
                    <span>{opt}</span>
                    {quizSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <button
                disabled={selectedQuizAnswer === null}
                onClick={() => setQuizSubmitted(true)}
                className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-xs font-bold text-white transition-all cursor-pointer shadow-sm shadow-blue-500/20"
              >
                Comprobar Respuesta
              </button>
            ) : (
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs space-y-1 shadow-xs">
                <span className="font-bold text-blue-900 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  Explicación Pedagógica del Docente:
                </span>
                <p className="text-slate-700 leading-relaxed">{problem.quizCheckQuestion.explanation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: High-Precision Smith Chart with Problem Toggles (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 flex flex-col items-center shadow-sm">
          <div className="w-full flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              Trazado Vectorial: Problema #{problem.id}
            </span>
            <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
              ROE = {problem.computed.swr.toFixed(2)}
            </span>
          </div>

          <SmithChart
            pointZ={problem.computed.zL_norm}
            pointY={problem.computed.yL_norm}
            pointZin={problem.computed.zIn_norm}
            showSwrCircle={focus.highlightSwrCircle ?? true}
            showCompass={focus.highlightCompass ?? false}
            showRuler={focus.highlightRuler ?? false}
            showWtgScale={focus.highlightWtgScale ?? true}
            showAdmittanceLine={focus.highlightPointY ?? false}
            rotationAngleDeg={focus.rotationAngleDeg}
            rotationLabel={focus.rotationLabel}
            heightClass="h-[380px] sm:h-[440px]"
          />

          {/* Problem Analytical Summary Box */}
          <div className="w-full mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2.5 text-xs shadow-xs">
            <div className="text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold border-b border-slate-200 pb-1.5 flex items-center gap-1.5">
              <FileCheck2 className="w-4 h-4 text-blue-600" />
              Parámetros Clave Resueltos en la Carta:
            </div>
            <div className="grid grid-cols-2 gap-2.5 font-mono text-[11px]">
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-sans text-[10px]">z_L Normalizada:</span>
                <span className="text-amber-800 font-bold">
                  {problem.computed.zL_norm.r.toFixed(2)}{problem.computed.zL_norm.i >= 0 ? '+' : ''}{problem.computed.zL_norm.i.toFixed(2)}j
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-sans text-[10px]">ROE (SWR):</span>
                <span className="text-rose-700 font-bold">{problem.computed.swr.toFixed(2)} : 1</span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-sans text-[10px]">Coeficiente |Γ|:</span>
                <span className="text-blue-800 font-bold">
                  {problem.computed.gammaMag.toFixed(3)} ∠ {problem.computed.gammaAngleDeg.toFixed(1)}°
                </span>
              </div>
              <div className="bg-white p-2 rounded-lg border border-slate-200">
                <span className="text-slate-500 block font-sans text-[10px]">Return Loss:</span>
                <span className="text-emerald-800 font-bold">
                  {problem.computed.returnLossDb ? `${problem.computed.returnLossDb.toFixed(2)} dB` : 'N/A'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
