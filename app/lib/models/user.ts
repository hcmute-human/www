import type { AssetInfo } from './asset';

export interface User {
  id: string;
  createdTime: string;
  updatedTime: string;
  email: string;
  passwordHash: string;
  avatar?: AssetInfo;
}
