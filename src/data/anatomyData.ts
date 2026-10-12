export interface AnatomyTopic {
  id: string;
  number: number;
  title: string;
  shortName: string;
  summary: string;
  mathematicalBasis: string;
  manualDraftingTip: string;
  interactiveControls: {
    label: string;
    description: string;
  };
  svgHighlights: {
    highlightType: 'normalization' | 'real_axis' | 'resistance_circles' | 'reactance_arcs' | 'wavelength_scales' | 'swr_circle';
    defaultResistance?: number;
    defaultReactance?: number;
    showCompass?: boolean;
    showRuler?: boolean;
    showWtgArrow?: boolean;
  };
  practicalQuestions: {
    question: string;
    answer: string;
  }[];
}

export const ANATOMY_TOPICS: AnatomyTopic[] = [
  {
    id: 'normalization',
    number: 1,
    title: '1. Concepto de Normalización de Impedancias',
    shortName: 'Normalización',
    summary: 'La Carta de Smith es un diagrama adimensional universal. Para poder representar cualquier línea de transmisión coaxial, guía de onda o microcinta (independientemente de que su impedancia sea de 50 Ω, 75 Ω, 300 Ω o cualquier otro valor), todas las impedancias deben dividirse previamente entre la impedancia característica Z_0 de la línea.',
    mathematicalBasis: 'z_L = \\frac{Z_L}{Z_0} = \\frac{R_L + jX_L}{Z_0} = r + jx',
    manualDraftingTip: 'Al resolver a mano en tu examen o laboratorio, tu primer paso en la hoja de cálculo siempre es dividir la parte real y la imaginaria entre Z_0 antes de colocar la punta del compás sobre el papel.',
    interactiveControls: {
      label: 'Calculadora de Normalización Rápida',
      description: 'Ingresa valores de Z_L (Ohms) y Z_0 para observar cómo se convierten a coordenadas adimensionales r y x.',
    },
    svgHighlights: {
      highlightType: 'normalization',
      defaultResistance: 1.0,
      defaultReactance: 0.0,
      showCompass: false,
      showRuler: false,
    },
    practicalQuestions: [
      {
        question: '¿Por qué no existe una carta de Smith en Ohms específicos?',
        answer: 'Porque una sola carta universal sirve para cualquier impedancia (50 Ω en telefonía móvil, 75 Ω en televisión por cable, 300 Ω en líneas bifilares o 377 Ω en espacio libre) al trabajar con valores normalizados.',
      },
      {
        question: '¿Qué dimensiones o unidades tienen r y x en la carta?',
        answer: 'Son magnitudes adimensionales. Si z_L = 2 + j1 y Z_0 = 50 Ω, la impedancia real física es Z_L = 100 + j50 Ohms.',
      },
    ],
  },
  {
    id: 'real_axis',
    number: 2,
    title: '2. Eje Real de Resistencias (r) y Puntos Notables',
    shortName: 'Eje Real',
    summary: 'La línea horizontal recta que divide la Carta de Smith por la mitad es el Eje Real de Resistencias (donde la reactancia reactiva es exactamente x = 0). En este eje residen los 3 puntos cardinales de toda la teoría de líneas de transmisión.',
    mathematicalBasis: 'x = 0 \\implies z = r + j0,\\; \\Gamma = \\frac{r - 1}{r + 1} \\in \\mathbb{R}',
    manualDraftingTip: 'Identifica visualmente los tres puntos con tu regla: Extremo izquierdo (z=0, Cortocircuito), Centro exacto (z=1, Acoplamiento perfecto), Extremo derecho (z=∞, Circuito abierto).',
    interactiveControls: {
      label: 'Inspección de Puntos Notables',
      description: 'Haz clic en los 3 puntos clave para entender el comportamiento de las ondas estacionarias en cada caso extremo.',
    },
    svgHighlights: {
      highlightType: 'real_axis',
      defaultResistance: 1.0,
      defaultReactance: 0.0,
      showCompass: false,
      showRuler: true,
    },
    practicalQuestions: [
      {
        question: '¿Qué valor tiene el coeficiente de reflexión en el centro (1 + j0)?',
        answer: 'Γ = (1 - 1)/(1 + 1) = 0. Toda la energía del generador pasa a la carga sin ninguna onda reflejada (ROE = 1.0).',
      },
      {
        question: '¿Por qué el punto de circuito abierto (z = ∞) converge en el extremo derecho?',
        answer: 'Porque conforme r tiende a infinito, el radio de los círculos de resistencia tiende a cero, colapsando en el punto (u=1, v=0) en el plano de reflexión.',
      },
    ],
  },
  {
    id: 'resistance_circles',
    number: 3,
    title: '3. Círculos de Resistencia Constante (r)',
    shortName: 'Círculos de r',
    summary: 'Todos los puntos que tienen la misma componente resistiva normalizada r forman círculos completos en la Carta de Smith. Todos estos círculos son tangentes interiormente al extremo derecho (punto de circuito abierto z = ∞).',
    mathematicalBasis: '\\left(u - \\frac{r}{r+1}\\right)^2 + v^2 = \\left(\\frac{1}{r+1}\\right)^2 \\implies \\text{Centro en } \\left(\\frac{r}{r+1}, 0\\right),\\; \\text{Radio } = \\frac{1}{r+1}',
    manualDraftingTip: 'Al buscar tu punto, primero localiza el círculo de resistencia r impreso sobre el eje horizontal (ej. r = 0.5, r = 1.0, r = 2.0) y sigue visualmente su trayectoria curva.',
    interactiveControls: {
      label: 'Selector de Círculos de r',
      description: 'Mueve el control deslizante para resaltar cómo el tamaño del círculo decrece a medida que la resistencia r aumenta.',
    },
    svgHighlights: {
      highlightType: 'resistance_circles',
      defaultResistance: 1.0,
      defaultReactance: 0.0,
      showCompass: false,
      showRuler: false,
    },
    practicalQuestions: [
      {
        question: '¿Cuál es el círculo de resistencia más grande de la carta?',
        answer: 'El círculo exterior de borde con r = 0 (resistencia nula, circuitos puramente reactivos sin pérdidas como stubs o líneas abiertas/cortocircuitadas).',
      },
      {
        question: '¿Qué tiene de especial el círculo r = 1.0?',
        answer: 'Pasa exactamente por el centro de la carta. Cualquier componente o stub conectado en paralelo busca llevar la admitancia al círculo g = 1 para lograr el acoplamiento.',
      },
    ],
  },
  {
    id: 'reactance_arcs',
    number: 4,
    title: '4. Arcos de Reactancia Constante (+jx y -jx)',
    shortName: 'Arcos de x',
    summary: 'La reactancia imaginaria se representa mediante familias de arcos circulares ortogonales a los círculos de resistencia. El hemisferio SUPERIOR aloja todas las reactancias inductivas (+jx), mientras que el hemisferio INFERIOR aloja las reactancias capacitivas (-jx).',
    mathematicalBasis: '(u - 1)^2 + \\left(v - \\frac{1}{x}\\right)^2 = \\left(\\frac{1}{x}\\right)^2 \\implies \\text{Centro en } \\left(1, \\frac{1}{x}\\right),\\; \\text{Radio } = \\frac{1}{|x|}',
    manualDraftingTip: 'Regla mnemotécnica para recordar en examen: El cielo está arriba (+j Inductores), el agua/tierra está abajo (-j Capacitores).',
    interactiveControls: {
      label: 'Explorador de Reactancias',
      description: 'Alterna entre reactancias inductivas positivas y capacitivas negativas para observar los arcos resaltados.',
    },
    svgHighlights: {
      highlightType: 'reactance_arcs',
      defaultResistance: 1.0,
      defaultReactance: 1.0,
      showCompass: false,
      showRuler: false,
    },
    practicalQuestions: [
      {
        question: 'Si mides una antena con z = 0.8 - j1.2, ¿en qué mitad de la carta debes buscarla?',
        answer: 'En la mitad INFERIOR, porque la parte imaginaria es negativa (-j1.2), lo cual indica comportamiento capacitivo.',
      },
      {
        question: '¿Por qué los círculos de resistencia y los arcos de reactancia se cortan a 90°?',
        answer: 'Porque la transformación bilineal de la Carta de Smith es conforme, lo cual preserva los ángulos ortogonales del plano cartesiano de impedancias.',
      },
    ],
  },
  {
    id: 'wavelength_scales',
    number: 5,
    title: '5. Escalas Exteriores de Longitud de Onda (WTG y WTL)',
    shortName: 'Escalas WTG/WTL',
    summary: 'Alrededor del círculo exterior r = 0 se ubican las escalas graduadas de distancia normalizada en longitudes de onda (λ). La escala más utilizada en ingeniería es "WAVELENGTHS TOWARD GENERATOR" (WTG), cuyos valores aumentan en SENTIDO HORARIO (con las manecillas del reloj). La escala inversa "WAVELENGTHS TOWARD LOAD" (WTL) aumenta en SENTIDO ANTIHORARIO.',
    mathematicalBasis: '\\Delta\\theta = -2\\beta d = -2\\left(\\frac{2\\pi}{\\lambda}\\right)d = -4\\pi\\left(\\frac{d}{\\lambda}\\right) \\implies 360^\\circ = 0.5\\lambda',
    manualDraftingTip: 'Al usar tu regla, colócala uniendo el CENTRO de la carta con tu punto de impedancia y proyecta la recta hasta la escala circular exterior para leer los valores en longitudes de onda.',
    interactiveControls: {
      label: 'Simulación de Rotación a lo largo de la Línea',
      description: 'Arrastra el deslizador de distancia d/λ para ver la regla girar en sentido horario hacia el generador.',
    },
    svgHighlights: {
      highlightType: 'wavelength_scales',
      defaultResistance: 1.0,
      defaultReactance: 0.0,
      showCompass: false,
      showRuler: true,
      showWtgArrow: true,
    },
    practicalQuestions: [
      {
        question: '¿Por qué una rotación de media longitud de onda (d = 0.5λ) da una vuelta completa de 360°?',
        answer: 'Porque la onda viaja hacia la carga y se refleja hacia el generador, recorriendo el doble de la distancia física (2d = λ), lo que equivale a un ciclo de fase completo de 360°.',
      },
      {
        question: 'Si estás en la escala WTG en 0.420λ y avanzas 0.150λ hacia el generador, ¿dónde quedas?',
        answer: '0.420λ + 0.150λ = 0.570λ. Como la escala reinicia en 0.500λ, restamos 0.500λ dando una lectura final de 0.070λ.',
      },
    ],
  },
  {
    id: 'swr_circle',
    number: 6,
    title: '6. Relación entre |Γ| y ROE (SWR) con Compás',
    shortName: 'Círculo de ROE',
    summary: 'La magnitud del coeficiente de reflexión |Γ| y la Relación de Onda Estacionaria (ROE) permanecen constantes a lo largo de cualquier línea de transmisión sin pérdidas. Geométricamente, esto significa que todos los estados de impedancia a lo largo de la línea yacen sobre un CÍRCULO CONCÉNTRICO centrado en (1, 0).',
    mathematicalBasis: '\\text{ROE} = \\frac{1 + |\\Gamma|}{1 - |\\Gamma|} \\iff |\\Gamma| = \\frac{\\text{ROE} - 1}{\\text{ROE} + 1}',
    manualDraftingTip: 'Técnica de compás: Apoya la punta metálica en el centro (1, 0), ajusta el grafito en el punto z_L y traza el círculo completo. La ROE se lee directamente en la intersección con el eje real horizontal a la derecha del centro (r = ROE).',
    interactiveControls: {
      label: 'Trazador Virtual de Compás',
      description: 'Observa la simulación animada del compás abriéndose desde el centro y dibujando el círculo de ROE constante.',
    },
    svgHighlights: {
      highlightType: 'swr_circle',
      defaultResistance: 2.0,
      defaultReactance: 1.0,
      showCompass: true,
      showRuler: true,
    },
    practicalQuestions: [
      {
        question: '¿Por qué la ROE se lee a la derecha del centro y no a la izquierda?',
        answer: 'Porque la ROE siempre es un valor mayor o igual a 1 (1 ≤ ROE < ∞). El lado derecho del eje real tiene valores r > 1 (coincidiendo con V_max), mientras que el lado izquierdo tiene r < 1 (que corresponde a 1/ROE = V_min).',
      },
      {
        question: 'Si el círculo de ROE tiene radio cero (un solo punto en el centro), ¿qué significa?',
        answer: 'Significa acoplamiento ideal perfecto: |Γ| = 0, ROE = 1.0, no existe onda estacionaria y toda la potencia viaja hacia la carga sin reflejos.',
      },
    ],
  },
];
