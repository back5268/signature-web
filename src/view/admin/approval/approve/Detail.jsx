import { updateApplicationApi } from '@api';
import { Body, UploadFiles } from '@components/base';
import { Buttonz, Dialogz, DropdownFormz, InputFormz, Inputzz } from '@components/core';
import { applicationTypes } from '@constant';
import { formatDate } from '@lib/helper';
import { useToastState } from '@store';
import React, { useState } from 'react';

export const DetailApprove = (props) => {
  const { open, setOpen, data, shifts, setParams, departments = [], accounts } = props;
  const { showToast } = useToastState();
  const [note, setNote] = useState('');
  const isUpdate = typeof open === 'string';
  const item = isUpdate ? data?.find((d) => d._id === open) || {} : {};

  const onSubmit = async (status) => {
    const res = await updateApplicationApi({ status, note, _id: open });
    if (res) {
      showToast({ title: status === 2 ? 'Phê duyệt thành công!' : 'Từ chối thành công!', severity: 'success' });
      setParams((pre) => ({ ...pre, render: !pre.render }));
      setNote('');
      setOpen(false);
    }
  };

  const setOpenz = () => {
    setNote('');
    setOpen(false);
  };

  return (
    <Dialogz className="w-[1200px]" header="Chi tiết đơn từ" open={open} setOpen={() => setOpenz()}>
      <div className="border-t border-border">
        <div className="w-full max-h-[1200px] overflow-scroll">
          <div className="relative w-full mt-4">
            <div className="flex flex-wrap w-full">
              <InputFormz label="Phòng ban (*)" value={Body(departments, item.department)} disabled />
              <InputFormz label="Nhân viên (*)" value={Body(accounts, item.account, '_id', 'fullName')} disabled />
              <DropdownFormz label="Ca làm việc (*)" options={shifts} value={item.shift} disabled />
              <DropdownFormz label="Loại đơn (*)" options={applicationTypes} value={item.type} disabled />
              <InputFormz label="Ngày bắt đầu (*)" value={formatDate(item.dates?.[0], 'date')} disabled />
              <InputFormz label="Ngày kết thúc (*)" value={formatDate(item.dates?.[item.dates?.length - 1], 'date')} disabled />
              <Inputzz label="Lý do xin nghỉ" value={item.reason} className="!w-full" />
              <Inputzz label="Ghi chú" value={note} onChange={(e) => setNote(e.target.value)} className="!w-full" />
              <UploadFiles label="File đính kèm" files={item.files} isView />
            </div>
          </div>
        </div>
        <hr className="my-4" />
        <div className="flex gap-4 justify-end">
          <Buttonz outlined color="red" label="Trờ lại" onClick={() => setOpenz()} />
          {item.status === 1 && (
            <>
              <Buttonz label="Từ chối" onClick={() => onSubmit(3)} severity="danger" />
              <Buttonz label="Xác nhận duyệt" onClick={() => onSubmit(2)} />
            </>
          )}
        </div>
      </div>
    </Dialogz>
  );
};
