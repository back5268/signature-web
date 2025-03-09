import React from 'react';
import { FormDetail } from '@components/base';
import { Editorz, InputFormz } from '@components/core';

export const DetailLog = (props) => {
  const { open, setOpen, setParams, data } = props;
  const item = data?.find((d) => d._id === open) || {};

  return (
    <FormDetail
      title="lịch sử gửi thông báo"
      open={open}
      setOpen={() => {
        setOpen(false);
        reset();
      }}
      setParams={setParams}
    >
      <div className="flex flex-wrap w-full">
        <InputFormz id="subject" label="Tiêu đề" value={item.subject} />
        <InputFormz id="to" label="Địa chỉ nhận" value={item.to} />
        <InputFormz id="mess" label="Thông báo lỗi" value={item.mess} className="!w-full" />
        <Editorz data={item.content} label="Nội dung" />
      </div>
    </FormDetail>
  );
};
