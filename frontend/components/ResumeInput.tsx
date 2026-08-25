"use client";

import type { ChangeEvent } from "react";

type ResumeInputProps = {
  resumeText: string;
  resumeFileName: string;
  onResumeTextChange: (value: string) => void;
  onFileUpload: (
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  onClear: () => void;
};

export default function ResumeInput({
  resumeText,
  resumeFileName,
  onResumeTextChange,
  onFileUpload,
  onClear,
}: ResumeInputProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6">
      <div className="mb-5">
        <div className="flex items-center gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
            1
          </span>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Resume
            </p>

            <h3 className="text-xl font-bold text-slate-900">
              Add Your Resume
            </h3>
          </div>
        </div>

        <p className="mt-3 text-sm leading-6 text-slate-500">
          Upload a PDF or paste your resume text manually.
        </p>
      </div>

      <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 bg-white p-7 text-center transition hover:border-blue-400 hover:bg-blue-50">
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={onFileUpload}
          className="hidden"
        />

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl">
          ↑
        </div>

        <p className="mt-4 font-semibold text-slate-900">
          Upload Resume PDF
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Click to choose a PDF from your computer
        </p>
      </label>

      {resumeFileName && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-green-700">
              PDF Loaded
            </p>

            <p className="mt-1 text-sm font-medium text-green-800">
              {resumeFileName}
            </p>
          </div>

          <span className="text-lg font-bold text-green-600">
            ✓
          </span>
        </div>
      )}

      <div className="my-5 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          Or paste manually
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <textarea
        value={resumeText}
        onChange={(event) =>
          onResumeTextChange(event.target.value)
        }
        placeholder="Paste your resume text here..."
        className="min-h-[320px] w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
      />

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-slate-400">
          {resumeText.length.toLocaleString()} characters
        </p>

        {resumeText && (
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