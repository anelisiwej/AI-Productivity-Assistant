import { createServerFn } from "@tanstack/react-start";

const SYSTEM_PROMPT =
  `You are an elite agile project manager and productivity coach. Based on the user's notes and selected track (Job Seeker or Workplace Pro), build a highly structured Monday-to-Friday weekly execution schedule. Prioritize tasks clearly using the Eisenhower Matrix (urgent vs. important). Highlight specific blocks of time for focused work and add a short section at the end with 2-3 time optimization tips tailored to their context.

STRICT OUTPUT FORMAT — return ONLY raw HTML (no Markdown, no hashtags, no asterisks, no code fences, no <html>/<body> wrapper, no inline styles, no class attributes). Use semantic tags only.

Structure exactly:

<h2>Prioritized Weekly Schedule</h2>
<table>
  <thead><tr><th>Day</th><th>Time Block</th><th>Category</th><th>Task</th><th>Deadline/Notes</th></tr></thead>
  <tbody>
    <tr><td>Monday</td><td>9:00 – 11:00</td><td>Urgent &amp; Important</td><td>...</td><td>...</td></tr>
    <!-- one row per scheduled block, Monday through Friday -->
  </tbody>
</table>

<h2>Eisenhower Matrix</h2>
<table>
  <thead><tr><th>Category</th><th>Task</th><th>Deadline/Notes</th></tr></thead>
  <tbody>
    <tr><td>Urgent &amp; Important</td><td>...</td><td>...</td></tr>
    <tr><td>Important, Not Urgent</td><td>...</td><td>...</td></tr>
    <tr><td>Urgent, Not Important</td><td>...</td><td>...</td></tr>
    <tr><td>Neither</td><td>...</td><td>...</td></tr>
  </tbody>
</table>

<h2>Time Optimization Tips</h2>
<ul>
  <li>...</li>
  <li>...</li>
  <li>...</li>
</ul>

Use plain text inside cells — no bold, no markdown, no emoji. Escape any &, <, > in content. Output nothing before or after this HTML.`;

export const generatePlan = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      notes: string;
      tasks: string;
      target?: string;
      tone?: string;
      name?: string;
      track?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const trackLabel =
      data.track === "job-seeker" ? "Job Seeker" : "Workplace Pro";

    const userContent = [
      `Track: ${trackLabel}`,
      data.name ? `Name: ${data.name}` : null,
      data.target ? `Target / focus: ${data.target}` : null,
      data.tone ? `Preferred tone: ${data.tone}` : null,
      "",
      "Tasks for this week (one per line):",
      data.tasks || "(none provided — infer from notes)",
      "",
      "Additional context / notes:",
      data.notes,
    ]
      .filter((x) => x !== null)
      .join("\n");

    const res = await fetch(
      "https://ai.gateway.lovable.dev/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: userContent },
          ],
        }),
      },
    );

    if (!res.ok) {
      if (res.status === 429)
        throw new Error("Rate limit exceeded. Please try again shortly.");
      if (res.status === 402)
        throw new Error(
          "AI credits exhausted. Add credits in Settings → Workspace → Usage.",
        );
      const t = await res.text();
      console.error("AI gateway error:", res.status, t);
      throw new Error("AI request failed");
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    return { content };
  });
