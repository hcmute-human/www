import type { Department } from '@lib/models/department';
import type { Paginated } from '@lib/models/paginated';

export interface GetDepartmentPositionResult extends Paginated<Department> {}
