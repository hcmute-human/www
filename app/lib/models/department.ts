export interface Department {
  id: string;
  createdTime: string;
  updatedTime: string;
  name: string;
}

export interface DepartmentPosition {
  id: string;
  createdTime: string;
  updatedTime: string;
  name: string;
  department: Department;
}
