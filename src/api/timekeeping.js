import { getData, postData, putData } from '@lib/axios';

export const getListTimekeepingLogApi = (params) => getData('/web/timekeeping/getListTimekeepingLog', params);
export const getListTimekeepingApi = (params) => getData('/web/timekeeping/getListTimekeeping', params);
export const getListSyntheticTimekeepingApi = (params) => getData('/web/timekeeping/getListSyntheticTimekeeping', params);
export const exportTimekeepingLogApi = (params) => getData('/web/timekeeping/exportTimekeepingLog', params, true);
export const exportTimekeepingApi = (params) => getData('/web/timekeeping/exportTimekeeping', params, true);
export const exportSyntheticTimekeepingApi = (params) => getData('/web/timekeeping/exportSyntheticTimekeeping', params, true);
export const importTimekeepingApi = (params) => putData('/web/timekeeping/importTimekeeping', params, true, true);
export const importFileApi = (params) => postData('/up', params, true, true);
