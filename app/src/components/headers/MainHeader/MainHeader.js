import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Flex, Box, MetaMaskButton, Text, Pill } from 'rimble-ui';

import { ReactComponent as Logo } from '../../Icon/logo.svg';
import { requiredNetwork, userConnect } from '../../../services/web3';

const AppLink = styled(Link)`
  text-decoration: none;
`;

const UpperHeader = styled.div`
  position: relative;
`;

const BottomHeader = styled(Flex)`
  box-shadow: 5px 0 5px 0 ${({ theme }) => theme.colors.primary};
`
const colorStatus = (network) => {
  if (!network) return '';
  if (network.isCorrectNetwork) return 'primary';
  return 'warning';
}
const NetworkMessage = styled(Box)`
  position: absolute;
  top: ${({ showNetwork }) => showNetwork ? '0' : '-30px'};
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ network, theme }) => theme.colors[colorStatus(network)]};
  color: ${({ theme }) => theme.colors.white};
  text-align:center;
  transition: top 0.3s;
`;

let timeoutHandler;
const TIMEOUT_SHOW_NETWORK = 4000;

const MainHeader = () => {
  const [showNetwork, setShowNetwork] = useState(false);
  const { network, totalSupply, account, userBalance } = useSelector(state => state.web3)

  useEffect(() => {
    if (network) {
      setShowNetwork(true);
      if (network.isCorrectNetwork) {
        timeoutHandler = setTimeout(() => setShowNetwork(false), TIMEOUT_SHOW_NETWORK);
      }
    }
    return () => timeoutHandler && clearTimeout(timeoutHandler);
  }, [network]);

  const displayAccount = account ? `${account.slice(0,6)}...${account.slice(-4)}` : ''; 

  return (
    <>
      <UpperHeader>
        <NetworkMessage py={1} px={2} showNetwork={showNetwork} network={network}>
          <Text fontFamily="sansSerif" fontSize={1}>
            {network && network.isCorrectNetwork 
              ? <>Successfully connected to {requiredNetwork.name}</>
              : <>Please connect to {requiredNetwork.name}</>
            }
          </Text>
        </NetworkMessage>
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
                  <Text fontFamily="sansSerif" fontSize={1}>Connected: {displayAccount}</Text>
                </Pill>
              )
              : (
                <MetaMaskButton.Outline size="small" onClick={userConnect}>Connect with MetaMask</MetaMaskButton.Outline>
              )
            }
          </Box>
        </Flex>
      </UpperHeader>
      <BottomHeader justifyContent="space-between">
        <Box  p={2} width={1 / 2} textAlign="left">
          <Text color="primary" fontFamily="sansSerif" fontSize={1}>Total Supply: {totalSupply} WFIL</Text>
          <Text color="primary" fontFamily="sansSerif" fontSize={1}>Your Balance: {userBalance} WFIL</Text>
        </Box>
        <Box  p={2} width={1 / 2} textAlign="right">
          <Text color="primary" fontFamily="sansSerif" fontSize={1}>Current networks: Calibration - Rinkeby</Text>
        </Box>
      </BottomHeader>
    </>
  )
}
 
export default MainHeader;