# AI Workplace Productivity & Career Assistant

A modern, dual-track AI suite that helps **Job Seekers** and **Workplace Professionals** produce recruiter-ready resumes, polished communications, and prioritized weekly plans — all powered by the Lovable AI Gateway.

> **Lead Developer:** Anelisiwe Jongilanga

---

## Overview

The AI Workplace Productivity & Career Assistant is a split-screen web application built with **TanStack Start**, **React 19**, **Tailwind CSS v4**, and **shadcn/ui**. Users move through a guided multi-step form on the left panel and receive structured, tab-organized AI output on the right.

Two tracks are supported from a single interface:

- **Job Seeker** — career history → ATS-optimized resume bullets and tailored cover letters.
- **Workplace Professional** — context and brief → polished outbound emails and a structured execution week.

---

## Core Features

### 1. ATS Resume Builder — Google X-Y-Z Formula
Transforms raw career notes into 3–5 high-impact resume bullets using Google's recruiting formula:

> **"Accomplished [X], as measured by [Y], by doing [Z]."**

Every bullet starts with a strong active verb, removes corporate filler, and outputs clean markdown ready to paste into an ATS-friendly resume.

### 2. Email & Cover Letter Generator
Drafts professional emails or cover letters tailored to a target audience, with selectable tone:

- **Formal** — measured, deferential, executive-ready
- **Persuasive** — confident, value-led, sales-oriented
- **Balanced** — warm, clear, professional default

Each draft includes a subject line, opening, value-proposition body, and a strong call-to-action close.

### 3. Eisenhower Matrix Task Planner
Turns a free-form task list into a structured **Monday–Friday weekly schedule**, prioritized using the **Eisenhower Matrix** (urgent vs. important). Includes dedicated deep-work blocks and 2–3 personalized time-optimization tips based on the user's track and context.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | TanStack Start v1 (React 19, Vite 7) |
| Styling | Tailwind CSS v4, shadcn/ui, Lucide icons |
| Server Logic | TanStack `createServerFn` |
| AI Provider | Lovable AI Gateway (`google/gemini-3-flash-preview`) |
| Deployment | Cloudflare Workers (edge) |

---

## Getting Started

```bash
bun install
bun run dev
```

The app runs locally on Vite's dev server. AI calls require the `LOVABLE_API_KEY` environment variable (provisioned automatically inside Lovable Cloud).

---

## Responsible AI Practices and Disclaimers

This project takes responsible AI seriously. The assistant is designed to **augment** professional judgment — not replace it.

### Our Practices

1. **Human-in-the-Loop by Design.** Every output surface includes a prominent disclaimer reminding users to review, validate, and verify before any professional use. Generated content is a *starting draft*, never a finished artifact.

2. **Transparency of Source.** The UI clearly labels all output as AI-generated. We do not disguise model output as human-written content, and we encourage users to disclose AI assistance where appropriate (applications, internal policy, journals).

3. **Factual Verification Required.** AI models can fabricate metrics, dates, employers, achievements, and credentials ("hallucination"). Users are explicitly instructed to verify every quantitative claim — percentages, dollar amounts, timelines, team sizes — against their actual records before submission.

4. **No Storage of Personal Data.** User inputs (career history, notes, target roles, contacts) are sent to the AI provider only for the duration of a single generation request. The application does not persist personal data, resumes, or drafts.

5. **Tone and Bias Controls.** Tone selection (Formal / Persuasive / Balanced) gives users explicit control over voice. Users are encouraged to review output for unintended bias, exaggeration, or culturally insensitive phrasing before sending.

6. **Scope Limitations.** This tool does not provide legal, financial, immigration, medical, or licensed career counseling advice. It is a drafting and structuring aid only.

7. **Fair Use of AI Models.** We use general-purpose foundation models via the Lovable AI Gateway under their published acceptable-use policies. Users are responsible for ensuring their prompts and downstream use comply with the policies of any platform they submit the generated content to (e.g., LinkedIn, employer ATS systems, academic applications).

### User-Facing Disclaimer

The following disclaimer is displayed in the application UI alongside every generated output:

> **Responsible AI Disclaimer:** This content is AI-generated. Please review, validate, and verify all facts, metrics, and dates before professional use.

### Reporting Issues

If you encounter output that is biased, factually misleading, or otherwise concerning, please open an issue in this repository describing the input pattern and the problematic output (with personal information redacted).

---

## License

This project is provided as-is for educational and personal-productivity use. See repository settings for license details.

---

## Credits

**Lead Developer:** Anelisiwe Jongilanga
Built with [Lovable](https://lovable.dev).
