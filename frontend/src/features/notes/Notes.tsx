import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Link } from 'react-router-dom';
import DataTable from './components/NotesTable';
import { selectNotes } from './notesSlice';
import { getAllNotes } from './notesThunks';
import ExportToExcel from '../../components/exportToExcel/ExportToExcel';
import { Button, Grid } from '@mui/material';

const Notes = () => {
  const notes = useAppSelector(selectNotes);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllNotes());
  }, [dispatch]);
  return (
    <>
      <Grid container spacing={1} justifyContent="flex-end">
        <Grid item>
          <Link to="/create-note">
            <Button variant="contained">Создать заметку</Button>
          </Link>
        </Grid>
        <Grid item>
          <ExportToExcel key="Excel export" data={notes} />
        </Grid>
      </Grid>
      <DataTable data={notes} />
    </>
  );
};

export default Notes;
