export type ModelCategory = "proprietary" | "open-weight";

export interface ThesisModel {
	id: string;
	name: string;
	provider: string;
	category: ModelCategory;
	description: string;
}

export const thesisModels: ThesisModel[] = [
	{
		id: "gpt-4o",
		name: "GPT-4o",
		provider: "OpenAI",
		category: "proprietary",
		description:
			"Strong general-purpose proprietary model with enterprise contracting and limited auditability.",
	},
	{
		id: "claude-3-5-sonnet",
		name: "Claude 3.5 Sonnet",
		provider: "Anthropic",
		category: "proprietary",
		description:
			"Safety-oriented proprietary model with relatively strong benchmark performance and limited transparency.",
	},
	{
		id: "llama-3-70b",
		name: "Llama 3 70B",
		provider: "Meta",
		category: "open-weight",
		description:
			"Large open-weight model with better auditability and local deployment options, but higher operator responsibility.",
	},
	{
		id: "llama-3-8b",
		name: "Llama 3 8B",
		provider: "Meta",
		category: "open-weight",
		description:
			"Smaller open-weight model with the easiest local deployment path and weaker safety benchmark performance.",
	},
	{
		id: "mistral-7b",
		name: "Mistral 7B",
		provider: "Mistral AI",
		category: "open-weight",
		description:
			"Compact open-weight model included where benchmark papers report Mistral-family results.",
	},
	{
		id: "codellama-34b",
		name: "CodeLlama 34B",
		provider: "Meta",
		category: "open-weight",
		description:
			"Code-focused open-weight model included for license-compliance comparisons.",
	},
];

export function getModelName(modelId: string) {
	return thesisModels.find((model) => model.id === modelId)?.name ?? modelId;
}
