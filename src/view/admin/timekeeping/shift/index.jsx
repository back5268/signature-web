import { deleteShiftApi, getListShiftApi, updateShiftApi } from '@api';
import { DataTable, FormList, DataFilter, UserBody } from '@components/base';
import { Columnz, Dropdownzz, Inputzz, Tagz } from '@components/core';
import { status } from '@constant';
import { DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import { useDataState } from '@store';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export * from './Detail';

export const Shift = () => {
  const navigate = useNavigate();
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const { isLoading, data } = useGetApi(getListShiftApi, params, 'shift');
  const { departments } = useDataState();

  const Bodyz = (data = [], value = []) => {
    let arr = [];
    value.forEach((v) => {
      const item = data.find((d) => d._id === v);
      if (item) arr.push(item.name);
    });
    return (
      <div className="flex flex-wrap gap-2">
        {arr.map((a, index) => (
          <Tagz key={index} value={a} className="text-center" />
        ))}
      </div>
    );
  };

  return (
    <FormList title="Danh sách ca làm việc">
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter}>
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo tên, mã"
        />
        <Dropdownzz
          value={filter.department}
          onChange={(e) => setFilter({ ...filter, department: e.target.value })}
          options={departments}
          label="Phòng ban"
          showClear
          filter
        />
        <Dropdownzz
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          options={status}
          label="Trạng thái"
          showClear
        />
      </DataFilter>
      <DataTable
        title="ca làm việc"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['create', 'detail']}
        actionsInfo={{
          onViewDetail: (item) => navigate(`/shift/detail/${item._id}`),
          deleteApi: deleteShiftApi,
          moreActions: [
            {
              icon: DocumentDuplicateIcon,
              onClick: (item) => navigate(`/shift/create/${item._id}`)
            }
          ]
        }}
        statusInfo={{ changeStatusApi: updateShiftApi }}
        headerInfo={{
          onCreate: () => {
            navigate('/shift/create');
          }
        }}
      >
        <Columnz header="Tên ca làm việc" field="name" />
        <Columnz header="Mã ca làm việc" field="code" />
        <Columnz header="Phòng ban áp dụng" body={(e) => Bodyz(departments, e.departments)} />
        <Columnz header="Thời gian cập nhật" body={(e) => UserBody(e.updatedAt, e.updatedBy)} />
      </DataTable>
    </FormList>
  );
};
