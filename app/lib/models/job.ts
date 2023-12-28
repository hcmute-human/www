import type { DepartmentPosition } from './department';
import type { Employee } from './employee';

export const enum JobStatus {
  None,
  Open,
  Closed,
}

export interface Job {
  id: string;
  createdTime: string;
  updatedTime: string;
  creatorId: string;
  creator: Employee;
  title: string;
  description: string;
  status: JobStatus;
  positionId: string;
  position: DepartmentPosition;
}

export const enum JobApplicationStatus {
  None,
  Pending,
  Reviewing,
  Approved,
  Rejected,
}

export interface JobApplication {
  id: string;
  createdTime: string;
  updatedTime: string;
  candidateId: string;
  candidate: string;
  jobId: string;
  job: string;
  status: JobApplicationStatus;
}

export interface Test {
  id: string;
  createdTime: string;
  updatedTime: string;
  creatorId: string;
  creator: Employee;
  jobId: string;
  job: Job;
  name: string;
  questions: object[];
}
