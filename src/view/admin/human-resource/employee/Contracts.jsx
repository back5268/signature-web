import { cancelContractApi, deleteContractApi, downloadContractApi, getListContractApi, previewContractApi } from '@api';
import { Body, DataFilter, TimeBody, UserBody } from '@components/base';
import { Buttonz, Columnz, Dropdownzz, Tablez } from '@components/core';
import { useGetApi } from '@lib/react-query';
import React, { useState } from 'react';
import { DetailContract } from './DetailContract';
import { contractStatus, contractTypes } from '@constant';
import { useParams } from 'react-router-dom';
import { ArrowDownTrayIcon, DocumentMagnifyingGlassIcon, PrinterIcon, TrashIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { confirmDialog } from 'primereact/confirmdialog';
import { useToastState } from '@store';
import { Print } from './Print';

export const Contracts = () => {
  const { _id } = useParams();
  const { showToast } = useToastState();
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useState({});
  const [filter, setFilter] = useState({});
  const [open, setOpen] = useState(false);
  const [openPrint, setOpenPrint] = useState(false);
  const { isLoading, data } = useGetApi(
    getListContractApi,
    { ...params, page: undefined, limit: undefined, account: _id },
    'contract',
    Boolean(_id)
  );

  const onDelete = (item) => {
    confirmDialog({
      message: 'Bạn có chắc chắn muốn xóa hợp đồng này!',
      header: 'HRZ',
      icon: 'pi pi-info-circle',
      accept: async () => {
        const response = await deleteContractApi({ account: _id, _id: item._id });
        if (response) {
          setParams((pre) => ({ ...pre, render: !pre.render }));
          showToast({ title: 'Xóa hợp đồng thành công!', severity: 'success' });
        }
      }
    });
  };

  const onCancle = (item) => {
    confirmDialog({
      message: 'Bạn có chắc chắn muốn kết thúc hợp đồng này!',
      header: 'HRZ',
      icon: 'pi pi-info-circle',
      accept: async () => {
        const response = await cancelContractApi({ account: _id, _id: item._id });
        if (response) {
          setParams((pre) => ({ ...pre, render: !pre.render }));
          showToast({ title: 'Kết thúc hợp đồng thành công!', severity: 'success' });
        }
      }
    });
  };

  const onViewPrint = async (item) => {
    setLoading(true)
    const response = await previewContractApi({ account: _id, _id: item._id });
    setLoading(false)
    if (response) setOpenPrint({ _id: item._id, template: response });
  };

  return (
    <div>
      <DetailContract open={open} setOpen={setOpen} setParams={setParams} data={data} account={_id} />
      <Print open={openPrint} setOpen={setOpenPrint} account={_id} />
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-6/12">
        <Dropdownzz
          value={filter.type}
          onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          options={contractTypes}
          label="Loại hợp đồng"
        />
        <Dropdownzz
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          options={contractStatus}
          label="Trạng thái"
        />
      </DataFilter>
      <Tablez
        header={
          <div className="flex gap-2 justify-start mb-1">
            <Buttonz onClick={() => setOpen(true)}>Thêm mới</Buttonz>
          </div>
        }
        loading={isLoading || loading}
        value={data}
        totalRecords={data?.length}
        rows={100}
        rowsPerPageOptions={[100]}
        params={{ page: 1, limit: 100 }}
        dataKey="_id"
        emptyMessage="Không tìm thấy hợp đồng của nhân viên"
        paginatorTemplate="CurrentPageReport"
      >
        <Columnz header="#" body={(data, options) => options.rowIndex + 1} />
        <Columnz header="Số hợp đồng" field="code" />
        <Columnz header="Loại hợp đồng" body={(e) => Body(contractTypes, e.type)} />
        <Columnz header="Ngày ký" body={(e) => TimeBody(e.signedDate, 'date')} />
        <Columnz header="Ngày hết hạn" body={(e) => TimeBody(e.expiredDate, 'date')} />
        <Columnz header="Thời gian cập nhật" body={(e) => UserBody(e.updatedAt, e.updatedBy || e.by)} />
        <Columnz header="Trạng thái" body={(e) => Body(contractStatus, e.status)} />
        <Columnz
          header="Hành động"
          body={(e) => (
            <div className="flex justify-center items-center gap-2">
              {e.status !== 4 && (
                <Buttonz
                  severity="danger"
                  outlined
                  onClick={() => onCancle(e)}
                  className="!p-0 h-10 w-10 flex justify-center items-center !rounded-full"
                  icon={<XMarkIcon className="w-5" />}
                />
              )}
              <Buttonz
                onClick={() => onViewPrint(e)}
                outlined
                className="!p-0 h-10 w-10 flex justify-center items-center !rounded-full"
                icon={<PrinterIcon className="w-5" />}
              />
              <Buttonz
                onClick={async () => {
                  setLoading(true)
                  const response = await downloadContractApi({ account: _id, _id: e._id });
                  setLoading(false)
                  if (response) window.open(response, '_blank');
                }}
                outlined
                className="!p-0 h-10 w-10 flex justify-center items-center !rounded-full"
                icon={<ArrowDownTrayIcon className="w-5" />}
              />
            </div>
          )}
        />
        <Columnz
          header="Thao tác"
          body={(e) => (
            <div className="flex justify-center items-center gap-2">
              <Buttonz
                onClick={() => setOpen(e._id)}
                outlined
                className="!p-0 h-10 w-10 flex justify-center items-center !rounded-full"
                icon={<DocumentMagnifyingGlassIcon className="w-6" />}
              />
              <Buttonz
                severity="danger"
                outlined
                onClick={() => onDelete(e)}
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
