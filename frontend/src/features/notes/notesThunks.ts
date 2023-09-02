import { createAsyncThunk } from '@reduxjs/toolkit';
import { Note, NoteMutation } from '../../types';
import axiosApi from '../../axios';

export const getAllNotes = createAsyncThunk<Note[]>(
  "notes/getAll",
  async () => {
    try {
      const response = await axiosApi.get<Note[]>("/notes");
      return response.data;
    } catch (e) {
      throw e;
    }
  }
);

export const createNote = createAsyncThunk<void, NoteMutation>(
  "notes/create",
  async (newNote) => {
    try {
      const response = await axiosApi.post("/notes", newNote);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
);

export const getOneNote = createAsyncThunk<Note, string>(
  "notes/getOne",
  async (id) => {
    try {
      const response = await axiosApi.get("/notes/" + id);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
);

interface UpdateNoteParams {
  id: string;
  note: NoteMutation;
}

export const updateOneNote = createAsyncThunk<void, UpdateNoteParams>(
  "notes/updateOne",
  async (newNote) => {
    try {
      const response = await axiosApi.put("/notes/" + newNote.id, newNote.note);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
);

export const deleteOneNote = createAsyncThunk<void, string>(
  "notes/deleteOne",
  async (noteId) => {
    try {
      const response = await axiosApi.delete("/notes/" + noteId);
      return response.data;
    } catch (e) {
      throw e;
    }
  }
);
