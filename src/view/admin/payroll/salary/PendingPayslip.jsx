import {
  deletePendingPayslipApi,
  deletePendingPayslipsApi,
  downloadPendingPayslipApi,
  getListMonthInfoApi,
  getListPendingPayslipApi,
  previewPendingPayslipApi,
  updateStatusPendingPayslipApi
} from '@api';
import { DataTable, FormList, DataFilter, Body } from '@components/base';
import { Columnz, Dropdownzz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { Detail } from './Detail';
import { useDataState, useToastState } from '@store';
import { formatDate, formatNumber } from '@lib/helper';
import { ArrowDownTrayIcon, CheckIcon, PrinterIcon, TrashIcon } from '@heroicons/react/24/outline';
import { salaryStatus } from '@constant';

export const PendingPayslip = () => {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const [select, setSelect] = useState([]);
  const { isLoading, data } = useGetApi(getListPendingPayslipApi, params, 'pending-payslip');
  const { data: months } = useGetApi(getListMonthInfoApi, params, 'months');
  const { departments, accounts } = useDataState();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToastState();

  const onUpdate = async (status) => {
    if (!(select?.length > 0)) return showToast({ title: 'Vui lòng chọn phiếu lương', severity: 'warning' });
    setLoading(true);
    const response = await updateStatusPendingPayslipApi({ _ids: select?.map((s) => s._id), status });
    setLoading(false);
    if (response) {
      showToast({ title: 'Xác nhận phiếu lương thành công', severity: 'success' });
      setParams((pre) => ({ ...pre, render: !pre.render }));
      setSelect([]);
    }
  };

  const onDelete = async (status) => {
    if (!(select?.length > 0)) return showToast({ title: 'Vui lòng chọn phiếu lương', severity: 'warning' });
    setLoading(true);
    const response = await deletePendingPayslipsApi({ _ids: select?.map((s) => s._id), status });
    setLoading(false);
    if (response) {
      showToast({ title: 'Xóa phiếu lương thành công', severity: 'success' });
      setParams((pre) => ({ ...pre, render: !pre.render }));
      setSelect([]);
    }
  };

  const onPreviewPayslip = async (item) => {
    const response = await previewPendingPayslipApi({ _id: item._id });
    if (response) {
      window.open(`/pending-payslip/detail/${item._id}`, '_blank');
    }
  };

  const downloadPayslip = async (item) => {
    const response = await downloadPendingPayslipApi({ _id: item._id });
    if (response) window.open(response, '_blank');
  };

  return (
    <FormList title="Phiếu lương chờ xác nhận">
      <Detail open={open} setOpen={setOpen} data={data?.documents} accounts={accounts} />
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-1/4">
        <Dropdownzz
          value={filter.department}
          onChange={(e) => setFilter({ ...filter, department: e.target.value, account: undefined })}
          options={departments}
          label="Phòng ban"
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
      </DataFilter>
      <DataTable
        title="phiếu lương chờ xác nhận"
        loading={isLoading || loading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        select={select}
        setSelect={setSelect}
        baseActions={['detail', 'delete']}
        setShow={setOpen}
        headerInfo={{
          moreHeader: [
            {
              children: () => (
                <div className="flex gap-2 justify-center items-center">
                  <CheckIcon className="w-5 h-5" />
                  <span>Xác nhận</span>
                </div>
              ),
              onClick: () => onUpdate(2)
            },
            {
              children: () => (
                <div className="flex gap-2 justify-center items-center">
                  <TrashIcon className="w-5 h-5" />
                  <span>Xóa</span>
                </div>
              ),
              onClick: () => onDelete(),
              severity: 'danger'
            }
          ]
        }}
        actionsInfo={{
          deleteApi: deletePendingPayslipApi,
          onViewDetail: (item) => setOpen(item._id),
          moreActions: [
            {
              icon: PrinterIcon,
              onClick: (item) => onPreviewPayslip(item)
            },
            {
              icon: ArrowDownTrayIcon,
              onClick: (item) => downloadPayslip(item)
            }
          ]
        }}
      >
        <Columnz
          header="Nhân viên"
          body={(e) => {
            const department = departments?.find((d) => d._id === e.department) || {};
            const account = accounts?.find((a) => a._id === e.account) || {};
            return (
              <div className="flex flex-col gap-2">
                <span>Phòng ban: {department?.name}</span>
                <span>
                  {account?.fullName} - {account?.staffCode}
                </span>
              </div>
            );
          }}
        />
        <Columnz header="Tháng" field="month" />
        <Columnz
          header="Thời gian tính"
          body={(e) => (
            <div className="flex flex-col gap-2">
              <span>{formatDate(e.from, 'date')}</span>
              <span>{formatDate(e.to, 'date')}</span>
            </div>
          )}
        />
        <Columnz header="Lương theo ngày công" body={(e) => formatNumber(e.officialSalary)} />
        <Columnz
          header="Tổng phụ cấp, thu nhập phát sinh"
          body={(e) => formatNumber(e.allowances?.reduce((a, b) => a + b.summary, 0) + e.bonuses?.reduce((a, b) => a + b.summary, 0))}
        />
        <Columnz header="Phạt đi muộn về sớm" body={(e) => formatNumber(e.soonLates?.reduce((a, b) => a + b.summary, 0))} />
        <Columnz header="Các khoản trừ bắt buộc" body={(e) => formatNumber(e.mandatoryAmount)} />
        <Columnz header="Thuế thu nhập" body={(e) => formatNumber(e.tax.summary)} />
        <Columnz header="Lương thực nhận" body={(e) => formatNumber(e.summary)} />
        <Columnz header="Trạng thái" body={(e) => Body(salaryStatus, e.status)} />
      </DataTable>
    </FormList>
  );
};
