import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Initialize GoogleGenAI if GEMINI_API_KEY is present
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Socratic Tutor Endpoint
app.post('/api/socratic-tutor', async (req: Request, res: Response) => {
  const { questionIndex, questionText, studentAnswer, conversationHistory } = req.body;

  if (!studentAnswer || typeof studentAnswer !== 'string') {
    return res.status(400).json({ error: 'La respuesta del estudiante es requerida.' });
  }

  const systemInstruction = `
Eres el "Profesor Tutor Socrático de Teoría Electromagnética (ETF-1026)" del Instituto Tecnológico Superior de Comalcalco (ITSC).
Tu misión es evaluar con el método socrático si el estudiante de Ingeniería Electrónica comprende conceptual y manualmente el uso de la Carta de Smith.

Preguntas del programa de evaluación:
1. "¿Por qué cuando buscamos la Impedancia de Entrada Zin a lo largo de una línea de transmisión nos desplazamos en sentido horario ('Hacia el Generador' / WTG) en la escala exterior de la Carta de Smith?"
   - Concepto clave: El observador viaja desde la carga hacia la fuente (generador), lo que acumula un desfasamiento de e^{+j2\beta d} en el coeficiente de reflexión (\Gamma(d) = \Gamma_L e^{-j2\beta d} visto desde generador hacia carga, o rotar en sentido horario hacia la fuente). Cada vuelta de 360° en la carta equivale a media longitud de onda \lambda/2 (0.5\lambda).
2. "Al medir la Relación de Onda Estacionaria (ROE o SWR) con el compás apoyado en el centro (1, 0), ¿en qué parte exacta del eje real horizontal se lee directamente el valor numérico de la ROE y por qué?"
   - Concepto clave: Se lee en la intersección del círculo de ROE con el eje real a la DERECHA del centro (donde r > 1 y x = 0). En ese punto, el voltaje es máximo (Vmax) y la impedancia es puramente resistiva máxima: r = SWR = (1+|\Gamma|)/(1-|\Gamma|). En el lado izquierdo (r < 1) se lee 1/SWR (mínimo de voltaje).
3. "Para calcular un acoplamiento mediante stub simple en derivación (paralelo), ¿por qué es indispensable convertir primero la impedancia de carga zL a admitancia yL trazando una recta diametral a 180° (\lambda/4) en la carta?"
   - Concepto clave: En conexiones en paralelo (shunt), las admitancias se suman directamente (Y_total = Y_linea + Y_stub), mientras que las impedancias en paralelo requieren cálculo recíproco complejo. La rotación de 180° equivale a sumar \lambda/4 (cuarto de onda) en la línea, transformando z en su inverso y = 1/z = g + jb.

Instrucciones de Respuesta:
1. Responde en tono universitario, motivador, riguroso pero empático, citando al ITSC.
2. Determina si la respuesta del estudiante demuestra una comprensión suficiente del concepto manual/físico.
3. Si la respuesta es correcta o muy cercana, felicítalo, sintetiza la regla práctica con compás y regla, y marca "passed": true.
4. Si la respuesta es incompleta o incorrecta, haz una repregunta socrática guiándolo a notar qué sucede físicamente (p. ej. "¿Recuerdas qué le pasa a los voltajes en paralelo frente a los voltajes en serie?"), y marca "passed": false.
5. Devuelve SIEMPRE un JSON con este formato exacto:
{
  "feedback": "Texto de retroalimentación pedagógica y socrática (en markdown breve)",
  "passed": true o false,
  "keyTakeaway": "Resumen técnico de 1 oración para recordar al trabajar con regla y compás"
}
`;

  if (ai) {
    try {
      const prompt = `
Pregunta #${questionIndex + 1}: ${questionText}
Respuesta del alumno: "${studentAnswer}"

Historial previo: ${JSON.stringify(conversationHistory || [])}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
      });

      const responseText = response.text || '{}';
      const parsed = JSON.parse(responseText);
      return res.json(parsed);
    } catch (err) {
      console.error('Error invoking Gemini model, falling back to heuristic evaluation:', err);
    }
  }

  // Heuristic pedagogical evaluator fallback if Gemini is not available or errored
  const answerLower = studentAnswer.toLowerCase();
  let passed = false;
  let feedback = '';
  let keyTakeaway = '';

  if (questionIndex === 0) {
    // WTG / Sentido horario
    const keywords = ['generador', 'fuente', 'longitud', 'onda', 'wtg', 'fase', 'horario', 'distancia', 'beta', 'media onda', '0.5'];
    const hits = keywords.filter(k => answerLower.includes(k)).length;
    if (hits >= 2 || answerLower.length > 35) {
      passed = true;
      feedback = `¡Excelente razonamiento para el ITSC! Al desplazarnos desde la carga hacia la fuente (generador), nos movemos en la dirección de 'Wavelengths Toward Generator' (WTG), lo que incrementa el ángulo de fase en sentido de las manecillas del reloj. Recuerda que una vuelta completa de 360° en la carta equivale a media longitud de onda ($0.5\\lambda$).`;
      keyTakeaway = `Regla con compás: Siempre gira en sentido horario cuando avanzas desde la antena o carga hacia el transmisor/generador.`;
    } else {
      passed = false;
      feedback = `Vas por buen camino, pero profundicemos socráticamente: cuando te paras en la antena ($Z_L$) y caminas a lo largo de la línea coaxial hacia el transmisor (fuente), ¿hacia qué elemento te estás dirigiendo? Observa la leyenda exterior de la Carta de Smith que dice *Wavelengths Toward Generator*. ¿Por qué crees que avanza en sentido de las manecillas del reloj?`;
      keyTakeaway = `Pista: Identifica el punto de inicio (Carga) y el destino (Generador) y revisa la flecha exterior 'WTG'.`;
    }
  } else if (questionIndex === 1) {
    // ROE en eje real a la derecha
    const keywords = ['derecha', 'real', 'vmax', 'maximo', 'resistiv', 'voltaje', 'r > 1', 'resistencia', 'swr'];
    const hits = keywords.filter(k => answerLower.includes(k)).length;
    if (hits >= 2 || answerLower.includes('derecha') || (answerLower.includes('eje') && answerLower.includes('max'))) {
      passed = true;
      feedback = `¡Correcto! En la Carta de Smith, el círculo trazado con compás apoyado en el centro $(1, 0)$ cruza el eje horizontal en dos puntos. En el cruce a la **derecha** ($r > 1$), la reactancia es nula ($x=0$) y la impedancia es puramente resistiva y máxima, coincidiendo con el máximo de voltaje ($V_{max}$). Por ello, el valor de $r$ en ese punto es exactamente la ROE (SWR).`;
      keyTakeaway = `Uso del compás: Abre el compás del centro a $z_L$, traza el círculo y lee el valor donde corta el eje real a la derecha ($r_{max} = \\text{ROE}$).`;
    } else {
      passed = false;
      feedback = `Buen intento. Reflexionemos con la regla: el círculo de ROE corta el eje real horizontal en dos extremos (uno a la izquierda del centro donde $r < 1$ y otro a la derecha donde $r > 1$). Dado que la ROE siempre es mayor o igual a 1 ($1 \\le \\text{ROE} < \\infty$), ¿en cuál de los dos lados (izquierda o derecha) se debe leer directamente?`;
      keyTakeaway = `Pista: Como la ROE siempre es $\\ge 1$, debe ubicarse donde la escala de resistencia $r$ sea mayor a 1.`;
    }
  } else if (questionIndex === 2) {
    // Admitancia yL rotación 180°
    const keywords = ['paralelo', 'sumar', 'admitancia', '180', 'inverso', 'cuarto', 'lambda/4', 'shunt', 'stub'];
    const hits = keywords.filter(k => answerLower.includes(k)).length;
    if (hits >= 2 || answerLower.includes('paralelo') || answerLower.includes('sum')) {
      passed = true;
      feedback = `¡Exactamente! En circuitos con stubs en derivación (paralelo), las admitancias se suman de forma directa: $Y_{total} = Y_{linea} + Y_{stub}$. Si trabajáramos con impedancias, requeriríamos la engorrosa fórmula del paralelo complejo. Al rotar $180^\\circ$ (un cuarto de onda, $\\lambda/4$), pasamos de $z$ a $y = 1/z = g + jb$ de manera puramente gráfica con la regla.`;
      keyTakeaway = `Trazo con regla: Apoya la regla en $z_L$ y en el centro $(1, 0)$, proyecta la línea recta al extremo opuesto del círculo de ROE para marcar $y_L$.`;
    } else {
      passed = false;
      feedback = `Pensemos en tus clases de Circuitos Eléctricos: cuando tienes dos componentes en serie, sumas sus impedancias ($Z_1 + Z_2$). Pero cuando conectas un stub en **paralelo** (derivación), ¿qué magnitud es la que se suma directamente sin tener que calcular recíprocos? ¿Qué relación geométrica tiene el punto diametralmente opuesto a $180^\\circ$?`;
      keyTakeaway = `Pista: En paralelo las admitancias se suman algebraicamente ($Y_T = Y_0 + Y_s$).`;
    }
  }

  return res.json({
    feedback,
    passed,
    keyTakeaway,
  });
});

// Configure Vite in dev or static files in production
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
