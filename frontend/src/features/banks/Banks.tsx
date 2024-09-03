import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import { StyledTableCell, StyledTableRow } from '../users/theme';
import axiosApi from '../../axios';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import ModalBody from '../../components/ModalBody';
import BankForm from './components/BankForm';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { selectBanks } from './banksSlice';
import { Bank } from '../../types';
import { getBanks } from './banksThunks';
import { selectLoginLoading } from '../users/usersSlice';

const Banks = () => {
  const dispatch = useAppDispatch();
  const banks = useAppSelector(selectBanks);
  const loading = useAppSelector(selectLoginLoading);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [changedBank, setChangedBank] = useState<Bank | null>(null);
  const [btnDisabled, setBtnDisabled] = useState(false);

  const openModal = (bank: Bank) => {
    setChangedBank(bank);
    setIsModalOpen(true);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {value} = e.target;
    setChangedBank((prevState) => ({...prevState, bank: value}));
  }

  const changeBankName = async () => {
    setBtnDisabled(true);
    const response = await axiosApi.put('/banks', changedBank);
    if (response.data?.modifiedCount > 0) {
      setBtnDisabled(false);
      setIsModalOpen(false);
      setChangedBank(null);
      await dispatch(getBanks());
    }
  }

  const createBank = async () => {
    setBtnDisabled(true);
    const response = await axiosApi.post('/banks', changedBank);
    if (response.data) {
      setBtnDisabled(false);
      setIsModalOpen(false);
      setChangedBank(null);
      await dispatch(getBanks());
    }
  }

  useEffect(() => {
    dispatch(getBanks());
  }, [dispatch]);
  return (
    <Box sx={{py: 2}}>
      {loading && <CircularProgress color="primary"/>}
      <Grid container justifyContent="flex-end" spacing={1}>
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setIsModalOpen(true)}
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
                {banks.length > 0 ? banks.map((bank) => (
                  <StyledTableRow>
                    <TableCell align="center">{bank.bank}</TableCell>
                    <TableCell align="right">
                      <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button
                          size="small"
                          color="error"
                        >
                          {loading && <CircularProgress color="success"/>}
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
              <BankForm changedBank={changedBank} handleChange={handleChange} setIsModalOpen={setIsModalOpen}
                        btnDisabled={btnDisabled} sendData={changedBank?._id ? changeBankName : createBank}/>
          </ModalBody>}
    </Box>
  );
};

export default Banks;