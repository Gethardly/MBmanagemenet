import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserMutation } from '../../types';
import { Button, Divider, Menu, MenuItem, Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Groups';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import MoveToInboxIcon from '@mui/icons-material/MoveToInbox';
import OutboxIcon from '@mui/icons-material/Outbox';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import { getEditingUser, updateUser } from '../../features/users/usersThunks';
import ModalBody from '../ModalBody';
import UserForm from '../../features/users/components/UserForm';
import {
  selectEditingError,
  selectEditOneUserLoading,
  selectOneEditingUser,
  unsetUser,
} from '../../features/users/usersSlice';
import useConfirm from '../Dialogs/Confirm/useConfirm';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale('ru');

const linksStyles = {
  textDecoration: 'none',
  color: '#000',
  fontSize: '16px',
  display: 'flex',
  alignItems: 'center'
};

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({user}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editingUser = useAppSelector(selectOneEditingUser);
  const editLoading = useAppSelector(selectEditOneUserLoading);
  const error = useAppSelector(selectEditingError);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const {confirm} = useConfirm();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const openDialog = async () => {
    handleClose();
    await dispatch(getEditingUser(user._id));
    setIsDialogOpen(true);
  };

  const onFormSubmit = async (userToChange: UserMutation) => {
    try {
      await dispatch(updateUser({id: user._id, user: userToChange})).unwrap();
      setIsDialogOpen(false);
    } catch (error) {
      throw new Error(`Произошла ошибка: ${error}`);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        color="inherit"
        style={{textTransform: 'inherit'}}
      >
        <Typography mr={1}>{user.displayName}</Typography>
        <AccountCircleIcon/>
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={openDialog}>
          <AccountBoxIcon sx={{mr: 1}}/>
          Редактировать профиль
        </MenuItem>
        <Divider/>
        <MenuItem>
          <Link to="/payment-history" style={linksStyles}>
            <HistoryIcon sx={{mr: 1}}/>
            История пополнений
          </Link>
        </MenuItem>
        <Divider/>
        <MenuItem>
          <Link to="/withdraw-history" style={linksStyles}>
            <HistoryIcon sx={{mr: 1}}/>
            История выводов
          </Link>
        </MenuItem>
        <Divider/>
        <MenuItem>
          <Link to="/payment" style={linksStyles}>
            <MoveToInboxIcon sx={{mr: 1}}/>
            Пополнение
          </Link>
        </MenuItem>
        <Divider/>
        <MenuItem>
          <Link to="/withdraw" style={linksStyles}>
            <OutboxIcon sx={{mr: 1}}/>
            Вывод
          </Link>
        </MenuItem>
        {user.role === 'admin' && [
          <Divider/>,
          <MenuItem>
            <Link to="/banks" style={linksStyles}>
              <AccountBalanceIcon sx={{mr: 1}}/>
              Банки
            </Link>
          </MenuItem>,
          <Divider/>,
          <MenuItem>
            <Link to="/phones" style={linksStyles}>
              <LocalPhoneIcon sx={{mr: 1}}/>
              Телефоны
            </Link>
          </MenuItem>,
          <Divider key="divider-user-management"/>,
          <MenuItem
            key="user-management"
          >
            <Link to="/users" style={linksStyles}>
              <GroupIcon sx={{mr: 1}}/>
              Управление пользователями
            </Link>
          </MenuItem>
        ]}
        <Divider/>
        <MenuItem
          sx={{justifyContent: 'center'}}
          onClick={async () => {
            if (
              await confirm(
                'Выход',
                'Вы действительно хотите выйти? Так быстро?'
              )
            ) {
              dispatch(unsetUser());
              handleClose();
              navigate('/');
            }
          }}
        >
          Выйти
          <LogoutIcon sx={{ml: 1}}/>
        </MenuItem>
      </Menu>
      {editingUser && (
        <ModalBody isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
          <UserForm
            error={error}
            onSubmit={onFormSubmit}
            existingUser={editingUser}
            isEdit
            isLoading={editLoading}
          />
        </ModalBody>
      )}
    </>
  );
};

export default UserMenu;
