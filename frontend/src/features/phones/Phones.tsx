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
  TableRow,
  Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { StyledTableCell, StyledTableRow } from '../users/theme';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ModalBody from '../../components/ModalBody';
import axiosApi from '../../axios';
import PhoneForm from './components/PhoneForm';
import { Bank } from '../../types';

export interface Phone {
  _id?: string;
  phone: string;
  bank?: Bank;
}

const Phones = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phones, setPhones] = useState<Phone[]>([]);
  const [changedPhone, setChangedPhone] = useState<Phone | null>(null);
  const [newBank, setNewBank] = useState(changedPhone?.bank?._id || '');
  const [loading, setLoading] = useState(false);

  const openModal = (phone: Phone) => {
    setIsModalOpen(true);
    setChangedPhone(phone);
  }

  const closeModal = () => {
    setIsModalOpen(false);
    setChangedPhone(null);
  }

  const getPhones = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.get('/phones');
      if (response.data) {
        setPhones(response.data);
        setLoading(false);
      }
    } catch (e) {
      return e;
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChangedPhone((prevState) => (
      {...prevState, phone: e.target.value,}
    ));
  }

  const changePhone = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.put('/phones', {
        _id: changedPhone?._id,
        phone: changedPhone?.phone,
        bank: changedPhone?.bank?._id
      });
      if (response.data.modifiedCount > 0) {
        setLoading(false);
        setIsModalOpen(false);
        await getPhones();
      }
    } catch (e) {
      return e;
    }

  }

  const createPhone = async () => {
    try {
      setLoading(true);
      const response = await axiosApi.post('/phones', {phone: changedPhone?.phone, bank: newBank});
      if (response.data) {
        setLoading(false);
        setIsModalOpen(false);
        await getPhones();
      }
    } catch (e) {
      return e;
    }
  }

  useEffect(() => {
    getPhones();
  }, []);

  return (
    <Box sx={{py: 2}}>
      <Grid container justifyContent="space-between" spacing={1}>
        <Grid item>
          <Typography variant="h4" component="h3">Список телефонов</Typography>
        </Grid>
        {loading && <CircularProgress color="success"/>}
        <Grid item>
          <Button
            color="primary"
            variant="contained"
            onClick={() => setIsModalOpen(true)}
          >
            <AddIcon sx={{mr: 1}}/>
            Добавить телефон
          </Button>
        </Grid>
      </Grid>

      <Box sx={{mt: 2}}>
        <Paper elevation={3} sx={{width: '100%', minHeight: '600px', overflowX: 'hidden'}}>
          <TableContainer>
            <Table sx={{minWidth: 650}} aria-label="simple table">
              <TableHead color="secondary">
                <TableRow>
                  <StyledTableCell align="center">Телефон</StyledTableCell>
                  <StyledTableCell align="center">Банк</StyledTableCell>
                  <StyledTableCell align="right">Управление</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {phones.length > 0 ? phones.map((phone) => (
                    <StyledTableRow key={phone._id}>
                      <TableCell align="center">{phone.phone}</TableCell>
                      <TableCell align="center">{phone.bank?.bank}</TableCell>
                      <TableCell align="right">
                        <ButtonGroup variant="contained" aria-label="outlined primary button group">
                          <Button
                            size="small"
                            color="error"
                          >
                            {loading && <CircularProgress color="success"/>}
                            <DeleteIcon/>
                          </Button>
                          <Button size="small" color="success" onClick={() => openModal(phone)}>
                            <EditIcon/>
                          </Button>
                        </ButtonGroup>
                      </TableCell>
                    </StyledTableRow>
                  )) :
                  <TableRow>
                    <TableCell>
                      <Typography variant="h2" component="h2">Нет данных</Typography>
                    </TableCell>
                  </TableRow>}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
      {isModalOpen &&
          <ModalBody isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
              <PhoneForm changedPhone={changedPhone} closeModal={closeModal} handleChange={handleChange}
                         sendData={changedPhone?._id ? changePhone : createPhone}
                         newBank={newBank}
                         setNewBank={setNewBank}
                         btnDisabled={loading}/>
          </ModalBody>}
    </Box>
  );
};

export default Phones;