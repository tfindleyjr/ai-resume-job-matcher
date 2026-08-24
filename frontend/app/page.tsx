export default function Home() {
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
            Compare your resume against a job description, identify matching
            skills, uncover missing qualifications, and improve your chances of
            getting noticed.
          </p>
        </header>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-semibold text-blue-600">
                STEP 1
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                Add Your Resume
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Paste your resume text below. PDF upload will be added in a
                later phase.
              </p>
            </div>

            <textarea
              placeholder="Paste your resume here..."
              className="min-h-[320px] w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-sm font-semibold text-blue-600">
                STEP 2
              </p>

              <h2 className="mt-1 text-2xl font-semibold text-slate-900">
                Add the Job Description
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Paste the description of the position you want to compare
                against.
              </p>
            </div>

            <textarea
              placeholder="Paste the job description here..."
              className="min-h-[320px] w-full resize-none rounded-xl border border-slate-300 bg-white p-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />
          </div>
        </section>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            className="w-full rounded-xl bg-blue-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700 md:w-auto md:min-w-[240px]"
          >
            Analyze Match
          </button>
        </div>

        <section className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-400">
            Analysis Results
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-slate-900">
            Your match results will appear here.
          </h2>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Once the analysis engine is connected, this section will display
            your match score, matched skills, missing skills, and resume
            recommendations.
          </p>
        </section>
      </div>
    </main>
  );
}