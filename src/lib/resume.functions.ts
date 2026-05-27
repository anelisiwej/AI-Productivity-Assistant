import { createServerFn } from "@tanstack/react-start";

const SYSTEM_PROMPT =
  "You are an expert ATS recruitment and career optimization specialist. Take the user's raw notes, career history, or context provided, and transform them into 3 to 5 high-impact, professional resume bullet points. Use the formula: 'Accomplished [X], as measured by [Y], by doing [Z]'. Start every bullet point with a strong, active verb. Do not include corporate fluff or filler words. Output the results formatted cleanly in markdown bullet points.";

export const generateResume = createServerFn({ method: "POST" })
  .inputValidator(
    (data: { notes: string; target?: string; tone?: string; name?: string }) =>
      data,
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const userContent = [
      data.name ? `Candidate: ${data.name}` : null,
      data.target ? `Target role / audience: ${data.target}` : null,
      data.tone ? `Preferred tone: ${data.tone}` : null,
      "",
      "Raw notes / career history:",
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
      if (res.status === 429) {
        throw new Error("Rate limit exceeded. Please try again shortly.");
      }
      if (res.status === 402) {
        throw new Error(
          "AI credits exhausted. Add credits in Settings → Workspace → Usage.",
        );
      }
      const t = await res.text();
      console.error("AI gateway error:", res.status, t);
      throw new Error("AI request failed");
    }

    const json = await res.json();
    const content: string = json?.choices?.[0]?.message?.content ?? "";
    return { content };
  });
