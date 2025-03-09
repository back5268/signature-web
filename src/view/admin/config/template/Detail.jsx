import { TemplateValidation } from '@lib/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormDetail } from '@components/base';
import { checkEqualProp } from '@lib/helper';
import { createTemplateApi, updateTemplateApi } from '@api';
import { Editorz, InputFormz } from '@components/core';

const defaultValues = {
  title: '',
  content: ''
};

export const DetailTemplate = (props) => {
  const { open, setOpen, setParams, data } = props;
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
    resolver: yupResolver(TemplateValidation),
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
      title="mẫu"
      open={open}
      setOpen={() => {
        setOpen(false);
        reset();
      }}
      isUpdate={isUpdate}
      handleData={handleData}
      handleSubmit={handleSubmit}
      updateApi={updateTemplateApi}
      createApi={createTemplateApi}
      setParams={setParams}
    >
      <div className="flex flex-wrap w-full">
        <InputFormz className="!w-full" id="title" label="Tiêu đề (*)" value={watch('title')} errors={errors} register={register} />
        <Editorz data={watch('content')} setData={(e) => setValue('content', e)} label="Nội dung" />
      </div>
    </FormDetail>
  );
};
