import { useGetApi } from '@lib/react-query';
import { Attendance } from './Attendance';
import { DoughnutChart } from './DoughnutChart';
import { ComboChart } from './ComboChart';
import { PieChart } from './PieChart';
import { getDataDashboardApi, getListTemplateInfoApi } from '@api';
import { useState } from 'react';
import { Calendarzz, Cardz, Dropdownzz } from '@components/core';
import { databaseDate } from '@lib/helper';
import { DataFilter } from '@components/base';
import { DepartmentReport } from './DepartmentReport';

const handleParams = (params) => {
  if (Array.isArray(params.dates) && params.dates.length > 0) {
    params.from = databaseDate(params.dates[0]);
    params.to = params.dates[1] ? databaseDate(params.dates[1], false, true) : databaseDate(params.dates[0], false, true);
  }
  return { ...params, page: undefined, limit: undefined, dates: undefined };
};

const today = new Date();
const INITPARAMS = {
  dates: [
    new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7),
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  ]
};
export const DashBoard = () => {
  const [params, setParams] = useState(INITPARAMS);
  const [filter, setFilter] = useState(INITPARAMS);
  const { data, isLoading } = useGetApi(getDataDashboardApi, handleParams(params), 'dashboard');
  const { data: templates } = useGetApi(getListTemplateInfoApi, {}, 'templates');
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - 1);

  return (
    <div className="flex flex-wrap">
      <div className="w-full py-4">
        <Cardz>
          <DataFilter
            setParams={setParams}
            filter={filter}
            setFilter={setFilter}
            handleClear={() => {
              setParams(INITPARAMS);
              setFilter(INITPARAMS);
            }}
            className="lg:w-6/12"
          >
            <Calendarzz
              selectionMode="range"
              readOnlyInput
              hideOnRangeSelection
              label="Khoảng thời gian (*)"
              value={filter.dates}
              onChange={(e) => setFilter({ ...filter, dates: e.value })}
              className="lg:w-6/12"
            />
          </DataFilter>
        </Cardz>
      </div>
      <div className="w-full lg:pr-3 py-4 lg:w-8/12">
        <DepartmentReport data={data?.responses} isLoading={isLoading} templates={templates} />
      </div>
      <div className="w-full lg:pl-3 py-4 lg:w-4/12">
        <DoughnutChart data={data?.reflects} isLoading={isLoading} />
      </div>
      {/* <div className="w-full lg:pr-3 py-4 lg:w-8/12">
        <Attendance data={data?.attendances} isLoading={isLoading} />
      </div> */}
      {/* <div className="w-full lg:pl-3 py-4 lg:w-4/12">
        <PieChart data={data?.applications} isLoading={isLoading} />
      </div> */}
      <div className="w-full py-4">
        <ComboChart data={data?.details} isLoading={isLoading} templates={templates} params={handleParams(params)} />
      </div>
    </div>
  );
};
