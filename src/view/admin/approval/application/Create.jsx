import { createApplicationApi } from '@api';
import { UploadFiles } from '@components/base';
import { Buttonz, CalendarFormz, Dialogz, DropdownFormz, InputFormz, ProgressSpinnerz } from '@components/core';
import { applicationTypes } from '@constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { databaseDate } from '@lib/helper';
import { ApplicationValidation } from '@lib/validation';
import { useToastState } from '@store';
import moment from 'moment';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

export const CreateApplication = (props) => {
  const { open, setOpen, shifts, setParams, departments = [], accounts } = props;
  const { showToast } = useToastState();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
    resolver: yupResolver(ApplicationValidation)
  });

  const type = watch('type');
  const onSubmit = async (value) => {
    const params = { shift: value.shift, type: value.type, reason: value.reason, department: value.department, account: value.account };
    if ([1, 2].includes(type)) {
      if (!value.date) return showToast({ title: 'Ngày nghỉ không được bỏ trống!', severity: 'error' });
      else if (new Date(value.date) < new Date())
        return showToast({ title: 'Ngày nghỉ không được nhỏ hơn ngày hiện tại!', severity: 'error' });
      else params.dates = [databaseDate(value.date, 'date')];
    }
    if ([3, 7].includes(type)) {
      if (!value.fromDate) return showToast({ title: 'Ngày bắt đầu không được bỏ trống!', severity: 'error' });
      else if (!value.toDate) return showToast({ title: 'Ngày kết thúc không được bỏ trống!', severity: 'error' });
      else if (new Date(value.fromDate) < new Date())
        return showToast({ title: 'Ngày bắt đầu không được nhỏ hơn ngày hiện tại!', severity: 'error' });
      else if (new Date(value.toDate) < new Date())
        return showToast({ title: 'Ngày kết thúc không được nhỏ hơn ngày hiện tại!', severity: 'error' });
      else if (new Date(value.fromDate) > new Date(value.toDate))
        return showToast({ title: 'Ngày bắt đầu không được lớn hơn ngày kết thúc!', severity: 'error' });
      const startDate = moment(value.fromDate);
      const endDate = moment(value.toDate);
      const duration = moment.duration(endDate.diff(startDate));
      const days = duration.asDays() + 1;
      const arr = new Array(days).fill(null);
      params.dates = [];
      arr.forEach((_a, index) => {
        const date = startDate.clone().add(index, 'days').format('YYYY-MM-DD');
        params.dates.push(date);
      });
    }
    if ([4].includes(type)) {
      if (!value.date) return showToast({ title: 'Ngày xác nhận công không được bỏ trống!', severity: 'error' });
      else if (new Date(value.date) > new Date())
        return showToast({ title: 'Ngày xác nhận công không được lớn hơn ngày hiện tại!', severity: 'error' });
      else params.dates = [databaseDate(value.date, 'date')];
    }
    if ([5].includes(type)) {
      if (!value.date) return showToast({ title: 'Ngày không được bỏ trống!', severity: 'error' });
      else if (new Date(value.date) < new Date()) return showToast({ title: 'Ngày không được nhỏ hơn ngày hiện tại!', severity: 'error' });
      else if (!value.soon && !value.late)
        return showToast({ title: 'Vui lòng chọn thời gian đi trễ hoặc thời gian về sớm!', severity: 'error' });
      else {
        params.dates = [databaseDate(value.date, 'date')];
        params.soon = databaseDate(value.soon, 'timez');
        params.late = databaseDate(value.late, 'timez');
      }
    }
    if ([6].includes(type)) {
      if (!value.date) return showToast({ title: 'Ngày không được bỏ trống!', severity: 'error' });
      else if (new Date(value.date) < new Date()) {
        return showToast({ title: 'Ngày không được nhỏ hơn ngày hiện tại!', severity: 'error' });
      }
      else if (!value.fromTime) return showToast({ title: 'Thời gian bắt đầu không được bỏ trống!', severity: 'error' });
      else if (!value.toTime) return showToast({ title: 'Thời gian kết thúc không được bỏ trống!', severity: 'error' });
      else {
        params.dates = [databaseDate(value.date, 'date')];
        params.fromTime = databaseDate(value.fromTime, 'timez');
        params.toTime = databaseDate(value.toTime, 'timez');
      }
    }
    
    if (files?.length > 0) params.formData = { files: files };
    setLoading(true);
    const res = await createApplicationApi(params);
    setLoading(false);
    if (res) {
      showToast({ title: 'Thêm mới đơn thành công', severity: 'success' });
      setParams((pre) => ({ ...pre, render: !pre.render }));
      setOpen(false);
      reset()
    }
  };

  return (
    <Dialogz className="w-[1200px]" header="Thêm mới đơn từ" open={open} setOpen={setOpen}>
      <form onSubmit={handleSubmit(onSubmit)} className="border-t border-border">
        <div className="w-full max-h-[1200px] overflow-scroll">
          <div className="relative w-full mt-4">
            {loading && (
              <div className="absolute w-full h-full bg-black opacity-30 z-10 flex justify-center items-center">
                <ProgressSpinnerz style={{ width: '50px', height: '50px' }} strokeWidth="4" animationDuration="1s" />
              </div>
            )}
            <div className="flex flex-wrap w-full">
              <DropdownFormz
                id="department"
                label="Phòng ban (*)"
                options={departments}
                value={watch('department')}
                errors={errors}
                register={register}
                onChange={(e) => {
                  setValue('department', e.target.value);
                  setValue('account', undefined);
                }}
              />
              <DropdownFormz
                id="account"
                label="Nhân viên (*)"
                options={watch('department') ? accounts.filter((a) => a.department === watch('department')) : accounts}
                value={watch('account')}
                optionLabel="fullName"
                errors={errors}
                onChange={(e) => setValue('account', e.target.value)}
              />
              <DropdownFormz
                id="shift"
                label="Ca làm việc (*)"
                options={shifts}
                value={watch('shift')}
                errors={errors}
                onChange={(e) => setValue('shift', e.target.value)}
              />
              <DropdownFormz
                id="type"
                label="Loại đơn (*)"
                options={applicationTypes.filter(a => ![8, 9].includes(a._id))}
                value={watch('type')}
                errors={errors}
                onChange={(e) => {
                  setValue('type', e.target.value);
                  setValue('date', undefined);
                  setValue('fromDate', undefined);
                  setValue('toDate', undefined);
                  setValue('fromTime', undefined);
                  setValue('toTime', undefined);
                  setValue('late', undefined);
                  setValue('soon', undefined);
                }}
              />
              {[1, 2].includes(type) ? (
                <CalendarFormz id="date" label="Ngày nghỉ (*)" value={watch('date')} view="date" errors={errors} register={register} />
              ) : [3, 7].includes(type) ? (
                <>
                  <CalendarFormz
                    id="fromDate"
                    label="Ngày bắt đầu (*)"
                    value={watch('fromDate')}
                    view="date"
                    errors={errors}
                    register={register}
                  />
                  <CalendarFormz
                    id="toDate"
                    label="Ngày kết thúc (*)"
                    value={watch('toDate')}
                    view="date"
                    errors={errors}
                    register={register}
                  />
                </>
              ) : type === 4 ? (
                <CalendarFormz
                  id="date"
                  label="Ngày xác nhận công (*)"
                  value={watch('date')}
                  view="date"
                  errors={errors}
                  register={register}
                />
              ) : type === 5 ? (
                <>
                  <CalendarFormz id="date" label="Ngày (*)" value={watch('date')} view="date" errors={errors} register={register} />
                  <CalendarFormz id="late" label="Số thời gian đi trễ" value={watch('late')} timeOnly errors={errors} register={register} />
                  <CalendarFormz id="soon" label="Số thời gian về sớm" value={watch('soon')} timeOnly errors={errors} register={register} />
                </>
              ) : type === 6 ? (
                <>
                  <CalendarFormz id="date" label="Ngày (*)" value={watch('date')} view="date" errors={errors} register={register} />
                  <CalendarFormz
                    id="fromTime"
                    label="Thời gian bắt đầu (*)"
                    value={watch('fromTime')}
                    timeOnly
                    errors={errors}
                    register={register}
                  />
                  <CalendarFormz
                    id="toTime"
                    label="Thời gian kết thúc (*)"
                    value={watch('toTime')}
                    timeOnly
                    errors={errors}
                    register={register}
                  />
                </>
              ) : (
                <></>
              )}
              <InputFormz
                id="reason"
                label="Lý do (*)"
                value={watch('reason')}
                errors={errors}
                register={register}
                className="!w-full"
              />
              <InputFormz id="note" label="Ghi chú" value={watch('note')} errors={errors} register={register} className="!w-full" />
              <UploadFiles label="File đính kèm" files={files} setFiles={setFiles} />
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex gap-4 justify-end">
          <Buttonz outlined color="red" label="Trờ lại" onClick={() => setOpen(false)} />
          <Buttonz label="Thêm mới" type="submit" />
        </div>
      </form>
    </Dialogz>
  );
};
