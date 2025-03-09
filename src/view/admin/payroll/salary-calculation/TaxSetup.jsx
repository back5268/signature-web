import { getConfigApi, updateConfigSalaryApi } from '@api';
import { UploadFiles } from '@components/base';
import { Buttonz, Dialogz, InputFormz, ProgressSpinnerz, TextAreaz } from '@components/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetApi } from '@lib/react-query';
import { TaxSetupValidation } from '@lib/validation';
import { useToastState } from '@store';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Taxs } from './Component';
import { convertNumberToString, handleFiles } from '@lib/helper';

const defaultValues = {
  self: '',
  dependent: '',
  note: ''
};
export const TaxSetup = (props) => {
  const { open, setOpen } = props;
  const { showToast } = useToastState();
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const { data: item } = useGetApi(getConfigApi, { type: 3, render: open }, 'tax-setup');
  const [data, setData] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(TaxSetupValidation)
  });

  useEffect(() => {
    if (item) {
      if (item.files) setFiles(item.files);
      if (item.taxs) setData(item.taxs.map((i, index) => ({ ...i, idz: index + 1 })));
      for (const key in defaultValues) {
        setValue(key, item[key]);
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
      type: 3,
      detail: {
        self: value.self,
        dependent: value.dependent,
        taxs: data
      },
      note: value.note
    };
    params = handleFiles(item, params, files, 'files');
    setLoading(true);
    const res = await updateConfigSalaryApi(params);
    setLoading(false);
    if (res) {
      showToast({ title: 'Cập nhật công thức tính thuế thành công', severity: 'success' });
      setOpen(false);
      reset();
    }
  };

  return (
    <Dialogz className="w-[1200px]" header="Thiết lập công thức tính thuế" open={open} setOpen={setOpenz}>
      <form onSubmit={handleSubmit(onSubmit)} className="border-t border-border">
        <div className="w-full h-bodyModal overflow-scroll">
          <div className="relative w-full mt-4">
            {loading && (
              <div className="absolute w-full h-full bg-black opacity-30 z-10 flex justify-center items-center">
                <ProgressSpinnerz style={{ width: '50px', height: '50px' }} strokeWidth="4" animationDuration="1s" />
              </div>
            )}
            <div className="flex flex-wrap w-full">
              <InputFormz
                type="number"
                id="self"
                label="Giảm trừ bản thân (*)"
                value={watch('self')}
                errors={errors}
                register={register}
                helper={watch('self') ? convertNumberToString(watch('self')) : ''}
              />
              <InputFormz
                type="number"
                id="dependent"
                label="Giảm trừ phụ thuộc (*)"
                value={watch('dependent')}
                errors={errors}
                register={register}
                helper={watch('dependent') ? convertNumberToString(watch('dependent')) : ''}
              />
              <Taxs data={data} setData={setData} />
              <TextAreaz id="note" label="Mô tả" value={watch('note')} errors={errors} register={register} />
              <UploadFiles label="File đính kèm" files={files} setFiles={setFiles} />
            </div>
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
