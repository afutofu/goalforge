import axios from 'axios';

export const api = axios.create({
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
