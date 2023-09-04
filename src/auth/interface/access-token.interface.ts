import { User } from '../../users/interfaces/user.interface';

export interface Authenticated {
  access_token: string;
  user: User;
}
