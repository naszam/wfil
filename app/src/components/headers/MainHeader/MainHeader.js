import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Flex, Box, MetaMaskButton, Text, Pill } from 'rimble-ui';

import { ReactComponent as Logo } from '../../Icon/logo.svg';
import { reqNetwork } from '../../../services/web3';

const AppLink = styled(Link)`
  text-decoration: none;
`;

const SubHeader = styled(Flex)`
  box-shadow: 5px 0 5px 0 ${({ theme }) => theme.colors.primary};
`
const colorStatus = (network) => {
  if (!network) return '';
  if (network.isCorrectNetwork) return 'primary';
  return 'warning';
}
const NetworkMessage = styled(Box)`
  background-color: ${({ network, theme }) => theme.colors[colorStatus(network)]};
  color: ${({ theme }) => theme.colors.white};
  text-align:center;
  transition: margin-top 0.3s;
  margin-top: ${({ showNetwork }) => showNetwork ? '0' : '-30px'};
`;

let timeoutHandler;
const TIMEOUT_SHOW_NETWORK = 4000;

const MainHeader = ({ account }) => {
  const [showNetwork, setShowNetwork] = useState(false);
  const { network, totalSupply } = useSelector(state => state.web3)

  useEffect(() => {
    if (network) {
      setShowNetwork(true);
      if (network.isCorrectNetwork) {
        timeoutHandler = setTimeout(() => setShowNetwork(false), TIMEOUT_SHOW_NETWORK);
      }
    }
    return () => timeoutHandler && clearTimeout(timeoutHandler);
  }, [network])

  return (
    <>
      <div>
        <Flex alignItems="center">
          <Box p={1} width={1 / 3}>
            <AppLink to="/">
              <Box>
                <Logo style={{ width: '60px', height: '60px' }} />
              </Box>
            </AppLink>
          </Box>
          <NetworkMessage p={1} width={1 / 3} alignSelf="flex-start" showNetwork={showNetwork} network={network}>
            <Text fontFamily="sansSerif" fontSize={1}>
              {network && network.isCorrectNetwork 
                ? <>Successfully connected to {reqNetwork.name}</>
                : <>Please connect to {reqNetwork.name}</>
              }
            </Text>
          </NetworkMessage>
          <Box p={3} width={1 / 3} textAlign="right">
            {account
              ? (
                <Pill color="green">
                  <Text fontFamily="sansSerif" fontSize={1}>Connected: {account}</Text>
                </Pill>
              )
              : (
                <MetaMaskButton.Outline size="small" onClick={() => {}}>Connect with MetaMask</MetaMaskButton.Outline>
              )
            }
          </Box>
        </Flex>
      </div>
      <SubHeader justifyContent="space-between">
        <Box  p={2} width={1 / 2} textAlign="left">
          {totalSupply > 0 && <Text color="primary" fontFamily="sansSerif" fontSize={1}>Total Supply: {totalSupply} WFIL</Text>}
        </Box>
        <Box  p={2} width={1 / 2} textAlign="right">
          <Text color="primary" fontFamily="sansSerif" fontSize={1}>Current networks: Calibration - Rinkeby</Text>
        </Box>
      </SubHeader>
    </>
  )
}
 
export default MainHeader;