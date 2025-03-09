import { getConfigTimekeepingApi, updateConfigSalaryApi } from '@api';
import { Buttonz, Cardz, DropdownFormz, InputFormz, Inputzz, ProgressSpinnerz } from '@components/core';
import { useGetApi } from '@lib/react-query';
import { useToastState } from '@store';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

const getTimeWarning = () => {
  const times = [];
  let hour = 0;
  let minute = 0;
  while (hour < 24) {
    const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    times.push({ name: time, _id: time });
    minute += 30;
    if (minute === 60) {
      minute = 0;
      hour++;
    }
  }
  return times;
};

const getDate = () => {
  const dates = [];
  for (let i = 1; i < 32; i++) {
    dates.push({ name: i, _id: i });
  }
  return dates;
};

const defaultValues = {
  timekeepingWarning: '',
  time: '',
  date: '',
  numberDayOffPermonth: ''
};
export const TimekeepingConfig = () => {
  const { showToast } = useToastState();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const { data: item } = useGetApi(getConfigTimekeepingApi, { type: 1 }, 'timekeeping-config');

  const {
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    register
  } = useForm();

  useEffect(() => {
    if (item) {
      if (item.locations)
        setData(
          item.locations.map((i, index) => ({
            ...i,
            idz: index + 1,
            location: i.location || '',
            latitude: i.latitude || '',
            longitude: i.longitude || ''
          }))
        );
      for (const key in defaultValues) {
        setValue(key, item[key]);
      }
    }
  }, [item]);

  const onChange = (field, value, idz) => {
    setData((pre) =>
      pre.map((p) => {
        if (p.idz === idz) p[field] = value;
        return p;
      })
    );
  };

  const onSubmit = async (value) => {
    if (data.find((d) => !d.location || !d.latitude || !d.longitude))
      return showToast({ title: 'Vui lòng nhập đủ thông tin vị trí, latitude, longitude!', severity: 'warning' });
    const params = {
      type: 1,
      detail: {
        timekeepingWarning: value.timekeepingWarning,
        numberDayOffPermonth: value.numberDayOffPermonth,
        date: value.date,
        time: value.time,
        locations: data
      }
    };
    setLoading(true);
    const res = await updateConfigSalaryApi(params);
    setLoading(false);
    if (res) showToast({ title: 'Cập nhật cấu hình chấm công thành công', severity: 'success' });
  };

  return (
    <Cardz>
      <h2 className="font-bold uppercase leading-normal mb-2 p-2 text-primary">Cấu hình chấm công</h2>
      <hr className="mx-2" />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full">
          <div className="relative w-full mt-4">
            {loading && (
              <div className="absolute w-full h-full bg-black opacity-30 z-10 flex justify-center items-center">
                <ProgressSpinnerz style={{ width: '50px', height: '50px' }} strokeWidth="4" animationDuration="1s" />
              </div>
            )}
            <div className="flex flex-wrap w-full">
              <DropdownFormz
                id="timekeepingWarning"
                label="Thời gian cảnh báo chấm công"
                options={getTimeWarning()}
                value={watch('timekeepingWarning')}
                errors={errors}
                onChange={(e) => setValue('timekeepingWarning', e.target.value)}
                showClear
              />
              <div className="w-full my-2 mt-6">
                <label className="inline-block font-medium text-left mb-2 w-full">Cấu hình phép</label>
                <hr />
              </div>
              <div className="flex flex-wrap w-full">
                <InputFormz
                  id="numberDayOffPermonth"
                  label="Số phép thêm mỗi tháng"
                  value={watch('numberDayOffPermonth')}
                  errors={errors}
                  register={register}
                  min={0}
                  className="!lg:w-4/12"
                />
                <DropdownFormz
                  id="date"
                  label="Ngày tính thêm phép"
                  options={getDate()}
                  value={watch('date')}
                  errors={errors}
                  onChange={(e) => setValue('date', e.target.value)}
                  showClear
                  className="!lg:w-4/12"
                />
                <DropdownFormz
                  id="time"
                  label="Thời gian tính thêm phép"
                  options={getTimeWarning()}
                  value={watch('time')}
                  errors={errors}
                  onChange={(e) => setValue('time', e.target.value)}
                  showClear
                  className="!lg:w-4/12"
                />
              </div>
              <div className="w-full my-4">
                <div className="p-2">
                  <div className="flex justify-between items-center">
                    <label className="inline-block font-medium text-left mb-2">Vị trí chấm công cho phép</label>
                    <div className="flex gap-2 items-center">
                      <a href="https://www.latlong.net/" target="_blank">
                        <Buttonz outlined label="Lấy vị trí" className="mb-2" />
                      </a>
                      <Buttonz
                        onClick={() =>
                          setData((pre) => [
                            ...pre,
                            { idz: (pre[pre.length - 1]?.idz || 1) + 1, type: 1, location: '', longitude: '', latitude: '' }
                          ])
                        }
                        label="Thêm mới"
                        className="mb-2"
                      />
                    </div>
                  </div>
                  <hr />
                </div>
                {data.map((datum, index) => (
                  <div key={index} className="w-full flex flex-wrap items-center">
                    <Inputzz
                      label="Vị trí (*)"
                      value={datum.location}
                      onChange={(e) => onChange('location', e.target.value, datum.idz)}
                      className="w-full md:w-6/12 lg:w-3/12"
                    />
                    <Inputzz
                      label="Longitude (*)"
                      value={datum.longitude}
                      onChange={(e) => onChange('longitude', e.target.value, datum.idz)}
                      className="w-full md:w-6/12 lg:w-3/12"
                    />
                    <Inputzz
                      label="Latitude (*)"
                      value={datum.latitude}
                      onChange={(e) => onChange('latitude', e.target.value, datum.idz)}
                      className="w-full md:w-6/12 lg:w-3/12"
                    />
                    <div className="w-full md:w-6/12 lg:w-3/12 p-2 flex justify-end">
                      <Buttonz
                        onClick={() => setData((pre) => pre.filter((p) => p.idz !== datum.idz))}
                        severity="danger"
                        outlined
                        className="!p-0 h-10 w-10 flex justify-center items-center !rounded-full"
                        icon={<TrashIcon className="w-5" />}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex gap-4 justify-end">
          <Buttonz label="Xác nhận" type="submit" />
        </div>
      </form>
    </Cardz>
  );
};
