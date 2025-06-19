export const SKILLS_KEY = 'portfolio_skills';

export function getSkills() {
  try {
    const data = localStorage.getItem(SKILLS_KEY);
    if (data) return JSON.parse(data);
    return [];
  } catch {
    return [];
  }
}

export function setSkills(skills) {
  localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
} 