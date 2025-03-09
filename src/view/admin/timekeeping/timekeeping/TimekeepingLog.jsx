import { exportTimekeepingLogApi, getListTimekeepingLogApi } from '@api';
import { DataTable, DataFilter, Body, TimeBody } from '@components/base';
import { Calendarzz, Columnz, Dropdownzz } from '@components/core';
import { days } from '@constant';
import { databaseDate } from '@lib/helper';
import { useGetApi } from '@lib/react-query';
import { useDataState } from '@store';
import React, { useState } from 'react';

const handleParams = (params) => {
  if (Array.isArray(params.dates) && params.dates.length > 0) {
    params.fromDate = databaseDate(params.dates[0], 'date');
    params.toDate = params.dates[1] ? databaseDate(params.dates[1], 'date', true) : databaseDate(params.dates[0], 'date', true);
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
export const TimekeepingLog = () => {
  const [params, setParams] = useState(INITPARAMS);
  const [filter, setFilter] = useState(INITPARAMS);
  const { departments, accounts } = useDataState();
  const { isLoading, data } = useGetApi(getListTimekeepingLogApi, handleParams(params), 'timekeepingLog');

  return (
    <>
      <DataFilter
        setParams={setParams}
        filter={filter}
        setFilter={setFilter}
        handleClear={() => {
          setParams((pre) => ({ ...INITPARAMS, page: pre.page, limit: pre.limit }));
          setFilter(INITPARAMS);
        }}
        className="lg:w-1/4"
      >
        <Calendarzz
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          label="Khoảng thời gian (*)"
          value={filter.dates}
          onChange={(e) => setFilter({ ...filter, dates: e.value })}
        />
        <Dropdownzz
          value={filter.department}
          onChange={(e) => setFilter({ ...filter, department: e.target.value, account: undefined })}
          options={departments}
          label="Phòng ban"
          showClear
          filter
        />
        <Dropdownzz
          value={filter.account}
          onChange={(e) => setFilter({ ...filter, account: e.target.value })}
          options={filter.department ? accounts.filter((a) => a.department === filter.department) : accounts}
          optionLabel="fullName"
          label="Nhân viên"
          showClear
        />
      </DataFilter>
      <DataTable
        title="Lịch sử chấm công"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['export']}
        headerInfo={{ exportApi: (params) => exportTimekeepingLogApi(handleParams(params)) }}
        hideParams
      >
        <Columnz header="Phòng ban" body={(e) => Body(departments, e.department)} />
        <Columnz header="Nhân viên" body={(e) => Body(accounts, e.account, '_id', 'fullName')} />
        <Columnz header="Mã NV" body={(e) => Body(accounts, e.account, '_id', 'staffCode')} />
        <Columnz header="Ngày" body={(e) => TimeBody(e.date, 'date')} />
        <Columnz header="Ngày trong tuần" body={(e) => days[new Date(e.date).getDay()]?.name} />
        <Columnz header="Thời gian" field="time" />
        <Columnz header="Thiết bị chấm công" field="deviceName" />
      </DataTable>
    </>
  );
};
