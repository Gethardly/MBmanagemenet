import React, { useEffect, useState } from 'react';
import { Box, Button, Grid, Modal, Paper, Typography } from '@mui/material';
import TableContainer from '@mui/material/TableContainer';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { modalStyle, SOCKET_SERVER_URL } from '../constants';
import { useAppSelector } from '../../../app/hooks';
import { selectUser } from '../../users/usersSlice';
import { Withdraw } from '../../../types';
import { io, Socket } from 'socket.io-client';
import axiosApi from '../../../axios';

interface WithdrawInfo {
  withdrawId: string;
  withdrawStatus: boolean | null;
}

const WithdrawRequests = () => {
  const token = useAppSelector(selectUser)?.token;
  const [withdraws, setNewWithdraws] = useState<Withdraw[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [withdrawInfo, setWithdrawInfo] = useState<WithdrawInfo>({
    withdrawId: '',
    withdrawStatus: null,
  });
  const socketRef = React.useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, {
      extraHeaders: {
        auth: `${token}`,
      },
    });

    socketRef.current.on('withdraw', (withdraw: Withdraw) => {
      setNewWithdraws((prevWithdraw) => [withdraw, ...prevWithdraw]);
    });

    socketRef.current.on('changed-withdraw-status', (newWithdraw) => {
      setNewWithdraws(prevWithdraws => {
        return prevWithdraws.map(withdraw =>
          withdraw._id === newWithdraw.id ? {...withdraw, status: newWithdraw.status} : withdraw
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
    const fetchTodayWithdraws = async () => {
      try {
        const startOfTodayMinusFiveDays = dayjs().startOf('day').add(-2, 'days').toDate();
        const endOfToday = dayjs().endOf('day').toDate();
        const response = await axiosApi.get('/operation-requests/withdrawals', {
          params: {
            start_date: startOfTodayMinusFiveDays,
            end_date: endOfToday,
            status: "null",
          },
        });
        setNewWithdraws((prevWithdraws) => [...prevWithdraws].concat(response.data));
      } catch (error) {
        console.error('Error fetching today\'s withdraws:', error);
      }
    };

    fetchTodayWithdraws();
  }, []);

  const changeWithdrawRequestStatus = (id: string, status: boolean | null) => {
    if (socketRef) {
      socketRef.current?.emit('change-withdraw-status', {id, status});
    }
    setIsModalOpen(false);
  };

  const openModal = (id: string, status: boolean) => {
    setWithdrawInfo({
      withdrawId: id,
      withdrawStatus: status,
    });
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return (
    <Grid>
      <Typography variant="h2">
        Вывод
      </Typography>
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell>Дата</TableCell>
              <TableCell>ФИО</TableCell>
              <TableCell>Сумма</TableCell>
              <TableCell>Номер телефона</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Действие</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {withdraws.map(withdraw => (
              <TableRow key={withdraw._id}>
                <TableCell>{dayjs(withdraw.withdrawal_request_date).add(18, 'hour').format('DD.MM.YYYY HH:mm:ss')}</TableCell>
                <TableCell>{withdraw.recipient_name}</TableCell>
                <TableCell>{withdraw.amount}</TableCell>
                <TableCell>{withdraw.phone_number}</TableCell>
                <TableCell>
                  {withdraw.status === null && 'В ожидании'}
                  {withdraw.status === true && 'Принят'}
                  {withdraw.status === false && 'Отклонен'}
                </TableCell>
                <TableCell>
                  {withdraw.status === null && <>
                      <Button color="success" onClick={() => openModal(withdraw._id, true)}>Принять</Button>
                      <Button color="error" onClick={() => openModal(withdraw._id, false)}>Отклонить</Button>
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
                    onClick={() => changeWithdrawRequestStatus(withdrawInfo.withdrawId, withdrawInfo.withdrawStatus)}>Подтвердить</Button>
            <Button color="error" onClick={handleCloseModal}>Отменить</Button>
          </Box>
        </Box>
      </Modal>
    </Grid>
  );
};

export default WithdrawRequests;