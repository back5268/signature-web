import { getData, postData, deleteData } from '@lib/axios';

export const getListResponseApi = (params) => getData('/web/response/getListResponse', params);
export const createResponseApi = (params) => postData('/info/createResponse', params);
export const detailResponseApi = (params) => getData('/info/detailResponse', params);
export const deleteResponseApi = (params) => deleteData('/web/response/deleteResponse', params);
export const exportResponseApi = (params) => getData('/web/response/exportResponse', params, true);
