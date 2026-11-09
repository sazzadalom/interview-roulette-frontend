
import { useEffect, useState } from 'react';
import ManualQuestionForm from '../components/dashboard/ManualQuestionForm';

import {
  BookOpen,
  Code2,
  Play,
  LogOut,
  History,
  Upload,
  FileSpreadsheet,
} from 'lucide-react';

import {
  getActiveTopics,
  uploadQuestionsExcel,
} from '../services/questionBankService';

import { startPractice } from '../services/practiceService';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();

  const [name] = useState(
    localStorage.getItem('interview_roulette_candidate_name') || 'Candidate'
  );

  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('');

  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  const [error, setError] = useState('');
  const [uploadError, setUploadError] = useState('');

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [session, setSession] = useState(null);

  // Load active topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const data = await getActiveTopics();

        setTopics(data);

        if (data.length > 0) {
          setSelectedTopic(String(data[0].id));
        }
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          'Unable to load topics.'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  // Handle topic selection
  const handleTopicChange = (event) => {
    setSelectedTopic(event.target.value);
    setSession(null);
    setSelectedFile(null);
    setUploadResult(null);
    setUploadError('');
    setError('');
  };

  // Handle Excel file selection
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setSelectedFile(null);
    setUploadResult(null);
    setUploadError('');

    if (!file) {
      return;
    }

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setUploadError('Only .xlsx Excel files are supported.');
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  // Start practice and upload questions if a file is selected
  const handleStartPractice = async () => {
    if (starting) {
      return;
    }

    if (!selectedTopic) {
      setError('Please select a topic.');
      return;
    }

    const candidateId = localStorage.getItem(
      'interview_roulette_candidate_id'
    );

    if (!candidateId) {
      setError('Candidate ID not found. Please revisit the Welcome Screen.');
      return;
    }

    try {
      setStarting(true);
      setError('');
      setUploadError('');
      setUploadResult(null);

      // Step 1: Upload Excel file if the candidate selected one
      if (selectedFile) {
        const uploadResponse = await uploadQuestionsExcel(
          selectedFile,
          candidateId,
          Number(selectedTopic)
        );

        setUploadResult(uploadResponse);
      }

      // Step 2: Start practice
      const response = await startPractice(
        candidateId,
        Number(selectedTopic)
      );

      // Step 3: Save active session
      localStorage.setItem(
        'interview_roulette_active_session',
        JSON.stringify(response)
      );

      setSession(response);

      // Step 4: Navigate to practice screen
      navigate('/practice');

    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.message ||
        'Unable to start practice.';

      if (selectedFile) {
        setUploadError(message);
      } else {
        setError(message);
      }
    } finally {
      setStarting(false);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem('interview_roulette_candidate_id');
    localStorage.removeItem('interview_roulette_candidate_name');
    localStorage.removeItem('interview_roulette_active_session');

    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* Header */}

      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-600 p-2">
              <Code2 size={24} />
            </div>

            <span className="text-xl font-bold">
              Interview Roulette
            </span>
          </div>

          <div className="flex items-center gap-3">

            <button
              onClick={() => navigate('/history')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <History size={17} />
              Practice History
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition hover:bg-slate-800 hover:text-white"
            >
              <LogOut size={17} />
              Logout
            </button>

          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-10">

        {/* Welcome Section */}

        <section className="mb-10">
          <p className="mb-2 text-sm font-medium text-indigo-400">
            CANDIDATE DASHBOARD
          </p>

          <h1 className="text-3xl font-bold">
            Welcome back, {name}!
          </h1>

          <p className="mt-3 text-slate-400">
            Choose a technical topic, optionally upload your own questions,
            and start your interview preparation.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">

          {/* Topic Selection and Optional Upload */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
              <BookOpen size={25} />
            </div>

            <h2 className="mb-2 text-xl font-semibold">
              Choose Your Topic
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Select a technical topic. You can optionally upload your own
              questions before starting practice.
            </p>

            {loading ? (
              <p className="text-slate-400">
                Loading topics...
              </p>
            ) : topics.length === 0 ? (
              <p className="text-slate-400">
                No active topics are currently available.
              </p>
            ) : (
              <>

                {/* Topic Dropdown */}

                <label className="mb-2 block text-sm text-slate-300">
                  Technical Topic
                </label>

                <select
                  value={selectedTopic}
                  onChange={handleTopicChange}
                  disabled={starting}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none focus:border-indigo-500 disabled:opacity-50"
                >
                  {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>

                {/* Optional Excel Upload */}

                <div className="mt-7 border-t border-slate-800 pt-6">

                  <div className="mb-3 flex items-center gap-2">

                    <Upload size={19} className="text-indigo-400" />

                    <h3 className="font-semibold">
                      Upload Your Own Questions
                    </h3>

                    <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-400">
                      Optional
                    </span>

                  </div>

                  <p className="mb-4 text-sm leading-relaxed text-slate-400">
                    Upload your own interview questions using an Excel file.
                    If you do not upload a file, you can practise using the
                    shared question bank.
                  </p>

                  <label className="mb-2 block text-sm text-slate-300">
                    Excel Question File (.xlsx)
                  </label>

                  <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/50 p-4">

                    <input
                      type="file"
                      accept=".xlsx"
                      onChange={handleFileChange}
                      disabled={starting}
                      className="block w-full text-sm text-slate-400 file:mr-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:px-4 file:py-2 file:font-medium file:text-white hover:file:bg-indigo-500 disabled:opacity-50"
                    />

                    {selectedFile && (
                      <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                        <FileSpreadsheet size={17} />

                        <span className="break-all">
                          {selectedFile.name}
                        </span>
                      </div>
                    )}

                  </div>

                  {uploadError && (
                    <p className="mt-3 text-sm text-red-400">
                      {uploadError}
                    </p>
                  )}

                  {uploadResult && (
                    <div className="mt-4 rounded-xl border border-green-800 bg-green-500/10 p-4">

                      <p className="font-semibold text-green-400">
                        Questions uploaded successfully!
                      </p>

                      <div className="mt-3 grid grid-cols-2 gap-3 text-sm">

                        <div>
                          <p className="text-slate-400">Total Rows</p>
                          <p className="font-semibold">
                            {uploadResult.totalRows}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-400">Valid Rows</p>
                          <p className="font-semibold">
                            {uploadResult.validRows}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-400">New Questions</p>
                          <p className="font-semibold text-green-400">
                            {uploadResult.newQuestions}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-400">Duplicates</p>
                          <p className="font-semibold">
                            {uploadResult.duplicateQuestions}
                          </p>
                        </div>

                        <div>
                          <p className="text-slate-400">Invalid Rows</p>
                          <p className="font-semibold">
                            {uploadResult.invalidRows}
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                </div>

                {/* Start Practice */}

                <button
                  onClick={handleStartPractice}
                  disabled={starting || !selectedTopic}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Play size={18} />

                  {starting
                    ? 'Preparing Your Practice...'
                    : 'Start Practice'}

                </button>

              </>
            )}

            {error && (
              <p className="mt-4 text-sm text-red-400">
                {error}
              </p>
            )}

          </div>

          {/* Practice Session Details */}

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-7">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
              <Code2 size={25} />
            </div>

            <h2 className="mb-2 text-xl font-semibold">
              Your Practice Session
            </h2>

            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Your selected topic and current practice session details.
            </p>

            {session ? (
              <div className="space-y-3 text-sm">

                <div className="rounded-lg bg-slate-800 p-4">
                  <p className="text-slate-400">Topic</p>
                  <p className="mt-1 font-semibold">
                    {session.topicName}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-800 p-4">
                  <p className="text-slate-400">Session Status</p>
                  <p className="mt-1 font-semibold text-green-400">
                    {session.status}
                  </p>
                </div>

                <div className="rounded-lg bg-slate-800 p-4">
                  <p className="text-slate-400">Practice Round</p>
                  <p className="mt-1 font-semibold">
                    Round {session.roundNumber}
                  </p>
                </div>

                <p className="break-all text-xs text-slate-500">
                  Session ID: {session.sessionId}
                </p>

              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 p-8 text-center">

                <p className="text-slate-400">
                  No session started yet.
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  Select a topic to begin.
                </p>

              </div>
            )}

          </div>

        </section>
        {!loading && topics.length > 0 && (
            <ManualQuestionForm
              selectedTopic={selectedTopic}
              disabled={starting}
            />
        )}
        <p className="mt-8 text-sm text-slate-500">
          Available technical topics: {topics.length}
        </p>

      </main>
    </div>
  );
}

export default Dashboard;