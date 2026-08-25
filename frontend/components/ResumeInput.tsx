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
    <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
      <p className="text-sm font-bold uppercase tracking-wide text-blue-600">
        Step 1
      </p>

      <h2 className="mt-2 text-2xl font-bold">
        Add Your Resume
      </h2>

      <p className="mt-2 text-slate-500">
        Upload a PDF resume or paste your resume text
        manually.
      </p>

      <label className="mt-7 block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
        <input
          type="file"
          accept=".pdf,application/pdf"
          onChange={onFileUpload}
          className="hidden"
        />

        <p className="font-semibold text-slate-900">
          Upload Resume PDF
        </p>

        <p className="mt-1 text-sm text-slate-500">
          Select a PDF from your computer
        </p>
      </label>

      {resumeFileName && (
        <div className="mt-5 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 p-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-green-700">
              PDF Loaded
            </p>

            <p className="mt-1 text-sm font-medium text-green-800">
              {resumeFileName}
            </p>
          </div>

          <span className="text-xl text-green-600">
            ✓
          </span>
        </div>
      )}

      <div className="my-6 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Or Paste Manually
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <textarea
        value={resumeText}
        onChange={(event) =>
          onResumeTextChange(event.target.value)
        }
        placeholder="Paste your resume text here..."
        className="min-h-[300px] w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />

      <div className="mt-3 flex items-center justify-between">
        <p className="text-sm text-slate-400">
          {resumeText.length.toLocaleString()} characters
        </p>

        {resumeText && (
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