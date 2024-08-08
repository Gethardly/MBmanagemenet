import React from 'react';
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Payment } from '../../../../types';

interface Props {
  payments: Payment[];
  changePaymentRequestStatus: (id: string, status: boolean | null) => void;
}

const OperationCard = ({payments, changePaymentRequestStatus}: Props) => {
  return (
    <div>
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
            <a href={`http://localhost:8000/recharge-receipts/${payment.filename}`}>Посмотреть чек</a>
          </CardContent>
          {payment.status === null && <CardActions>
              <Button variant="contained" color="success"
                      onClick={() => changePaymentRequestStatus(payment._id, true)}>Принять</Button>
              <Button variant="contained" color="error"
                      onClick={() => changePaymentRequestStatus(payment._id, false)}>Отклонить</Button>
          </CardActions>}
        </Card>
      ))}
    </div>
  );
};

export default OperationCard;