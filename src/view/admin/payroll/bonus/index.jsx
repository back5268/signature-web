import { deleteBonusApi, getListBonusApi, getListMonthInfoApi } from '@api';
import { DataTable, FormList, DataFilter, UserBody } from '@components/base';
import { Columnz, Dropdownzz, Inputzz, Tagz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { DetailBonus } from './Detail';
import { formatNumber } from '@lib/helper';
import { useDataState } from '@store';
import { bonusTypes } from '@constant';

export const Bonus = () => {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const { isLoading, data } = useGetApi(getListBonusApi, params, 'bonus');
  const { data: months } = useGetApi(getListMonthInfoApi, params, 'months');
  const { departments, accounts } = useDataState();

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
    <FormList title="Danh sách khoản thưởng">
      <DetailBonus
        open={open}
        setOpen={setOpen}
        setParams={setParams}
        data={data?.documents}
        departments={departments}
        accounts={accounts}
        months={months}
      />
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-3/4">
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo tiêu đề"
        />
        <Dropdownzz
          value={filter.department}
          onChange={(e) => setFilter({ ...filter, department: e.target.value, account: undefined })}
          options={departments}
          label="Phòng ban áp dụng"
          filter
        />
        <Dropdownzz
          value={filter.account}
          onChange={(e) => setFilter({ ...filter, account: e.target.value })}
          options={filter.department ? accounts.filter((a) => a.department === filter.department) : accounts}
          optionLabel="fullName"
          label="Nhân viên"
          filter
          showClear
        />
        <Dropdownzz
          value={filter.month}
          onChange={(e) => setFilter({ ...filter, month: e.target.value })}
          options={months}
          label="Tháng"
          filter
          showClear
        />
        <Dropdownzz
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          options={bonusTypes}
          label="Loại thưởng"
          showClear
        />
      </DataFilter>
      <DataTable
        title="khoản thưởng"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['create', 'detail', 'delete']}
        setShow={setOpen}
        actionsInfo={{
          onViewDetail: (item) => setOpen(item._id),
          deleteApi: deleteBonusApi
        }}
        headerInfo={{ onCreate: () => setOpen(true) }}
      >
        <Columnz header="Tiêu đề" field="name" />
        <Columnz header="Tháng áp dụng" field="month" />
        <Columnz
          header="Giá trị"
          body={(e) => (
            <span>
              {formatNumber(e.value)} ({e.type === 1 ? 'VNĐ' : '% lương cơ bản'})
            </span>
          )}
        />
        <Columnz header="Phòng ban áp dụng" body={(e) => Body(departments, e.departments)} />
        <Columnz header="Nhân viên áp dụng" body={(e) => Body(accounts, e.accounts)} />
        <Columnz header="Thời gian cập nhật" body={(e) => UserBody(e.updatedAt, e.updatedBy)} />
      </DataTable>
    </FormList>
  );
};
