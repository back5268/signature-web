import { getData, putData } from '@lib/axios';

export const getListApprovedPayslipApi = (params) => getData('/web/approved-payslip/getListSalary', params);
export const detailApprovedPayslipApi = (params) => getData('/web/approved-payslip/detailSalary', params);
export const previewApprovedPayslipApi = (params) => getData('/web/approved-payslip/previewSalary', params);
export const updateStatusApprovedPayslipApi = (params) => putData('/web/approved-payslip/updateStatusSalary', params);
export const downloadApprovedPayslipApi = (params) => getData('/web/approved-payslip/download', params);
