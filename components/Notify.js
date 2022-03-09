import React,{useContext, useState} from 'react';
import { DataContext } from '../store/GlobalState';
import Loading from './Loading';
import ToastDemo from './Toast';

const Notify = () => {
  const {state,dispatch} = useContext(DataContext);
  const {notify} = state;
 
  return (
      <>
        {
          notify.loading && <Loading/>
        }
        {
          notify.title==='Error' && <ToastDemo title={notify.title} message={notify.error} state={state.notify} bgColor={'bg-danger'}/>
        }
        {
          notify.title==='Success' && <ToastDemo title={notify.title} message={notify.success} state={state.notify} bgColor={'bg-success'}/>
        }
      </>
  );
};

export default Notify;
