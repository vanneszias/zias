import { cn } from "@zias/ui/lib/utils";
import { useMemo, useState } from "react";
import {
	modelFitProfiles,
	modelFitQuestions,
	type PreferenceDimension,
	preferenceDimensions,
} from "../data/model-fit";
import { getModelName, thesisModels } from "../data/models";

type Answers = Record<string, number>;

const dimensions = Object.keys(preferenceDimensions) as PreferenceDimension[];

function normalizeWeights(answers: Answers) {
	const weights = Object.fromEntries(
		dimensions.map((dimension) => [dimension, 0]),
	) as Record<PreferenceDimension, number>;

	for (const question of modelFitQuestions) {
		const answerIndex = answers[question.id];
		const answer = question.answers[answerIndex];
		if (!answer) continue;

		for (const [dimension, value] of Object.entries(answer.weights)) {
			weights[dimension as PreferenceDimension] += value ?? 0;
		}
	}

	const total =
		Object.values(weights).reduce((sum, value) => sum + value, 0) || 1;
	return Object.fromEntries(
		dimensions.map((dimension) => [dimension, weights[dimension] / total]),
	) as Record<PreferenceDimension, number>;
}

export function ModelFitTest() {
	const [answers, setAnswers] = useState<Answers>({});

	const answeredCount = Object.keys(answers).length;
	const complete = answeredCount === modelFitQuestions.length;
	const weightedResults = useMemo(() => {
		const weights = normalizeWeights(answers);

		return modelFitProfiles
			.map((profile) => ({
				...profile,
				weightedScore: dimensions.reduce(
					(sum, dimension) =>
						sum + profile.scores[dimension] * weights[dimension],
					0,
				),
				weights,
			}))
			.sort((a, b) => b.weightedScore - a.weightedScore);
	}, [answers]);

	const best = weightedResults[0];
	const bestModel = thesisModels.find((model) => model.id === best?.modelId);

	return (
		<section className="not-prose my-10 overflow-hidden rounded-[2rem] border border-border bg-card text-card-foreground shadow-foreground/5 shadow-xl">
			<div className="border-border border-b bg-muted/35 p-5">
				<p className="font-display font-semibold text-foreground text-xl">
					Find the Best-Fitting Model
				</p>
				<p className="mt-2 max-w-2xl text-muted-foreground text-sm leading-relaxed">
					Answer five deployment and values questions. The result is not a
					universal ranking: it is a fit score based on the risk dimensions
					argued throughout this thesis.
				</p>
				<div className="mt-4 h-2 overflow-hidden rounded-full bg-background">
					<div
						className="h-full rounded-full bg-section-hero transition-all duration-300"
						style={{
							width: `${(answeredCount / modelFitQuestions.length) * 100}%`,
						}}
					/>
				</div>
			</div>

			<div className="grid gap-0 lg:grid-cols-[1fr_340px]">
				<div className="divide-y divide-border">
					{modelFitQuestions.map((question, questionIndex) => (
						<div key={question.id} className="p-5">
							<p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
								Question {questionIndex + 1}
							</p>
							<p className="mt-1 font-display font-semibold text-foreground text-lg">
								{question.question}
							</p>
							<p className="mt-1 text-muted-foreground text-sm leading-relaxed">
								{question.helper}
							</p>

							<div className="mt-4 grid gap-2">
								{question.answers.map((answer, answerIndex) => {
									const selected = answers[question.id] === answerIndex;

									return (
										<button
											key={answer.label}
											type="button"
											onClick={() =>
												setAnswers((current) => ({
													...current,
													[question.id]: answerIndex,
												}))
											}
											className={cn(
												"rounded-2xl border p-3 text-left transition-colors",
												selected
													? "border-foreground bg-foreground text-background"
													: "border-border bg-background hover:border-foreground/40",
											)}
										>
											<span className="block font-semibold text-sm">
												{answer.label}
											</span>
											<span
												className={cn(
													"mt-1 block text-xs leading-relaxed",
													selected
														? "text-background/75"
														: "text-muted-foreground",
												)}
											>
												{answer.description}
											</span>
										</button>
									);
								})}
							</div>
						</div>
					))}
				</div>

				<aside className="border-border border-t bg-background p-5 lg:border-t-0 lg:border-l">
					<p className="font-medium text-muted-foreground text-xs uppercase tracking-wider">
						Recommendation
					</p>
					{complete && best && bestModel ? (
						<div className="mt-3">
							<p className="font-bold font-display text-2xl text-foreground">
								{bestModel.name}
							</p>
							<p className="mt-1 text-muted-foreground text-sm capitalize">
								{bestModel.category} · {bestModel.provider}
							</p>
							<p className="mt-4 rounded-2xl bg-muted p-4 text-foreground text-sm leading-relaxed">
								{best.recommendation}
							</p>
							<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
								<strong className="text-foreground">Caveat:</strong>{" "}
								{best.caveat}
							</p>
						</div>
					) : (
						<p className="mt-3 text-muted-foreground text-sm leading-relaxed">
							Answer all questions to generate a fit recommendation.
						</p>
					)}

					<div className="mt-6 space-y-3">
						{weightedResults.map((result) => (
							<div key={result.modelId}>
								<div className="mb-1 flex items-center justify-between gap-3 text-xs">
									<span className="font-medium text-foreground">
										{getModelName(result.modelId)}
									</span>
									<span className="text-muted-foreground tabular-nums">
										{Math.round(result.weightedScore)}
									</span>
								</div>
								<div className="h-2 overflow-hidden rounded-full bg-muted">
									<div
										className="h-full rounded-full bg-section-orange transition-all duration-300"
										style={{ width: `${Math.max(4, result.weightedScore)}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</aside>
			</div>
		</section>
	);
}
