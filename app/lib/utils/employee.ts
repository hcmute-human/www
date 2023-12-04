import { EmploymentType } from '@lib/models/employee';

export function formatEmploymentType(employmentType: EmploymentType) {
  switch (employmentType) {
    case EmploymentType.FullTime:
      return 'Full-time';
    case EmploymentType.PartTime:
      return 'Part-time';
    case EmploymentType.Internship:
      return 'Internship';
  }
}
