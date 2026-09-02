/** Pure recommendation rules for the public discovery test. */
export const goalToPath: Record<string, string> = {
  "work-from-phone": "digital-start",
  marketing: "digital-marketing",
  products: "digital-products",
  content: "content-creation",
  ai: "ai-practical",
  freelance: "freelance",
  personal: "personal-brand",
  unsure: "digital-start",
};

export function recommendPathFromGoal(goal: string): string {
  return goalToPath[goal] ?? "digital-start";
}
