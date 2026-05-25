import { BenchmarkExplorer } from "./components/benchmark-explorer";
import { transparencyBenchmarkMetrics } from "./data/benchmarks";

export default function TransparencyChapter() {
	return (
		<>
			<h2>Overview</h2>
			<p>
				Transparency in the context of AI models refers to the degree to which a
				provider discloses information about how a model was built, trained, and
				evaluated. This encompasses the training data used, the model
				architecture, the evaluation results, the licensing terms, and the
				policies governing deployment. Transparency is both an ethical value —
				organizations and users have a legitimate interest in understanding the
				tools they depend on — and a legal obligation under emerging regulatory
				frameworks.
			</p>
			<p>
				The open-weight vs. proprietary divide maps imperfectly onto the
				transparency dimension. Some open-weight providers release weights but
				disclose little about training data. Some proprietary providers publish
				detailed technical reports and evaluation results. Transparency is
				therefore better understood as a spectrum scored across multiple
				dimensions, rather than a binary property determined by weight
				availability.
			</p>
			<p>
				This section reviews the tools and frameworks used to measure
				transparency and compliance, and analyses the obligations imposed by the
				EU AI Act, NIST AI RMF, and ISO standards.
			</p>

			<h2>Transparency Measurement Tools</h2>

			<h3>Foundation Model Transparency Index (FMTI)</h3>
			<p>(Bommasani et al., 2023)</p>
			<p>
				<strong>What it does.</strong> The FMTI scores foundation model
				providers across 100 binary transparency indicators grouped into three
				domains:
			</p>
			<ul>
				<li>
					<strong>Upstream</strong>: training data sources, data governance,
					compute disclosure, labour practices (e.g., data labelers).
				</li>
				<li>
					<strong>Model</strong>: architecture documentation, weight
					availability, evaluation methodology, model cards.
				</li>
				<li>
					<strong>Downstream</strong>: usage policies, terms of service,
					deployment documentation, impact assessment, user redress mechanisms.
				</li>
			</ul>
			<p>
				The index is published annually; the 2023 edition scored 10 major
				providers. Scores range widely: Meta's Llama 2 scored 54/100 while GPT-4
				scored 48/100. Notably, releasing weights does not automatically produce
				a high upstream score — Meta disclosed little about training data
				composition despite releasing weights.
			</p>
			<p>
				<strong>Relevance.</strong> The FMTI is the most structured available
				tool for comparing provider transparency. It enables a direct,
				evidence-based comparison of open-weight and proprietary providers that
				goes beyond the weight/no-weight binary.
			</p>
			<p>
				<strong>Setup / Usage.</strong> The FMTI is a scored dataset, not
				executable software. To use it:
			</p>
			<pre>
				<code>{"git clone https://github.com/stanford-crfm/fmti"}</code>
			</pre>
			<p>
				The repository contains the scoring rubric as a CSV, provider scores,
				and the methodology document. To evaluate a new provider: work through
				each of the 100 indicators using the rubric definition, assign 0 or 1,
				and aggregate by domain. Results can be compared against the published
				scores of reference providers.
			</p>

			<h3>HELM — Holistic Evaluation of Language Models</h3>
			<p>((Liang et al., 2022); (Center, 2024))</p>
			<p>
				<strong>What it does.</strong> HELM evaluates models across seven
				dimensions simultaneously: accuracy, calibration, robustness, fairness,
				bias, toxicity, and efficiency. Rather than optimizing a single
				leaderboard metric, HELM surfaces the multi-dimensional trade-offs: a
				model may rank first on accuracy but poorly on fairness, revealing that
				its headline performance comes at an ethical cost.
			</p>
			<p>
				HELM's transparency contribution is methodological: it provides a{" "}
				<em>reproducible</em> evaluation infrastructure so that model
				comparisons are conducted under identical conditions. This counters the
				common practice of selectively reporting benchmark results on metrics
				where a model performs best.
			</p>
			<p>
				<strong>Relevance.</strong> For transparency analysis, HELM's
				comparative evaluation of open and proprietary models under controlled
				conditions provides a baseline for understanding whether capability
				claims are substantiated and whether safety-related properties
				(toxicity, bias) differ systematically across model types.
			</p>
			<p>
				<strong>Setup.</strong>
			</p>
			<pre>
				<code>{`pip install crfm-helm
helm-run \\
 --conf src/helm/benchmark/presentation/run_entries_lite.conf \\
 --suite my_run \\
 --max-eval-instances 100
helm-summarize --suite my_run
helm-server # local web UI at localhost:8000`}</code>
			</pre>
			<p>
				The lite configuration runs only on open-weight models. Full evaluation
				requires API keys for proprietary models (OpenAI, Anthropic, Google).
			</p>

			<h3>Is It Open? — Model Openness Tool (MOT)</h3>
			<p>(Generative AI Commons, 2024)</p>
			<p>
				<strong>What it does.</strong> IsItOpen.ai implements the{" "}
				<em>Model Openness Framework</em> (MOF), which defines three openness
				tiers:
			</p>
			<table>
				<thead>
					<tr>
						<th>Tier</th>
						<th>Requirements</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Open</td>
						<td>
							Weights, training data, code, evaluations, and documentation are
							all publicly available under open licences
						</td>
					</tr>
					<tr>
						<td>Open-Weight</td>
						<td>
							Weights are available, but training data, full code, or
							evaluations are not fully disclosed
						</td>
					</tr>
					<tr>
						<td>Closed</td>
						<td>No weight access; API-only with minimal disclosure</td>
					</tr>
				</tbody>
			</table>
			<p>Model Openness Framework tiers</p>
			<p>
				Within each tier, models are scored across 13 components including
				training data, architecture, evaluation results, and licensing. This
				operationalizes "openness" with enough granularity to distinguish, for
				example, a model that releases weights under a restricted license from
				one that uses a genuinely open license.
			</p>
			<p>
				<strong>Relevance.</strong> IsItOpen provides the clearest direct
				comparison tool for the open-weight vs. proprietary axis central to this
				thesis. The 13-component scoring enables a nuanced analysis rather than
				a binary open/closed classification.
			</p>
			<p>
				<strong>Setup / Usage.</strong> Navigate to{" "}
				<code>https://isitopen.ai/</code> to view any model's MOF score. Export
				component scores as CSV via the download button. The MOF specification
				is at: <code>https://github.com/lfai/model-openness-framework</code>
			</p>

			<h2>Regulatory Frameworks</h2>

			<h3>EU AI Act (Regulation 2024/1689)</h3>
			<p>(European & Council, 2024)</p>
			<p>
				The EU AI Act is the world's first comprehensive binding regulation on
				AI systems, in force from August 2024 with staggered enforcement dates
				(high-risk provisions apply from August 2026; GPAI provisions from
				August 2025).
			</p>
			<p>
				<strong>Risk classification.</strong> The Act classifies AI systems by
				risk level:
			</p>
			<table>
				<thead>
					<tr>
						<th>Level</th>
						<th>Examples and obligations</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Unacceptable</td>
						<td>
							Social scoring, real-time biometric surveillance — prohibited
						</td>
					</tr>
					<tr>
						<td>High-risk</td>
						<td>
							Medical devices, recruitment, credit scoring, critical
							infrastructure — mandatory conformity assessment, logging, human
							oversight
						</td>
					</tr>
					<tr>
						<td>Limited</td>
						<td>
							Chatbots — transparency obligations (must disclose AI nature)
						</td>
					</tr>
					<tr>
						<td>Minimal</td>
						<td>Spam filters, AI in games — no specific obligations</td>
					</tr>
				</tbody>
			</table>
			<p>EU AI Act risk classification</p>
			<p>
				<strong>GPAI-specific obligations.</strong> General-purpose AI model
				providers (those whose models are used across multiple downstream
				applications, including GPT-4 and Llama) face obligations under Articles
				50–55:
			</p>
			<ul>
				<li>
					<strong>Article 50:</strong> Providers must publish a summary of
					training data sufficient for copyright compliance assessment. This is
					the clearest regulatory mandate for training data transparency.
				</li>
				<li>
					<strong>Article 53:</strong> Technical documentation, model cards, and
					usage policies must be maintained and provided to downstream
					deployers.
				</li>
				<li>
					<strong>Annex XI/XII:</strong> Providers of models with "systemic
					risk" (above 10^25 FLOP training compute) face additional adversarial
					testing and incident reporting obligations.
				</li>
			</ul>
			<p>
				<strong>Compliance gap analysis.</strong> Cross-referencing FMTI scores
				against EU AI Act requirements reveals where providers fall short.
				Providers scoring low on the FMTI upstream domain (training data
				disclosure) are likely non-compliant with Article 50. Providers without
				published model cards may fail Article 53 documentation requirements.
			</p>

			<h3>NIST AI Risk Management Framework (AI RMF 1.0)</h3>
			<p>(National & Technology, 2023)</p>
			<p>
				The NIST AI RMF is a voluntary US framework organized around four
				functions:
			</p>
			<ul>
				<li>
					<strong>Govern:</strong> Establish organizational policies,
					accountability structures, and culture for responsible AI.
				</li>
				<li>
					<strong>Map:</strong> Identify the context, risks, and stakeholders
					relevant to a specific AI deployment.
				</li>
				<li>
					<strong>Measure:</strong> Assess and analyse AI risks using
					quantitative and qualitative tools.
				</li>
				<li>
					<strong>Manage:</strong> Prioritize and treat identified risks with
					appropriate responses.
				</li>
			</ul>
			<p>
				While not legally binding, the AI RMF is widely adopted in US federal
				procurement and serves as a reference standard for US-based
				organizations. It also aligns closely with the EU AI Act's risk
				management requirements (Article 9), making it useful as a unified
				framework for multinational organizations.
			</p>
			<p>
				<strong>Relevance to benchmarks.</strong> The <em>Measure</em> function
				directly maps to the benchmarks covered in this thesis: MIN-K%,
				CopyBench, and LiCoEval address copyright risk measurement; HarmBench,
				JailbreakBench, and AIR-Bench address safety risk measurement; the FMTI
				and HELM address transparency measurement.
			</p>

			<h3>ISO/IEC 42001:2023 — AI Management System (AIMS)</h3>
			<p>(2023)</p>
			<p>
				ISO 42001 defines requirements for an <em>AI Management System</em>: the
				organizational processes, policies, and controls that should govern the
				development and use of AI. It is structurally similar to ISO 27001
				(information security management) and ISO 9001 (quality management),
				making it familiar to compliance teams.
			</p>
			<p>Key clauses relevant to model selection and risk:</p>
			<ul>
				<li>
					<strong>Clause 6.1</strong> (Risk assessment): Organizations must
					identify and assess AI risks, including those arising from training
					data and model behaviour.
				</li>
				<li>
					<strong>Clause 8.4</strong> (Data for AI systems): Data governance
					requirements covering quality, provenance, and consent.
				</li>
				<li>
					<strong>Clause 9.1</strong> (Monitoring and measurement): Ongoing
					evaluation of AI system performance against defined criteria.
				</li>
			</ul>
			<p>
				An organization seeking ISO 42001 certification must document how it
				addresses copyright risk (Clause 8.4), safety evaluation (Clause 9.1),
				and transparency toward stakeholders (Clause 7.4).
			</p>

			<h3>ISO/IEC 5338:2023 — AI System Life Cycle Processes</h3>
			<p>(2023)</p>
			<p>
				ISO 5338 extends the software life cycle standard ISO 12207 to cover
				AI-specific concerns. It defines processes across the AI life cycle:
				concept, development, testing, deployment, operation, and retirement.
				Each phase has associated outputs (e.g., a data management plan at the
				concept phase, an evaluation report at the testing phase).
			</p>
			<p>
				For the purpose of this thesis, ISO 5338 provides a reference for what
				documentation a well-governed AI deployment should produce. It can be
				used to audit whether open-weight model deployments (which typically
				involve internal fine-tuning and deployment) are managed with
				appropriate process rigor.
			</p>

			<h2>Model Documentation Comparison</h2>
			<p>
				The following matrix summarizes the key transparency dimensions across
				the model categories considered in this thesis. Values are drawn from
				published FMTI data, model cards, and provider documentation reviewed in
				March 2026.
			</p>
			<BenchmarkExplorer
				title="Interactive Transparency Benchmark Explorer"
				description="Compare approximate transparency and documentation scores across the representative model providers."
				metrics={transparencyBenchmarkMetrics}
				defaultMetricId="fmti-overall-approx"
			/>
			<table>
				<thead>
					<tr>
						<th>Dimension</th>
						<th>Llama 3 (Meta)</th>
						<th>Mistral (Mistral AI)</th>
						<th>GPT-4o (OpenAI)</th>
						<th>Claude 3.5 (Anthropic)</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>
							<strong>Upstream</strong>
						</td>
						<td />
						<td />
						<td />
						<td />
					</tr>
					<tr>
						<td>Training data disclosed?</td>
						<td>Partial</td>
						<td>Partial</td>
						<td>No</td>
						<td>No</td>
					</tr>
					<tr>
						<td>Data consent documented?</td>
						<td>No</td>
						<td>No</td>
						<td>No</td>
						<td>No</td>
					</tr>
					<tr>
						<td>Compute disclosed?</td>
						<td>Yes</td>
						<td>Partial</td>
						<td>No</td>
						<td>No</td>
					</tr>
					<tr>
						<td>
							<strong>Model</strong>
						</td>
						<td />
						<td />
						<td />
						<td />
					</tr>
					<tr>
						<td>Weights publicly available?</td>
						<td>Yes</td>
						<td>Yes</td>
						<td>No</td>
						<td>No</td>
					</tr>
					<tr>
						<td>Model card published?</td>
						<td>Yes</td>
						<td>Partial</td>
						<td>Yes</td>
						<td>Yes</td>
					</tr>
					<tr>
						<td>Evaluation results public?</td>
						<td>Partial</td>
						<td>Partial</td>
						<td>Partial</td>
						<td>Partial</td>
					</tr>
					<tr>
						<td>
							<strong>Downstream</strong>
						</td>
						<td />
						<td />
						<td />
						<td />
					</tr>
					<tr>
						<td>Usage policy published?</td>
						<td>Yes</td>
						<td>Yes</td>
						<td>Yes</td>
						<td>Yes</td>
					</tr>
					<tr>
						<td>IP indemnification?</td>
						<td>No</td>
						<td>No</td>
						<td>Enterprise only</td>
						<td>Enterprise only</td>
					</tr>
					<tr>
						<td>EU AI Act Article 50 compliant?</td>
						<td>Unclear</td>
						<td>Unclear</td>
						<td>Partial</td>
						<td>Partial</td>
					</tr>
				</tbody>
			</table>
			<p>
				Model transparency comparison (approximate, based on publicly available
				documentation)
			</p>
			<p>
				The table reveals a consistent pattern: no provider fully meets the
				transparency standard implied by the FMTI's 100-indicator rubric.
				Training data consent and disclosure remain the most universally
				undisclosed dimension. This has direct implications for EU AI Act
				Article 50 compliance, which will become enforceable for GPAI providers
				from August 2025.
			</p>

			<h2>Geopolitical Governance Landscape</h2>
			<p>
				The regulatory frameworks described in the EU AI act through the ISO
				5338 sections exist within a geopolitical context that is increasingly
				fragmented and in some jurisdictions deliberately weakened.
				Understanding this landscape is not academic: an organization deploying
				AI models across multiple jurisdictions faces fundamentally incompatible
				legal obligations, and the dominant risk vector in 2026 is no longer a
				single regulatory standard but the absence of a coherent one.
			</p>
			<p>
				The central dynamic is a <strong>race to the regulatory bottom</strong>:
				the United States is actively deregulating AI while the EU enforces its
				framework against a backdrop of limited compute capacity; China advances
				capability rapidly under a layered framework with strategic gaps; and
				the rest of the world operates in a patchwork of voluntary guidelines,
				nascent binding frameworks, and governance vacuums.
			</p>

			<h3>United States: Deregulation as Doctrine</h3>
			<p>
				The US federal AI governance posture reversed sharply in early 2025.
			</p>
			<p>
				<strong>Executive Order revocation.</strong> President Biden's Executive
				Order 14110 (October 2023), which had directed federal agencies to
				develop AI safety standards and required safety assessments from
				frontier AI developers, was revoked in January 2025 (The, 2025). The
				revocation removed the primary federal mechanism for coordinating AI
				safety requirements before legislation.
			</p>
			<p>
				<strong>Institutional restructuring.</strong> The NIST AI Safety
				Institute (AISI) was renamed the{" "}
				<strong>Center for AI Standards and Innovation</strong> (CAISI) — with
				the deliberate removal of the word "safety" from its mandate. The
				institute's mission shifted from safety evaluation to standards
				development and commercial competitiveness.
			</p>
			<p>
				<strong>Deregulation executive orders.</strong> July 2025 executive
				orders directed federal agencies to identify and remove AI-related
				regulatory requirements that impeded commercial deployment, establishing
				deregulation as an explicit policy goal (The, 2025).
			</p>
			<p>
				<strong>Litigation infrastructure.</strong> A December 2025 executive
				order established the <strong>AI Litigation Task Force</strong> to
				defend federal agencies from AI-related lawsuits — a signal that the
				administration anticipates regulatory challenges and has prepared to
				resist them (The, 2025).
			</p>
			<p>
				<strong>State-level fragmentation.</strong> In the absence of federal
				action, <strong>38 states</strong> have passed their own AI laws as of
				early 2026, creating a compliance patchwork that is more burdensome for
				organizations than a single federal standard would be. Colorado's SB
				21-169 on algorithmic decisions, California's AI transparency
				requirements, and Texas's biometric data provisions impose incompatible
				obligations across state lines (National, 2026).
			</p>
			<p>
				<strong>Chip export controls.</strong> The US government has
				simultaneously pursued aggressive enforcement of semiconductor export
				controls targeting China while selectively relaxing controls for allied
				nations. This creates a two-tier global AI infrastructure where the US
				and allies can access advanced chips and Chinese competitors cannot — a
				policy tool that is distinct from AI governance but that shapes the
				global capability distribution.
			</p>

			<h3>European Union: Comprehensive but Contested</h3>
			<p>
				The EU AI Act (Regulation 2024/1689) remains the world's most
				comprehensive binding AI regulatory framework, but its enforcement
				trajectory faces structural challenges.
			</p>
			<p>
				<strong>Enforcement timeline.</strong> Prohibitions on unacceptable-risk
				AI applications became effective <strong>February 2025</strong>. GPAI
				obligations (training data summaries, model cards, systemic risk
				assessments) became enforceable <strong>August 2025</strong>. High-risk
				application requirements — conformity assessment, logging, human
				oversight, EU database registration — become enforceable{" "}
				<strong>August 2, 2026</strong>, with penalties of up to{" "}
				<strong>7% of global annual turnover</strong> for violations.
			</p>
			<p>
				<strong>Digital Omnibus proposed delays.</strong> The November 2025{" "}
				<strong>Digital Omnibus Package</strong> proposed delays to several AI
				Act implementation deadlines, suggesting that the EU is itself uncertain
				about enforcement readiness (European, 2025). The proposal was widely
				read as the EU "blinking" — acknowledging that neither industry nor
				national authorities are prepared for the August 2026 deadline.
			</p>
			<p>
				<strong>Structural capacity gap.</strong> The EU's enforcement ambitions
				are constrained by its position in the global AI landscape. EU member
				states collectively produce approximately{" "}
				<strong>3 large foundation models per year</strong>, compared to
				approximately 40 for the United States and 15 for China (OECD, 2025). EU
				organizations have access to roughly{" "}
				<strong>4–5% of global AI compute capacity</strong>. A regulatory
				framework that requires conformity assessments and logging for models
				that EU organizations largely do not build is, in effect, an import
				regulation on US and Chinese AI products.
			</p>

			<h3>China: Strategic Layering with Gaps</h3>
			<p>
				China's AI governance framework is the most layered of the major
				jurisdictions, but its comprehensiveness contains deliberate strategic
				gaps.
			</p>
			<p>
				<strong>Regulatory stack.</strong> China has enacted the Interim
				Measures for the Management of Generative AI Services (2023), the Deep
				Synthesis Provisions governing synthetic media (2022), content labelling
				standards, and three new technical standards on AI safety issued in
				2025. These create a multi-layer framework covering training data,
				synthetic content, and model deployment (Chinese & cyberspace, 2025).
			</p>
			<p>
				<strong>Strategic omission.</strong> Despite the breadth of specific
				regulations, China{" "}
				<strong>
					removed a comprehensive AI law from its 2025 legislative agenda
				</strong>
				. The decision reflects a calculation that a general AI law would
				constrain the deployment of AI systems more than targeted regulations,
				and that competitive advantage requires regulatory flexibility (Xinhua,
				2025).
			</p>
			<p>
				<strong>Capability trajectory.</strong> China's "AI Plus" Action Plan
				targets{" "}
				<strong>70% AI penetration across major industries by 2027</strong>. The
				capability gap between US and Chinese frontier models narrowed from{" "}
				<strong>9.3% in 2024</strong> to <strong>1.7% in early 2025</strong>,
				and <strong>63% of new fine-tuned models</strong> published on
				HuggingFace in 2025 used Chinese base models (Epoch, 2025). This is not
				a governance story alone — it reflects genuine technical progress
				occurring under a governance framework specifically designed not to
				constrain it.
			</p>

			<h3>Asia-Pacific: A Spectrum of Approaches</h3>
			<p>
				The Asia-Pacific region illustrates that binding versus voluntary is not
				the only governance choice; there is a spectrum from comprehensive
				enforcement to aspirational encouragement.
			</p>
			<p>
				<strong>South Korea.</strong> The AI Basic Act, effective{" "}
				<strong>January 2026</strong>, makes South Korea the second jurisdiction
				after the EU to impose binding AI governance requirements. The Act
				establishes a tiered risk framework similar to the EU AI Act and creates
				the Korean AI Safety Institute for enforcement (Government, 2025).
			</p>
			<p>
				<strong>Japan.</strong> The AI Promotion Act (May 2025) takes the
				opposite approach: it explicitly eschews penalties and describes AI
				obligations as "best-effort only." The intent is to encourage AI
				development and adoption without creating compliance risk that might
				deter investment (Government, 2025). Japan's approach reflects a
				deliberate bet that voluntary standards, supported by a strong safety
				research community, are more effective than enforcement-backed
				regulation.
			</p>
			<p>
				<strong>Singapore.</strong> The AI Verify framework and the Singapore AI
				Safety Institute maintain a voluntary, toolkit-based approach.
				Singapore's governance posture is explicitly designed for a small,
				trade-dependent economy that cannot afford to be perceived as a
				compliance burden on the AI companies it wants to attract.
			</p>

			<h3>Implications for Organizations</h3>
			<p>
				The practical consequence of this fragmentation is that no single
				compliance framework is sufficient. An organization with EU customers
				faces mandatory conformity assessments for high-risk applications by
				August 2026 regardless of US deregulation. An organization with global
				deployments faces 38 different US state laws, two binding national
				frameworks (EU, South Korea), and the implicit expectation of compliance
				with voluntary frameworks in other jurisdictions.
			</p>
			<p>Three principles follow:</p>
			<ol>
				<li>
					<strong>Anticipate the EU, ignore the US federal posture.</strong> The
					EU AI Act is the de facto global standard for high-risk applications
					because it applies to any AI system deployed to EU users, regardless
					of where the developer is located. US deregulation does not create an
					exemption from EU requirements.
				</li>
				<li>
					<strong>Map use cases to risk tiers before procurement.</strong> The
					August 2026 high-risk deadline is the most important near-term
					compliance date. Organizations must know which of their AI deployments
					fall under Annex III before the deadline, because conformity
					assessment infrastructure — technical documentation, human oversight
					procedures, logging systems — cannot be built in weeks.
				</li>
				<li>
					<strong>Treat governance fragmentation itself as a risk.</strong> The
					incompatibility between US, EU, and Chinese regulatory requirements
					means that a model or deployment configuration that is compliant in
					one jurisdiction may be non-compliant in another. This is not a gap
					that will be resolved by waiting for international harmonization; the
					trend is toward further divergence.
				</li>
			</ol>
		</>
	);
}
