import { deleteJobPositionApi, getListJobPositionApi, updateJobPositionApi } from '@api';
import { DataTable, FormList, DataFilter, UserBody } from '@components/base';
import { Columnz, Inputzz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export * from './Detail'

export const JobPosition = () => {
  const navigate = useNavigate();
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const { isLoading, data } = useGetApi(getListJobPositionApi, params, 'job-position');

  return (
    <FormList title="Danh sách vị trí công việc">
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-3/4">
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo tên, mã"
        />
      </DataFilter>
      <DataTable
        title="Vị trí công việc"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['create', 'detail', 'delete']}
        actionsInfo={{
          onViewDetail: (item) => navigate(`/job-position/detail/${item._id}`),
          deleteApi: deleteJobPositionApi
        }}
        statusInfo={{ changeStatusApi: updateJobPositionApi }}
        headerInfo={{
          onCreate: () => {
            navigate('/job-position/create');
          }
        }}
      >
        <Columnz header="Tên công việc" field="name" />
        <Columnz header="Mã công việc" field="code" />
        <Columnz header="Thời gian cập nhật" body={(e) => UserBody(e.updatedAt, e.updatedBy)} />
      </DataTable>
    </FormList>
  );
};
