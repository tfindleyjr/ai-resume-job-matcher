"use client";

import { ChangeEvent, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function Home() {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [errorMessage, setErrorMessage] = useState("");
  const [analysisStarted, setAnalysisStarted] = useState(false);

  const [resumeFileName, setResumeFileName] = useState("");
  const [isReadingPdf, setIsReadingPdf] = useState(false);

  async function handleResumeUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      setErrorMessage("Please upload a PDF resume.");
      return;
    }

    setErrorMessage("");
    setAnalysisStarted(false);
    setIsReadingPdf(true);
    setResumeFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({
        data: arrayBuffer,
      }).promise;

      let extractedText = "";

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        const page = await pdf.getPage(pageNumber);

        const content = await page.getTextContent();

        const pageText = content.items
          .map((item) => {
            if ("str" in item) {
              return item.str;
            }

            return "";
          })
          .join(" ");

        extractedText += pageText + "\n";
      }

      setResumeText(extractedText.trim());
    } catch (error) {
      console.error("PDF extraction error:", error);

      setErrorMessage(
        "We could not read that PDF. Try another file or paste your resume manually."
      );

      setResumeFileName("");
    } finally {
      setIsReadingPdf(false);
    }
  }

  function handleAnalyze() {
    if (!resumeText.trim() || !jobDescription.trim()) {
      setErrorMessage(
        "Please add both your resume and the job description before analyzing."
      );

      setAnalysisStarted(false);

      return;
    }

    setErrorMessage("");
    setAnalysisStarted(true);
  }

  function handleClearResume() {
    setResumeText("");
    setResumeFileName("");
    setAnalysisStarted(false);
    setErrorMessage("");
  }

  function handleClearJobDescription() {
    setJobDescription("");
    setAnalysisStarted(false);
    setErrorMessage("");
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 md:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">
            AI Career Intelligence
          </p>

          <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900 md:text-5xl">
            Resume Job Matcher
          </h1>

          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Compare your resume against a job description, identify
            matching skills, uncover missing qualifications, and
            improve your chances of getting noticed.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          {/* Resume */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-semibold text-blue-600">
                STEP 1
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                Add Your Resume
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Upload a PDF resume or paste your resume text manually.
              </p>
            </div>

            {/* PDF Upload */}
            <label className="mb-5 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-blue-400 hover:bg-blue-50">
              <span className="text-base font-semibold text-slate-900">
                Upload Resume PDF
              </span>

              <span className="mt-1 text-sm text-slate-500">
                Select a PDF from your computer
              </span>

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleResumeUpload}
                className="hidden"
              />
            </label>

            {isReadingPdf && (
              <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
                Reading your resume...
              </div>
            )}

            {resumeFileName && !isReadingPdf && (
              <div className="mb-4 flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-4 py-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-green-600">
                    PDF Loaded
                  </p>

                  <p className="mt-1 text-sm font-medium text-green-800">
                    {resumeFileName}
                  </p>
                </div>

                <span className="text-sm font-semibold text-green-700">
                  ✓
                </span>
              </div>
            )}

            <div className="my-5 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Or paste manually
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <textarea
              value={resumeText}
              onChange={(event) => {
                setResumeText(event.target.value);
                setAnalysisStarted(false);
              }}
              placeholder="Paste your resume here..."
              className="min-h-[320px] w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                {resumeText.length.toLocaleString()} characters
              </p>

              <button
                type="button"
                onClick={handleClearResume}
                disabled={!resumeText && !resumeFileName}
                className="text-sm font-semibold text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Job Description */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-semibold text-blue-600">
                STEP 2
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                Add the Job Description
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Paste the description of the position you want to
                compare against.
              </p>
            </div>

            <textarea
              value={jobDescription}
              onChange={(event) => {
                setJobDescription(event.target.value);
                setAnalysisStarted(false);
              }}
              placeholder="Paste the job description here..."
              className="min-h-[475px] w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <div className="mt-3 flex items-center justify-between gap-4">
              <p className="text-sm text-slate-400">
                {jobDescription.length.toLocaleString()} characters
              </p>

              <button
                type="button"
                onClick={handleClearJobDescription}
                disabled={!jobDescription}
                className="text-sm font-semibold text-slate-500 transition hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Clear
              </button>
            </div>
          </div>
        </section>

        {/* Error */}
        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {/* Analyze */}
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isReadingPdf}
            className="w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400 md:w-auto md:min-w-[240px]"
          >
            {isReadingPdf ? "Reading Resume..." : "Analyze Match"}
          </button>
        </div>

        {/* Results */}
        <section className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          {!analysisStarted ? (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Analysis Results
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Your match results will appear here.
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Upload or paste your resume, add a job description,
                then select Analyze Match.
              </p>
            </>
          ) : (
            <>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                Ready for Analysis
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Your resume and job description are ready.
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                The next phase will send this information to our
                Python API for processing and analysis.
              </p>
            </>
          )}
        </section>
      </div>
    </main>
  );
}