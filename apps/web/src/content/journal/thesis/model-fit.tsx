import { BenchmarkExplorer } from "./components/benchmark-explorer";
import { ModelFitTest } from "./components/model-fit-test";
import { allBenchmarkMetrics } from "./data/benchmarks";

export default function ModelFitChapter() {
	return (
		<>
			<p>
				This final chapter turns the evidence from the thesis into a practical
				selection exercise. It does not ask which model is objectively best. It
				asks which model best fits a specific set of risks, values, and
				deployment constraints.
			</p>

			<h2>How the Test Works</h2>
			<p>
				Each answer adjusts the weight given to the same dimensions used
				throughout the thesis: copyright risk, safety, transparency, regulatory
				alignment, agentic safety, usefulness, and deployment control. The model
				profiles are anchored to the benchmark results and structural comparison
				in the earlier chapters.
			</p>
			<p>
				The output should be read as a decision aid, not as legal advice or a
				permanent leaderboard. Benchmark results change, provider contracts
				change, and deployment context can dominate model-level properties.
			</p>

			<ModelFitTest />

			<h2>Evidence Behind the Recommendation</h2>
			<p>
				The explorer below exposes the benchmark data behind the scoring model.
				If new benchmark releases arrive, update the typed benchmark data and
				the chapter, charts, and test can all reflect the new evidence.
			</p>
			<BenchmarkExplorer
				title="Recommendation Evidence Explorer"
				description="Inspect the benchmark metrics that inform the model-fit test."
				metrics={allBenchmarkMetrics}
				defaultMetricId="harmbench-best-adaptive-asr"
			/>

			<h2>Interpretation Rule</h2>
			<p>
				A recommendation for a proprietary model usually means: prefer managed
				safety updates, enterprise contracting, and stronger current benchmark
				performance, while accepting transparency limits. A recommendation for
				an open-weight model usually means: prefer auditability, local control,
				and values-aligned openness, while accepting greater operator
				responsibility.
			</p>
		</>
	);
}
