import type {
  RewriteSuggestion,
} from "@/types/analysis";

type RewriteSuggestionsProps = {
  suggestions: RewriteSuggestion[];
};

export default function RewriteSuggestions({
  suggestions,
}: RewriteSuggestionsProps) {
  return (
    <section className="mx-auto mt-12 max-w-5xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-purple-600">
          Resume Optimization
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-950">
          Suggested Resume Rewrites
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          The system strengthens your existing wording while guardrails
          help prevent invented skills, numbers, or accomplishments.
        </p>
      </div>

      <div className="space-y-5">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <article
              key={`${suggestion.original}-${index}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
            >
              <div className="grid md:grid-cols-2">
                <div className="border-b border-slate-200 bg-slate-50 p-6 md:border-b-0 md:border-r">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Original
                  </p>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {suggestion.original}
                  </p>
                </div>

                <div className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                      Suggested Rewrite
                    </p>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        suggestion.source === "ai"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {suggestion.source === "ai"
                        ? "AI Generated"
                        : "Safe Fallback"}
                    </span>
                  </div>

                  <p className="mt-3 font-medium leading-7 text-slate-900">
                    {suggestion.suggested}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 bg-purple-50/70 px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
                  Why this helps
                </p>

                <p className="mt-2 text-sm leading-6 text-purple-900">
                  {suggestion.reason}
                </p>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-500">
              No rewrite suggestions were generated.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}