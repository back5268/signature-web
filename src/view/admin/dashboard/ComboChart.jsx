import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { formatDate } from '@lib/helper';
import { Cardz } from '@components/core';
import { themeColor } from '@theme';

export const ComboChart = ({ data = [], isLoading }) => {
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
    const dataz = {
      labels: data.map((d) => formatDate(d.date, 'date')),
      datasets: [
        {
          type: 'line',
          label: 'Nghỉ có phép',
          borderColor: documentStyle.getPropertyValue('--orange-500'),
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: data.map((d) => d.nghiCoPhep)
        },
        {
          type: 'line',
          label: 'Nghỉ không phép',
          borderColor: documentStyle.getPropertyValue('--red-500'),
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: data.map((d) => d.nghiKhongPhep)
        },
        {
          type: 'line',
          label: 'Đi muộn về sớm',
          borderColor: documentStyle.getPropertyValue('--blue-500'),
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: data.map((d) => d.diMuonVeSom)
        },
        {
          type: 'line',
          label: 'Công tác',
          borderColor: documentStyle.getPropertyValue('--green-500'),
          borderWidth: 2,
          fill: false,
          tension: 0.4,
          data: data.map((d) => d.congTac)
        },
        {
          type: 'bar',
          label: 'Đúng giờ',
          backgroundColor: themeColor.primary,
          data: data.map((d) => d.diLam),
          borderColor: 'white',
          borderWidth: 2
        }
      ]
    };
    const options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder
          }
        }
      }
    };

    setChartData(dataz);
    setChartOptions(options);
  }, [JSON.stringify(data)]);

  return (
    <Cardz className="w-full h-full py-8">
      <h2 className="font-bold uppercase leading-normal mb-4 text-primary">Tình trạng làm việc</h2>
      <hr className="mb-4" />
      <Chart type="line" data={chartData} options={chartOptions} />
    </Cardz>
  );
};
