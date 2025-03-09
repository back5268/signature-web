import { getData, postData, putData } from '@lib/axios';

export const getListSalaryLogApi = (params) => getData('/web/salary-calculation/getListSalaryLog', params);
export const calculateSalaryApi = (params) => postData('/web/salary-calculation/calculateSalary', params);
export const updateConfigSalaryApi = (params) => putData('/web/salary-calculation/updateConfig', params, true);
export const getConfigApi = (params) => getData('/web/salary-calculation/getConfig', params);
