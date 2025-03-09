import { Buttonz, Columnz, Inputz, Tablez } from '@components/core';
import { relations } from '@constant';
import { TrashIcon } from '@heroicons/react/24/outline';
import { databaseDate } from '@lib/helper';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

export const Contacts = (props) => {
  const { data = [], setData = () => {} } = props;

  const onChange = (item, field, value) => {
    if (item && field) {
      setData((pre) =>
        pre.map((p) => {
          if (p.idz === item.idz) {
            const obj = p;
            obj[field] = value;
            return obj;
          } else return { ...p };
        })
      );
    }
  };

  return (
    <div className="card mx-2 mt-4">
      <div className="flex justify-between mb-4 items-center">
        <label className="inline-block font-medium text-left">Liên hệ trong trường hợp khẩn cấp</label>
        <Buttonz
          onClick={() =>
            setData((pre) => [...pre, { idz: (Number(data[data?.length - 1]?.idz) || 0) + 1, fullName: '', phone: '', address: '' }])
          }
          label="Thêm người liên hệ"
        />
      </div>
      <Tablez
        value={data}
        totalRecords={data?.length}
        rows={100}
        rowsPerPageOptions={[100]}
        params={{ page: 1, limit: 100 }}
        dataKey="idz"
        emptyMessage="."
        paginatorTemplate="CurrentPageReport"
      >
        <Columnz header="#" body={(data, options) => options.rowIndex + 1} />
        <Columnz
          header="Họ tên"
          body={(item) => (
            <InputText value={item.fullName} onChange={(e) => onChange(item, 'fullName', e.target.value)} className="w-full" />
          )}
        />
        <Columnz
          header="Số điện thoại"
          body={(item) => (
            <InputText type="number" value={item.phone} onChange={(e) => onChange(item, 'phone', e.target.value)} className="w-full" />
          )}
        />
        <Columnz
          header="Địa chỉ"
          body={(item) => <InputText value={item.address} onChange={(e) => onChange(item, 'address', e.target.value)} className="w-full" />}
        />
        <Columnz
          header="Quan hệ"
          headerStyle={{ minWidth: '10rem' }}
          bodyStyle={{ minWidth: '10rem' }}
          body={(item) => (
            <Dropdown
              value={item.relation}
              onChange={(e) => onChange(item, 'relation', e.target.value)}
              options={relations}
              optionLabel="name"
              optionValue="_id"
              className="w-full"
            />
          )}
        />
        <Columnz
          header="Thao tác"
          body={(item) => (
            <div className="w-full flex justify-center">
              <Buttonz
                severity="danger"
                outlined
                onClick={() => setData((pre) => pre.filter((p) => p.idz !== item.idz))}
                className="!p-0 h-10 w-10 flex justify-center items-center rounded-full"
                icon={<TrashIcon className="w-5" />}
              />
            </div>
          )}
        />
      </Tablez>
    </div>
  );
};

export const Dependents = (props) => {
  const { data = [], setData = () => {} } = props;

  const onChange = (item, field, value) => {
    if (item && field) {
      setData((pre) =>
        pre.map((p) => {
          if (p.idz === item.idz) {
            const obj = p;
            obj[field] = value;
            return obj;
          } else return { ...p };
        })
      );
    }
  };

  return (
    <div className="card mx-2 mt-4">
      <div className="flex justify-between mb-4 items-center">
        <label className="inline-block font-medium text-left">Thông tin người phụ thuộc</label>
        <Buttonz
          onClick={() =>
            setData((pre) => [...pre, { idz: (Number(data[data?.length - 1]?.idz) || 0) + 1, fullName: '', cmt: '', phone: '' }])
          }
          label="Thêm người phụ thuộc"
        />
      </div>
      <Tablez
        value={data}
        totalRecords={data?.length}
        rows={100}
        rowsPerPageOptions={[100]}
        params={{ page: 1, limit: 100 }}
        dataKey="idz"
        emptyMessage="."
        paginatorTemplate="CurrentPageReport"
      >
        <Columnz header="#" body={(data, options) => options.rowIndex + 1} />
        <Columnz
          header="Họ tên"
          body={(item) => (
            <InputText value={item.fullName} onChange={(e) => onChange(item, 'fullName', e.target.value)} className="w-full" />
          )}
        />
        <Columnz
          header="Mã số thuế"
          body={(item) => <InputText value={item.taxCode} onChange={(e) => onChange(item, 'taxCode', e.target.value)} className="w-full" />}
        />
        <Columnz
          header="Số điện thoại"
          body={(item) => (
            <InputText type="number" value={item.phone} onChange={(e) => onChange(item, 'phone', e.target.value)} className="w-full" />
          )}
        />
        <Columnz
          header="Ngày sinh"
          body={(item) => (
            <Calendar value={new Date(item.birthday)} onChange={(e) => onChange(item, 'birthday', databaseDate(e.target.value, 'date'))} className="w-full" />
          )}
        />
        <Columnz
          header="CMTND/CCCD/Thẻ căn cước"
          body={(item) => (
            <InputText type="number" value={item.cmt} onChange={(e) => onChange(item, 'cmt', databaseDate(e.target.value, 'date'))} className="w-full" />
          )}
        />
        <Columnz
          header="Thời điểm bắt đầu tính giảm trừ"
          body={(item) => (
            <Calendar value={new Date(item.start)} onChange={(e) => onChange(item, 'start', databaseDate(e.target.value, 'date'))} className="w-full" />
          )}
        />
        <Columnz
          header="Thời điểm kết thúc tính giảm trừ"
          body={(item) => (
            <Calendar value={new Date(item.end)} onChange={(e) => onChange(item, 'end', e.target.value)} className="w-full" />
          )}
        />
        <Columnz
          header="Quan hệ với người nộp thuế"
          headerStyle={{ minWidth: '10rem' }}
          bodyStyle={{ minWidth: '10rem' }}
          body={(item) => (
            <Dropdown
              value={item.relation}
              onChange={(e) => onChange(item, 'relation', e.target.value)}
              options={relations}
              optionLabel="name"
              optionValue="_id"
              className="w-full"
            />
          )}
        />
        <Columnz
          header="Thao tác"
          body={(item) => (
            <div className="w-full flex justify-center">
              <Buttonz
                severity="danger"
                outlined
                onClick={() => setData((pre) => pre.filter((p) => p.idz !== item.idz))}
                className="!p-0 h-10 w-10 flex justify-center items-center rounded-full"
                icon={<TrashIcon className="w-5" />}
              />
            </div>
          )}
        />
      </Tablez>
    </div>
  );
};
