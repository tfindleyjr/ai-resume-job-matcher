"use client";

import { useState } from "react";
import type { ChangeEvent } from "react";

import ResumeInput from "@/components/ResumeInput";
import JobDescriptionInput from "@/components/JobDescriptionInput";
import MatchScoreSection from "@/components/MatchScoreSection";
import RecommendationsSection from "@/components/RecommendationsSection";
import RewriteSuggestions from "@/components/RewriteSuggestion";
import AnalysisDetails from "@/components/AnalysisDetails";

import type {
  AnalyzeResponse,
  Recommendation,
  RewriteSuggestion,
} from "@/types/analysis";


// ============================================================
// BACKEND URL
// ============================================================

const BACKEND_URL =
  "https://ai-resume-job-matcher-lwgt.onrender.com";


// ============================================================
// MAIN PAGE
// ============================================================

export default function Home() {

  // ==========================================================
  // USER INPUT STATE
  // ==========================================================

  const [resumeText, setResumeText] =
    useState("");

  const [jobDescription, setJobDescription] =
    useState("");

  const [resumeFileName, setResumeFileName] =
    useState("");


  // ==========================================================
  // APPLICATION STATE
  // ==========================================================

  const [isAnalyzing, setIsAnalyzing] =
    useState(false);

  const [isReadingPdf, setIsReadingPdf] =
    useState(false);

  const [error, setError] =
    useState("");

  const [analysisStarted, setAnalysisStarted] =
    useState(false);

  const [backendMessage, setBackendMessage] =
    useState("");


  // ==========================================================
  // TEXT ANALYSIS STATE
  // ==========================================================

  const [resumeWordCount, setResumeWordCount] =
    useState<number | null>(null);

  const [jobWordCount, setJobWordCount] =
    useState<number | null>(null);

  const [sharedWordCount, setSharedWordCount] =
    useState<number | null>(null);

  const [sharedWords, setSharedWords] =
    useState<string[]>([]);

  const [missingWords, setMissingWords] =
    useState<string[]>([]);


  // ==========================================================
  // SKILL ANALYSIS STATE
  // ==========================================================

  const [resumeSkills, setResumeSkills] =
    useState<string[]>([]);

  const [jobSkills, setJobSkills] =
    useState<string[]>([]);

  const [matchedSkills, setMatchedSkills] =
    useState<string[]>([]);

  const [missingSkills, setMissingSkills] =
    useState<string[]>([]);


  // ==========================================================
  // MATCH SCORE STATE
  // ==========================================================

  const [skillMatchScore, setSkillMatchScore] =
    useState<number | null>(null);

  const [semanticScore, setSemanticScore] =
    useState<number | null>(null);

  const [overallMatchScore, setOverallMatchScore] =
    useState<number | null>(null);

  const [matchRating, setMatchRating] =
    useState("");


  // ==========================================================
  // RECOMMENDATION + AI REWRITE STATE
  // ==========================================================

  const [recommendations, setRecommendations] =
    useState<Recommendation[]>([]);

  const [rewriteSuggestions, setRewriteSuggestions] =
    useState<RewriteSuggestion[]>([]);


  // ==========================================================
  // RESET ANALYSIS
  // ==========================================================

  const resetAnalysis = () => {

    setAnalysisStarted(false);

    setError("");

    setBackendMessage("");


    // --------------------------------------------------------
    // TEXT ANALYSIS
    // --------------------------------------------------------

    setResumeWordCount(null);

    setJobWordCount(null);

    setSharedWordCount(null);

    setSharedWords([]);

    setMissingWords([]);


    // --------------------------------------------------------
    // SKILLS
    // --------------------------------------------------------

    setResumeSkills([]);

    setJobSkills([]);

    setMatchedSkills([]);

    setMissingSkills([]);


    // --------------------------------------------------------
    // SCORES
    // --------------------------------------------------------

    setSkillMatchScore(null);

    setSemanticScore(null);

    setOverallMatchScore(null);

    setMatchRating("");


    // --------------------------------------------------------
    // RECOMMENDATIONS
    // --------------------------------------------------------

    setRecommendations([]);


    // --------------------------------------------------------
    // AI REWRITES
    // --------------------------------------------------------

    setRewriteSuggestions([]);
  };


  // ==========================================================
  // PDF UPLOAD
  // ==========================================================

  const handleFileUpload = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const maxFileSize =
      5 * 1024 * 1024;

    if (file.size > maxFileSize) {
      setError(
        "Please upload a PDF smaller than 5 MB."
      );

      setResumeFileName("");

      return;
    }

    resetAnalysis();

    if (file.type !== "application/pdf") {
      setError(
        "Please upload a PDF resume."
      );

      return;
    }

    setIsReadingPdf(true);
    setResumeFileName(file.name);

    try {
      const pdfjsLib =
        await import("pdfjs-dist");

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer =
        await file.arrayBuffer();

      const pdf =
        await pdfjsLib.getDocument({
          data: arrayBuffer,
        }).promise;

      let extractedText = "";

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {
        const page =
          await pdf.getPage(pageNumber);

        const textContent =
          await page.getTextContent();

        const pageText =
          textContent.items
            .map((item) => {
              if ("str" in item) {
                return item.str;
              }

              return "";
            })
            .join(" ");

        extractedText += `${pageText}\n`;
      }

      const cleanedText =
        extractedText.trim();

      if (!cleanedText) {
        setError(
          "No readable text was found in this PDF. Try another file or paste your resume manually."
        );

        setResumeFileName("");

        return;
      }

      setResumeText(cleanedText);
    } catch (uploadError) {
      console.error(
        "PDF extraction error:",
        uploadError
      );

      setError(
        "Unable to read this PDF. Try another PDF or paste your resume manually."
      );

      setResumeFileName("");
    } finally {
      setIsReadingPdf(false);
    }
  };


  // ==========================================================
  // CLEAR RESUME
  // ==========================================================

  const handleClearResume = () => {

    setResumeText("");

    setResumeFileName("");

    resetAnalysis();
  };


  // ==========================================================
  // CLEAR JOB DESCRIPTION
  // ==========================================================

  const handleClearJobDescription = () => {

    setJobDescription("");

    resetAnalysis();
  };


  // ==========================================================
  // ANALYZE RESUME
  // ==========================================================

  const handleAnalyze = async () => {

    if (isAnalyzing) {
      return;
    }

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


    // --------------------------------------------------------
    // VALIDATE RESUME
    // --------------------------------------------------------

    if (resumeText.trim().length < 50) {
      setError(
        "Your resume text is too short to analyze reliably."
      );

      return;
    }

    // --------------------------------------------------------
    // VALIDATE JOB DESCRIPTION
    // --------------------------------------------------------

    if (jobDescription.trim().length < 50) {
      setError(
        "The job description is too short to analyze reliably."
      );

      return;
    }


    setIsAnalyzing(true);

    setAnalysisStarted(false);


    try {

      // ======================================================
      // SEND DATA TO FASTAPI
      // ======================================================

      const response =
        await fetch(
          "https://ai-resume-job-matcher-lwgt.onrender.com/analyze",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({

              resume_text:
                resumeText,

              job_description:
                jobDescription,

            }),
          }
        );


      // ======================================================
      // HANDLE BACKEND ERROR
      // ======================================================

      if (!response.ok) {
        let message =
          "The analysis could not be completed.";

        try {
          const errorData =
            await response.json();

          if (errorData.detail) {
            message =
              errorData.detail;
          }
        } catch {
          // Keep default message
        }

        throw new Error(message);
      }


      // ======================================================
      // READ BACKEND RESPONSE
      // ======================================================

      const data: AnalyzeResponse =
        await response.json();


      // ======================================================
      // BACKEND MESSAGE
      // ======================================================

      setBackendMessage(
        data.message
      );


      // ======================================================
      // TEXT ANALYSIS
      // ======================================================

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


      // ======================================================
      // SKILL ANALYSIS
      // ======================================================

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


      // ======================================================
      // MATCH SCORES
      // ======================================================

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


      // ======================================================
      // RECOMMENDATIONS
      // ======================================================

      setRecommendations(
        data.recommendations
      );


      // ======================================================
      // AI REWRITE SUGGESTIONS
      // ======================================================

      setRewriteSuggestions(
        data.rewrite_suggestions
      );


      // ======================================================
      // SHOW RESULTS
      // ======================================================

      setAnalysisStarted(true);


    } catch (analysisError) {
      console.error(
        "Analysis error:",
        analysisError
      );

      if (
        analysisError instanceof Error
      ) {
        setError(
          analysisError.message
        );
      } else {
        setError(
          "An unexpected error occurred."
        );
      }
    } 
    
    finally {

      setIsAnalyzing(false);

    }
  };


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <main className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 px-4 py-10 text-slate-900 md:px-8">

      <div className="mx-auto max-w-7xl">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="mx-auto mb-12 max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">
              AI Career Intelligence
            </span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 md:text-6xl">
            AI Resume Job Matcher
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Compare your resume against a job description, uncover skill gaps,
            measure semantic alignment, and receive targeted recommendations
            for improving your application.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-2">
            {[
              "Skill Analysis",
              "Semantic Matching",
              "AI Rewrites",
              "Resume Recommendations",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500 shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </header>


        {/* ====================================================
            INPUT COMPONENTS
        ==================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Start Your Analysis
            </p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Compare your resume to a job
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Add both documents below and the system will analyze technical
              skills, semantic similarity, and resume alignment.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">


          {/* RESUME */}

          <ResumeInput

            resumeText={
              resumeText
            }

            resumeFileName={
              resumeFileName
            }

            onResumeTextChange={(
              value
            ) => {

              setResumeText(
                value
              );

              resetAnalysis();

            }}

            onFileUpload={
              handleFileUpload
            }

            onClear={
              handleClearResume
            }

          />


          {/* JOB DESCRIPTION */}

          <JobDescriptionInput

            jobDescription={
              jobDescription
            }

            onJobDescriptionChange={(
              value
            ) => {

              setJobDescription(
                value
              );

              resetAnalysis();

            }}

            onClear={
              handleClearJobDescription
            }

          />
          </div>
        </section>


        {/* ====================================================
            PDF LOADING MESSAGE
        ==================================================== */}

        {isReadingPdf && (

          <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm font-medium text-blue-700">

            Reading your resume PDF...

          </div>

        )}


        {/* ====================================================
            ERROR MESSAGE
        ==================================================== */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <div className="flex gap-3">
              <span className="font-bold text-red-600">
                !
              </span>

              <div>
                <p className="font-semibold text-red-900">
                  Something needs your attention
                </p>

                <p className="mt-1 text-sm text-red-700">
                  {error}
                </p>
              </div>
            </div>
          </div>
        )}


        {/* ====================================================
            ANALYZE BUTTON
        ==================================================== */}

        <div className="my-8 flex flex-col items-center">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={isAnalyzing || isReadingPdf}
            className="group min-w-[280px] rounded-2xl bg-slate-950 px-8 py-4 text-base font-bold text-white shadow-lg shadow-slate-200 transition hover:-translate-y-0.5 hover:bg-blue-600 hover:shadow-xl disabled:cursor-not-allowed disabled:bg-slate-400 disabled:hover:translate-y-0"
          >
            {isReadingPdf
              ? "Reading Resume..."
              : isAnalyzing
                ? "Analyzing Your Match..."
                : "Analyze Resume Match"}
          </button>

          <p className="mt-3 text-xs text-slate-400">
            Analysis may take a few seconds while the AI models process your documents.
          </p>
        </div>

        {isAnalyzing && (
          <div className="mb-8 rounded-2xl border border-blue-200 bg-blue-50 p-6">
            <div className="flex items-start gap-4">
              <div className="mt-1 h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />

              <div>
                <p className="font-semibold text-blue-900">
                  Analyzing your resume...
                </p>

                <p className="mt-1 text-sm leading-6 text-blue-700">
                  Comparing skills, generating embeddings, calculating match
                  scores, and building personalized recommendations.
                </p>
              </div>
            </div>
          </div>
        )}


        {/* ====================================================
            ANALYSIS RESULTS
        ==================================================== */}

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">


          {!analysisStarted ? (

            // ==================================================
            // BEFORE ANALYSIS
            // ==================================================

            <div className="py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
                ✦
              </div>

              <p className="mt-5 text-sm font-semibold uppercase tracking-wide text-slate-400">
                Analysis Results
              </p>

              <h2 className="mt-2 text-2xl font-bold text-slate-900">
                Your match results will appear here.
              </h2>

              <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                Upload your resume, paste a job description, and run the
                analysis to see your scores, skill gaps, and recommendations.
              </p>
            </div>


          ) : (

            // ==================================================
            // AFTER ANALYSIS
            // ==================================================

            <div>


              {/* ==============================================
                  ANALYSIS HEADER
              ============================================== */}

              <div className="text-center">


                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Analysis Complete
                </p>


                <h2 className="mt-2 text-2xl font-semibold text-slate-900">

                  {backendMessage}

                </h2>


              </div>


              {/* ==============================================
                  MATCH SCORES
              ============================================== */}

              <MatchScoreSection

                overallMatchScore={
                  overallMatchScore
                }

                skillMatchScore={
                  skillMatchScore
                }

                semanticScore={
                  semanticScore
                }

                matchRating={
                  matchRating
                }

              />


              {/* ==============================================
                  RECOMMENDATIONS
              ============================================== */}

              <RecommendationsSection

                recommendations={
                  recommendations
                }

              />


              {/* ==============================================
                  AI RESUME REWRITES
              ============================================== */}

              <RewriteSuggestions

                suggestions={
                  rewriteSuggestions
                }

              />


              {/* ==============================================
                  DETAILED ANALYSIS
              ============================================== */}

              <AnalysisDetails

                resumeWordCount={
                  resumeWordCount
                }

                jobWordCount={
                  jobWordCount
                }

                sharedWordCount={
                  sharedWordCount
                }

                sharedWords={
                  sharedWords
                }

                missingWords={
                  missingWords
                }

                matchedSkills={
                  matchedSkills
                }

                missingSkills={
                  missingSkills
                }

                resumeSkills={
                  resumeSkills
                }

                jobSkills={
                  jobSkills
                }

              />


            </div>

          )}


        </section>


        {/* ====================================================
            FOOTER
        ==================================================== */}

        <footer className="py-12 text-center">
          <p className="text-sm font-medium text-slate-400">
            AI Resume Job Matcher
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Built with Next.js, TypeScript, Python, FastAPI, and NLP.
          </p>
        </footer>


      </div>

    </main>
  );
}