
import { practiceApi } from './api';

// Start or resume practice for a topic
export const startPractice = async (candidateId, topicId) => {
  const response = await practiceApi.post('/api/v1/practice/sessions', {
    candidateId,
    topicId,
  });

  return response.data;
};

// Get the next question
export const getNextQuestion = async (sessionId, candidateId) => {
  const response = await practiceApi.get(
    `/api/v1/practice/sessions/${sessionId}/next-question`,
    {
      params: { candidateId },
    }
  );

  return response.data;
};

// Mark a question as completed
export const completeQuestion = async (
  sessionId,
  attemptId,
  candidateId
) => {
  const response = await practiceApi.post(
    `/api/v1/practice/sessions/${sessionId}/attempts/${attemptId}/complete`,
    null,
    {
      params: { candidateId },
    }
  );

  return response.data;
};

// Skip a question
export const skipQuestion = async (
  sessionId,
  attemptId,
  candidateId
) => {
  const response = await practiceApi.post(
    `/api/v1/practice/sessions/${sessionId}/attempts/${attemptId}/skip`,
    null,
    {
      params: { candidateId },
    }
  );

  return response.data;
};

// Start a new round
export const startNewRound = async (sessionId, candidateId) => {
  const response = await practiceApi.post(
    `/api/v1/practice/sessions/${sessionId}/new-round`,
    null,
    {
      params: { candidateId },
    }
  );

  return response.data;
};

// Get candidate practice history
export const getPracticeHistory = async (candidateId) => {
  const response = await practiceApi.get('/api/v1/practice/sessions', {
    params: { candidateId },
  });

  return response.data;
};

// Get statistics for a session
export const getSessionStatistics = async (sessionId, candidateId) => {
  const response = await practiceApi.get(
    `/api/v1/practice/statistics/${sessionId}`,
    {
      params: { candidateId },
    }
  );

  return response.data;
};
/*
// Get overall candidate statistics, optionally filtered by topic
export const getCandidateStatistics = async (candidateId, topicId) => {
  const response = await practiceApi.get(
    `/api/v1/practice/statistics/candidate/${candidateId}`,
    {
      params: topicId ? { topicId } : {},
    }
  );

  return response.data;
};
*/