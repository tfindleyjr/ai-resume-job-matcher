"use client";

type JobDescriptionInputProps = {
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  onClear: () => void;
};

export default function JobDescriptionInput({
  jobDescription,
  onJobDescriptionChange,
  onClear,
}: JobDescriptionInputProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-bold text-white">
            2
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-purple-600">
              Job
            </p>

            <h3 className="text-xl font-bold text-slate-900">
              Add the Job Description
            </h3>
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Paste the full job posting you want to compare against.
        </p>
      </div>

      <textarea
        value={jobDescription}
        onChange={(event) =>
          onJobDescriptionChange(event.target.value)
        }
        placeholder="Paste the full job description here..."
        className="min-h-[500px] w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-purple-500 focus:ring-4 focus:ring-purple-100"
      />

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {jobDescription.length.toLocaleString()} characters
        </p>

        {jobDescription && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-lg px-3 py-1 text-sm font-semibold text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}