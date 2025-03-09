import { Buttonz, Columnz, MultiSelectFormz, Tablez } from '@components/core';
import { days } from '@constant';
import { TrashIcon } from '@heroicons/react/24/outline';
import moment from 'moment';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';

export const calTime = (start, end, breakStart, breakEnd) => {
  if (start && end) {
    let startTime = moment(start).startOf('minute');
    let endTime = moment(end).startOf('minute');
    let workTime;
    if (startTime > endTime) endTime.add(1, 'days');
    workTime = endTime - startTime;
    if (breakStart && breakEnd) {
      const breakStartTime = moment(breakStart).startOf('minute');
      const breakEndTime = moment(breakEnd).startOf('minute');
      if (breakStartTime > breakEndTime) breakEndTime.add(1, 'days');
      if (breakStartTime < startTime && breakEndTime > endTime) workTime = 0;
      else if (breakStartTime < startTime && breakEndTime < endTime) workTime = endTime - breakEndTime;
      else if (breakStartTime > startTime && breakEndTime > endTime) workTime = breakStartTime - startTime;
      else workTime = endTime - startTime - (breakEndTime - breakStartTime);
    }
    return (workTime / 60 / 60 / 1000)?.toFixed(2);
  }
};

const getDate = (date) => {
  if (date) return new Date(date);
  else return '';
};

export const Dates = (props) => {
  const { data = [], setData = () => {}, disabled } = props;

  const onChange = (item, field, value) => {
    if (item && field) {
      setData((pre) =>
        pre.map((p) => {
          if (p.date === item.date && field) p[field] = value;
          p.totalTime = calTime(p.timeStart, p.timeEnd, p.timeBreakStart, p.timeBreakEnd);
          return p;
        })
      );
    }
  };

  return (
    <div className="card w-full mx-2 mt-4">
      <div className="flex justify-between mb-4 items-center">
        <label className="inline-block font-medium text-left">Thời gian làm việc theo tuần</label>
        <MultiSelectFormz
          disabled={disabled}
          label="Thời gian làm việc"
          options={days}
          value={data?.map((d) => d.date)}
          onChange={(e) => {
            const dates = e.target.value;
            const date = data.find((d) => d.timeStart && d.timeEnd && d.totalWork);
            setData(
              dates.map((d) => {
                const checkDate = data.find((c) => c.date === d);
                if (checkDate) return checkDate;
                else return { totalWork: '', ...date, date: d };
              })
            );
          }}
          filter
        />
      </div>
      <Tablez
        value={data}
        totalRecords={data?.length}
        rows={100}
        rowsPerPageOptions={[100]}
        params={{ page: 1, limit: 100 }}
        dataKey="date"
        emptyMessage="."
        paginatorTemplate="CurrentPageReport"
      >
        <Columnz header="#" body={(data, options) => options.rowIndex + 1} />
        <Columnz header="Ngày làm việc" body={(e) => <b>{days.find((w) => w._id === e.date)?.name}</b>} />
        <Columnz
          header="Thời gian bắt đầu"
          body={(item) => (
            <Calendar
              disabled={disabled}
              timeOnly
              hideOnDateTimeSelect
              value={getDate(item.timeStart)}
              onChange={(e) => onChange(item, 'timeStart', e.value)}
              className="w-full disabledz"
            />
          )}
        />
        <Columnz
          header="Thời gian kết thúc"
          body={(item) => (
            <Calendar
              disabled={disabled}
              timeOnly
              value={getDate(item.timeEnd)}
              onChange={(e) => onChange(item, 'timeEnd', e.value)}
              className="w-full disabledz"
            />
          )}
        />
        <Columnz
          header="Thời gian bắt đầu nghỉ"
          body={(item) => (
            <Calendar
              disabled={disabled}
              timeOnly
              value={getDate(item.timeBreakStart)}
              onChange={(e) => onChange(item, 'timeBreakStart', e.value)}
              className="w-full disabledz"
            />
          )}
        />
        <Columnz
          header="Thời gian kết thúc nghỉ"
          body={(item) => (
            <Calendar
              disabled={disabled}
              timeOnly
              value={getDate(item.timeBreakEnd)}
              onChange={(e) => onChange(item, 'timeBreakEnd', e.value)}
              className="w-full disabledz"
            />
          )}
        />
        <Columnz disabled={disabled} header="Tổng thời gian (giờ)" field="totalTime" />
        <Columnz
          header="Tổng công tính"
          body={(item) => (
            <div className="disabledz">
              <InputText
                disabled={disabled}
                type="number"
                value={item.totalWork}
                onChange={(e) => onChange(item, 'totalWork', e.target.value)}
                className="w-full"
              />
            </div>
          )}
        />
        <Columnz
          header="Thao tác"
          body={(item) => (
            <div className="w-full flex justify-center">
              <Buttonz
                disabled={disabled}
                severity="danger"
                outlined
                onClick={() => setData((pre) => pre.filter((p) => p.date !== item.date))}
                className="!p-0 h-10 w-10 flex justify-center items-center !rounded-full"
                icon={<TrashIcon className="w-5" />}
              />
            </div>
          )}
        />
      </Tablez>
    </div>
  );
};
