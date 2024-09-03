import { Bank } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { getBanks } from './banksThunks';
import { RootState } from '../../app/store';

interface BanksState {
  loading: boolean,
  banks: Bank[],
}

const initialState: BanksState = {
  loading: false,
  banks: [],
}

const banksSlice = createSlice({
  name: 'banks',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getBanks.pending, (state, {payload}) => {
      state.loading = true;
    });
    builder.addCase(getBanks.fulfilled, (state, {payload}) => {
      state.banks = payload;
      state.loading = false;
    });
    builder.addCase(getBanks.rejected, (state, {payload}) => {
      state.loading = false;
      state.banks = [];
    })
  }
});

export const banksReducer = banksSlice.reducer;

export const selectBanksLoading = (state: RootState) => state.banks.loading;
export const selectBanks = (state: RootState) => state.banks.banks;