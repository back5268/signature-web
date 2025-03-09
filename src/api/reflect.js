import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListReflectApi = (params) => getData('/web/reflect/getListReflect', params);
