import React from 'react';
import Loading from './Loading';
import Modal from './Modal';
import Navbar from './Navbar';

import Notify from './Notify'
const Layout = ({children}) => {
  return (
      <div className='container position-relative'>
          <Navbar/>
          <Notify/>
          <Modal/>
          {children}
      </div>
  );
};

export default Layout;
