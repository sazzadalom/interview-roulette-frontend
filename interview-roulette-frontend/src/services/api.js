
import axios from 'axios';

const questionBankApi = axios.create({
  baseURL: import.meta.env.VITE_QUESTION_BANK_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

const practiceApi = axios.create({
  baseURL: import.meta.env.VITE_PRACTICE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

export { questionBankApi, practiceApi };
