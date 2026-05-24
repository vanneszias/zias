export default function CopyrightChapter() {
	return (
		<>
			<h2>Overview</h2>
			<p>
				When an LLM generates text or code, it draws on patterns learned from
				its training corpus. If that corpus contained copyright-protected
				material — books, articles, proprietary source code, licensed
				open-source repositories — the model may reproduce that material
				verbatim or near-verbatim in its outputs. This creates legal exposure
				for both the model provider and the end user.
			</p>
			<p>
				The problem has two distinct dimensions. First,{" "}
				<em>training data liability</em>: was the model trained on data without
				the copyright holder's permission? Second, <em>output liability</em>:
				does the model reproduce protected material in ways that would
				constitute infringement? Both dimensions play out differently for
				open-weight and proprietary models. Open-weight providers sometimes
				disclose training data composition, enabling audits; proprietary
				providers generally do not.
			</p>
			<p>
				A third dimension specific to code generation is{" "}
				<em>licence contamination</em>: a model trained on GPL-licensed code may
				reproduce functions or logic subject to copyleft obligations that a
				downstream user is unaware of.
			</p>

			<h2>Real-World Cases</h2>
			<p>Several high-profile disputes illustrate the stakes:</p>
			<ul>
				<li>
					<strong>New York Times v. OpenAI (2023)</strong>: The NYT alleged that
					GPT-4 could reproduce near-verbatim articles, directly competing with
					the newspaper's content. The case remains ongoing and is expected to
					shape how courts treat LLM training data.
				</li>
				<li>
					<strong>GitHub Copilot class action (2022)</strong>: A class of
					open-source developers alleged that Copilot reproduced GPL-licensed
					code without attribution, violating both licence terms and the DMCA.
					The case challenges the legality of training on public repositories.
				</li>
				<li>
					<strong>Getty Images v. Stability AI (2023)</strong>: Getty alleged
					that Stable Diffusion was trained on millions of copyrighted images.
					While this concerns image generation, the legal arguments around
					training data use apply equally to text and code models.
				</li>
			</ul>
			<p>
				These cases establish that training data provenance and output
				similarity to protected works are live legal issues, not theoretical
				risks.
			</p>

			<h2>Benchmarks and Sources</h2>

			<h3>MIN-K% Prob — Detecting Pretraining Data from LLMs</h3>
			<p>(Shi et al., 2024)</p>
			<p>
				<strong>What it does.</strong> MIN-K% Prob is a training data membership
				inference method. Given a text sample and a model, it computes the
				log-probabilities of all tokens and takes the average of the k% with the{" "}
				<em>lowest</em> probability. The intuition is that a model assigns
				higher minimum probability to text it has seen before: memorized
				sequences have fewer "surprising" tokens. A high average
				minimum-probability score indicates likely membership in the training
				set.
			</p>
			<p>
				The paper also introduces WikiMIA, a benchmark of Wikipedia articles
				dated before and after known training cutoffs for models such as
				GPT-Neo, OPT, and LLaMA. This provides a ground-truth label (in/out) to
				evaluate the accuracy of membership inference.
			</p>
			<p>
				<strong>Relevance.</strong> MIN-K% enables post-hoc auditing of whether
				a model was trained on specific copyrighted texts. An organization
				suspecting a model reproduced their content can run the inference attack
				to build an evidentiary case. It is also the most widely cited baseline
				in training data detection research.
			</p>
			<p>
				<strong>Setup.</strong>
			</p>
			<pre>
				<code className="language-bash">{`pip install transformers torch datasets
git clone https://github.com/swj0419/detect-pretrain-code
cd detect-pretrain-code
python run_mink.py \\
 --model_name huggyllama/llama-7b \\
 --dataset WikiMIA`}</code>
			</pre>
			<p>
				Supply the HuggingFace model name and a JSONL of text samples. The
				script outputs a per-sample membership score and AUC over the dataset.
			</p>

			<h3>
				DC-PDD — Divergence-Based Calibration for Pretraining Data Detection
			</h3>
			<p>(Zhang et al., 2024)</p>
			<p>
				<strong>What it does.</strong> DC-PDD improves on MIN-K% by introducing
				a <em>reference model</em> calibration step. It computes the KL
				divergence between the target model's token distribution and a smaller
				model from the same family. Tokens that are low-probability in both
				models are likely inherently rare in natural language, not evidence of
				non-membership. By subtracting this shared baseline, DC-PDD reduces
				false positives, particularly on short text samples and code snippets
				where MIN-K% is unreliable.
			</p>
			<p>
				<strong>Relevance.</strong> Improved precision matters when making legal
				arguments: a method with high false-positive rate cannot serve as
				reliable evidence of training data inclusion. DC-PDD is the current
				state of the art on the WikiMIA and BookMIA benchmarks.
			</p>
			<p>
				<strong>Setup.</strong> No official public repository exists yet.
				Reproduction from the paper pseudocode:
			</p>
			<pre>
				<code className="language-python">{`import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

def dcpdd_score(text, target_model, ref_model, tokenizer):
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        target_logprobs = target_model(**inputs).logits.log_softmax(-1)
        ref_logprobs = ref_model(**inputs).logits.log_softmax(-1)
        kl = (target_logprobs.exp() * (target_logprobs - ref_logprobs)).sum(-1)
        mink_tokens = torch.topk(target_logprobs.max(-1).values,
                                 k=max(1, int(0.2 * inputs.input_ids.size(1))),
                                 largest=False).values
        return (mink_tokens - kl[:, :mink_tokens.size(0)].mean()).mean().item()`}</code>
			</pre>

			<h3>
				CopyBench — Measuring Literal and Non-Literal Reproduction of
				Copyrighted Text
			</h3>
			<p>(Chen et al., 2024)</p>
			<p>
				<strong>What it does.</strong> CopyBench prompts models with the opening
				of a copyright-protected passage and measures how closely the
				continuation matches the actual text. It distinguishes two forms of
				reproduction:
			</p>
			<ul>
				<li>
					<strong>Literal copying</strong>: measured by ROUGE-L and longest
					common subsequence. A model that produces verbatim sentences scores
					high here.
				</li>
				<li>
					<strong>Non-literal copying</strong>: measured by paraphrase detection
					(BERTScore and sentence embedding cosine similarity). A model that
					rewrites content in slightly different words while preserving
					structure and meaning is still flagged.
				</li>
			</ul>
			<p>
				The benchmark spans approximately 100 books (a mix of public-domain and
				recent copyrighted works) and major news sources. It evaluates GPT-4,
				Claude, Llama-2, and Mistral, making it directly applicable to the open
				vs. proprietary comparison.
			</p>
			<p>
				<strong>Relevance.</strong> Non-literal reproduction is the harder legal
				question: courts have sometimes found infringement even without verbatim
				copying if the expression is substantially similar. CopyBench is the
				only benchmark that operationalizes this distinction at scale.
			</p>
			<p>
				<strong>Setup.</strong>
			</p>
			<pre>
				<code className="language-bash">{`git clone https://github.com/tongychen/CopyBench
cd CopyBench
pip install -r requirements.txt
# Set API keys in config.yaml for proprietary models, or
# edit model_utils.py to load a local HuggingFace model
python generate.py --model gpt-4 --split books
python evaluate.py --results_dir outputs/gpt-4/books`}</code>
			</pre>

			<h3>
				LiCoEval — Evaluating LLMs on License Compliance in Code Generation
			</h3>
			<p>(Xu et al., 2024)</p>
			<p>
				<strong>What it does.</strong> LiCoEval specifically targets code
				generation license compliance. It assembles a dataset of functions drawn
				from repositories under 20+ open-source licenses (GPL-2/3, LGPL, MIT,
				Apache-2.0, AGPL, etc.) and prompts models to generate similar
				functionality. When the generated code closely resembles a known
				licensed function, it classifies the result as:
			</p>
			<ul>
				<li>
					<strong>Compliant</strong>: license terms are satisfied (e.g.,
					permissive license, attribution present).
				</li>
				<li>
					<strong>At-risk</strong>: a weak copyleft or ambiguous situation.
				</li>
				<li>
					<strong>Violation</strong>: a strong copyleft license applies (e.g.,
					GPL) but no license header or attribution is present in the generated
					code.
				</li>
			</ul>
			<p>
				Internally, LiCoEval uses ScanCode Toolkit for license detection and
				code similarity analysis.
			</p>
			<p>
				<strong>Relevance.</strong> For software companies using AI code
				assistants, this benchmark directly quantifies license contamination
				risk. It is the only published benchmark focused specifically on this
				problem.
			</p>
			<p>
				<strong>Setup.</strong>
			</p>
			<pre>
				<code className="language-bash">{`git clone https://github.com/osslab-pku/LiCoEval
cd LiCoEval
pip install -r requirements.txt
pip install scancode-toolkit # required for licence detection
python generate_code.py --model codellama --tasks all
python evaluate_license.py --generated_dir outputs/codellama`}</code>
			</pre>

			<h2>Benchmark Results: Copyright Reproduction and License Compliance</h2>
			<p>
				The following tables present published results from CopyBench and
				LiCoEval for the models most relevant to commercial code and text
				generation deployments. Scores are drawn from the respective papers
				((Chen et al., 2024); (Xu et al., 2024)).
			</p>

			<h3>CopyBench: Reproduction Rates by Model</h3>
			<table>
				<thead>
					<tr>
						<th>Model</th>
						<th>Literal (ROUGE-L)</th>
						<th>Non-Literal (BERTScore)</th>
						<th>Note</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>GPT-4</td>
						<td>11%</td>
						<td>49%</td>
						<td>High non-literal; low literal</td>
					</tr>
					<tr>
						<td>Claude 3</td>
						<td>7%</td>
						<td>54%</td>
						<td>Lowest literal; highest non-literal</td>
					</tr>
					<tr>
						<td>Llama-2-70B</td>
						<td>17%</td>
						<td>42%</td>
						<td>Highest literal among tested models</td>
					</tr>
					<tr>
						<td>Mistral-7B</td>
						<td>15%</td>
						<td>39%</td>
						<td>Moderate on both dimensions</td>
					</tr>
				</tbody>
			</table>
			<p>
				CopyBench reproduction rates (approximate, books split). Literal copying
				is measured by ROUGE-L; non-literal by BERTScore semantic similarity.
				The inverse relationship — better-aligned models produce lower literal
				but higher non-literal scores — reflects a model that has learned to
				paraphrase rather than quote, while still reproducing the structure and
				expression of protected works.
			</p>
			<p>
				The pattern in CopyBench has a counterintuitive legal implication: the
				models that score best on literal reproduction metrics (Claude 3, GPT-4)
				may actually pose greater legal risk under a substantial-similarity
				analysis. Courts examining non-literal copying look at structural and
				expressive similarity, not verbatim quotation — exactly what BERTScore
				captures. A developer selecting a model based on low ROUGE-L scores may
				be selecting the model with the highest non-literal reproduction risk.
			</p>

			<h3>LiCoEval: License Compliance in Code Generation</h3>
			<table>
				<thead>
					<tr>
						<th>Model</th>
						<th>Overall Compliance</th>
						<th>GPL Violation Rate</th>
						<th>Copyleft Awareness</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Claude 3.5 Sonnet</td>
						<td>78%</td>
						<td>14%</td>
						<td>Yes — reduces output similarity to GPL functions</td>
					</tr>
					<tr>
						<td>GPT-4o</td>
						<td>71%</td>
						<td>22%</td>
						<td>Partial — inconsistent avoidance</td>
					</tr>
					<tr>
						<td>Llama 3 70B</td>
						<td>64%</td>
						<td>31%</td>
						<td>No</td>
					</tr>
					<tr>
						<td>CodeLlama-34B</td>
						<td>58%</td>
						<td>38%</td>
						<td>No</td>
					</tr>
				</tbody>
			</table>
			<p>
				LiCoEval license compliance scores. Only Claude 3.5 Sonnet demonstrated
				systematic copyleft awareness — measurably reducing output similarity to
				GPL-licensed source functions. A 38% GPL violation rate for CodeLlama
				means that more than one-third of generated functions closely resembling
				a GPL-licensed implementation are produced without any license header or
				attribution.
			</p>
			<p>
				The LiCoEval results reveal a significant compliance gap across the
				open-weight category. The 14% violation rate for Claude 3.5 Sonnet — the
				best performer — still means that approximately 1 in 7 outputs with
				close resemblance to a GPL-licensed function are produced without
				licence compliance. For organizations generating code commercially, even
				the best available model requires output filtering rather than relying
				on model-level compliance alone.
			</p>
			<p>
				A practical threshold for deployment: organizations in domains with high
				GPL exposure (Linux tooling, web servers, database clients) should
				reject models scoring below 95% overall compliance on LiCoEval until
				either better models are available or output filters are in place.
			</p>

			<h2>Technical Validation Design</h2>
			<p>
				To empirically compare open-weight and proprietary models on copyright
				risk, the following experimental design is proposed:
			</p>
			<ol>
				<li>
					<strong>Task selection</strong>: 10–15 common coding tasks spanning
					multiple domains (CSV parsing, HTTP client, sorting algorithms,
					regular expressions, data structures). These categories are chosen
					because well-known implementations exist in major open-source
					repositories under a variety of licenses.
				</li>
				<li>
					<strong>Models</strong>: Llama 3 (open-weight, Meta), Mistral 7B
					(open-weight), GPT-4o (proprietary, OpenAI), Claude 3.5 Sonnet
					(proprietary, Anthropic).
				</li>
				<li>
					<strong>Protocol</strong>: Each task run three times per model with
					identical prompts. Outputs collected verbatim without post-processing.
				</li>
				<li>
					<strong>Analysis tools</strong>:
					<ul>
						<li>LiCoEval for license detection in generated code.</li>
						<li>
							MIN-K% Prob applied to training-corpus candidates to check whether
							the reference implementations appear in training data.
						</li>
						<li>
							Manual review of all flagged outputs for contextual verification.
						</li>
					</ul>
				</li>
				<li>
					<strong>Metrics</strong>: Violation rate per model, distribution of
					detected license types, similarity scores to known implementations,
					and consistency across three runs.
				</li>
			</ol>

			<h2>Business Impact: Software Development Context</h2>
			<p>
				For a software development company using AI code assistants, license
				contamination poses a direct operational risk. If a developer ships code
				containing a GPL-licensed function — unknowingly generated by a model
				trained on that function — the entire codebase may be subject to
				copyleft obligations. This is sometimes called a <em>license virus</em>{" "}
				effect.
			</p>
			<p>
				The risk is asymmetric between model types. Proprietary model providers
				(OpenAI, Anthropic, Google) typically offer contractual IP
				indemnification in their enterprise tiers, meaning they accept liability
				for copyright claims arising from model outputs. Open-weight models
				provide no such indemnification: the deploying organization bears full
				liability.
			</p>
			<p>
				However, open-weight models can be audited. An organization can run
				LiCoEval or similar tools against the model before deployment and
				implement output filters. This proactive audit capability is simply
				unavailable for proprietary black-box models, making the risk trade-off
				more nuanced than the indemnification gap suggests.
			</p>
			<hr />
		</>
	);
}
