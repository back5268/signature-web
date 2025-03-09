import { DeviceValidation } from '@lib/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormDetail } from '@components/base';
import { checkEqualProp } from '@lib/helper';
import { createDeviceApi, updateDeviceApi } from '@api';
import { DropdownFormz, InputFormz, MultiSelectFormz } from '@components/core';
import { deviceTypes } from '@constant';

const defaultValues = {
  name: '',
  code: '',
  type: 1,
  location: '',
  ipAddress: '',
  departments: []
};

export const DetailDevice = (props) => {
  const { open, setOpen, setParams, data, departments } = props;
  const isUpdate = typeof open === 'string';
  const item = isUpdate ? data.find((d) => d._id === open) : {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm({
    resolver: yupResolver(DeviceValidation),
    defaultValues
  });

  useEffect(() => {
    if (isUpdate) {
      for (const key in defaultValues) {
        setValue(key, item[key]);
      }
    }
  }, [item]);

  const handleData = (data) => {
    const newData = { ...data };
    if (isUpdate) return { ...checkEqualProp(newData, item), _id: open };
    else return newData;
  };

  return (
    <FormDetail
      title="thiết bị"
      open={open}
      setOpen={() => {
        setOpen(false);
        reset();
      }}
      isUpdate={isUpdate}
      handleData={handleData}
      handleSubmit={handleSubmit}
      createApi={createDeviceApi}
      updateApi={updateDeviceApi}
      setParams={setParams}
    >
      <div className="flex flex-wrap w-full">
        <InputFormz id="name" label="Tên thiết bị (*)" value={watch('name')} errors={errors} register={register} />
        <InputFormz id="code" label="Mã thiết bị (*)" value={watch('code')} errors={errors} register={register} />
        <DropdownFormz
          id="type"
          label="Loại thiết bị (*)"
          options={deviceTypes}
          value={watch('type')}
          errors={errors}
          onChange={(e) => setValue('type', e.target.value)}
        />
        <InputFormz id="location" label="Vị trí" value={watch('location')} errors={errors} register={register} />
        <InputFormz id="ipAddress" label="Địa chỉ IP" value={watch('ipAddress')} errors={errors} register={register} />
        <MultiSelectFormz
          id="departments"
          label="Phòng ban áp dụng"
          options={departments}
          value={watch('departments')}
          errors={errors}
          onChange={(e) => setValue('departments', e.target.value)}
          filter
        />
      </div>
    </FormDetail>
  );
};
