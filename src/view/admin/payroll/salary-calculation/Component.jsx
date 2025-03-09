import { NumberBody, TimeBody } from '@components/base';
import { Buttonz, Calendarzz, Columnz, Dropdownzz, Inputzz, Tablez } from '@components/core';
import { soonLateTypes } from '@constant';
import { TrashIcon } from '@heroicons/react/24/outline';
import React from 'react';

export const SoonLate = ({ data = {}, setData = () => {} }) => {
  const onChange = (field, value, idz) => {
    setData((pre) =>
      pre.map((p) => {
        if (p.idz === idz) p[field] = value;
        return p;
      })
    );
  };

  return (
    <div className="w-full my-4">
      <div className="p-2">
        <div className="flex justify-between items-center">
          <label className="inline-block font-medium text-left mb-2">Quy định phạt đi trễ/ về sớm</label>
          <Buttonz
            onClick={() => setData((pre) => [...pre, { idz: (pre[pre.length - 1]?.idz || 1) + 1, type: 1 }])}
            variant="outlined"
            label="Thêm mới"
            className="mb-2"
          />
        </div>
        <hr />
      </div>
      {data.map((datum, index) => (
        <div key={index} className="w-full flex flex-wrap items-center">
          <div className="w-full md:w-6/12 lg:w-[10%] p-2 flex justify-center">
            <Buttonz
              onClick={() => setData((pre) => pre.filter((p) => p.idz !== datum.idz))}
              severity="danger"
              outlined
              className="!p-0 h-10 w-10 flex justify-center items-center !rounded-full"
              icon={<TrashIcon className="w-5" />}
            />
          </div>
          <Inputzz
            min="0"
            type="number"
            label="Từ (Phút) (*)"
            value={datum.from}
            onChange={(e) => onChange('from', e.target.value, datum.idz)}
            className="w-full md:w-6/12 lg:w-[20%]"
          />
          <Inputzz
            min="1"
            type="number"
            label="Đến (Phút) (*)"
            value={datum.to}
            onChange={(e) => onChange('to', e.target.value, datum.idz)}
            className="w-full md:w-6/12 lg:w-[20%]"
          />
          <Inputzz
            min="1"
            type="number"
            label="Giá trị phạt (*)"
            value={datum.value}
            onChange={(e) => onChange('value', e.target.value, datum.idz)}
            className="w-full md:w-6/12 lg:w-[20%]"
          />
          <Dropdownzz
            value={datum.type}
            onChange={(e) => onChange('type', e.target.value, datum.idz)}
            options={soonLateTypes}
            label="Loại phạt"
            className="w-full md:w-6/12 lg:w-[30%]"
          />
        </div>
      ))}
    </div>
  );
};

export const Taxs = ({ data = {}, setData = () => {} }) => {
  const onChange = (field, value, idz) => {
    setData((pre) =>
      pre.map((p) => {
        if (p.idz === idz) p[field] = value;
        return p;
      })
    );
  };

  return (
    <div className="w-full my-4">
      <div className="p-2">
        <div className="flex justify-between items-center">
          <label className="inline-block font-medium text-left mb-2">Thuế suất</label>
          <Buttonz
            onClick={() => setData((pre) => [...pre, { idz: (pre[pre.length - 1]?.idz || 1) + 1 }])}
            variant="outlined"
            label="Thêm mới"
            className="mb-2"
          />
        </div>
        <hr />
      </div>
      {data.map((datum, index) => (
        <div key={index} className="w-full flex flex-wrap items-center">
          <div className="w-full md:w-6/12 lg:w-[10%] p-2 flex justify-center">
            <Buttonz
              onClick={() => setData((pre) => pre.filter((p) => p.idz !== datum.idz))}
              severity="danger"
              outlined
              className="!p-0 h-10 w-10 flex justify-center items-center !rounded-full"
              icon={<TrashIcon className="w-5" />}
            />
          </div>
          <Inputzz
            min="0"
            type="number"
            label="Từ (triệu VNĐ) (*)"
            value={datum.from}
            onChange={(e) => onChange('from', e.target.value, datum.idz)}
            className="w-full md:w-6/12 lg:w-[20%]"
          />
          <Inputzz
            min="1"
            type="number"
            label="Đến (triệu VNĐ) (*)"
            value={datum.to}
            onChange={(e) => onChange('to', e.target.value, datum.idz)}
            className="w-full md:w-6/12 lg:w-[20%]"
          />
          <Inputzz
            min="1"
            type="number"
            label="Thuế suất (%) (*)"
            value={datum.value}
            onChange={(e) => onChange('value', e.target.value, datum.idz)}
            className="w-full md:w-6/12 lg:w-[20%]"
          />
          <Inputzz
            label="Ghi chú"
            value={datum.note}
            onChange={(e) => onChange('note', e.target.value, datum.idz)}
            className="w-full md:w-6/12 lg:w-[30%]"
          />
        </div>
      ))}
    </div>
  );
};

export const Accounts = ({ data = {}, setData = () => {} }) => {
  return (
    <div className="w-full my-4">
      <Tablez
        value={data}
        totalRecords={data?.length}
        rows={100}
        rowsPerPageOptions={[100]}
        params={{ page: 1, limit: 100 }}
        dataKey="_id"
        emptyMessage="."
        paginatorTemplate="CurrentPageReport"
      >
        <Columnz header="#" body={(data, options) => options.rowIndex + 1} />
        <Columnz header="Tên nhân viên" field="fullName" />
        <Columnz header="Mã nhân viên" field="staffCode" />
        <Columnz header="Ngày vào" body={(e) => TimeBody(e.dateIn, 'date')} />
        <Columnz header="Lương cơ bản" body={(e) => NumberBody(e.salary)} />
        <Columnz
          header="Thao tác"
          body={(item) => (
            <div className="w-full flex justify-center">
              <Buttonz
                severity="danger"
                outlined
                onClick={() => setData(data.filter((d) => d._id !== item._id)?.map((d) => d._id))}
                className="!p-0 h-10 w-10 flex justify-center items-center !rounded-full"
                icon={<TrashIcon className="w-5" />}
              />
            </div>
          )}
        />
      </Tablez>
    </div>
  );
};

export const Holidays = ({ data = {}, setData = () => {} }) => {
  const onChange = (field, value, idz) => {
    setData((pre) =>
      pre.map((p) => {
        if (p.idz === idz) p[field] = value;
        return p;
      })
    );
  };

  return (
    <div className="w-full my-4">
      <div className="p-2">
        <div className="flex justify-between items-center">
          <label className="inline-block font-medium text-left mb-2">Danh sách ngày lễ</label>
          <Buttonz
            onClick={() => setData((pre) => [...pre, { idz: (pre[pre.length - 1]?.idz || 1) + 1 }])}
            label="Thêm mới"
            className="mb-2"
          />
        </div>
        <hr />
      </div>
      {data.map((datum, index) => (
        <div key={index} className="w-full flex flex-wrap items-center">
          <div className="!w-2/12 p-2 flex justify-center">
            <Buttonz
              onClick={() => setData((pre) => pre.filter((p) => p.idz !== datum.idz))}
              severity="danger"
              outlined
              className="!p-0 h-10 w-10 flex justify-center items-center !rounded-full"
              icon={<TrashIcon className="w-5" />}
            />
          </div>
          <Calendarzz
            hideOnRangeSelection
            label="Ngày (*)"
            value={datum.date}
            onChange={(e) => onChange('date', e.target.value, datum.idz)}
            className="!w-10/12"
          />
        </div>
      ))}
    </div>
  );
};
