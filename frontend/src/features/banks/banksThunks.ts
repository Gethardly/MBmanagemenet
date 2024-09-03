import { createAsyncThunk } from '@reduxjs/toolkit';
import { Bank } from '../../types';
import axiosApi from '../../axios';

export const getBanks = createAsyncThunk<Bank[]>('banks/getAll', async () => {
  try {
    const response = await axiosApi.get('/banks');
    return response.data
  } catch (e) {
    return e;
  }
})