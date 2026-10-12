export interface Complex {
  r: number; // real part
  i: number; // imaginary part
}

export interface SmithPoint {
  z: Complex; // normalized impedance r + jx
  y?: Complex; // normalized admittance g + jb
  gamma: Complex; // reflection coefficient u + jv
  gammaMag: number;
  gammaAngleDeg: number;
  swr: number;
  wtgLambda?: number; // 0 to 0.5 wavelengths toward generator
}

export interface ProblemStep {
  stepNumber: number;
  title: string;
  compassInstruction: string;
  rulerInstruction: string;
  analyticalFormula: string;
  expectedValue: string;
  smithVisualFocus: {
    highlightCenter?: boolean;
    highlightPointZ?: boolean;
    highlightPointY?: boolean;
    highlightPointZin?: boolean;
    highlightSwrCircle?: boolean;
    highlightRuler?: boolean;
    highlightCompass?: boolean;
    highlightWtgScale?: boolean;
    highlightStubLine?: boolean;
    rotationAngleDeg?: number;
    rotationLabel?: string;
  };
  keyInsight: string;
}

export interface ProblemItem {
  id: number;
  title: string;
  engineeringContext: string;
  category: 'Básico' | 'Longitud de Línea' | 'Transformador' | 'Admitancia' | 'Stub Simple' | 'Diagnóstico';
  parameters: {
    zL: string;
    z0: number;
    frequency?: string;
    lineLengthLambda?: number;
    description: string;
  };
  computed: {
    zL_norm: Complex;
    gamma: Complex;
    gammaMag: number;
    gammaAngleDeg: number;
    swr: number;
    zIn_norm?: Complex;
    yL_norm?: Complex;
    stubDistanceLambda?: number;
    stubLengthLambda?: number;
    qwtImpedance?: number;
    returnLossDb?: number;
  };
  steps: ProblemStep[];
  quizCheckQuestion: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface SocraticQuestion {
  id: number;
  title: string;
  question: string;
  pedagogicalHint: string;
  coreConcepts: string[];
}

export interface FinalExamQuestion {
  id: number;
  topic: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudentRegistration {
  fullName: string;
  controlNumber: string;
  semesterGroup: string;
  institution: string;
  subjectName: string;
  subjectKey: string;
  teacherName: string;
}
