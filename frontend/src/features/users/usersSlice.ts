import { GlobalError, User, UserMutation, ValidationError } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createUser, getEditingUser, login, updateUser } from './usersThunks';

interface UsersState {
  user: User | null;
  loginLoading: boolean;
  loginError: GlobalError | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  oneEditUser: UserMutation | null;
  getOneLoading: boolean;
  editOneLoading: boolean;
  editingError: ValidationError | null;
}

const initialState: UsersState = {
  user: null,
  loginLoading: false,
  loginError: null,
  registerLoading: false,
  registerError: null,
  editOneLoading: false,
  editingError: null,
  oneEditUser: null,
  getOneLoading: false,
};

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    unsetUser: (state) => {
      state.user = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetLoginError: (state) => {
      state.loginError = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loginError = null;
      state.loginLoading = true;
    });
    builder.addCase(login.fulfilled, (state, { payload }) => {
      state.loginLoading = false;
      state.user = payload;
    });
    builder.addCase(login.rejected, (state, { payload: error }) => {
      state.loginLoading = false;
      state.loginError = (error as GlobalError) || null;
    });

    builder.addCase(createUser.pending, (state) => {
      state.registerLoading = true;
    });
    builder.addCase(createUser.fulfilled, (state) => {
      state.registerLoading = false;
    });
    builder.addCase(createUser.rejected, (state, { payload: error }) => {
      state.registerError = error || null;
      state.registerLoading = false;
    });

    builder.addCase(getEditingUser.pending, (state) => {
      state.oneEditUser = null;
      state.getOneLoading = true;
    });
    builder.addCase(getEditingUser.fulfilled, (state, { payload }) => {
      state.oneEditUser = payload;
      state.getOneLoading = false;
    });
    builder.addCase(getEditingUser.rejected, (state) => {
      state.getOneLoading = false;
    });

    builder.addCase(updateUser.pending, (state) => {
      state.editingError = null;
      state.editOneLoading = true;
    });
    builder.addCase(updateUser.fulfilled, (state) => {
      state.editOneLoading = false;
    });
    builder.addCase(updateUser.rejected, (state, { payload: error }) => {
      state.editingError = error || null;
      state.editOneLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;
export const { unsetUser, setUser, resetLoginError } = usersSlice.actions;

export const selectUser = (state: RootState) => state.users.user;
export const selectLoginLoading = (state: RootState) =>
  state.users.loginLoading;
export const selectLoginError = (state: RootState) => state.users.loginError;
export const selectRegisterLoading = (state: RootState) =>
  state.users.registerLoading;
export const selectRegisterError = (state: RootState) =>
  state.users.registerError;
export const selectEditOneUserLoading = (state: RootState) =>
  state.users.editOneLoading;
export const selectEditingError = (state: RootState) =>
  state.users.editingError;
export const selectOneEditingUser = (state: RootState) =>
  state.users.oneEditUser;
