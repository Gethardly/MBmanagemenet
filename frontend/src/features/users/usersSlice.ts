import { DeletedUserResponse, GlobalError, User, UserMutation, UsersListResponse, ValidationError } from '../../types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../app/store';
import { createUser, deleteUser, getEditingUser, getUsersList, login, updateUser } from './usersThunks';

interface UsersState {
  user: User | null;
  usersListData: UsersListResponse;
  deleteOneLoading: string | false;
  getAllLoading: boolean;
  loginLoading: boolean;
  loginError: GlobalError | null;
  registerLoading: boolean;
  registerError: ValidationError | null;
  oneEditUser: UserMutation | null;
  getOneLoading: boolean;
  editOneLoading: boolean;
  editingError: ValidationError | null;
  snackbar: {
    status: boolean;
    parameter: string;
  };
  deletedUserResponse: DeletedUserResponse | null;
}

const initialState: UsersState = {
  user: null,
  usersListData: {
    users: [],
    page: 1,
    pages: 1,
    count: 0,
    perPage: 10,
  },
  deleteOneLoading: false,
  getAllLoading: false,
  loginLoading: false,
  loginError: null,
  registerLoading: false,
  registerError: null,
  editOneLoading: false,
  editingError: null,
  oneEditUser: null,
  getOneLoading: false,
  snackbar: {
    status: false,
    parameter: '',
  },
  deletedUserResponse: null,
};

const usersSlice = createSlice({
  name: 'users',
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
    openSnackbar: (state, {payload: obj}: PayloadAction<{ status: boolean; parameter: string }>) => {
      state.snackbar = obj;
    },
    setCurrentPage: (state, { payload: page }: PayloadAction<number>) => {
      state.usersListData.page = page;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loginError = null;
      state.loginLoading = true;
    });
    builder.addCase(login.fulfilled, (state, {payload}) => {
      state.loginLoading = false;
      state.user = payload;
    });
    builder.addCase(login.rejected, (state, {payload: error}) => {
      state.loginLoading = false;
      state.loginError = (error as GlobalError) || null;
    });

    builder.addCase(createUser.pending, (state) => {
      state.registerLoading = true;
    });
    builder.addCase(createUser.fulfilled, (state) => {
      state.registerLoading = false;
    });
    builder.addCase(createUser.rejected, (state, {payload: error}) => {
      state.registerError = error || null;
      state.registerLoading = false;
    });

    builder.addCase(getEditingUser.pending, (state) => {
      state.oneEditUser = null;
      state.getOneLoading = true;
    });
    builder.addCase(getEditingUser.fulfilled, (state, {payload}) => {
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
    builder.addCase(updateUser.rejected, (state, {payload: error}) => {
      state.editingError = error || null;
      state.editOneLoading = false;
    });

    builder.addCase(getUsersList.pending, (state) => {
      state.getAllLoading = true;
    });
    builder.addCase(getUsersList.fulfilled, (state, { payload }) => {
      state.usersListData = payload;
      state.getAllLoading = false;
    });
    builder.addCase(getUsersList.rejected, (state) => {
      state.getAllLoading = false;
    });

    builder.addCase(deleteUser.pending, (state, { meta: { arg: id } }) => {
      state.deleteOneLoading = id;
    });
    builder.addCase(deleteUser.fulfilled, (state, { payload: deletedUser }) => {
      state.deleteOneLoading = false;
      state.deletedUserResponse = deletedUser;
    });
    builder.addCase(deleteUser.rejected, (state) => {
      state.deleteOneLoading = false;
    });
  },
});

export const usersReducer = usersSlice.reducer;
export const {unsetUser, setUser, resetLoginError, openSnackbar, setCurrentPage} = usersSlice.actions;

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
export const selectUsersListData = (state: RootState) => state.users.usersListData;
export const selectUsersListLoading = (state: RootState) => state.users.getAllLoading;
export const selectDeleteOneUserLoading = (state: RootState) => state.users.deleteOneLoading;
export const selectSnackbarState = (state: RootState) => state.users.snackbar;