import type {
  Recommendation,
} from "@/types/analysis";

type RecommendationsSectionProps = {
  recommendations: Recommendation[];
};

export default function RecommendationsSection({
  recommendations,
}: RecommendationsSectionProps) {
  return (
    <section className="mx-auto mt-12 max-w-5xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-blue-600">
          Recommendations
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-950">
          How to Improve Your Match
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          These suggestions are based on the skill gaps and contextual
          differences found during your analysis.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {recommendations.length > 0 ? (
          recommendations.map((recommendation, index) => (
            <article
              key={`${recommendation.title}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex gap-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  {index + 1}
                </span>

                <div>
                  <h4 className="font-bold text-slate-900">
                    {recommendation.title}
                  </h4>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {recommendation.description}
                  </p>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">
              No recommendations were generated.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}