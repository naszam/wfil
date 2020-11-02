import React, { useState, useEffect } from 'react';
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

const SubHeader = styled(Flex)`
  box-shadow: 5px 0 5px 0 ${({ theme }) => theme.colors.primary};
`

const MainHeader = ({ connectAndValidateAccount, initContract, account, tokenBalance }) => {
  const [wfilTotalSupply, setWfilTotalSupply] = useState(0);
  useEffect(() => {
    initContract(CONTRACT_ADDRESS, abi).then(() => {
      tokenBalance((totalSupply) => {
        console.log("MainHeader -> totalSupply", totalSupply)
        setWfilTotalSupply(totalSupply);
      });
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
    <>
      <HeaderBg>
        <Flex alignItems="center">
          <Box p={1} width={1 / 2}>
            <AppLink to="/">
              <Box>
                <Logo style={{ width: '60px', height: '60px' }} />
              </Box>
            </AppLink>
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
      <SubHeader justifyContent="space-between">
        <Box  p={2} width={1 / 2} textAlign="left">
          {wfilTotalSupply > 0 && <Text color="primary" fontFamily="sansSerif" fontSize={1}>Total Supply: {wfilTotalSupply} WFIL</Text>}
        </Box>
        <Box  p={2} width={1 / 2} textAlign="right">
          <Text color="primary" fontFamily="sansSerif" fontSize={1}>Current networks: Calibration - Rinkeby</Text>
        </Box>
      </SubHeader>
    </>
  )
}
 
export default MainHeader;