import React from 'react';
import { detailResponseApi } from '@api';
import { useParams } from 'react-router-dom';
import { useGetApi } from '@lib/react-query';

export const DetailResponse = () => {
  const { _id } = useParams();
  const { data: item } = useGetApi(detailResponseApi, { _id }, 'responsez');
  return (
    <div className="w-full flex justify-center">
      <div dangerouslySetInnerHTML={{ __html: item?.content }} />
    </div>
  );
};
