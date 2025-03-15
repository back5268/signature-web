import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { formatDate } from '@lib/helper';
import { Cardz } from '@components/core';
import { themeColor } from '@theme';

export const ComboChart = ({ data = [], templates }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    if (data?.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const colors = [
        documentStyle.getPropertyValue('--green-500'),
        documentStyle.getPropertyValue('--blue-500'),
        documentStyle.getPropertyValue('--red-500'),
        documentStyle.getPropertyValue('--orange-500')
      ];
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
      const dataz = {
        labels: data.map((d) => formatDate(d.date, 'date')),
        datasets: [
          ...templates?.map((t, index) => ({
            type: 'line',
            label: t.title,
            borderColor: colors[index],
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            data: data.map((d) => d[t._id])
          })),
          {
            type: 'bar',
            label: 'Phản ánh',
            backgroundColor: themeColor.primary,
            data: data.map((d) => d.reflect),
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
    }
  }, [JSON.stringify(data)]);

  return (
    <Cardz className="w-full h-full py-8">
      <h2 className="font-bold uppercase leading-normal mb-4 text-primary">Báo cáo chi tiết</h2>
      <hr className="mb-4" />
      <Chart type="line" data={chartData || {}} options={chartOptions || {}} />
    </Cardz>
  );
};
