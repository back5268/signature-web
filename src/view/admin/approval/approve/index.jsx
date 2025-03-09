import { getListAppproveApi, getListShiftInfoApi } from '@api';
import { DataTable, FormList, DataFilter, UserBody, Body } from '@components/base';
import { Columnz, Dropdownzz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import React, { useEffect, useState } from 'react';
import { useDataState, useItemState } from '@store';
import { applicationStatus } from '@constant';
import { DetailApprove } from './Detail';
import { CreateApprove } from './Create';

export const Approve = () => {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const [openz, setOpenz] = useState(false);
  const { isLoading, data } = useGetApi(getListAppproveApi, params, 'approve');
  const { data: shifts } = useGetApi(getListShiftInfoApi, {}, 'shifts');
  const { departments, accounts } = useDataState();
  const { item, setItem } = useItemState();

  useEffect(() => {
    if (item?.application && !open) {
      setOpen(item?.application);
      setItem({});
    }
  }, [item?.application]);

  return (
    <FormList title="Danh sách phê duyệt">
      <DetailApprove
        open={open}
        setOpen={setOpen}
        setParams={setParams}
        data={data?.documents}
        shifts={shifts}
        departments={departments}
        accounts={accounts}
      />
      <CreateApprove
        open={openz}
        setOpen={setOpenz}
        setParams={setParams}
        shifts={shifts}
        departments={departments}
        accounts={accounts}
      />
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter}>
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
        <Dropdownzz
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          options={applicationStatus}
          label="Trạng thái"
          showClear
        />
      </DataFilter>
      <DataTable
        title="phê duyệt"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['detail', 'create']}
        setShow={setOpen}
        actionsInfo={{
          onViewDetail: (item) => setOpen(item._id)
        }}
        headerInfo={{ onCreate: () => setOpenz(true) }}
      >
        <Columnz header="Phòng ban" body={(e) => Body(departments, e.department)} />
        <Columnz header="Nhân viên" body={(e) => <span className="text-nowrap">{Body(accounts, e.account, '_id', 'fullName')}</span>} />
        <Columnz header="Mã NV" body={(e) => Body(accounts, e.account, '_id', 'staffCode')} />
        <Columnz header="Loại đơn" body={(e) => "Đơn xin nghỉ dài hạn"} />
        <Columnz header="Lý do tạo đơn" field="reason" />
        <Columnz header="Thời gian duyệt" body={(e) => UserBody(e.updatedAt, e.updatedBy)} />
        <Columnz header="Trạng thái" body={(e) => Body(applicationStatus, e.status)} />
      </DataTable>
    </FormList>
  );
};
