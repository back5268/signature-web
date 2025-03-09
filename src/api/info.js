import { getData } from '@lib/axios';

export const getListAccountInfoApi = (params) => getData('/info/getListAccountInfo', params);
export const getListBankInfoApi = (params) => getData('/info/getListBankInfo', params);
export const getListPositionInfoApi = (params) => getData('/info/getListPositionInfo', params);
export const getListJobPositionInfoApi = (params) => getData('/info/getListJobPositionInfo', params);
export const getListDepartmentInfoApi = (params) => getData('/info/getListDepartmentInfo', params);
export const getListShiftInfoApi = (params) => getData('/info/getListShiftInfo', params);
export const getListMonthInfoApi = (params) => getData('/info/getListMonthInfo', params);
