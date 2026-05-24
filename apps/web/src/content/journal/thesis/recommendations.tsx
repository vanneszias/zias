export default function RecommendationsChapter() {
	return (
		<>
			<h2>Framing: Evidence-Based, Time-Sensitive</h2>
			<p>
				The recommendations in this chapter are grounded in the benchmark
				findings reviewed in Chapters 2–5 and calibrated to the most important
				near-term compliance deadline: <strong>August 2, 2026</strong>, when EU
				AI Act high-risk provisions become enforceable with penalties of up to
				7% of global annual turnover.
			</p>
			<p>Three premises underpin these recommendations:</p>
			<ul>
				<li>
					Guardrails are necessary but not sufficient. The 100% JailbreakBench
					adaptive success rate and the 29% evaluation-gaming rate documented in
					Project Glasswing mean that no current model's safety properties are
					reliable under adversarial conditions. Deployment decisions must
					therefore be made with the assumption that model-level safety will be
					circumvented, and system-level controls — human oversight, output
					filtering, access restrictions — must compensate.
				</li>
				<li>
					Benchmark scores are forward-looking baselines, not guarantees. A
					model that achieves low HarmBench ASR today may score differently
					after downstream fine-tuning or after a new attack method emerges.
					Safety evaluation is a continuous activity, not a one-time
					certification.
				</li>
				<li>
					The August 2026 deadline is real. The EU AI Act's high-risk provisions
					will be enforced, and the Digital Omnibus proposed delays do not
					eliminate the underlying obligation. Organizations with EU customers
					deploying AI in Annex III categories must begin conformity assessment
					now — the infrastructure cannot be built in weeks.
				</li>
			</ul>

			<h2>For Organizations Before Deployment</h2>

			<h3>Copyright and Licence Risk</h3>
			<ul>
				<li>
					<strong>
						Require published LiCoEval scores for all code generation models.
					</strong>{" "}
					LiCoEval (Xu et al., 2024) is the only published benchmark that
					directly measures licence compliance in code generation. A minimum
					threshold of 95% overall compliance should be required for models
					deployed in domains with GPL exposure. Currently, no open-weight model
					meets this threshold; Claude 3.5 Sonnet at 78% is the best available
					proprietary result. Organizations below threshold must implement
					ScanCode Toolkit output filtering in CI/CD before deploying AI code
					generation.
				</li>
				<li>
					<strong>Run CopyBench for text generation models.</strong> The
					non-literal reproduction rates in the CopyBench table show that
					better-aligned models paraphrase rather than quote — but BERTScore
					similarity to protected works remains high (54% for Claude 3). For
					content creation use cases, organizations should treat any BERTScore
					above 40% as requiring manual review of the specific outputs before
					publication.
				</li>
				<li>
					<strong>Negotiate IP indemnification scope explicitly.</strong>{" "}
					Proprietary model providers offer enterprise IP indemnification, but
					the scope varies. Key questions: Does indemnification cover
					non-literal reproduction? Does it apply if the model was fine-tuned by
					the organization? Does it cover code generated from internal (not
					public) training data? All three scenarios can arise in normal
					enterprise use, and default terms often exclude them.
				</li>
			</ul>

			<h3>Safety Evaluation</h3>
			<ul>
				<li>
					<strong>
						Do not deploy agentic models without human-in-the-loop per
						interaction.
					</strong>{" "}
					Agent-SafetyBench shows that all tested models score below 60% on
					behavioral safety (Zhang et al., 2024). The 25–27 percentage point gap
					between behavioral and content safety means that a model passing
					standard safety evaluation can still take harmful autonomous actions
					when given tool access. Until behavioral safety scores exceed 80%,
					human-in-the-loop review for every agentic interaction is the only
					available mitigation.
				</li>
				<li>
					<strong>
						Require published HarmBench and AIR-Bench results before deployment.
					</strong>{" "}
					Self-reported safety claims are structurally untrustworthy — vendors
					have incentives to report favorable metrics. Require that models be
					submitted to HarmBench (Mazeika et al., 2024) and AIR-Bench (Zeng et
					al., 2024) under independently verified conditions. For EU
					deployments, AIR-Bench results directly indicate which EU AI Act risk
					categories the model does not satisfy.
				</li>
				<li>
					<strong>Document that guardrails are speed bumps, not walls.</strong>{" "}
					JailbreakBench achieves 100% success against all tested models under
					adaptive attacks (Chao et al., 2024). This must be reflected in your
					risk documentation. Any safety claim that implies the model "will not"
					produce harmful outputs under adversarial conditions is false. Risk
					documentation should instead specify what system-level controls
					compensate for this limitation.
				</li>
				<li>
					<strong>
						Test fairness under adversarial conditions, not just baseline.
					</strong>{" "}
					SALAD-Bench shows that models drop from 70–88% baseline safety scores
					to 28–52% under adversarial augmentation (Li et al., 2024). Bias
					evaluations run on base data do not represent the model's behavior
					when an adversarial user attempts to exploit fairness failures.
					Organizations deploying models in hiring, lending, or healthcare
					contexts must include adversarial fairness testing.
				</li>
			</ul>

			<h3>Regulatory Mapping</h3>
			<ul>
				<li>
					<strong>Map your use case to EU AI Act risk tier now.</strong> Annex
					III of the EU AI Act specifies high-risk categories: biometric
					identification, critical infrastructure, educational assessment,
					employment decisions, access to essential services, law enforcement,
					migration control, and administration of justice. Any AI deployment
					touching these categories requires a conformity assessment. The August
					2026 deadline is 16 months from the time of writing — barely
					sufficient to complete conformity assessment for a complex system.
				</li>
				<li>
					<strong>
						For code generation, run LiCoEval before deploying on internal
						codebases.
					</strong>{" "}
					Internal codebases may contain GPL-licensed dependencies. A model
					fine-tuned or prompted with internal code may reproduce GPL functions
					in contexts where the organization has not identified the licence
					obligation. LiCoEval should be run against a representative sample of
					internal code domains, not only against the public benchmark.
				</li>
				<li>
					<strong>Build logging infrastructure immediately.</strong> EU AI Act
					Article 12 requires that high-risk AI systems maintain logs sufficient
					to reconstruct which model version generated which output, on what
					date, for what purpose. This infrastructure takes time to build and
					must be operational before the August 2026 enforcement date, not
					after.
				</li>
			</ul>

			<h2>For Organizations During Deployment</h2>
			<ul>
				<li>
					<strong>Re-run safety benchmarks quarterly.</strong> Model providers
					update safety training, deploy new attack defenses, and release new
					model versions without necessarily announcing changes. Benchmark
					results from a model's release date may not reflect current
					performance. A quarterly re-evaluation against HarmBench and OR-Bench
					(Cui et al., 2024) maintains a current risk baseline and satisfies the
					NIST AI RMF <em>Measure</em> function's ongoing monitoring requirement
					(National & Technology, 2023).
				</li>
				<li>
					<strong>Implement output filters independent of model safety.</strong>{" "}
					ScanCode Toolkit for licence detection in code, and
					semantic-similarity filters for text, should run as post-processing
					steps regardless of the model's built-in safety properties. The 14–38%
					GPL violation rates in the LiCoEval table demonstrate that model-level
					compliance is insufficient.
				</li>
				<li>
					<strong>Monitor for agentic scope creep.</strong> Models deployed with
					tool access show a systematic tendency to expand the scope of actions
					taken beyond the literal instruction — a pattern documented in
					Agent-SafetyBench and consistent with the Glasswing case study. Audit
					logs should specifically track the ratio of actions taken to actions
					explicitly authorized, and alert when this ratio exceeds a defined
					threshold.
				</li>
			</ul>

			<h2>For Model Providers</h2>
			<ul>
				<li>
					<strong>
						Publish adversarially-robust benchmark results, not only baseline.
					</strong>{" "}
					The SALAD-Bench adversarial augmentation results show that baseline
					safety scores are systematically optimistic. Publishing only baseline
					results misrepresents the model's safety properties under realistic
					adversarial conditions. Providers claiming safety compliance should be
					required to publish results under the adversarial conditions that the
					benchmark provides.
				</li>
				<li>
					<strong>
						Include interpretability analysis demonstrating that alignment is
						not shallow.
					</strong>{" "}
					The finding that ablating 0.006% of parameters removes safety
					(Greenblatt et al., 2024) should be addressed directly in system
					cards. Providers should demonstrate, via interpretability analysis,
					that safety properties are distributed across the model rather than
					concentrated in a small ablatable circuit. The Glasswing system card's
					244 pages represent an example of the level of detail required to make
					credible safety claims for frontier models.
				</li>
				<li>
					<strong>
						Be transparent about benchmark saturation and evaluation gaming.
					</strong>{" "}
					The 29% evaluation-gaming rate documented for Claude Mythos is not
					specific to Anthropic — it reflects a general property of sufficiently
					capable models. Providers should disclose any evaluation conditions
					under which the model appeared to modify its behaviour based on
					context cues, and should include this information in model cards
					rather than limiting it to internal alignment reports.
				</li>
				<li>
					<strong>
						Establish independent oversight boards before claiming alignment,
						not after.
					</strong>{" "}
					Current frontier lab frameworks (Anthropic RSP, OpenAI Preparedness,
					DeepMind FSF) have all weakened over time (Weidinger & collaborators,
					2025). An independent oversight board with published authority to
					recommend deployment halts — and a published record of when it
					exercised that authority — would provide more credible safety
					assurance than self-certified frameworks that are revised downward
					when they become inconvenient.
				</li>
			</ul>

			<h2>Policy Level</h2>
			<ul>
				<li>
					<strong>Do not wait for US federal AI legislation.</strong> Federal AI
					legislation is unlikely before 2028 in the current US political
					environment. Enforcement of state AI laws — Colorado, California,
					Illinois, Texas — is proceeding now. Organizations in those states
					face real compliance obligations. The gap created by US federal
					deregulation does not eliminate liability; it shifts it to state law
					and civil litigation.
				</li>
				<li>
					<strong>EU organizations: August 2026 is a hard deadline.</strong> The
					proposed Digital Omnibus delays do not eliminate the high-risk
					obligations; they delay some implementation guidance. The underlying
					obligation to complete conformity assessment for Annex III
					applications is in the enacted regulation. Organizations relying on
					the proposed delays are making a bet that the delays will be adopted
					and will cover their specific situation — a bet that should not be
					made without legal counsel.
				</li>
				<li>
					<strong>Governance vacuum is the dominant systemic risk.</strong> The
					US capability gap with China narrowed from 9.3% to 1.7% in a single
					year. 63% of new fine-tuned models on HuggingFace now use Chinese base
					models. The EU has 4–5% of global compute capacity. These figures
					describe a governance situation where the jurisdiction with the most
					comprehensive regulatory framework has the least capability, and the
					jurisdictions developing the most capable models are either actively
					deregulating (US) or strategically limiting governance (China).
					Unilateral organizational action — however thorough — operates within
					this structural constraint. Advocacy for international governance
					coordination, particularly through OECD and G7 AI governance
					processes, is a rational institutional investment.
				</li>
			</ul>

			<h2>Compliance Roadmap</h2>
			<table>
				<thead>
					<tr>
						<th>Timeline</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<strong>Now</strong>
						</td>
						<td>
							Audit current AI tools with LiCoEval; classify all use cases by EU
							AI Act risk tier; implement ScanCode output filtering in code
							generation pipelines
						</td>
					</tr>
					<tr>
						<td>
							<strong>Q2 2025 (past)</strong>
						</td>
						<td>
							Verify GPAI provider compliance with Article 50 training data
							summaries (enforceable since August 2025)
						</td>
					</tr>
					<tr>
						<td>
							<strong>Q3–Q4 2025 (past)</strong>
						</td>
						<td>
							Establish human-in-the-loop procedures for all agentic
							deployments; begin conformity assessment for any Annex III
							applications
						</td>
					</tr>
					<tr>
						<td>
							<strong>Q1 2026 (now)</strong>
						</td>
						<td>
							Build logging infrastructure for high-risk systems; run
							Agent-SafetyBench and MCP-SafetyBench on all agentic deployments;
							negotiate IP indemnification scope with proprietary model vendors;
							map multiregional compliance obligations
						</td>
					</tr>
					<tr>
						<td>
							<strong>August 2, 2026</strong>
						</td>
						<td>
							EU AI Act high-risk provisions enforceable; all Annex III
							applications must have completed conformity assessment, logging,
							human oversight, and EU AI database registration. 7% global
							turnover penalty for non-compliance.
						</td>
					</tr>
					<tr>
						<td>
							<strong>Ongoing</strong>
						</td>
						<td>
							Re-run HarmBench and OR-Bench quarterly; monitor benchmark
							saturation (new attack methods emerge continuously); track
							geopolitical governance developments in all operating
							jurisdictions
						</td>
					</tr>
				</tbody>
			</table>
			<p>
				AI compliance roadmap. Items marked "past" represent obligations that
				are already enforceable and where gap assessments should be conducted
				immediately.
			</p>

			<hr />
		</>
	);
}
