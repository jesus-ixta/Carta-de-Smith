import React, { useState } from 'react';
import { AnatomyModule } from './components/AnatomyModule';
import { ProblemBankModule } from './components/ProblemBankModule';
import { SocraticEvaluationModule } from './components/SocraticEvaluationModule';
import { FreeWorkbenchModule } from './components/FreeWorkbenchModule';
import {
  Compass,
  BookOpen,
  FolderGit2,
  GraduationCap,
  Wrench,
  Radio,
  FileText,
  HelpCircle,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'anatomy' | 'problems' | 'socratic' | 'workbench'>('anatomy');
  const [showGuideModal, setShowGuideModal] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Top Institutional Header Bar (Lively & Crisp) */}
      <header className="w-full bg-white border-b border-slate-200/90 sticky top-0 z-40 shadow-xs backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
            {/* Institution Brand */}
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white font-black shadow-md shadow-blue-500/25 shrink-0">
                <Compass className="w-6 h-6 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-blue-700 font-extrabold">
                    TecNM • ITSC Comalcalco
                  </span>
                  <span className="text-[10px] bg-blue-50 px-2 py-0.5 rounded-full text-blue-800 font-bold border border-blue-200">
                    Clave: ETF-1026
                  </span>
                </div>
                <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                  Carta de Smith Interactiva • Teoría Electromagnética
                </h1>
                <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  División de Ingeniería Electrónica • Unidad 2: Subtemas 2.3 Carta de Smith y 2.4 Acoplamiento
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2.5 self-end md:self-auto">
              <button
                onClick={() => setShowGuideModal(true)}
                className="px-3.5 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100/80 text-xs font-bold text-blue-800 flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              >
                <HelpCircle className="w-3.5 h-3.5 text-amber-500" />
                Guía de Trazado a Mano
              </button>
            </div>
          </div>

          {/* Main Navigation Tabs */}
          <nav className="flex items-center space-x-1.5 sm:space-x-2 mt-3 pt-2.5 border-t border-slate-100 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('anatomy')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
                activeTab === 'anatomy'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              1. Fundamentos Visuales (Anatomía)
            </button>

            <button
              onClick={() => setActiveTab('problems')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
                activeTab === 'problems'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              2. Banco de 10 Problemas Guiados
            </button>

            <button
              onClick={() => setActiveTab('socratic')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
                activeTab === 'socratic'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              3. Tutor Socrático y Constancia ITSC
            </button>

            <button
              onClick={() => setActiveTab('workbench')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer shrink-0 ${
                activeTab === 'workbench'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Laboratorio Libre (Compás y Regla)
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-7">
        {activeTab === 'anatomy' && <AnatomyModule />}
        {activeTab === 'problems' && <ProblemBankModule />}
        {activeTab === 'socratic' && <SocraticEvaluationModule />}
        {activeTab === 'workbench' && <FreeWorkbenchModule />}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-slate-200 py-6 text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-bold text-slate-800">
              Instituto Tecnológico Superior de Comalcalco (ITSC) • Tecnológico Nacional de México
            </p>
            <p className="text-slate-500">
              División de Ingeniería Electrónica • Asignatura: Teoría Electromagnética (ETF-1026)
            </p>
          </div>
          <div className="flex items-center gap-4 text-slate-600 font-medium">
            <span>Docente Titular: <strong>Ing. Jesús Ixta</strong></span>
            <span>•</span>
            <span className="text-emerald-700 font-bold">Ciclo Académico 2026</span>
          </div>
        </div>
      </footer>

      {/* Guide Modal: Manual Drafting Instructions with Ruler & Compass */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-7 space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5">
              <div className="flex items-center gap-2.5">
                <Compass className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-extrabold text-slate-900">
                  Instrucciones de Trazado Analógico en Papel
                </h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                className="text-slate-500 hover:text-slate-900 text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer"
              >
                Cerrar ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs text-slate-700 leading-relaxed">
              <p>
                Para resolver los ejercicios de examen en el Instituto Tecnológico Superior de Comalcalco, debes contar con:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-700 font-medium">
                <li>Una <strong>Carta de Smith impresa</strong> (escala completa de impedancias y admitancias).</li>
                <li>Un <strong>compás de precisión con punta de grafito fina</strong> (0.5 mm o bien afilado).</li>
                <li>Una <strong>regla milimétrica transparente de al menos 20 cm</strong>.</li>
                <li>Calculadora científica para corroborar normalizaciones $z = Z/Z_0$.</li>
              </ul>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 space-y-2">
                <h4 className="font-bold text-amber-950">Las 4 Reglas de Oro del Trazado:</h4>
                <ol className="list-decimal pl-5 space-y-1.5 text-slate-700">
                  <li>
                    <strong>Normaliza siempre:</strong> Divide todos los valores en Ohms entre $Z_0$ antes de buscar cualquier punto en la retícula.
                  </li>
                  <li>
                    <strong>Círculo de ROE:</strong> La aguja metálica del compás SIEMPRE se clava en el CENTRO $(1, 0)$ y el grafito se abre hasta tu punto $z_L$.
                  </li>
                  <li>
                    <strong>Lectura de la ROE:</strong> La ROE se lee directamente en la intersección del círculo con el eje horizontal a la DERECHA del centro ($r \ge 1$).
                  </li>
                  <li>
                    <strong>Dirección hacia el generador (WTG):</strong> Al avanzar desde la antena hacia el transmisor, gira SIEMPRE en sentido de las manecillas del reloj (horario). Cada media longitud de onda ($0.5\lambda$) equivale a una vuelta completa de $360^\circ$.
                  </li>
                </ol>
              </div>
            </div>

            <button
              onClick={() => setShowGuideModal(false)}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-bold text-white transition cursor-pointer shadow-sm shadow-blue-500/20"
            >
              Entendido, volver a la aplicación
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
