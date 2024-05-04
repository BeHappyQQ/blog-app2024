import React, { useEffect, useState } from 'react';

import { Button } from 'antd';

import styles from '../CreateArticle/CreateArticle.module.scss';
import { useRouteMatch } from 'react-router-dom';

import { ArticlesApi } from '../../api/articlesApi';

const apiUser = new ArticlesApi();
const FormComponent = ({ count, onSave, form, editedArticle }) => {
  const [inputValue, setInputValue] = useState({});
  const [addedInput, setAddedInput] = useState([0]);
  const routeMath = useRouteMatch('/articles/:id');

  const [isEdit, setIsEdit] = useState(false);
  const [oldArticle, setOldArticle] = useState({});

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
  } = form;

  useEffect(() => {
    if (!editedArticle || !routeMath) {
      setIsEdit(false);
      setOldArticle(null);
      setAddedInput([0]);
    } else {
      apiUser.getAnArticle(routeMath.params.id).then((res) => {
        setOldArticle(res.article);
        setIsEdit(true);
        res.article.tagList.forEach((_, i) => {
          setAddedInput((prev) => [...prev, ++i]);
        });
        count.current = res.article.tagList.length;
      });
    }
  }, [editedArticle]);
  const handleAdd = () => {
    count.current++;
    setAddedInput((prev) => [...prev, count.current]);
  };

  const onDeleteTag = (id) => {
    const deleteTagFilter = addedInput.filter((item) => item !== id);
    setAddedInput(deleteTagFilter);
    delete inputValue[id];
  };

  const handleChange = (event) => {
    const value = event.target.value;
    const id = event.target.getAttribute('id');

    setInputValue((prev) => ({
      ...prev,
      [id]: value,
    }));
  };
  return (
    <div className={styles.new_article}>
      <form onSubmit={handleSubmit((data) => onSave(data, inputValue))}>
        <span>{isEdit ? 'Edit article' : 'Create new articlet'} </span>
        <label htmlFor="title">
          Title
          <input
            id="title"
            placeholder="Title"
            defaultValue={isEdit ? oldArticle.title : ''}
            className={(!isValid && errors?.title?.message && styles.not_valid) || ''}
            {...register('title', {
              required: 'Поле обязательно к заполнению',
            })}
          />
        </label>
        <div className={styles.errors}>{errors?.title && <p>{errors?.title?.message}</p>}</div>

        <label htmlFor="description">
          Short description
          <input
            id="description"
            defaultValue={isEdit ? oldArticle.description : ''}
            type="text"
            placeholder="Title"
            className={(!isValid && errors?.description?.message && styles.not_valid) || ''}
            {...register('description', {
              required: 'Поле обязательно к заполнению',
            })}
          />
        </label>
        <div className={styles.errors}>
          {errors?.description && <p>{errors?.description?.message}</p>}
        </div>

        <label htmlFor="body">
          Text
          <textarea
            id="body"
            type="text"
            placeholder="Text"
            defaultValue={isEdit ? oldArticle.body : ''}
            className={(!isValid && errors?.body?.message && styles.not_valid) || ''}
            {...register('body', {
              required: 'Поле обязательно к заполнению',
            })}
            style={{ minHeight: 168 }}
          />
        </label>
        <div className={styles.errors}>{errors?.body && <p>{errors?.body?.message}</p>}</div>

        <label htmlFor="tags">
          Tags
          <div className={styles.tags}>
            <div className={styles.added_elements}>
              {addedInput.map((inputCount, i) => {
                const addButton =
                  addedInput[addedInput.length - 1] === inputCount ? (
                    <Button onClick={handleAdd} className={styles.tags_button_add}>
                      Add Tag
                    </Button>
                  ) : null;

                const checkIsShow = addedInput.length === 1 ? null : addButton;
                const deleteButton =
                  addedInput.length > 1 || checkIsShow ? (
                    <Button onClick={() => onDeleteTag(inputCount)} danger>
                      Delete
                    </Button>
                  ) : null;

                const oldinputValue =
                  isEdit && oldArticle && oldArticle.tagList[inputCount]
                    ? oldArticle.tagList[inputCount]
                    : '';
                return (
                  <div key={inputCount}>
                    <input
                      defaultValue={oldinputValue}
                      onChange={handleChange}
                      id={inputCount}
                      type="text"
                      placeholder="Tag"
                    />
                    {deleteButton}
                    {addButton}
                  </div>
                );
              })}
            </div>
          </div>
        </label>

        <input className={styles.input_submit} value="Send" type="submit" disabled={!isValid} />
      </form>
    </div>
  );
};
export default FormComponent;
