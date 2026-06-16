import { cn } from "@zias/ui/lib/utils";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { BenchmarkMetric } from "../data/benchmarks";
import { formatBenchmarkValue } from "../data/benchmarks";
import { getModelName } from "../data/models";

interface BenchmarkExplorerProps {
  title: string;
  description?: string;
  metrics: BenchmarkMetric[];
  defaultMetricId?: string;
}

type ViewMode = "chart" | "table";

const modelColors = ["#6d5ac9", "#ed4920", "#2c86df", "#27c41f", "#ee5cbf"];

function getNumericValue(value: BenchmarkMetric["results"][number]["value"]) {
  return typeof value === "number" ? value : null;
}

export function BenchmarkExplorer({
  title,
  description,
  metrics,
  defaultMetricId,
}: BenchmarkExplorerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("chart");
  const [activeMetricId, setActiveMetricId] = useState(
    defaultMetricId ?? metrics[0]?.id ?? "",
  );
  const [sortBy, setSortBy] = useState<"source" | "best">("source");

  const activeMetric =
    metrics.find((metric) => metric.id === activeMetricId) ?? metrics[0];

  const rows = useMemo(() => {
    if (!activeMetric) return [];

    const mappedRows = activeMetric.results.map((result, index) => ({
      ...result,
      index,
      modelName: getModelName(result.modelId),
      numericValue: getNumericValue(result.value),
    }));

    if (sortBy === "source" || !activeMetric.direction) return mappedRows;

    return [...mappedRows].sort((a, b) => {
      if (a.numericValue === null) return 1;
      if (b.numericValue === null) return -1;

      return activeMetric.direction === "higher-is-better"
        ? b.numericValue - a.numericValue
        : a.numericValue - b.numericValue;
    });
  }, [activeMetric, sortBy]);

  if (!activeMetric) return null;

  const chartRows = rows.filter((row) => row.numericValue !== null);
  const directionLabel =
    activeMetric.direction?.replace(/-/g, " ") ?? "descriptive";

  return (
    <section className="not-prose my-10 overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-foreground/5 shadow-xl">
      <div className="border-border border-b bg-muted/35 p-4 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="font-display font-semibold text-foreground text-lg">
              {title}
            </p>
            {description && (
              <p className="mt-1 max-w-2xl text-muted-foreground text-sm leading-relaxed">
                {description}
              </p>
            )}
          </div>

          <div className="flex shrink-0 rounded-full border border-border bg-background p-1">
            {(["chart", "table"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setViewMode(mode)}
                className={cn(
                  "rounded-full px-3 py-1 font-medium text-xs capitalize transition-colors",
                  viewMode === mode
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-[1fr_auto]">
          <label className="grid gap-1 text-xs">
            <span className="font-medium text-muted-foreground uppercase tracking-wider">
              Metric
            </span>
            <select
              value={activeMetric.id}
              onChange={(event) => setActiveMetricId(event.target.value)}
              className="h-10 rounded-xl border border-border bg-background px-3 text-foreground text-sm outline-none transition-colors focus:border-foreground"
            >
              {metrics.map((metric) => (
                <option key={metric.id} value={metric.id}>
                  {metric.benchmark}: {metric.metric}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-xs">
            <span className="font-medium text-muted-foreground uppercase tracking-wider">
              Sort
            </span>
            <select
              value={sortBy}
              onChange={(event) =>
                setSortBy(event.target.value === "best" ? "best" : "source")
              }
              className="h-10 rounded-xl border border-border bg-background px-3 text-foreground text-sm outline-none transition-colors focus:border-foreground"
            >
              <option value="source">Source order</option>
              <option value="best">Best first</option>
            </select>
          </label>
        </div>
      </div>

      <div className="p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground capitalize">
            {activeMetric.category}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground">
            {directionLabel}
          </span>
          <span className="rounded-full bg-muted px-2.5 py-1 font-medium text-muted-foreground">
            Source: {activeMetric.source}
          </span>
        </div>

        {activeMetric.description && (
          <p className="mb-4 text-muted-foreground text-sm leading-relaxed">
            {activeMetric.description}
          </p>
        )}

        {viewMode === "chart" && chartRows.length > 0 ? (
          <div className="h-[320px] rounded-2xl border border-border bg-background p-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartRows.map((row, index) => ({
                  ...row,
                  fill: modelColors[index % modelColors.length],
                }))}
                margin={{ top: 10, right: 10, bottom: 52, left: 0 }}
              >
                <CartesianGrid
                  stroke="currentColor"
                  strokeOpacity={0.1}
                  vertical={false}
                />
                <XAxis
                  dataKey="modelName"
                  interval={0}
                  angle={-18}
                  textAnchor="end"
                  height={70}
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "currentColor", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={44}
                />
                <Tooltip
                  cursor={{ fill: "currentColor", opacity: 0.06 }}
                  formatter={(value) => [
                    `${value}${activeMetric.unit ?? ""}`,
                    activeMetric.metric,
                  ]}
                  labelClassName="font-medium"
                  contentStyle={{
                    borderRadius: 14,
                    border: "1px solid hsl(0 0% 80% / 0.35)",
                    boxShadow: "0 18px 60px rgb(0 0 0 / 0.14)",
                  }}
                />
                <Bar dataKey="numericValue" radius={[10, 10, 2, 2]}>
                  {chartRows.map((row, index) => (
                    <Cell
                      key={row.modelId}
                      fill={modelColors[index % modelColors.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <BenchmarkTable metric={activeMetric} rows={rows} />
        )}

        {viewMode === "chart" && (
          <div className="mt-5">
            <BenchmarkTable metric={activeMetric} rows={rows} compact />
          </div>
        )}
      </div>
    </section>
  );
}

interface BenchmarkTableProps {
  metric: BenchmarkMetric;
  rows: Array<BenchmarkMetric["results"][number] & { modelName: string }>;
  compact?: boolean;
}

function BenchmarkTable({
  metric,
  rows,
  compact = false,
}: BenchmarkTableProps) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-border">
      <table className="w-full border-collapse bg-background text-left text-sm">
        <caption className="sr-only">
          {metric.benchmark}: {metric.metric}
        </caption>
        <thead>
          <tr className="border-border border-b bg-muted/45">
            <th className="px-3 py-2 font-semibold text-foreground">Model</th>
            <th className="px-3 py-2 font-semibold text-foreground">Value</th>
            {!compact && (
              <th className="px-3 py-2 font-semibold text-foreground">Note</th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.modelId}
              className="border-border border-b last:border-b-0"
            >
              <td className="px-3 py-2 font-medium text-foreground">
                {row.modelName}
              </td>
              <td className="px-3 py-2 text-muted-foreground tabular-nums">
                {row.note ?? formatBenchmarkValue(metric, row.value)}
              </td>
              {!compact && (
                <td className="px-3 py-2 text-muted-foreground">
                  {row.note ?? "-"}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
