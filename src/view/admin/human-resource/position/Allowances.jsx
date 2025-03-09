import { Buttonz, CheckBoxz, Columnz, Tablez } from '@components/core';
import { allowanceTypes } from '@constant';
import { TrashIcon } from '@heroicons/react/24/outline';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

export const Allowances = (props) => {
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
    <div className="card w-full mx-2 mt-4">
      <div className="flex justify-between mb-4 items-center">
        <label className="inline-block font-medium text-left">Các khoản trợ cấp</label>
        <Buttonz
          onClick={() =>
            setData((pre) => [...pre, { idz: (Number(data[data?.length - 1]?.idz) || 0) + 1, name: '', amount: '', type: 1, isTax: true }])
          }
          label="Thêm Khoản trợ cấp"
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
          header="Tên trợ cấp"
          body={(item) => <InputText value={item.name} onChange={(e) => onChange(item, 'name', e.target.value)} className="w-full" />}
        />
        <Columnz
          header="Giá trị trợ cấp (VNĐ)"
          body={(item) => (
            <InputText type="number" value={item.amount} onChange={(e) => onChange(item, 'amount', e.target.value)} className="w-full" />
          )}
        />
        <Columnz
          header="Loại trợ cấp"
          headerStyle={{ minWidth: '10rem' }}
          bodyStyle={{ minWidth: '10rem' }}
          body={(item) => (
            <Dropdown
              value={item.type}
              onChange={(e) => onChange(item, 'type', e.target.value)}
              options={allowanceTypes}
              optionLabel="name"
              optionValue="_id"
              className="w-full"
            />
          )}
        />
        <Columnz
          header="Trạng thái tính thuế"
          headerStyle={{ minWidth: '10rem' }}
          bodyStyle={{ minWidth: '10rem' }}
          body={(item) => (
            <CheckBoxz
              checked={item.isTax}
              onChange={() => {
                if (item.isTax) onChange(item, 'isTax', false);
                else onChange(item, 'isTax', true);
              }}
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
