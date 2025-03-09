import { deleteDepartmentApi, getListDepartmentApi, getListDepartmentInfoApi, updateDepartmentApi } from '@api';
import { DataTable, FormList, DataFilter, UserBody } from '@components/base';
import { Columnz, Inputzz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { DetailDepartment } from './Detail';
import { useDataState } from '@store';

export const Department = () => {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const { isLoading, data } = useGetApi(getListDepartmentApi, params, 'department');
  const { setDepartments } = useDataState();

  const onSuccess = async () => {
    const response = await getListDepartmentInfoApi();
    if (response) setDepartments(response);
  };

  return (
    <FormList title="Danh sách phòng ban">
      <DetailDepartment open={open} setOpen={setOpen} setParams={setParams} data={data?.documents} />
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-3/4">
        <Inputzz value={filter.keySearch} onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })} label="Tìm kiếm theo tên, mã" />
      </DataFilter>
      <DataTable
        title="Phòng ban"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['create', 'detail', 'delete']}
        setShow={setOpen}
        actionsInfo={{
          onViewDetail: (item) => setOpen(item._id),
          deleteApi: deleteDepartmentApi,
        }}
        statusInfo={{ changeStatusApi: updateDepartmentApi }}
        headerInfo={{ onCreate: () => setOpen(true) }}
        onSuccess={onSuccess}
      >
        <Columnz header="Tên phòng ban" field="name" />
        <Columnz header="Mã phòng ban" field="code" />
        <Columnz header="Mô tả" field="description" />
        <Columnz header="Thời gian cập nhật" body={(e) => UserBody(e.updatedAt, e.updatedBy)} />
      </DataTable>
    </FormList>
  );
};
