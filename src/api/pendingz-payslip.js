import { getData, putData } from '@lib/axios';

export const getListPendingzPayslipApi = (params) => getData('/web/pendingz-payslip/getListSalary', params);
export const detailPendingzPayslipApi = (params) => getData('/web/pendingz-payslip/detailSalary', params);
export const previewPendingzPayslipApi = (params) => getData('/web/pendingz-payslip/previewSalary', params);
export const updateStatusPendingzPayslipApi = (params) => putData('/web/pendingz-payslip/updateStatusSalary', params);
export const downloadPendingzPayslipApi = (params) => getData('/web/pendingz-payslip/download', params);
