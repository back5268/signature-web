import { deleteData, getData, putData } from '@lib/axios';

export const getListPendingPayslipApi = (params) => getData('/web/pending-payslip/getListSalary', params);
export const detailPendingPayslipApi = (params) => getData('/web/pending-payslip/detailSalary', params);
export const previewPendingPayslipApi = (params) => getData('/web/pending-payslip/previewSalary', params);
export const deletePendingPayslipApi = (params) => deleteData('/web/pending-payslip/deleteSalary', params);
export const deletePendingPayslipsApi = (params) => deleteData('/web/pending-payslip/deleteSalarys', params);
export const updateStatusPendingPayslipApi = (params) => putData('/web/pending-payslip/updateStatusSalary', params);
export const downloadPendingPayslipApi = (params) => getData('/web/pending-payslip/download', params);
