type AnalysisDetailsProps = {
  resumeWordCount: number | null;
  jobWordCount: number | null;
  sharedWordCount: number | null;

  sharedWords: string[];
  missingWords: string[];

  matchedSkills: string[];
  missingSkills: string[];

  resumeSkills: string[];
  jobSkills: string[];
};

export default function AnalysisDetails({
  resumeWordCount,
  jobWordCount,
  sharedWordCount,
  sharedWords,
  missingWords,
  matchedSkills,
  missingSkills,
  resumeSkills,
  jobSkills,
}: AnalysisDetailsProps) {
  return (
    <section className="mx-auto mt-12 max-w-5xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-400">
          Detailed Analysis
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-950">
          What the System Detected
        </h3>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard
          label="Resume Words"
          value={resumeWordCount}
        />

        <MetricCard
          label="Job Description Words"
          value={jobWordCount}
        />

        <MetricCard
          label="Shared Words"
          value={sharedWordCount}
        />
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <ListCard
          title="Matched Skills"
          description="Technical skills detected in both documents."
          items={matchedSkills}
        />

        <ListCard
          title="Missing Skills"
          description="Job skills not detected in the resume."
          items={missingSkills}
        />

        <ListCard
          title="Shared Keywords"
          description="Relevant vocabulary appearing in both documents."
          items={sharedWords}
        />

        <ListCard
          title="Missing Keywords"
          description="Job-description vocabulary absent from the resume."
          items={missingWords}
        />

        <ListCard
          title="Resume Skills"
          description="All recognized skills from the resume."
          items={resumeSkills}
        />

        <ListCard
          title="Job Skills"
          description="All recognized skills from the job posting."
          items={jobSkills}
        />
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
}: {
  label: string;
  value: number | null;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <p className="text-sm font-medium text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-3xl font-bold text-slate-950">
        {(value ?? 0).toLocaleString()}
      </p>
    </div>
  );
}

function ListCard({
  title,
  description,
  items,
}: {
  title: string;
  description: string;
  items: string[];
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h4 className="font-bold text-slate-900">
        {title}
      </h4>

      <p className="mt-1 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              key={item}
              className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700"
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-400">
            None detected.
          </p>
        )}
      </div>
    </div>
  );
}