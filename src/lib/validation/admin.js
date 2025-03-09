import { REGEX } from '@constant';
import * as yup from 'yup';

export const PositionValidation = yup.object({
  name: yup.string().required('Tên chức vụ không được bỏ trống!'),
  code: yup.string().required('Mã chức vụ không được bỏ trống!')
});

export const JobPositionValidation = yup.object({
  name: yup.string().required('Tên công việc không được bỏ trống!'),
  code: yup.string().required('Mã công việc không được bỏ trống!')
});

export const DepartmentValidation = yup.object({
  name: yup.string().required('Tên phòng ban không được bỏ trống!'),
  code: yup.string().required('Mã phòng ban không được bỏ trống!')
});

export const EmployeeValidation = yup.object({
  staffCode: yup.string().required('Mã nhân viên không được bỏ trống!'),
  fullName: yup.string().required('Tên nhân viên không được bỏ trống!'),
  email: yup.string().email('Email không đúng định dạng!').required('Email không được bỏ trống!'),
  phone: yup.string().matches(REGEX.C_PHONE, 'Số điện thoại không đúng định dạng!').required('Số điện thoại không được bỏ trống!'),
  birthday: yup.string().required('Ngày sinh không được bỏ trống!'),
  cmt: yup.string().required('Số chứng minh thư không được bỏ trống!'),
  dateOfIssue: yup.string().required('Ngày cấp không được bỏ trống!'),
  placeOfIssue: yup.string().required('Nơi cấp không được bỏ trống!'),
  address: yup.string().required('Địa chỉ thường trú không được bỏ trống!'),
  department: yup.string().required('Phòng ban không được bỏ trống!'),
  position: yup.string().required('Chức vụ không được bỏ trống!'),
  jobPosition: yup.string().required('Vị trí công việc không được bỏ trống!'),
  bankAccount: yup
    .string()
    .required('Số tài khoản không được bỏ trống!')
    .min(6, 'Số tài khoản phải có ít nhất 6 ký tự!')
    .max(15, 'Số tài khoản không được vượt quá 15 ký tự!'),
  bank: yup.string().required('Ngân hàng không được bỏ trống!'),
  nationality: yup.string().required('Quốc tịch không được bỏ trống!'),
  dateIn: yup.string().required('Ngày vào không được bỏ trống!'),
  salary: yup
    .number()
    .required('Lương cơ bản không được bỏ trống!')
    .typeError('Lương cơ bản không được bỏ trống!')
    .max(1000000000, 'Lương cơ bản không được lớn hơn 1 tỷ!')
});

export const ContractValidation = yup.object({
  code: yup.string().required('Số hợp đồng không được bỏ trống!'),
  type: yup.number().required('Loại hợp đồng không được bỏ trống!'),
  signedDate: yup.string().required('Ngày ký không được bỏ trống!'),
  expiredDate: yup.string().required('Ngày hết hạn không được bỏ trống!')
});

export const TemplateValidation = yup.object({
  title: yup.string().required('Tiêu đề không được bỏ trống!'),
  content: yup.string().required('Nội dung không được bỏ trống!')
});

export const PermissionValidation = yup.object({
  name: yup.string().required('Tên nhóm quyền không được bỏ trống!')
});

export const NewValidation = yup.object({
  subject: yup.string().required('Tiêu đề không được bỏ trống!')
});

export const DeviceValidation = yup.object({
  name: yup.string().required('Tên thiết bị không được bỏ trống!'),
  code: yup.string().required('Mã thiết bị không được bỏ trống!'),
  type: yup.string().required('Loại thiết bị không được bỏ trống!')
});

export const ShiftValidation = yup.object({
  name: yup.string().required('Tên ca làm việc không được bỏ trống!'),
  code: yup.string().required('Mã ca làm việc không được bỏ trống!'),
  dateStart: yup.string().required('Ngày áp dụng không được bỏ trống!'),
  dateEnd: yup.string()
});

export const ApplicationValidation = yup.object({
  department: yup.string().required('Phòng ban không được bỏ trống!'),
  account: yup.string().required('Nhân viên không được bỏ trống!'),
  shift: yup.string().required('Ca làm việc không được bỏ trống!'),
  type: yup.string().required('Loại đơn không được bỏ trống!'),
  reason: yup.string().required('Lý do không được bỏ trống!')
});

export const BonusValidation = yup.object({
  name: yup.string().required('Tiêu đề không được bỏ trống!'),
  month: yup.string().required('Tháng không được bỏ trống!'),
  departments: yup.array().required('Phòng ban áp dụng không được bỏ trống!'),
  accounts: yup.array().required('Nhân viên áp dụng không được bỏ trống!'),
  value: yup.string().required('Giá trị áp dụng thưởng không được bỏ trống!'),
});

export const SalarySetupValidation = yup.object({
  salaryCoefficient: yup.string().required('Hệ số không được bỏ trống!'),
  bhxh: yup.string().required('Bảo hiểm xã hội không được bỏ trống!'),
  bhyt: yup.string().required('Bảo hiểm y tế không được bỏ trống!'),
  bhtn: yup.string().required('Bảo hiểm thất nghiệp không được bỏ trống!'),
  unionDues: yup.string().required('Phí công đoàn không được bỏ trống!'),
  day: yup.string().required('Ngày thường không được bỏ trống!'),
  sunday: yup.string().required('Chủ nhật không được bỏ trống!'),
  holiday: yup.string().required('Ngày lễ không được bỏ trống!')
});

export const TaxSetupValidation = yup.object({
  self: yup.string().required('Giảm trừ bản thân không được bỏ trống!'),
  dependent: yup.string().required('Giảm trừ phụ thuộc không được bỏ trống!')
});

export const SalaryCalculationValidation = yup.object({
  month: yup.string().required('Tháng không được bỏ trống!'),
  dates: yup.array().required('Khoảng thời gian tính không được bỏ trống!'),
  departments: yup.array().required('Phòng ban không được bỏ trống!'),
  accounts: yup.array().required('Nhân viên không được bỏ trống!')
});
