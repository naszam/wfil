import React from 'react';
import styled from 'styled-components';
import { Loader } from 'rimble-ui';

const CenteredLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Loading = () => {
  return (
    <CenteredLoading><Loader color="primary" size="80px"/></CenteredLoading>
  )
}
 
export default Loading;