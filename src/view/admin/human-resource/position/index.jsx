import { deletePositionApi, getListPositionApi, updatePositionApi } from '@api';
import { DataTable, FormList, DataFilter, UserBody } from '@components/base';
import { Columnz, Inputzz } from '@components/core';
import { useGetParams } from '@hooks';
import { formatNumber } from '@lib/helper';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export * from './Detail';

export const Position = () => {
  const navigate = useNavigate();
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const { isLoading, data } = useGetApi(getListPositionApi, params, 'position');

  return (
    <FormList title="Danh sách chức vụ">
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-3/4">
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo tên, mã"
        />
      </DataFilter>
      <DataTable
        title="Chức vụ"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['create', 'detail', 'delete']}
        actionsInfo={{
          onViewDetail: (item) => navigate(`/position/detail/${item._id}`),
          deleteApi: deletePositionApi
        }}
        statusInfo={{ changeStatusApi: updatePositionApi }}
        headerInfo={{
          onCreate: () => {
            navigate('/position/create');
          }
        }}
      >
        <Columnz header="Tên chức vụ" field="name" />
        <Columnz header="Mã chức vụ" field="code" />
        <Columnz header="Mô tả" field="description" />
        <Columnz header="Trợ cấp" body={e => <div className='flex flex-col gap-2'>
          {e.allowances?.map((item, index) => <div key={index} className='flex gap-2 border-b border-dashed border-border my-2'>
            <span className='text-nowrap'>+ {item.name}:</span>
            <span className='text-nowrap font-medium'>{formatNumber(item.amount)} VNĐ</span>
            <span className='text-nowrap'>{item.type === 1 ? "(Theo tháng)" : "(Theo ngày làm việc)"}</span>
          </div>)}
        </div>} />
        <Columnz header="Thời gian cập nhật" body={(e) => UserBody(e.updatedAt, e.updatedBy)} />
      </DataTable>
    </FormList>
  );
};
