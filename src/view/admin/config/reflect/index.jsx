import { deleteReflectApi, getListReflectApi } from '@api';
import { DataTable, FormList, DataFilter, TimeBody } from '@components/base';
import { Calendarzz, Columnz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { handleParams } from '..';

export * from './Detail';
export const Reflect = () => {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const { isLoading, data } = useGetApi(getListReflectApi, handleParams(params), 'reflect');

  return (
    <FormList title="Thông tin phản ánh">
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-6/12">
        <Calendarzz
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          label="Khoảng thời gian"
          value={filter.dates}
          onChange={(e) => setFilter({ ...filter, dates: e.value })}
          className="lg:w-6/12"
        />
      </DataFilter>
      <DataTable
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['delete', 'create']}
        headerInfo={{ onCreate: () => window.open(`/phan-hoi`, '_blank') }}
        actionsInfo={{
          deleteApi: deleteReflectApi
        }}
      >
        <Columnz header="Nội dung" field="content" />
        <Columnz header="File đính kèm" body={e => {
          return <div className='flex flex-col gap-1'>
            {e.images.map(i => <Link to={i} target="_blank" className='text-primary'>{i}</Link>)}
          </div>
        }} />
        <Columnz header="Thời gian cập nhật" body={(e) => TimeBody(e.createdAt)} />
        <Columnz header="Thời gian tạo" body={(e) => TimeBody(e.updatedAt)} />
      </DataTable>
    </FormList>
  );
};
