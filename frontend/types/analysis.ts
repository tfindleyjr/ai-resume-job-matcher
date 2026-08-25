export type Recommendation = {
  title: string;
  description: string;
  type: string;
};

export type RewriteSuggestion = {
  original: string;
  suggested: string;
  reason: string;
  source: "ai" | "rule_based";
};

export type AnalyzeResponse = {
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

  recommendations: Recommendation[];
  rewrite_suggestions: RewriteSuggestion[];
};