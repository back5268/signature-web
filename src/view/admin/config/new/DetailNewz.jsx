import { createNewApi, detailNewApi, updateNewApi } from '@api';
import { FormDetail, UploadFiles, UploadImage } from '@components/base';
import { Editorz, InputFormz, MultiSelectFormz, TextAreaz } from '@components/core';
import { yupResolver } from '@hookform/resolvers/yup';
import { checkEqualProp, handleFiles } from '@lib/helper';
import { useGetApi } from '@lib/react-query';
import { NewValidation } from '@lib/validation';
import { useDataState } from '@store';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

const defaultValues = {
  subject: '',
  content: '',
  description: '',
  departments: []
};

export const DetailNewz = () => {
  const { _id } = useParams();
  const isUpdate = Boolean(_id);
  const { data: item } = useGetApi(detailNewApi, { _id }, 'newz', isUpdate);
  const { departments } = useDataState();
  const [files, setFiles] = useState([]);
  const [avatar, setAvatar] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(NewValidation),
    defaultValues
  });

  useEffect(() => {
    if (isUpdate && item) {
      setAvatar(item.avatar);
      if (item.files) setFiles(item.files);
      for (const key in defaultValues) {
        setValue(key, item[key]);
      }
    }
  }, [item]);

  const handleData = (data) => {
    let params = { ...data };
    if (avatar) params.formData = { avatar };
    else if (item?.avatar) params.avatar = '';
    params = handleFiles(item, params, files, 'files');
    if (isUpdate) return { ...checkEqualProp(params, item), _id };
    else return params;
  };

  return (
    <FormDetail
      type="nomal"
      title="tin tức"
      isUpdate={isUpdate}
      createApi={createNewApi}
      updateApi={updateNewApi}
      handleData={handleData}
      handleSubmit={handleSubmit}
    >
      <div className="flex flex-wrap w-full">
        <div className="w-full lg:w-4/12">
          <UploadImage label="Ảnh đại diện" data={avatar} setData={setAvatar} />
        </div>
        <div className="w-full lg:w-8/12 px-2">
          <InputFormz id="subject" label="Tiêu đề (*)" value={watch('subject')} errors={errors} register={register} className="!w-full" />
          <MultiSelectFormz
            id="departments"
            label="Phòng ban hiển thị"
            options={departments}
            value={watch('departments')}
            errors={errors}
            onChange={(e) => setValue('departments', e.target.value)}
            filter
            className="!w-full"
          />
          <TextAreaz id="description" label="Mô tả" value={watch('description')} errors={errors} register={register} />
        </div>
        <UploadFiles max={5} label="File đính kèm" files={files} setFiles={setFiles} />
        <Editorz data={watch('content')} setData={(e) => setValue('content', e)} label="Nội dung" />
      </div>
    </FormDetail>
  );
};
