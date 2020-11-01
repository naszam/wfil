import React from 'react';
import styled from 'styled-components';

import TransactionToastUtil from '../../../utilities/TransactionToastUtil';
import RimbleWeb3 from '../../../utilities/RimbleWeb3';
import MainHeader from '../../headers/MainHeader';

const MainContainer = styled.div`
  padding-top: 2%;
`;

const MainLayout = ({ children }) => {
  return (
    <RimbleWeb3.Consumer>
      {(rimbleProps) => (
        <>
          <MainHeader {...rimbleProps} />
          <MainContainer>
            {React.Children.map(children, (child) => React.cloneElement(child, rimbleProps))}
          </MainContainer>
          <TransactionToastUtil transactions={rimbleProps.transactions} />
        </>
      )}
    </RimbleWeb3.Consumer>
  )
};

export default MainLayout;
