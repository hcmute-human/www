import type { Employee } from './employee';

export interface LeaveType {
  id: string;
  createdTime: string;
  updatedTime: string;
  name: string;
  description?: string;
  days: number;
}

export const enum LeaveApplicationStatus {
  None,
  Pending,
  Approved,
  Rejected,
}

export interface LeaveApplication {
  id: string;
  createdTime: string;
  updatedTime: string;
  issuerId: string;
  issuer: Employee;
  leaveTypeId: string;
  leaveType: LeaveType;
  startTime: string;
  endTime: string;
  status: LeaveApplicationStatus;
  description?: string;
  processorId?: string;
  processor?: Employee;
}

export function formatLeaveApplicationStatus(status: LeaveApplicationStatus) {
  switch (status) {
    case LeaveApplicationStatus.None:
      return 'None';
    case LeaveApplicationStatus.Pending:
      return 'Pending';
    case LeaveApplicationStatus.Approved:
      return 'Approved';
    case LeaveApplicationStatus.Rejected:
      return 'Rejected';
  }
}
