import { ErrorResponse, Note, NoteMutation } from '../../types';
import { createSlice } from '@reduxjs/toolkit';
import { createNote, getAllNotes, getOneNote } from './notesThunks';
import { RootState } from '../../app/store';

interface NotesState {
  notes: Note[];
  notesLoading: boolean;
  noteCreatingLoading: boolean;
  noteCreatingError: ErrorResponse | null;
  oneNoteById: NoteMutation | undefined;
  oneNoteByIdLoading: boolean;
  oneNoteByIdError: ErrorResponse | null;
}

const initialState: NotesState = {
  notes: [],
  notesLoading: false,
  noteCreatingLoading: false,
  noteCreatingError: null,
  oneNoteById: undefined,
  oneNoteByIdLoading: false,
  oneNoteByIdError: null,
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllNotes.pending, (state) => {
      state.notesLoading = true;
    });
    builder.addCase(getAllNotes.fulfilled, (state, { payload }) => {
      state.notesLoading = false;
      state.notes = payload;
    });
    builder.addCase(getAllNotes.rejected, (state) => {
      state.notesLoading = false;
    });

    builder.addCase(createNote.pending, (state) => {
      state.noteCreatingLoading = true;
    });
    builder.addCase(createNote.fulfilled, (state) => {
      state.noteCreatingLoading = false;
    });
    builder.addCase(createNote.rejected, (state, { payload: error }) => {
      state.noteCreatingLoading = false;
      state.noteCreatingError = error as ErrorResponse;
    });

    builder.addCase(getOneNote.pending, (state) => {
      state.oneNoteByIdLoading = true;
    });
    builder.addCase(getOneNote.fulfilled, (state, { payload: note }) => {
      state.oneNoteByIdLoading = false;
      state.oneNoteById = note;
    });
    builder.addCase(getOneNote.rejected, (state, { payload: error }) => {
      state.oneNoteByIdLoading = false;
      state.oneNoteByIdError = error as ErrorResponse;
    });
  },
});

export const notesReducer = notesSlice.reducer;

export const selectNotes = (state: RootState) => state.notes.notes;
export const selectNotesLoading = (state: RootState) =>
  state.notes.notesLoading;
export const selectNoteCreatingLoading = (state: RootState) =>
  state.notes.noteCreatingLoading;
export const selectNoteCreatingError = (state: RootState) =>
  state.notes.noteCreatingError;
export const selectEditingNote = (state: RootState) => state.notes.oneNoteById;
export const selectEditingNoteLoading = (state: RootState) =>
  state.notes.oneNoteByIdLoading;
export const selectEditingNoteError = (state: RootState) =>
  state.notes.oneNoteByIdError;
