
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle,
  Clock,
  Target,
  ListChecks,
  ArrowLeft,
} from 'lucide-react';

import { getSessionStatistics } from '../services/practiceService';

function Completion() {
  const navigate = useNavigate();

  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const candidateId = localStorage.getItem(
    'interview_roulette_candidate_id'
  );

  const savedSession = localStorage.getItem(
    'interview_roulette_active_session'
  );

  const session = savedSession ? JSON.parse(savedSession) : null;

  useEffect(() => {
    const fetchStatistics = async () => {
      if (!candidateId || !session?.sessionId) {
        setError('Practice session information not found.');
        setLoading(false);
        return;
      }

      try {
        const response = await getSessionStatistics(
          session.sessionId,
          candidateId
        );

        setStatistics(response);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Unable to load practice statistics.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const formatDuration = (totalSeconds = 0) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }

    return `${minutes}m ${seconds}s`;
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        Loading your practice summary...
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-slate-950 p-6 text-center text-white">
        <p className="text-red-400">
          {error || 'Statistics are unavailable.'}
        </p>

        <button
          onClick={() => navigate('/dashboard')}
          className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold hover:bg-indigo-500"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const completionPercentage = Number(
    statistics.completionPercentage || 0
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-5xl px-6 py-5">
          <h1 className="text-xl font-bold">
            Interview Roulette
          </h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10 text-center">
          <CheckCircle
            size={64}
            className="mx-auto mb-5 text-green-400"
          />

          <h2 className="text-3xl font-bold">
            Practice Round Completed!
          </h2>

          <p className="mt-3 text-slate-400">
            Great work! Here is your practice summary.
          </p>

          <p className="mt-2 text-sm text-indigo-400">
            {session.topicName} · Round {session.roundNumber}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <StatCard
            icon={<Target size={22} />}
            label="Unique Questions"
            value={statistics.uniqueQuestions}
          />

          <StatCard
            icon={<CheckCircle size={22} />}
            label="Completed Attempts"
            value={statistics.completedAttempts}
          />

          <StatCard
            icon={<ListChecks size={22} />}
            label="Skipped Attempts"
            value={statistics.skippedAttempts}
          />

          <StatCard
            icon={<Clock size={22} />}
            label="Total Solving Time"
            value={formatDuration(statistics.totalDurationSeconds)}
          />

          <StatCard
            icon={<Clock size={22} />}
            label="Average Solving Time"
            value={formatDuration(
              Math.round(statistics.averageDurationSeconds || 0)
            )}
          />

          <StatCard
            icon={<Target size={22} />}
            label="Completion Percentage"
            value={`${completionPercentage.toFixed(1)}%`}
          />
        </div>

        <div className="mt-10 rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-semibold">
              Round Progress
            </span>

            <span className="font-bold text-indigo-400">
              {completionPercentage.toFixed(1)}%
            </span>
          </div>

          <div className="h-3 overflow-hidden rounded-full bg-slate-700">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all"
              style={{
                width: `${Math.min(100, Math.max(0, completionPercentage))}%`,
              }}
            />
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-6 py-3 font-semibold transition hover:bg-slate-700"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-4 flex items-center gap-3 text-indigo-400">
        {icon}
        <span className="text-sm text-slate-400">{label}</span>
      </div>

      <p className="text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}

export default Completion;
