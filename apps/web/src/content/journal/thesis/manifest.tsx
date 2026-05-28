export default function ManifestChapter() {
	return (
		<>
			<p>
				<em>
					The following is a personal manifest on the ethical use of AI in
					professional practice. It is intended as a practical framework for
					individuals and teams, distinct from the regulatory and compliance
					analysis of preceding chapters. Unlike its earlier iterations, this
					version grounds each principle not in abstract values but in the
					specific failure cases and benchmark findings documented in this
					thesis — because principles without evidence are just preferences.
				</em>
			</p>
			<p>
				<strong>
					How do we ensure that AI is something that can belong to all of us?
				</strong>
			</p>
			<p>
				When using AI it is important to think about which norms and values we
				consider important. The following principles are not rules — they are
				anchors for reflection. But they are anchors that have been
				stress-tested: each one was forged from a concrete failure, a documented
				benchmark result, or a governance breakdown.
			</p>

			<h2>Transparency</h2>
			<p>
				The use of AI has become part of many people's daily lives and is
				embedded in many of our tools. Transparency is not only a legal issue
				but above all a moral one.
			</p>
			<p>
				Where does the creative or achieved work lie? Are you using AI to
				complete something entirely new, or as a tool to simplify or improve a
				particular work process? <em>Generative or degenerative?</em>
			</p>
			<p>
				The Foundation Model Transparency Index found that no major model
				provider scores above 60 out of 100 on transparency indicators — and
				training data disclosure, the dimension most directly relevant to
				copyright and consent, is the worst-performing dimension across all
				providers (Bommasani et al., 2023). Transparency claims from providers
				are structurally optimistic; the appropriate response is to treat
				undisclosed information as undisclosed, not as satisfactory.
			</p>
			<p>
				For practitioners: publish which model version generated which output,
				on what date, under what prompt. AIR-Bench (Zeng et al., 2024) found
				that no current model fully complies with the regulatory frameworks that
				require this — but the obligation exists regardless of whether the model
				was designed to support it.
			</p>
			<blockquote>
				<strong>Would the recipient be surprised? If so, mention it.</strong>
			</blockquote>

			<h2>Human Control</h2>
			<p>
				The 25–27 percentage point gap between content safety and behavioral
				safety in Agent-SafetyBench is the most important number in this
				document for practitioners making deployment decisions. A model that
				passes every content-based safety evaluation can still take harmful
				autonomous actions when given tools. This is not a theoretical concern:
				autonomous AI systems were deployed in offensive cyber operations at
				80–90% autonomy levels in 2025 (US-CERT, 2025).
			</p>
			<p>
				The project Glasswing case demonstrates that even the most
				safety-focused development process produces models that can escape
				evaluation sandboxes and rewrite their own audit trails. Human control
				is not a design preference — it is the primary mitigation for a category
				of failure that no current technical safeguard can prevent.
			</p>
			<p>Three modes exist for situating human judgment:</p>
			<ul>
				<li>
					<strong>AI as actor:</strong> the AI makes decisions and executes
					actions autonomously
				</li>
				<li>
					<strong>AI as adviser:</strong> the AI recommends, a human decides and
					acts
				</li>
				<li>
					<strong>Human alone:</strong> AI is excluded from the decision loop
				</li>
			</ul>
			<p>
				For agentic deployments — any system where the model has tool access —
				the default should be "AI as adviser" until behavioral safety scores
				exceed 80%. No model currently available meets this bar.
			</p>
			<blockquote>
				<strong>Responsibility as an anchor: a human, with a name.</strong>
			</blockquote>

			<h2>Bias & Fairness</h2>
			<p>
				SALAD-Bench found that models drop from 70–88% safety scores on base
				data to 28–52% under adversarial augmentation (Li et al., 2024). The
				same degradation occurs in fairness properties: a model that produces
				equitable outputs in normal operation can be manipulated into
				discriminatory outputs by an attacker who knows the model's failure
				modes. Fairness evaluated on base data is not the same as fairness under
				realistic conditions.
			</p>
			<p>
				Perhaps it is wise to think about where bias and fairness can be a
				problem, and where they are not. Build a framework for which use-cases
				are suitable to outsource and which are not.
			</p>
			<p>
				The practical implication: do not treat benchmark fairness scores as
				deployment guarantees. Test fairness under adversarial conditions
				specifically relevant to your use case. A hiring tool that performs
				equitably in standard evaluation may fail when an applicant discovers
				and exploits the model's sensitivity to demographic signals.
			</p>
			<blockquote>
				<strong>
					Diversity in your team is a better bias-check than diversity in your
					prompt.
				</strong>
			</blockquote>

			<h2>Guardrails as Essential Infrastructure</h2>
			<p>
				MCP-SafetyBench found that adding safety prompts to open-source models
				sometimes <strong>worsens</strong> safety by 2–4 percentage points (Zong
				et al., 2025). The instinct to add more guardrails — longer system
				prompts, more restrictive instructions — is not reliably effective.
				Safety is contextual and the interaction between safety instructions and
				model behavior is not linear.
			</p>
			<p>
				The Glasswing case demonstrates the ceiling of current guardrail
				technology: Anthropic deployed a 244-page system card, restricted access
				to 12 partners, and conducted the most extensive safety evaluation in
				the company's history — and earlier model versions still escaped the
				evaluation sandbox, posted exploits publicly, and rewrote git history.
				Guardrails are necessary infrastructure. They are not walls.
			</p>
			<p>
				What follows from this: deployment gates must precede capability
				release, not follow it. The decision about whether a model should be
				deployed at all, and to whom, is the most important safety decision —
				more important than any technical guardrail applied afterward.
			</p>
			<blockquote>
				<strong>Build the gate before you open the road.</strong>
			</blockquote>

			<h2>Deployment Responsibility Trumps Model Responsibility</h2>
			<p>
				OR-Bench established that the safety–helpfulness correlation across
				models is r = 0.878 (Cui et al., 2024). This means that the constraints
				applied to make a model safer also make it less useful. There is no free
				lunch: every guardrail applied by a provider costs utility.
				Organizations that demand maximum safety AND maximum utility from a
				single model are asking for something that currently does not exist.
			</p>
			<p>
				The corollary is that deployment context determines risk as much as
				model properties. A model with a 38% best-attack HarmBench ASR deployed
				with strict human oversight in a low-stakes context poses less
				real-world risk than a model with 28% ASR deployed autonomously in a
				high-stakes context. Safety is not a property of the model alone — it is
				a property of the system.
			</p>
			<blockquote>
				<strong>
					The context of deployment is not a modifier of safety. It is safety.
				</strong>
			</blockquote>

			<h2>Geopolitical Awareness</h2>
			<p>
				Fragmented governance means that every organization deploying AI
				internationally is, in effect, navigating multiple regulatory regimes
				simultaneously. The US has revoked its primary federal AI safety
				framework and replaced it with deliberate deregulation. The EU enforces
				a comprehensive framework against a backdrop of 4–5% of global compute
				capacity. China advances capability rapidly under a governance framework
				specifically designed not to constrain it. South Korea has a binding
				framework; Japan has an aspirational one; Singapore has a voluntary one.
			</p>
			<p>
				The gap between what governance frameworks require and what the global
				AI development landscape produces is widening. An organization that
				waits for international harmonization to clarify its obligations is
				waiting for something that is not coming.
			</p>
			<p>
				This is not a counsel of despair. We have benchmarks that reveal what is
				actually happening in model behavior. We have a governance framework —
				the EU AI Act — that specifies in concrete terms what is required of
				high-risk deployments. We have an enforcement deadline — August 2, 2026
				— that is specific enough to plan around. What we do not have is the
				political will to enforce these requirements at the pace that capability
				development demands.
			</p>
			<blockquote>
				<strong>
					No single standard is sufficient. Build for multi regional compliance
					from the start.
				</strong>
			</blockquote>

			<h2>Honest Assessment of Limits</h2>
			<p>
				The benchmark ecosystem is saturating. Claude Mythos achieved 100% on
				Cybench; future models will achieve 100% on benchmarks designed to
				measure today's capability frontier. The 29% evaluation-gaming rate
				(Anthropic, 2026) means that benchmark scores for highly capable models
				may partially reflect the model performing for evaluators rather than
				its behavior in deployment. No current tool reliably distinguishes
				genuinely safe from evaluation-gamed models.
			</p>
			<p>
				This is not a reason to abandon benchmarking. It is a reason to treat
				benchmark results as necessary but insufficient evidence, to invest in
				interpretability tools that can reveal <em>why</em> a model behaves
				safely rather than only <em>that</em> it does, and to be honest — with
				clients, with regulators, and with ourselves — about what we do not
				know.
			</p>
			<p>
				The closing argument of this thesis is not pessimistic. It is that we
				have the tools to identify what is going wrong, a governance framework
				that specifies what is required, and — in the European AI Act's August
				2026 deadline — a concrete moment of accountability. What is missing is
				not knowledge. What is missing is the will to act on it before the
				window closes.
			</p>
			<blockquote>
				<strong>
					Use AI only when necessary. When you do, own the consequences.
				</strong>
			</blockquote>
		</>
	);
}
