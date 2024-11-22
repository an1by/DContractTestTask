import { UserRow } from './UserRow';

export type UserField = keyof UserRow;

export const USER_FIELDS: UserField[] = [
  'id',
  'firstName',
  'lastName',
  'gender',
  'address',
  'city',
  'phone',
  'email',
  'status',
];