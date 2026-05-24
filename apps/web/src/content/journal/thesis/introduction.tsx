export default function IntroductionChapter() {
	return (
		<>
			<h2>Context</h2>
			<p>
				The most capable AI models are growing more dangerous faster than they
				are growing safer. In April 2026, a single frontier model independently
				discovered a 27-year-old vulnerability in the OpenBSD kernel, generated
				181 working browser exploits, and demonstrated the ability to escape its
				evaluation sandbox and post vulnerability data publicly — all while
				being developed by the safety research team considered most rigorous in
				the industry. This is not a failure to predict the future. It is the
				present state of a technology whose capabilities have outpaced both the
				institutions designed to govern it and the alignment research designed
				to contain it.
			</p>
			<p>
				Artificial intelligence is increasingly embedded in professional
				software development, content creation, and data processing pipelines.
				Organizations of all sizes now rely on large language models (LLMs) to
				generate code, draft documents, and automate knowledge work. This rapid
				adoption has outpaced the legal and ethical frameworks designed to
				govern it.
			</p>
			<p>
				Two fundamentally different categories of model exist:{" "}
				<em>open-weight</em> models, whose weights are publicly released and
				whose training processes are at least partially documented (e.g., Meta's
				Llama family, Mistral), and <em>proprietary</em> models, which are
				accessed exclusively through APIs and whose internals are treated as
				trade secrets (e.g., OpenAI's GPT series, Anthropic's Claude). This
				structural difference has significant consequences for how organizations
				can assess and manage risk — but as the benchmark data in this thesis
				demonstrates, the open/proprietary distinction matters less than the
				deployment context, and neither type of model provides adequate safety
				guarantees for agentic deployment without human oversight.
			</p>

			<h2>Research Questions</h2>
			<p>
				This thesis investigates three interconnected problems that arise when
				businesses adopt AI code generation and language models:
			</p>
			<ol>
				<li>
					<strong>Copyright Risk &amp; Training Data Detection</strong> To what
					extent do LLMs reproduce copyright-protected material, and can
					membership inference methods reliably determine whether specific data
					was used in training? How does license compliance in code generation
					differ between open-weight and proprietary models?
				</li>
				<li>
					<strong>Safety &amp; Ethical Evaluation</strong> How do open-weight
					and proprietary models compare across standardized safety benchmarks
					measuring harmful output, jailbreak robustness, over-refusal, and
					agentic safety? What ethical implications follow from these
					differences for business deployment?
				</li>
				<li>
					<strong>Transparency, Regulation &amp; Compliance</strong> How
					transparently do model providers document their systems, training
					data, and policies? How do the EU AI Act, NIST AI RMF, and ISO
					standards create concrete compliance obligations, and which model
					types are better positioned to meet them?
				</li>
			</ol>

			<h2>Scope and Delimitations</h2>
			<p>
				The thesis focuses on general-purpose language models used for code
				generation and text tasks in commercial contexts. Image generation
				models are excluded. The regulatory analysis centers on the EU AI Act
				and the geopolitical governance landscape as of April 2026;
				jurisdiction-specific national laws are referenced where relevant. Model
				evaluations are based on published benchmarks and publicly available
				results rather than original large-scale experiments. Where benchmark
				data is reported, specific sources are cited; approximate figures from
				leaderboards are noted as such.
			</p>

			<h2>Key Concepts</h2>
			<p>
				<strong>Open-weight models</strong> release their trained parameter
				weights, allowing local deployment, fine-tuning, and internal auditing.
				Openness varies: some providers release weights but not training data,
				evaluation code, or pre-training details. The Model Openness Framework
				(MOF) (Generative AI Commons, 2024) provides a structured taxonomy for
				this spectrum.
			</p>
			<p>
				<strong>Proprietary models</strong> are only accessible via API. The
				provider controls inference, updates, and data handling. Users receive
				contractual indemnification in some cases but have no ability to audit
				the model's behavior at the parameter level.
			</p>
			<p>
				<strong>Membership inference</strong> refers to the task of determining,
				given a text sample and a trained model, whether that sample was
				included in the model's training corpus. This has direct bearing on
				copyright liability.
			</p>
			<p>
				<strong>Safety benchmarks</strong> are standardized test suites that
				measure specific failure modes: generating harmful content, being
				jailbroken into bypassing safety training, refusing benign requests
				(over-refusal), or taking dangerous actions as an agent.
			</p>

			<h2>Thesis Structure</h2>
			<p>
				The <strong>copyright</strong> section covers copyright risk and
				training data detection, including CopyBench reproduction rates and
				LiCoEval license compliance scores by model. The <strong>safety</strong>{" "}
				section covers safety and ethical evaluation: benchmark results across
				HarmBench, JailbreakBench, SALAD-Bench, OR-Bench, AIR-Bench,
				Agent-SafetyBench, and MCP-SafetyBench; the structural mechanisms of
				alignment failure; and a deep-dive case study of Project Glasswing and
				Claude Mythos. The <strong>transparency</strong> section covers
				transparency indices, regulatory frameworks, and the geopolitical
				governance landscape as of 2026, including the US deregulation
				trajectory, EU AI Act enforcement timeline, and China's strategic
				approach. The <strong>framework</strong> section synthesizes the
				findings of all three areas into a comparative risk and ethics framework
				anchored to specific benchmark scores rather than qualitative estimates.
				The <strong>recommendations</strong> section presents evidence-based,
				time-sensitive guidance for organizations, model providers, and
				policymakers, calibrated to the August 2026 EU AI Act enforcement
				deadline. The <strong>manifest</strong> closes with a personal AI ethics
				manifest grounded in the benchmark findings and failure cases documented
				in the preceding chapters.
			</p>

			<hr />
		</>
	);
}
