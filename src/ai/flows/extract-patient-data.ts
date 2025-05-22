'use server';

/**
 * @fileOverview Extracts patient data from notes and lab results to pre-fill the C.C.E.E. form.
 *
 * - extractPatientData - A function that extracts patient data from notes and lab results.
 * - ExtractPatientDataInput - The input type for the extractPatientData function.
 * - ExtractPatientDataOutput - The return type for the extractPatientData function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractPatientDataInputSchema = z.object({
  patientNotes: z
    .string()
    .describe('The patient notes, including observations and medical history.'),
  labResults: z
    .string()
    .describe('The patient lab results, including blood tests and other relevant data.'),
});
export type ExtractPatientDataInput = z.infer<typeof ExtractPatientDataInputSchema>;

const ExtractPatientDataOutputSchema = z.object({
  fep: z
    .number()
    .optional()
    .describe('The F.E.P. score of the patient (1-5), derived from the patient notes.'),
  oxygenNeed: z
    .number()
    .optional()
    .describe('The oxygen need score (1-5), derived from the patient notes.'),
  vitalSignsControl: z
    .number()
    .optional()
    .describe('The vital signs control score (1-5), derived from the patient notes and lab results.'),
  medicationAndNutrition: z
    .number()
    .optional()
    .describe('The medication and nutrition score (1-5), derived from the patient notes.'),
  unitSpecificScale: z
    .number()
    .optional()
    .describe('The unit-specific scale score (1-5), derived from the patient notes.'),
  reasoning: z
    .string()
    .describe('The reasoning behind the extracted data, including specific data points used.'),
});
export type ExtractPatientDataOutput = z.infer<typeof ExtractPatientDataOutputSchema>;

export async function extractPatientData(input: ExtractPatientDataInput): Promise<ExtractPatientDataOutput> {
  return extractPatientDataFlow(input);
}

const extractPatientDataPrompt = ai.definePrompt({
  name: 'extractPatientDataPrompt',
  input: {schema: ExtractPatientDataInputSchema},
  output: {schema: ExtractPatientDataOutputSchema},
  prompt: `You are an AI assistant designed to extract patient data from notes and lab results to pre-fill the C.C.E.E. form.

  Based on the provided patient notes and lab results, extract the following information and provide a score from 1-5 for each category:

  - F.E.P. (Facilidad de Evacuación del Paciente): {{$FEPDescription}}
  - Oxygen Need: {{$OxygenNeedDescription}}
  - Vital Signs Control: {{$VitalSignsControlDescription}}
  - Medication and Nutrition: {{$MedicationAndNutritionDescription}}
  - Unit Specific Scale: {{$UnitSpecificScaleDescription}}

  Provide a reasoning for each score, referencing specific data points from the patient notes and lab results.

  Patient Notes: {{{patientNotes}}}
  Lab Results: {{{labResults}}}

  Output the data in JSON format.
  Make sure that all values are present, even if you have to make a guess. Always favor including a guess over leaving a null value.
  `,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_ONLY_HIGH',
      },
    ],
  },
});

const extractPatientDataFlow = ai.defineFlow(
  {
    name: 'extractPatientDataFlow',
    inputSchema: ExtractPatientDataInputSchema,
    outputSchema: ExtractPatientDataOutputSchema,
  },
  async input => {
    const descriptions = {
      $FEPDescription: `
        1.- Nivel 1 y color VERDE. Evacuación MUY FÁCIL: Puede evacuar él solo (sin ayuda de ningún tipo).
        2.- Nivel 2 y color AMARILLO. Evacuación FÁCIL: Puede evacuar con POCA ayuda (de otros enfermos/residentes, familiares, acompañantes o visitas). Uso de bastón, una o dos muletas, andador o apoyado en otra persona, a buen ritmo.
        3.- Nivel 3 y color NARANJA. Evacuación COMPLICADA: Necesita ayuda para ser evacuado. Uso de bastón, muleta o muletas, andador o apoyado en otra persona, pero NO a buen ritmo*1, o que use silla de ruedas impulsada de forma autónoma o por otra persona (que no sea personal del centro).
        4.- Nivel 4 y color ROJO. Evacuación DIFÍCIL: Necesita ayuda del personal del centro para ser evacuado (una persona, personal del centro o de los equipos de seguridad o emergencia externos).
        5.- Nivel 5 y color AZUL. Evacuación MUY DIFÍCIL: Necesita ayuda y soporte del personal del centro para ser evacuado (dos o más profesionales/personas del centro o personal de seguridad o servicios de emergencia externos).
      `,
      $OxygenNeedDescription: `
        1-No Precisa: No Precisa, respiración eupneica o que no requiere oxigeno medicinal - O2.
        2-NEB Pautadas: tratamiento con nebulizaciones o aerosoles, de forma pautada, por lo que necesitará oxígeno por periodos de tiempo limitado, al recibir tratamiento.
        3-Oxígeno Bajo Caudal: el enfermo necesita aporte de oxígeno medicinal de forma continua, a bajo caudal, por gafas nasales o mascarilla tipo venturi, a 7 litros por minutos (l.p.m) o menos.
        4-Oxígeno Alto Caudal: el enfermo precisa aporte de oxígeno continuamente, a alto caudal, por mascarilla venturi o de reservorio, de 7 a 15 l.p.m. Pacientes con C.P.A.P nocturno.
        5-Ventilación mecánica invasiva o no invasiva: pacientes con intubación oro o naso traqueal y/o con ventilación mecánica NO invasiva de forma permanente. Necesitan respirador/ventilador o soporte respiratorio con bolsa de reanimación tipo Ambu © y oxígeno a alto flujo y caudal.
      `,
      $VitalSignsControlDescription: `
        1- Por Turno: vigilancia de las constantes vitales básicas una vez cada OCHO/DIEZ horas, por turno, normalmente en el inicio de cada turno, tras el relevo. Deberemos disponer de material y personal para hacerlo sólo una vez, si la evacuación se prolonga más de 8 horas.
        2- Cada 4 horas o menos: implica la necesidad de medir y valorar al menos, una constante vital del enfermo, cada 4 horas o menos.
        3- Cada 2 horas o menos: nos obliga a disponer de una supervisión más continua, de al menos una constante vital de estos enfermos, con la necesidad de medios y recursos que ello implica, cada 2 horas o menos.
        4- Constantes modifican medicación: alteraciones de al menos una constante vital del paciente, implican el cambio en el tratamiento médico-farmacológico del enfermo, suponiendo no sólo la vigilancia pautada de ese o esos signos vitales, sino que además deberemos tomar decisiones y modificar cuidados o tratamientos, acorde a lo pautado en cada caso (p.ej.:pautas móviles de insulina, medicación anti-hipertensiva, control del dolor, antitérmicos,…)
        5- Monitorización: el paciente precisa tener al menos una constante vital monitorizada continuamente, lo que implica su vigilancia, registro y la consiguiente necesidad de medios técnicos y recursos humanos. Pacientes de UCI/UVI, reanimación o despertar de quirófano y/o con telemetría.
      `,
      $MedicationAndNutritionDescription: `
        1- No Precisa: paciente NO precisa tratamiento médico / farmacológico.
        2- Sólo Vía Oral: enfermos que sólo precisen la toma pautada de medicamentos por vía oral, excluidos los de uso por Sonda Nasogástrica o sistemas de alimentación similares.
        3- SNG / IV. Puntual: pacientes que reciben alimentación y/o medicación por Sonda Nasogástrica (SNG) o que tienen pautados tratamiento con medicación intra-venosa de forma puntual, en bolo o disuelta en sueros.
        4- Sueroterapia / Nutri. Enteral: enfermos que tienen pauta de sueros las 24 horas, alternos o en Y, a caída libre o con dispositivos dosi-flow, por medio de vías venosas periféricas, o que precisan nutrición enteral a caída libre o por bomba.
        5- Bomba de perfusión / Nutri. Parenteral: pacientes que reciben medicación intravenosa o sueroterapia, por medio de vías venosas periféricas o centrales (también centrales de acceso periférico) mediante bombas de perfusión o infusión, volumétricas o de jeringa. Enfermos con nutrición parenteral por vía central.
      `,
      $UnitSpecificScaleDescription: `
        a. Unidad de hospitalización o residencia de mayores.
        1- I.A.B.V.D: paciente es independiente para las actividades básicas de la vida diaria.
        2- I.A.B.V.D con ayuda: enfermo es independiente para las actividades básicas de la vida diaria, pero necesita ayuda para realizar ciertas acciones, teniendo en cuenta sobre todo las que se refieren y comprometen su movilidad y rapidez de la misma.
        3- D.A.B.V.D: paciente es totalmente dependiente para las actividades básicas de la vida diaria.
        4- Contención farmacológica: residente precisa tratamiento de contención farmacológica parcial o total, para mantenerse calmado y/o colaborar.
        5- Contención mecánica: persona que está contenida mecánicamente para evitar que se lesione, agreda a otros y/o se fugue. Contenciones de cintura, M.M.S.S. y/o M.M.I.I.
        b. Unidad psiquiátrica.
        1- Autónomo: paciente que no precisa vigilancia y/o supervisión especial. Colabora y no hay riesgo de fuga.
        2- Necesita supervisión: enfermo que necesita ser supervisado, guiado y controlado, pero que colabora con un mínimo control, pudiendo ser vigilado en grupo, junto a otros pacientes de similar clasificación.
        3- Peligro de fuga: paciente que debe ser controlado, por el riesgo de escaparse ante una evacuación.
        4- Contención farmacológica: enfermo que precisa tratamiento de contención farmacológica parcial o total, para mantenerse calmado y/o colaborar.
        5- Contención mecánica: paciente que está contenido mecánicamente para evitar que se lesione, agreda a otros y/o se fugue. Contenciones de cintura, M.M.S.S., M.M.I.I. y/o grilletes.
        c. Unidad penitenciaria.
        1- Sin grilletes: el reo y paciente colabora con las autoridades y el personal sanitario, no precisa vigilancia y/o grilletes.
        2- Grilletes por delante: preso de mínimo riesgo, engrilletado por delante, que colabora, pero necesita vigilancia de las F.F.C.C. de seguridad del estado o seguridad privada. Puede manejarse en grupo.
        3- Grilletes por detrás: precisa vigilancia directa de al menos un agente de la autoridad (policía o seguridad privada).
        4- Reo peligroso: necesaria presencia y vigilancia policial permanente o de seguridad privada (2 vigilantes).
        5- Reo muy peligroso: riesgo alto de fuga y comportamiento violento, precisa férreo control policial (agente armado).
        d. Unidad de cuidados o vigilancia intensiva (UCI / UVI).
        1- Escala SOFA de “0” (cero) a “1” (uno): pacientes de UCI/UVI/Rea sin riesgo de complicación.
        2- Escala SOFA de 2 a 5: enfermo de limitado riesgo de complicación.
        3- Escala SOFA de 6 a 8: riesgo alto de complicación, mucha necesidad de cuidados y moderado riesgo de sufrir complicaciones fuera de su unidad.
        4- Escala SOFA de 9 a 11: riesgo muy alto de complicaciones, necesita numerosos cuidados y alto riesgo de morbilidad o mortalidad fuera de su unidad.
        5- Escala SOFA > 12: paciente que tolera muy mal ser movilizado de su unidad, alto riesgo de muerte.
        e. Unidad de aislamiento o expuestas a sustancias N.R.B.Q (Nucleares, Radiológicas, Bilógicas y/o Químicas).
        1. Punto: en pacientes que no tienen necesidad de aislamiento (ni tan si quiera inverso).
        2. Puntos: pacientes que requieren el nivel más básico de aislamiento de contacto o aislamiento inverso. EPI compuesto de prendas de protección parcial (PB) o trajes tipo 6, con mascarilla FFP 3, guantes y gafas.
        3. Puntos: enfermos expuestos a sustancias NRBQ que precisan que el personal que los movilice, atienda y evacue, use un EPI (Equipo de Protección Individual) de Nivel I – Trajes tipo 3, 4, 5, y 6, con máscaras, semi-mascaras con elemento filtrante polivalente mínimo FFP 3, guantes y gafas anti salpicadura.
        4. Puntos: manejo de pacientes con necesidad de uso de EPI de nivel II – Traje tipo 2 escafandra o buzo con resistencia a líquidos y vapores (no a gases), con botas y guantes selladas con cinta, junto con E.R.A (Equipo de Respiración Autónoma).
        5. Puntos: asistencia y traslado de enfermos, bajo los efectos de sustancias N.R.B.Q que obligan al uso de EPI nivel III – Traje tipo 1 integral, con botas y guantes sellados con cinta y E.R.A.
      `,
    };

    const {output} = await extractPatientDataPrompt({...input, ...descriptions});
    return output!;
  }
);
