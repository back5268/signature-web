import { ContractValidation } from '@lib/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormDetail } from '@components/base';
import { checkEqualProp } from '@lib/helper';
import { createContractApi, updateContractApi } from '@api';
import { CalendarFormz, DropdownFormz, InputFormz, TextAreaz } from '@components/core';
import { contractTypes } from '@constant';

const defaultValues = {
  code: '',
  type: '',
  note: ''
};

export const DetailContract = (props) => {
  const { open, setOpen, setParams, data = [], account } = props;
  const isUpdate = typeof open === 'string';
  const item = isUpdate ? data?.find((d) => d._id === open) : {};

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch
  } = useForm({
    resolver: yupResolver(ContractValidation),
    defaultValues
  });

  useEffect(() => {
    if (isUpdate) {
      if (item.signedDate) setValue('signedDate', new Date(item.signedDate));
      if (item.expiredDate) setValue('expiredDate', new Date(item.expiredDate));
      for (const key in defaultValues) {
        setValue(key, item[key]);
      }
    }
  }, [item]);

  const handleData = (data) => {
    const newData = { ...data, account };
    if (new Date(newData.signedDate) > new Date(newData.expiredDate)) return 'Ngày ký không thể lớn hơn ngày hết hạn!';
    if (isUpdate) return { ...checkEqualProp(newData, item), _id: open, account };
    else return newData;
  };

  return (
    <FormDetail
      title="Hợp đồng"
      open={open}
      setOpen={() => {
        setOpen(false);
        reset();
      }}
      isUpdate={isUpdate}
      handleData={handleData}
      handleSubmit={handleSubmit}
      createApi={createContractApi}
      updateApi={updateContractApi}
      setParams={setParams}
    >
      <div className="flex flex-wrap w-full">
        <InputFormz id="code" label="Số hợp đồng (*)" value={watch('code')} errors={errors} register={register} />
        <DropdownFormz
          id="type"
          label="Loại hợp đồng (*)"
          options={contractTypes}
          value={watch('type')}
          errors={errors}
          onChange={(e) => setValue('type', e.target.value)}
        />
        <CalendarFormz id="signedDate" label="Ngày ký (*)" value={watch('signedDate')} errors={errors} register={register} />
        <CalendarFormz id="expiredDate" label="Ngày hết hạn (*)" value={watch('expiredDate')} errors={errors} register={register} />
        <TextAreaz id="note" label="Ghi chú" value={watch('note')} errors={errors} register={register} />
      </div>
    </FormDetail>
  );
};
