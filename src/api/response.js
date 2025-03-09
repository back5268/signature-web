import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListResponseApi = (params) => getData('/web/response/getListResponse', params);
