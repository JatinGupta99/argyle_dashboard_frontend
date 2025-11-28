export type Role = 'USER' | 'ADMIN';

export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: Role;
}

export interface User {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  createdAt?: string;
}


export interface ListUser {
  _id: string;
  name:string;
  email: string;
  role: Role;
  createdAt: string;
}
