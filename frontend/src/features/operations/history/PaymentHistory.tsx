import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, Typography
} from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import React, { useState } from 'react';
import { Payment } from '../../../types';
import { DateTimePicker, DateTimeValidationError, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axiosApi from '../../../axios';

interface FilterDate {
  startDate: Dayjs,
  endDate: Dayjs,
}

const paymentStatuses = [
  {label: 'Все', value: 'all'},
  {label: 'В ожидании', value: 'null'},
  {label: 'Принят', value: 'true'},
  {label: 'Отклонен', value: 'false'},
]

const PaymentHistory = () => {
  const [payments, setNewPayments] = useState<Payment[] | null>(null);
  const [filterDate, setNewFilterDate] = useState<FilterDate>({
    startDate: dayjs().startOf('day').add(-7, 'days'),
    endDate: dayjs(),
  });
  const [paymentStatus, setNewPaymentStatus] = useState('all');
  const [dateError, setDateError] = useState<string | null>(null);

  const handleDateChange = (fieldName: keyof FilterDate, value: Dayjs | null) => {
    setNewFilterDate((prevDates) => {
      const newDates = {
        ...prevDates,
        [fieldName]: value,
      };

      const start = newDates.startDate;
      const end = newDates.endDate;
      if (start && end) {
        const diff = end.diff(start, 'month', true);
        if (diff > 1) {
          setDateError('Период дат не должен превышать один месяц');
        } else {
          setDateError(null);
        }
      }

      return newDates;
    });
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | SelectChangeEvent) => {
    const {name, value} = e.target;
    switch (name) {
      case 'paymentStatus': return setNewPaymentStatus(value);
    }
  }

  const handleDateError = (newError: DateTimeValidationError) => {
    switch (newError) {
      case 'disableFuture': return setDateError('Нельзя установить будущее время');
    }
  }

  const handleSearch = async () => {
    try {
      const response = await axiosApi.get('/operation-requests/payments', {
        params: {
          start_date: filterDate.startDate.toISOString(),
          end_date: filterDate.endDate.toISOString(),
          ...(paymentStatus !== 'all' ? { status: paymentStatus } : {}),
        },
      });
      setNewPayments(response.data);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  return (
    <Grid>
      <Typography variant="h2">
        История поплнений
      </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Grid container spacing={2}>
            <Grid item>
              <DateTimePicker
                label="C"
                value={filterDate.startDate}
                disableFuture
                ampm={false}
                format="DD/MM/YYYY HH:mm"
                onChange={(value) => handleDateChange('startDate', value)}
                onError={(newError) => handleDateError(newError)}
                slotProps={{
                  textField: {
                    error: !!dateError,
                    helperText: dateError,
                  },
                }}
              />
            </Grid>
            <Grid item>
              <DateTimePicker
                label="По"
                value={filterDate.endDate}
                disableFuture
                ampm={false}
                format="DD/MM/YYYY HH:mm"
                onChange={(value) => handleDateChange('endDate', value)}
                onError={(newError) => handleDateError(newError)}
                slotProps={{
                  textField: {
                    error: !!dateError,
                    helperText: dateError,
                  },
                }}
              />
            </Grid>
            <Grid item>
              <FormControl>
                <InputLabel id="payment-statuses">Статус</InputLabel>
                <Select
                  labelId="payment-statuses"
                  name="paymentStatus"
                  id="payment-statuses"
                  value={paymentStatus}
                  label="Age"
                  onChange={handleChange}
                >
                  {paymentStatuses.map((pS, i) => (
                    <MenuItem key={i} value={pS.value}>{pS.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <Button sx={{mt: '10px'}} variant="contained"
                      onClick={handleSearch} disabled={!!dateError}>
                Поиск
              </Button>
            </Grid>
          </Grid>
        </LocalizationProvider>
      {payments && <TableContainer component={Paper} sx={{mt: '20px'}}>
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

export default PaymentHistory;