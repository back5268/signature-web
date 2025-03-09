import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListDepartmentApi = (params) => getData('/web/department/getListDepartment', params);
export const detailDepartmentApi = (params) => getData('/web/department/detailDepartment', params);
export const deleteDepartmentApi = (params) => deleteData('/web/department/deleteDepartment', params);
export const createDepartmentApi = (params) => postData('/web/department/createDepartment', params);
export const updateDepartmentApi = (params) => putData('/web/department/updateDepartment', params);
