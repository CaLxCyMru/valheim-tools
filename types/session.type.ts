import { User } from 'next-auth';
import { Role } from '../enums';

export type SessionUser = { id: string | number; role: Role } & User;

export type Session = {
  user: SessionUser;
  accessToken?: string;
  expires: string;
};
