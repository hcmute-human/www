import type { Department } from '@lib/models/department';

export interface GetDepartmentsResult {
  totalCount: number;
  items: Department[];
}
