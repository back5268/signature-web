import React, { useState } from 'react';
import { detailTemplateWebApi } from '@api';
import { EditorV2 } from '@components/core';
import { useParams } from 'react-router-dom';
import { useGetApi } from '@lib/react-query';

export const DetailTemplate = () => {
  const { slug } = useParams();
  const [infos, setInfos] = useState({});
  const { data: item } = useGetApi(detailTemplateWebApi, { slug }, 'templatez');
  return <div className='w-full flex justify-center'>
    <EditorV2 data={item?.content} setData={(e) => setInfos(pre => ({ ...pre, content: e }))} slug={slug} />
  </div>
};
