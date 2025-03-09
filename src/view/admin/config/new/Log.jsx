import { getListLogApi } from '@api';
import { DataTable, DataFilter, TimeBody, Body } from '@components/base';
import { Columnz, Inputzz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { DetailLog } from './DetailLog';
import { logStatus } from '@constant';

export const Log = () => {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const { isLoading, data } = useGetApi(getListLogApi, params, 'Log');

  return (
    <>
      <DetailLog open={open} setOpen={setOpen} setParams={setParams} data={data?.documents} />
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-3/4">
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo tiêu đề, địa chỉ gửi"
        />
      </DataFilter>
      <DataTable
        title="Lịch sử gửi mail"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['detail']}
        setShow={setOpen}
        actionsInfo={{
          onViewDetail: (item) => setOpen(item._id)
        }}
      >
        <Columnz header="Tiêu đề" field="subject" />
        <Columnz header="Địa chỉ gửi" field="to" />
        <Columnz header="Trạng thái" body={e => Body(logStatus, e.status)} />
        <Columnz header="Nội dung lỗi" field="mess" />
        <Columnz header="Thời gian gửi" body={e => TimeBody(e.createdAt)} />
      </DataTable>
    </>
  );
};
