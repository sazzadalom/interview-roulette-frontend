
import { useState } from 'react';
import { ArrowRight, Code2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Welcome() {
  const navigate = useNavigate();
  const [name, setName] = useState(
    localStorage.getItem('interview_roulette_candidate_name') || ''
  );

  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const displayName = name.trim();

    if (!displayName) {
      setError('Please enter your name to continue.');
      return;
    }

    let candidateId = localStorage.getItem(
      'interview_roulette_candidate_id'
    );

    if (!candidateId) {
      candidateId = crypto.randomUUID();

      localStorage.setItem(
        'interview_roulette_candidate_id',
        candidateId
      );
    }

    localStorage.setItem(
      'interview_roulette_candidate_name',
      displayName
    );

    setName(displayName);
    setError('');
    // setSubmitted(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4 py-12">

      <div className="w-full max-w-lg">

        <div className="flex items-center justify-center gap-3 mb-10">
          <div className="rounded-xl bg-indigo-600 p-3">
            <Code2 size={28} />
          </div>

          <span className="text-2xl font-bold tracking-tight">
            Interview Roulette
          </span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

          <div className="mb-8 text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-400">
              <Sparkles size={28} />
            </div>

            <h1 className="mb-3 text-3xl font-bold">
              Welcome, Candidate!
            </h1>

            <p className="text-slate-400 leading-relaxed">
              Prepare for your next technical interview.
              Practice questions, improve your knowledge,
              and track your progress.
            </p>

          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit}>

              <label className="mb-2 block text-sm font-medium text-slate-300">
                What should we call you?
              </label>

              <input
                type="text"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  setError('');
                }}
                placeholder="Enter your name"
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              />

              {error && (
                <p className="mt-2 text-sm text-red-400">
                  {error}
                </p>
              )}

              <button
                type="submit"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500"
              >
                Start Practicing
                <ArrowRight size={18} />
              </button>

            </form>
          ) : (
            <div className="text-center">

              <p className="mb-4 text-lg font-semibold text-green-400">
                Your profile is ready, {name}!
              </p>

              <p className="text-sm text-slate-400">
                Your candidate ID has been saved.
                We'll connect you to the dashboard in the next step.
              </p>

            </div>
          )}

        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          Built for developers preparing for technical interviews.
        </p>

      </div>
    </div>
  );
}

export default Welcome;
