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
    <div className="mx-auto mt-8 max-w-5xl">
      <div className="overflow-hidden rounded-3xl bg-slate-950 p-8 text-white shadow-xl md:p-10">
        <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-300">
              Overall Resume Match
            </p>

            <h3 className="mt-3 text-3xl font-bold">
              Your application alignment
            </h3>

            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
              This overall score combines explicit technical skill
              overlap with AI-powered semantic similarity.
            </p>

            <div className="mt-6 h-3 max-w-xl overflow-hidden rounded-full bg-slate-700">
              <div
                className="h-full rounded-full bg-white transition-all duration-700"
                style={{
                  width: `${Math.min(
                    overallMatchScore ?? 0,
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          <div className="text-center md:min-w-[180px]">
            <p className="text-7xl font-bold tracking-tight">
              {overallMatchScore ?? 0}
              <span className="text-3xl text-slate-400">
                %
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <ScoreCard
          label="Skill Match"
          value={skillMatchScore}
          description="Explicit technical skill overlap"
          badge={matchRating}
        />

        <ScoreCard
          label="Semantic Match"
          value={semanticScore}
          description="AI-powered contextual similarity"
          badge="AI Similarity"
        />
      </div>
    </div>
  );
}

function ScoreCard({
  label,
  value,
  description,
  badge,
}: {
  label: string;
  value: number | null;
  description: string;
  badge: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-950">
            {value ?? 0}%
          </p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          {badge}
        </span>
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-blue-600 transition-all duration-700"
          style={{
            width: `${Math.min(value ?? 0, 100)}%`,
          }}
        />
      </div>

      <p className="mt-4 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}