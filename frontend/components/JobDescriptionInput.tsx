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
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
        Step 2
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Add the Job Description
      </h2>

      <p className="mt-2 text-slate-500">
        Paste the description of the position you want to
        compare against.
      </p>

      <textarea
        value={jobDescription}
        onChange={(event) =>
          onJobDescriptionChange(event.target.value)
        }
        placeholder="Paste the full job description here..."
        className="mt-7 min-h-[470px] w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {jobDescription.length.toLocaleString()} characters
        </p>

        {jobDescription && (
          <button
            type="button"
            onClick={onClear}
            className="text-sm font-semibold text-slate-500 hover:text-red-600"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}