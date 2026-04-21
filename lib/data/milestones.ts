import type { Milestone } from '@/lib/types';

export const defaultMilestones: Milestone[] = [
  // Medical
  { id: 'm1', week: 8, title: 'First prenatal appointment', description: 'Confirm pregnancy, establish care, discuss history.', category: 'medical', isCustom: false },
  { id: 'm2', week: 10, title: 'NIPT / genetic screening', description: 'Non-invasive prenatal testing window. Optional but recommended.', category: 'medical', isCustom: false },
  { id: 'm3', week: 12, title: 'First trimester screening', description: 'Nuchal translucency scan + blood work.', category: 'medical', isCustom: false },
  { id: 'm4', week: 16, title: 'Quad screen (optional)', description: 'Second set of blood markers. Discuss with OB.', category: 'medical', isCustom: false },
  { id: 'm5', week: 20, title: 'Anatomy scan', description: 'Detailed ultrasound. Most anticipated appointment of T2.', category: 'medical', isCustom: false },
  { id: 'm6', week: 24, title: 'Glucose tolerance test', description: 'Gestational diabetes screening. Window: weeks 24–28.', category: 'medical', isCustom: false },
  { id: 'm7', week: 28, title: 'Rh factor shot (if needed)', description: 'RhoGAM injection for Rh-negative blood types.', category: 'medical', isCustom: false },
  { id: 'm8', week: 32, title: 'Growth scan', description: 'Check baby\'s size and position.', category: 'medical', isCustom: false },
  { id: 'm9', week: 35, title: 'Group B Strep test', description: 'Standard culture swab. Results in ~48 hrs.', category: 'medical', isCustom: false },
  { id: 'm10', week: 36, title: 'Weekly OB visits begin', description: 'From here until birth, weekly check-ins.', category: 'medical', isCustom: false },
  // Preparation
  { id: 'm11', week: 14, title: 'Research childcare options', description: 'Waitlists for good daycare can be 12+ months. Start now.', category: 'preparation', isCustom: false },
  { id: 'm12', week: 16, title: 'Plan maternity/parental leave', description: 'Notify employer, understand policy, plan logistics.', category: 'preparation', isCustom: false },
  { id: 'm13', week: 20, title: 'Start baby registry', description: 'Gives you 20 weeks to refine. Don\'t buy everything at once.', category: 'preparation', isCustom: false },
  { id: 'm14', week: 24, title: 'Book birth class', description: 'Childbirth education classes often fill up 8–10 weeks ahead.', category: 'preparation', isCustom: false },
  { id: 'm15', week: 28, title: 'Set up nursery', description: 'Average setup time: 2–3 weeks. Budget buffer time.', category: 'preparation', isCustom: false },
  { id: 'm16', week: 32, title: 'Install car seat', description: 'Get it inspected at a certified check station.', category: 'preparation', isCustom: false },
  { id: 'm17', week: 35, title: 'Pack hospital bag', description: 'For you, partner, and baby. 68% of people pack this week.', category: 'preparation', isCustom: false },
  { id: 'm18', week: 36, title: 'Pre-register at hospital', description: 'Saves 20+ minutes on admission day.', category: 'preparation', isCustom: false },
  { id: 'm19', week: 37, title: 'Finalize birth plan', description: 'One page max. Share with OB and whoever is in the room.', category: 'preparation', isCustom: false },
  { id: 'm20', week: 38, title: 'Meal prep for postpartum', description: 'Freeze 2 weeks of meals. Future you will be very grateful.', category: 'preparation', isCustom: false },
  // Personal
  { id: 'm21', week: 12, title: 'Share the news', description: '61% of people wait until week 12. You do you.', category: 'personal', isCustom: false },
  { id: 'm22', week: 16, title: 'Take a bump photo', description: 'Week 16 is typically when bump becomes visible. Document it.', category: 'personal', isCustom: false },
  { id: 'm23', week: 20, title: 'Feel first movement', description: 'Quickening typically happens weeks 16–22. Often described as bubbles.', category: 'personal', isCustom: false },
  { id: 'm24', week: 24, title: 'Name shortlist finalized', description: 'Give yourself a working shortlist. Decisions get harder closer to birth.', category: 'personal', isCustom: false },
  { id: 'm25', week: 30, title: 'Partner prenatal bonding', description: 'Baby can hear voices now. Partners: talk, read, be present.', category: 'personal', isCustom: false },
  // Emotional
  { id: 'm26', week: 8, title: 'First ultrasound', description: 'Seeing the heartbeat. However you feel, it\'s a lot.', category: 'emotional', isCustom: false },
  { id: 'm27', week: 20, title: 'Anatomy scan reveal', description: 'If you\'re finding out sex, this is the day. Bring someone.', category: 'emotional', isCustom: false },
  { id: 'm28', week: 28, title: 'Reflect on the journey', description: 'T3 starts now. You\'re in the final stretch. Log how you feel.', category: 'emotional', isCustom: false },
  { id: 'm29', week: 37, title: 'Last date night', description: 'Intentional couple time before everything changes. Don\'t skip it.', category: 'emotional', isCustom: false },
];
