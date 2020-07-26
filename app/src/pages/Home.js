import React, { useState } from 'react';
import styled from 'styled-components';
import { Flex, Box, Card, Heading } from 'rimble-ui';

import MainLayout from '../components/layouts';
import Wrap from '../components/Wrap';
import Unwrap from '../components/Unwrap';

const Tab = styled(Box)`
  cursor: pointer;
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.colors.primary};
`;

const Home = () => {
  const [tab, setTab] = useState('wrap');

  return (
    <MainLayout>
      <Card width={"auto"} maxWidth={"50%"} mx={"auto"} my={5} p={0}>
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
        {tab === 'wrap' ? <Wrap /> : <Unwrap />}
      </Card>
      
    </MainLayout>
  );
}
 
export default Home;
