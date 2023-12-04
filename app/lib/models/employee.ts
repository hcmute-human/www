import type { DepartmentPosition } from './department';

export const enum Gender {
  Male = 1,
  Female,
}

export interface Employee {
  id: string;
  createdTime: string;
  updatedTime: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
}

export const enum EmploymentType {
  FullTime = 1,
  PartTime,
  Internship,
}

export interface EmployeePosition {
  employeeId: string;
  departmentPositionId: string;
  createdTime: string;
  updatedTime: string;
  startTime: string;
  endTime: string;
  employmentType: EmploymentType;
  salary: number;
  departmentPosition: DepartmentPosition;
}
