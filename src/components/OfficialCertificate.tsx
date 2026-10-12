import React from 'react';
import { StudentRegistration } from '../types/smith';
import { Printer, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface OfficialCertificateProps {
  student: StudentRegistration;
  score: number;
  approvedDate: string;
  verificationFolio: string;
  onBackToExam?: () => void;
}

export const OfficialCertificate: React.FC<OfficialCertificateProps> = ({
  student,
  score,
  approvedDate,
  verificationFolio,
  onBackToExam,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full flex flex-col items-center space-y-6">
      {/* Top Action Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between bg-slate-900 border border-slate-800 p-4 rounded-xl print:hidden">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Constancia Oficial ITSC Generada</h3>
            <p className="text-xs text-slate-400">
              Acreditado con {score} / 100 puntos (Mínimo aprobatorio: 80)
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {onBackToExam && (
            <button
              onClick={onBackToExam}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-semibold text-slate-300 hover:bg-slate-700 transition cursor-pointer"
            >
              Ver Respuestas
            </button>
          )}
          <button
            onClick={handlePrint}
            className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center gap-1.5 transition shadow-sm cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Imprimir / Guardar como PDF
          </button>
        </div>
      </div>

      {/* Official Certificate Paper Container */}
      <div
        id="official-certificate-sheet"
        className="w-full max-w-4xl bg-white text-slate-900 rounded-lg shadow-2xl p-8 sm:p-12 border-8 border-double border-slate-300 relative overflow-hidden print:m-0 print:border-4 print:shadow-none print:w-full"
      >
        {/* Background Ornamental Guilloché Watermark */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.035] flex items-center justify-center">
          <svg viewBox="0 0 500 500" className="w-[85%] h-[85%]">
            <circle cx="250" cy="250" r="220" fill="none" stroke="#000" strokeWidth="2" />
            <circle cx="250" cy="250" r="180" fill="none" stroke="#000" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="120" fill="none" stroke="#000" strokeWidth="1" />
            <path d="M 250 30 L 250 470 M 30 250 L 470 250" stroke="#000" strokeWidth="1" />
          </svg>
        </div>

        {/* Institutional Header */}
        <div className="border-b-2 border-slate-800 pb-5 mb-6 text-center space-y-1 relative">
          <div className="flex justify-between items-center px-2 mb-2">
            {/* TecNM Logo Representation */}
            <div className="text-left font-serif">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block">
                TECNOLÓGICO NACIONAL DE MÉXICO
              </span>
              <span className="text-sm font-black text-slate-900 tracking-wider">
                TecNM
              </span>
            </div>

            {/* ITSC Seal Badge */}
            <div className="flex items-center gap-2">
              <div className="w-12 h-12 rounded-full border-2 border-slate-900 flex items-center justify-center bg-slate-50 text-slate-900 font-serif font-black text-sm">
                ITSC
              </div>
            </div>

            {/* Electronic Engineering Division */}
            <div className="text-right font-serif">
              <span className="text-xs uppercase font-bold tracking-widest text-slate-600 block">
                DIVISIÓN DE INGENIERÍA ELECTRÓNICA
              </span>
              <span className="text-xs font-semibold text-slate-800">
                COMALCALCO, TABASCO
              </span>
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl font-serif font-black text-slate-900 tracking-wide uppercase pt-1">
            Instituto Tecnológico Superior de Comalcalco
          </h1>
          <p className="text-xs font-sans text-slate-600 uppercase tracking-widest font-semibold">
            Organismo Descentralizado de la Administración Pública del Estado de Tabasco
          </p>
        </div>

        {/* Certificate Title */}
        <div className="text-center my-6 space-y-2">
          <div className="inline-block px-4 py-1 bg-slate-100 rounded border border-slate-300 text-xs font-mono uppercase font-bold tracking-widest text-slate-700">
            CONSTANCIA DE COMPETENCIA Y ACREDITACIÓN PRÁCTICA
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight">
            CARTA DE SMITH Y ACOPLAMIENTO DE LÍNEAS DE TRANSMISIÓN
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-serif italic">
            Por haber superado exitosamente el proceso de instrucción guiada, verificación socrática analógica y evaluación de diseño manual.
          </p>
        </div>

        {/* Student Data Section */}
        <div className="my-8 text-center space-y-3">
          <p className="text-xs uppercase tracking-wider text-slate-500 font-sans">
            Se otorga la presente constancia a:
          </p>
          <div className="text-2xl sm:text-3xl font-serif font-extrabold text-blue-950 underline decoration-slate-400 decoration-1 underline-offset-8">
            {student.fullName || 'ESTUDIANTE DE INGENIERÍA ELECTRÓNICA'}
          </div>
          <div className="flex justify-center items-center gap-6 text-xs font-mono text-slate-700 pt-1">
            <span>
              <strong>Número de Control:</strong> {student.controlNumber || '21E50000'}
            </span>
            <span>•</span>
            <span>
              <strong>Semestre / Grupo:</strong> {student.semesterGroup || '7° Semestre'}
            </span>
          </div>
        </div>

        {/* Academic Subject Details Box */}
        <div className="bg-slate-50 border border-slate-300 rounded-lg p-5 my-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
          <div className="space-y-1.5 border-b md:border-b-0 md:border-r border-slate-200 pb-3 md:pb-0 md:pr-4">
            <div>
              <span className="text-slate-500 font-medium">Asignatura Curricular:</span>
              <p className="font-bold text-slate-900">Teoría Electromagnética (Clave: ETF-1026)</p>
            </div>
            <div>
              <span className="text-slate-500 font-medium">Unidad y Subtemas:</span>
              <p className="font-semibold text-slate-800">
                Unidad 2: Líneas de Transmisión (Subtemas 2.3 Carta de Smith y 2.4 Acoplamiento)
              </p>
            </div>
          </div>
          <div className="space-y-1.5 pl-0 md:pl-2">
            <div>
              <span className="text-slate-500 font-medium">Competencia Acreditada:</span>
              <p className="font-semibold text-emerald-800 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                COMPETENCIA ALCANZADA (Trazado con Compás y Regla)
              </p>
            </div>
            <div className="flex items-center justify-between pt-1">
              <div>
                <span className="text-slate-500 font-medium">Calificación Obtenida:</span>
                <p className="text-base font-black text-blue-900 font-mono">{score} / 100 Puntos</p>
              </div>
              <div className="text-right">
                <span className="text-slate-500 font-medium">Fecha de Emisión:</span>
                <p className="font-semibold text-slate-800">{approvedDate}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification and Signatures Footer */}
        <div className="mt-10 pt-4 border-t border-slate-300 grid grid-cols-3 gap-4 items-end text-center">
          {/* Official QR Code Simulation */}
          <div className="flex flex-col items-center">
            <div className="p-2 bg-white border border-slate-400 rounded shadow-xs">
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                {/* Clean Vector QR Code Simulation */}
                <rect x="0" y="0" width="100" height="100" fill="#fff" />
                <rect x="10" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="15" width="15" height="15" fill="#fff" />
                <rect x="18" y="18" width="9" height="9" fill="#0f172a" />
                <rect x="65" y="10" width="25" height="25" fill="#0f172a" />
                <rect x="70" y="15" width="15" height="15" fill="#fff" />
                <rect x="73" y="18" width="9" height="9" fill="#0f172a" />
                <rect x="10" y="65" width="25" height="25" fill="#0f172a" />
                <rect x="15" y="70" width="15" height="15" fill="#fff" />
                <rect x="18" y="73" width="9" height="9" fill="#0f172a" />
                <rect x="45" y="15" width="10" height="10" fill="#0f172a" />
                <rect x="40" y="40" width="20" height="20" fill="#0f172a" />
                <rect x="65" y="45" width="10" height="10" fill="#0f172a" />
                <rect x="45" y="70" width="15" height="15" fill="#0f172a" />
                <rect x="70" y="70" width="15" height="15" fill="#0f172a" />
              </svg>
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1 uppercase">
              Folio: {verificationFolio}
            </span>
          </div>

          {/* Signature 1: Titular Teacher */}
          <div className="flex flex-col items-center">
            <div className="w-36 border-b border-slate-900 pb-1 mb-1 font-serif italic text-xs text-slate-700">
              Ing. Jesús Ixta
            </div>
            <span className="text-[10px] font-bold text-slate-900 uppercase">
              Docente Titular
            </span>
            <span className="text-[9px] text-slate-500 font-sans">
              Academia de Electrónica - ITSC
            </span>
          </div>

          {/* Signature 2: Academic Department Seal */}
          <div className="flex flex-col items-center">
            <div className="w-36 border-b border-slate-900 pb-1 mb-1 font-serif italic text-xs text-slate-700">
              División Académica
            </div>
            <span className="text-[10px] font-bold text-slate-900 uppercase">
              Jefatura de División
            </span>
            <span className="text-[9px] text-slate-500 font-sans">
              Ingeniería Electrónica ITSC
            </span>
          </div>
        </div>

        {/* Security Microtext */}
        <div className="mt-6 pt-2 border-t border-dashed border-slate-200 text-center text-[8.5px] font-mono text-slate-400">
          DOCUMENTO OFICIAL VALIDADOR DE COMPETENCIAS ACADÉMICAS • INSTITUTO TECNOLÓGICO SUPERIOR DE COMALCALCO • CARRETERA VECINAL COMALCALCO-PARAÍSO KM 2
        </div>
      </div>
    </div>
  );
};
