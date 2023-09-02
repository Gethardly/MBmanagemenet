import React, { useState } from 'react';
import { Alert, Avatar, Box, Button, Grid, TextField, Typography, } from '@mui/material';
import NoteAltIcon from '@mui/icons-material/NoteAlt';
import { ErrorResponse, NoteMutation } from '../../../types';
import { useNavigate } from 'react-router-dom';

interface Props {
  onSubmit: (note: NoteMutation) => void;
  existingNote?: NoteMutation;
  isEdit?: boolean;
  isLoading: boolean;
  error: ErrorResponse | null;
}

const initialState: NoteMutation = {
  title: "",
  description: "",
};

const NoteForm: React.FC<Props> = ({
  onSubmit,
  existingNote = initialState,
  isEdit,
  isLoading,
  error,
}) => {
  const [state, setState] = useState<NoteMutation>(existingNote);
  const navigate = useNavigate();

  const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(state);
  };
  return (
    <Box
      sx={{
        mt: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Avatar sx={{ m: 1 }}>
        <NoteAltIcon color="success" />
      </Avatar>
      <Typography component="h1" variant="h5">
        {isEdit ? "Редактирование" : "Создание заметки"}
      </Typography>
      {error && (
        <Alert severity="error" sx={{ mt: 3, width: "100%" }}>
          {error.message}
        </Alert>
      )}
      <Box
        component="form"
        onSubmit={submitFormHandler}
        sx={{ mt: 3, width: "100%" }}
      >
        <Grid container sx={{ flexDirection: "column" }} spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Заголовок"
              color="success"
              name="title"
              autoComplete="off"
              value={state.title}
              onChange={inputChangeHandler}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              rows={3}
              multiline
              required
              fullWidth
              color="success"
              label="Заметка"
              name="description"
              autoComplete="off"
              value={state.description}
              onChange={inputChangeHandler}
            />
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          display="flex"
          alignItems="center"
          justifyContent="space-evenly"
          sx={{ mt: 3 }}
        >
          <Button
            variant="contained"
            color="warning"
            onClick={() => navigate("/")}
          >
            Отмена
          </Button>
          <Button
            disabled={
              state.title === "" || state.description === "" || isLoading
            }
            type="submit"
            variant="contained"
            color="success"
          >
            {isEdit ? "Редактировать" : "Создать"}
          </Button>
        </Grid>
      </Box>
    </Box>
  );
};

export default NoteForm;
