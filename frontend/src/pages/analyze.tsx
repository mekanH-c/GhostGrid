import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Zap,
  UploadCloud,
  FileText,
  AlertTriangle,
  Lightbulb,
  Loader2,
  ArrowRight,
  Leaf,
} from "lucide-react";

const API_BASE = "/api";

export function Analyze() {
  const [csvInput, setCsvInput] = useState("");
  const [result, setResult] = useState<any>(null);

  // Load Sample Data
  const { refetch: loadSample, isFetching: loadingSample } = useQuery({
    queryKey: ["sample"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/energy/sample`);
      return res.json();
    },
    enabled: false,
  });

  const handleLoadSample = async () => {
    const data = await loadSample();
    if (data.data?.csvData) setCsvInput(data.data.csvData);
  };

  // Analyze Mutation
  const analyzeMutation = useMutation({
    mutationFn: async (csvData: string) => {
      const res = await fetch(`${API_BASE}/energy/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData }),
      });
      if (!res.ok) throw new Error("Analysis failed");
      return res.json();
    },
    onSuccess: (data) => setResult(data),
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setCsvInput(ev.target?.result as string);
    reader.readAsText(file);
  };

  const handleAnalyze = () => {
    if (!csvInput.trim()) return;
    analyzeMutation.mutate(csvInput);
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-7xl">
      <h1 className="text-4xl font-bold font-mono mb-10 flex items-center gap-3">
        <Zap className="text-primary" /> Energy Analyzer
      </h1>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Left Panel - Input */}
        <div className="lg:col-span-5">
          <div className="bg-card border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="text-primary" />
              <h2 className="font-semibold">Data Input</h2>
            </div>

            <div className="flex gap-3 mb-4">
              <button
                onClick={handleLoadSample}
                disabled={loadingSample}
                className="flex-1 bg-secondary hover:bg-secondary/80 py-3 rounded-lg flex items-center justify-center gap-2"
              >
                {loadingSample ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Load Sample Data"
                )}
              </button>

              <label className="flex-1 cursor-pointer">
                <div className="bg-secondary hover:bg-secondary/80 py-3 rounded-lg flex items-center justify-center gap-2">
                  <UploadCloud /> Upload CSV
                </div>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
              </label>
            </div>

            <textarea
              className="w-full h-96 bg-background border border-border rounded-xl p-4 font-mono text-sm resize-none"
              placeholder="Paste your time,energy_kwh CSV here..."
              value={csvInput}
              onChange={(e) => setCsvInput(e.target.value)}
            />

            <button
              onClick={handleAnalyze}
              disabled={!csvInput.trim() || analyzeMutation.isPending}
              className="mt-6 w-full h-14 bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-xl text-lg font-medium flex items-center justify-center gap-3"
            >
              {analyzeMutation.isPending ? (
                <>
                  Analyzing with AI <Loader2 className="animate-spin" />
                </>
              ) : (
                <>
                  Run AI Diagnostics <ArrowRight />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="lg:col-span-7">
          {analyzeMutation.isPending ? (
            <div className="h-96 flex flex-col items-center justify-center border border-border rounded-2xl bg-card/50">
              <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
              <p className="font-mono text-primary">
                AI is analyzing your energy data...
              </p>
            </div>
          ) : result ? (
            <div className="space-y-8">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-card border border-border p-6 rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    Total Consumption
                  </p>
                  <p className="text-4xl font-mono font-bold mt-2">
                    {result.totalKwh?.toFixed(1)}{" "}
                    <span className="text-lg">kWh</span>
                  </p>
                </div>
                <div className="bg-card border border-border p-6 rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    Est. Monthly Waste
                  </p>
                  <p className="text-4xl font-mono font-bold text-destructive mt-2">
                    {result.totalMonthlySavingsKwh?.toFixed(1)}{" "}
                    <span className="text-lg">kWh</span>
                  </p>
                </div>
                <div className="bg-card border border-border p-6 rounded-2xl">
                  <p className="text-sm text-muted-foreground">
                    CO₂ Impact / Mo
                  </p>
                  <p className="text-4xl font-mono font-bold text-primary mt-2">
                    {result.totalMonthlyCo2Kg?.toFixed(1)}{" "}
                    <span className="text-lg">kg</span>
                  </p>
                </div>
              </div>

              <div className="bg-card border border-border p-6 rounded-2xl">
                <p className="leading-relaxed">{result.summary}</p>
              </div>

              {/* Ghost Loads & Recommendations */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="flex items-center gap-2 text-lg font-mono mb-4 text-destructive">
                    <AlertTriangle /> Ghost Loads Detected
                  </h3>
                  {result.ghostLoads?.map((load: any, i: number) => (
                    <div
                      key={i}
                      className="mb-4 p-5 border border-border rounded-xl bg-background"
                    >
                      <div className="flex justify-between">
                        <span className="font-mono text-sm bg-muted px-3 py-1 rounded">
                          {load.timeRange}
                        </span>
                        <span className="text-xs uppercase tracking-widest">
                          {load.severity}
                        </span>
                      </div>
                      <div className="text-2xl font-bold mt-3">
                        {load.usageKwh} kWh
                      </div>
                      <p className="text-sm mt-2 text-muted-foreground">
                        {load.explanation}
                      </p>
                    </div>
                  ))}
                </div>

                <div>
                  <h3 className="flex items-center gap-2 text-lg font-mono mb-4 text-primary">
                    <Lightbulb /> Recommendations
                  </h3>
                  {result.recommendations?.map((rec: any, i: number) => (
                    <div
                      key={i}
                      className="mb-4 p-5 border border-border rounded-xl bg-background"
                    >
                      <div className="font-medium">{rec.action}</div>
                      <div className="flex gap-6 mt-4 text-sm">
                        <span className="flex items-center gap-1">
                          <Zap className="w-4 h-4" /> {rec.estimatedSavingsKwh}{" "}
                          kWh/mo
                        </span>
                        <span className="flex items-center gap-1">
                          <Leaf className="w-4 h-4" /> {rec.estimatedCo2Kg} kg
                          CO₂
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center border border-dashed border-border rounded-2xl text-muted-foreground">
              <FileText className="w-16 h-16 mb-6 opacity-30" />
              <p>
                Load sample data or upload your CSV and click "Run AI
                Diagnostics"
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
