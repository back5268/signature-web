import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListJobPositionApi = (params) => getData('/web/job-position/getListJobPosition', params);
export const detailJobPositionApi = (params) => getData('/web/job-position/detailJobPosition', params);
export const deleteJobPositionApi = (params) => deleteData('/web/job-position/deleteJobPosition', params);
export const createJobPositionApi = (params) => postData('/web/job-position/createJobPosition', params);
export const updateJobPositionApi = (params) => putData('/web/job-position/updateJobPosition', params);
