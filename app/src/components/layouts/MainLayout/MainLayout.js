import React from 'react';

import MainHeader from '../../headers/MainHeader';

import './MainLayout.scss';

const MainLayout = ({ children }) => {
  return (
    <>
      <MainHeader />
      <main>
        {children}
      </main>
    </>
  )
}
 
export default MainLayout;