
import type { SelectOption, UnitType, ResourceRecommendation, CceeScore } from '@/types/triage';

// Extend SelectOption for FEP_LEVELS to include textColorClassName, iconSrc, and iconAiHint
export interface FepLevelOption extends SelectOption<CceeScore> {
  textColorClassName: string;
  iconSrc?: string;
  iconAiHint?: string;
}

export const FEP_LEVELS: FepLevelOption[] = [
  { 
    value: 1, 
    label: 'Nivel 1 - Verde', 
    description: 'Evacuación MUY FÁCIL: Puede evacuar él solo (sin ayuda de ningún tipo).', 
    color: 'bg-green-500 hover:bg-green-600', 
    textColorClassName: 'text-black',
    iconSrc: 'https://placehold.co/40x32.png', 
    iconAiHint: 'stick figure evacuation' 
  },
  { 
    value: 2, 
    label: 'Nivel 2 - Amarillo', 
    description: 'Evacuación FÁCIL: Puede evacuar con POCA ayuda (de otros enfermos/residentes, familiares, etc.). Uso de bastón, muletas, andador o apoyado, a buen ritmo.', 
    color: 'bg-yellow-400 hover:bg-yellow-500', 
    textColorClassName: 'text-black',
    iconSrc: 'https://placehold.co/40x32.png',
    iconAiHint: 'mobility aids' 
  },
  { 
    value: 3, 
    label: 'Nivel 3 - Naranja', 
    description: 'Evacuación COMPLICADA: Necesita ayuda. Uso de bastón, muletas, andador o apoyado, pero NO a buen ritmo, o silla de ruedas autónoma/ayudada (no personal centro).', 
    color: 'bg-orange-500 hover:bg-orange-600', 
    textColorClassName: 'text-black',
    iconSrc: 'https://placehold.co/40x32.png',
    iconAiHint: 'wheelchair assistance'
  },
  { 
    value: 4, 
    label: 'Nivel 4 - Rojo', 
    description: 'Evacuación DIFÍCIL: Necesita ayuda del personal del centro (una persona).', 
    color: 'bg-red-600 hover:bg-red-700', 
    textColorClassName: 'text-white',
    iconSrc: 'https://placehold.co/40x32.png',
    iconAiHint: 'stretcher wheelchair'
  },
  { value: 5, label: 'Nivel 5 - Azul', description: 'Evacuación MUY DIFÍCIL: Necesita ayuda y soporte del personal del centro (dos o más personas).', color: 'bg-blue-600 hover:bg-blue-700', textColorClassName: 'text-white' },
];

export const OXYGEN_NEED_LEVELS: SelectOption<CceeScore>[] = [
  { value: 1, label: 'No Precisa', description: 'Respiración eupneica, no requiere O2.' },
  { value: 2, label: 'NEB Pautadas', description: 'Nebulizaciones/aerosoles pautados, O2 por periodos limitados.' },
  { value: 3, label: 'Oxígeno Bajo Caudal', description: 'Aporte continuo de O2 a bajo caudal (≤7 l.p.m.).' },
  { value: 4, label: 'Oxígeno Alto Caudal', description: 'Aporte continuo de O2 a alto caudal (7-15 l.p.m.). CPAP nocturno.' },
  { value: 5, label: 'Ventilación Mecánica', description: 'VM invasiva o no invasiva permanente. Necesita respirador/Ambu.' },
];

export const VITAL_SIGNS_LEVELS: SelectOption<CceeScore>[] = [
  { value: 1, label: 'Por Turno', description: 'Control de CSV básicas 1 vez/turno (c/8-10h).' },
  { value: 2, label: 'Cada 4h o menos', description: 'Medir/valorar al menos una CSV c/4h o menos.' },
  { value: 3, label: 'Cada 2h o menos', description: 'Supervisión más continua, al menos una CSV c/2h o menos.' },
  { value: 4, label: 'Constantes Modifican Medicación', description: 'Alteraciones de CSV implican cambio en tto. farmacológico.' },
  { value: 5, label: 'Monitorización', description: 'Al menos una CSV monitorizada continuamente. UCI/UVI, telemetría.' },
];

export const MEDICATION_NUTRITION_LEVELS: SelectOption<CceeScore>[] = [
  { value: 1, label: 'No Precisa', description: 'No precisa tto. médico/farmacológico.' },
  { value: 2, label: 'Sólo Vía Oral', description: 'Solo medicamentos vía oral (excluye SNG).' },
  { value: 3, label: 'SNG / IV. Puntual', description: 'Alimentación/medicación por SNG o IV puntual (bolo/sueros).' },
  { value: 4, label: 'Sueroterapia / Nutri. Enteral', description: 'Sueros 24h o nutrición enteral (caída libre/bomba).' },
  { value: 5, label: 'Bomba Perfusión / Nutri. Parenteral', description: 'Medicación IV/sueros por bomba perfusión. Nutrición parenteral.' },
];

export const UNIT_TYPES: SelectOption<UnitType>[] = [
  { value: 'hospitalization', label: 'Hospitalización / Residencia Mayores', description: 'Unidad de hospitalización general o residencia de mayores.' },
  { value: 'psychiatric', label: 'Psiquiátrica', description: 'Unidad de atención psiquiátrica.' },
  { value: 'penitentiary', label: 'Penitenciaria', description: 'Unidad en centro penitenciario.' },
  { value: 'icu', label: 'UCI / UVI', description: 'Unidad de Cuidados Intensivos o Vigilancia Intensiva.' },
  { value: 'isolation', label: 'Aislamiento / NRBQ', description: 'Unidad de aislamiento o pacientes expuestos a NRBQ.' },
];

export const UNIT_SPECIFIC_SCALES: Record<UnitType, SelectOption<CceeScore>[]> = {
  hospitalization: [
    { value: 1, label: 'I.A.B.V.D', description: 'Independiente para actividades básicas de la vida diaria.' },
    { value: 2, label: 'I.A.B.V.D con Ayuda', description: 'Independiente para A.B.V.D. pero necesita ayuda para ciertas acciones (movilidad).' },
    { value: 3, label: 'D.A.B.V.D', description: 'Totalmente dependiente para A.B.V.D.' },
    { value: 4, label: 'Contención Farmacológica', description: 'Precisa tto. de contención farmacológica (parcial/total).' },
    { value: 5, label: 'Contención Mecánica', description: 'Contenido mecánicamente (cintura, MMSS, MMII).' },
  ],
  psychiatric: [
    { value: 1, label: 'Autónomo', description: 'No precisa vigilancia/supervisión especial. Colabora, sin riesgo de fuga.' },
    { value: 2, label: 'Necesita Supervisión', description: 'Necesita ser supervisado, guiado, controlado. Colabora con mínimo control.' },
    { value: 3, label: 'Peligro de Fuga', description: 'Debe ser controlado por riesgo de escaparse.' },
    { value: 4, label: 'Contención Farmacológica', description: 'Precisa tto. de contención farmacológica (parcial/total).' },
    { value: 5, label: 'Contención Mecánica', description: 'Contenido mecánicamente (cintura, MMSS, MMII, grilletes).' },
  ],
  penitentiary: [
    { value: 1, label: 'Sin Grilletes', description: 'Colabora, no precisa vigilancia/grilletes.' },
    { value: 2, label: 'Grilletes por Delante', description: 'Mínimo riesgo, engrilletado por delante. Necesita vigilancia FFCCSS/Seg. Privada.' },
    { value: 3, label: 'Grilletes por Detrás', description: 'Precisa vigilancia directa de al menos un agente.' },
    { value: 4, label: 'Reo Peligroso', description: 'Presencia y vigilancia policial permanente o seg. privada (2 vigilantes).' },
    { value: 5, label: 'Reo Muy Peligroso', description: 'Alto riesgo de fuga, comportamiento violento. Férreo control policial (agente armado).' },
  ],
  icu: [
    { value: 1, label: 'SOFA 0-1', description: 'Pacientes UCI/UVI/Rea sin riesgo de complicación.' },
    { value: 2, label: 'SOFA 2-5', description: 'Limitado riesgo de complicación.' },
    { value: 3, label: 'SOFA 6-8', description: 'Alto riesgo de complicación, mucha necesidad de cuidados.' },
    { value: 4, label: 'SOFA 9-11', description: 'Muy alto riesgo de complicaciones, numerosos cuidados.' },
    { value: 5, label: 'SOFA >12', description: 'Tolera muy mal ser movilizado, alto riesgo de muerte.' },
  ],
  isolation: [
    { value: 1, label: 'Sin Aislamiento', description: 'No necesidad de aislamiento (ni inverso).' },
    { value: 2, label: 'Aislamiento Básico', description: 'Nivel básico de aislamiento de contacto o inverso. EPI: protección parcial (PB) o trajes tipo 6, FFP3, guantes, gafas.' },
    { value: 3, label: 'NRBQ Nivel I EPI', description: 'EPI Nivel I (Trajes tipo 3,4,5,6), máscaras/semimáscaras FFP3, guantes, gafas antisalpicadura.' },
    { value: 4, label: 'NRBQ Nivel II EPI', description: 'EPI Nivel II (Traje tipo 2 escafandra/buzo), botas/guantes sellados, E.R.A.' },
    { value: 5, label: 'NRBQ Nivel III EPI', description: 'EPI Nivel III (Traje tipo 1 integral), botas/guantes sellados, E.R.A.' },
  ],
};

export const RESOURCE_RECOMMENDATIONS: ResourceRecommendation[] = [
  { scoreRange: '5-9', type: 'A - A1 o A2 Transporte', crew: 'TES' },
  { scoreRange: '10-14', type: 'B - USVB', crew: '2 TES' },
  { scoreRange: '15-19', type: 'C - USVA.E', crew: 'TES-ENF' },
  { scoreRange: '20-25', type: 'C - USVA.M', crew: 'TES-ENF-MED' },
];

export const getResourceRecommendation = (score: number): ResourceRecommendation | undefined => {
  if (score >= 5 && score <= 9) return RESOURCE_RECOMMENDATIONS[0];
  if (score >= 10 && score <= 14) return RESOURCE_RECOMMENDATIONS[1];
  if (score >= 15 && score <= 19) return RESOURCE_RECOMMENDATIONS[2];
  if (score >= 20 && score <= 25) return RESOURCE_RECOMMENDATIONS[3];
  return undefined;
};

