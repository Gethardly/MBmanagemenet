import { Button, Card, CardActions, CardContent, CardMedia, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import dayjs from 'dayjs';
import axiosApi from '../../../axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';

const SOCKET_SERVER_URL = 'ws://localhost:8000'; // Замените на URL вашего сервера

interface Payment {
  _id: string;
  sender_name: string;
  payment_date: string;
  amount: string;
  status: boolean | null;
  filename: string;
}

const paymentStatuses = {
  'null': 'Создан',
  'true': 'Принят',
  'false': 'Отклонен'
}

const PaymentRequests = () => {
  const token = useAppSelector(selectUser)?.token;
  const [payments, setNewPayments] = useState<Payment[]>([]);
  const socketRef = React.useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      extraHeaders: {
        auth: `${token}`,
      },
    });

    socketRef.current.on('payment', (payment: Payment) => {
      setNewPayments((prevPayments) => [...prevPayments, payment]);
    });

    socketRef.current.on('changed-payment-status', (newPayment) => {
      setNewPayments(prevPayments => {
        return prevPayments.map(payment =>
          payment._id === newPayment.id ? {...payment, status: newPayment.status} : payment
        );
      });
    })

    return () => {
      if (socketRef !== null) {
        socketRef.current?.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    const fetchTodayPayments = async () => {
      try {
        const startOfToday = dayjs().startOf('day').toDate();
        const endOfToday = dayjs().endOf('day').toDate();
        const response = await axiosApi.get('/operation-requests/payments', {
          params: {start_date: startOfToday, end_date: endOfToday},
        });
        setNewPayments((prevPayments) => [...prevPayments].concat(response.data));
      } catch (error) {
        console.error('Error fetching today\'s payments:', error);
      }
    };

    fetchTodayPayments();
  }, []);

  const changePaymentRequestStatus = (id: string, status: boolean) => {
    if (socketRef) {
      socketRef.current?.emit('change-payment-status', {id, status});
    }
  };

  return (
    <Grid>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>ФИО</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Чек</TableCell>
              <TableCell>Действие</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map(payment => (
              <TableRow>
                <TableCell>{dayjs(payment.payment_date).add(18, 'hour').format('DD.MM.YYYY HH:mm:ss')}</TableCell>
                <TableCell>{payment.sender_name}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <a href={`http://localhost:8000/recharge-receipts/${payment.filename}`} target='_blank'>
                    Посмотреть чек
                  </a>
                </TableCell>
                <TableCell>
                  <Button color="success">Принять</Button>
                  <Button color="error">Отклонить</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {payments.reverse().map(payment => (
        <Card variant="outlined" sx={{
          p: 2,
          mb: 2,
          bgcolor: payment.status === null ? 'primary.light' : payment.status === true ? 'success.light' : 'error.light'
        }} key={payment._id}>
          <CardContent>
            <Typography sx={{fontSize: 14}} color="text.secondary" gutterBottom>
              {dayjs(payment.payment_date).add(18, 'hour').format('DD.MM.YYYY HH:mm:ss')}
            </Typography>

            {payment.sender_name} {payment.amount} сом
            {payment.status === null && 'Создан'}
            {payment.status === true && 'Принят'}
            {payment.status === false && 'Отклонен'}
            <a href={`http://localhost:8000/recharge-receipts/${payment.filename}`}>Посмотреть скриншот</a>
          </CardContent>
          <CardActions>
            <Button variant="contained" color="success"
                    onClick={() => changePaymentRequestStatus(payment._id, true)}>Принять</Button>
            <Button variant="contained" color="error"
                    onClick={() => changePaymentRequestStatus(payment._id, false)}>Отклонить</Button>
          </CardActions>
        </Card>
      ))}
    </Grid>
  );
};

export default PaymentRequests;