import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Flex, Box, MetaMaskButton, Text, Pill, EthAddress } from 'rimble-ui';

import { ReactComponent as Logo } from '../../Icon/logo.svg';

import contract from '../../../contracts/WFIL.json';

const { abi } = contract;
const CONTRACT_ADDRESS = process.env.REACT_APP_WFIL_CONTRACT_ADDRESS;

const AppLink = styled(Link)`
  text-decoration: none;
`

const HeaderBg = styled.div`
  background-color: ${props => props.theme.colors.primary};
`;

const MainHeader = ({ connectAndValidateAccount, initContract, account }) => {
  useEffect(() => {
    initContract(CONTRACT_ADDRESS, abi).then(() => {
      console.log("MainHeader -> CONTRACT_ADDRESS", CONTRACT_ADDRESS)
    });
  }, [initContract])

  const handleConnectAccount = () => {
    connectAndValidateAccount(result => {
      if (result === "success") {
        // success
        console.log("Callback SUCCESS");
      } else if (result === "error") {
        // error
        console.log("Callback ERROR");
      }
    })
  }

  return (
    <HeaderBg>
      <Flex>
        <Box p={3} width={1 / 2}>
          <Flex alignItems="center" justifyContent="flex-start">
            <Box>
              <AppLink to="/">
                <Flex alignItems="center" justifyContent="flex-start">
                    <Box>
                      <Logo style={{ width: '30px', height: '30px' }} />
                    </Box>
                    <Box>
                      <Text ml={1} color="white" fontFamily="sansSerif">WFIL</Text>
                    </Box>
                </Flex>
              </AppLink>
            </Box>
            <Box ml={4}>
              <AppLink to="/wallet">
                <Text ml={1} color="white" fontFamily="sansSerif">Wallet</Text>
              </AppLink>
            </Box>
          </Flex>
        </Box>
        <Box p={3} width={1 / 2} textAlign="right">
          {account
            ? (
              <Pill color="green">
                <Text fontFamily="sansSerif" fontSize={1}>Connected: {account}</Text>
              </Pill>
            )
            : (
              <MetaMaskButton.Outline size="small" onClick={handleConnectAccount}>Connect with MetaMask</MetaMaskButton.Outline>
            )
          }
        </Box>
      </Flex>
    </HeaderBg>
  )
}
 
export default MainHeader;