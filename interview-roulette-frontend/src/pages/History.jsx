
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  History as HistoryIcon,
  Clock,
  BookOpen,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';

import { getPracticeHistory } from '../services/practiceService';

function History() {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const candidateId = localStorage.getItem(
    'interview_roulette_candidate_id'
  );

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    if (!candidateId) {
      setError('Candidate information not found. Please log in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError('');

      const response = await getPracticeHistory(candidateId);

      setSessions(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        'Unable to load practice history.'
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not available';

    return new Date(date).toLocaleString();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500/10 text-green-400';

      case 'ACTIVE':
        return 'bg-indigo-500/10 text-indigo-400';

      case 'PAUSED':
        return 'bg-yellow-500/10 text-yellow-400';

      default:
        return 'bg-slate-700 text-slate-300';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-6 py-5">

          <div className="rounded-lg bg-indigo-600 p-2">
            <HistoryIcon size={23} />
          </div>

          <h1 className="text-xl font-bold">
            Interview Roulette
          </h1>

        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

          <div>
            <p className="text-sm font-medium text-indigo-400">
              YOUR ACTIVITY
            </p>

            <h2 className="mt-1 text-3xl font-bold">
              Practice History
            </h2>

            <p className="mt-2 text-slate-400">
              Review your previous practice sessions.
            </p>
          </div>

          <button
            onClick={fetchHistory}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold transition hover:bg-slate-700 disabled:opacity-50"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

        </div>

        {loading ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center text-slate-400">
            Loading practice history...
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-center text-red-400">
            {error}
          </div>
        ) : sessions.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-12 text-center">

            <HistoryIcon
              size={45}
              className="mx-auto mb-5 text-slate-500"
            />

            <h3 className="text-xl font-semibold">
              No Practice History Yet
            </h3>

            <p className="mt-2 text-slate-400">
              Your practice sessions will appear here.
            </p>

          </div>
        ) : (
          <div className="space-y-4">

            <p className="text-sm text-slate-400">
              {sessions.length} practice session(s) found
            </p>

            {sessions.map((session) => (
              <div
                key={session.sessionId}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >

                <div className="flex flex-wrap items-start justify-between gap-4">

                  <div>
                    <div className="mb-2 flex items-center gap-2 text-indigo-400">
                      <BookOpen size={18} />

                      <span className="text-sm font-medium">
                        {session.topicName || 'Unknown Topic'}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold">
                      Round {session.roundNumber}
                    </h3>
                  </div>

                  <span
                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${getStatusStyle(session.status)}`}
                  >
                    {session.status}
                  </span>

                </div>

                <div className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-400">

                  <div className="flex items-center gap-2">
                    <Clock size={16} />

                    <span>
                      Started: {formatDate(session.startedAt)}
                    </span>
                  </div>

                  {session.completedAt && (
                    <div className="flex items-center gap-2">
                      <Clock size={16} />

                      <span>
                        Completed: {formatDate(session.completedAt)}
                      </span>
                    </div>
                  )}

                </div>

              </div>
            ))}

          </div>
        )}

        <div className="mt-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800 px-5 py-3 font-semibold transition hover:bg-slate-700"
          >
            <ArrowLeft size={18} />
            Back to Dashboard
          </button>
        </div>

      </main>
    </div>
  );
}

export default History;