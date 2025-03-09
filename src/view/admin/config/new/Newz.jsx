import { deleteNewApi, getListNewApi, updateNewApi } from '@api';
import { DataTable, DataFilter, UserBody } from '@components/base';
import { Columnz, Inputzz, Tagz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import { useDataState } from '@store';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Newz = () => {
  const navigate = useNavigate();
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const { isLoading, data } = useGetApi(getListNewApi, params, 'new');
  const { departments } = useDataState();

  const Body = (data = [], value = []) => {
    let arr = [];
    value.forEach((v) => {
      const item = data.find((d) => d._id === v);
      if (item) arr.push(item.name || item.fullName);
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
    <>
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-3/4">
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo tiêu đề"
        />
      </DataFilter>
      <DataTable
        title="tin tức"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['create', 'detail', 'delete']}
        actionsInfo={{
          onViewDetail: (item) => navigate(`/new/detail/${item._id}`),
          deleteApi: deleteNewApi
        }}
        statusInfo={{ changeStatusApi: updateNewApi }}
        headerInfo={{
          onCreate: () => {
            navigate('/new/create');
          }
        }}
      >
        <Columnz header="Tiêu đề" field="subject" />
        <Columnz header="Phòng ban hiển thị" body={(e) => Body(departments, e.departments)} />
        <Columnz header="Thời gian cập nhật" body={(e) => UserBody(e.updatedAt, e.updatedBy)} />
      </DataTable>
    </>
  );
};
