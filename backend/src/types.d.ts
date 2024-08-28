export interface IUser  {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'user';
  token?: string;
}
