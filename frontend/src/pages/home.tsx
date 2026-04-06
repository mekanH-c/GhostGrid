import { Link } from "wouter";
import { ArrowRight, BarChart3, Zap, ShieldAlert } from "lucide-react";

export function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-12">
      <div className="text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm mb-8">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          AI-POWERED GHOST LOAD DETECTION
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tighter mb-6 leading-tight">
          See the energy <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-cyan-400">you're wasting</span>
        </h1>

        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
          Upload your facility energy data. Our AI finds hidden ghost loads, 
          calculates CO₂ impact, and gives clear recommendations.
        </p>

        <Link href="/analyze">
          <button className="h-14 px-10 text-lg bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl flex items-center gap-3 mx-auto font-medium transition-all active:scale-95">
            Launch Analyzer
            <ArrowRight className="w-6 h-6" />
          </button>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mt-24 w-full max-w-5xl">
        {[
          { icon: BarChart3, title: "Ingest Data", desc: "Upload raw CSV energy readings" },
          { icon: Zap, title: "AI Analysis", desc: "Detects anomalous ghost loads" },
          { icon: ShieldAlert, title: "Actionable Insights", desc: "Savings + CO₂ estimates" },
        ].map((item, i) => (
          <div key={i} className="p-8 border border-border rounded-2xl bg-card text-center hover:border-primary/50 transition-colors">
            <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <item.icon className="w-9 h-9 text-primary" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}