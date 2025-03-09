import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListEmployeeApi = (params) => getData('/web/employee/getListEmployee', params);
export const getListWorkHistoryApi = (params) => getData('/web/employee/getListWorkHistory', params);
export const detailEmployeeApi = (params) => getData('/web/employee/detailEmployee', params);
export const deleteEmployeeApi = (params) => deleteData('/web/employee/deleteEmployee', params);
export const createEmployeeApi = (params) => postData('/web/employee/createEmployee', params, true);
export const updateEmployeeApi = (params) => putData('/web/employee/updateEmployee', params, true);
export const resetPasswordApi = (params) => putData('/web/employee/resetPassword', params);

export const getListContractApi = (params) => getData('/web/contract/getListContract', params);
export const deleteContractApi = (params) => deleteData('/web/contract/deleteContract', params);
export const createContractApi = (params) => postData('/web/contract/createContract', params);
export const updateContractApi = (params) => putData('/web/contract/updateContract', params);
export const cancelContractApi = (params) => putData('/web/contract/cancelContract', params);
export const previewContractApi = (params) => getData('/web/contract/previewContract', params);
export const downloadContractApi = (params) => getData('/web/contract/download', params);
