import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectBanks, selectBanksLoading } from '../../banks/banksSlice';
import {
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography
} from '@mui/material';
import { Phone } from '../Phones';
import { getBanks } from '../../banks/banksThunks';

interface Props {
  changedPhone: Phone | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  closeModal: () => void;
  btnDisabled: boolean;
  sendData: () => void;
  newBank: string;
  setNewBank: (newValue: string) => void,
}

const PhoneForm: React.FC<Props> = ({
                                      changedPhone,
                                      handleChange,
                                      closeModal,
                                      btnDisabled,
                                      sendData,
                                      newBank,
                                      setNewBank
                                    }) => {
  const dispatch = useAppDispatch();
  const banks = useAppSelector(selectBanks);

  const handleChangeBank = (e: SelectChangeEvent) => {
    setNewBank(e.target.value as string);
  };

  useEffect(() => {
    dispatch(getBanks());
  }, [dispatch]);

  return (
    <>
      <Typography component="h2"
                  variant="h4">{changedPhone?._id ? 'Редактирование телефона' : 'Создание нового телефона'}</Typography>
      <Box component="form" sx={{mt: 3}}>
        <Grid container sx={{flexDirection: 'column'}} spacing={2}>
          <Grid item xs={12}>
            <InputLabel id="demo-simple-select-label">Банк</InputLabel>
            <Select
              fullWidth
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={newBank}
              label="Банк"
              onChange={handleChangeBank}
            >
              {banks.map(bank => (
                <MenuItem key={bank._id} value={bank._id}>{bank.bank}</MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <TextField required fullWidth label="Номер телефона"
                       value={changedPhone?.phone || ''} onChange={handleChange}/>
          </Grid>
          <Grid item>
            <Grid container justifyContent="flex-end">
              <Button color="error" variant="contained" sx={{mr: 2}}
                      onClick={closeModal}>Отмена</Button>
              <Button color="primary" variant="contained" onClick={sendData}
                      disabled={btnDisabled}>{changedPhone?._id ? 'Изменить' : 'Создать'}</Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default PhoneForm;