import { deleteData, getData, postData, putData } from '@lib/axios';

export const getListDeviceApi = (params) => getData('/web/device/getListDevice', params);
export const detailDeviceApi = (params) => getData('/web/device/detailDevice', params);
export const deleteDeviceApi = (params) => deleteData('/web/device/deleteDevice', params);
export const createDeviceApi = (params) => postData('/web/device/createDevice', params);
export const updateDeviceApi = (params) => putData('/web/device/updateDevice', params);
