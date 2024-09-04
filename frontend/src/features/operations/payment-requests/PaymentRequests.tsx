import { Box, Button, Grid, Modal, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import dayjs from 'dayjs';
import axiosApi, { API_URL } from '../../../axios';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import CloseIcon from '@mui/icons-material/Close';
import { Payment } from '../../../types';
import { modalStyle, SOCKET_SERVER_URL } from '../../../constants';

interface PaymentInfo {
  paymentId: string,
  paymentStatus: boolean | null,
}

const PaymentRequests = () => {
  const token = useAppSelector(selectUser)?.token;
  const [payments, setNewPayments] = useState<Payment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    paymentId: '',
    paymentStatus: null,
  });
  const socketRef = React.useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
     /* transports: ['websocket'],
      withCredentials: true,*/
      extraHeaders: {
        auth: `${token}`,
      },
    });

    socketRef.current.on('payment', (payment: Payment) => {
      setNewPayments((prevPayments) => [payment, ...prevPayments]);
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
  }, [token]);

  useEffect(() => {
    const fetchTodayPayments = async () => {
      try {
        const startOfTodayMinusFiveDays = dayjs().startOf('day').add(-2, 'days').toDate();
        const endOfToday = dayjs().endOf('day').toDate();
        const response = await axiosApi.get('/operation-requests/payments', {
          params: {
            start_date: startOfTodayMinusFiveDays,
            end_date: endOfToday,
            status: "null",
          },
        });
        setNewPayments((prevPayments) => [...prevPayments].concat(response.data));
      } catch (error) {
        console.error('Error fetching today\'s payments:', error);
      }
    };

    fetchTodayPayments();
  }, []);

  const changePaymentRequestStatus = (id: string, status: boolean | null) => {
    if (socketRef) {
      socketRef.current?.emit('change-payment-status', {id, status});
    }
    setIsModalOpen(false);
  };

  const openModal = (id: string, status: boolean) => {
    setPaymentInfo({
      paymentId: id,
      paymentStatus: status,
    });
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return (
    <Grid>
      <Typography variant="h2">
        Пополнение
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>ФИО</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Чек</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действие</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map(payment => (
              <TableRow key={payment._id}>
                <TableCell>{dayjs(payment.payment_date).add(18, 'hour').format('DD.MM.YYYY HH:mm:ss')}</TableCell>
                <TableCell>{payment.sender_name}</TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <a href={`${API_URL}/recharge-receipts/${payment.filename}`} target="_blank" rel="noopener noreferrer">
                    Посмотреть чек
                  </a>
                </TableCell>
                <TableCell>
                  {payment.status === null && 'В ожидании'}
                  {payment.status === true && 'Принят'}
                  {payment.status === false && 'Отклонен'}
                </TableCell>
                <TableCell>
                  {payment.status === null && <>
                      <Button color="success" onClick={() => openModal(payment._id, true)}>Принять</Button>
                      <Button color="error" onClick={() => openModal(payment._id, false)}>Отклонить</Button>
                  </>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box sx={modalStyle}>
          <Button sx={{ml: '88%', color: '#000'}} onClick={handleCloseModal}>
            <CloseIcon/>
          </Button>
          <Typography>
            Вы уверены что хотите выполнить это действие?
          </Typography>
          <Box sx={{display: 'flex', justifyContent: 'flex-end', mt: '20px'}}>
            <Button color="success"
                    onClick={() => changePaymentRequestStatus(paymentInfo.paymentId, paymentInfo.paymentStatus)}>Подтвердить</Button>
            <Button color="error" onClick={handleCloseModal}>Отменить</Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default PaymentRequests;