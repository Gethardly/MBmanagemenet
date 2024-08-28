export interface IUser  {
  email: string;
  password: string;
  displayName: string;
  role: 'admin' | 'user';
  token?: string;
}

export type BankPhonesEnum = 'MBANK' | 'OPTIMA' | 'KICB' | 'RSK'