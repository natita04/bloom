import type { BeContent, DailyLog } from '@/lib/types';

export function getPersonalizedTip(bias: BeContent, recentLogs: DailyLog[]): string | null {
  if (recentLogs.length < 2) return null;

  const last = recentLogs.slice(0, 5);
  const avgSleep = last.reduce((s, l) => s + l.sleepQuality, 0) / last.length;
  const avgDecisions = last.reduce((s, l) => s + l.decisions, 0) / last.length;
  const avgMood = last.reduce((s, l) => s + l.moodScore, 0) / last.length;
  const hasAnxiety = last.some(l => l.symptoms.includes('anxiety'));
  const highDecisionDays = last.filter(l => l.decisions >= 4).length;
  const lowSleepDays = last.filter(l => l.sleepQuality <= 5).length;

  if (bias.category === 'Decision Making') {
    if (avgDecisions >= 4 && avgSleep < 6) {
      return `You've logged ${highDecisionDays} high-decision day${highDecisionDays !== 1 ? 's' : ''} this week on ${avgSleep.toFixed(1)}/10 sleep. You're in peak ${bias.biasName} territory right now — your brain is running on fumes when it needs to be at its sharpest.`;
    }
    if (avgDecisions >= 4) {
      return `You've been carrying a high decision load this week. ${bias.biasName} hits hardest when you're already taxed — watch for the mental shortcuts your brain takes in the next big choice.`;
    }
    if (avgSleep < 5.5) {
      return `${lowSleepDays} poor-sleep nights this week. Sleep deprivation amplifies ${bias.biasName} — decisions that feel obvious right now may not hold up tomorrow.`;
    }
  }

  if (bias.category === 'Risk Perception') {
    if (hasAnxiety && avgSleep < 6) {
      return `You've logged anxiety alongside poor sleep this week. That combination is exactly when ${bias.biasName} does its worst work — fears feel more real and more probable than they are.`;
    }
    if (hasAnxiety) {
      return `You've been logging anxiety this week. That's ${bias.biasName} at full volume — your brain is pattern-matching to threats that may not exist. Try to separate what you observed from what you imagined.`;
    }
    if (avgMood < 5) {
      return `Lower mood days make risk feel more present than it actually is. This is ${bias.biasName} working overtime. Your data this week is worth reviewing with fresh eyes.`;
    }
  }

  if (bias.category === 'Loss & Stability') {
    if (avgMood < 5 || lowSleepDays >= 3) {
      return `When you're depleted, ${bias.biasName} gets louder — anything unfamiliar feels threatening. Your logs show a tough stretch. Lean into routine, not decisions.`;
    }
    if (hasAnxiety) {
      return `Anxiety and ${bias.biasName} are a feedback loop this week. The urge to keep everything the same is protective — just make sure it's not keeping you from something worth changing.`;
    }
  }

  if (bias.category === 'Social Influence') {
    if (avgMood < 6) {
      return `Lower mood makes you more susceptible to ${bias.biasName} — you're more likely to defer to others when you're not feeling great. Notice when advice is actually helpful vs. when you're just looking for someone to decide for you.`;
    }
  }

  return null;
}

export function getReflectionPrompt(bias: BeContent): string {
  const prompts: Record<string, string> = {
    'Status Quo Bias': 'Did anything feel unusually hard to change or decide about today?',
    'Availability Heuristic': 'Did you spiral on a health worry today? What did you actually observe vs. what did you fear?',
    'Loss Aversion': 'Was there a moment today where fear of losing something drove a decision?',
    'Optimism Bias': 'Did you put off anything important today that you know should get done?',
    'Anchoring': 'Did any number or expectation feel "wrong" today — and was that the anchor talking?',
    'Planning Fallacy': 'Did anything take longer or cost more than you expected? What would a realistic estimate have looked like?',
    'Present Bias': 'Did you make any decisions today you want to revisit tomorrow?',
    'Social Proof': 'Did you do or decide something because others were doing it — was that actually right for you?',
    'Sunk Cost Fallacy': 'Did you stick with something longer than made sense, just because you\'d already invested in it?',
    'Scarcity Mindset': 'Did you feel urgency about something that didn\'t actually require urgency?',
    'Confirmation Bias': 'Did you seek out information today that confirmed what you already believed?',
    'Endowment Effect': 'Did you resist letting go of something — even when it made sense?',
    'Hyperbolic Discounting': 'Did you trade a long-term benefit for short-term comfort today?',
  };

  return prompts[bias.biasName] ?? 'Was there a moment today that connects to what you know about how your brain works?';
}
