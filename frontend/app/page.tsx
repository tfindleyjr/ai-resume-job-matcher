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
  "https://obscure-palm-tree-pxxgg7647xh779-8000.app.github.dev";


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

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }


    resetAnalysis();


    // --------------------------------------------------------
    // MAKE SURE FILE IS A PDF
    // --------------------------------------------------------

    if (file.type !== "application/pdf") {

      setError(
        "Please upload a PDF resume."
      );

      return;
    }


    setIsReadingPdf(true);

    setResumeFileName(
      file.name
    );


    try {

      // ------------------------------------------------------
      // LOAD PDF.JS
      // ------------------------------------------------------

      const pdfjsLib =
        await import("pdfjs-dist");


      // ------------------------------------------------------
      // CONFIGURE PDF WORKER
      // ------------------------------------------------------

      pdfjsLib.GlobalWorkerOptions.workerSrc =
        `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;


      // ------------------------------------------------------
      // READ PDF
      // ------------------------------------------------------

      const arrayBuffer =
        await file.arrayBuffer();


      const pdf =
        await pdfjsLib.getDocument({
          data: arrayBuffer,
        }).promise;


      let extractedText = "";


      // ------------------------------------------------------
      // EXTRACT TEXT FROM EVERY PAGE
      // ------------------------------------------------------

      for (
        let pageNumber = 1;
        pageNumber <= pdf.numPages;
        pageNumber++
      ) {

        const page =
          await pdf.getPage(
            pageNumber
          );


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


        extractedText +=
          `${pageText}\n`;
      }


      // ------------------------------------------------------
      // PUT PDF TEXT INTO RESUME INPUT
      // ------------------------------------------------------

      setResumeText(
        extractedText.trim()
      );


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

    setError("");


    // --------------------------------------------------------
    // VALIDATE RESUME
    // --------------------------------------------------------

    if (!resumeText.trim()) {

      setError(
        "Please upload a resume or paste your resume text."
      );

      return;
    }


    // --------------------------------------------------------
    // VALIDATE JOB DESCRIPTION
    // --------------------------------------------------------

    if (!jobDescription.trim()) {

      setError(
        "Please paste a job description before analyzing."
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
          `${BACKEND_URL}/analyze`,
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

        throw new Error(
          `Backend returned status ${response.status}`
        );

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


      setError(
        "Unable to connect to the analysis server. Make sure your FastAPI backend is running and port 8000 is public."
      );


    } finally {

      setIsAnalyzing(false);

    }
  };


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900">

      <div className="mx-auto max-w-7xl">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <header className="mb-10 text-center">

          <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
            AI-Powered Career Tool
          </p>


          <h1 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
            AI Resume Job Matcher
          </h1>


          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">

            Compare your resume against a job description,
            identify matching skills, discover missing
            qualifications, and receive AI-powered
            recommendations for improving your application.

          </p>

        </header>


        {/* ====================================================
            INPUT COMPONENTS
        ==================================================== */}

        <section className="grid gap-6 lg:grid-cols-2">


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

          <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">

            {error}

          </div>

        )}


        {/* ====================================================
            ANALYZE BUTTON
        ==================================================== */}

        <div className="my-8 flex justify-center">

          <button

            type="button"

            onClick={
              handleAnalyze
            }

            disabled={
              isAnalyzing ||
              isReadingPdf
            }

            className="min-w-[260px] rounded-xl bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"

          >

            {isReadingPdf
              ? "Reading Resume..."
              : isAnalyzing
                ? "Analyzing..."
                : "Analyze Match"}

          </button>

        </div>


        {/* ====================================================
            ANALYSIS RESULTS
        ==================================================== */}

        <section className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">


          {!analysisStarted ? (

            // ==================================================
            // BEFORE ANALYSIS
            // ==================================================

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

        <footer className="py-10 text-center">

          <p className="text-sm text-slate-400">
            AI Resume Job Matcher
          </p>

        </footer>


      </div>

    </main>
  );
}