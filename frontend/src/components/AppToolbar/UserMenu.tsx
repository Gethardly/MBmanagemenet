import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { User, UserMutation } from '../../types';
import { Button, Divider, Menu, MenuItem, Typography } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import HistoryIcon from '@mui/icons-material/History';
import { getEditingUser, updateUser } from '../../features/users/usersThunks';
import ModalBody from '../ModalBody';
import UserForm from '../../features/users/components/UserForm';
import {
  selectEditingError,
  selectEditOneUserLoading,
  selectOneEditingUser,
  unsetUser,
} from '../../features/users/usersSlice';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import useConfirm from '../Dialogs/Confirm/useConfirm';
import dayjs from 'dayjs';
import 'dayjs/locale/ru';

dayjs.locale("ru");

interface Props {
  user: User;
}

const UserMenu: React.FC<Props> = ({ user }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const editingUser = useAppSelector(selectOneEditingUser);
  const editLoading = useAppSelector(selectEditOneUserLoading);
  const error = useAppSelector(selectEditingError);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { confirm } = useConfirm();

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
      await dispatch(updateUser({ id: user._id, user: userToChange })).unwrap();
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
        style={{ textTransform: "inherit" }}
      >
        <Typography mr={1}>{user.displayName}</Typography>
        <AccountCircleIcon />
      </Button>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={openDialog}>
          <AccountBoxIcon sx={{ mr: 1 }} />
          Редактировать профиль
        </MenuItem>
        <MenuItem>
          <HistoryIcon sx={{ mr: 1 }}/>
          <Link to="/operations-history" style={{textDecoration: 'none', color: '#000', fontSize: '16px'}}>
            История операций
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/payment" style={{textDecoration: 'none', color: '#000', fontSize: '16px'}}>
            Пополнение
          </Link>
        </MenuItem>
        <MenuItem>
          <Link to="/withdraw" style={{textDecoration: 'none', color: '#000', fontSize: '16px'}}>
            Вывод
          </Link>
        </MenuItem>
        <Divider key="user-divider" />
        <MenuItem
          sx={{ justifyContent: "center" }}
          onClick={async () => {
            if (
              await confirm(
                "Выход",
                "Вы действительно хотите выйти? Так быстро?"
              )
            ) {
              dispatch(unsetUser());
              handleClose();
              navigate("/");
            }
          }}
        >
          Выйти
          <LogoutIcon sx={{ ml: 1 }} />
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
