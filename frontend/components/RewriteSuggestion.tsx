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
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-purple-600">
          Resume Optimization
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          Suggested Resume Rewrites
        </h3>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Suggestions improve your existing wording without
          inventing new experience.
        </p>
      </div>

      <div className="space-y-5">
        {suggestions.length > 0 ? (
          suggestions.map((suggestion, index) => (
            <div
              key={`${suggestion.original}-${index}`}
              className="rounded-2xl border border-slate-200 bg-white p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Original
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {suggestion.original}
              </p>

              <div className="my-5 border-t border-slate-200" />

              <div className="flex items-center justify-between gap-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
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

              <p className="mt-2 font-medium leading-7 text-slate-900">
                {suggestion.suggested}
              </p>

              <div className="mt-5 rounded-xl bg-purple-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-purple-600">
                  Why this helps
                </p>

                <p className="mt-2 text-sm leading-6 text-purple-900">
                  {suggestion.reason}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-600">
            No rewrite suggestions generated.
          </p>
        )}
      </div>
    </div>
  );
}