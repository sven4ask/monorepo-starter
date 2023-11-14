import { UserRole } from '../enums/role.enum';

export interface UserContextInterface {
  sub: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
