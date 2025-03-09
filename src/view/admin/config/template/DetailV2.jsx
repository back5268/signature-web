import { TemplateValidation } from '@lib/validation';
import { yupResolver } from '@hookform/resolvers/yup';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormDetail } from '@components/base';
import { checkEqualProp } from '@lib/helper';
import { createTemplateApi, detailTemplateWebApi, updateTemplateApi } from '@api';
import { Editorz, InputFormz } from '@components/core';
import { useParams } from 'react-router-dom';
import { useGetApi } from '@lib/react-query';

const defaultValues = {
  title: '',
  content: ''
};

export const DetailTemplate = (props) => {
  const { slug } = useParams();
  const [infos, setInfos] = useState({});
  const { isLoading, data: item } = useGetApi(detailTemplateWebApi, { slug }, 'templatez');
  return <Editorz data={item?.content} setData={(e) => setInfos(pre => ({ ...pre, content: e }))} />;
};
