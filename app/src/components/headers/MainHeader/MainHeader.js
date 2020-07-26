import React from 'react';
import styled from 'styled-components';
import { Flex, Box, MetaMaskButton } from 'rimble-ui';

import { ReactComponent as Logo } from '../../Icon/logo.svg';

const HeaderBg = styled.div`
  background-color: ${props => props.theme.colors.primary};
`;

const MainHeader = () => {
  return (
    <HeaderBg>
      <Flex>
        <Box p={3} width={1 / 2}>
          <Logo style={{ width: '45px', height: '45px' }} />
        </Box>
        <Box p={3} width={1 / 2} textAlign="right">
          <MetaMaskButton.Outline>Connect with MetaMask</MetaMaskButton.Outline>
        </Box>
      </Flex>
    </HeaderBg>
  )
}
 
export default MainHeader;