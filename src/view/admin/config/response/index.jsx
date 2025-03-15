import { deleteResponseApi, getListResponseApi, getListTemplateInfoApi } from '@api';
import { DataTable, FormList, DataFilter, TimeBody } from '@components/base';
import { Calendarzz, Columnz, Dropdownzz } from '@components/core';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useGetParams } from '@hooks';
import { databaseDate } from '@lib/helper';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';

export * from './Detail';
export const handleParams = (params) => {
  if (params.dates?.[0]) {
    params.from = databaseDate(params.dates?.[0]);
    params.to = params.dates?.[1] ? databaseDate(params.dates?.[1], false, true) : databaseDate(params.dates?.[0], false, true);
    params.dates = undefined;
  } else {
    if (params.from) params.from = databaseDate(params.from);
    if (params.to) params.to = databaseDate(params.to);
  }
  return params;
};
export const Response = () => {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const { isLoading, data } = useGetApi(getListResponseApi, handleParams(params), 'response');
  const { data: templates } = useGetApi(getListTemplateInfoApi, {}, 'templates');

  return (
    <FormList title="Dữ liệu thu thập">
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-3/12">
        <Calendarzz
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          label="Khoảng thời gian"
          value={filter.dates}
          onChange={(e) => setFilter({ ...filter, dates: e.value })}
          className="lg:w-6/12"
        />
        <Dropdownzz
          value={filter.template}
          onChange={(e) => setFilter({ ...filter, template: e.target.value })}
          options={templates}
          label="Loại đơn"
          showClear
          optionLabel="title"
        />
      </DataFilter>
      <DataTable
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['delete']}
        actionsInfo={{
          moreActions: [
            {
              icon: DocumentMagnifyingGlassIcon,
              onClick: (item) => window.open(`/phan-hoi/${item?._id}`, '_blank')
            }
          ],
          deleteApi: deleteResponseApi
        }}
      >
        <Columnz header="Tiêu đề" field="template.title" />
        <Columnz header="Thời gian cập nhật" body={(e) => TimeBody(e.createdAt)} />
        <Columnz header="Thời gian tạo" body={(e) => TimeBody(e.updatedAt)} />
      </DataTable>
    </FormList>
  );
};
