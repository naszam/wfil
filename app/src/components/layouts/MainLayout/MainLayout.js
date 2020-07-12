import React from 'react';

import MainHeader from '../../headers/MainHeader';

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