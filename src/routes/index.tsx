import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { generateResume } from "@/lib/resume.functions";
import { generateEmail } from "@/lib/email.functions";
import { generatePlan } from "@/lib/plan.functions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import {
  Briefcase,
  GraduationCap,
  Sparkles,
  FileText,
  Mail,
  CalendarClock,
  Loader2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Copy,
  Check,
  Printer,
  Calendar,
  Download,
} from "lucide-react";
import { downloadScheduleIcs, printElementById } from "@/lib/schedule-export";
import {
  downloadCoverLetterDocx,
  downloadCoverLetterPdf,
} from "@/lib/cover-letter-export";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "AI Workplace & Career Assistant" },
      {
        name: "description",
        content:
          "AI-powered resume builder, cover letter generator, and weekly task planner for job seekers and professionals.",
      },
    ],
  }),
});

type Track = "job-seeker" | "professional";
type Tone = "Formal" | "Persuasive" | "Balanced";

interface FormState {
  track: Track;
  name: string;
  notes: string;
  target: string;
  tone: Tone;
  tasks: string;
}

function Index() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    track: "job-seeker",
    name: "",
    notes: "",
    target: "",
    tone: "Balanced",
    tasks: "",
  });
  const [loading, setLoading] = useState<null | "resume" | "email" | "plan">(null);
  const [outputs, setOutputs] = useState<{
    resume?: string;
    email?: string;
    plan?: string;
  }>({});
  const [activeTab, setActiveTab] = useState("resume");

  const update = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const callGenerateResume = useServerFn(generateResume);
  const callGenerateEmail = useServerFn(generateEmail);
  const callGeneratePlan = useServerFn(generatePlan);

  async function runGeneration(kind: "resume" | "email" | "plan") {
    setLoading(kind);
    setActiveTab(kind);
    try {
      let result: string;
      if (kind === "resume") {
        const res = await callGenerateResume({
          data: {
            notes: form.notes,
            target: form.target,
            tone: form.tone,
            name: form.name,
          },
        });
        result = res.content || "No content returned.";
      } else if (kind === "email") {
        const res = await callGenerateEmail({
          data: {
            notes: form.notes,
            target: form.target,
            tone: form.tone,
            name: form.name,
            track: form.track,
          },
        });
        result = res.content || "No content returned.";
      } else {
        const res = await callGeneratePlan({
          data: {
            notes: form.notes,
            tasks: form.tasks,
            target: form.target,
            tone: form.tone,
            name: form.name,
            track: form.track,
          },
        });
        result = res.content || "No content returned.";
      }
      setOutputs((o) => ({ ...o, [kind]: result }));
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Generation failed";
      toast.error(msg);
    } finally {
      setLoading(null);
    }
  }

  async function generateAll() {
    setActiveTab("resume");
    const hasTasks = form.tasks.trim().length > 0;
    const kinds = hasTasks
      ? (["resume", "email", "plan"] as const)
      : (["resume", "email"] as const);
    for (const k of kinds) {
      await runGeneration(k);
    }
  }

  const hasTasks = form.tasks.trim().length > 0;
  const canNext1 = !!form.track;
  const canNext2 = form.notes.trim().length > 5;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/80 backdrop-blur-md bg-slate-950/60 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">
                CareerMate AI
              </h1>
              <p className="text-xs text-slate-400">
                Resume · Communication · Planning
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            AI Ready
          </div>
        </div>
      </header>

      {/* Main split */}
      <main className="max-w-7xl mx-auto px-6 py-8 grid lg:grid-cols-[420px_1fr] gap-6">
        {/* LEFT PANEL */}
        <Card className="bg-slate-900/60 border-slate-800 p-6 h-fit lg:sticky lg:top-24">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-300">
              Your Inputs
            </h2>
            <span className="text-xs text-slate-500">Step {step} / 3</span>
          </div>

          {/* Stepper */}
          <div className="flex gap-1.5 mb-6">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  n <= step ? "bg-blue-500" : "bg-slate-800"
                }`}
              />
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <Label className="text-slate-300">Select your track</Label>
              <div className="grid grid-cols-2 gap-3">
                <TrackCard
                  active={form.track === "job-seeker"}
                  onClick={() => update("track", "job-seeker")}
                  icon={<GraduationCap className="h-5 w-5" />}
                  title="Job Seeker"
                  subtitle="Resumes, cover letters, applications"
                />
                <TrackCard
                  active={form.track === "professional"}
                  onClick={() => update("track", "professional")}
                  icon={<Briefcase className="h-5 w-5" />}
                  title="Professional"
                  subtitle="Emails, planning, comms"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name" className="text-slate-300">
                  Your name
                </Label>
                <Input
                  id="name"
                  placeholder="Alex Morgan"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-100"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-slate-300">
                  {form.track === "job-seeker"
                    ? "Raw career history / notes"
                    : "Context, project notes, or message brief"}
                </Label>
                <Textarea
                  id="notes"
                  rows={8}
                  placeholder={
                    form.track === "job-seeker"
                      ? "e.g. Led migration of monolith to microservices; managed 4-person team; reduced costs ~30%..."
                      : "e.g. Need to follow up with client about delayed deliverable; outline next steps; reassure timeline..."
                  }
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-100 resize-none"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tasks" className="text-slate-300">
                  This week's tasks (Optional - one per line)
                </Label>
                <Textarea
                  id="tasks"
                  rows={4}
                  placeholder={"Finish Q3 report\nClient call - urgent\nPrep team review\nLearn React Router"}
                  value={form.tasks}
                  onChange={(e) => update("tasks", e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-100 resize-none"
                />
                <p className="text-xs text-slate-500">
                  💡 Tip: If you don't have tasks this week, skip this field! CareerMate AI will automatically customize your dashboard to focus entirely on your professional profile and job applications.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="target" className="text-slate-300">
                  {form.track === "job-seeker"
                    ? "Target role / company"
                    : "Audience / recipient"}
                </Label>
                <Input
                  id="target"
                  placeholder={
                    form.track === "job-seeker"
                      ? "Senior Product Manager at Stripe"
                      : "Hiring manager, client, team lead..."
                  }
                  value={form.target}
                  onChange={(e) => update("target", e.target.value)}
                  className="bg-slate-950/60 border-slate-800 text-slate-100"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-slate-300">Tone</Label>
                <Select
                  value={form.tone}
                  onValueChange={(v) => update("tone", v as Tone)}
                >
                  <SelectTrigger className="bg-slate-950/60 border-slate-800 text-slate-100">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Persuasive">Persuasive</SelectItem>
                    <SelectItem value="Balanced">Balanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={generateAll}
                disabled={loading !== null || !canNext2}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate All
              </Button>
            </div>
          )}

          {/* Nav */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-800">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
              className="text-slate-400 hover:text-slate-100"
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Back
            </Button>
            {step < 3 ? (
              <Button
                size="sm"
                onClick={() => setStep((s) => s + 1)}
                disabled={(step === 1 && !canNext1) || (step === 2 && !canNext2)}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Next <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <span className="text-xs text-slate-500">Ready to generate</span>
            )}
          </div>
        </Card>

        {/* RIGHT PANEL */}
        <Card className="bg-slate-900/60 border-slate-800 p-6 min-h-[600px] flex flex-col">
          <Tabs
            value={!hasTasks && activeTab === "plan" ? "resume" : activeTab}
            onValueChange={setActiveTab}
            className="flex-1 flex flex-col"
          >
            <TabsList
              className={`bg-slate-950/60 border border-slate-800 p-1 grid w-full ${
                hasTasks ? "grid-cols-3" : "grid-cols-2"
              }`}
            >
              <TabTrigger value="resume" icon={<FileText className="h-4 w-4" />}>
                Resume Builder
              </TabTrigger>
              <TabTrigger value="email" icon={<Mail className="h-4 w-4" />}>
                Email / Cover Letter
              </TabTrigger>
              {hasTasks && (
                <TabTrigger value="plan" icon={<CalendarClock className="h-4 w-4" />}>
                  Task Planner
                </TabTrigger>
              )}
            </TabsList>

            <TabsContent value="resume" className="flex-1 mt-5">
              <OutputPane
                title="ATS-Optimized Resume Bullets"
                subtitle="Impact-driven, metric-led, recruiter-friendly"
                loading={loading === "resume"}
                content={outputs.resume}
                action={
                  <Button
                    onClick={() => runGeneration("resume")}
                    disabled={loading !== null || !canNext2}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Sparkles className="h-4 w-4 mr-2" /> Generate
                  </Button>
                }
              />
            </TabsContent>

            <TabsContent value="email" className="flex-1 mt-5">
              <OutputPane
                title={
                  form.track === "job-seeker"
                    ? "Cover Letter Draft"
                    : "Professional Email Draft"
                }
                subtitle={`Tone: ${form.tone}`}
                loading={loading === "email"}
                content={outputs.email}
                action={
                  <Button
                    onClick={() => runGeneration("email")}
                    disabled={loading !== null || !canNext2}
                    size="sm"
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <Sparkles className="h-4 w-4 mr-2" /> Generate
                  </Button>
                }
              />
            </TabsContent>

            {hasTasks && (
              <TabsContent value="plan" className="flex-1 mt-5">
                <div id="print-schedule">
                  <OutputPane
                    title="Prioritized Weekly Schedule"
                    subtitle="Sequenced by urgency and impact"
                    loading={loading === "plan"}
                    content={outputs.plan}
                    isHtml
                    action={
                      <Button
                        onClick={() => runGeneration("plan")}
                        disabled={loading !== null}
                        size="sm"
                        className="bg-blue-500 hover:bg-blue-600"
                      >
                        <Sparkles className="h-4 w-4 mr-2" /> Generate
                      </Button>
                    }
                  />
                  {outputs.plan && loading !== "plan" && (
                    <div className="no-print mt-4 flex flex-wrap items-center gap-2 rounded-lg border border-slate-800 bg-slate-950/40 px-4 py-3">
                      <span className="text-xs uppercase tracking-wider text-slate-500 mr-2">
                        Export
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => printElementById("print-schedule")}
                        className="bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white"
                      >
                        <Printer className="h-4 w-4 mr-1.5" />
                        Print / Save PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          try {
                            const count = downloadScheduleIcs(outputs.plan ?? "");
                            if (count === 0) {
                              toast.error(
                                "No schedulable rows found in the plan.",
                              );
                            } else {
                              toast.success(
                                `Exported ${count} event${count === 1 ? "" : "s"} to CareerMate_Schedule.ics`,
                              );
                            }
                          } catch {
                            toast.error("Failed to build calendar file.");
                          }
                        }}
                        className="bg-slate-950/60 border-slate-800 text-slate-200 hover:bg-slate-800 hover:text-white"
                      >
                        <Calendar className="h-4 w-4 mr-1.5" />
                        Export to Calendar (.ics)
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
            )}
          </Tabs>

          {/* Disclaimer */}
          <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 flex gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-amber-300 mb-1">
                Responsible AI Disclaimer
              </p>
              <p className="text-amber-100/80 leading-relaxed">
                This content is AI-generated. Please review, validate, and verify
                all facts, metrics, and dates before professional use.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

function TrackCard({
  active,
  onClick,
  icon,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-left rounded-lg border p-3 transition-all ${
        active
          ? "border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10"
          : "border-slate-800 bg-slate-950/40 hover:border-slate-700"
      }`}
    >
      <div
        className={`h-8 w-8 rounded-md flex items-center justify-center mb-2 ${
          active ? "bg-blue-500 text-white" : "bg-slate-800 text-slate-300"
        }`}
      >
        {icon}
      </div>
      <div className="text-sm font-medium text-slate-100">{title}</div>
      <div className="text-xs text-slate-400 mt-0.5">{subtitle}</div>
    </button>
  );
}

function TabTrigger({
  value,
  icon,
  children,
}: {
  value: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <TabsTrigger
      value={value}
      className="data-[state=active]:bg-blue-500 data-[state=active]:text-white text-slate-400 gap-2 text-xs sm:text-sm"
    >
      {icon}
      <span className="hidden sm:inline">{children}</span>
    </TabsTrigger>
  );
}

function OutputPane({
  title,
  subtitle,
  loading,
  content,
  action,
  isHtml = false,
}: {
  title: string;
  subtitle: string;
  loading: boolean;
  content?: string;
  action: React.ReactNode;
  isHtml?: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    if (!content) return;
    const plain = isHtml ? stripHtml(content) : content;
    await navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100">{title}</h3>
          <p className="text-xs text-slate-400">{subtitle}</p>
        </div>
        <div className="flex gap-2 no-print print:hidden">
          {content && !loading && (
            <Button
              size="sm"
              variant="outline"
              onClick={copy}
              className="bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800"
            >
              {copied ? (
                <Check className="h-4 w-4 mr-1" />
              ) : (
                <Copy className="h-4 w-4 mr-1" />
              )}
              {copied ? "Copied" : "Copy"}
            </Button>
          )}
          {action}
        </div>
      </div>

      <div className="flex-1 rounded-lg border border-slate-800 bg-slate-950/40 p-5 min-h-[380px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="relative">
              <Loader2 className="h-10 w-10 text-blue-400 animate-spin" />
              <div className="absolute inset-0 h-10 w-10 rounded-full bg-blue-500/20 blur-xl" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200">
                AI is analyzing and optimizing your data...
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Structuring output for clarity, impact, and tone
              </p>
            </div>
          </div>
        ) : content ? (
          isHtml ? (
            <div
              className="ai-html text-sm text-slate-200 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizePlanHtml(content) }}
            />
          ) : (
            <pre className="whitespace-pre-wrap font-sans text-sm text-slate-200 leading-relaxed">
              {content}
            </pre>
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
            <Sparkles className="h-8 w-8 mb-3 text-slate-700" />
            <p className="text-sm">Fill in your inputs and click Generate</p>
            <p className="text-xs mt-1">Output will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------- HTML helpers for plan output -------------------- */

function sanitizePlanHtml(raw: string): string {
  // strip code fences like ```html ... ``` if model added them
  let s = raw.trim();
  s = s.replace(/^```(?:html)?\s*/i, "").replace(/```\s*$/i, "");
  // allow only a safe subset of tags
  const allowed = /^(h2|h3|p|ul|ol|li|table|thead|tbody|tr|th|td|strong|em|br)$/i;
  s = s.replace(/<\/?([a-zA-Z0-9]+)(\s[^>]*)?>/g, (m, tag) =>
    allowed.test(tag) ? `<${m.startsWith("</") ? "/" : ""}${tag.toLowerCase()}>` : "",
  );
  return s;
}

function stripHtml(html: string): string {
  const cleaned = sanitizePlanHtml(html);
  return cleaned
    .replace(/<\/(h2|h3|p|li|tr)>/gi, "\n")
    .replace(/<\/(td|th)>/gi, "\t")
    .replace(/<br\s*\/?>(?!\n)/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/* -------------------- Mock generators (deterministic, on-device) -------------------- */

const toneOpening: Record<Tone, string> = {
  Formal: "I am writing to formally express",
  Persuasive: "I'm excited to share why I'd be a strong fit for",
  Balanced: "I'd like to share my interest in",
};

function buildResume(f: FormState): string {
  const lines = f.notes
    .split(/[\n\.]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 4)
    .slice(0, 6);

  const verbs = ["Led", "Drove", "Spearheaded", "Architected", "Optimized", "Delivered"];
  const metrics = ["~30%", "2x", "40%", "5 weeks", "$1.2M", "15%"];

  const bullets = lines.map((l, i) => {
    const verb = verbs[i % verbs.length];
    const metric = metrics[i % metrics.length];
    const clean = l.replace(/^(led|drove|managed|did|worked on)\s+/i, "");
    return `• ${verb} ${clean.charAt(0).toLowerCase() + clean.slice(1)} — measurable impact of ${metric}, aligned to ${f.target || "target role"} priorities.`;
  });

  return `${f.name || "Candidate"} — Resume Highlights
Target: ${f.target || "(role not specified)"}

PROFESSIONAL EXPERIENCE
${bullets.join("\n")}

KEY STRENGTHS
• Cross-functional leadership and stakeholder communication
• Data-informed decision-making with measurable outcomes
• Strong written communication, calibrated to a ${f.tone.toLowerCase()} register

ATS NOTES
Keywords woven in: leadership, delivery, optimization, ${f.target ? f.target.split(" ").slice(0, 3).join(", ") : "domain expertise"}.`;
}

function buildEmail(f: FormState): string {
  const opener = toneOpening[f.tone];
  const isCover = f.track === "job-seeker";
  const subject = isCover
    ? `Application — ${f.target || "Open Role"}`
    : `Follow-up: ${f.target || "Quick note"}`;
  const summary = f.notes
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 3)
    .map((s) => `• ${s}`)
    .join("\n");

  return `Subject: ${subject}

Dear ${f.target ? f.target.split(" ")[0] : "Hiring Team"},

${opener} ${isCover ? `the ${f.target || "role"}` : `our recent work on ${f.target || "this initiative"}`}. Based on my background, here are the key points worth highlighting:

${summary || "• Relevant context will appear here based on your notes."}

${
  f.tone === "Persuasive"
    ? "I'm confident this combination of experience and outcomes maps directly to what you're building, and I'd welcome the chance to discuss further."
    : f.tone === "Formal"
    ? "I would welcome the opportunity to discuss how this experience aligns with your needs at your convenience."
    : "Happy to walk through any of this in more detail whenever works for you."
}

Best regards,
${f.name || "Your Name"}`;
}

function buildPlan(f: FormState): string {
  const raw = f.tasks
    .split("\n")
    .map((t) => t.trim())
    .filter(Boolean);
  if (raw.length === 0) {
    return "Add tasks in step 2 to generate a prioritized weekly plan.";
  }

  const scored = raw.map((t) => {
    const urgent = /urgent|asap|today|deadline|critical/i.test(t);
    const important = /report|client|review|launch|prep/i.test(t);
    const score = (urgent ? 2 : 0) + (important ? 1 : 0);
    return { t, score, urgent, important };
  });
  scored.sort((a, b) => b.score - a.score);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const blocks = days.map((d, i) => {
    const task = scored[i % scored.length];
    const slot = task.urgent ? "9:00 – 11:00 (deep focus)" : "14:00 – 16:00";
    const tag = task.urgent
      ? "🔴 Urgent"
      : task.important
      ? "🟡 Important"
      : "🟢 Routine";
    return `${d}
  ${slot}  ${tag}  —  ${task.t}`;
  });

  return `WEEKLY PLAN — Prioritized by Urgency & Impact

${blocks.join("\n\n")}

PRIORITY ORDER
${scored.map((s, i) => `${i + 1}. ${s.t}  ${s.urgent ? "(urgent)" : s.important ? "(important)" : ""}`).join("\n")}

TIPS
• Protect mornings for urgent / deep work.
• Batch routine items into a single afternoon block.
• Re-evaluate priorities at end of day Wednesday.`;
}
