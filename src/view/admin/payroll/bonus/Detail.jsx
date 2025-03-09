import { BonusValidation } from '@lib/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormDetail } from '@components/base';
import { checkEqualProp } from '@lib/helper';
import { createBonusApi, updateBonusApi } from '@api';
import { DropdownFormz, InputFormz, MultiSelectFormz } from '@components/core';

const defaultValues = {
  name: '',
  month: '',
  departments: [],
  accounts: [],
  value: ''
};

export const DetailBonus = (props) => {
  const { open, setOpen, setParams, data, departments, accounts, months } = props;
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
    resolver: yupResolver(BonusValidation),
    defaultValues
  });

  useEffect(() => {
    if (isUpdate) {
      for (const key in defaultValues) {
        setValue(key, Number(item[key]) || item[key]);
      }
    }
  }, [item]);

  const handleData = (data) => {
    const newData = { ...data };
    if (data.type === 1 && data.value > 100) return 'Khoản thưởng theo % lương cơ bản giá trị không thể lớn hơn 100!';
    if (isUpdate) return { ...checkEqualProp(newData, item), _id: open };
    else return newData;
  };

  return (
    <FormDetail
      title="khoản thưởng"
      open={open}
      setOpen={() => {
        setOpen(false);
        reset();
      }}
      isUpdate={isUpdate}
      handleData={handleData}
      handleSubmit={handleSubmit}
      createApi={createBonusApi}
      updateApi={updateBonusApi}
      setParams={setParams}
    >
      <div className="flex flex-wrap w-full">
        <InputFormz id="name" label="Tiêu đề (*)" value={watch('name')} errors={errors} register={register} />
        <DropdownFormz
          label="Tháng áp dụng (*)"
          options={months}
          value={watch('month')}
          errors={errors}
          onChange={(e) => setValue('month', e.target.value)}
          filter
        />
        <InputFormz min={0} type="number" id="value" label="Giá trị (*)" value={watch('value')} errors={errors} register={register} />
        <MultiSelectFormz
          label="Phòng ban áp dụng (*)"
          options={departments}
          value={watch('departments')}
          errors={errors}
          onChange={(e) => {
            setValue('departments', e.target.value);
            setValue('accounts', []);
          }}
          filter
        />
        <MultiSelectFormz
          label="Nhân viên áp dụng (*)"
          options={watch('departments') ? accounts?.filter((a) => watch('departments')?.includes(a.department)) : []}
          value={watch('accounts')}
          optionLabel="fullName"
          errors={errors}
          onChange={(e) => setValue('accounts', e.target.value)}
          filter
        />
      </div>
    </FormDetail>
  );
};
