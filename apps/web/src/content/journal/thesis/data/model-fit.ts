export type PreferenceDimension =
	| "copyright"
	| "safety"
	| "transparency"
	| "compliance"
	| "agentic"
	| "utility"
	| "deployment";

export interface ModelFitQuestion {
	id: string;
	question: string;
	helper: string;
	answers: Array<{
		label: string;
		description: string;
		weights: Partial<Record<PreferenceDimension, number>>;
	}>;
}

export interface ModelFitProfile {
	modelId: string;
	scores: Record<PreferenceDimension, number>;
	recommendation: string;
	caveat: string;
}

export const preferenceDimensions: Record<PreferenceDimension, string> = {
	copyright: "Copyright/IP protection",
	safety: "Content safety",
	transparency: "Transparency/auditability",
	compliance: "Regulatory alignment",
	agentic: "Agentic/tool-use safety",
	utility: "Usefulness/low refusal",
	deployment: "Deployment control",
};

export const modelFitQuestions: ModelFitQuestion[] = [
	{
		id: "legal-exposure",
		question: "How severe is your copyright and IP exposure?",
		helper:
			"Think commercial code generation, licensed source material, and whether indemnification matters.",
		answers: [
			{
				label: "Very high",
				description:
					"Commercial or regulated output where IP claims would be costly.",
				weights: { copyright: 4, compliance: 2 },
			},
			{
				label: "Moderate",
				description: "Internal productivity use with some commercial exposure.",
				weights: { copyright: 2, utility: 1 },
			},
			{
				label: "Low",
				description: "Exploration, learning, or outputs reviewed before reuse.",
				weights: { utility: 2, deployment: 1 },
			},
		],
	},
	{
		id: "auditability",
		question: "How important is independent auditability?",
		helper:
			"Open-weight models give more inspection and local testing, while proprietary models usually require provider cooperation.",
		answers: [
			{
				label: "Non-negotiable",
				description:
					"I need weights, local tests, or internal governance evidence.",
				weights: { transparency: 4, deployment: 3 },
			},
			{
				label: "Useful, not required",
				description:
					"Auditability matters, but contracts and documentation may suffice.",
				weights: { transparency: 2, compliance: 1 },
			},
			{
				label: "Less important",
				description: "I mainly need a managed model that works reliably.",
				weights: { utility: 2, safety: 1 },
			},
		],
	},
	{
		id: "agentic-use",
		question: "Will the model use tools or act autonomously?",
		helper:
			"The thesis data shows a persistent gap between content safety and behavioral safety for agentic systems.",
		answers: [
			{
				label: "Yes, with tools",
				description:
					"The model can call APIs, write files, send requests, or operate workflows.",
				weights: { agentic: 5, safety: 3, compliance: 2 },
			},
			{
				label: "Assisted only",
				description: "The model recommends; a human decides and executes.",
				weights: { safety: 2, utility: 2 },
			},
			{
				label: "No autonomy",
				description:
					"Chat, drafting, summarization, or other low-action use cases.",
				weights: { utility: 3 },
			},
		],
	},
	{
		id: "refusal-tradeoff",
		question:
			"Which side of the safety/helpfulness trade-off bothers you more?",
		helper:
			"OR-Bench shows that stronger refusal behavior can reduce usefulness on benign prompts.",
		answers: [
			{
				label: "Unsafe answers",
				description:
					"I would rather tolerate refusals than harmful or risky completions.",
				weights: { safety: 4, agentic: 2 },
			},
			{
				label: "Over-refusal",
				description:
					"I need the model to help with edge-case but legitimate work.",
				weights: { utility: 4, deployment: 1 },
			},
			{
				label: "Balanced",
				description:
					"I want safer defaults, but not at the cost of constant false refusals.",
				weights: { safety: 2, utility: 2 },
			},
		],
	},
	{
		id: "regulatory-context",
		question: "Are you operating in a high-risk regulatory context?",
		helper:
			"Recruitment, healthcare, credit, education, critical infrastructure, and similar contexts shift responsibility to the deployer.",
		answers: [
			{
				label: "Yes",
				description:
					"Conformity assessment, logging, oversight, or EU AI Act readiness matter.",
				weights: { compliance: 5, safety: 3, copyright: 2 },
			},
			{
				label: "Possibly",
				description:
					"The use case could become high-impact or externally visible.",
				weights: { compliance: 3, transparency: 2 },
			},
			{
				label: "No",
				description: "Low-stakes internal or personal use.",
				weights: { utility: 2, deployment: 1 },
			},
		],
	},
];

export const modelFitProfiles: ModelFitProfile[] = [
	{
		modelId: "claude-3-5-sonnet",
		scores: {
			copyright: 86,
			safety: 88,
			transparency: 52,
			compliance: 82,
			agentic: 72,
			utility: 68,
			deployment: 42,
		},
		recommendation:
			"Best fit when safety, compliance, and copyright exposure matter more than auditability.",
		caveat:
			"Still not suitable as an unsupervised agent; proprietary opacity remains a governance problem.",
	},
	{
		modelId: "gpt-4o",
		scores: {
			copyright: 74,
			safety: 78,
			transparency: 56,
			compliance: 76,
			agentic: 68,
			utility: 82,
			deployment: 44,
		},
		recommendation:
			"Best fit for broad managed productivity where capability and usability carry high weight.",
		caveat:
			"Copyright filtering, vendor review, and deployment-level controls are still required.",
	},
	{
		modelId: "llama-3-70b",
		scores: {
			copyright: 56,
			safety: 54,
			transparency: 84,
			compliance: 58,
			agentic: 48,
			utility: 76,
			deployment: 92,
		},
		recommendation:
			"Best fit when local control, auditability, and values-driven openness are primary.",
		caveat:
			"The operator inherits more safety, legal, monitoring, and patching responsibility.",
	},
	{
		modelId: "llama-3-8b",
		scores: {
			copyright: 48,
			safety: 42,
			transparency: 78,
			compliance: 48,
			agentic: 38,
			utility: 64,
			deployment: 95,
		},
		recommendation:
			"Best fit for lightweight local experimentation, education, or tightly bounded internal tasks.",
		caveat:
			"The benchmark profile is too weak for high-risk or autonomous deployment without substantial guardrails.",
	},
];
