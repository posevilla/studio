
import type { SelectOption, UnitType, ResourceRecommendation, CceeScore, OxygenNeedLevelOption } from '@/types/triage';

// Extend SelectOption for FEP_LEVELS to include textColorClassName, iconSrc, and iconAiHint
export interface FepLevelOption extends SelectOption<CceeScore> {
  bgColorClassName: string;
  hoverBgColorClassName: string;
  textColorClassName: string;
  iconSrc?: string;
  iconAiHint?: string;
}

export const FEP_LEVELS: FepLevelOption[] = [
  {
    value: 1,
    label: 'Nivel 1 - Verde',
    description: 'Evacuación MUY FÁCIL: Puede evacuar él solo (sin ayuda de ningún tipo).',
    bgColorClassName: 'bg-green-500',
    hoverBgColorClassName: 'hover:bg-green-600',
    textColorClassName: 'text-black dark:text-white',
    iconSrc: '/images/fep-level-1.png',
    iconAiHint: 'stick figure evacuation'
  },
  {
    value: 2,
    label: 'Nivel 2 - Amarillo',
    description: 'Evacuación FÁCIL: Puede evacuar con POCA ayuda (de otros enfermos/residentes, familiares, etc.). Uso de bastón, muletas, andador o apoyado, a buen ritmo.',
    bgColorClassName: 'bg-yellow-400',
    hoverBgColorClassName: 'hover:bg-yellow-500',
    textColorClassName: 'text-black dark:text-gray-800',
    iconSrc: '/images/fep-level-2.png',
    iconAiHint: 'mobility aids'
  },
  {
    value: 3,
    label: 'Nivel 3 - Naranja',
    description: 'Evacuación COMPLICADA: Necesita ayuda. Uso de bastón, muletas, andador o apoyado, pero NO a buen ritmo, o silla de ruedas autónoma/ayudada (no personal centro).',
    bgColorClassName: 'bg-orange-500',
    hoverBgColorClassName: 'hover:bg-orange-600',
    textColorClassName: 'text-black dark:text-white',
    iconSrc: '/images/fep-level-3.png',
    iconAiHint: 'wheelchair assistance'
  },
  {
    value: 4,
    label: 'Nivel 4 - Rojo',
    description: 'Evacuación DIFÍCIL: Necesita ayuda del personal del centro (una persona).',
    bgColorClassName: 'bg-red-600',
    hoverBgColorClassName: 'hover:bg-red-700',
    textColorClassName: 'text-white',
    iconSrc: '/images/fep-level-4.png',
    iconAiHint: 'stretcher wheelchair'
  },
  {
    value: 5,
    label: 'Nivel 5 - Azul',
    description: 'Evacuación MUY DIFÍCIL: Necesita ayuda y soporte del personal del centro (dos o más personas).',
    bgColorClassName: 'bg-blue-600',
    hoverBgColorClassName: 'hover:bg-blue-700',
    textColorClassName: 'text-white',
    iconSrc: '/images/fep-level-5.png',
    iconAiHint: 'stretcher emergency'
  },
];

export const OXYGEN_NEED_LEVELS: OxygenNeedLevelOption[] = [
  {
    value: 1,
    label: 'No Precisa',
    description: 'No Precisa, respiración eupneica o que no requiere oxigeno medicinal - O2.',
    litersPer24h: 0
  },
  {
    value: 2,
    label: 'Nebulizaciones Pautadas',
    description: 'Tratamiento con nebulizaciones o aerosoles, de forma pautada, por lo que necesitará oxígeno por periodos de tiempo limitado, al recibir tratamiento.\nCálculo de la Previsión necesidades de oxígeno para 24 horas: Una nebulización con oxígeno (las de aire precisarían balas de aire comprimido, menos abundantes en el entorno hospitalario, o tomas de pared de aire y/o aparato nebulizador enchufado a corriente eléctrica), requiere un caudal mínimo de 6 l/min de oxígeno medicinal, durante 10 a 15 minutos, lo que nos deja un consumo de oxígeno de (6 l/min. X 15 min.=) 90 litros, para 4 nebulizaciones cada 24 horas (pauta c/8h y una extra de rescate, o c/6h), por lo que nos deja un gasto de (90 litros/Nebulización x 4 Nebulizaciones =) 360 litros/24h, luego necesitaremos al menos una bala de 2 litros a 200 bares (= 400 litros) para ese paciente.',
    litersPer24h: 360
  },
  {
    value: 3,
    label: 'Oxígeno Bajo Caudal',
    description: 'El enfermo necesita aporte de oxígeno medicinal de forma continua, a bajo caudal, por gafas nasales o mascarilla tipo venturi, a 7 litros por minutos (l.p.m) o menos.\nPrevisión necesidades de oxígeno para 24 horas: (7 l/min. X 60 min.= 420 litros a la hora), para oxigenoterapia las 24 h (420 litros/h x 24h =) 10.080 litros/24h, por lo que necesitaremos al menos una bala de 50 litros a 200 bares (= 10000 litros) para ese paciente*2.',
    litersPer24h: 10080
  },
  {
    value: 4,
    label: 'Oxígeno Alto Caudal',
    description: 'El enfermo precisa aporte de oxígeno continuamente, a alto caudal, por mascarilla venturi o de reservorio, de 7 a 15 l.p.m. Pacientes con C.P.A.P nocturno.\nPrevisión necesidades de oxígeno para 24 horas: (15 l/min. X 60 min.= 900 litros a la hora), para oxigenoterapia las 24 h (900 litros/h x 24h =) 21.600 litros/24h, por lo que necesitaremos al menos DOS balas de 50 litros a 200 bares (= 20000 litros) para ese paciente*2.',
    litersPer24h: 21600
  },
  {
    value: 5,
    label: 'Ventilación Mecánica',
    description: 'Pacientes con intubación oro o naso traqueal y/o con ventilación mecánica NO invasiva de forma permanente. Necesitan respirador/ventilador o soporte respiratorio con bolsa de reanimación tipo Ambu © y oxígeno a alto flujo y caudal.\nPrevisión necesidades de oxígeno para 24 horas: para un paciente estándar, con FiO2 al 100% (No Air Mix), el volumen minuto de gas que como máximo necesitará el paciente será de 20 l/min (oxígeno puro) (20 l/min. X 60 min.= 1200 litros a la hora), para oxigenoterapia las 24 h (1200 litros/h x 24h =) 28.800 litros/24h, por lo que necesitaremos al menos TRES balas de 50 litros a 200 bares (= 30000 litros) para ese paciente.',
    litersPer24h: 28800
  },
];

export const VITAL_SIGNS_LEVELS: SelectOption<CceeScore>[] = [
  { value: 1, label: 'Por Turno', description: 'Control de constantes vitales básicas 1 vez/turno (c/8-10h).' },
  { value: 2, label: 'Cada 4h o menos', description: 'Medir/valorar al menos una constante vital c/4h o menos.' },
  { value: 3, label: 'Cada 2h o menos', description: 'Supervisión más continua, al menos una constante vital c/2h o menos.' },
  { value: 4, label: 'Constantes Modifican Medicación', description: 'Alteraciones de alguna constante vital implican cambio en tto. farmacológico.' },
  { value: 5, label: 'Monitorización', description: 'Al menos una constante vital monitorizada continuamente. UCI/UVI, telemetría.' },
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

// Helper to get FEP level details by value
export const getFepLevelInfo = (value: CceeScore | undefined): FepLevelOption | undefined => {
  if (value === undefined) return undefined;
  return FEP_LEVELS.find(level => level.value === value);
};

