import {
  createEmployeeApi,
  detailEmployeeApi,
  getInfoApi,
  getListAccountInfoApi,
  getListBankInfoApi,
  getListJobPositionInfoApi,
  getListPositionInfoApi,
  updateEmployeeApi
} from '@api';
import { MultiRadio, UploadFiles, UploadImage } from '@components/base';
import { Buttonz, CalendarFormz, DropdownFormz, InputFormz, ProgressSpinnerz } from '@components/core';
import { genders, graduationTypes, maritalStatus, employeeTypes, qualifications, taxAuths } from '@constant';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGetApi, usePostApi } from '@lib/react-query';
import { EmployeeValidation } from '@lib/validation';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { Contacts, Dependents } from './Persons';
import { checkEqualProp, convertNumberToString, formatNumber, handleFiles } from '@lib/helper';
import { useDataState, useToastState, useUserState } from '@store';

const defaultValues = {
  department: '',
  position: '',
  jobPosition: '',
  staffCode: '',
  fullName: '',
  email: '',
  phone: '',
  cmt: '',
  placeOfIssue: '',
  gender: 1,
  bankAccount: '',
  bank: '',
  salary: '',
  type: 1,
  maritalStatus: '',
  nationality: 'Việt Nam',
  religion: 'Không',
  address: '',
  permanentAddress: '',
  healthInsuranceNumber: '',
  socialInsuranceNumber: '',
  taxCode: '',
  taxAuth: '',
  qualification: '',
  graduationType: '',
  major: '',
  foreignLanguage: '',
  computerScience: '',
  healthStatus: '',
  pathology: '',
  numberDayoff: 0
};

const date = new Date()
export const Infos = () => {
  const navigate = useNavigate();
  const { showToast } = useToastState();
  const { userInfo, setUserInfo } = useUserState();
  const { setAccounts, departments } = useDataState();
  const { _id } = useParams();
  const isUpdate = Boolean(_id);
  const { data: item } = useGetApi(detailEmployeeApi, { _id }, 'employeez', isUpdate);
  const { data: banks } = useGetApi(getListBankInfoApi, {}, 'banks');
  const { data: positions } = useGetApi(getListPositionInfoApi, {}, 'positions');
  const { data: jobPositions } = useGetApi(getListJobPositionInfoApi, {}, 'jobPositions');
  const [avatar, setAvatar] = useState(null);
  const [cmtFiles, setCmtFiles] = useState([]);
  const [taxFiles, setTaxFiles] = useState([]);
  const [educationFiles, setEducationFiles] = useState([]);
  const [healthFiles, setHealthFiles] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [dependents, setDependents] = useState([]);
  const { mutateAsync, isPending } = usePostApi(isUpdate ? updateEmployeeApi : createEmployeeApi);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(EmployeeValidation),
    defaultValues
  });

  const getSalaryTitle = (type) => {
    let title = type === 3 ? 'Lương dịch vụ theo ngày' : 'Lương theo tháng';
    if (type === 3) title = 'Lương dịch vụ theo ngày';
    return title;
  };

  useEffect(() => {
    if (isUpdate && item) {
      setAvatar(item.avatar);
      if (item.birthday) setValue('birthday', new Date(item.birthday));
      if (item.dateOfIssue) setValue('dateOfIssue', new Date(item.dateOfIssue));
      if (item.dateIn) setValue('dateIn', new Date(item.dateIn));
      if (item.contacts) setContacts(item.contacts.map((i, index) => ({ ...i, idz: index + 1 })));
      if (item.dependents) setDependents(item.dependents.map((i, index) => ({ ...i, idz: index + 1 })));
      if (item.cmtFiles) setCmtFiles(item.cmtFiles);
      if (item.taxFiles) setTaxFiles(item.taxFiles);
      if (item.healthFiles) setHealthFiles(item.healthFiles);
      if (item.educationFiles) setEducationFiles(item.educationFiles);
      for (const key in defaultValues) {
        setValue(key, item[key]);
      }
    }
  }, [item]);

  const onSuccess = async () => {
    const accounts = await getListAccountInfoApi();
    if (accounts) setAccounts(accounts);
    if (_id === userInfo._id) {
      const response = await getInfoApi();
      if (response) setUserInfo(response);
    }
  };

  const onSubmit = async (e) => {
    let params = { ...e, contacts, dependents };
    if (isUpdate) params = { ...checkEqualProp(params, item), _id };
    else params = checkEqualProp(params, {});
    if (avatar) params.formData = { avatar };
    else if (item?.avatar) params.avatar = '';

    params = handleFiles(item, params, cmtFiles, 'cmtFiles');
    params = handleFiles(item, params, taxFiles, 'taxFiles');
    params = handleFiles(item, params, educationFiles, 'educationFiles');
    params = handleFiles(item, params, healthFiles, 'healthFiles');

    const response = await mutateAsync(params);
    if (response) {
      showToast({ title: `${isUpdate ? 'Cập nhật' : 'Thêm'} nhân viên thành công!`, severity: 'success' });
      onSuccess();
      navigate(-1);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative w-full mt-4">
        {isPending && (
          <div className="absolute w-full h-full bg-black opacity-30 z-10 flex justify-center items-center">
            <ProgressSpinnerz style={{ width: '50px', height: '50px' }} strokeWidth="4" animationDuration="1s" />
          </div>
        )}
        <Accordion multiple activeIndex={[0, 1]}>
          <AccordionTab header="Thông tin cơ bản">
            <div className="flex flex-wrap">
              <div className="w-full lg:w-4/12 px-2">
                <UploadImage label="Ảnh đại diện" data={avatar} setData={setAvatar} />
              </div>
              <div className="w-full lg:w-8/12 px-2">
                <div className="flex flex-wrap">
                  <div className="mb-4 w-full mt-6 px-2">
                    <label className="inline-block font-medium text-left">Thông tin bắt buộc</label>
                    <hr />
                  </div>
                  <InputFormz id="staffCode" label="Mã nhân viên (*)" value={watch('staffCode')} errors={errors} register={register} />
                  <InputFormz id="fullName" label="Tên Nhân viên (*)" value={watch('fullName')} errors={errors} register={register} />
                  <InputFormz id="email" label="Email (*)" value={watch('email')} errors={errors} register={register} />
                  <InputFormz id="phone" label="Số điện thoại (*)" value={watch('phone')} errors={errors} register={register} />
                  <CalendarFormz
                    id="birthday"
                    label="Ngày sinh (*)"
                    value={watch('birthday')}
                    errors={errors}
                    register={register}
                    maxDate={new Date()}
                    minDate={new Date(date.getFullYear() - 18, date.getMonth(), date.getDate())}
                  />
                  <InputFormz id="cmt" label="CMTND/CCCD/Thẻ căn cước (*)" value={watch('cmt')} errors={errors} register={register} />
                  <CalendarFormz
                    id="dateOfIssue"
                    label="Ngày Cấp CMTND/CCCD/Thẻ căn cước (*)"
                    value={watch('dateOfIssue')}
                    errors={errors}
                    register={register}
                    maxDate={new Date()}
                  />
                  <InputFormz
                    id="placeOfIssue"
                    label="Nơi cấp CMTND/CCCD/Thẻ căn cước (*)"
                    value={watch('placeOfIssue')}
                    errors={errors}
                    register={register}
                  />
                  <InputFormz id="address" label="Địa chỉ thường trú (*)" value={watch('address')} errors={errors} register={register} />
                  <div className="w-full lg:w-1/2 px-2">
                    <MultiRadio
                      id="gender"
                      label="Giới tính:"
                      options={genders}
                      value={watch('gender')}
                      setValue={(e) => setValue('gender', e)}
                      className="w-full"
                    />
                  </div>
                  <div className="mb-4 w-full mt-6 px-2">
                    <label className="inline-block font-medium text-left">Thông tin Làm việc</label>
                    <hr />
                  </div>
                  {Boolean(_id) && (
                    <InputFormz
                      type="number"
                      id="numberDayoff"
                      label="Số ngày nghỉ phép còn lại (*)"
                      value={watch('numberDayoff')}
                      errors={errors}
                      register={register}
                    />
                  )}
                  <DropdownFormz
                    id="type"
                    label="Loại nhân viên (*)"
                    options={employeeTypes}
                    value={watch('type')}
                    errors={errors}
                    onChange={(e) => setValue('type', e.target.value)}
                  />
                  <DropdownFormz
                    id="department"
                    label="Phòng ban (*)"
                    options={departments?.filter((d) => d.status)}
                    value={watch('department')}
                    errors={errors}
                    onChange={(e) => setValue('department', e.target.value)}
                    filter
                    showClear
                  />
                  <DropdownFormz
                    id="position"
                    label="Chức vụ (*)"
                    options={positions?.filter((p) => p.status)}
                    value={watch('position')}
                    errors={errors}
                    onChange={(e) => setValue('position', e.target.value)}
                    filter
                    showClear
                  />
                  <DropdownFormz
                    id="jobPosition"
                    label="Vị trí công việc (*)"
                    options={jobPositions?.filter((j) => j.status)}
                    value={watch('jobPosition')}
                    errors={errors}
                    onChange={(e) => setValue('jobPosition', e.target.value)}
                    filter
                    showClear
                  />
                  <CalendarFormz id="dateIn" label="Ngày vào (*)" value={watch('dateIn')} errors={errors} register={register} />
                  <div className="mb-4 w-full mt-6 px-2">
                    <label className="inline-block font-medium text-left">
                      Thông tin nhận lương ({getSalaryTitle(watch('type'))}) (VNĐ)
                    </label>
                    <hr />
                  </div>
                  <InputFormz
                    id="bankAccount"
                    label="Số tài khoản (*)"
                    value={watch('bankAccount')}
                    errors={errors}
                    register={register}
                    className="!w-full"
                  />
                  <DropdownFormz
                    id="bank"
                    label="Ngân hàng (*)"
                    filter
                    options={banks}
                    value={watch('bank')}
                    errors={errors}
                    onChange={(e) => setValue('bank', e.target.value)}
                    className="!w-full"
                  />
                  <InputFormz
                    min={0}
                    type="number"
                    id="salary"
                    label="Lương cơ bản (*)"
                    value={watch('salary')}
                    errors={errors}
                    register={register}
                    className="!w-full"
                    helper={watch('salary') ? convertNumberToString(watch('salary')) : ''}
                  />
                </div>
              </div>
            </div>
          </AccordionTab>
          <AccordionTab header="Thông tin thêm">
            <div className="flex flex-wrap">
              <DropdownFormz
                id="maritalStatus"
                label="Tình trạng hôn nhân"
                options={maritalStatus}
                value={watch('maritalStatus')}
                errors={errors}
                onChange={(e) => setValue('maritalStatus', e.target.value)}
              />
              <InputFormz id="nationality" label="Quốc tịch (*)" value={watch('nationality')} errors={errors} register={register} />
              <InputFormz id="religion" label="Tôn giáo" value={watch('religion')} errors={errors} register={register} />
              <InputFormz
                id="permanentAddress"
                label="Địa chỉ cư trú"
                value={watch('permanentAddress')}
                errors={errors}
                register={register}
              />
            </div>
            <UploadFiles type="image" max={2} label="Hình ảnh chứng minh thư (Tối đa 2 ảnh)" files={cmtFiles} setFiles={setCmtFiles} />
            <Contacts data={contacts} setData={setContacts} />
          </AccordionTab>
          <AccordionTab header="Thông tin bảo hiểm xã hội, thuế">
            <div className="flex flex-wrap">
              <InputFormz
                id="healthInsuranceNumber"
                label="Số bảo hiểm y tế"
                value={watch('healthInsuranceNumber')}
                errors={errors}
                register={register}
              />
              <InputFormz
                id="socialInsuranceNumber"
                label="Số bảo hiểm xã hội"
                value={watch('socialInsuranceNumber')}
                errors={errors}
                register={register}
              />
              <InputFormz id="taxCode" label="Mã số thuế" value={watch('taxCode')} errors={errors} register={register} />
              <DropdownFormz
                id="taxAuth"
                label="Ủy quyền quyết toán"
                options={taxAuths}
                value={watch('taxAuth')}
                errors={errors}
                onChange={(e) => setValue('taxAuth', e.target.value)}
              />
            </div>
            <UploadFiles max={5} label="File đính kèm bảo hiểm xã hội, thuế" files={taxFiles} setFiles={setTaxFiles} />
            <Dependents data={dependents} setData={setDependents} />
          </AccordionTab>
          <AccordionTab header="Trình độ học vấn">
            <div className="flex flex-wrap">
              <DropdownFormz
                id="qualification"
                label="Trình độ học vấn"
                options={qualifications}
                value={watch('qualification')}
                errors={errors}
                onChange={(e) => setValue('qualification', e.target.value)}
              />
              <DropdownFormz
                id="graduationType"
                label="Loại tốt nghiệp"
                options={graduationTypes}
                value={watch('graduationType')}
                errors={errors}
                onChange={(e) => setValue('graduationType', e.target.value)}
              />
              <InputFormz id="major" label="Chuyên ngành" value={watch('major')} errors={errors} register={register} />
              <InputFormz
                id="foreignLanguage"
                label="Trình độ ngoại ngữ"
                value={watch('foreignLanguage')}
                errors={errors}
                register={register}
              />
              <InputFormz
                id="computerScience"
                label="Trình độ tin học"
                value={watch('computerScience')}
                errors={errors}
                register={register}
              />
              <UploadFiles max={5} label="File đính kèm trình độ học vấn" files={educationFiles} setFiles={setEducationFiles} />
            </div>
          </AccordionTab>
          <AccordionTab header="Tình trạng sức khỏe">
            <div className="flex flex-wrap">
              <InputFormz id="healthStatus" label="Tình trạng sức khỏe" value={watch('healthStatus')} errors={errors} register={register} />
              <InputFormz id="pathology" label="Bệnh lý" value={watch('pathology')} errors={errors} register={register} />
              <UploadFiles max={5} label="File đính kèm tình trạng sức khỏe" files={healthFiles} setFiles={setHealthFiles} />
            </div>
          </AccordionTab>
        </Accordion>
      </div>
      <hr className="my-6" />
      <div className="flex gap-4 justify-end">
        <Buttonz outlined label="Trở lại" onClick={() => navigate(-1)} />
        <Buttonz loading={isPending} type="submit" label="Xác nhận" />
      </div>
    </form>
  );
};
