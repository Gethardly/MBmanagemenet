import { Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import dayjs from 'dayjs';
import React, { useState } from 'react';
import { Payment } from '../../../types';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

interface FilterDate {
  startDate: any,
  endDate: any,
}

const OperationsHistory = () => {
  const [payments, setNewPayments] = useState<Payment[] | null>(null);
  const [filterDate, setNewFilterDate] = useState<FilterDate>({
    startDate: dayjs().startOf('day').add(-7, 'days'),
    endDate: dayjs().endOf('day'),
  });

  const handleChange = (value: null) => {
    console.log(value);
  }
  return (
    <Grid>
      <Container>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer components={['DatePicker']}>
            <DatePicker
              label="Controlled picker"
              value={filterDate.startDate}
              onChange={handleChange}
            />
          </DemoContainer>
        </LocalizationProvider>
      </Container>
      {payments && <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>ФИО</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Чек</TableCell>
              <TableCell>Статус</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.length <= 0 ? <h1>Нет данных</h1> : payments.map(payment => (
              <TableRow>
                <TableCell>{dayjs(payment.payment_date).add(18, 'hour').format('DD.MM.YYYY HH:mm:ss')}</TableCell>
                <TableCell>{payment.sender_name}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <a href={`http://localhost:8000/recharge-receipts/${payment.filename}`} target="_blank">
                    Посмотреть чек
                  </a>
                </TableCell>
                <TableCell>
                  {payment.status === null && 'Создан'}
                  {payment.status === true && 'Принят'}
                  {payment.status === false && 'Отклонен'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
    </Grid>
  );
};

export default OperationsHistory;