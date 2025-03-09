import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListPositionApi = (params) => getData('/web/position/getListPosition', params);
export const detailPositionApi = (params) => getData('/web/position/detailPosition', params);
export const deletePositionApi = (params) => deleteData('/web/position/deletePosition', params);
export const createPositionApi = (params) => postData('/web/position/createPosition', params);
export const updatePositionApi = (params) => putData('/web/position/updatePosition', params);
