import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex, Box, Card, Heading, Text } from 'rimble-ui';

import MainLayout from '../components/layouts';
import Wrap from '../components/Wrap';
import Unwrap from '../components/Unwrap';
import RimbleWeb3 from '../utilities/RimbleWeb3';

const Tab = styled(Box)`
  cursor: pointer;
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.primary};
`;

const Home = () => {
  const [tab, setTab] = useState('wrap');

  return (
    <MainLayout>
      <Flex justifyContent="center">
        <Text mt="10px" fontFamily="sansSerif" fontSize={1}>Wrapped Filecoin is currently in beta. Please don't use main-net FIL on this project.</Text>
      </Flex>
      <Card width={"auto"} maxWidth={['98%', '50%']} mx={"auto"} my={5} p={0}>
        <Flex>
          <Tab
            p={3}
            width={1 / 2}
            color={tab === 'wrap' ? 'white' : 'primary'}
            bg={tab === 'wrap' ? 'primary' : 'white'}
            onClick={() => setTab('wrap')}
          >
            <Heading as="h3" fontFamily="sansSerif">WRAP</Heading>
          </Tab>
          <Tab
            p={3}
            width={1 / 2}
            color={tab === 'unwrap' ? 'white' : 'primary'}
            bg={tab === 'unwrap' ? 'primary' : 'white'}
            onClick={() => setTab('unwrap')}
          >
            <Heading as="h3" fontFamily="sansSerif">UNWRAP</Heading>
          </Tab>
        </Flex>
        <RimbleWeb3.Consumer>
          {(rimbleProps) => (tab === 'wrap' ? <Wrap /> : <Unwrap {...rimbleProps} />)}
        </RimbleWeb3.Consumer>
      </Card>
      
    </MainLayout>
  );
}
 
export default Home;
