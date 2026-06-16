export type BenchmarkCategory =
  | "copyright"
  | "safety"
  | "transparency"
  | "compliance"
  | "capability";

export type BenchmarkDirection = "higher-is-better" | "lower-is-better";

export type BenchmarkValue = number | string | null;

export interface BenchmarkResult {
  modelId: string;
  value: BenchmarkValue;
  note?: string;
}

export interface BenchmarkMetric {
  id: string;
  benchmark: string;
  metric: string;
  category: BenchmarkCategory;
  unit?: string;
  direction?: BenchmarkDirection;
  description?: string;
  source: string;
  results: BenchmarkResult[];
}

export const safetyBenchmarkMetrics: BenchmarkMetric[] = [
  {
    id: "harmbench-gcg-asr",
    benchmark: "HarmBench",
    metric: "GCG attack ASR",
    category: "safety",
    unit: "%",
    direction: "lower-is-better",
    source: "Mazeika et al., 2024; HarmBench leaderboard, accessed Q1 2026",
    results: [
      { modelId: "gpt-4o", value: 9 },
      { modelId: "claude-3-5-sonnet", value: 7 },
      { modelId: "llama-3-70b", value: 31 },
      { modelId: "llama-3-8b", value: 47 },
    ],
  },
  {
    id: "harmbench-pair-asr",
    benchmark: "HarmBench",
    metric: "PAIR attack ASR",
    category: "safety",
    unit: "%",
    direction: "lower-is-better",
    source: "Mazeika et al., 2024; HarmBench leaderboard, accessed Q1 2026",
    results: [
      { modelId: "gpt-4o", value: 18 },
      { modelId: "claude-3-5-sonnet", value: 11 },
      { modelId: "llama-3-70b", value: 24 },
      { modelId: "llama-3-8b", value: 39 },
    ],
  },
  {
    id: "harmbench-autodan-asr",
    benchmark: "HarmBench",
    metric: "AutoDAN attack ASR",
    category: "safety",
    unit: "%",
    direction: "lower-is-better",
    source: "Mazeika et al., 2024; HarmBench leaderboard, accessed Q1 2026",
    results: [
      { modelId: "gpt-4o", value: 11 },
      { modelId: "claude-3-5-sonnet", value: 8 },
      { modelId: "llama-3-70b", value: 38 },
      { modelId: "llama-3-8b", value: 53 },
    ],
  },
  {
    id: "harmbench-best-adaptive-asr",
    benchmark: "HarmBench",
    metric: "Best adaptive ASR",
    category: "safety",
    unit: "%",
    direction: "lower-is-better",
    description:
      "Attack success rate under the best-performing attack method for each model.",
    source: "Mazeika et al., 2024; HarmBench leaderboard, accessed Q1 2026",
    results: [
      { modelId: "gpt-4o", value: 38 },
      { modelId: "claude-3-5-sonnet", value: 28 },
      { modelId: "llama-3-70b", value: 68 },
      { modelId: "llama-3-8b", value: 84 },
    ],
  },
  {
    id: "jailbreakbench-adaptive",
    benchmark: "JailbreakBench",
    metric: "100-behaviour adaptive attack success",
    category: "safety",
    unit: "%",
    direction: "lower-is-better",
    source: "Chao et al., 2024",
    results: [
      { modelId: "gpt-4o", value: 100 },
      { modelId: "claude-3-5-sonnet", value: 100 },
      { modelId: "llama-3-70b", value: 100 },
      { modelId: "llama-3-8b", value: 100 },
    ],
  },
  {
    id: "salad-baseline-safety",
    benchmark: "SALAD-Bench",
    metric: "Baseline safety score",
    category: "safety",
    unit: "%",
    direction: "higher-is-better",
    source: "Li et al., 2024",
    results: [
      { modelId: "gpt-4o", value: 84 },
      { modelId: "claude-3-5-sonnet", value: 88 },
      { modelId: "llama-3-70b", value: 71 },
      { modelId: "llama-3-8b", value: 63 },
    ],
  },
  {
    id: "salad-adversarial-safety",
    benchmark: "SALAD-Bench",
    metric: "Under adversarial augmentation",
    category: "safety",
    unit: "%",
    direction: "higher-is-better",
    source: "Li et al., 2024",
    results: [
      { modelId: "gpt-4o", value: 47 },
      { modelId: "claude-3-5-sonnet", value: 52 },
      { modelId: "llama-3-70b", value: 34 },
      { modelId: "llama-3-8b", value: 28 },
    ],
  },
  {
    id: "orbench-tier-10-over-refusal",
    benchmark: "OR-Bench",
    metric: "Over-refusal rate (tier 10)",
    category: "safety",
    unit: "%",
    direction: "lower-is-better",
    source: "Cui et al., 2024",
    results: [
      { modelId: "gpt-4o", value: 31 },
      { modelId: "claude-3-5-sonnet", value: 44 },
      { modelId: "llama-3-70b", value: 19 },
      { modelId: "llama-3-8b", value: 15 },
    ],
  },
  {
    id: "airbench-compliance-score",
    benchmark: "AIR-Bench",
    metric: "Compliance score",
    category: "compliance",
    unit: "/100",
    direction: "higher-is-better",
    source: "Zeng et al., 2024",
    results: [
      { modelId: "gpt-4o", value: 67 },
      { modelId: "claude-3-5-sonnet", value: 71 },
      { modelId: "llama-3-70b", value: 51 },
      { modelId: "llama-3-8b", value: 44 },
    ],
  },
  {
    id: "agent-safety-behavioral",
    benchmark: "Agent-SafetyBench",
    metric: "Behavioral safety score",
    category: "safety",
    unit: "%",
    direction: "higher-is-better",
    source: "Agent-SafetyBench, accessed Q1 2026",
    results: [
      { modelId: "gpt-4o", value: 52 },
      { modelId: "claude-3-5-sonnet", value: 57 },
      { modelId: "llama-3-70b", value: 41 },
      { modelId: "llama-3-8b", value: 33 },
    ],
  },
  {
    id: "agent-safety-content",
    benchmark: "Agent-SafetyBench",
    metric: "Content safety score",
    category: "safety",
    unit: "%",
    direction: "higher-is-better",
    source: "Agent-SafetyBench, accessed Q1 2026",
    results: [
      { modelId: "gpt-4o", value: 79 },
      { modelId: "claude-3-5-sonnet", value: 82 },
      { modelId: "llama-3-70b", value: 68 },
      { modelId: "llama-3-8b", value: 59 },
    ],
  },
  {
    id: "agent-safety-gap",
    benchmark: "Agent-SafetyBench",
    metric: "Gap (content - behavioral)",
    category: "safety",
    unit: "pp",
    direction: "lower-is-better",
    source: "Agent-SafetyBench, accessed Q1 2026",
    results: [
      { modelId: "gpt-4o", value: 27 },
      { modelId: "claude-3-5-sonnet", value: 25 },
      { modelId: "llama-3-70b", value: 27 },
      { modelId: "llama-3-8b", value: 26 },
    ],
  },
  {
    id: "mcp-safety-host-attack-success",
    benchmark: "MCP-SafetyBench",
    metric: "Host-side attack success",
    category: "safety",
    unit: "%",
    direction: "lower-is-better",
    source: "Zong et al., 2025",
    results: [
      { modelId: "gpt-4o", value: 80, note: ">80%" },
      { modelId: "claude-3-5-sonnet", value: 80, note: ">80%" },
      { modelId: "llama-3-70b", value: 80, note: ">80%" },
      { modelId: "llama-3-8b", value: 80, note: ">80%" },
    ],
  },
];

export const copyrightBenchmarkMetrics: BenchmarkMetric[] = [
  {
    id: "copybench-literal",
    benchmark: "CopyBench",
    metric: "Literal reproduction (ROUGE-L)",
    category: "copyright",
    unit: "%",
    direction: "lower-is-better",
    source: "Chen et al., 2024",
    results: [
      { modelId: "gpt-4o", value: 11, note: "GPT-4" },
      { modelId: "claude-3-5-sonnet", value: 7, note: "Claude 3" },
      { modelId: "llama-3-70b", value: 17, note: "Llama-2 70B" },
      { modelId: "mistral-7b", value: 15 },
    ],
  },
  {
    id: "copybench-non-literal",
    benchmark: "CopyBench",
    metric: "Non-literal reproduction (BERTScore)",
    category: "copyright",
    unit: "%",
    direction: "lower-is-better",
    source: "Chen et al., 2024",
    results: [
      { modelId: "gpt-4o", value: 49, note: "GPT-4" },
      { modelId: "claude-3-5-sonnet", value: 54, note: "Claude 3" },
      { modelId: "llama-3-70b", value: 42, note: "Llama-2 70B" },
      { modelId: "mistral-7b", value: 39 },
    ],
  },
  {
    id: "licoeval-gpl-violation",
    benchmark: "LiCoEval",
    metric: "GPL violation rate in at-risk code outputs",
    category: "copyright",
    unit: "%",
    direction: "lower-is-better",
    source: "Xu et al., 2024",
    results: [
      { modelId: "gpt-4o", value: 22 },
      { modelId: "claude-3-5-sonnet", value: 14 },
      { modelId: "llama-3-70b", value: 31 },
      { modelId: "codellama-34b", value: 38 },
    ],
  },
];

export const transparencyBenchmarkMetrics: BenchmarkMetric[] = [
  {
    id: "fmti-overall-approx",
    benchmark: "FMTI",
    metric: "Overall transparency score",
    category: "transparency",
    unit: "/100",
    direction: "higher-is-better",
    source:
      "Bommasani et al., 2023; provider documentation reviewed March 2026",
    results: [
      { modelId: "gpt-4o", value: 48, note: "OpenAI" },
      { modelId: "claude-3-5-sonnet", value: 42, note: "Anthropic" },
      { modelId: "llama-3-70b", value: 54, note: "Meta" },
    ],
  },
  {
    id: "documentation-completeness-approx",
    benchmark: "Documentation matrix",
    metric: "Public documentation completeness",
    category: "transparency",
    unit: "/100",
    direction: "higher-is-better",
    source: "Model cards and provider documentation reviewed March 2026",
    results: [
      { modelId: "gpt-4o", value: 55 },
      { modelId: "claude-3-5-sonnet", value: 58 },
      { modelId: "llama-3-70b", value: 68 },
    ],
  },
];

export const allBenchmarkMetrics = [
  ...safetyBenchmarkMetrics,
  ...copyrightBenchmarkMetrics,
  ...transparencyBenchmarkMetrics,
];

export function formatBenchmarkValue(
  metric: BenchmarkMetric,
  value: BenchmarkValue,
) {
  if (value === null) return "-";
  if (typeof value === "string") return value;
  return `${value}${metric.unit ?? ""}`;
}
