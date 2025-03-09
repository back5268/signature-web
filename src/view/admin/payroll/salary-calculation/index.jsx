import { useEffect, useState } from 'react';
import { SalaryCalculationz } from './SalaryCalculation';
import { SalarySetup } from './SalarySetup';
import { TaxSetup } from './TaxSetup';
import { Buttonz, Calendarzz, Cardz, Columnz, Dropdownzz, ProgressSpinnerz, Tagz } from '@components/core';
import { getListSalaryLogApi } from '@api';
import { useGetApi } from '@lib/react-query';
import { DataFilter, DataTable, TimeBody, UserBody } from '@components/base';
import { salaryLogStatus } from '@constant';
import { Detail } from './Detail';
import { socket } from '@lib/socket-io';
import { databaseDate } from '@lib/helper';

const handleParams = (params) => {
  if (Array.isArray(params.dates) && params.dates.length > 0) {
    params.fromDate = databaseDate(params.dates[0]);
    params.toDate = params.dates[1] ? databaseDate(params.dates[1], undefined, true) : databaseDate(params.dates[0], undefined, true);
  }
  return { ...params, dates: undefined };
};
export const SalaryCalculation = () => {
  const [open, setOpen] = useState(false);
  const [taxOpen, setTaxOpen] = useState(false);
  const [salaryOpen, setSalaryOpen] = useState(false);
  const [calculationOpen, setCalculationOpen] = useState(false);
  const [params, setParams] = useState({ page: 1, limit: 10 });
  const [filter, setFilter] = useState({});
  const { isLoading, data } = useGetApi(getListSalaryLogApi, handleParams(params), 'salary-log');

  useEffect(() => {
    const key = 'calculateSalary';
    const onConnect = () => console.log('Connecting...');
    const onDisconnect = (reason) => console.log('Disconnecting...', reason);
    const onEvent = (event) => setParams((pre) => ({ ...pre, render: !pre.render }));
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on(key, onEvent);
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off(key, onEvent);
    };
  }, []);

  return (
    <Cardz>
      <Detail open={open} setOpen={setOpen} data={data?.documents} />
      <SalarySetup open={salaryOpen} setOpen={setSalaryOpen} />
      <TaxSetup open={taxOpen} setOpen={setTaxOpen} />
      <SalaryCalculationz open={calculationOpen} setOpen={setCalculationOpen} setParams={setParams} />

      <div className="w-full flex gap-4 p-2 mb-2">
        <Buttonz label="Thiết lập công thức tính lương" onClick={() => setSalaryOpen(true)} />
        <Buttonz label="Thiết lập công thức tính thuế" onClick={() => setTaxOpen(true)} />
        <Buttonz label="Tính toán công lương" onClick={() => setCalculationOpen(true)} />
      </div>
      <hr className="mx-2" />
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-6/12">
        <Calendarzz
          selectionMode="range"
          readOnlyInput
          hideOnRangeSelection
          label="Khoảng thời gian (*)"
          value={filter.dates}
          onChange={(e) => setFilter({ ...filter, dates: e.value })}
        />
        <Dropdownzz
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          options={salaryLogStatus}
          label="Trạng thái"
          showClear
          filter
        />
      </DataFilter>
      <DataTable
        hideParams
        title="lịch sử tính lương"
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
        <Columnz header="Tiêu đề" field="title" />
        <Columnz header="Tháng" field="month" />
        <Columnz header="Ngày bắt đầu" body={(e) => TimeBody(e.from, 'date')} />
        <Columnz header="Ngày kết thúc" body={(e) => TimeBody(e.to, 'date')} />
        <Columnz header="Thành công" field="success" />
        <Columnz header="Thất bại" field="error" />
        <Columnz header="Thời gian tính" body={(e) => (e.by ? UserBody(e.createdAt, e.by) : '')} />
        <Columnz
          header="Trạng thái"
          body={(e) => {
            const title = e.status === 1 ? 'Đang xử lý' : 'Đã xử lý';
            const severity = e.status === 1 ? 'warning' : 'success';
            return (
              <Tagz severity={severity} className="text-center w-full">
                <div className="flex justify-center items-center gap-2">
                  {e.status === 1 && <ProgressSpinnerz style={{ width: '20px', height: '20px' }} strokeWidth="4" />}
                  <span className="my-[2px]">{title}</span>
                </div>
              </Tagz>
            );
          }}
        />
      </DataTable>
    </Cardz>
  );
};
