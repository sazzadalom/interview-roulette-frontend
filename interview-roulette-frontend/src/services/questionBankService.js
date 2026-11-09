
import { questionBankApi } from './api';

// Get all active topics
export const getActiveTopics = async () => {
  const response = await questionBankApi.get('/api/v1/topics');
  return response.data;
};

// Get a topic by ID
export const getTopicById = async (topicId) => {
  const response = await questionBankApi.get(`/api/v1/topics/${topicId}`);
  return response.data;
};

// Get all questions belonging to a topic
export const getQuestionsByTopic = async (topicId) => {
  const response = await questionBankApi.get(
    `/api/v1/topics/${topicId}/questions`
  );
  return response.data;
};

// Get a question by ID
export const getQuestionById = async (questionId) => {
  const response = await questionBankApi.get(
    `/api/v1/questions/${questionId}`
  );
  return response.data;
};

// Get questions uploaded by a particular candidate for a topic
export const getCandidateQuestionsByTopic = async (candidateId, topicId) => {
  const response = await questionBankApi.get(
    `/api/v1/candidates/${candidateId}/topics/${topicId}/questions`
  );
  return response.data;
};


// Upload Excel questions
export const uploadQuestionsExcel = async (file, candidateId, topicId) => {
  const formData = new FormData();

  formData.append('file', file);
  formData.append('candidateId', candidateId);

  if (topicId !== undefined && topicId !== null) {
    formData.append('topicId', topicId);
  }

  const response = await questionBankApi.post(
    '/api/v1/question-uploads/excel',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data;
};

// Create one or multiple questions manually
export const createCandidateQuestions = async (
  candidateId,
  topicId,
  questions
) => {
  const response = await questionBankApi.post('/api/v1/questions/bulk', {
    candidateId,
    topicId,
    questions,
  });

  return response.data;
};

