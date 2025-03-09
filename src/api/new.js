import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListNewApi = (params) => getData('/web/new/getListNew', params);
export const detailNewApi = (params) => getData('/web/new/detailNew', params);
export const deleteNewApi = (params) => deleteData('/web/new/deleteNew', params);
export const createNewApi = (params) => postData('/web/new/createNew', params, true);
export const updateNewApi = (params) => putData('/web/new/updateNew', params, true);

export const getListLogApi = (params) => getData('/web/log/getListLog', params);
export const updateLogApi = (params) => putData('/web/log/updateLog', params);
