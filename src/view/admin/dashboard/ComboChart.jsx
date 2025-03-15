import React, { useState, useEffect } from 'react';
import { Chart } from 'primereact/chart';
import { formatDate, removeSpecialCharacter } from '@lib/helper';
import { Buttonz, Cardz } from '@components/core';
import { themeColor } from '@theme';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { exportReflectApi, exportResponseApi } from '@api';

export const ComboChart = ({ data = [], templates, params = {} }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [chartOptions, setChartOptions] = useState({});

  const onExport = async (exportApi = () => {}, title = '') => {
    const response = await exportApi(params);
    if (response) {
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(response);
      downloadLink.download = (title && `ket-qua-export-${removeSpecialCharacter(title)}.xlsx`) || 'data.xlsx';
      downloadLink.click();
      showToast({ title: `Export ${title?.toLowerCase()} thành công!`, severity: 'success' });
    }
  };

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
      <div className="w-full flex justify-between items-center mb-4 text-center">
        <h2 className="font-bold uppercase leading-normal text-primary">Báo cáo chi tiết</h2>
        <div className="flex gap-2 items-center">
          <Buttonz
            severity="success"
            onClick={() => onExport(exportResponseApi, "cam kết")}
            className="flex gap-4 items-center"
            icon={<ArrowDownTrayIcon className="h-5 w-5 stroke-2" />}
          >
            Export cam kết
          </Buttonz>
          <Buttonz
            severity="success"
            onClick={() => onExport(exportReflectApi, "phản ánh")}
            className="flex gap-4 items-center"
            icon={<ArrowDownTrayIcon className="h-5 w-5 stroke-2" />}
          >
            Export phản ánh
          </Buttonz>
        </div>
      </div>
      <hr className="mb-4" />
      <Chart type="line" data={chartData || {}} options={chartOptions || {}} />
    </Cardz>
  );
};
