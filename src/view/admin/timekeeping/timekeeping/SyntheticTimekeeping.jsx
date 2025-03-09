import { exportSyntheticTimekeepingApi, getListShiftInfoApi, getListSyntheticTimekeepingApi } from '@api';
import { DataFilter } from '@components/base';
import { Buttonz, Calendarzz, Dropdownzz } from '@components/core';
import { days } from '@constant';
import { databaseDate, getDates, roundNumber } from '@lib/helper';
import { useGetApi } from '@lib/react-query';
import { useDataState, useToastState } from '@store';
import moment from 'moment';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { DataTable } from 'primereact/datatable';
import { Row } from 'primereact/row';
import React, { useState } from 'react';
import { ImportTimekeeping } from './ImportTimekeeping';
import { ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

const handleParams = (params) => {
  if (Array.isArray(params.dates) && params.dates.length > 0) {
    params.fromDate = databaseDate(params.dates[0], 'date');
    params.toDate = params.dates[1] ? databaseDate(params.dates[1], 'date', true) : databaseDate(params.dates[0], 'date', true);
  }
  return { ...params, dates: undefined };
};

const today = new Date();
const INITPARAMS = {
  dates: [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)
  ]
};
export const SyntheticTimekeeping = () => {
  const { showToast } = useToastState();
  const [params, setParams] = useState(INITPARAMS);
  const [filter, setFilter] = useState(INITPARAMS);
  const { departments, accounts } = useDataState();
  const { isLoading, data } = useGetApi(getListSyntheticTimekeepingApi, handleParams(params), 'syntheticTimekeeping');
  const { data: shifts } = useGetApi(getListShiftInfoApi, {}, 'shifts');
  const dates = getDates(params.dates?.[0], params.dates?.[1]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onExport = async () => {
    setLoading(true);
    const response = await exportSyntheticTimekeepingApi(handleParams(params));
    setLoading(false);
    if (response) {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(response);
      downloadLink.download = 'ket-qua-export-bang-cong-tong-hop.xlsx';
      downloadLink.click();
      showToast({ title: 'Export bảng công tổng hợp thành công!', severity: 'success' });
    }
  };

  const headerGroup = (
    <ColumnGroup>
      <Row>
        <Column header="Nhân viên" rowSpan={2} />
        <Column header="Ca làm việc" rowSpan={2} />
        <Column header="Công chính thức" rowSpan={2} />
        <Column header="Công OT" rowSpan={2} />
        {dates?.map((d, index) => {
          const date = new Date(d);
          const dayOfWeek = days[date.getDay()]?.name;
          return <Column key={index} header={dayOfWeek} />;
        })}
      </Row>
      <Row>
        {dates?.map((d, index) => {
          const date = new Date(d);
          return <Column key={index} header={moment(date).format('DD/MM')} className="min-w-28" />;
        })}
      </Row>
    </ColumnGroup>
  );

  return (
    <>
      <ImportTimekeeping open={open} setOpen={setOpen} setParams={setParams} />
      <DataFilter
        setParams={setParams}
        filter={filter}
        setFilter={setFilter}
        handleClear={() => {
          setParams(INITPARAMS);
          setFilter(INITPARAMS);
        }}
        handleFilter={() => setParams(filter)}
        className="lg:w-full"
      >
        <Calendarzz
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          label="Khoảng thời gian (*)"
          value={filter.dates}
          onChange={(e) => setFilter({ ...filter, dates: e.value })}
        />
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
          value={filter.shift}
          onChange={(e) => setFilter({ ...filter, shift: e.target.value, account: undefined })}
          options={shifts}
          label="Ca làm việc"
          showClear
          filter
        />
      </DataFilter>
      <div className="w-full px-2">
        <DataTable
          loading={isLoading}
          value={data}
          headerColumnGroup={headerGroup}
          rowGroupMode="rowspan"
          groupRowsBy="account"
          sortMode="single"
          sortField="account"
          sortOrder={1}
          showGridlines
          scrollable
          emptyMessage="Không có bảng công tổng hợp trong khoảng thời gian này"
          header={
            <div className="flex gap-4 justify-start mb-1">
              <Buttonz
                severity="success"
                onClick={() => setOpen(true)}
                className="flex gap-4 items-center"
                icon={<ArrowUpTrayIcon className="h-5 w-5 stroke-2" />}
              >
                Import
              </Buttonz>
              <Buttonz
                severity="success"
                onClick={onExport}
                loading={loading}
                className="flex gap-4 items-center"
                icon={<ArrowDownTrayIcon className="h-5 w-5 stroke-2" />}
              >
                Export
              </Buttonz>
            </div>
          }
        >
          <Column
            field="account"
            className="min-w-52"
            body={(e) => {
              const account = accounts.find((a) => a._id === e.account);
              return (
                <div className="flex justify-start items-center gap-4">
                  <div className="h-12 w-12">
                    <img
                      alt={account?.fullName}
                      src={account?.avatar || '/images/avatar.jpg'}
                      className="rounded-md h-12 w-12 object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-left gap-1 text-primary">
                    <span className="font-semibold">{account?.fullName}</span>
                    <span className="font-semibold">{account?.staffCode}</span>
                  </div>
                </div>
              );
            }}
          ></Column>
          <Column
            field="shift.code"
            body={(e) => {
              const shift = shifts.find((s) => s._id === e.shift);
              return (
                <span className="font-medium text-primary">
                  {shift?.name} ({shift?.code})
                </span>
              );
            }}
            className="min-w-28"
          ></Column>
          <Column field="total" body={(e) => <span className="font-medium text-lg">{roundNumber(e.reality)} / {e.total}</span>} className="min-w-24"></Column>
          <Column field="totalOt" body={(e) => <span className="font-medium text-lg">{roundNumber(e.realityOt)} / {e.totalOt}</span>} className="min-w-24"></Column>

          {dates.map((date, index) => (
            <Column
              key={index}
              className="min-w-24"
              body={(e) => {
                const datez = e.data?.find((d) => databaseDate(d.date, 'date') === databaseDate(date, 'date'));
                if (datez) return datez.summary || '-';
              }}
            ></Column>
          ))}
        </DataTable>
      </div>
    </>
  );
};
