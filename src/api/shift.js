import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListShiftApi = (params) => getData('/web/shift/getListShift', params);
export const detailShiftApi = (params) => getData('/web/shift/detailShift', params);
export const deleteShiftApi = (params) => deleteData('/web/shift/deleteShift', params);
export const createShiftApi = (params) => postData('/web/shift/createShift', params);
export const updateShiftApi = (params) => putData('/web/shift/updateShift', params);
