import { User } from "next-auth";

export type SessionUser = { id: string | number } & User;

export type Session = { 
  user: SessionUser;
  accessToken?: string;
  expires: string; 
}; 
