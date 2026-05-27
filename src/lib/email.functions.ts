import { createServerFn } from "@tanstack/react-start";

const SYSTEM_PROMPT =
  "You are a master corporate communications specialist. Draft a beautifully tailored professional email or cover letter based on the user's provided context, history, and target audience. Adjust the writing tone strictly based on the user's selected tone (e.g., Formal, Persuasive, Balanced). Ensure it has a clear subject line, introduction, strong value proposition body paragraphs, and a compelling call-to-action closing. Keep it highly readable and clean.";

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator(
    (data: {
      notes: string;
      target?: string;
      tone?: string;
      name?: string;
      track?: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY is not configured");

    const kind =
      data.track === "job-seeker" ? "cover letter" : "professional email";

    const userContent = [
      `Draft a ${kind}.`,
      data.name ? `Sender name: ${data.name}` : null,
      data.target ? `Target audience / recipient: ${data.target}` : null,
      data.tone ? `Tone (strict): ${data.tone}` : null,
      "",
      "Context / notes / history:",
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
