import { getData } from '@lib/axios';

export const getListImportLogApi = (params) => getData('/web/import-log/getListImportLog', params);
