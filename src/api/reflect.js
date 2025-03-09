import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListReflectApi = (params) => getData('/web/reflect/getListReflect', params);
export const deleteReflectApi = (params) => deleteData('/web/reflect/deleteReflect', params);
export const createReflectApi = (params) => postData('/web/reflect/createReflect', params, true);
