import { Permissions } from './permissions';

export interface Manager {
  id: string;
  role: string;
  name: string;
  email: string;
  password: string;
  groupIds: string[];
  permissions: Permissions;
  ownerId: string;
  isActive: boolean;
  phoneNumber: string;
  photo: string;
}
