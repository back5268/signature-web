import React, { useState } from 'react';
import { detailTemplateWebApi } from '@api';
import { EditorV2 } from '@components/core';
import { useParams } from 'react-router-dom';
import { useGetApi } from '@lib/react-query';
import moment from 'moment';

export const DetailTemplate = () => {
  const { slug } = useParams();
  const [infos, setInfos] = useState({});
  const { data: item } = useGetApi(detailTemplateWebApi, { slug }, 'templatez');
  const today = moment();

  return (
    <div className="w-full flex justify-center">
      <div className='max-w-[1200px]'>
      <EditorV2
        data={item?.content
          ?.replace('$date', today.format('DD'))
          ?.replace('$month', today.format('MM'))
          ?.replace('$year', today.format('YYYY'))}
        setData={(e) => setInfos((pre) => ({ ...pre, content: e }))}
        slug={slug}
      />
      </div>
    </div>
  );
};
