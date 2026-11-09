import { useEffect, useState } from 'react';
import { Plus, Trash2, Save, FilePlus2 } from 'lucide-react';
import { createCandidateQuestions } from '../../services/questionBankService';

const createEmptyQuestion = () => ({
  id: crypto.randomUUID(),
  question: '',
  difficulty: 'INTERMEDIATE',
  expectedAnswer: '',
});

function ManualQuestionForm({ selectedTopic, disabled = false }) {
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

    // Automatically hide success response after 5 seconds
  useEffect(() => {
    if (!result) {
      return;
    }

    const timer = setTimeout(() => {
      setResult(null);
    }, 2000);

    return () => clearTimeout(timer);
  }, [result]);

  const handleQuestionChange = (id, field, value) => {
    setQuestions((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );

    setError('');
    setResult(null);
  };

  const handleAddQuestion = () => {
    setQuestions((previous) => [
      ...previous,
      createEmptyQuestion(),
    ]);
  };

  const handleRemoveQuestion = (id) => {
    if (questions.length === 1) {
      return;
    }

    setQuestions((previous) =>
      previous.filter((item) => item.id !== id)
    );

    setResult(null);
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) {
      return;
    }

    if (!selectedTopic) {
      setError('Please select a technical topic first.');
      return;
    }

    const candidateId = localStorage.getItem(
      'interview_roulette_candidate_id'
    );

    if (!candidateId) {
      setError('Candidate ID not found. Please revisit the Welcome Screen.');
      return;
    }

    const validQuestions = questions.filter(
      (item) => item.question.trim()
    );

    if (validQuestions.length === 0) {
      setError('Please enter at least one question.');
      return;
    }

    const payload = validQuestions.map((item) => ({
      question: item.question.trim(),
      difficulty: item.difficulty || null,
      expectedAnswer: item.expectedAnswer.trim() || null,
    }));

    try {
      setSubmitting(true);
      setError('');
      setResult(null);

      const response = await createCandidateQuestions(
        candidateId,
        Number(selectedTopic),
        payload
      );

      setResult(response);
      setQuestions([createEmptyQuestion()]);

    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Unable to create questions.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-7">

      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
          <FilePlus2 size={25} />
        </div>

        <div>
          <h2 className="text-xl font-semibold">
            Create Questions Manually
          </h2>

          <p className="mt-1 text-sm text-slate-400">
            Add one or multiple interview questions for your selected topic.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>

        <div className="mb-5 flex items-center justify-between">
          <p className="text-sm font-medium text-slate-300">
            Questions ({questions.length})
          </p>

          <button
            type="button"
            onClick={handleAddQuestion}
            disabled={disabled || submitting}
            className="flex items-center gap-2 rounded-lg border border-indigo-500/40 px-3 py-2 text-sm font-medium text-indigo-400 transition hover:bg-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={17} />
            Add Another Question
          </button>
        </div>

        <div className="space-y-6">

          {questions.map((item, index) => (
            <div
              key={item.id}
              className="rounded-xl border border-slate-700 bg-slate-800/50 p-5"
            >

              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-white">
                  Question {index + 1}
                </h3>

                {questions.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveQuestion(item.id)}
                    disabled={disabled || submitting}
                    className="flex items-center gap-1 text-sm text-red-400 transition hover:text-red-300 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                )}
              </div>

              <div className="space-y-4">

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Question <span className="text-red-400">*</span>
                  </label>

                  <textarea
                    value={item.question}
                    onChange={(event) =>
                      handleQuestionChange(
                        item.id,
                        'question',
                        event.target.value
                      )
                    }
                    placeholder="Enter your interview question..."
                    rows={3}
                    maxLength={10000}
                    required
                    disabled={disabled || submitting}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Difficulty
                  </label>

                  <select
                    value={item.difficulty}
                    onChange={(event) =>
                      handleQuestionChange(
                        item.id,
                        'difficulty',
                        event.target.value
                      )
                    }
                    disabled={disabled || submitting}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none focus:border-indigo-500 disabled:opacity-50"
                  >
                    <option value="BEGINNER">Beginner</option>
                    <option value="INTERMEDIATE">Intermediate</option>
                    <option value="ADVANCED">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-slate-300">
                    Expected Answer
                    <span className="ml-2 text-slate-500">(Optional)</span>
                  </label>

                  <textarea
                    value={item.expectedAnswer}
                    onChange={(event) =>
                      handleQuestionChange(
                        item.id,
                        'expectedAnswer',
                        event.target.value
                      )
                    }
                    placeholder="Enter the expected answer..."
                    rows={3}
                    maxLength={20000}
                    disabled={disabled || submitting}
                    className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-indigo-500 disabled:opacity-50"
                  />
                </div>

              </div>
            </div>
          ))}

        </div>

        {error && (
          <div className="mt-5 rounded-xl border border-red-800 bg-red-500/10 p-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-5 rounded-xl border border-green-800 bg-green-500/10 p-5">

            <p className="font-semibold text-green-400">
              Questions submitted successfully!
            </p>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">

              <div>
                <p className="text-slate-400">Total</p>
                <p className="mt-1 text-lg font-semibold">
                  {result.totalQuestions}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Valid</p>
                <p className="mt-1 text-lg font-semibold">
                  {result.validQuestions}
                </p>
              </div>

              <div>
                <p className="text-slate-400">New Questions</p>
                <p className="mt-1 text-lg font-semibold text-green-400">
                  {result.newQuestions}
                </p>
              </div>

              <div>
                <p className="text-slate-400">Duplicates</p>
                <p className="mt-1 text-lg font-semibold">
                  {result.duplicateQuestions}
                </p>
              </div>

            </div>

          </div>
        )}

        <button
          type="submit"
          disabled={disabled || submitting || !selectedTopic}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save size={18} />

          {submitting
            ? 'Saving Questions...'
            : 'Save Questions'}
        </button>

      </form>
    </section>
  );
}

export default ManualQuestionForm;