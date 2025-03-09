import { PositionValidation } from '@lib/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormDetail } from '@components/base';
import { checkEqualProp } from '@lib/helper';
import { createPositionApi, detailPositionApi, updatePositionApi } from '@api';
import { InputFormz, TextAreaz } from '@components/core';
import { useParams } from 'react-router-dom';
import { useGetApi } from '@lib/react-query';
import { Allowances } from './Allowances';

const defaultValues = {
  name: '',
  code: '',
  description: ''
};

export const DetailPosition = () => {
  const { _id } = useParams();
  const [allowances, setAllowances] = useState([]);
  const isUpdate = Boolean(_id);
  const { data: item } = useGetApi(detailPositionApi, { _id }, 'positionz', isUpdate);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(PositionValidation),
    defaultValues
  });

  useEffect(() => {
    if (isUpdate && item) {
      if (item.allowances) setAllowances(item.allowances.map((i, index) => ({ ...i, idz: index + 1 })));
      for (const key in defaultValues) {
        setValue(key, item[key]);
      }
    }
  }, [item]);

  const handleData = (data) => {
    const newData = { ...data, allowances };
    if (isUpdate) return { ...checkEqualProp(newData, item), _id };
    else return newData;
  };

  return (
    <FormDetail
      type="nomal"
      title="chức vụ"
      isUpdate={isUpdate}
      createApi={createPositionApi}
      updateApi={updatePositionApi}
      handleData={handleData}
      handleSubmit={handleSubmit}
    >
      <div className="flex flex-wrap w-full">
        <InputFormz id="name" label="Tên chức vụ (*)" value={watch('name')} errors={errors} register={register} />
        <InputFormz id="code" label="Mã chức vụ (*)" value={watch('code')} errors={errors} register={register} />
        <TextAreaz id="description" label="Mô tả" value={watch('description')} errors={errors} register={register} />
        <Allowances data={allowances} setData={setAllowances} />
      </div>
    </FormDetail>
  );
};
