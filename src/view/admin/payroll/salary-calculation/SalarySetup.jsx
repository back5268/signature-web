import { getConfigApi, updateConfigSalaryApi } from '@api';
import { UploadFiles } from '@components/base';
import { Buttonz, Dialogz, InputFormz, ProgressSpinnerz, TextAreaz } from '@components/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetApi } from '@lib/react-query';
import { SalarySetupValidation } from '@lib/validation';
import { useToastState } from '@store';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Holidays, SoonLate } from './Component';
import { databaseDate, handleFiles } from '@lib/helper';

const defaultValues = {
  salaryCoefficient: '',
  bhxh: '',
  bhyt: '',
  bhtn: '',
  unionDues: '',
  day: '',
  sunday: '',
  holiday: '',
  note: ''
};
export const SalarySetup = (props) => {
  const { open, setOpen } = props;
  const { showToast } = useToastState();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [data, setData] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const { data: item } = useGetApi(getConfigApi, { type: 2, render: open }, 'salary-setup');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(SalarySetupValidation)
  });

  useEffect(() => {
    if (item) {
      if (item.soonLate) setData(item.soonLate.map((i, index) => ({ ...i, idz: index + 1 })));
      if (item.holidays) setHolidays(item.holidays.map((i, index) => ({ date: new Date(i), idz: index + 1 })));
      const itemz = { ...item, ...item.mandatory, ...item.ot };
      if (item.files) setFiles(item.files);
      for (const key in defaultValues) {
        setValue(key, itemz[key]);
      }
    }
  }, [item]);

  const setOpenz = () => {
    reset();
    setData([]);
    setFiles([]);
    setOpen(false);
  };

  const onSubmit = async (value) => {
    let params = {
      type: 2,
      detail: {
        salaryCoefficient: value.salaryCoefficient,
        mandatory: {
          bhxh: value.bhxh,
          bhyt: value.bhyt,
          bhtn: value.bhtn,
          unionDues: value.unionDues
        },
        ot: {
          day: value.day,
          sunday: value.sunday,
          holiday: value.holiday
        },
        soonLate: data,
        holidays: holidays?.map(h => databaseDate(h.date, 'date'))
      },
      note: value.note
    };
    params = handleFiles(item, params, files, 'files');
    setLoading(true);
    const res = await updateConfigSalaryApi(params);
    setLoading(false);
    if (res) {
      showToast({ title: 'Cập nhật công thức tính lương thành công', severity: 'success' });
      setOpen(false);
      reset();
    }
  };

  return (
    <Dialogz className="w-[1200px]" header="Thiết lập công thức tính lương" open={open} setOpen={setOpenz}>
      <form onSubmit={handleSubmit(onSubmit)} className="border-t border-border">
        <div className="w-full h-bodyModal overflow-scroll">
          <div className="relative w-full mt-4">
            {loading && (
              <div className="absolute w-full h-full bg-black opacity-30 z-10 flex justify-center items-center">
                <ProgressSpinnerz style={{ width: '50px', height: '50px' }} strokeWidth="4" animationDuration="1s" />
              </div>
            )}
            <div className="flex flex-wrap w-full">
              <div className="w-8/12">
                <div className="flex flex-wrap">
                  <div className="mb-4 w-full mt-4 px-2">
                    <label className="inline-block font-medium text-left">Các khoản bắt buộc</label>
                    <hr />
                  </div>
                  <InputFormz
                    type="number"
                    id="bhxh"
                    label="Bảo hiểm xã hội (% lương BHXH) (*)"
                    value={watch('bhxh')}
                    errors={errors}
                    register={register}
                    className="!w-6/12 h-full"
                  />
                  <InputFormz
                    type="number"
                    id="bhyt"
                    label="Bảo hiểm y tế (% lương BHXH) (*)"
                    value={watch('bhyt')}
                    errors={errors}
                    register={register}
                    className="!w-6/12 h-full"
                  />
                  <InputFormz
                    type="number"
                    id="bhtn"
                    label="Bảo hiểm thất nghiệp (% lương BHXH) (*)"
                    value={watch('bhtn')}
                    errors={errors}
                    register={register}
                    className="!w-6/12 h-full"
                  />
                  <InputFormz
                    type="number"
                    id="unionDues"
                    label="Phí công đoàn (% lương BHXH) (*)"
                    value={watch('unionDues')}
                    errors={errors}
                    register={register}
                    className="!w-6/12 h-full"
                  />
                </div>
              </div>
              <div className="w-4/12 flex flex-wrap">
                <div className="mb-4 w-full mt-4 px-2">
                  <label className="inline-block font-medium text-left">Quy định làm thêm giờ</label>
                  <hr />
                </div>
                <InputFormz
                  type="number"
                  id="day"
                  label="Ngày thường (% tiền lương thực theo giờ) (*)"
                  value={watch('day')}
                  errors={errors}
                  register={register}
                  className="!w-full"
                />
                <InputFormz
                  type="number"
                  id="sunday"
                  label="Chủ nhật (% tiền lương thực theo giờ) (*)"
                  value={watch('sunday')}
                  errors={errors}
                  register={register}
                  className="!w-full"
                />
                <InputFormz
                  type="number"
                  id="holiday"
                  label="Ngày lễ (% tiền lương thực theo giờ) (*)"
                  value={watch('holiday')}
                  errors={errors}
                  register={register}
                  className="!w-full"
                />
              </div>
              <div className="w-8/12 flex flex-wrap">
                <SoonLate data={data} setData={setData} />
              </div>
              <div className="w-4/12 flex flex-wrap">
                <Holidays data={holidays} setData={setHolidays} />
              </div>
            </div>
            <TextAreaz id="note" label="Mô tả" value={watch('note')} errors={errors} register={register} />
            <UploadFiles label="File đính kèm" files={files} setFiles={setFiles} />
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex gap-4 justify-end">
          <Buttonz outlined color="red" label="Trở lại" onClick={setOpenz} />
          <Buttonz label="Xác nhận" type="submit" />
        </div>
      </form>
    </Dialogz>
  );
};
