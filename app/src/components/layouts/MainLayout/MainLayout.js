import React from 'react';

import TransactionToastUtil from '../../../utilities/TransactionToastUtil';
import RimbleWeb3 from '../../../utilities/RimbleWeb3';
import MainHeader from '../../headers/MainHeader';

const MainLayout = ({ children }) => {
  return (
    <RimbleWeb3.Consumer>
      {(rimbleProps) => (
        <>
          <MainHeader {...rimbleProps} />
          <main>
            {React.Children.map(children, (child) => React.cloneElement(child, rimbleProps))}
          </main>
          <TransactionToastUtil transactions={rimbleProps.transactions} />
        </>
      )}
    </RimbleWeb3.Consumer>
  )
};

export default MainLayout;
