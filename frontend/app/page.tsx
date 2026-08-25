"use client";

import { ChangeEvent, useState } from "react";

type AnalyzeResponse = {
  message: string;

  resume_word_count: number;
  job_word_count: number;
  resume_unique_word_count: number;
  job_unique_word_count: number;

  shared_word_count: number;
  shared_words: string[];
  missing_words: string[];

  resume_skills: string[];
  job_skills: string[];

  matched_skills: string[];
  missing_skills: string[];

  resume_skill_count: number;
  job_skill_count: number;

  matched_skill_count: number;
  missing_skill_count: number;

  skill_match_score: number;
  match_rating: string;

  semantic_score: number;
  overall_match_score: number;
};

export default function Home() {
  // ============================================================
  // RESUME + JOB DESCRIPTION STATE
  // ============================================================

  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [resumeFileName, setResumeFileName] = useState("");

  // ============================================================
  // LOADING / ERROR STATE
  // ============================================================

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [analysisStarted, setAnalysisStarted] = useState(false);

  // ============================================================
  // BASIC TEXT ANALYSIS STATE
  // ============================================================

  const [backendMessage, setBackendMessage] = useState("");

  const [resumeWordCount, setResumeWordCount] =
    useState<number | null>(null);

  const [jobWordCount, setJobWordCount] =
    useState<number | null>(null);

  const [sharedWordCount, setSharedWordCount] =
    useState<number | null>(null);

  const [sharedWords, setSharedWords] = useState<string[]>([]);
  const [missingWords, setMissingWords] = useState<string[]>([]);

  // ============================================================
  // PHASE 8 — TECHNICAL SKILL ANALYSIS STATE
  // ============================================================

  const [resumeSkills, setResumeSkills] = useState<string[]>([]);
  const [jobSkills, setJobSkills] = useState<string[]>([]);

  const [matchedSkills, setMatchedSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);

  const [matchedSkillCount, setMatchedSkillCount] =
    useState<number | null>(null);

  const [missingSkillCount, setMissingSkillCount] =
    useState<number | null>(null);

  const [skillMatchScore, setSkillMatchScore] =
    useState<number | null>(null);

  const [matchRating, setMatchRating] =
    useState("");

  const [semanticScore, setSemanticScore] =
    useState<number | null>(null); 

  const [overallMatchScore, setOverallMatchScore] =
    useState<number | null>(null);

  // ============================================================
  // PDF UPLOAD
  // ============================================================

  const handleFileUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");

    if (file.type !== "application/pdf") {
      setError("Please upload a PDF file.");
      return;
    }

    try {
      setResumeFileName(file.name);

      /*
        We dynamically import PDF.js here so that it only runs
        inside the browser.

        This avoids the DOMMatrix error that can happen when
        pdfjs-dist is imported during server-side rendering.
      */

      const pdfjsLib = await import("pdfjs-dist");

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

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

        const textContent = await page.getTextContent();

        const pageText = textContent.items
          .map((item) => {
            if ("str" in item) {
              return item.str;
            }

            return "";
          })
          .join(" ");

        extractedText += `${pageText}\n`;
      }

      setResumeText(extractedText.trim());
      setAnalysisStarted(false);
    } catch (uploadError) {
      console.error(uploadError);

      setError(
        "Unable to read this PDF. You can paste your resume text manually instead."
      );

      setResumeFileName("");
    }
  };

  // ============================================================
  // CLEAR RESUME
  // ============================================================

  const handleClearResume = () => {
    setResumeText("");
    setResumeFileName("");

    resetAnalysis();
  };

  // ============================================================
  // CLEAR JOB DESCRIPTION
  // ============================================================

  const handleClearJobDescription = () => {
    setJobDescription("");

    resetAnalysis();
  };

  // ============================================================
  // RESET ANALYSIS
  // ============================================================

  const resetAnalysis = () => {
    setAnalysisStarted(false);
    setError("");
    setBackendMessage("");

    setResumeWordCount(null);
    setJobWordCount(null);
    setSharedWordCount(null);

    setSharedWords([]);
    setMissingWords([]);

    setResumeSkills([]);
    setJobSkills([]);
    setMatchedSkills([]);
    setMissingSkills([]);

    setMatchedSkillCount(null);
    setMissingSkillCount(null);

    setSkillMatchScore(null);
    setMatchRating("");

    setSemanticScore(null);
    setOverallMatchScore(null);
  };

  // ============================================================
  // ANALYZE RESUME
  // ============================================================

  const handleAnalyze = async () => {
    setError("");

    if (!resumeText.trim()) {
      setError(
        "Please upload a resume or paste your resume text."
      );

      return;
    }

    if (!jobDescription.trim()) {
      setError(
        "Please paste a job description before analyzing."
      );

      return;
    }

    setIsAnalyzing(true);

    try {
      /*
        IMPORTANT:

        Replace this URL with YOUR current Codespaces backend URL
        if your Codespace URL changes.

        Your backend route must end with /analyze.
      */

      const response = await fetch(
        "https://obscure-palm-tree-pxxgg7647xh779-8000.app.github.dev/analyze",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            resume_text: resumeText,
            job_description: jobDescription,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          `Backend returned status ${response.status}`
        );
      }

      const data: AnalyzeResponse = await response.json();

      // Phase 7 data
      setBackendMessage(data.message);

      setResumeWordCount(
        data.resume_word_count
      );

      setJobWordCount(
        data.job_word_count
      );

      setSharedWordCount(
        data.shared_word_count
      );

      setSharedWords(
        data.shared_words
      );

      setMissingWords(
        data.missing_words
      );

      // Phase 8 data
      setResumeSkills(
        data.resume_skills
      );

      setJobSkills(
        data.job_skills
      );

      setMatchedSkills(
        data.matched_skills
      );

      setMissingSkills(
        data.missing_skills
      );

      setMatchedSkillCount(
        data.matched_skill_count
      );

      setMissingSkillCount(
        data.missing_skill_count
      );

      setSkillMatchScore(
        data.skill_match_score
      );

      setMatchRating(
        data.match_rating
      );

      setSemanticScore(
        data.semantic_score
      );

      setOverallMatchScore(
        data.overall_match_score
      );

      setAnalysisStarted(true);
    } catch (analysisError) {
      console.error(analysisError);

      setError(
        "Unable to connect to the analysis server. Make sure the backend is running."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <header className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            AI-Powered Career Tool
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            AI Resume Job Matcher
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Compare your resume against a job description,
            identify matching skills, discover missing keywords,
            and understand how well your experience aligns with
            the position.
          </p>
        </header>

        {/* ======================================================
            INPUT AREA
        ====================================================== */}

        <section className="grid gap-6 lg:grid-cols-2">

          {/* ====================================================
              STEP 1 — RESUME
          ==================================================== */}

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

            {/* PDF UPLOAD */}

            <label className="mt-7 block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50">

              <input
                type="file"
                accept=".pdf,application/pdf"
                onChange={handleFileUpload}
                className="hidden"
              />

              <p className="font-semibold text-slate-900">
                Upload Resume PDF
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Select a PDF from your computer
              </p>
            </label>

            {/* PDF LOADED MESSAGE */}

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

            {/* DIVIDER */}

            <div className="my-6 flex items-center gap-4">

              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                Or Paste Manually
              </span>

              <div className="h-px flex-1 bg-slate-200" />

            </div>

            {/* RESUME TEXT */}

            <textarea
              value={resumeText}
              onChange={(event) => {
                setResumeText(event.target.value);
                setAnalysisStarted(false);
              }}
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
                  onClick={handleClearResume}
                  className="text-sm font-semibold text-slate-500 hover:text-red-600"
                >
                  Clear
                </button>
              )}

            </div>
          </div>

          {/* ====================================================
              STEP 2 — JOB DESCRIPTION
          ==================================================== */}

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
              onChange={(event) => {
                setJobDescription(event.target.value);
                setAnalysisStarted(false);
              }}
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
                  onClick={handleClearJobDescription}
                  className="text-sm font-semibold text-slate-500 hover:text-red-600"
                >
                  Clear
                </button>
              )}

            </div>
          </div>
        </section>

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* ======================================================
            ANALYZE BUTTON
        ====================================================== */}

        <div className="my-8 flex justify-center">

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="min-w-[260px] rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
          >
            {isAnalyzing
              ? "Analyzing..."
              : "Analyze Match"}
          </button>

        </div>

        {/* ======================================================
            ANALYSIS RESULTS
        ====================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">

          {!analysisStarted ? (

            /* ==================================================
               BEFORE ANALYSIS
            ================================================== */

            <div className="py-12 text-center">

              <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Analysis Results
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                Your match results will appear here.
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Upload or paste your resume, add a job
                description, then select Analyze Match.
              </p>

            </div>

          ) : (

            /* ==================================================
               AFTER ANALYSIS
            ================================================== */

            <div>

              <div className="text-center">

                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Text Analysis Complete
                </p>

                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                  {backendMessage}
                </h2>

              </div>

             <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-slate-200 bg-slate-900 p-8 text-center text-white shadow-sm">

              <p className="text-sm font-semibold uppercase tracking-widest text-slate-300">
                Overall Resume Match
              </p>

              <p className="mt-4 text-7xl font-bold tracking-tight">
                {overallMatchScore ?? 0}%
              </p>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-300">
                Your overall score combines technical skill overlap with
                AI-powered semantic similarity.
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

                {/* SKILL MATCH */}

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
                      className="h-full rounded-full bg-blue-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          skillMatchScore ?? 0,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Measures how many technical skills requested by the job
                    were detected in your resume.
                  </p>

                </div>


                {/* SEMANTIC MATCH */}

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
                      className="h-full rounded-full bg-purple-600 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          semanticScore ?? 0,
                          100
                        )}%`,
                      }}
                    />
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    Uses a language model to measure how closely the meaning
                    of your resume aligns with the job description.
                  </p>

                </div>

              </div>

              {/* ================================================
                  WORD COUNTS
              ================================================ */}

              <div className="mx-auto mt-8 grid max-w-4xl gap-4 md:grid-cols-3">

                <div className="rounded-xl bg-slate-50 p-5 text-center">

                  <p className="text-sm font-medium text-slate-500">
                    Resume Words
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {resumeWordCount?.toLocaleString()}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-5 text-center">

                  <p className="text-sm font-medium text-slate-500">
                    Job Description Words
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {jobWordCount?.toLocaleString()}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-5 text-center">

                  <p className="text-sm font-medium text-slate-500">
                    Shared Words
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-600">
                    {sharedWordCount?.toLocaleString()}
                  </p>

                </div>

              </div>

              {/* ================================================
                  KEYWORD ANALYSIS
              ================================================ */}

              <div className="mx-auto mt-6 grid max-w-4xl gap-6 text-left md:grid-cols-2">

                {/* SHARED KEYWORDS */}

                <div className="rounded-xl border border-green-200 bg-green-50 p-5">

                  <h3 className="font-semibold text-green-900">
                    Shared Keywords
                  </h3>

                  <p className="mt-1 text-sm text-green-700">
                    Words found in both your resume and the job
                    description.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {sharedWords.length > 0 ? (

                      sharedWords.map((word) => (
                        <span
                          key={word}
                          className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                        >
                          {word}
                        </span>
                      ))

                    ) : (

                      <p className="text-sm text-green-700">
                        No shared keywords found.
                      </p>

                    )}

                  </div>
                </div>

                {/* MISSING KEYWORDS */}

                <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">

                  <h3 className="font-semibold text-orange-900">
                    Missing Job Keywords
                  </h3>

                  <p className="mt-1 text-sm text-orange-700">
                    Words appearing in the job description but not
                    your resume.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">

                    {missingWords.length > 0 ? (

                      missingWords.map((word) => (
                        <span
                          key={word}
                          className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800"
                        >
                          {word}
                        </span>
                      ))

                    ) : (

                      <p className="text-sm text-orange-700">
                        No missing keywords found.
                      </p>

                    )}

                  </div>
                </div>

              </div>

              {/* ================================================
                  PHASE 8 — TECHNICAL SKILL ANALYSIS
              ================================================ */}

              <div className="mx-auto mt-10 max-w-4xl border-t border-slate-200 pt-8">

                <div className="text-center">

                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    Technical Skill Analysis
                  </p>

                  <h3 className="mt-2 text-2xl font-semibold text-slate-900">
                    Resume vs. Job Skills
                  </h3>

                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    These skills were identified directly from your
                    resume and the job description.
                  </p>

                </div>

                {/* SKILL COUNTS */}

                <div className="mt-6 grid gap-4 md:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-5 text-center">

                    <p className="text-sm font-medium text-slate-500">
                      Matched Skills
                    </p>

                    <p className="mt-2 text-3xl font-bold text-green-600">
                      {matchedSkillCount ?? 0}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-5 text-center">

                    <p className="text-sm font-medium text-slate-500">
                      Missing Skills
                    </p>

                    <p className="mt-2 text-3xl font-bold text-orange-600">
                      {missingSkillCount ?? 0}
                    </p>

                  </div>

                </div>

                {/* MATCHED + MISSING SKILLS */}

                <div className="mt-6 grid gap-6 text-left md:grid-cols-2">

                  {/* MATCHED */}

                  <div className="rounded-xl border border-green-200 bg-green-50 p-5">

                    <h4 className="font-semibold text-green-900">
                      Matched Skills
                    </h4>

                    <p className="mt-1 text-sm text-green-700">
                      Skills found in both your resume and this job.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {matchedSkills.length > 0 ? (

                        matchedSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                          >
                            {skill}
                          </span>
                        ))

                      ) : (

                        <p className="text-sm text-green-700">
                          No matching technical skills were detected.
                        </p>

                      )}

                    </div>
                  </div>

                  {/* MISSING */}

                  <div className="rounded-xl border border-orange-200 bg-orange-50 p-5">

                    <h4 className="font-semibold text-orange-900">
                      Missing Skills
                    </h4>

                    <p className="mt-1 text-sm text-orange-700">
                      Skills requested by the job that were not
                      detected in your resume.
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {missingSkills.length > 0 ? (

                        missingSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800"
                          >
                            {skill}
                          </span>
                        ))

                      ) : (

                        <p className="text-sm text-orange-700">
                          No missing technical skills were detected.
                        </p>

                      )}

                    </div>
                  </div>

                </div>

                {/* ==============================================
                    ALL DETECTED SKILLS
                ============================================== */}

                <div className="mt-6 grid gap-6 text-left md:grid-cols-2">

                  {/* RESUME SKILLS */}

                  <div className="rounded-xl border border-slate-200 p-5">

                    <h4 className="font-semibold text-slate-900">
                      Skills Detected in Resume
                    </h4>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {resumeSkills.length > 0 ? (

                        resumeSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                          >
                            {skill}
                          </span>
                        ))

                      ) : (

                        <p className="text-sm text-slate-500">
                          No technical skills detected.
                        </p>

                      )}

                    </div>
                  </div>

                  {/* JOB SKILLS */}

                  <div className="rounded-xl border border-slate-200 p-5">

                    <h4 className="font-semibold text-slate-900">
                      Skills Detected in Job
                    </h4>

                    <div className="mt-4 flex flex-wrap gap-2">

                      {jobSkills.length > 0 ? (

                        jobSkills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
                          >
                            {skill}
                          </span>
                        ))

                      ) : (

                        <p className="text-sm text-slate-500">
                          No technical skills detected.
                        </p>

                      )}

                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </section>

      </div>
    </main>
  );
}