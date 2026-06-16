import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  FileText,
  Mail,
  CalendarClock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Briefcase,
} from "lucide-react";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "CareerMate AI — Your AI Career & Productivity Assistant" },
      {
        name: "description",
        content:
          "CareerMate AI helps job seekers and professionals craft resumes, write cover letters, and plan their week with intelligent, on-brand assistance.",
      },
      { property: "og:title", content: "CareerMate AI — AI Career & Productivity Assistant" },
      {
        property: "og:description",
        content:
          "Generate resumes, cover letters, and weekly task plans in seconds.",
      },
    ],
  }),
});

function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600">
              <span className="select-none text-sm font-bold leading-none tracking-tight text-white">
                CM
              </span>
            </div>
            <span className="text-base font-semibold tracking-tight">
              CareerMate <span className="text-blue-400">AI</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-slate-400 md:flex">
            <a href="#features" className="transition-colors hover:text-slate-100">Features</a>
            <a href="#how" className="transition-colors hover:text-slate-100">How it works</a>
            <a href="#faq" className="transition-colors hover:text-slate-100">FAQ</a>
          </nav>
          <Link to="/app">
            <Button className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-900/30 hover:from-blue-600 hover:to-indigo-700">
              Launch app
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[480px] w-[820px] -translate-x-1/2 rounded-full bg-blue-600/20 blur-3xl" />
          <div className="absolute top-40 right-10 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs text-slate-300">
              <Sparkles className="h-3.5 w-3.5 text-blue-400" />
              Premium AI for your career &amp; week
            </div>
            <h1 className="mt-6 text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl">
              Win the interview.
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Own your week.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base text-slate-400 sm:text-lg">
              CareerMate AI drafts tailored resumes, crisp cover letters, and a
              prioritized weekly schedule — so you can spend less time formatting
              and more time delivering.
            </p>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/app">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 px-7 text-white shadow-lg shadow-blue-900/30 hover:from-blue-600 hover:to-indigo-700"
                >
                  Get started free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-slate-700 bg-slate-900/40 text-slate-200 hover:bg-slate-800"
                >
                  See what's inside
                </Button>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5" /> No signup required</span>
              <span className="inline-flex items-center gap-1.5"><Zap className="h-3.5 w-3.5" /> Results in seconds</span>
              <span className="inline-flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> Built for professionals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-slate-800/80 bg-slate-950">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Three tools. One workspace.
            </h2>
            <p className="mt-3 text-slate-400">
              Everything you need to apply, communicate, and plan — without
              juggling six different apps.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: FileText,
                title: "Resume Builder",
                desc: "Generate a polished, role-targeted resume from your background and the job you want.",
              },
              {
                icon: Mail,
                title: "Cover Letter & Email",
                desc: "Draft tailored cover letters and outreach emails — export to Word or PDF in one click.",
              },
              {
                icon: CalendarClock,
                title: "Weekly Task Planner",
                desc: "Turn goals into a prioritized weekly schedule you can print or push to your calendar.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <Card
                key={title}
                className="group border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/40 p-6 transition-colors hover:border-slate-700"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 ring-1 ring-blue-500/30">
                  <Icon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-slate-100">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">{desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="border-t border-slate-800/80 bg-slate-950/60">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              From blank page to polished output in 3 steps
            </h2>
          </div>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              { n: "01", t: "Tell us the context", d: "Share your role, target job, or weekly goals." },
              { n: "02", t: "Let AI draft", d: "CareerMate generates a tailored, professional output." },
              { n: "03", t: "Export & ship", d: "Copy, download as PDF/DOCX, or send to your calendar." },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-xl border border-slate-800 bg-slate-900/50 p-6"
              >
                <div className="text-xs font-semibold tracking-widest text-blue-400">
                  STEP {s.n}
                </div>
                <h3 className="mt-3 text-lg font-semibold text-slate-100">{s.t}</h3>
                <p className="mt-2 text-sm text-slate-400">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-800/80">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-br from-blue-600/15 via-indigo-600/10 to-slate-900 p-10 text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Ready to move faster?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-slate-400">
              Open CareerMate AI and generate your first resume, cover letter, or
              weekly plan in under a minute.
            </p>
            <div className="mt-7 flex justify-center">
              <Link to="/app">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 text-white shadow-lg shadow-blue-900/30 hover:from-blue-600 hover:to-indigo-700"
                >
                  Launch CareerMate AI
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t border-slate-800/80 bg-slate-950">
        <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6">
          <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">
            Frequently asked
          </h2>
          <div className="mt-10 space-y-4">
            {[
              {
                q: "Is CareerMate AI free to use?",
                a: "Yes — the core resume, cover letter, and planner tools are free to try with no signup.",
              },
              {
                q: "Can I export my documents?",
                a: "Absolutely. Cover letters can be downloaded as Word (.docx) or PDF, and weekly plans can be printed, saved as PDF, or exported to your calendar.",
              },
              {
                q: "Is my information stored?",
                a: "Your inputs are used only to generate outputs in your session. We don't sell or share your data.",
              },
            ].map((f) => (
              <div key={f.q} className="rounded-lg border border-slate-800 bg-slate-900/50 p-5">
                <h3 className="text-sm font-semibold text-slate-100">{f.q}</h3>
                <p className="mt-2 text-sm text-slate-400">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-indigo-600">
              <span className="text-[10px] font-bold leading-none text-white">CM</span>
            </div>
            CareerMate AI
          </div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} CareerMate AI. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
