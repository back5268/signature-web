import { deleteDeviceApi, getListDeviceApi, updateDeviceApi } from '@api';
import { DataTable, FormList, DataFilter, UserBody, Body } from '@components/base';
import { Columnz, Dropdownzz, Inputzz, Tagz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { DetailDevice } from './Detail';
import { deviceTypes, status } from '@constant';
import { useDataState } from '@store';

export const Device = () => {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const { isLoading, data } = useGetApi(getListDeviceApi, params, 'device');
  const { departments } = useDataState();

  const Bodyz = (data = [], value = []) => {
    let arr = []
    value.forEach(v => {
      const item = data.find(d => d._id === v)
      if (item) arr.push(item.name)
    })
    return <div className='flex flex-wrap gap-2'>
      {arr.map((a, index) => <Tagz key={index} value={a} className="text-center" />)}
    </div>
  }

  return (
    <FormList title="Danh sách máy chấm công">
      <DetailDevice open={open} setOpen={setOpen} setParams={setParams} data={data?.documents} departments={departments} />
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-full">
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo tên, mã"
        />
        <Dropdownzz
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          options={deviceTypes}
          label="Loại thiết bị"
          showClear
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
        title="máy chấm công"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['create', 'detail', 'delete']}
        setShow={setOpen}
        actionsInfo={{
          onViewDetail: (item) => setOpen(item._id),
          deleteApi: deleteDeviceApi
        }}
        statusInfo={{ changeStatusApi: updateDeviceApi }}
        headerInfo={{ onCreate: () => setOpen(true) }}
      >
        <Columnz header="Tên thiết bị" field="name" />
        <Columnz header="Mã thiết bị" field="code" />
        <Columnz header="Loại thiết bị" body={e => Body(deviceTypes, e.type)} />
        <Columnz header="Phòng ban áp dụng" body={e => Bodyz(departments, e.departments)} />
        <Columnz header="Thời gian cập nhật" body={(e) => UserBody(e.updatedAt, e.updatedBy)} />
      </DataTable>
    </FormList>
  );
};
