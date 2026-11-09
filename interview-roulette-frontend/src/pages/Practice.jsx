
import { useEffect, useState } from 'react';
import { Clock, CheckCircle, SkipForward, Code2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useTimer from '../hooks/useTimer';

import {
  getNextQuestion,
  completeQuestion,
  skipQuestion,
} from '../services/practiceService';

function Practice() {
    const navigate = useNavigate();
  const [session, setSession] = useState(() => {
    const savedSession = localStorage.getItem(
      'interview_roulette_active_session'
    );

    return savedSession ? JSON.parse(savedSession) : null;
  });

  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [finished, setFinished] = useState(false);

  const { formattedTime } = useTimer(question?.startedAt);

  const candidateId = localStorage.getItem(
    'interview_roulette_candidate_id'
  );

  const fetchNextQuestion = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await getNextQuestion(
        session.sessionId,
        candidateId
      );

      if (!response) {
        setQuestion(null);
        setFinished(true);
        navigate('/completion');
        return;
      }

      setQuestion(response);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to load the next question.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!session || !candidateId) {
      setLoading(false);
      setError('Practice session not found. Please start a session first.');
      return;
    }

    fetchNextQuestion();
  }, []);

  const handleAction = async (action) => {
    if (!question || processing) return;

    try {
      setProcessing(true);
      setError('');

      if (action === 'complete') {
        await completeQuestion(
          session.sessionId,
          question.attemptId,
          candidateId
        );
      } else {
        await skipQuestion(
          session.sessionId,
          question.attemptId,
          candidateId
        );
      }

      await fetchNextQuestion();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to process this question.'
      );
    } finally {
      setProcessing(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-950 p-8 text-center text-white">
        <p>{error || 'No active practice session found.'}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-5">
          <div className="rounded-lg bg-indigo-600 p-2">
            <Code2 size={24} />
          </div>

          <span className="text-xl font-bold">
            Interview Roulette
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div>
            <p className="text-sm text-indigo-400">
              PRACTICE SESSION
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              {session.topicName}
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Round {session.roundNumber} · Question practice
            </p>
          </div>

          {question && (
            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-900 px-5 py-3">
              <Clock size={19} className="text-indigo-400" />

              <span className="font-mono text-xl font-semibold tabular-nums">
                {formattedTime}
              </span>
            </div>
          )}

        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">
            <p className="text-slate-400">
              Loading question...
            </p>
          </div>
        ) : finished ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

            <CheckCircle
              size={48}
              className="mx-auto mb-5 text-green-400"
            />

            <h2 className="mb-3 text-2xl font-bold">
              Practice Round Completed!
            </h2>

            <p className="text-slate-400">
              You have completed all eligible questions in this round.
            </p>

            <p className="mt-3 text-sm text-slate-500">
              You can start a new round from the dashboard.
            </p>

          </div>
        ) : question ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">

              <span className="rounded-lg bg-indigo-500/10 px-3 py-2 text-sm font-medium text-indigo-400">
                Question #{question.attemptSequence}
              </span>

              <span className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300">
                {question.difficulty || 'Difficulty not specified'}
              </span>

            </div>

            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Interview Question
            </h2>

            <p className="whitespace-pre-wrap text-xl font-medium leading-relaxed">
              {question.questionText}
            </p>

            <div className="my-8 border-t border-slate-800" />

            <div className="flex flex-col gap-4 sm:flex-row">

              <button
                onClick={() => handleAction('complete')}
                disabled={processing}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-3 font-semibold transition hover:bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <CheckCircle size={19} />
                {processing ? 'Please wait...' : 'Mark as Completed'}
              </button>

              <button
                onClick={() => handleAction('skip')}
                disabled={processing}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <SkipForward size={19} />
                Skip Question
              </button>

            </div>

          </div>
        ) : null}

        {error && (
          <div className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

      </main>
    </div>
  );
}

export default Practice;
