import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    'x-auth-token':
      typeof localStorage !== 'undefined'
        ? localStorage?.getItem('userToken') ?? ''
        : '',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userToken');
  config.headers['x-auth-token'] = token;
  return config;
});

export { api };
