import axios, { InternalAxiosRequestConfig } from 'axios';
import { RootState } from './app/store';
import { Store } from '@reduxjs/toolkit';
import { configDotenv } from 'dotenv';

configDotenv();
const axiosApi = axios.create({
  baseURL: process.env.API,
});

export const addInterceptors = (store: Store<RootState>) => {
  axiosApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    const token = store.getState().users.user?.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  });
};

export default axiosApi;
