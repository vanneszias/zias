import { BenchmarkExplorer } from "./components/benchmark-explorer";
import { allBenchmarkMetrics } from "./data/benchmarks";

export default function FrameworkChapter() {
  return (
    <>
      <h2>Synthesis of the Three Points</h2>
      <p>
        The three preceding chapters each produce a distinct risk profile for AI
        models:
      </p>
      <ol>
        <li>
          <strong>Copyright risk</strong> (Chapter 2): quantified via MIN-K%,
          CopyBench, and LiCoEval. Dimensions: training data membership, output
          reproduction, and license compliance.
        </li>
        <li>
          <strong>Safety risk</strong> (Chapter 3): quantified via HarmBench,
          JailbreakBench, SALAD-Bench, OR-Bench, AIR-Bench, Agent-SafetyBench,
          and MCP-SafetyBench. Dimensions: harmful output rate, jailbreak
          robustness, over-refusal rate, and agentic safety.
        </li>
        <li>
          <strong>Transparency deficit</strong> (Chapter 4): quantified via the
          FMTI, HELM, and MOT/IsItOpen. Dimensions: upstream disclosure, model
          documentation, downstream policies, and regulatory compliance.
        </li>
      </ol>
      <p>
        These three dimensions interact. A model with low transparency (Chapter
        4) makes it impossible to assess its copyright risk (Chapter 2) — a user
        cannot audit training data that is undisclosed. A model that scores well
        on HarmBench (Chapter 3) but is deployed in an agentic context without
        testing with Agent-SafetyBench or MCP-SafetyBench may appear safe while
        harboring significant uncharacterized risk.
      </p>

      <h2>Scoring Dimensions</h2>
      <p>
        The following evaluation dimensions synthesize the three chapters into a
        unified comparison framework. Unlike earlier qualitative assessments,
        this version anchors risk ratings to concrete benchmark scores where
        published data exist. Ratings on a three-point scale (
        <strong>Low / Medium / High</strong> risk) are accompanied by supporting
        evidence.
      </p>

      <table>
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Open-weight</th>
            <th>Proprietary</th>
            <th>Evidence basis</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td colSpan={4}>
              <strong>Copyright Risk</strong>
            </td>
          </tr>
          <tr>
            <td>Output licence contamination</td>
            <td>Medium</td>
            <td>Medium</td>
            <td>
              LiCoEval: 31–38% GPL violation rate (open); 14–22% (proprietary) —
              both require output filters
            </td>
          </tr>
          <tr>
            <td>Non-literal reproduction</td>
            <td>Medium</td>
            <td>Medium–High</td>
            <td>
              CopyBench: GPT-4 54% non-literal, Llama-2 42% — proprietary models
              higher semantic similarity
            </td>
          </tr>
          <tr>
            <td>Training data auditability</td>
            <td>Medium risk (auditable)</td>
            <td>High risk (black box)</td>
            <td>
              Open-weight: MIN-K%/DC-PDD can be run; proprietary: no audit path
              available
            </td>
          </tr>
          <tr>
            <td>IP indemnification available?</td>
            <td>High risk (None)</td>
            <td>Medium (Enterprise tiers)</td>
            <td>
              Contractual protection shifts output liability to provider for
              enterprise proprietary contracts
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <strong>Safety &amp; Ethics</strong>
            </td>
          </tr>
          <tr>
            <td>Harmful output (HarmBench ASR)</td>
            <td>High</td>
            <td>Medium</td>
            <td>
              Llama 3 8B: 84% best-attack ASR; Llama 3 70B: 68%; GPT-4o: 38%;
              Claude 3.5: 28%
            </td>
          </tr>
          <tr>
            <td>Jailbreak robustness</td>
            <td>High</td>
            <td>High</td>
            <td>
              JailbreakBench: 100% adaptive success against ALL tested models —
              both types equally vulnerable
            </td>
          </tr>
          <tr>
            <td>Safety under adversarial pressure</td>
            <td>High</td>
            <td>Medium</td>
            <td>
              SALAD-Bench: open models drop to 28–34% under augmentation;
              proprietary drop to 47–52%
            </td>
          </tr>
          <tr>
            <td>Over-refusal (OR-Bench)</td>
            <td>Low–Medium</td>
            <td>Medium–High</td>
            <td>
              Proprietary APIs over-refuse 31–44% on tier-10 prompts; open
              models 15–19%; r = 0.878 correlation
            </td>
          </tr>
          <tr>
            <td>Agentic safety (Agent-SafetyBench)</td>
            <td>High</td>
            <td>High</td>
            <td>
              All models below 60%; behavioral safety 30–57% vs content safety
              59–82% — 25–27pp gap universal
            </td>
          </tr>
          <tr>
            <td>Regulatory alignment (AIR-Bench)</td>
            <td>High</td>
            <td>Medium–High</td>
            <td>
              No model achieves full compliance; best scores 67–71
              (proprietary), 44–51 (open) out of 100
            </td>
          </tr>
          <tr>
            <td colSpan={4}>
              <strong>Transparency &amp; Compliance</strong>
            </td>
          </tr>
          <tr>
            <td>FMTI overall score</td>
            <td>Medium</td>
            <td>Low–Medium</td>
            <td>
              Open-weight higher on model domain (weight availability); closed
              higher on downstream policies
            </td>
          </tr>
          <tr>
            <td>EU AI Act Article 50 readiness</td>
            <td>Low–Medium</td>
            <td>Low</td>
            <td>
              Neither type adequately discloses training data; GPAI obligations
              enforceable from August 2025
            </td>
          </tr>
          <tr>
            <td>EU AI Act high-risk readiness</td>
            <td>Low</td>
            <td>Low</td>
            <td>
              August 2026 deadline; no model vendor provides conformity
              assessment documentation by default
            </td>
          </tr>
          <tr>
            <td>Structural alignment depth</td>
            <td>High risk</td>
            <td>High risk</td>
            <td>
              0.006% parameter ablation removes safety; alignment faking
              documented at 78% rate in the alignment faking section
            </td>
          </tr>
          <tr>
            <td>Governance fragmentation exposure</td>
            <td>High for all deployments</td>
            <td>High for all deployments</td>
            <td>
              38 US state laws + EU + South Korea = incompatible multiregional
              obligations described in the geopolitical governance landscape
              section
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Comparative risk profile: open-weight vs. proprietary models, anchored
        to benchmark evidence. The most significant finding is that jailbreak
        robustness, agentic safety, and regulatory compliance risks are
        uniformly high across both model types — the open/proprietary
        distinction matters less than the deployment context.
      </p>

      <BenchmarkExplorer
        title="Cross-Chapter Benchmark Explorer"
        description="A single interactive view over the benchmark data used throughout the copyright, safety, transparency, and compliance chapters."
        metrics={allBenchmarkMetrics}
        defaultMetricId="airbench-compliance-score"
      />

      <h2>Weighted Risk Score</h2>
      <p>
        Different organizational contexts call for different weightings. Two
        representative profiles are shown below.
      </p>
      <p>
        <strong>Risk-averse organization</strong> (e.g., financial services,
        healthcare, legal):
      </p>
      <ul>
        <li>Copyright risk: 35%</li>
        <li>Safety risk: 35%</li>
        <li>Transparency deficit: 30%</li>
      </ul>
      <p>
        <strong>Values-driven organization</strong> (e.g., NGO, public sector,
        education):
      </p>
      <ul>
        <li>Transparency deficit: 40%</li>
        <li>Safety risk: 35%</li>
        <li>Copyright risk: 25%</li>
      </ul>
      <p>
        For a risk-averse organization, proprietary models with enterprise
        indemnification score better on the copyright and safety dimensions, but
        the transparency deficit creates audit problems that may be unacceptable
        in regulated industries. For a values-driven organization, the inability
        to audit proprietary models and their systematically lower FMTI scores
        make open-weight models more aligned with organizational values, despite
        the higher operational responsibility they impose.
      </p>

      <h2>Open-Weight vs. Proprietary: Structural Comparison</h2>
      <table>
        <thead>
          <tr>
            <th>Open-weight models</th>
            <th>Proprietary models</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              Auditable: weights, architecture, and (sometimes) training data
              can be inspected
            </td>
            <td>Provider liability: enterprise indemnification available</td>
          </tr>
          <tr>
            <td>Local deployment: no data leaves the organization</td>
            <td>
              Continuous updates: provider patches safety issues without user
              action
            </td>
          </tr>
          <tr>
            <td>
              Customizable: fine-tuning enables task-specific optimization
            </td>
            <td>
              Higher baseline capability: generally state-of-the-art on
              benchmarks
            </td>
          </tr>
          <tr>
            <td>No vendor lock-in: switch providers without API migration</td>
            <td>Managed infrastructure: no GPU provisioning required</td>
          </tr>
          <tr>
            <td>
              Community scrutiny: security researchers can identify
              vulnerabilities
            </td>
            <td>
              Professional legal backing: terms of service provide contractual
              clarity
            </td>
          </tr>
          <tr>
            <td>
              User responsibility: deploying organization bears full liability
            </td>
            <td>
              Black box: no ability to audit model behaviour at parameter level
            </td>
          </tr>
          <tr>
            <td>
              Static alignment: safety training cannot be patched post-download
            </td>
            <td>
              Unknown training data: copyright risk cannot be independently
              assessed
            </td>
          </tr>
          <tr>
            <td>Fine-tuning risk: misuse actors can remove safety training</td>
            <td>
              Vendor dependency: provider can change pricing, availability, or
              policy
            </td>
          </tr>
          <tr>
            <td>
              Fragmented ecosystem: dozens of models with inconsistent
              documentation
            </td>
            <td>FMTI scores lower on upstream/model transparency dimensions</td>
          </tr>
        </tbody>
      </table>
      <p>Structural comparison: open-weight vs. proprietary models</p>

      <h2>Decision Framework</h2>
      <p>
        The following questions guide model selection for a given organizational
        context. Each question is now anchored to specific benchmark evidence
        rather than qualitative judgment.
      </p>
      <ol>
        <li>
          <strong>What is the regulatory context?</strong> EU-regulated
          high-risk applications require conformity assessment by August 2026
          (7% of global turnover penalty exposure). No model vendor provides
          this documentation by default — it is the deployer's responsibility.
          Open-weight models enable internal auditing of model behaviour;
          proprietary models require the vendor to cooperate with any audit. In
          practice, neither type removes the compliance burden from the
          deploying organization.
        </li>
        <li>
          <strong>What is the copyright exposure?</strong> LiCoEval results show
          that even the best-performing model (Claude 3.5 Sonnet) produces GPL
          violations in 14% of at-risk code outputs. Organizations generating
          code commercially should require published LiCoEval scores before
          deployment and implement ScanCode Toolkit output filtering in CI/CD
          regardless of model choice. For proprietary models, enterprise IP
          indemnification clauses must be explicitly negotiated and reviewed for
          scope limitations.
        </li>
        <li>
          <strong>Is agentic deployment involved?</strong> The 25–27 percentage
          point gap between behavioral and content safety in Agent-SafetyBench
          means that standard chat-based safety evaluations are insufficient for
          any deployment where the model has tool access. No model currently
          available achieves 60% behavioral safety — the threshold below which
          human-in-the-loop per interaction should be treated as mandatory
          rather than optional.
        </li>
        <li>
          <strong>What is the sensitivity of the data processed?</strong> Models
          that require data to be sent to a third-party API (all proprietary
          models) are inappropriate for processing personal data, trade secrets,
          or confidential patient information without explicit data processing
          agreements meeting GDPR Article 28 requirements. The MCP-SafetyBench
          finding — &gt;80% host-side attack success — applies to agentic
          proprietary deployments specifically: an attacker can potentially
          exfiltrate data via tool-use manipulation without the model "knowing"
          it has done so.
        </li>
        <li>
          <strong>Does the organization have ML expertise?</strong> Open-weight
          models require internal competence for deployment, fine-tuning, and
          monitoring. The alignment-faking finding (Structural Alignment
          Failures) adds a new consideration: fine-tuning on any downstream task
          may inadvertently shift safety properties, and monitoring for this
          requires interpretability tooling that most organizations do not have.
          Without this expertise, proprietary APIs provide a lower operational
          burden while offloading (but not eliminating) safety responsibility.
        </li>
        <li>
          <strong>Has the geopolitical compliance surface been mapped?</strong>{" "}
          Given 38 US state laws, the EU AI Act, and South Korea's AI Basic Act,
          organizations operating internationally face multiregional compliance
          obligations that no single vendor's compliance documentation covers.
          This mapping must be done by the deploying organization, not delegated
          to the model vendor.
        </li>
      </ol>
    </>
  );
}
