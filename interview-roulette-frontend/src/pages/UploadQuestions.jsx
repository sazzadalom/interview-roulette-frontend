
import { useEffect, useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertCircle,
  LoaderCircle,
  ArrowLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getActiveTopics, uploadQuestionsExcel } from '../services/questionBankService';

function UploadQuestions() {
  const navigate = useNavigate();

  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [uploadResult, setUploadResult] = useState(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await getActiveTopics();
        setTopics(response.filter((topic) => topic.active));
      } catch (err) {
        setError('Unable to load topics. Please try again.');
      } finally {
        setLoadingTopics(false);
      }
    };

    fetchTopics();
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    setError('');
    setUploadResult(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.toLowerCase().endsWith('.xlsx')) {
      setSelectedFile(null);
      setError('Only Excel (.xlsx) files are supported.');
      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async (event) => {
    event.preventDefault();

    setError('');
    setUploadResult(null);

    const candidateId = localStorage.getItem(
      'interview_roulette_candidate_id'
    );

    if (!candidateId) {
      setError('Candidate information not found. Please return to the welcome page.');
      return;
    }

    if (!selectedTopicId) {
      setError('Please select a topic.');
      return;
    }

    if (!selectedFile) {
      setError('Please select an Excel file.');
      return;
    }

    try {
      setUploading(true);

      const result = await uploadQuestionsExcel(
        selectedFile,
        candidateId,
        selectedTopicId
      );

      setUploadResult(result);
      setSelectedFile(null);

      const fileInput = document.getElementById('excel-file');
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'Excel upload failed. Please try again.';

      setError(message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="mb-8">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
            <Upload size={24} />
          </div>

          <h1 className="text-2xl font-bold text-slate-900">
            Upload Interview Questions
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            Upload your Excel question bank and contribute questions to the
            shared question bank.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">

          <form onSubmit={handleUpload} className="space-y-6">

            <div>
              <label
                htmlFor="topic"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Select Topic <span className="text-red-500">*</span>
              </label>

              <select
                id="topic"
                value={selectedTopicId}
                onChange={(event) => {
                  setSelectedTopicId(event.target.value);
                  setUploadResult(null);
                  setError('');
                }}
                disabled={loadingTopics || uploading}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100"
                required
              >
                <option value="">
                  {loadingTopics ? 'Loading topics...' : 'Choose a topic'}
                </option>

                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="excel-file"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Excel File <span className="text-red-500">*</span>
              </label>

              <label
                htmlFor="excel-file"
                className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-indigo-400 hover:bg-indigo-50"
              >
                <FileSpreadsheet
                  size={36}
                  className="mb-3 text-indigo-500"
                />

                <span className="text-sm font-semibold text-slate-700">
                  {selectedFile
                    ? selectedFile.name
                    : 'Choose an Excel file'}
                </span>

                <span className="mt-2 text-xs text-slate-500">
                  Supported format: .xlsx
                </span>

                <input
                  id="excel-file"
                  type="file"
                  accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  onChange={handleFileChange}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle size={20} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={uploading || loadingTopics || topics.length === 0}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <LoaderCircle size={19} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={19} />
                  Upload Questions
                </>
              )}
            </button>
          </form>
        </div>

        {uploadResult && (
          <div className="mt-6 rounded-2xl border border-green-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-5 flex items-center gap-3">
              <CheckCircle size={25} className="text-green-600" />

              <div>
                <h2 className="font-bold text-slate-900">
                  Upload Completed
                </h2>
                <p className="text-sm text-slate-500">
                  {uploadResult.filename}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Total Rows</p>
                <p className="mt-1 text-2xl font-bold text-slate-900">
                  {uploadResult.totalRows}
                </p>
              </div>

              <div className="rounded-lg bg-green-50 p-4">
                <p className="text-xs text-green-700">New Questions</p>
                <p className="mt-1 text-2xl font-bold text-green-700">
                  {uploadResult.newQuestions}
                </p>
              </div>

              <div className="rounded-lg bg-amber-50 p-4">
                <p className="text-xs text-amber-700">Duplicates</p>
                <p className="mt-1 text-2xl font-bold text-amber-700">
                  {uploadResult.duplicateQuestions}
                </p>
              </div>

              <div className="rounded-lg bg-red-50 p-4">
                <p className="text-xs text-red-700">Invalid Rows</p>
                <p className="mt-1 text-2xl font-bold text-red-700">
                  {uploadResult.invalidRows}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-slate-600">
              <p>
                <strong>Valid rows:</strong> {uploadResult.validRows}
              </p>
              <p>
                <strong>Status:</strong> {uploadResult.status}
              </p>
              <p className="break-all">
                <strong>Upload Batch ID:</strong> {uploadResult.uploadBatchId}
              </p>
            </div>

            {uploadResult.invalidRowDetails?.length > 0 && (
              <div className="mt-5 rounded-lg bg-red-50 p-4">
                <h3 className="mb-2 font-semibold text-red-800">
                  Invalid Row Details
                </h3>

                <ul className="list-inside list-disc space-y-1 text-sm text-red-700">
                  {uploadResult.invalidRowDetails.map((detail, index) => (
                    <li key={index}>
                      {typeof detail === 'string'
                        ? detail
                        : JSON.stringify(detail)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default UploadQuestions;
