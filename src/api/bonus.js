import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListBonusApi = (params) => getData('/web/bonus/getListBonus', params);
export const detailBonusApi = (params) => getData('/web/bonus/detailBonus', params);
export const deleteBonusApi = (params) => deleteData('/web/bonus/deleteBonus', params);
export const createBonusApi = (params) => postData('/web/bonus/createBonus', params);
export const updateBonusApi = (params) => putData('/web/bonus/updateBonus', params);
