import {
  deleteEmployeeApi,
  getListAccountInfoApi,
  getListJobPositionInfoApi,
  getListEmployeeApi,
  getListPositionInfoApi,
  resetPasswordApi,
  updateEmployeeApi
} from '@api';
import { DataTable, FormList, DataFilter } from '@components/base';
import { Buttonz, Columnz, Dialogz, Dropdownzz, Inputzz } from '@components/core';
import { status } from '@constant';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { useGetParams } from '@hooks';
import { useGetApi } from '@lib/react-query';
import { useDataState, useToastState } from '@store';
import { confirmDialog } from 'primereact/confirmdialog';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
export * from './Detail';

export const Employee = () => {
  const navigate = useNavigate();
  const initParams = useGetParams();
  const { showToast } = useToastState();
  const [params, setParams] = useState(initParams);
  const { setAccounts, departments } = useDataState();
  const [filter, setFilter] = useState({});
  const { isLoading, data } = useGetApi(getListEmployeeApi, params, 'employee');
  const { data: positions } = useGetApi(getListPositionInfoApi, {}, 'positions');
  const { data: jobPositions } = useGetApi(getListJobPositionInfoApi, {}, 'jobPositions');
  const [password, setPassword] = useState(null);

  const onSuccess = async () => {
    const response = await getListAccountInfoApi();
    if (response) setAccounts(response);
  };

  const onResetPassword = (item) => {
    confirmDialog({
      message: `Bạn có chắc chắn muốn đổi mật khẩu nhân viên ${item.fullName}`,
      header: 'HRZ',
      icon: 'pi pi-info-circle',
      accept: async () => {
        const response = await resetPasswordApi({ _id: item._id });
        if (response) {
          showToast({ title: 'Đổi mật khẩu thành công!', severity: 'success' });
          setPassword(response);
        }
      }
    });
  };

  return (
    <FormList title="Danh sách nhân viên">
      <Dialogz header="HRZ" open={Boolean(password)} setOpen={setPassword} position="center" width="500px">
        <div className="p-6 text-left">
          Đổi mật khẩu thành công, mật khẩu mới là <b>{password}</b>
        </div>
        <hr />
        <div className="flex gap-4 justify-end mt-4">
          <Buttonz label="Xác nhận" onClick={async () => setPassword(false)} />
        </div>
      </Dialogz>
      <DataFilter setParams={setParams} filter={filter} setFilter={setFilter} className="lg:w-6/12">
        <Inputzz
          value={filter.keySearch}
          onChange={(e) => setFilter({ ...filter, keySearch: e.target.value })}
          label="Tìm kiếm theo tên, mã nhân viên"
        />
        <Inputzz
          value={filter.email}
          onChange={(e) => setFilter({ ...filter, email: e.target.value })}
          label="Tìm kiếm theo số điện thoại, email"
        />
        <Dropdownzz
          value={filter.department}
          onChange={(e) => setFilter({ ...filter, department: e.target.value })}
          options={departments}
          label="Phòng ban"
          showClear
          filter
        />
        <Dropdownzz
          value={filter.position}
          onChange={(e) => setFilter({ ...filter, position: e.target.value })}
          options={positions}
          label="Chức vụ"
          showClear
          filter
        />
        <Dropdownzz
          value={filter.jobPosition}
          onChange={(e) => setFilter({ ...filter, jobPosition: e.target.value })}
          options={jobPositions}
          label="Vị trí công việc"
          showClear
          filter
        />
        <Dropdownzz
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          options={status}
          label="Trạng thái"
          showClear
        />
      </DataFilter>
      <DataTable
        title="Nhân viên"
        loading={isLoading}
        data={data?.documents}
        total={data?.total}
        params={params}
        setParams={setParams}
        baseActions={['create', 'detail']}
        actionsInfo={{
          onViewDetail: (item) => navigate(`/employee/detail/${item._id}`),
          deleteApi: deleteEmployeeApi,
          moreActions: [
            {
              icon: ArrowPathIcon,
              onClick: (item) => onResetPassword(item)
            }
          ]
        }}
        statusInfo={{ changeStatusApi: updateEmployeeApi }}
        headerInfo={{
          onCreate: () => {
            navigate('/employee/create');
          }
        }}
        onSuccess={onSuccess}
      >
        <Columnz header="Tên nhân viên" field="fullName" />
        <Columnz header="Mã nhân viên" field="staffCode" />
        <Columnz header="Email" field="email" />
        <Columnz header="Số điện thoại" field="phone" />
        <Columnz header="Phòng ban" field="department.name" />
        <Columnz header="Chức vụ" field="position.name" />
        <Columnz header="Vị trí làm việc" field="jobPosition.name" />
      </DataTable>
    </FormList>
  );
};
