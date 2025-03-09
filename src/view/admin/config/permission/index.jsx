import { deletePermissionApi, getListPermissionApi, getListPositionInfoApi, updatePermissionApi } from '@api';
import { DataTable, FormList, DataFilter, UserBody } from '@components/base';
import { Columnz, Inputzz, Tagz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import { useDataState } from '@store';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export * from './Detail'

export const Permission = () => {
  const navigate = useNavigate();
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const { isLoading, data } = useGetApi(getListPermissionApi, params, 'permission');
  const { accounts } = useDataState();

  const Body = (data = [], value = [], key = "name") => {
    let arr = []
    value.forEach(v => {
      const item = data.find(d => d._id === v)
      if (item) arr.push(item[key])
    })
    return <div className='flex flex-wrap gap-2'>
      {arr.map((a, index) => <Tagz key={index} value={a} className="text-center" />)}
    </div>
  }

  return (
    <FormList title="Danh sách nhóm quyền">
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-3/4">
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo tên"
        />
      </DataFilter>
      <DataTable
        title="Nhóm quyền"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['create', 'detail', 'delete']}
        actionsInfo={{
          onViewDetail: (item) => navigate(`/permission/detail/${item._id}`),
          deleteApi: deletePermissionApi
        }}
        statusInfo={{ changeStatusApi: updatePermissionApi }}
        headerInfo={{
          onCreate: () => {
            navigate('/permission/create');
          }
        }}
      >
        <Columnz header="Tên nhóm quyền" field="name" />
        <Columnz header="Tài khoản áp dụng" body={e => Body(accounts, e.accounts, "fullName")} />
        <Columnz header="Thời gian cập nhật" body={(e) => UserBody(e.updatedAt, e.updatedBy)} />
      </DataTable>
    </FormList>
  );
};
