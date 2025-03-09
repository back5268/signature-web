import { deleteTemplateApi, getListTemplateApi, updateTemplateApi } from '@api';
import { DataTable, FormList, DataFilter, TimeBody } from '@components/base';
import { Columnz, Inputzz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { DetailTemplate } from './Detail';
import { Link } from 'react-router-dom';

export * from './DetailV2';
export const Template = () => {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const { isLoading, data } = useGetApi(getListTemplateApi, params, 'template');

  return (
    <FormList title="Danh sách mẫu">
      <DetailTemplate open={open} setOpen={setOpen} setParams={setParams} data={data?.documents} />
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-9/12">
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo tiêu đề"
        />
      </DataFilter>
      <DataTable
        title="mẫu"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['create', 'detail', 'delete']}
        setShow={setOpen}
        actionsInfo={{
          onViewDetail: (item) => setOpen(item._id),
          deleteApi: deleteTemplateApi
        }}
        headerInfo={{ onCreate: () => setOpen(true) }}
        statusInfo={{ changeStatusApi: updateTemplateApi }}
      >
        <Columnz header="Tiêu đề" body={e => <Link target='_blank' className='text-primary' to={`/cam-ket/${e.slug}`}>{e.title}</Link>} />
        <Columnz header="Thời gian cập nhật" body={(e) => TimeBody(e.createdAt)} />
        <Columnz header="Thời gian tạo" body={(e) => TimeBody(e.updatedAt)} />
      </DataTable>
    </FormList>
  );
};
