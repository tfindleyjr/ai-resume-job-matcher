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
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
          Resume Recommendations
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          How to Improve Your Match
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Based on your resume and this job description,
          here are the areas that could make your
          application stronger.
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.length > 0 ? (
          recommendations.map(
            (recommendation, index) => (
              <div
                key={`${recommendation.title}-${index}`}
                className="rounded-xl border border-slate-200 bg-slate-50 p-5"
              >
                <div className="flex gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {index + 1}
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {recommendation.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {recommendation.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          )
        ) : (
          <p className="text-sm text-slate-600">
            No recommendations generated.
          </p>
        )}
      </div>
    </div>
  );
}