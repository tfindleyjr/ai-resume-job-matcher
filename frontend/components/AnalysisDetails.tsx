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
    <div className="mx-auto mt-10 max-w-4xl">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-slate-50 p-5 text-center">
          <p className="text-sm text-slate-500">
            Resume Words
          </p>

          <p className="mt-2 text-3xl font-bold">
            {resumeWordCount ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-5 text-center">
          <p className="text-sm text-slate-500">
            Job Description Words
          </p>

          <p className="mt-2 text-3xl font-bold">
            {jobWordCount ?? 0}
          </p>
        </div>

        <div className="rounded-xl bg-slate-50 p-5 text-center">
          <p className="text-sm text-slate-500">
            Shared Words
          </p>

          <p className="mt-2 text-3xl font-bold">
            {sharedWordCount ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <ListCard
          title="Shared Keywords"
          items={sharedWords}
        />

        <ListCard
          title="Missing Keywords"
          items={missingWords}
        />

        <ListCard
          title="Matched Skills"
          items={matchedSkills}
        />

        <ListCard
          title="Missing Skills"
          items={missingSkills}
        />

        <ListCard
          title="Resume Skills"
          items={resumeSkills}
        />

        <ListCard
          title="Job Skills"
          items={jobSkills}
        />
      </div>
    </div>
  );
}

function ListCard({
  title,
  items,
}: {
  title: string;
  items: string[];
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-5">
      <h4 className="font-semibold text-slate-900">
        {title}
      </h4>

      <div className="mt-4 flex flex-wrap gap-2">
        {items.length > 0 ? (
          items.map((item) => (
            <span
              key={item}
              className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700"
            >
              {item}
            </span>
          ))
        ) : (
          <p className="text-sm text-slate-500">
            None detected.
          </p>
        )}
      </div>
    </div>
  );
}