import type { WeekData } from '@/lib/types';

export const weekDataMap: Partial<Record<number, WeekData>> = {
  4: {
    week: 4, trimester: 1,
    babySize: 'poppy seed', babySizeEmoji: '🌱', babyWeight: '< 1g', babyLength: '0.2mm',
    keyDevelopment: ['Neural tube forming', 'Heart cells beginning to differentiate', 'Implantation complete'],
    neuralFact: 'First neural connections firing: ~0 (neural tube just forming)',
    momChanges: ['Progesterone surge', 'Possible early fatigue', 'Heightened smell sensitivity'],
    hormoneProfile: 'hCG doubling every 48–72 hours',
    behavioralNote: 'Heightened smell is a protective mechanism — your body is scanning for toxins before your brain knows why.',
    socialProof: '65% of people don\'t know they\'re pregnant yet at week 4.',
  },
  8: {
    week: 8, trimester: 1,
    babySize: 'raspberry', babySizeEmoji: '🫐', babyWeight: '1g', babyLength: '1.6cm',
    keyDevelopment: ['All major organs forming', 'Webbed fingers separating', 'Heartbeat detectable by ultrasound'],
    neuralFact: 'Neural connections firing: ~100,000/second (early brain organization)',
    momChanges: ['Nausea typically at peak', 'Uterus size of orange', 'Increased blood volume beginning'],
    hormoneProfile: 'hCG at peak, progesterone rising steadily',
    behavioralNote: 'Morning sickness peaks here for 73% of pregnancies. The nausea is correlated with higher hCG — paradoxically, a sign of strong implantation.',
    socialProof: '73% of people in week 8 are experiencing nausea. You are firmly in the majority.',
  },
  12: {
    week: 12, trimester: 1,
    babySize: 'lime', babySizeEmoji: '🍋', babyWeight: '14g', babyLength: '5.4cm',
    keyDevelopment: ['Reflexes developing', 'Fingers and toes fully formed', 'Kidneys beginning to function'],
    neuralFact: 'Neural connections firing: ~1,000,000/second (rapid brain development)',
    momChanges: ['Nausea often easing', 'Uterus moving above pubic bone', 'Energy may begin returning'],
    hormoneProfile: 'hCG plateauing, progesterone taking over maintenance',
    behavioralNote: 'The "T1 fog" many people describe is real — elevated progesterone demonstrably affects short-term memory and cognitive processing speed.',
    socialProof: '61% of people wait until week 12 to share their pregnancy news. You\'re likely at the decision point.',
  },
  16: {
    week: 16, trimester: 2,
    babySize: 'avocado', babySizeEmoji: '🥑', babyWeight: '100g', babyLength: '11.6cm',
    keyDevelopment: ['Facial muscles developed', 'Eyes sensitive to light', 'Ear bones hardening'],
    neuralFact: 'Neural connections firing: ~5,000,000/second',
    momChanges: ['Round ligament pain common', 'Appetite increasing', 'Possible first movements (flutters)'],
    hormoneProfile: 'Estrogen rising, relaxin loosening ligaments',
    behavioralNote: 'Relaxin doesn\'t just affect physical ligaments — it impacts emotional flexibility too. Mood variability in T2 has a documented hormonal basis.',
    socialProof: '81% of people report improved energy by week 16. If you\'re not there yet, you\'re in the 19% — also normal.',
  },
  20: {
    week: 20, trimester: 2,
    babySize: 'banana', babySizeEmoji: '🍌', babyWeight: '300g', babyLength: '25.6cm',
    keyDevelopment: ['Vernix caseosa forming', 'Taste buds developing', 'Regular sleep/wake cycles'],
    neuralFact: 'Neural connections firing: ~40,000/second (peak synaptic density phase)',
    momChanges: ['Halfway point', 'Anatomy scan week', 'Belly button may begin protruding'],
    hormoneProfile: 'Estrogen/progesterone balance stabilizing',
    behavioralNote: 'Week 20 is statistically the highest energy week of pregnancy — most people don\'t realize this while they\'re in it. Your emotional bandwidth is at its peak.',
    socialProof: '78% of people describe week 20 as the week they "finally felt pregnant" in a good way.',
  },
  24: {
    week: 24, trimester: 2,
    babySize: 'corn cob', babySizeEmoji: '🌽', babyWeight: '600g', babyLength: '30cm',
    keyDevelopment: ['Lung development accelerating', 'Brain growing rapidly', 'Viability milestone'],
    neuralFact: 'Neural connections firing: ~100,000/second (prefrontal cortex beginning to develop)',
    momChanges: ['Glucose tolerance test window', 'Braxton Hicks may begin', 'Possible lower back pain'],
    hormoneProfile: 'Cortisol beginning to rise alongside progesterone',
    behavioralNote: 'Cortisol elevations (which begin here and peak in T3) are associated with heightened emotional sensitivity. This is physiological, not psychological.',
    socialProof: '54% of people scheduled their glucose test this week. The window is weeks 24–28.',
  },
  28: {
    week: 28, trimester: 3,
    babySize: 'eggplant', babySizeEmoji: '🍆', babyWeight: '1kg', babyLength: '37.6cm',
    keyDevelopment: ['Eyes opening for first time', 'REM sleep cycles beginning', 'Brain weight tripling this trimester'],
    neuralFact: 'Neural connections firing: ~250,000/second (rapid synaptic pruning)',
    momChanges: ['Third trimester begins', 'Heartburn increasingly common', 'Sleep positions becoming restricted'],
    hormoneProfile: 'Prolactin rising, cortisol elevated',
    behavioralNote: 'REM sleep begins for your baby this week. Your dreams may be more vivid too — elevated progesterone disrupts REM architecture, producing stranger, more memorable dreams.',
    socialProof: '67% of people report changing their birth plan at least once after week 28.',
  },
  32: {
    week: 32, trimester: 3,
    babySize: 'butternut squash', babySizeEmoji: '🎃', babyWeight: '1.7kg', babyLength: '42.4cm',
    keyDevelopment: ['Lungs nearly mature', 'Fingernails reaching fingertips', 'Rapid fat accumulation begins'],
    neuralFact: 'Neural connections firing: ~500,000/second (highest density of any developmental stage)',
    momChanges: ['Shortness of breath common', 'Frequent urination intensifying', 'Nesting instinct often peaks'],
    hormoneProfile: 'Oxytocin receptors increasing, cortisol at T3 high',
    behavioralNote: 'The nesting instinct is documented biology, not personality quirk. Elevated cortisol drives environmental preparation behavior across mammals.',
    socialProof: '84% of parents report completing nursery prep later than planned. Average overrun: 3 weeks.',
  },
  36: {
    week: 36, trimester: 3,
    babySize: 'honeydew melon', babySizeEmoji: '🍈', babyWeight: '2.6kg', babyLength: '47.4cm',
    keyDevelopment: ['Skull bones still soft (birth prep)', 'Lungs fully mature', 'Immune system receiving maternal antibodies'],
    neuralFact: 'Neural connections firing: ~700,000/second',
    momChanges: ['Lightening may occur (baby dropping)', 'Weekly OB visits begin', 'Cervical checks may start'],
    hormoneProfile: 'Prostaglandins increasing, cervix beginning to ripen',
    behavioralNote: 'Maternal intuition intensifies in weeks 35–37. This is not mystical — it\'s elevated oxytocin priming your threat-detection systems.',
    socialProof: '31% of births happen before week 39. If you\'re not already, being ready now is not overcautious.',
  },
  39: {
    week: 39, trimester: 3,
    babySize: 'watermelon', babySizeEmoji: '🍉', babyWeight: '3.3kg', babyLength: '50.7cm',
    keyDevelopment: ['Full term', 'Brain continues developing post-birth', 'Vernix mostly absorbed'],
    neuralFact: 'Neural connections firing: ~1,000,000/second (will continue accelerating for 2 years post-birth)',
    momChanges: ['Every day counts', 'Cervix ripening', 'May be experiencing prodromal labor'],
    hormoneProfile: 'Estrogen surging, oxytocin ready to cascade',
    behavioralNote: 'Discomfort is at its recorded peak. So is anticipation. Both are physiologically real and documented as co-occurring. You\'re not confused — you\'re at the end.',
    socialProof: '52% of first-time parents go past their due date. Waiting is normal. You\'re not late — your baby is finishing.',
  },
};

export function getWeekData(week: number): WeekData {
  const exact = weekDataMap[week];
  if (exact) return exact;
  // Find closest
  const keys = Object.keys(weekDataMap).map(Number);
  const closest = keys.reduce((prev, curr) =>
    Math.abs(curr - week) < Math.abs(prev - week) ? curr : prev
  );
  return weekDataMap[closest]!;
}
