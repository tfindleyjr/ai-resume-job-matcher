type MatchScoreSectionProps = {
  overallMatchScore: number | null;
  skillMatchScore: number | null;
  semanticScore: number | null;
  matchRating: string;
};

export default function MatchScoreSection({
  overallMatchScore,
  skillMatchScore,
  semanticScore,
  matchRating,
}: MatchScoreSectionProps) {
  return (
    <>
      <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-slate-200 bg-slate-900 p-8 text-center text-white shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-widest text-slate-300">
          Overall Resume Match
        </p>

        <p className="mt-4 text-7xl font-bold tracking-tight">
          {overallMatchScore ?? 0}%
        </p>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">
          Your overall score combines technical skill overlap
          with AI-powered semantic similarity.
        </p>

        <div className="mx-auto mt-6 h-4 max-w-xl overflow-hidden rounded-full bg-slate-700">
          <div
            className="h-full rounded-full bg-white transition-all duration-500"
            style={{
              width: `${Math.min(
                overallMatchScore ?? 0,
                100
              )}%`,
            }}
          />
        </div>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            Skill Match
          </p>

          <p className="mt-3 text-5xl font-bold tracking-tight text-slate-900">
            {skillMatchScore ?? 0}%
          </p>

          <p className="mt-2 text-lg font-semibold text-slate-700">
            {matchRating}
          </p>

          <div className="mx-auto mt-6 h-3 overflow-hidden rounded-full bg-blue-100">
            <div
              className="h-full rounded-full bg-blue-600"
              style={{
                width: `${Math.min(
                  skillMatchScore ?? 0,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-purple-200 bg-purple-50 p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-purple-600">
            Semantic Match
          </p>

          <p className="mt-3 text-5xl font-bold tracking-tight text-slate-900">
            {semanticScore ?? 0}%
          </p>

          <p className="mt-2 text-lg font-semibold text-slate-700">
            AI Similarity
          </p>

          <div className="mx-auto mt-6 h-3 overflow-hidden rounded-full bg-purple-100">
            <div
              className="h-full rounded-full bg-purple-600"
              style={{
                width: `${Math.min(
                  semanticScore ?? 0,
                  100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
}