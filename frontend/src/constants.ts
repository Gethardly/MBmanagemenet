export const MainColorGreen = '#2e7d32';

export interface IRole {
  prettyName: string;
  name: string;
}

export const ROLES: IRole[] = [
  {
    prettyName: 'Администратор',
    name: 'admin',
  },
  {
    prettyName: 'Пользователь',
    name: 'user',
  },
];

export const SOCKET_SERVER_URL = 'ws://localhost:8000'//'ws://191.101.2.193/api';
export const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #ccc',
  borderRadius: '10px',
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 2,
};