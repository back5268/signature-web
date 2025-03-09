import { getData, postData, putData } from '@lib/axios';

export const getListApplicationApi = (params) => getData('/web/application/getListApplication', params);
export const getListAppproveApi = (params) => getData('/web/approve/getListAppprove', params);
export const detailApplicationApi = (params) => getData('/web/application/detailApplication', params);
export const updateApplicationApi = (params) => putData('/web/application/updateApplication', params);
export const createApplicationApi = (params) => postData('/web/application/createApplication', params, true);
