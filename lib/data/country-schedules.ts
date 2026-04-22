import type { Country } from '@/lib/types';
import type { Milestone } from '@/lib/types';
import { defaultMilestones } from '@/lib/data/milestones';

export interface CountryMeta {
  code: Country;
  name: string;
  flag: string;
}

export const COUNTRIES: CountryMeta[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱' },
];

interface MilestoneOverride {
  milestoneId: string;
  week?: number;
  title?: string;
  description?: string;
  hidden?: boolean;
}

const UK_OVERRIDES: MilestoneOverride[] = [
  // NHS combined first trimester screening window is 11+2 to 14+1
  {
    milestoneId: 'm3',
    week: 11,
    title: 'Combined first trimester screening',
    description: 'NHS combined screening: nuchal translucency scan + blood test. Window: 11–14 weeks.',
  },
  // Quad screen is not routinely offered on NHS
  { milestoneId: 'm4', hidden: true },
  // GBS not routinely tested on NHS (only if clinical indication)
  {
    milestoneId: 'm9',
    title: 'Group B Strep swab (if offered)',
    description: 'Not routine on NHS. Only done if clinically indicated or you request it privately.',
  },
];

const IL_OVERRIDES: MilestoneOverride[] = [
  // Israel anatomy scan is typically at week 22 (not 20)
  {
    milestoneId: 'm5',
    week: 22,
    title: 'Anatomy scan (morphology)',
    description: 'Detailed ultrasound scan. In Israel, typically scheduled at week 22. Most anticipated appointment of T2.',
  },
  // Israeli GTT window tends to be 26–28 weeks
  {
    milestoneId: 'm6',
    week: 26,
    title: 'Glucose challenge test',
    description: 'Gestational diabetes screening. In Israel, typically done at weeks 26–28.',
  },
  // Weekly OB visits begin at week 37 in Israel (not 36)
  {
    milestoneId: 'm10',
    week: 37,
    title: 'Weekly kupat holim visits begin',
    description: 'From week 37, your healthcare provider will want to see you weekly until birth.',
  },
];

const OVERRIDES_BY_COUNTRY: Record<Country, MilestoneOverride[]> = {
  US: [],
  UK: UK_OVERRIDES,
  IL: IL_OVERRIDES,
};

export function getMilestonesForCountry(country: Country): Milestone[] {
  const overrides = OVERRIDES_BY_COUNTRY[country] ?? [];
  if (overrides.length === 0) return defaultMilestones;

  const overrideMap = new Map(overrides.map(o => [o.milestoneId, o]));

  return defaultMilestones
    .filter(m => !overrideMap.get(m.id)?.hidden)
    .map(m => {
      const override = overrideMap.get(m.id);
      if (!override) return m;
      return {
        ...m,
        week: override.week ?? m.week,
        title: override.title ?? m.title,
        description: override.description ?? m.description,
      };
    });
}
