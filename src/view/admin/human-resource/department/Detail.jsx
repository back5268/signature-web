import { DepartmentValidation } from '@lib/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormDetail } from '@components/base';
import { checkEqualProp } from '@lib/helper';
import { createDepartmentApi, getListDepartmentInfoApi, updateDepartmentApi } from '@api';
import { InputFormz, TextAreaz } from '@components/core';
import { useDataState } from '@store';

const defaultValues = {
  name: '',
  code: '',
  description: ''
};

export const DetailDepartment = (props) => {
  const { open, setOpen, setParams, data } = props;
  const isUpdate = typeof open === 'string';
  const item = isUpdate ? data.find((d) => d._id === open) : {};
  const { setDepartments } = useDataState();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm({
    resolver: yupResolver(DepartmentValidation),
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

  const onSuccess = async () => {
    const response = await getListDepartmentInfoApi();
    if (response) setDepartments(response);
  };

  return (
    <FormDetail
      title="phòng ban"
      open={open}
      setOpen={() => {
        setOpen(false);
        reset();
      }}
      isUpdate={isUpdate}
      handleData={handleData}
      handleSubmit={handleSubmit}
      createApi={createDepartmentApi}
      updateApi={updateDepartmentApi}
      setParams={setParams}
      onSuccess={onSuccess}
    >
      <div className="flex flex-wrap w-full">
        <InputFormz id="name" label="Tên phòng ban (*)" value={watch('name')} errors={errors} register={register} />
        <InputFormz id="code" label="Mã phòng ban (*)" value={watch('code')} errors={errors} register={register} />
        <TextAreaz id="description" label="Mô tả" value={watch('description')} errors={errors} register={register} />
      </div>
    </FormDetail>
  );
};
