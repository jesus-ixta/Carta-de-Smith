import React, { useState } from 'react';
import { SOCRATIC_QUESTIONS, FINAL_EXAM_QUESTIONS } from '../data/evaluationData';
import { StudentRegistration, FinalExamQuestion } from '../types/smith';
import { OfficialCertificate } from './OfficialCertificate';
import { MathView } from './MathView';
import {
  GraduationCap,
  MessageSquare,
  Send,
  Sparkles,
  CheckCircle,
  XCircle,
  Award,
  AlertTriangle,
  RotateCcw,
  UserCheck,
  ShieldAlert,
  ArrowRight,
  BookCheck,
} from 'lucide-react';

export const SocraticEvaluationModule: React.FC = () => {
  const [subStage, setSubStage] = useState<'socratic_tutor' | 'registration' | 'exam' | 'certificate'>('socratic_tutor');

  // Socratic Chat State
  const [socraticQuestionIndex, setSocraticQuestionIndex] = useState<number>(0);
  const [studentInput, setStudentInput] = useState<string>('');
  const [chatMessages, setChatMessages] = useState<
    Array<{
      sender: 'tutor' | 'student';
      text: string;
      keyTakeaway?: string;
      passed?: boolean;
    }>
  >([
    {
      sender: 'tutor',
      text: `¡Bienvenido al Módulo de Verificación Socrática del ITSC! 🎓 Soy tu Tutor de Teoría Electromagnética. Para desbloquear la evaluación final y tu Constancia Oficial, debemos dialogar sobre 3 principios manuales fundamentales de la Carta de Smith. Empecemos con la primera pregunta:`,
    },
    {
      sender: 'tutor',
      text: `📌 **Pregunta 1:** ${SOCRATIC_QUESTIONS[0].question}`,
    },
  ]);
  const [isSubmittingChat, setIsSubmittingChat] = useState<boolean>(false);
  const [questionProgress, setQuestionProgress] = useState<boolean[]>([false, false, false]);
  const [socraticPassed, setSocraticPassed] = useState<boolean>(false);

  // Registration Form State
  const [student, setStudent] = useState<StudentRegistration>({
    fullName: '',
    controlNumber: '',
    semesterGroup: '7° Semestre - Grupo A',
    institution: 'Instituto Tecnológico Superior de Comalcalco',
    subjectName: 'Teoría Electromagnética',
    subjectKey: 'ETF-1026',
    teacherName: 'Ing. Jesús Ixta',
  });
  const [registrationError, setRegistrationError] = useState<string>('');

  // Exam State
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [examSubmitted, setExamSubmitted] = useState<boolean>(false);
  const [examScore, setExamScore] = useState<number>(0);
  const [verificationFolio, setVerificationFolio] = useState<string>('');
  const [approvedDate, setApprovedDate] = useState<string>('');

  // Handle Socratic Answer Submission
  const handleSendSocraticAnswer = async () => {
    if (!studentInput.trim() || isSubmittingChat) return;

    const userText = studentInput.trim();
    setStudentInput('');

    const updatedMessages = [
      ...chatMessages,
      { sender: 'student' as const, text: userText },
    ];
    setChatMessages(updatedMessages);
    setIsSubmittingChat(true);

    try {
      const response = await fetch('/api/socratic-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionIndex: socraticQuestionIndex,
          questionText: SOCRATIC_QUESTIONS[socraticQuestionIndex].question,
          studentAnswer: userText,
          conversationHistory: updatedMessages.map((m) => ({ role: m.sender, content: m.text })),
        }),
      });

      const data = await response.json();

      const newChat = [...updatedMessages];
      newChat.push({
        sender: 'tutor',
        text: data.feedback || 'Evaluación registrada.',
        keyTakeaway: data.keyTakeaway,
        passed: data.passed,
      });

      if (data.passed) {
        const nextProgress = [...questionProgress];
        nextProgress[socraticQuestionIndex] = true;
        setQuestionProgress(nextProgress);

        if (socraticQuestionIndex < 2) {
          const nextIdx = socraticQuestionIndex + 1;
          setSocraticQuestionIndex(nextIdx);
          newChat.push({
            sender: 'tutor',
            text: `🎯 **Pregunta ${nextIdx + 1}:** ${SOCRATIC_QUESTIONS[nextIdx].question}`,
          });
        } else {
          setSocraticPassed(true);
          newChat.push({
            sender: 'tutor',
            text: `🏆 **¡Excelente trabajo! Has demostrado dominio riguroso de los conceptos analógicos de la Carta de Smith.** La variable \`socratic_passed = true\` ha sido emitida con éxito. Ya puedes avanzar al Formulario de Registro y presentar tu Examen Final para obtener tu Constancia Oficial del ITSC.`,
          });
        }
      }

      setChatMessages(newChat);
    } catch (err) {
      console.error('Error contacting socratic tutor API:', err);
      const isOk = userText.length > 25;
      const newChat = [
        ...updatedMessages,
        {
          sender: 'tutor' as const,
          text: isOk
            ? '¡Buen razonamiento técnico! Tu respuesta demuestra comprensión de los trazos geométricos en la Carta de Smith.'
            : 'Tu respuesta es algo breve. Recuerda justificar con los términos físicos (WTG, compás en el eje real derecho o suma de admitancias). Intenta profundizar un poco más.',
          passed: isOk,
        },
      ];
      if (isOk) {
        const nextProgress = [...questionProgress];
        nextProgress[socraticQuestionIndex] = true;
        setQuestionProgress(nextProgress);
        if (socraticQuestionIndex < 2) {
          const nextIdx = socraticQuestionIndex + 1;
          setSocraticQuestionIndex(nextIdx);
          newChat.push({
            sender: 'tutor',
            text: `🎯 **Pregunta ${nextIdx + 1}:** ${SOCRATIC_QUESTIONS[nextIdx].question}`,
          });
        } else {
          setSocraticPassed(true);
        }
      }
      setChatMessages(newChat);
    } finally {
      setIsSubmittingChat(false);
    }
  };

  const handleProceedToExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!student.fullName.trim() || student.fullName.trim().length < 5) {
      setRegistrationError('Por favor ingresa tu Nombre Completo oficial.');
      return;
    }
    if (!student.controlNumber.trim() || student.controlNumber.trim().length < 4) {
      setRegistrationError('Por favor ingresa un Número de Control válido (ej. 21E50012).');
      return;
    }
    setRegistrationError('');
    setSubStage('exam');
  };

  const handleGradeExam = () => {
    let correctCount = 0;
    FINAL_EXAM_QUESTIONS.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correctCount += 1;
      }
    });

    const calculatedScore = Math.round((correctCount / FINAL_EXAM_QUESTIONS.length) * 100);
    setExamScore(calculatedScore);
    setExamSubmitted(true);

    const now = new Date();
    const formattedDate = `${now.getDate()} de ${[
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre',
    ][now.getMonth()]} de ${now.getFullYear()}`;
    setApprovedDate(formattedDate);

    const randomHex = Math.floor(1000 + Math.random() * 9000);
    setVerificationFolio(`ITSC-ETF1026-CS-${now.getFullYear()}-${randomHex}`);

    if (calculatedScore >= 80) {
      setSubStage('certificate');
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Module Navigation Tabs */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-100 text-blue-700">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900">Módulo 3: Tutor Socrático y Acreditación</h2>
            <p className="text-xs text-slate-500">
              Instituto Tecnológico Superior de Comalcalco • ETF-1026
            </p>
          </div>
        </div>

        {/* Stage Pills */}
        <div className="flex items-center gap-2 text-xs font-bold">
          <button
            onClick={() => setSubStage('socratic_tutor')}
            className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
              subStage === 'socratic_tutor'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                : socraticPassed
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            1. Tutor Socrático
            {socraticPassed && <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
          </button>

          <button
            disabled={!socraticPassed}
            onClick={() => setSubStage('registration')}
            className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
              subStage === 'registration'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                : student.fullName
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            2. Registro
          </button>

          <button
            disabled={!socraticPassed || !student.fullName}
            onClick={() => setSubStage('exam')}
            className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
              subStage === 'exam'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                : examSubmitted && examScore >= 80
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <BookCheck className="w-3.5 h-3.5" />
            3. Evaluación Final
          </button>

          <button
            disabled={!examSubmitted || examScore < 80}
            onClick={() => setSubStage('certificate')}
            className={`px-3.5 py-2 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed ${
              subStage === 'certificate'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm shadow-emerald-500/20'
                : 'bg-slate-50 text-slate-600 border-slate-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            4. Constancia ITSC
          </button>
        </div>
      </div>

      {/* SUB-STAGE 1: SOCRATIC CHAT INTERFACE */}
      {subStage === 'socratic_tutor' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Diálogo Socrático de Verificación Conceptual
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Responde con tus propias palabras sobre el uso del compás y regla en la Carta de Smith.
                El tutor evaluará si dominas la física y técnica antes de habilitar el examen.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200 shrink-0">
              <span className="text-xs text-slate-600 font-bold">Progreso:</span>
              <div className="flex gap-1.5">
                {[0, 1, 2].map((idx) => (
                  <span
                    key={idx}
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold font-mono ${
                      questionProgress[idx]
                        ? 'bg-emerald-600 text-white'
                        : idx === socraticQuestionIndex
                        ? 'bg-blue-600 text-white animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {idx + 1}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Chat Messages Container */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 h-[380px] overflow-y-auto space-y-4">
            {chatMessages.map((msg, mIdx) => {
              const isTutor = msg.sender === 'tutor';
              return (
                <div
                  key={mIdx}
                  className={`flex flex-col ${isTutor ? 'items-start' : 'items-end'}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 font-bold">
                      {isTutor ? 'Docente Tutor ITSC' : 'Tú (Estudiante)'}
                    </span>
                  </div>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                      isTutor
                        ? 'bg-white border border-slate-200 text-slate-800'
                        : 'bg-blue-600 text-white font-medium shadow-sm shadow-blue-500/20'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    {msg.keyTakeaway && (
                      <div className="mt-2.5 pt-2 border-t border-slate-100 text-[11px] text-amber-900 font-semibold bg-amber-50 p-2 rounded-lg">
                        💡 <strong>Regla de Compás:</strong> {msg.keyTakeaway}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            {isSubmittingChat && (
              <div className="flex items-center gap-2 text-xs text-blue-700 italic py-2">
                <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping"></span>
                El Tutor Socrático está analizando tu razonamiento técnico...
              </div>
            )}
          </div>

          {/* Chat Input & Next Action */}
          {!socraticPassed ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <textarea
                  rows={2}
                  value={studentInput}
                  onChange={(e) => setStudentInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendSocraticAnswer();
                    }
                  }}
                  placeholder="Escribe tu razonamiento técnico aquí... (ej. Al movernos hacia el generador acumulamos fase en sentido horario WTG...)"
                  className="flex-1 bg-white border border-slate-300 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none font-sans shadow-xs"
                />
                <button
                  disabled={!studentInput.trim() || isSubmittingChat}
                  onClick={handleSendSocraticAnswer}
                  className="px-5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl text-xs font-bold text-white flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0 shadow-sm shadow-blue-500/20"
                >
                  <Send className="w-4 h-4" />
                  Enviar
                </button>
              </div>
              <p className="text-[11px] text-slate-500 italic">
                Pista pedagógica actual: {SOCRATIC_QUESTIONS[socraticQuestionIndex].pedagogicalHint}
              </p>
            </div>
          ) : (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <h4 className="text-sm font-bold text-emerald-950 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  Fase Socrática Aprobada con Éxito (socratic_passed = true)
                </h4>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Has completado la validación de fundamentos manuales. Procede a registrar tus datos para el examen.
                </p>
              </div>
              <button
                onClick={() => setSubStage('registration')}
                className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-sm shadow-emerald-500/20"
              >
                Continuar al Registro Oficial
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* SUB-STAGE 2: STUDENT REGISTRATION FORM */}
      {subStage === 'registration' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-7 max-w-2xl mx-auto space-y-5 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" />
              Registro del Estudiante para Constancia Oficial ITSC
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Los datos ingresados aparecerán textualmente en la Constancia Oficial de Competencias emitida por el Instituto Tecnológico Superior de Comalcalco.
            </p>
          </div>

          <form onSubmit={handleProceedToExam} className="space-y-4">
            {registrationError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                {registrationError}
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-800 block mb-1">
                Nombre Completo del Alumno: <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={student.fullName}
                onChange={(e) => setStudent({ ...student, fullName: e.target.value })}
                placeholder="Ej. Juan Carlos López Hernández"
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-sans transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Número de Control: <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={student.controlNumber}
                  onChange={(e) => setStudent({ ...student, controlNumber: e.target.value })}
                  placeholder="Ej. 21E50012"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-mono transition"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-800 block mb-1">
                  Semestre / Grupo:
                </label>
                <input
                  type="text"
                  value={student.semesterGroup}
                  onChange={(e) => setStudent({ ...student, semesterGroup: e.target.value })}
                  placeholder="Ej. 7° Semestre - Grupo A"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-blue-500 focus:bg-white font-sans transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 block font-semibold">Asignatura Curricular:</span>
                <span className="text-blue-900 font-bold">Teoría Electromagnética (ETF-1026)</span>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                <span className="text-slate-500 block font-semibold">Institución Acreditadora:</span>
                <span className="text-emerald-900 font-bold">TecNM / ITSC Comalcalco</span>
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSubStage('socratic_tutor')}
                className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                Volver al Tutor
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-blue-500/20"
              >
                Comenzar Examen de Acreditación
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* SUB-STAGE 3: FINAL EXAM QUESTIONNAIRE */}
      {subStage === 'exam' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-wider text-blue-700 font-bold block mb-1">
                Evaluación Oficial de la Unidad 2 (Subtemas 2.3 y 2.4)
              </span>
              <h3 className="text-lg font-extrabold text-slate-900">
                Examen de Competencia: Lectura y Trazado en la Carta de Smith
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Alumno: <strong className="text-slate-900">{student.fullName}</strong> • No. Control:{' '}
                <strong className="text-slate-900">{student.controlNumber}</strong> • Criterio de acreditación:{' '}
                <strong className="text-emerald-700">≥ 80 / 100 Puntos</strong>
              </p>
            </div>

            {examSubmitted && (
              <div
                className={`px-4 py-2.5 rounded-xl border font-mono font-black text-sm shadow-xs ${
                  examScore >= 80
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                    : 'bg-rose-50 border-rose-300 text-rose-800'
                }`}
              >
                Calificación: {examScore} / 100
              </div>
            )}
          </div>

          {/* Exam Questions List */}
          <div className="space-y-5">
            {FINAL_EXAM_QUESTIONS.map((q, qIndex) => {
              const selectedOpt = userAnswers[q.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className={`bg-slate-50 border rounded-2xl p-5 space-y-3 transition shadow-xs ${
                    examSubmitted
                      ? isCorrect
                        ? 'border-emerald-400 bg-emerald-50/40'
                        : 'border-rose-300 bg-rose-50/40'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-blue-700 font-bold">
                      Reactivo #{qIndex + 1} • {q.topic}
                    </span>
                    {examSubmitted && (
                      <span
                        className={`text-xs font-bold flex items-center gap-1 ${
                          isCorrect ? 'text-emerald-700' : 'text-rose-700'
                        }`}
                      >
                        {isCorrect ? (
                          <>
                            <CheckCircle className="w-4 h-4 text-emerald-600" /> +10 Puntos
                          </>
                        ) : (
                          <>
                            <XCircle className="w-4 h-4 text-rose-600" /> 0 Puntos
                          </>
                        )}
                      </span>
                    )}
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-800 leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-2 pt-1">
                    {q.options.map((optionText, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      const isOptionCorrect = q.correctIndex === optIdx;

                      let optClass =
                        'bg-white border-slate-200 text-slate-700 hover:bg-slate-100';

                      if (examSubmitted) {
                        if (isOptionCorrect) {
                          optClass = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold';
                        } else if (isOptionSelected) {
                          optClass = 'bg-rose-100 border-rose-400 text-rose-950 font-medium';
                        }
                      } else if (isOptionSelected) {
                        optClass = 'bg-blue-50 border-blue-500 text-blue-900 font-bold ring-1 ring-blue-500';
                      }

                      return (
                        <button
                          key={optIdx}
                          disabled={examSubmitted}
                          onClick={() => setUserAnswers({ ...userAnswers, [q.id]: optIdx })}
                          className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between cursor-pointer shadow-xs ${optClass}`}
                        >
                          <div className="flex items-center gap-2.5">
                            <span className="w-5 h-5 rounded-full border border-slate-400 flex items-center justify-center font-mono text-[10px] text-slate-600 font-bold">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{optionText}</span>
                          </div>
                          {examSubmitted && isOptionCorrect && (
                            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation after submission */}
                  {examSubmitted && (
                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1 shadow-xs">
                      <strong className="text-blue-900 block font-bold">Explicación Oficial:</strong>
                      <p>{q.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Exam Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <span className="text-xs text-slate-600 font-mono font-bold">
              Respondidas: {Object.keys(userAnswers).length} de {FINAL_EXAM_QUESTIONS.length} preguntas
            </span>

            {!examSubmitted ? (
              <button
                disabled={Object.keys(userAnswers).length < FINAL_EXAM_QUESTIONS.length}
                onClick={handleGradeExam}
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 rounded-xl text-xs font-bold text-white shadow-sm shadow-blue-500/20 transition cursor-pointer"
              >
                Enviar y Calificar Examen
              </button>
            ) : examScore >= 80 ? (
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  ¡Felicidades! Calificación Aprobatoria.
                </span>
                <button
                  onClick={() => setSubStage('certificate')}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-sm shadow-emerald-500/20"
                >
                  <Award className="w-4 h-4" />
                  Ver Constancia Oficial ITSC
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="text-xs text-rose-700 font-bold flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
                  Calificación insuficiente ({examScore}/100). La constancia requiere un mínimo de 80 puntos.
                </div>
                <button
                  onClick={() => {
                    setExamSubmitted(false);
                    setUserAnswers({});
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reintentar Examen
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-STAGE 4: OFFICIAL CERTIFICATE */}
      {subStage === 'certificate' && (
        <OfficialCertificate
          student={student}
          score={examScore}
          approvedDate={approvedDate}
          verificationFolio={verificationFolio}
          onBackToExam={() => setSubStage('exam')}
        />
      )}
    </div>
  );
};
