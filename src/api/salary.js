import { getData, putData } from '@lib/axios';

export const getListSalaryApi = (params) => getData('/web/salary/getListSalary', params);
export const detailSalaryApi = (params) => getData('/web/salary/detailSalary', params);
export const previewSalaryApi = (params) => getData('/web/salary/previewSalary', params);
export const updateStatusSalaryApi = (params) => putData('/web/salary/updateStatusSalary', params);
export const downloadSalaryApi = (params) => getData('/web/salary/download', params);
export const exportSalaryApi = (params) => getData('/web/salary/exportSalary', params, true);
export const exportSummarySalaryApi = (params) => getData('/web/salary/exportSummarySalary', params, true);
