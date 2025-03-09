import { getData } from '@lib/axios';

export const getListScheduleApi = (params) => getData('/web/schedule/getListSchedule', params);
export const exportScheduleApi = (params) => getData('/web/schedule/exportSchedule', params, true);
