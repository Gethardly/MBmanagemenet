import React from 'react';
import { createNote, updateOneNote } from './notesThunks';
import { NoteMutation } from '../../types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useNavigate, useParams } from 'react-router-dom';
import { Container } from '@mui/material';
import NoteForm from './components/NoteForm';
import {
  selectEditingNote,
  selectEditingNoteLoading,
  selectNoteCreatingError,
  selectNoteCreatingLoading,
} from './notesSlice';

const CreateNote: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const creating = useAppSelector(selectNoteCreatingLoading);
  const error = useAppSelector(selectNoteCreatingError);
  const { id } = useParams();
  const editingNote = useAppSelector(selectEditingNote);
  const editing = useAppSelector(selectEditingNoteLoading);

  const submitFormHandler = async (note: NoteMutation) => {
    if (!id) {
      await dispatch(createNote(note)).unwrap();
    } else {
      await dispatch(updateOneNote({ id, note }));
    }
    navigate("/");
  };
  return (
    <Container component="main" maxWidth="xs">
      <NoteForm
        error={error}
        onSubmit={submitFormHandler}
        isLoading={editing ? editing : creating}
        existingNote={id ? editingNote : undefined}
        isEdit={id ? Boolean(editingNote) : false}
      />
    </Container>
  );
};

export default CreateNote;
