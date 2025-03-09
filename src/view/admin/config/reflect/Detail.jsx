import { createReflectApi, detailJobPositionApi } from '@api';
import { FormDetail, UploadFiles } from '@components/base';
import { TextAreaz } from '@components/core';
import { checkEqualProp, handleFiles } from '@lib/helper';
import { useGetApi } from '@lib/react-query';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';

const defaultValues = {
  content: '',
  image: ''
};

export const DetailReflect = () => {
  const { _id } = useParams();
  const [images, setImages] = useState([])
  const isUpdate = Boolean(_id);
  const { data: item } = useGetApi(detailJobPositionApi, { _id }, 'job-positionz', isUpdate);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm({
    defaultValues
  });

  useEffect(() => {
    if (isUpdate && item) {
      for (const key in defaultValues) {
        setValue(key, item[key]);
      }
    }
  }, [item]);

  const handleData = (data) => {
    let newData = { ...data };
    newData = handleFiles(item, newData, images, 'images');
    if (isUpdate) return { ...checkEqualProp(newData, item), _id };
    else return newData;
  };

  return (
    <div className="flex justify-center">
      <div className="max-w-[1200px] flex justify-center">
        <FormDetail
          type="nomal"
          title="phản ánh"
          isUpdate={isUpdate}
          createApi={createReflectApi}
          handleData={handleData}
          handleSubmit={handleSubmit}
        >
          <div className="flex flex-wrap w-full">
            <TextAreaz id="content" label="Nội dung" value={watch('content')} errors={errors} register={register} className="!w-full lg:min-w-[600px]" />
            <UploadFiles type="image" max={5} label="File đính kèm" files={images} setFiles={setImages} />
          </div>
        </FormDetail>
      </div>
    </div>
  );
};
