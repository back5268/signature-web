import { getListImportLogApi } from '@api';
import { DataTable, DataFilter, Body, TimeBody, FormList, UserBody } from '@components/base';
import { Calendarzz, Columnz, Dropdownzz, Inputzz } from '@components/core';
import { days, importLogStatus } from '@constant';
import { databaseDate } from '@lib/helper';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';

const handleParams = (params) => {
  if (Array.isArray(params.dates) && params.dates.length > 0) {
    params.fromDate = databaseDate(params.dates[0]);
    params.toDate = params.dates[1] ? databaseDate(params.dates[1], undefined, true) : databaseDate(params.dates[0], undefined, true);
  }
  return { ...params, dates: undefined };
};

const today = new Date();
const INITPARAMS = {
  page: 1,
  limit: 10,
  dates: [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6),
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  ]
};
export const ImportLog = () => {
  const [params, setParams] = useState(INITPARAMS);
  const [filter, setFilter] = useState(INITPARAMS);
  const { isLoading, data } = useGetApi(getListImportLogApi, handleParams(params), 'importLog');

  return (
    <FormList title="Lịch sử import">
      <DataFilter
        setParams={setParams}
        filter={filter}
        setFilter={setFilter}
        handleClear={() => {
          setParams((pre) => ({ ...INITPARAMS, page: pre.page, limit: pre.limit }));
          setFilter(INITPARAMS);
        }}
        className="lg:w-3/12"
      >
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo mã nhân viên, mã ca, mã thiết bị"
        />
        <Dropdownzz
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value, account: undefined })}
          options={importLogStatus}
          label="Trạng thái"
        />
        <Calendarzz
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          label="Khoảng thời gian import (*)"
          value={filter.dates}
          onChange={(e) => setFilter({ ...filter, dates: e.value })}
        />
      </DataFilter>
      <DataTable
        title="lịch sử import"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        hideParams
      >
        <Columnz header="Mã thiết bị" field="deviceCode" />
        <Columnz header="Mã nhân viên" field="staffCode" />
        <Columnz header="Mã ca" field="shiftCode" />
        <Columnz header="Ngày" body={(e) => TimeBody(e.date, 'date')} />
        <Columnz header="Ngày trong tuần" body={(e) => days[new Date(e.date).getDay()]?.name} />
        <Columnz header="Thời gian vào" field="timeStart" />
        <Columnz header="Thời gian ra" field="timeEnd" />
        <Columnz header="Thời gian import" body={(e) => UserBody(e.createdAt, e.by)} />
        <Columnz header="Trạng thái" body={(e) => Body(importLogStatus, e.status)} />
        <Columnz header="Thông báo lỗi" field="mess" />
      </DataTable>
    </FormList>
  );
};
