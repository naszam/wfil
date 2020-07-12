import React from 'react';
import styled from 'styled-components';

const CenteredLoading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
`;

const Loading = () => {
  return (
    <CenteredLoading>Loading...</CenteredLoading>
  )
}
 
export default Loading;