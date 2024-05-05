import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';

import { useHistory } from 'react-router-dom';
import { ArticlesApi } from '../../api/articlesApi';

import FormComponent from '../FormComponent';
import { useRouteMatch } from 'react-router-dom';

const apiUser = new ArticlesApi();

const CreateArticle = ({ setNewArticle, editedArticle, setIsNeedArticlesRequest }) => {
  const count = useRef(0);
  const history = useHistory();
  const routeMath = useRouteMatch('/articles/:id');

  const form = useForm({
    mode: 'onChange',
  });

const onSave = async (data, inputValue) => {
  const requestData = {
    ...data,
    tagList: Object.values(inputValue),
  };
  try {
    let res;
    if (!editedArticle) {
      if (!requestData.title) {
        throw new Error('Title is required');
      }
      res = await apiUser.createAnArticle(requestData)
      .then((res) => {
        if (res) {
          setIsNeedArticlesRequest(true)
          history.push('/articles/');
        }
      });

    } else {
      res = await apiUser.updateAnArticle(requestData, routeMath?.params?.id);
      if (res) {
        setIsNeedArticlesRequest(true)
        history.push('/articles/');
      }
    }
    if (!res) {
      throw new Error('Failed to create/update article');
    }
  } catch (err) {
    form.setError('title', {
      type: 'title',
      message: err.message,
    });
  }
};

  return <FormComponent count={count} form={form} onSave={onSave} editedArticle={editedArticle} />;
};

export default CreateArticle;
