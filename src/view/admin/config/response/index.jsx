import { getListResponseApi } from '@api';
import { DataTable, FormList, DataFilter, TimeBody } from '@components/base';
import { Calendarzz, Columnz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { DetailResponse } from './Detail';

export const Response = () => {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const { isLoading, data } = useGetApi(getListResponseApi, params, 'response');

  return (
    <FormList title="Dữ liệu thu thập">
      <DetailResponse open={open} setOpen={setOpen} setParams={setParams} data={data?.documents} />
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-6/12">
        <Calendarzz
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          label="Khoảng thời gian"
          value={filter.dates}
          onChange={(e) => setFilter({ ...filter, dates: e.value })}
          className='lg:w-6/12'
        />
      </DataFilter>
      <DataTable
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['create', 'detail', 'delete']}
        setShow={setOpen}
        actionsInfo={{
          onViewDetail: (item) => setOpen(item._id)
        }}
        headerInfo={{ onCreate: () => setOpen(true) }}
      >
        <Columnz header="Tiêu đề" field="title" />
        <Columnz header="Thời gian cập nhật" body={(e) => TimeBody(e.createdAt)} />
        <Columnz header="Thời gian tạo" body={(e) => TimeBody(e.updatedAt)} />
      </DataTable>
    </FormList>
  );
};
