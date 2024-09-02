import React, { useEffect, useState } from 'react';
import {
  Box,
  Button, ButtonGroup,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField, Typography
} from '@mui/material';
import { StyledTableCell, StyledTableRow } from '../users/theme';
import axiosApi from '../../axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ModalBody from '../../components/ModalBody';

interface Bank {
  bank: string
}

const Banks = () => {
  const [banks, setBanks] = useState<Bank[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changedBank, setChangedBank] = useState<string>('');

  const openModal = (bank: Bank) => {
    setChangedBank(bank);
    setIsModalOpen(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setChangedBank(value);
  }

  const changeBankName = ()

  useEffect(() => {
    const getBanks = async () => {
      const response = await axiosApi.get('/banks');
      setBanks(response.data);
    }
    getBanks();
  }, []);
  return (
    <Box sx={{py: 2}}>
      <Grid container justifyContent="flex-end" spacing={1}>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
          >
            <AddIcon sx={{mr: 1}}/>
            Добавить банк
          </Button>
        </Grid>
      </Grid>

      <Box sx={{mt: 2}}>
        <Paper elevation={3} sx={{width: '100%', minHeight: '600px', overflowX: 'hidden'}}>
          <TableContainer>
            <Table sx={{minWidth: 650}} aria-label="simple table">
              <TableHead color="secondary">
                <TableRow>
                  <StyledTableCell align="center">Название</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {banks !== null && banks.length > 0 ? banks.map((bank) => (
                  <StyledTableRow>
                    <TableCell align="center">{bank.bank}</TableCell>
                    <TableCell align="right">
                      <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button
                          size="small"
                          color="error"
                        >
                          {false && <CircularProgress color="success"/>}
                          <DeleteIcon/>
                        </Button>
                        <Button size="small" color="success" onClick={() => openModal(bank)}>
                          <EditIcon/>
                        </Button>
                      </ButtonGroup>
                    </TableCell>
                  </StyledTableRow>
                )) : <h1>Нет данных</h1>}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      {isModalOpen &&
          <ModalBody isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <Typography component="h2" variant="h4">Редактирование названия банка</Typography>
              <Box component="form" sx={{mt: 3}}>
                  <Grid container sx={{flexDirection: 'column'}} spacing={2}>
                      <Grid item xs={12}>
                          <TextField required fullWidth value={changedBank} onChange={handleChange}/>
                      </Grid>
                      <Grid item>
                          <Grid container justifyContent="flex-end">
                              <Button color="error" variant="contained" sx={{mr: 2}}>Отмена</Button>
                              <Button color="primary" variant="contained" type="submit">Изменить</Button>
                          </Grid>
                      </Grid>
                  </Grid>
              </Box>
          </ModalBody>}
    </Box>
  );
};

export default Banks;