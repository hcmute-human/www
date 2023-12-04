import type { Employee } from '@lib/models/employee';

export interface GetEmployeesResult {
  totalCount: number;
  items: Employee[];
}
