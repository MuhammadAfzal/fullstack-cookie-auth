import OpenAI from "openai";

export type InsightsInput = {
  totalUsers?: number;
  newUsersThisMonth?: number;
  newUsersToday?: number;
  roleDistribution?: { role: string; count: number; percentage?: number }[];
};

export async function generateInsights(
  input: InsightsInput
): Promise<string[]> {
  const {
    totalUsers = 0,
    newUsersThisMonth = 0,
    newUsersToday = 0,
    roleDistribution = [],
  } = input;

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.AI_MODEL || "gpt-4o-mini";

  console.log(`API key`, apiKey);

  // If no API key, return simple heuristic insights
  if (!apiKey) {
    return heuristicInsights({
      totalUsers,
      newUsersThisMonth,
      newUsersToday,
      roleDistribution,
    });
  }

  try {
    const client = new OpenAI({ apiKey });

    const roleDistText = roleDistribution
      .map(
        (r) =>
          `${r.role}: ${r.count}${
            typeof r.percentage === "number" ? ` (${r.percentage}%)` : ""
          }`
      )
      .join("; ");

    const system =
      "You are a helpful analytics assistant. Be concise. Return 3-5 bullets.";
    const user = `
Metrics:
- Total users: ${totalUsers}
- New users (month): ${newUsersThisMonth}
- New users (today): ${newUsersToday}
- Role distribution: ${roleDistText || "n/a"}

Task: Provide 3-5 specific, actionable insights about growth, anomalies, and potential next steps. Keep each item one sentence.`.trim();

    const response = await client.chat.completions.create({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      temperature: 0.3,
    });

    const content = response.choices?.[0]?.message?.content?.trim() || "";
    const bullets = content
      .split(/\n+/)
      .map((l) => l.replace(/^\s*[-•]\s*/, "").trim())
      .filter(Boolean)
      .slice(0, 5);

    if (bullets.length) return bullets;
    return heuristicInsights({
      totalUsers,
      newUsersThisMonth,
      newUsersToday,
      roleDistribution,
    });
  } catch (err) {
    return heuristicInsights({
      totalUsers,
      newUsersThisMonth,
      newUsersToday,
      roleDistribution,
    });
  }
}

function heuristicInsights(input: InsightsInput): string[] {
  const {
    totalUsers = 0,
    newUsersThisMonth = 0,
    newUsersToday = 0,
    roleDistribution = [],
  } = input;
  const insights: string[] = [];
  if (newUsersToday > 0)
    insights.push(`You gained ${newUsersToday} new users today.`);
  if (newUsersThisMonth > 0)
    insights.push(`This month added ${newUsersThisMonth} new users.`);
  if (totalUsers > 0)
    insights.push(
      `Total users are ${totalUsers}; consider segment-based onboarding to improve activation.`
    );
  if (roleDistribution.length) {
    const top = [...roleDistribution].sort((a, b) => b.count - a.count)[0];
    if (top)
      insights.push(
        `Most common role is ${top.role} with ${top.count} users; tailor content for this segment.`
      );
  }
  if (!insights.length)
    insights.push(
      "No notable changes detected; monitor again after new signups."
    );
  return insights.slice(0, 5);
}
