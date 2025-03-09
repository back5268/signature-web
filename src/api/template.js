import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListTemplateApi = (params) => getData('/web/template/getListTemplate', params);
export const detailTemplateApi = (params) => getData('/web/template/detailTemplate', params);
export const detailTemplateWebApi = (params) => getData('/info/detailTemplate', params);
export const deleteTemplateApi = (params) => deleteData('/web/template/deleteTemplate', params);
export const createTemplateApi = (params) => postData('/web/template/createTemplate', params);
export const updateTemplateApi = (params) => putData('/web/template/updateTemplate', params);
