import { Request } from 'express';

// Interface untuk payload JWT yang akan disimpan di request
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// Memperluas tipe Request dari Express untuk menyertakan properti 'user'
export interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}