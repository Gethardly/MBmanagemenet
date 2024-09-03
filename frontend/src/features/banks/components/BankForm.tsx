import React from 'react';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { Bank } from '../../../types';

interface Props {
  changedBank: Bank | null,
  sendData: () => void,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
  setIsModalOpen: (state: boolean) => void,
  btnDisabled: boolean,
}

const BankForm: React.FC<Props> = ({changedBank, sendData, handleChange, setIsModalOpen, btnDisabled}) => {
  return (
    <>
      <Typography component="h2"
                  variant="h4">{changedBank?._id ? 'Редактирование названия банка' : 'Создание нового банка'}</Typography>
      <Box component="form" sx={{mt: 3}}>
        <Grid container sx={{flexDirection: 'column'}} spacing={2}>
          <Grid item xs={12}>
            <TextField required fullWidth value={changedBank?.bank || ''} onChange={handleChange}/>
          </Grid>
          <Grid item>
            <Grid container justifyContent="flex-end">
              <Button color="error" variant="contained" sx={{mr: 2}}
                      onClick={() => setIsModalOpen(false)}>Отмена</Button>
              <Button color="primary" variant="contained" onClick={sendData}
                      disabled={btnDisabled}>{changedBank?._id ? 'Изменить' : 'Создать'}</Button>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default BankForm;