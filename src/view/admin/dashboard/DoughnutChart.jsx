import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { Cardz } from '@components/core';
import { reflexTypes } from '@constant';
import { themeColor } from '@theme';

export const DoughnutChart = ({ data = [] }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const dataz = {
      labels: reflexTypes.map((g) => g.name),
      datasets: [
        {
          data: reflexTypes.map((g) => {
            return data[g._id - 1]
          }),
          backgroundColor: [
            themeColor.primary,
            documentStyle.getPropertyValue('--orange-500'),
            documentStyle.getPropertyValue('--red-500')
          ],
          hoverBackgroundColor: [
            themeColor.primary,
            documentStyle.getPropertyValue('--orange-400'),
            documentStyle.getPropertyValue('--red-400')
          ]
        }
      ]
    };
    const options = {
      plugins: {
        legend: {
          labels: {
            usePointStyle: true
          }
        }
      }
    };

    setChartData(dataz);
    setChartOptions(options);
  }, [JSON.stringify(data)]);

  return (
    <Cardz className="w-full flex flex-col justify-center items-center py-8">
      <h2 className="font-bold uppercase leading-normal mb-4 text-primary">Báo cáo phản ánh</h2>
      <div className="relative">
        <Chart type="pie" data={chartData} options={chartOptions} className="w-[20rem]" />
        {data?.length === 0 && (
          <div className="absolute top-8 h-full w-full flex justify-center">
            <div className="w-[18rem] h-[18rem] rounded-full bg-background font-semibold flex justify-center items-center text-primary">
              Không có dữ liệu
            </div>
          </div>
        )}
      </div>
    </Cardz>
  );
};
