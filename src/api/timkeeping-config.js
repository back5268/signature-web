import { getData, putData } from '@lib/axios';

export const updateConfigTimekeepingApi = (params) => putData('/web/timekeeping-config/updateConfig', params, true);
export const getConfigTimekeepingApi = (params) => getData('/web/timekeeping-config/getConfig', params);
