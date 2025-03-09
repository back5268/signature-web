import { getListMonthInfoApi, getListSalaryApi, previewSalaryApi, downloadSalaryApi, exportSalaryApi, exportSummarySalaryApi } from '@api';
import { DataTable, FormList, DataFilter, Body } from '@components/base';
import { Columnz, Dropdownzz } from '@components/core';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { Detail } from './Detail';
import { useDataState, useToastState } from '@store';
import { formatDate, formatNumber } from '@lib/helper';
import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { salaryStatus } from '@constant';

export const Salary = ({ _id }) => {
  const initParams = useGetParams();
  const [params, setParams] = useState(initParams);
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const { isLoading, data } = useGetApi(getListSalaryApi, { account: _id, ...params }, 'salary');
  const [loading, setLoading] = useState(false);
  const { data: months } = useGetApi(getListMonthInfoApi, params, 'months');
  const { departments, accounts } = useDataState();
  const { showToast } = useToastState();

  const onPreviewSalary = async (item) => {
    const response = await previewSalaryApi({ _id: item._id });
    if (response) window.open(`/salary/detail/${item._id}`, '_blank');
  };

  const downloadSalary = async (item) => {
    const response = await downloadSalaryApi({ _id: item._id });
    if (response) window.open(response, '_blank');
  };

  const onExport = async () => {
    setLoading(true);
    const response = await exportSummarySalaryApi({ ...params, page: undefined, limit: undefined });
    setLoading(false);
    if (response) {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(response);
      downloadLink.download = 'phieu_luong_chi_tiet.xlsx';
      downloadLink.click();
      showToast({ title: `Export chi tiết thành công!`, severity: 'success' });
    }
  };

  return (
    <FormList title={_id ? '' : 'Danh sách phiếu lương'}>
      <Detail open={open} setOpen={setOpen} data={data?.documents} accounts={accounts} />
      {!_id && (
        <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-full">
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
          <Dropdownzz
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            options={salaryStatus}
            label="Trạng thái"
            filter
            showClear
          />
        </DataFilter>
      )}
      <DataTable
        hideParams={_id}
        title="phiếu lương"
        loading={isLoading || loading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['detail', 'export']}
        setShow={setOpen}
        headerInfo={{
          exportApi: exportSalaryApi,
          moreHeader: [
            {
              children: () => (
                <div className="flex gap-2 justify-center items-center">
                  <ArrowDownTrayIcon className="w-5 h-5 stroke-2" />
                  <span>Báo cáo chi tiết</span>
                </div>
              ),
              onClick: () => onExport()
            }
          ]
        }}
        actionsInfo={{
          onViewDetail: (item) => setOpen(item._id),
          moreActions: [
            {
              icon: PrinterIcon,
              onClick: (item) => onPreviewSalary(item)
            },
            {
              icon: ArrowDownTrayIcon,
              onClick: (item) => downloadSalary(item)
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
