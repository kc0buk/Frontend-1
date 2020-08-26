import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';
import { useAPI } from '../../../hooks/useAPI';
import { useSelector, useDispatch } from 'react-redux';
import {
  ADD_EVENT_START,
  ADD_EVENT_SUCCESS,
  ADD_EVENT_ERROR,
} from '../../../state/reducers/eventsReducer';

import RenderCreateNewEventPage from './RenderCreateNewEventPage';

const initialFormValues = {
  date: '',
  event_title: '',
  address_one: '',
  address_two: '',
  city: '',
  state: '',
  zip: '',
  contact_phone: '',
  start_time: '',
  end_time: '',
  special_instructions: '',
};

const CreateNewEvent = () => {
  const userState = useSelector(state => state.userReducer);
  const eventsState = useSelector(state => state.eventsReducer);
  const history = useHistory();
  const [values, handleChanges, resetForm] = useForm(initialFormValues);
  const dispatch = useDispatch();
  const [data, moveData, error] = useAPI({
    method: 'post',
    url: '/event',
    data: {
      ...values,
      user_id: userState.user.id,
    },
  });
  console.log(userState.user.id);
  const postEvent = () => {
    dispatch({ type: ADD_EVENT_START });
    moveData()
      .then(res => {
        console.log(res);
        dispatch({
          type: ADD_EVENT_SUCCESS,
          payload: res,
        });
        resetForm();
        history.push('/new-event/step-two');
      })
      .catch(err => {
        console.log(err);
        dispatch({ type: ADD_EVENT_ERROR, payload: err });
      });
  };

  const submit = e => {
    e.preventDefault();
    postEvent();
  };

  return (
    <RenderCreateNewEventPage
      values={values}
      handleChanges={handleChanges}
      loading={eventsState.loading}
      submit={submit}
    />
  );
};

export default CreateNewEvent;
