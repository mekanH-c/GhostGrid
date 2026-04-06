import { Link } from "wouter";
import { Zap, Activity } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center border border-primary/30">
              <Zap className="w-5 h-5 text-primary" />
            </div>
            <span className="font-bold text-xl">GhostGrid<span className="text-primary font-light">Lite</span></span>
          </Link>

          <nav className="flex items-center gap-6 text-sm">
            <Link href="/analyze" className="hover:text-primary transition-colors">Analyzer</Link>
            <div className="flex items-center gap-2 px-3 py-1 rounded border border-border bg-muted/50 font-mono text-xs">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              SYSTEM.ONLINE
            </div>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-border py-6 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2">
          <Activity className="w-4 h-4" />
          GhostGrid Analysis Engine v1.0
        </div>
        <p className="text-xs mt-1">Built for demo</p>
      </footer>
    </div>
  );
}