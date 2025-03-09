import { Application, Approve } from './admin/approval';
import { DetailNewz, DetailPermission, DetailReflect, DetailResponse, DetailTemplate, New, Permission, Reflect, Response, Template } from './admin/config';
import { DashBoard } from './admin/dashboard';
import { Department, DetailJobPosition, DetailEmployee, DetailPosition, JobPosition, Employee, Position } from './admin/human-resource';
import { ApprovedPayslip, Bonus, PendingPayslip, PendingzPayslip, Preview, Salary, SalaryCalculation } from './admin/payroll';
import { DetailShift, Device, ImportLog, Schedule, Shift, Timekeeping, TimekeepingConfig } from './admin/timekeeping';
import { ChangePassword, ForgotPassword, SignIn } from './auth';

export const routes = [
  { path: '/auth/sign-in', element: SignIn, public: true },
  { path: '/auth/forgot-password', element: ForgotPassword, public: true },
  { path: '/auth/change-password', element: ChangePassword },

  { path: '/', element: DashBoard, layout: true },
  { path: '/position', element: Position, layout: true },
  { path: '/position/create', element: DetailPosition, layout: true },
  { path: '/position/detail/:_id', element: DetailPosition, layout: true },
  { path: '/job-position', element: JobPosition, layout: true },
  { path: '/job-position/create', element: DetailJobPosition, layout: true },
  { path: '/job-position/detail/:_id', element: DetailJobPosition, layout: true },
  { path: '/department', element: Department, layout: true },
  { path: '/employee', element: Employee, layout: true },
  { path: '/employee/create', element: DetailEmployee, layout: true },
  { path: '/employee/detail/:_id', element: DetailEmployee, layout: true },

  { path: '/timekeeping-config', element: TimekeepingConfig, layout: true },
  { path: '/device', element: Device, layout: true },
  { path: '/shift', element: Shift, layout: true },
  { path: '/shift/create', element: DetailShift, layout: true },
  { path: '/shift/create/:_idz', element: DetailShift, layout: true },
  { path: '/shift/detail/:_id', element: DetailShift, layout: true },
  { path: '/schedule', element: Schedule, layout: true },
  { path: '/timekeeping', element: Timekeeping, layout: true },
  { path: '/import-log', element: ImportLog, layout: true },

  { path: '/bonus', element: Bonus, layout: true },
  { path: '/salary-calculation', element: SalaryCalculation, layout: true },
  { path: '/pending-payslip', element: PendingPayslip, layout: true },
  { path: '/pending-payslip/detail/:_id', element: Preview, layout: false },
  { path: '/pendingz-payslip', element: PendingzPayslip, layout: true },
  { path: '/pendingz-payslip/detail/:_id', element: Preview, layout: false },
  { path: '/approved-payslip', element: ApprovedPayslip, layout: true },
  { path: '/approved-payslip/detail/:_id', element: Preview, layout: false },
  { path: '/salary', element: Salary, layout: true },
  { path: '/salary/detail/:_id', element: Preview, layout: false },

  { path: '/application', element: Application, layout: true },
  { path: '/approve', element: Approve, layout: true },

  { path: '/permission', element: Permission, layout: true },
  { path: '/permission/create', element: DetailPermission, layout: true },
  { path: '/permission/detail/:_id', element: DetailPermission, layout: true },
  { path: '/template', element: Template, layout: true },
  { path: '/cam-ket/:slug', element: DetailTemplate, public: true },
  { path: '/phan-hoi/:_id', element: DetailResponse, public: true },
  { path: '/response', element: Response, layout: true },
  { path: '/reflect', element: Reflect, layout: true },
  { path: '/phan-hoi', element: DetailReflect, public: true },
  { path: '/new', element: New, layout: true },
  { path: '/new/create', element: DetailNewz, layout: true },
  { path: '/new/detail/:_id', element: DetailNewz, layout: true },
];
